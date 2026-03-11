import { checktoken, insertquery, inserttoken, loginquery, updatetoken } from "../service/dbqueries.js";
import bcrypt from 'bcrypt';
import { accesstoken, refreshtoken } from "../tokens/tokens.js";
import path from "path";
import { stringify } from "querystring";

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
        return resp.status(200).json({success:true,message:"insertion success"})
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
    console.log(access)
    
   const findusertoken=await checktoken({userid})

   const tokendate=findusertoken[0].expired_at;
   console.log(tokendate)
   const now=Date.now();
   if(now > tokendate){
    const addnewtoken=await updatetoken({userid})
   } 
   
resp.cookie("refresh",,{
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

