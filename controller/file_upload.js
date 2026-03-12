import multer from 'multer';
import fs from 'fs';
import path from 'path';



const uploadfolder="upload"
if(!fs.existsSync(uploadfolder)){
    fs.mkdirSync(uploadfolder,{recursive:true});
}
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadfolder)
    },

    filename:function(req,file,cb){
        const ext=path.extname(file.originalname);
        const name=path.basename(file.originalname,ext);
        const uniquename=name + "-" + Date.now() + ext
        cb(null,uniquename)
    }
})


const filefilter=(req,file,callback)=>{
    const allowedtype= /jpeg|jpg|png|gif/
    const extname=allowedtype.test(path.extname(file.originalname).toLowerCase());
    const mimetype=allowedtype.test(file.mimetype)
    if(extname && mimetype){
        return callback(null,true)
    }else{
        callback(new Error("only images are allowed"))
    }
}


export const upload=multer({
    storage:storage,
    limits:{fileSize:5 * 1024 * 1024},
    fileFilter:filefilter
})