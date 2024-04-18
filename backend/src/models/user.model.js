import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, // enabling the searching functionality based on index.
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },

    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true, // enabling the searching to be done based on username
    },

    // uploading the images in the cloudinary and storing its url in db
    avatar:{
        type:String,
        required:true,
    },

    coverImage:{
        type:String,
    },

    // storing the array of previously watched videos in the db.
    watchHistory:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video" // passing the name of the schema as the reference.
        }    
    ],

    password:{
        type:String,
        required:[true,'password is required']
    },

    refreshToken:{
        type:String
    },
 
},{timestamps:true})

// adding custom middlewares to db , that will execute the callback functionality just before the data save even
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next ();
    }
    console.log("here"+this.password)
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password) 
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    
    process.env.ACCESS_TOKEN_SECRET,

    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    },
    
    process.env.REFRESH_TOKEN_SECRET,

    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

    )
}

export const User = new mongoose.model("User",userSchema) // we can extract the functionality of database using the User that exists in left
