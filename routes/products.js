const express = require('express');
const router = express.Router();
const { pool } = require('../db.js')

// Define product routes
router.get('/', async (req, res) => {
    try {
        const queryResult = await pool.query('SELECT * FROM products');
        const products = queryResult.rows;
        res.json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;