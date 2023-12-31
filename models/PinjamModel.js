import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Buku from './BukuModel.js';
import Perpustakaan from './PerpusModel.js';
import Users from './UserModel.js';


const Pinjam = db.define('pinjams', {
  pinjam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tanggal_pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tanggal_kembali: {
    type: DataTypes.DATEONLY,
  },
  keterangan: {
    type: DataTypes.STRING,
  },
  isVerif: {
    type: DataTypes.TINYINT,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'user_id',
    },
  },
  perpus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perpustakaan,
      key: 'perpus_id',
    },
  },
  buku_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Buku,
      key: 'buku_id',
    },
  },
},{
  freezeTableName: true,
  timestamps: false,
}
);

Users.hasMany(Pinjam, { foreignKey: 'user_id' });
Pinjam.belongsTo(Users, { foreignKey: 'user_id' });

Perpustakaan.hasMany(Pinjam, { foreignKey: 'perpus_id' });
Pinjam.belongsTo(Perpustakaan, { foreignKey: 'perpus_id' });

Buku.hasMany(Pinjam, { foreignKey: 'buku_id' });
Pinjam.belongsTo(Buku, { foreignKey: 'buku_id' });

// jangan di run
// Perpustakaan.drop()
//   .then(() => {
//     console.log('Tabel berhasil dihapus (drop)');
//   })
//   .catch((err) => {
//     console.error('Gagal menghapus tabel:', err);
//   });

export default Pinjam;
