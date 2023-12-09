import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const Biodata = db.define(
  "biodatas",
  {
    biodata_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nip_perpus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ktp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "user_id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);
Users.hasOne(Biodata, { foreignKey: 'user_id' });
Biodata.belongsTo(Users, { foreignKey: 'user_id' });

export default Biodata;
