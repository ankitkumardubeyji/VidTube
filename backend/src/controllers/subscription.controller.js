import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    console.log("hine tak phuchi gail hailo ")
    const {channelId} = req.params
    // TODO: toggle subscription
    const subscribe = await  Subscription.find({subscriber:req.user?._id,channel:channelId}) // find returns the array of document that satisfies the given attribute.
        
    // if subscription doesnt exists then adding the subscription ie creating new subscription document
    if(subscribe.length==0){
       const newSubscribe =  await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId 
       })

       const publishSubscriber = await Subscription.findById(newSubscribe._id)
       return res.status(200)
       .json(new ApiResponse(200,publishSubscriber,"subscription toggled user successfully subscribed"))
    }

    // whenever a subscriber subscribes a new document gets created when the subscriber unsubscribes the old document gets deleted
    else{
    
       const del = await Subscription.findByIdAndDelete(subscribe[0]._id)
       return res.status(200)
       .json(new ApiResponse(200,{},"subscription toggled user subscription removed"))
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    console.log(channelId)
    const subscribe = await Subscription.find({channel:channelId})


    return res.status(200)
    .json(new ApiResponse(200,subscribe,"the subscribers of the channel successfully fetched"))
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
 

   
    
    const subscribe = await Subscription.aggregate([
        {
            $match:{
                subscriber:req.user._id
            }
        },

        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            userName:1,
                            _id:1,
                            avatar:1, 
                        }
                    }
                ]
            }
        },

        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,subscribe,"the channels that the user has subscribed successfully fetched"))

})


const checkIfSubscribedChannel = asyncHandler(async(req,res) =>{
    console.log("here came atleast")
    const {channelId} = req.params
    

    const subscribe = await Subscription.find({subscriber:req.user?._id,channel:channelId})

    if(subscribe.length>0){
        return res.status(200)
        .json(new ApiResponse(200, subscribe,"the user has subscribed the channel "));
    }

    else{
        return res.status(200)
        .json(new ApiResponse(200, {},"Sorry the user has not subscribed the channel"));
    }
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkIfSubscribedChannel,
}