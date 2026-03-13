import { checktoken, getotp, geturl, insertquery, inserttoken, loginquery, otpinsert, storepath, updateotp, updatetoken } from "../service/dbqueries.js";
import bcrypt from 'bcrypt';
import { accesstoken, refreshtoken } from "../tokens/tokens.js";
import path from "path";
import dotenv from 'dotenv';
import fs from 'fs';
import { queue } from "../background_worker/task_queue.js";
import { db } from "../dbconnection/db_connections.js";
import mime from 'mime';
dotenv.config();

//register the user
export const registeruser=async(req,resp)=>{
    const{name,email,password}=req.body;
    if(!name || !email || !password){
        return resp.status(400).json({success:false,message:"body not recived"})
    }
    try{
        const id= crypto.randomUUID();
        const hash=await bcrypt.hash(password,10)
        const insertcall=await insertquery({id,name,email,password:hash});
         resp.status(200).json({success:true,message:"insertion success"})
        await queue.add({
            to:email,
            sub:"welcome email",
            text:`your userid is ${id}` 
        })
        return
    }catch(err){
        console.log("error",err);
return resp.status(400).json({success:false,message:"insertion failed"})

    }
}


//login user

export const login=async(req,resp)=>{
    const{email,password}=req.body;
    if(!email || !password){
        return resp.status(400).json({success:false,message:"body not recived"})
    }
    try{
    const logincall=await loginquery({email})
    const compare=await bcrypt.compare(password,logincall[0].password) 
    if(!compare){
        return resp.status(400).json({success:false,message:"password is incorrect"})
    }
    const userid=logincall[0].id;
    
    const access=accesstoken(userid);
    let refresh;
   
    try{
   const findusertoken=await checktoken({userid}) 
   const tokendate=findusertoken[0].expired_at;
   const now=Date.now();
   if(now > tokendate){
    const addnewtoken=await updatetoken({userid})
    refresh=addnewtoken
   } else{
    refresh=findusertoken[0].token
   }
}catch(err){
refresh=inserttoken({userid})
}

resp.cookie("refresh",refresh,{
    httpOnly:true,
    secure:true,
    sameSite:"Lax",
    path:"/"
})

    return resp.status(200).json({success:true,message:"login success",accesss:access})

}catch(err){
return resp.status(400).json({success:false,message:"login failed"})
}
}


//otp generate and send to email
export const otplogin=async(req,resp)=>{
    const{email}=req.body;
    if(!email){
        return resp.status(400).json({success:false,message:"body not recived"})
    }
    const otp=Math.floor(10000 + Math.random() * 90000);
    console.log(otp)
    const id= crypto.randomUUID();
    try{
    const insertotp=await otpinsert({id,email,otp})
    queue.add({
        to:email,
        sub:"otp for login",
        text:`${otp}`
    })
    
    return resp.status(200).json({success:true,message:"otp sent succesfully"})


    }catch(err){
return resp.status(400).json({success:false,message:"otp set error"})
    }
}



//otp verification expiry && compare
export const otpverify=async(req,resp)=>{
    const{email,otp}=req.body;
    if(!email || !otp){
        return resp.status(400).json({success:false,message:"body not recived"})
    }
    try{
        console.log("entered try catch")
const verifyotp=await getotp({email})

const otpexpiry= verifyotp[0].expire_at;
const id=verifyotp[0].id;
const now=Date.now();
const expirytime=new Date(otpexpiry).getTime();

if(now > expirytime){
    const newotp=Math.floor(10000 + Math.random() * 90000)
    queue.add({
        to:email,
        sub:"new otp",
        text:`${newotp}`
    })
    const update=await updateotp({newotp,id})
    return resp.status(200).json({success:true,message:
        "new otp sent on email succesfully"
    })
}else{
    if(verifyotp[0].otp !== otp){
        return resp.status(400).json({success:false,message:"otp is incorrect"})
        }
    return resp.status(200).json({success:true,message:"login succesfully done"})
}

    }catch(err){
return resp.status(400).json({success:false,message:"otp verification failed"})
    }

}


export const file=async(req,resp)=>{
    if(!req.file){
        return resp.status(400).json({success:false,message:"no file recived"})
    }
     const filename=req.file.filename;
     const folder="upload"
   const filepath=path.join(folder,filename);
   try{
   const insertimage=await storepath({filename,url:filepath});
    return resp.status(200).json({success:true,message:"file upload success"})
}catch(err){
    return resp.status(400).json({success:false,message:"no file uploaded"}) 
}
}


export const getimage=async(req,resp)=>{
    const {filename}=req.body
    // const {filename}=req.query
    if(!filename){
        return resp.status(400).json({success:false,message:"no file name recived"})
    }
    try{
    const getimg=await geturl({filename})
    
    
    if(!fs.existsSync(getimg)){
        return resp.status(400).json({success:false,message:"no file on this path"})
    }
    const extname=path.extname(getimg).toLowerCase();
    // if(extname === ".png") resp.setHeader("Content-Type", "image/png")
    //     else if(extname === ".jpg" || extname === ".jpeg") resp.setHeader("Content-Type", "image/jpeg")
    // else if(extname === ".gif") resp.setHeader("Content-Type", "image/gif")
        const contenttype=mime.getType(extname);
    resp.setHeader("Content-Type",contenttype);
        fs.createReadStream(getimg).pipe(resp);
        
    return resp.status(200).json({success:true,message:"url fetch success"})

}catch(err){
    return resp.status(400).json({success:false,message:"url fetch filed"})
}
}
