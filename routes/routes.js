import express from 'express';
import { login, registeruser } from '../controller/auth.js';


const router=express.Router();
router.post("/",registeruser);
router.post("/login",login);

export default router