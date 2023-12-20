import { where } from "sequelize";
import Absen from "../models/AbsenModel.js";
import Perpustakaan from "../models/PerpusModel.js";
import Biodata from "../models/ProfileModel.js";
import Users from "../models/UserModel.js";

export async function getAbsen(req, res) {
    try {
      const absen = await Absen.findAll({
        include: [
          {
            model: Perpustakaan,
            required: true
          },
          {
            model: Users,
            required: true,
          }
        ]
      });
  
      const usersWithBiodata = await Promise.all(absen.map(async (user) => {
        const biodata = await Biodata.findAll({
          where: {
            user_id: user.user_id // Filter Biodata for each user
          }
        });
  
        return {
          ...user.toJSON(),
          biodatas: biodata // Add Biodata to each user object
        };
      }));
  
      res.status(200).json(usersWithBiodata);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  export async function getAbsenId(req, res) {
    try {
      const absen = await Absen.findByPk({
        include: [
          {
            model: Perpustakaan,
            required: true
          },
          {
            model: Users,
            required: true,
          }
        ]
      });
      where: {

      }
  
      const usersWithBiodata = await Promise.all(absen.map(async (user) => {
        const biodata = await Biodata.findAll({
          where: {
            user_id: user.user_id // Filter Biodata for each user
          }
        });
  
        return {
          ...user.toJSON(),
          biodatas: biodata // Add Biodata to each user object
        };
      }));
  
      res.status(200).json(usersWithBiodata);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }