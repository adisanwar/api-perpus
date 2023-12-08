import express  from "express";
import { CreateUser, deleteUser, getUsers, getUsersById, Login, Register, updateUser } from "../controller/Users.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', Register);
router.post('/login', Login);

router.post('/users/add', CreateUser);
router.put('/users/:id', updateUser);



router.delete('/users/:id', deleteUser);

export default router;