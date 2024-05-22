const express = require('express');
const mysql = require('mysql2/promise'); // Using promises for cleaner async/await syntax
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

app.use(cors());
app.use(express.json());

// Connect to database using environment variables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Get all products
app.get('/api/data', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM products');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Get a product by ID
app.get('/api/data/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Update a product
app.put('/editProduct/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;

    if (!name || !quantity || !price) {
        return res.status(400).json({ error: 'Please provide name, quantity, and price' });
    }

    try {
        const [results] = await db.query(`
            UPDATE products
            SET name = ?, quantity = ?, price = ?
            WHERE id = ?
        `, [name, quantity, price, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Add a product
app.post('/addProducts', async (req, res) => {
    const { name, quantity, price } = req.body;
    if (!name || !quantity || !price) {
        return res.status(400).json({ error: 'Please provide name, quantity and price' });
    }

    try {
        const [results] = await db.query('INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)', [name, quantity, price]);
        res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Delete a product
app.delete('/deleteProduct/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch {
        console.log("Delete failed");
    };
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

