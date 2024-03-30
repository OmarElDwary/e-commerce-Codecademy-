const express = require('express');
const { pool } = require('../db');
const router = express.Router();

router.post('/', async(req, res) => {
    const { user_id } = req.body;

    try {
        const newCart = await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [user_id]);
        res.status(201).json(newCart.rows[0]);
    } catch(e) {
        console.error(e);
        res.status(401).json({ error: 'Internal server error' });
    }
})

// post product to cart

router.post('/:id', async(req, res) => {
    const cartID = req.params.id;
    const { product_id, quantity } = req.body;

    try {
        const addProduct = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES($1, $2,$3) RETURNING *', [cartID, product_id, quantity]);
        res.status(201).json(addProduct.rows[0]);
    } catch(e) {
        console.error(e);
    }
})

// GET cart

router.get('/cart/:id', async (req, res) => {
    const cartID = req.params.id;
    
    try {
        // Retrieve the cart details including its items
        const cartDetails = await pool.query('SELECT * FROM cart WHERE cart_id = $1', [cartID]);
        const cartItems = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartID]);
        const cart = {
            ...cartDetails.rows[0],
            items: cartItems.rows
        };
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', (req, res) => {})