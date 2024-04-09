require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({origin: '*' }));

app.use(express.static('images'));

app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`running on ${PORT}`));

