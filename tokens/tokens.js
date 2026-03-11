import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const accesstoken=(user)=>{
    return jwt.sign(
        {id:user},
        process.env.ACCESS_SECRET,
        {expiresIn:'10m'},
        console.log("process reached here")
    )
}

export const refreshtoken=(user)=>{
    return jwt.sign(
        {id:user},
        process.env.REFRESH_SECRET,
        {expiresIn:'7d'}
    )
}