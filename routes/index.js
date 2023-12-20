import express  from "express";
import { CreateUser, deleteUser, getUsers, getUsersById, Login, Logout, Register, updateUser } from "../controller/UsersController.js";
import { CreateBuku, deleteBuku, getBuku, getBukuById, updateBuku } from "../controller/BukuController.js";
import { createAbsen, CreatePerpus, deletePerpus, getPerpus, getPerpusById, updatePerpus } from "../controller/PerpusController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../middleware/refreshToken.js";
import { getAbsen } from "../controller/AbsenController.js";

const app = express();
const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/token', refreshToken);

router.post('/users/add', CreateUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/buku', getBuku);
router.get('/buku/:id', getBukuById);
router.post('/buku', CreateBuku);
router.delete('/buku/:id', deleteBuku);
router.patch('/buku/:id', updateBuku);

router.get('/perpus', getPerpus);
router.get('/perpus/:id', getPerpusById);
router.post('/perpus', CreatePerpus);
router.delete('/perpus/:id', deletePerpus);
router.put('/perpus/:id', updatePerpus);

router.get('/absen', getAbsen);
router.post('/absen', createAbsen);
// router.post('/absen', createAbsen);
// router.delete('/absen/:id', deletePerpus);
// router.put('/absen/:id', updatePerpus);



export default router;