import express from 'express';
import { login, otplogin, otpverify, registeruser } from '../controller/auth.js';


const router=express.Router();
router.post("/",registeruser);
router.post("/login",login);
router.post("/otp",otplogin);
router.post("/verify",otpverify);

export default router