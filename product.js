const db = require("../config/db");

const createProductTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    description TEXT
  )
`;

db.query(createProductTable, (err, result) => {
  if (err) console.log(err);
  else console.log("Product table created");
});
