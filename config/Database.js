import { Sequelize } from "sequelize";

let db;

try {
  db = new Sequelize("perpus", "root", "", {
    host: "localhost",
    dialect: "mysql",
  });
 
  db.authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
} catch (error) {
  console.error("Error occurred during database initialization:", error);
  // Handle or log the error accordingly
}


export default db;
