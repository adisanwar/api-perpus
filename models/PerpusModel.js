import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';


const Perpustakaan = db.define('perpustakaan', {
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
  gambar: {
    type: DataTypes.STRING,
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
  jam_operasional: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
},{
  freezeTableName: true,
  timestamps: false,
}
);

// jangan di run
// Perpustakaan.drop()
//   .then(() => {
//     console.log('Tabel berhasil dihapus (drop)');
//   })
//   .catch((err) => {
//     console.error('Gagal menghapus tabel:', err);
//   });

export default Perpustakaan;
