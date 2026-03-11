import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import './dbconnection/db_connections.js'
dotenv.config();

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/apis",router);


app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}` )
})

