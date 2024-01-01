import  Op  from 'sequelize';
import Absen from '../models/AbsenModel.js';
import Perpustakaan from "../models/PerpusModel.js";
import Biodata from "../models/ProfileModel.js";
import Users from "../models/UserModel.js";
import Pinjam from "../models/PinjamModel.js";


// Users report


// Perpus Report



// Perpus Report



// Pinjam Report











// export async function generateDailyReport (req, res) {
//   try {
//     const today = new Date();
//     const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

//     const dailyReports = await Reports.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfDay, endOfDay],
//         },
//       },
//     });

//     // Lakukan sesuatu dengan dailyReports
//     res.json({ dailyReports });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export async function generateWeeklyReport (req, res) {
//   try {
//     const today = new Date();
//     const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
//     const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);

//     const weeklyReports = await Reports.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfWeek, endOfWeek],
//         },
//       },
//     });

//     // Lakukan sesuatu dengan weeklyReports
//     res.json({ weeklyReports });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export async function generateMonthlyReport  (req, res) {
//   try {
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     const monthlyReports = await Reports.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfMonth, endOfMonth],
//         },
//       },
//     });

//     // Lakukan sesuatu dengan monthlyReports
//     res.json({ monthlyReports });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export async function generateYearlyReport  (req, res) {
//   try {
//     const today = new Date();
//     const startOfYear = new Date(today.getFullYear(), 0, 1);
//     const endOfYear = new Date(today.getFullYear(), 11, 31);

//     const yearlyReports = await Reports.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfYear, endOfYear],
//         },
//       },
//     });

//     // Lakukan sesuatu dengan yearlyReports
//     res.json({ yearlyReports });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   generateDailyReport,
//   generateWeeklyReport,
//   generateMonthlyReport,
//   generateYearlyReport,
// };
