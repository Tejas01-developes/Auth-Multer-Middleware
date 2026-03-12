import jwt from 'jsonwebtoken';
import { accesstoken } from '../tokens/tokens.js';

export const refreshfilter=(req,resp,next)=>{
    const refreshh=req.cookies.refresh

    if(!refreshh){
        return resp.status(400).json({success:false,message:"no refresh token"})
    }
    jwt.verify(refreshh,process.env.REFRESH_SECRET,(err,decode)=>{
        if(err){
            return resp.status(400).json({success:false,message:"refresh token verification failed"})
        }
        req.id=decode;
        
        const access=accesstoken(req.id)
        next();
    })
}