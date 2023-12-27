import multer from "multer";
import Buku from "../models/BukuModel.js";
import Perpustakaan from "../models/PerpusModel.js";
// import Absen from "../models/AbsenModel.js";
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './assets/buku/');
},
filename: function (req, file, cb) {
  cb(null, file.originalname);
}
});

const upload = multer({storage:storage});


export async function getBuku(req, res) {
  try {
    const buku = await Buku.findAll({
      // join with biodata table
      include: Perpustakaan, 
      required: true, 
    });
    res.status(200).json(buku);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getBukuById(req, res) {
  try {
    const buku = await Buku.findOne({
      where: {
        buku_id: req.params.id,
      },
      include: Perpustakaan, 
      required: true, 
    });
    res.status(200).json(buku);
  } catch (error) {
    console.log(error);
  }
}


export async function CreateBuku(req, res) {
  try {
    // Lakukan proses unggah gambar dengan multer
    upload.single('gambar')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ msg: 'Terjadi kesalahan saat mengunggah gambar' });
      } else if (err) {
        return res.status(500).json({ msg: 'Terjadi kesalahan lain saat mengunggah gambar' });
      }

      console.log(req.body);
      const { judul, pengarang, penerbit, tahun_terbit, deskripsi, kategori, perpus_id} = req.body;
      const gambar = req.file ? req.file.path : '';

      // Jika berhasil, buat entri Perpustakaan dengan informasi yang diterima dari req.body
      const buku = await Buku.create({
        judul: judul,
        pengarang: pengarang,
        penerbit: penerbit,
        tahun_terbit: tahun_terbit,
        deskripsi: deskripsi,
        kategori: kategori,
        perpus_id: perpus_id,
        gambar: gambar // Simpan path gambar ke dalam kolom gambar di tabel Perpustakaan
      });

      res.status(201).json({ msg: 'Create Buku Success', data:buku });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Terjadi kesalahan saat membuat buku' });
  }
}



export async function updateBuku(req, res) {
  try {
    const bukuId = req.params.id;

    // Ambil informasi buku yang akan diperbarui untuk mendapatkan path gambar lama
    const bukuToUpdate = await Buku.findByPk(bukuId);
    if (!bukuToUpdate) {
      return res.status(404).json({ msg: 'Buku tidak ditemukan' });
    }

    // Simpan path gambar lama sebelum proses pembaruan
    const oldImagePath = bukuToUpdate.gambar;

    // Lakukan proses unggah gambar baru dengan multer
    upload.single('gambar')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ msg: 'Terjadi kesalahan saat mengunggah gambar' });
      } else if (err) {
        return res.status(500).json({ msg: 'Terjadi kesalahan lain saat mengunggah gambar' });
      }

      console.log(req.body);
      const { judul, pengarang, penerbit, tahun_terbit, deskripsi, kategori, perpus_id } = req.body;
      const gambar = req.file ? req.file.path : bukuToUpdate.gambar; // Gunakan gambar lama jika tidak ada gambar baru

      // Perbarui informasi buku dengan gambar yang baru
      const updatedBuku = await Buku.update(
        {
          judul: judul,
          pengarang: pengarang,
          penerbit: penerbit,
          tahun_terbit: tahun_terbit,
          deskripsi: deskripsi,
          kategori: kategori,
          perpus_id: perpus_id,
          gambar: gambar
        },
        {
          where: { buku_id: bukuId }
        }
      );

      if (updatedBuku[0] === 1) {
        // Hapus gambar lama jika ada
        if (req.file && oldImagePath) {
          await fs.unlink(oldImagePath);
        }

        const updatedData = await Buku.findByPk(bukuId);
        return res.status(200).json({ msg: 'Update Buku Success', data: updatedData });
      } else {
        return res.status(404).json({ msg: 'Buku tidak ditemukan atau tidak dapat diperbarui' });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Terjadi kesalahan saat memperbarui buku' });
  }
}


export async function deleteBuku(req, res) {
  try {
    // console.log(req.params.id);
    const bukuId = req.params.id;
    const buku = await Buku.findByPk(bukuId);

    if (!buku) {
      return res.status(404).json({ msg: "Id Buku Tidak ditemukan" });
    }

    await Buku.destroy({
      where: {
        buku_id: bukuId
      }
    });
    res.status(200).json({ msg: "Buku deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
