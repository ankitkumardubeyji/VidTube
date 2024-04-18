import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async(req,res,next)=>{
    // extracting the token form the cookies 
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        throw new ApiError(400,"UnAuthorised request")
    }

    // if the token is valid then jwt.verify will be returning the data stored in the token .
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    // finding the user with the id stored in the token.
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"invalid access token")
    }  

    req.user = user;
    next()
}

catch(error){
    throw new ApiError(401,error?.message || "Invalid acccess token")
}
})
