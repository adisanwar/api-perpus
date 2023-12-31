import respon from "./respon.js";
import Perpustakaan from "../models/PerpusModel.js";
import Buku from "../models/BukuModel.js";
import multer from "multer";
import Absen from "../models/AbsenModel.js";
import Users from "../models/UserModel.js";
import Biodata from "../models/ProfileModel.js";
import { request } from "express";
import Pinjam from "../models/PinjamModel.js";

export async function getPinjam(req, res) {
  try {
    const pinjam = await Pinjam.findAll({
      include: [
        {
          model: Perpustakaan,
          required: true
        },
        {
          model: Buku,
          required: true
        },
        {
          model: Users,
          required: true,
        }
      ]
    });

    const usersWithBiodata = await Promise.all(pinjam.map(async (user) => {
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


export const getPinjamById = async (req, res) => {
  try {
    const pinjam = await Pinjam.findOne({
      where: {
        pinjam_id: req.params.id,
      },
    });

    if (!pinjam) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }

    // Mencari informasi terkait dari tabel User, Perpus, dan Buku berdasarkan ID yang terdapat di tabel Pinjam
    const user = await Users.findOne({ where: { user_id: pinjam.user_id } });
    const perpus = await Perpustakaan.findOne({ where: { perpus_id: pinjam.perpus_id } });
    const buku = await Buku.findOne({ where: { buku_id: pinjam.buku_id } });
    const biodata = await Biodata.findOne({ where: { user_id: user.user_id } });

    const response = {
      pinjam_id: pinjam.pinjam_id,
      tanggal_pinjam: pinjam.tanggal_pinjam,
      tanggal_kembali: pinjam.tanggal_kembali,
      keterangan: pinjam.keterangan,
      user: {
        user: user || {},
        biodata: biodata || {},
      }, // Menyertakan informasi user atau objek kosong jika tidak ditemukan
      perpus: perpus || {}, // Menyertakan informasi perpus atau objek kosong jika tidak ditemukan
      buku: buku || {},
       // Menyertakan informasi buku atau objek kosong jika tidak ditemukan
    };

    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat mencari data peminjaman' });
  }
};


export async function createPinjam(req, res) {
  try {
    const {
      tanggal_pinjam,
      tanggal_kembali,
      keterangan,
      user_id,
      perpus_id,
      buku_id,
    } = req.body;
    // Pastikan data yang diperlukan ada dalam req.body sebelum membuat entri baru
    if (!tanggal_pinjam || !user_id || !perpus_id || !buku_id) {
      return res.status(400).json({ message: "Data tidak lengkap untuk membuat peminjaman" });
    }

    // Buat entri peminjaman baru berdasarkan data yang diterima dari req.body
    const newPinjam = await Pinjam.create({
      tanggal_pinjam,
      tanggal_kembali,
      keterangan,
      user_id,
      perpus_id,
      buku_id,
    });

    res.status(201).json({
      message: "Peminjaman berhasil dibuat",
      data: newPinjam,
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({
      error: "Gagal membuat entri peminjaman baru",
    });
  }
}

export async function updatePinjam(req, res) {
  try {
    const updatedRows = await Pinjam.update(req.body, {
      where: {
        pinjam_id: req.params.id,
      },
    });

    if (updatedRows[0] === 0) {
      // Jika tidak ada baris yang diperbarui, berikan respons bahwa data tidak ditemukan
      return res.status(404).json({ msg: "Data not found or no changes made" });
    }

    res.status(200).json({ msg: "Pinjam Updated"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update Pinjam" });
  }
}

export async function deletePinjam(req, res) {
  try {
    const pinjamId = req.params.id;
    const pinjam = await Pinjam.findByPk(pinjamId);

    if (!pinjam) {
      return res.status(404).json({ msg: "Pinjam not found" });
    }

    await Pinjam.destroy();
    res.status(200).json({ msg: "Pinjam deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
