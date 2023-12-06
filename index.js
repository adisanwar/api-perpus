import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
// import Users from "./models/UserModel.js";

const app = express();

(async () => {
  try {
    await db.authenticate();
    console.log('Database Connected...');
    // await Users.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  app.use(express.json())
  app.use(router);
})();


app.listen(5000, () => console.log('Server running at port 5000'));
