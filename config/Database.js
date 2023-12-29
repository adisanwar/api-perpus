import { Sequelize } from "sequelize";


let db;

try {
  db = new Sequelize('perpus', 'root', 'Adi1@)!@', {
    host: "8.219.70.58",
    dialect: "mysql"
  });

  // Additional configurations or initialization can be done here if needed

  // Testing the connection (optional)
  db.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
} catch (error) {
  console.error('Error occurred during database initialization:', error);
  // Handle or log the error accordingly
}

// Use the 'db' variable for further database operations


export default db; 
