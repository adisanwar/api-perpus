import express  from "express";
import { deleteUser, getUsers, getUsersById, Login, Logout, Register, updateUser } from "../controller/UsersController.js";
import { CreateBuku, deleteBuku, getBuku, getBukuById, updateBuku } from "../controller/BukuController.js";
import { CreatePerpus, deletePerpus, getPerpus, getPerpusById, updatePerpus } from "../controller/PerpusController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../middleware/refreshToken.js";
import { createAbsen, deleteAbsen, getAbsen, getAbsenById } from "../controller/AbsenController.js";
import { createPinjam, deletePinjam, getPinjam, getPinjamById, updatePinjam } from "../controller/PinjamController.js";

const app = express();
const router = express.Router();

// users
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/token', refreshToken);

// router.post('/users/add', CreateUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Buku
router.get('/buku', getBuku);
router.get('/buku/:id', getBukuById);
router.post('/buku', CreateBuku);
router.delete('/buku/:id', deleteBuku);
router.patch('/buku/:id', updateBuku);

// Perpus
router.get('/perpus', getPerpus);
router.get('/perpus/:id', getPerpusById);
router.post('/perpus', CreatePerpus);
router.delete('/perpus/:id', deletePerpus);
router.patch('/perpus/:id', updatePerpus);

// Pinjam
router.get('/pinjam', getPinjam);
router.get('/pinjam/:id', getPinjamById);
router.post('/pinjam', createPinjam);
router.delete('/pinjam/:id', deletePinjam);
router.patch('/pinjam/:id', updatePinjam);

// Absen
router.get('/absen', getAbsen);
router.get('/absen/:id', getAbsenById);
router.post('/absen', createAbsen);
// router.post('/absen', createAbsen);
router.delete('/absen/:id', deleteAbsen);
// router.put('/absen/:id', updatePerpus);



export default router;