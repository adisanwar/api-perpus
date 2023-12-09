import Buku from "../models/BukuModel.js";
import Perpustakaan from "../models/PerpusModel.js";


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
      include: Biodata, 
      required: true, 
    });
    res.status(200).json(buku);
  } catch (error) {
    console.log(error);
  }
}


export async function CreateBuku(req, res) {
  try {
    const buku = await Buku.create(req.body);
    res.status(201).json({ msg: "Create Buku Success", data:buku });
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateBuku(req, res) {
  try {
    await Buku.update(req.body, {
      where: {
        buku_id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Buku Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteBuku(req, res) {
  try {
    const bukuId = req.params.id;
    const buku = await Buku.findByPk(bukuId);

    if (!buku) {
      return res.status(404).json({ msg: "User not found" });
    }

    await Buku.destroy();
    res.status(200).json({ msg: "Buku deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
