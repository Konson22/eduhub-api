const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createToken } = require('../midlewares/jwt');
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database("./database.db", sqlite.OPEN_READWRITE, err => err && console.log(err));


// AUTHENTICATE TOKEN
const authToken = async (req, res) => {
    try{
        res.json(req.user)
    }catch(error){
        res.status(404).send(error)
    }
}


// LOGIN USER
// db.run(`DELETE FROM usersTable`)
const loginUser = (req, res) => {
    try {
        const { email, password } = req.body;
        db.get(`SELECT * FROM usersTable WHERE email='${email}'`, async (err, user) => {
            if(err) throw err;
            if(!user) return res.status(404).send('Wrong Email!')
            const verified = await bcryptjs.compare(password, user.password)
            if(!verified){
                return res.status(409).send('Wrong Password!')
            }
            const profile = {userID:user.id, name:user.name, college:user.college, email:user.email, avatar:user.avatar}
            const ACCESS_TOKEN = await createToken(profile);
            res.cookie('ACCESS_TOKEN', ACCESS_TOKEN, {
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                httpOnly: true,
                sameSite: "none",
                secure: 'false',
            });
            res.json({ACCESS_TOKEN, profile})
        })
    } catch (error) {
       res.send('Server Side Error...!')
    }
}

// RESGISTER NEW USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, college } = req.body;

        db.get(`SELECT * FROM usersTable WHERE email='${email}'`, async (err, user) => {
            if(err) throw err;
            if(user){
                res.status(409).send('Already registered!')
            }else{
                const hashPass = await bcryptjs.hash(password, 4);
                sql = 'INSERT INTO usersTable(name, gender, about, email, phone, college, year, seminster, avatar, facebook, twitter, instagram, linkedIn, password) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                db.run(sql, [name, '', '', email, '', college, '', '', 'user.png', '', '', '', '', hashPass], async function(err) {
                    if(err) throw err
                    const prfile = {userID:this.lastID, name, college, email, avatar:'/images/user.png'}
                    const ACCESS_TOKEN = await createToken(prfile);
                    res.cookie('ACCESS_TOKEN', ACCESS_TOKEN, {
                        expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                        httpOnly: true,
                        sameSite: "none",
                        secure: 'false',
                    });
                    res.json({ACCESS_TOKEN, prfile})
                })
            }
        })
    } catch (error) {
        res.send('Error')
    }
}

// GET ALL USERS
const getAllUsersController = (req, res) => {
    try{
        db.all('SELECT * FROM usersTable', [], (err, rows) => {
            if(err) throw err;
            res.json(rows)
        })

    }catch(error){
        console.log(error)
    }
}


module.exports = { authToken, loginUser, registerUser, getAllUsersController }