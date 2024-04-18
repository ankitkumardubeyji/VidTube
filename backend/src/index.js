import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path:'../.env' 
})

import { connectDb } from "./db/index.js";
connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Sever successfully started at the localhost ${process.env.PORT} `)
    })
})
.catch((err)=>{
    console.log("Some error occured in starting the server "+err)
})


