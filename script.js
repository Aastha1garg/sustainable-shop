//const http = require('node:http');

//const hostname = '127.0.0.1';
//const port = 3000;

//const server = http.createServer((req, res) => {
 // res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  //res.end('Hello, World!\n');
//});

//server.listen(port, hostname, () => {
 // console.log(`Server running at http://${hostname}:${port}/`);
//});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];
let products = [
    { id: 1, name: "Organic Cotton T-Shirt", description: "Soft, breathable, and 100% organic.", price: 599 },
    { id: 2, name: "Eco-Friendly Jeans", description: "Made with recycled materials and sustainable dye.", price: 1299 },
    { id: 3, name: "Bamboo Sunglasses", description: "Stylish and made from renewable bamboo.", price: 899 }
];

// User Registration API
app.post("/register", (req, res) => {
    const { username, password, phone } = req.body;
    if (users.find(user => user.username === username || user.phone === phone)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password, phone });
    res.json({ message: "Registration successful!" });
});

// Fetch All Products API
app.get("/products", (req, res) => {
    res.json(products);
});

// Add New Product API (For Admin Panel)
app.post("/products", (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = { id: products.length + 1, name, description, price };
    products.push(newProduct);
    res.json({ message: "Product added successfully!", product: newProduct });
});

// Server Port
app.listen(5000, () => console.log("Server running on http://localhost:5432"));


