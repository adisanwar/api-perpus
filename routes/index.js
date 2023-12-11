import express  from "express";
import { CreateUser, deleteUser, getUsers, getUsersById, Login, Logout, Register, updateUser } from "../controller/UsersController.js";
import { CreateBuku, deleteBuku, getBuku, updateBuku } from "../controller/BukuController.js";
import { CreatePerpus, deletePerpus, getPerpus, updatePerpus } from "../controller/PerpusController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../middleware/refreshToken.js";

const app = express();
const router = express.Router();

router.get('/users', verifyToken,getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/token', refreshToken);


router.post('/users/add', CreateUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/buku', getBuku);
router.post('/buku', CreateBuku);
router.delete('/buku/:id', deleteBuku);
router.put('/buku/:id', updateBuku);

router.get('/perpus', getPerpus);
router.post('/perpus', CreatePerpus);
router.delete('/perpus/:id', deletePerpus);
router.put('/perpus/:id', updatePerpus);

export default router;