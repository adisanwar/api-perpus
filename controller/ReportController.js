import Op from 'sequelize';
import Absen from '../models/AbsenModel.js';
import Perpustakaan from "../models/PerpusModel.js";
import Biodata from "../models/ProfileModel.js";
import Users from "../models/UserModel.js";
import Pinjam from "../models/PinjamModel.js";
// import PDFDocument from 'pdfkit';
import fs from 'fs';


// Pinjam Report
export async function getPinjamByDateRange(req, res) {
    try {
      const { start_date, end_date } = req.query;
    
      // Convert string dates to Date objects
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
    
      // Ensure received parameters are valid dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    
      console.log(startDate, endDate);
  
      // Retrieve loan data within the date range
      const pinjamData = await Pinjam.findAll({
        where: {
          tanggal_pinjam: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    
      res.json({ data: pinjamData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
 
export async function pinjamDailyReport (req, res) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    // console.log(endOfDay);
    const dailyReports = await Pinjam.findAll({
      where: {
        tanggal_pinjam:{
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['tanggal_pinjam', 'DESC']], // Mengurutkan berdasarkan tanggal_pinjam secara descending
    });

    // Lakukan sesuatu dengan dailyReports
    res.json({ data: dailyReports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export async function pinjamWeeklyReport(req, res) {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);

        const weeklyReports = await Pinjam.findAll({
            where: {
                tanggal_pinjam: {
                    [Op.between]: [startOfWeek, endOfWeek],
                },
            },
            order: [['tanggal_pinjam', 'DESC']],
        });

        // Lakukan sesuatu dengan weeklyReports
        res.json({ data: weeklyReports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function pinjamMonthlyReport(req, res) {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const monthlyReports = await Pinjam.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
            order: [['tanggal_pinjam', 'DESC']],
        });

        // Lakukan sesuatu dengan monthlyReports
        res.json({ data: monthlyReports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function pinjamYearlyReport(req, res) {
    try {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        const yearlyReports = await Pinjam.findAll({
            where: {
                tanggal_pinjam: {
                    [Op.between]: [startOfYear, endOfYear],
                },
            },
            order: [['tanggal_pinjam', 'DESC']],
        });

        // Lakukan sesuatu dengan yearlyReports
        res.json({ data: yearlyReports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const createPDFReport = async (queryResult) => {
//     return new Promise((resolve, reject) => {
//       try {
//         const doc = new PDFDocument();
//         const fileName = 'report.pdf';
//         const writeStream = fs.createWriteStream(fileName);
  
//         doc.pipe(writeStream);
  
//         // Tulis data hasil query ke dalam file PDF
//         doc.fontSize(12).text('Laporan:\n\n');
//         queryResult.forEach((item, index) => {
//           doc.text(`Data ${index + 1}: ${JSON.stringify(item, null, 2)}\n\n`);
//         });
  
//         doc.end();
//         console.log('PDF report generated:', fileName);
//         resolve(fileName); // Mengembalikan nama file setelah laporan PDF selesai dibuat
//       } catch (error) {
//         console.error('Error generating PDF report:', error);
//         reject(error);
//       }
//     });
//   };
  
//   export async function exportDailyReport(req, res) {
//     try {
//         const dailyReports = await pinjamDailyReport();

//         // Buat laporan PDF dari data yang diperoleh
//         const pdfFileName = await createPDFReport(dailyReports);
    
//         // Kirim file PDF sebagai respons
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`);
        
//         const pdfFile = fs.createReadStream(pdfFileName);
//         pdfFile.pipe(res);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//   };
