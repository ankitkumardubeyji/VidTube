import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async()=>{
    try{
        const connect  =  await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`,{
            writeConcern: { w: 'majority' },
        })
    console.log(`Connected to the database ${connect.connection.host}`);
}
    catch(err){
        console.log("Database connection error:"+err)
        process.exit(1)
    }
}

