const express = require("express");
const router = express.Router();
const { pool } = require("../db.js");

// Define product routes
router.get("/", async (req, res) => {
  try {
    const queryResult = await pool.query("SELECT * FROM products");
    const products = queryResult.rows;
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { name, price, quantity, category, brand, description, featured } =
    req.body;
  try {
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price must be entered" });
    }
    await pool.query(
      "INSERT INTO products (name, price, quantity, category, brand, description, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, price, quantity, category, brand, description, featured]
    );
    res.status(201).json({ message: "Added Succesfully" });
  } catch (e) {
    console.error(e);
  }
});

// Delete Routes

// delete all
router.delete("/", async (req, res) => {
  try {
    await pool.query("DELETE FROM products");
    res.status(200).json({ message: "Products Deleted Succesfully" });
  } catch (e) {
    console.error(e);
  }
});

// delete one product only
router.delete("/:id", async (req, res) => {
  const productID = req.params.id;

  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      productID,
    ]);

    await pool.query("DELETE FROM products WHERE id = $1", [productID]);

    res.status(200).json({ message: "Product Deleted Succesfully" });
  } catch (e) {
    console.error(e);
  }
});

// edit product

router.put("/:id", async (req, res) => {
  const productID = req.params.id;
  const { name, price, quantity, category, brand, description, featured } =
    req.body;

  try {
    // check if product exist
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      productID,
    ]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product doesnt exist" });
    }
    await pool.query(
      "UPDATE products SET name = $1, price = $2, quantity = $3, category = $4, brand = $5, description = $6, featured = $7 WHERE id = $8",
      [name, price, quantity, category, brand, description, featured, productID]
    );
    res.status(200).json({ message: 'Product updated succesfully' });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
