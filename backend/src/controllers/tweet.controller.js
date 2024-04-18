import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const tweet = await Tweet.create({
        content,
        owner:req.user?._id 
    })

    res.status(200)
    .json(new ApiResponse(200,tweet,"successfully added the tweet"))
})


const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;
    const tweet = await Tweet.find({owner:userId})

    if(!tweet){
        throw new ApiError(400,"no tweet of the given user exists")
    }
    res.status(200)
    .json(200,tweet,"user tweets successfully fetched")



})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body 
    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set:{
                content, 
            }
        },{
            new:true 
        })

    res.status(200)
    .json(new ApiResponse(200,tweet,"tweet successfully updated"))    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    const del = await Tweet.findByIdAndDelete(tweetId)
    
    if(!del){
        throw new ApiError(400,"no tweets of given id found")
    }
    res.status(200)
    .json(new ApiResponse(200,del,"tweet successfully deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}