import express from 'express';
import { file, getimage, login, otplogin, otpverify, registeruser } from '../controller/auth.js';
import { upload } from '../controller/file_upload.js';
import { refreshfilter } from '../middleware/refreshfilter.js';


const router=express.Router();
router.post("/",registeruser);
router.post("/login",login);
router.post("/otp",otplogin);
router.post("/verify",otpverify);
router.post("/upload",upload.single("images"),file)
router.get("/getimg",getimage)

export default router