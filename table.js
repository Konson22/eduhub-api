
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database("./database.db", sqlite.OPEN_READWRITE, err => err && console.log(err));

// const sql = `CREATE TABLE results(
//     id INTEGER PRIMARY KEY, 
//     state TEXT NOT NULL,
//     county TEXT NOT NULL,
//     centerIndex TEXT NOT NULL,
//     studentName TEXT NOT NULL,
//     studentIndex TEXT NOT NULL,
//     schoolName TEXT NOT NULL,
//     section TEXT NOT NULL,
//     eng INTEGER,
//     arabic INTEGER,
//     math INTEGER,
//     cre INTEGER,
//     islamic INTEGER,
//     physic INTEGER,
//     chemistry INTEGER,
//     biology INTEGER,
//     milaterySci INTEGER,
//     history INTEGER
// )`;

// const sql = `CREATE TABLE books_db(
//     id INTEGER PRIMARY KEY, 
//     category TEXT NOT NULL,
//     grade TEXT NOT NULL,
//     subject TEXT NOT NULL,
//     type TEXT NOT NULL,
//     cover_image TEXT NOT NULL,
//     file_path TEXT NOT NULL
// )`;


const sql = `CREATE TABLE usersTable(
    id INTEGER PRIMARY KEY, 
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    about TEXT,
    email TEXT NOT NULL,
    phone NUMBER,
    college TEXT NOT NULL,
    year TEXT,
    seminster TEXT,
    avatar TEXT,
    facebook TEXT,
    twitter TEXT,
    instagram TEXT,
    linkedIn TEXT,
    password TEXT NOT NULL
)`;


db.run(sql)
