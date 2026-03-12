import jwt from 'jsonwebtoken';

export const accessfilter=(req,resp,next)=>{
    const access=req.headers.authorization?.split(" ")[1]

    if(!access){
        return resp.status(400).json({success:false,message:"no access token"})
    }
    jwt.verify(access,process.env.ACCESS_SECRET,(err,decode)=>{
        if(err){
            return resp.status(400).json({success:false,message:"access token verification failed"})
        }
        req.id=decode;
        next();
    })
}