require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const pool = require("./config/db"); 


const app = express();
const PORT = process.env.PORT || 5432;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔐 SECRET KEY for JWT
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// 🟢 1. User Registration API
app.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
            [name, email, phone, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });
                res.status(201).json({ message: "User registered successfully!" });
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error });
    }
});

// 🟢 2. User Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    });
});

// 🛍️ 3. Get All Products API
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

// 🛍️ 4. Add Product API
app.post("/add_product", (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    db.query(
        "INSERT INTO products (name, description, price) VALUES (?, ?, ?)",
        [name, description, price],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            res.status(201).json({ message: "Product added successfully!" });
        }
    );
});

// 🔐 5. User Authentication Middleware (for protected routes)
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied!" });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token!" });
    }
};

// Example: Protected Route
app.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the Dashboard!", userId: req.user.userId });
});

// 🔥 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
