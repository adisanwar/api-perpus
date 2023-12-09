import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Perpustakaan from './PerpusModel.js';

const Buku = db.define('buku', {
  buku_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pengarang: {
    type: DataTypes.STRING,
  },
  penerbit: {
    type: DataTypes.STRING,
  },
  tahun_terbit: {
    type: DataTypes.STRING,
  },
  deskripsi: {
    type: DataTypes.STRING,
  },
  gambar: {
    type: DataTypes.STRING,
  },
  kategori: {
    type: DataTypes.INTEGER,
  },
  perpus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perpustakaan,
      key: 'perpus_id',
    },
  },
});


Buku.belongsTo(Perpustakaan, { foreignKey: 'perpus_id' });
Perpustakaan.hasMany(Buku, { foreignKey: 'perpus_id' });

// jangan di run
// Buku.drop()
//   .then(() => {
//     console.log('Tabel berhasil dihapus (drop)');
//   })
//   .catch((err) => {
//     console.error('Gagal menghapus tabel:', err);
//   });

export default Buku;
