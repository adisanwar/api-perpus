import Users from "../models/UserModel.js";
import { genSalt, hash, compare } from "bcrypt";
import bcrypt from "bcrypt";
// import db from "../config/Database.js";
import jwt from "jsonwebtoken";
import respon from "./respon.js";
import Biodata from "../models/ProfileModel.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/profile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const singleUpload = upload.single("gambar");

export async function getUsers(req, res) {
  try {
    const users = await Users.findAll({
      // join with biodata table
      include: Biodata,
      required: true,
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getUsersById(req, res) {
  try {
    const users = await Users.findOne({
      where: {
        user_id: req.params.id,
      },
      include: Biodata,
      required: true,
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
}

// Define the multer upload middleware outside the route handler

// Route handler
export async function Register(req, res) {
  try {
    singleUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(500)
          .json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
      } else if (err) {
        return res
          .status(500)
          .json({ msg: "Terjadi kesalahan lain saat mengunggah gambar" });
      }

      console.log(req.body);
      console.log(req.file);

      const {
        nama,
        email,
        password,
        confPassword,
        role,
        nip_perpus,
        ktp,
        alamat,
        phone,
      } = req.body;
      const gambar = req.file ? req.file.path : "";

      if (password !== confPassword) {
        return res
          .status(400)
          .json({ msg: "Password dan Konfirmasi Password tidak sesuai" });
      }

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const mailCek = await Users.findOne({
        where: {
          email: email,
        },
      });

      if (mailCek) {
        return res.status(400).json({ msg: "Email sudah terdaftar" });
      }

      let userRole = role || "anggota"; // Set default role to 'anggota' if role is not provided

      const userReg = await Users.create({
        name: nama,
        email: email,
        password: hashPassword,
        role: userRole,
      });

      const profiles = await Biodata.create({
        gambar: gambar,
        nip_perpus: nip_perpus,
        ktp: ktp,
        alamat: alamat,
        phone: phone,
        user_id: userReg.user_id,
      });

      res
        .status(200)
        .json({ msg: "Registrasi Berhasil", data: { userReg, profiles } });
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat melakukan registrasi" });
  }
}

export async function CreateUser(req, res) {
  try {
    await Users.create(req.body);
    res.status(201).json({ msg: "Create User Success" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateUser(req, res) {
  try {
    await Users.update(req.body, {
      where: {
        user_id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function Login(req, res) {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user.length === 0) {
      return res.status(400).json({ msg: "Email not found" });
    }
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const userId = user[0].user_id;
    const name = user[0].name;
    const email = user[0].email;
    const payload = { userId, name, email };

    // console.log('get data berhasil');

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });

    // console.log('access token');
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    // console.log("refresh token :" +refreshToken);
    try {
      console.log("User data:", payload); // Check if user data is retrieved correctly
      console.log("User ID:", userId);
      await Users.update(
        {
          refreshToken: refreshToken,
        },
        {
          where: {
            user_id: userId,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    // console.log('refresh token');
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ data: payload, accessToken });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function Logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].user_id;
    await Users.update(
      { refreshToken: null },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.status(200).json({ msg: "Berhasil Logout" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
