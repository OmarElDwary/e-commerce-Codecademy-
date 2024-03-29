const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../db.js');


const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    
    if(!username || !password) {
        return res.status(400).json({ error: 'All data must be filled' });
    }

    try {
        // existing user?
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if(existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Username exists'});
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to DB
        await pool.query('INSERT INTO users(username, password) VALUES ($1, $2)', [username, hashedPassword])

        res.status(201).json({ message: 'User Created Succesfully' })

    } catch(e) {
        console.error(e)
    }
})

// change username
router.put('/username/:id', async(req, res) => {
    const userID = req.params.id;
    const { username } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users where id = $1', [userID]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        await pool.query('UPDATE USERS SET username = $1 WHERE id = $2', [username, userID]);

        res.status(200).json({ message: 'user name changed' });

    } catch(e) {
        console.error(e)
    }
})

router.put('/change-password/:id', async(req, res) => {
    const userID = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users where id = $1', [userID]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User does not exist' });
        }
        const oldPasswordValid =  await bcrypt.compare(oldPassword, user.rows[0].password);

        if (!oldPasswordValid) {
            return res.status(400).json({ error: 'Passwords does not match' });
        }

        const newHashedPass = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE USERS SET password = $1 WHERE id = $2', [newHashedPass, userID]);

        res.status(200).json({ message: 'password changed' });

    } catch(e) {
        console.error(e)
    }
})

// delete user 
router.delete('/:id', async(req, res) => {
    const userID = req.params.id;
    const { password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userID]);
    if (user.rows.length === 0) {
        return res.status(404).json({ error: 'Not Found' });
    }
    try {
        const isCorrectPass = await bcrypt.compare(password, user.rows[0].password);

        if (!isCorrectPass) {
            return res.status(400).json({ error: 'Passwords does not match' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [userID]);
        res.status(200).json({ message: 'Succesfully deleted' })
    } catch(e) {
        console.error(e);
    }
})

module.exports = router;