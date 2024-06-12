const express = require("express");
const cors = require("cors"); // Import cors
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Apply CORS middleware globally
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// Database Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "shopping_cart",
});

// Get all products
app.get("/api/products", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM cart", (err, rows) => {
      connection.release();
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
  });
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM cart WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`Product with ID ${req.params.id} has been removed.`);
        } else {
          console.log(err);
        }
      }
    );
  });
});

// Insert a new product
app.post("/api/products", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const params = req.body;
    connection.query("INSERT INTO cart SET ?", params, (err, rows) => {
      connection.release();
      if (!err) {
        res.send(`Product has been added.`);
      } else {
        console.log(err);
      }
    });
  });
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const { title, content, imageUrl, price, quantity } = req.body;
    connection.query(
      "UPDATE cart SET title = ?, content = ?, imageUrl = ?, price = ?, quantity = ? WHERE id = ?",
      [title, content, imageUrl, price, quantity, req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`Product with ID ${req.params.id} has been updated.`);
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
