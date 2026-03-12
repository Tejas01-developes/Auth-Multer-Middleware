import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createtransport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_NAME,
        pass:process.env.EMAIL_PASS
    }
})


export const sendmail=async(to,subject,text)=>{
    createtransport.sendMail({
        from:process.env.EMAIL_NAME,
        to,
        subject,
        text
    })
}