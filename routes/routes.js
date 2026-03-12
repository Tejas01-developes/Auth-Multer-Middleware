import express from 'express';
import { file, login, otplogin, otpverify, registeruser } from '../controller/auth.js';
import { upload } from '../controller/file_upload.js';
import { refreshfilter } from '../middleware/refreshfilter.js';


const router=express.Router();
router.post("/",registeruser);
router.post("/login",login);
router.post("/otp",otplogin);
router.post("/verify",otpverify);
router.post("/upload",refreshfilter,upload.single("images"),file)

export default router