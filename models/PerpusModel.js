import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';

const Perpustakaan = db.define('perpus', {
  perpus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kota: {
    type: DataTypes.STRING,
  },
  kode_pos: {
    type: DataTypes.STRING,
  },
  negara: {
    type: DataTypes.STRING,
  },
  telepon: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true, // Validasi format email
    },
  },
});

export default Perpustakaan;
