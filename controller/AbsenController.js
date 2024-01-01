// import { where } from "sequelize";
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

  export async function getAbsenById(req, res) {
    try {
      const absenId = req.params.id; // Ambil ID absen dari URL atau request params
  
      const absen = await Absen.findOne({
        where: {
          absen_id: absenId // Filter data absen berdasarkan ID
        },
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
  
      if (!absen) {
        return res.status(404).json({ msg: 'Data absen tidak ditemukan' });
      }
  
      const biodata = await Biodata.findAll({
        where: {
          user_id: absen.user_id // Filter biodata untuk pengguna pada data absen yang ditemukan
        }
      });
  
      const userWithBiodata = {
        ...absen.toJSON(),
        biodatas: biodata // Tambahkan biodata ke objek pengguna
      };
  
      res.status(200).json(userWithBiodata);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }


export async function createAbsen(req, res) {
  try {
    const { perpus_id, user_id } = req.body;
    const currentDate = new Date(); // Mendapatkan tanggal saat ini
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // Mendapatkan waktu saat ini dalam format jam (HH:mm:ss)

    // Cari data absen pada tanggal hari ini untuk pengguna dan perpustakaan tertentu
    const existingAbsen = await Absen.findOne({
      where: {
        tanggal_absensi: currentDate,
        user_id: user_id,
        perpus_id: perpus_id
      }
    });

    // Jika belum ada data absen untuk hari ini, tandai sebagai absen masuk
    if (!existingAbsen) {
      const absenMasuk = await Absen.create({
        tanggal_absensi: currentDate,
        waktu_masuk: currentTime, // Set waktu masuk saat ini
        user_id: user_id,
        perpus_id: perpus_id
      });
      return res.status(200).json({ msg: 'Absen masuk berhasil', data: absenMasuk });
    } else {
      // Jika sudah ada data absen untuk hari ini
      if (!existingAbsen.waktu_keluar && !existingAbsen.durasi_kehadiran) {
        // Jika belum absen keluar, tandai sebagai absen keluar
        existingAbsen.waktu_keluar = currentTime; // Set waktu keluar saat ini
        // Hitung durasi kehadiran berdasarkan waktu masuk dan keluar
        const waktuMasuk = existingAbsen.waktu_masuk;
        const waktuKeluar = existingAbsen.waktu_keluar;

        // Fungsi untuk menghitung durasi kehadiran dari format jam (HH:mm:ss)
        const hitungDurasi = (start, end) => {
          const [startHour, startMinute] = start.split(':').map(Number);
          const [endHour, endMinute] = end.split(':').map(Number);
          const durasi = ((endHour * 60) + endMinute) - ((startHour * 60) + startMinute);
          return durasi;
        };

        const durasiKehadiran = hitungDurasi(waktuMasuk, waktuKeluar);
        existingAbsen.durasi_kehadiran = durasiKehadiran;

        await existingAbsen.save(); // Simpan perubahan data absen
        res.status(200).json({ msg: 'Absen keluar berhasil dibuat', data: existingAbsen });
      } else {
        // Jika sudah absen keluar sebelumnya
        res.status(200).json({ msg: 'Anda sudah absen keluar sebelumnya hari ini' });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan absen' });
  }
}


export async function deleteAbsen(req, res) {
  try {
    // console.log(req.params.id);
    const absenId = req.params.id;
    const absen = await Absen.findByPk(absenId);

    if (!absen) {
      return res.status(404).json({ msg: "Id Absen Tidak ditemukan" });
    }

    await Absen.destroy({
      where: {
        absen_id: absenId
      }
    });
    res.status(200).json({ msg: "Absen deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}