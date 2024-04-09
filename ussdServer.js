const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to SQLite database
const db = new sqlite3.Database(':memory:');

// Create users table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, index_no TEXT, phone_number TEXT)");
});

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, 'secret_key', { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'secret_key');
  } catch (err) {
    return null;
  }
};

app.use(bodyParser.urlencoded({ extended: false }));

// USSD endpoint
app.post('/ussd', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = '';

  // Check if text contains USSD code only
  if (text === '') {
    response = 'Enter your index number:';
  } else {
    // Validate input format
    const input = text.trim().split('*');
    const ussdCode = input[0];
    const indexNo = input[1];

    if (ussdCode !== '123') {
      response = 'Invalid USSD code. Please try again.';
    } else if (!indexNo) {
      response = 'Please enter your index number.';
    } else {
      // Check database for index number and retrieve results
      db.get("SELECT * FROM users WHERE index_no = ?", [indexNo], (err, row) => {
        if (err) {
          console.error(err.message);
          response = 'An error occurred. Please try again later.';
        } else if (!row) {
          response = 'No results found for the provided index number.';
        } else {
          const token = generateToken({ indexNo, phoneNumber });
          response = `Your results: ${JSON.stringify(row)}. Token: ${token}`;
        }
        res.send(response);
      });
      return;
    }
  }

  // Send response to the user
  res.send(response);
});

app.listen(PORT, () => console.log(`USSD Server running on port ${PORT}`));
