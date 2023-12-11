import respon from "./respon.js";
import Perpustakaan from "../models/PerpusModel.js";
import Buku from "../models/BukuModel.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './assets/perpus');
},
filename: function (req, file, cb) {
  cb(null, file.originalname);
}
});

const upload = multer({storage:storage});


export async function getPerpus(req, res) {
  try {
    const perpus = await Perpustakaan.findAll({
      // join with biodata table
      include: Buku, 
      required: true, 
    });
    res.status(200).json(perpus);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getPerpusById(req, res) {
  try {
    const perpus = await Perpustakaan.findOne({
      where: {
        buku_id: req.params.id,
      },
      include: Biodata, 
      required: true, 
    });
    res.status(200).json(perpus);
  } catch (error) {
    console.log(error);
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
      const { nama, alamat, kota, kode_pos, negara, telepon, jam_operasional,email } = req.body;
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
        email:email,
        gambar: gambar // Simpan path gambar ke dalam kolom gambar di tabel Perpustakaan
      });

      res.status(201).json({ msg: 'Create Perpustakaan Success', data:perpus });
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
        buku_id: req.params.id,
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

    if (!buku) {
      return res.status(404).json({ msg: "Perpustakaan not found" });
    }

    await Perpustakaan.destroy();
    res.status(200).json({ msg: "Perpustakaan deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
