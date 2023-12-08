import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import Users from "./models/UserModel.js";
import Biodata from "./models/ProfileModel.js";
import Absen from "./models/AbsenModel.js";
import Perpustakaan from "./models/PerpusModel.js";

dotenv.config();
const app = express();

(async () => {
  try {
    await db.authenticate();
    // console.log('Database Connected...');
    await Users.sync();
    await Biodata.sync();
    await Absen.sync();
    await Perpustakaan.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  app.use(express.json())
  app.use(router);
})();


app.listen(5000, () => console.log('Server running at port 5000'));
