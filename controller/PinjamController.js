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

export async function getPinjamId(req, res) {

  try {
    const pinjam = await Pinjam.findByPk({
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
      ],
      where: {
        pinjam_id : req.params.id
      }
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

export async function CreatePerpus(req, res) {
  try {
    // Lakukan proses unggah gambar dengan multer
    upload.single('gambar')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ msg: 'Terjadi kesalahan saat mengunggah gambar' });
      } else if (err) {
        return res.status(500).json({ msg: 'Terjadi kesalahan lain saat mengunggah gambar' });
      }

      console.log(req.body);
      const { nama, alamat, kota, kode_pos, negara, telepon, jam_operasional, email } = req.body;
      const gambar = req.file ? req.file.path : '';

      // Jika berhasil, buat entri Perpustakaan dengan informasi yang diterima dari req.body
      const perpus = await Perpustakaan.create({
        nama: nama,
        alamat: alamat,
        kota: kota,
        kode_pos: kode_pos,
        negara: negara,
        telepon: telepon,
        jam_operasional: jam_operasional,
        email: email,
        gambar: gambar // Simpan path gambar ke dalam kolom gambar di tabel Perpustakaan
      });

      res.status(201).json({ msg: 'Create Perpustakaan Success', data: perpus });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Terjadi kesalahan saat membuat perpustakaan' });
  }
}


export async function updatePerpus(req, res) {
  try {
    await Perpustakaan.update(req.body, {
      where: {
        perpus_id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Perpustakaan Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function deletePerpus(req, res) {
  try {
    const perpusId = req.params.id;
    const perpus = await Perpustakaan.findByPk(perpusId);

    if (!perpus) {
      return res.status(404).json({ msg: "Perpustakaan not found" });
    }

    await Perpustakaan.destroy();
    res.status(200).json({ msg: "Perpustakaan deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function createAbsen(req, res) {
  try {
    await Absen.create(req.body, {
      where: {
        absen_id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Absen dibuat" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getAbsen(req, res) {
  try {
    const absen = await Absen.findAll({
      // join with biodata table
      include: [
        {
          model: Perpustakaan,
          required: true
        },
        {
          model: Users,
          required: true,
          include: [
            {
            model : Biodata,
            require : true
            },
          ],
        },
        // {
        //   model : Biodata,
        //   required : true
        // },
      ]
    });
    res.status(200).json(absen);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

