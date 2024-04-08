const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Secret key for JWT
const secretKey = 'your-secret-key';

// Example user data (replace with your database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Refresh tokens storage (replace with your database)
const refreshTokens = [];

// Generate a JWT token
function generateAccessToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '15m' });
}

// Generate a refresh token
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, secretKey);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken({ id: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

  // Set the refresh token as a cookie
  res.cookie('refreshToken', refreshToken, { httpOnly: true });

  res.json({ accessToken });
});

// Refresh token route
app.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken({ id: user.id, username: user.username });

    res.json({ accessToken });
  });
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route access granted' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
