import Users from "../models/UserModel.js";
import { genSalt, hash, compare } from "bcrypt";
import sign from "jsonwebtoken";
import db from "../config/Database.js";
import respon from "./respon.js";
import Biodata from "../models/ProfileModel.js";
// import model from "../models/index.js";

export async function getUsers(req, res) {
  try {
    const users = await Users.findAll({
      // beluum bisa join ke niodata biodatas is not associated to users!
      // include: {
      //   model: Biodata,
      //   required: true,
      // }
    });
    // res.status(200).json(users);
    respon(200, users, "Data User", res);
  } catch (error) {
    console.log(error.message);
  }
}

export async function getUsersById(req, res) {
  try {
    const users = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
}

export async function Register(req, res) {
  const { name, email, password, confPassword, ktp, alamat, phone } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "password dan Conf Password Tidak Sesuai" });

  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  try {
    const mailCek = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (mailCek) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    } else {
      const userReg = await Users.create({
        name: name,
        email: email,
        password: hashPassword,
        // password:password
      });
      // res.status(201).json({ msg: "Create User Success" });
      const pofiles = await Biodata.create({
        ktp: ktp,
        alamat: alamat,
        phone: phone,
        user_id: userReg.user_id
      })
      respon(200, userReg, "Register Berhasil", res);
    }
  } catch (error) {
    console.log(error);
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
        id: req.params.id,
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
    const match = await compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      { refreshToken: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function Logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  // console.log(refreshToken);
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
}
