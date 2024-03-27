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

module.exports = router;