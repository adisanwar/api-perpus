import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';
import Perpustakaan from './PerpusModel.js';
import Perpus from './PerpusModel.js';
import Biodata from './ProfileModel.js';

const Absen = db.define('absens', {
  absen_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tanggal_absensi: {
    type: DataTypes.DATEONLY,
    defaultValue:Sequelize.fn('NOW'),
    allowNull: false,
  },
  waktu_masuk: {
    type: DataTypes.TIME,
    defaultValue:Sequelize.fn('NOW'),
    allowNull: false,
  },
  waktu_keluar: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  durasi_kehadiran: {
    type: DataTypes.INTEGER, 
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "user_id",
    }
  },
  perpus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perpustakaan,
      key: "perpus_id",
    }
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

Users.hasMany(Absen, { foreignKey: 'user_id' });
Absen.belongsTo(Users, { foreignKey: 'user_id' });

Perpustakaan.hasMany(Absen, { foreignKey: 'perpus_id' });
Absen.belongsTo(Perpustakaan, { foreignKey: 'perpus_id' });

export default Absen;
