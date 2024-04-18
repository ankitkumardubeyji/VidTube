import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAcessandRefeshToken = async(userId)=>{
    try{ 
      
    const user = await User.findById(userId)
   
    const accessToken = user.generateAccessToken() 
    const refreshToken = user.generateRefreshToken()
    //console.log(accessToken)
    //console.log(refreshToken)
    // setting the refreshToken of the user instance in the database
    user.refreshToken = refreshToken

    await user.save({validdateBeforeSave:false})
    console.log("edhsar");
    return {accessToken,refreshToken}
} 
catch(error){
    throw new ApiError(400,error.message)
}
}



const registerUser = asyncHandler( async(req,res,next)=>{
    console.log("here");
    console.log(req.body)
    const {fullName,username,email,password} = req.body
    // check if all the fields are present or not
    if([fullName,email,username,password].some((field)=>field.trim=="")){
        throw new ApiError(400,`${field} is also required`)
    }
    console.log("here")
    // checking if there already exists user with given username / email
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    console.log("edba")
    if(existedUser){
        throw new ApiError(400,`user already exists`)
    }

    // handling the file with multer
    console.log(req.files)

    const avatarLocalPath = req.files.avatar[0]?.path 
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file required")
    }

    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.file.coverImage.length>0){
        coverImageLocalPath = req.file.coverImage[0]?.path
    }

    // uploading the images on cloudinary and extracting the url
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar file is required")
    }

    // creating the user with the above details
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    // checking if the user gets successfully created or not
    const createdUser = await User.findById(user._id).select('-password -refreshToken')
    console.log(createdUser)
    
    if(!createdUser){
        console.log("here")
        throw  new ApiError(500,"something went wrong while registering the user")
    }

    const {accessToken,refreshToken} = await generateAcessandRefeshToken(createdUser._id)

    return res.status(200)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",refreshToken)
    .json(
       new ApiResponse(
        200,
        {
            user:createdUser,
            accessToken,
            refreshToken 
        },
        "user registered in successfully"
       ) 
    )

})


const loginUser = asyncHandler(async(req,res)=>{
    console.log("came under the login section")
    const {username,email,password} =  req.body
    console.log(req.body)
    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }

    // checking if the user with the email or password exists or not.
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"user with the given username or the email doesnt exist")
    }

    // now verfifying the password
    const isPasswordValid = user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAcessandRefeshToken(user._id)

    console.log(accessToken)
    console.log(refreshToken)
    // Getting the loggedinUser leaving the password and the refreshToken
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

     
    const options = {
       httpOnly:true,
       secure:true 
    }

    return res.status(200)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",refreshToken)
    .json(
       new ApiResponse(
        200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken 
        },
        "user logged in successfully"
       ) 
    )
})


// before logging out the user must be checked whether the user is logged in or not.
// we need the information of the user to get logout
// we will be extracting the information of the user from the cookies saved in browser.
// for this we will require the middleware that will inject the information of the user before request comes to logout

// find the  user with the given id in the database and setting its refreshToken as undefined in the database
// removing the accessToken and the refreshToken stored in the cookies.

const logOutUser = asyncHandler(async(req,res)=>{
    console.log("came here for logout")
    
    // finding the user with the required id and setting it as undefined in the database
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:1 // whatever field you wanna unset write as 1
        }
    }, 
    {
        new :true,
    })

    const options = {
        httpOnly:true,
        secure:true 
    }

    // clearing the accesstoken and the refresh token from the cookies
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loggged out successfully"))
})


const refreshAccessToken = asyncHandler(async(req,res)=>{

    // extracting the refresh token store in the cookies
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"UnAuthorised request")
    }

    try{
    // extracting the payload /data stored in the encrypted incomingRefreshToken
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

    // finding the user with the help of id stored in the payload
    const user = await user.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401,"invalid refresh Token")
    }

    // if user exists then verify the incoming refesh token with the refresh token stored in the database.
    if(incomingRefreshToken != user.refreshToken){
        throw new ApiError(401,"the refresh token sessio has expired")
    }

    const {accessToken,newRefreshToken} = await generateAcessandRefeshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save({validdateBeforeSave:false})

    const options={
        httpOnly:true,
        secure:true,
    }

    return res.status(200)
    .cookies("accessToken",accessToken)
    .cookies("refreshToken",newRefreshToken)
    .json(
        new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"access token refreshed")
    )
    


}
catch(err){
    throw new ApiError(400,err?.message || "invalid refreshToken")
}
}

)



 const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword} = req.body
    console.log(oldPassword)
    console.log(newPassword)
    console.log(confirmPassword)
    if(confirmPassword!=newPassword){
        throw new ApiError(400,"Newpassword and the confirm password didnt matched")
    }
    // Error: data and hash arguments required
    // resolved by removing select("-password") from below , and adding validatebeforesave false before save.
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Old password is invalid")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false}) // Error: data and hash arguments required : handled with validateBeforeSave

    return res.status(200).json
    (new ApiResponse(200,user,"password chnaged successfully"))
 })
  
 const getCurrentUser = asyncHandler(async(req,res)=>{
    console.log(req.user)
    console.log("hare ram hare krishna")
    return res.status(200).json(
        new ApiResponse(200,req.user,"Current user details successfully fetched")
    )
 })

 const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body
    if(!(fullName||email)){
        throw new ApiError(400,"Please provide some field fo updation")
    }
    const user = await User.findById(req.user?._id,
        {$set:{
            fullName,
            email,
        }
    },
    {new:true}
    )

    res.status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"))
 })

 const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file doesnt exists")
    }
    const avatar = uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Avatar file couldnt be uploaded on cloudinary")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {$set:{
            avatar:avatar.url
        }
    },
    {new:true}
    )
   
 })
 
 const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"CoverImage couldnt be found");
    }

    const coverImage = uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400,"cover image could nt be uploaded on cloudinary")
    }

    // TODO: delete the old image - assignment
    const user = await User.findByIdAndUpdate(
        req.user,
        {$set:{
            coverImage:coverImage.url
        }
    },
    {new:true})
    
    return res.staus(200)
    .json(new ApiResponse(200,user,"coverImage Updated successfully"))
    })


const getUserById = asyncHandler(async(req,res)=>{
    console.log("hine to phuch gya tha ")
    
    const {id} = req.params
    console.log(id)
    const user = await User.findById(id)

    if(!user){
        throw new ApiError(400,"requested user doesnt exists")
    }

    res.status(200)
    .json(new ApiResponse(200,user,"user data fetched successfully"))
})    

 
const getUserChannelProfile = asyncHandler(async(req,res)=>{

    // extracting the username/channel from the url
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    // joining the subscriptions collection with the users collection to store the information of subscriptions collections documents
    // inorder to know the subcribers, no of channel subscribed by the channel and whether the currentUser has
    // subscribed to the channel or not.

    const channel = await  User.aggregate([
        {
        $match:{
            username : username?.toLowerCase() // finding the document in the users collection with the given username
        }
    },

    {
        // looking into the subsriptions collections and checking the documents whose channel matches with the localfield _id, to know the subscribers of the channel
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"

        }
    },

    {

// looking into the subscriptions collection and finding out te doucnents whose subscription mathes with the localField id , to get to know the channels subscribed by the current Channel username

        $lookup:{
            from :"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },

    {
        $addFields:{
            subscribersCount:{
                $size:"$subscribers"
            },

            channelsSubscribedToCount:{
                $size :"$subscribedTo"
            },

            isSubscribed:{
                // checking if any of the documents in the subscribers has the subscriber matching with the current user id , if it is then yes the current user is the subscriber.
                $cond:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,
                    else:false,
                },

            }

        }
    },

    {
    $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
    }
}

    ])

    if(!channel?.length){
       throw new ApiError(400,"channel doesnt exists") 
    }


    return res.status(200)
    .json(new ApiResponse(200,channel[0],"User channel fetched successfully"))

})


const updateWatchHistory = asyncHandler(async(req,res)=>{
    console.log*("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    console.log("watch history update krane aaye hi mhi")
    let {videoId} = req.params
   console.log("here comes the video id "+videoId)
    const user = await User.findById(req.user?._id)
    
    
    console.log(user.watchHistory)
    user.watchHistory = user.watchHistory.filter((item)=>item!=videoId)
    console.log(user.watchHistory)
   
    if(user.watchHistory.length==0){
        user.watchHistory.push(new mongoose.Types.ObjectId(videoId))
    }
    else{
        user.watchHistory.unshift(new mongoose.Types.ObjectId(videoId));
    }
  
  // user.listenHistory = []
  console.log(user)
    await user.save({validateBeforeSave:false})
    console.log("there in watch history")
    const updatedUser = await User.findById(req.user?._id)
    console.log("-----------------------------------------------------------------------------------------")
    console.log(updatedUser.watchHistory)
    console.log("*****************************************************************************************")
    res.status(200)
    .json(new ApiResponse(200,updatedUser,"User watch history successfully updated"))
})


const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            // got the document whose watch history is to be found out
            $match:{
                _id:new mongoose.Types.ObjectId(req.user?._id)
            }
        },

        {
            $lookup:{
                // getting multiple videos documents , getting all the videos whose id matches with the user watchHistory
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",

                // in all the video documents individually we are adding the information of the required user, getting the user whose id matches with current individual video owner
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                       // we want limited information of the user to be stored corresponding to  the ownwer     
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        userName:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },

                    // extracting the object from the array and getting stored in the owner

                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }


                ]

            }
        }

    ])

    return res.status(200)
    .json(new ApiResponse(200,
        user[0].watchHistory.reverse(),
        "watch history fetched successfully"
        ))
})





export {registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getUserById,
    updateWatchHistory,
}

