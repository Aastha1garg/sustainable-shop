const db = require("../config/db");

const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )
`;

db.query(createUserTable, (err, result) => {
  if (err) console.log(err);
  else console.log("User table created");
});
