import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    console.log("comment dekhne phuch gye")
    //TODO: get all comments for a video
    const {videoId} = req.params
    //const {page = 1, limit = 10} = req.query

    const comment = await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId) 
            }
        },

        {

            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",

                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            avatar:1 ,
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
    console.log(comment)
    if(comment){
        res.status(200)
        .json(new ApiResponse(200,comment,"comment on the videos found out successfully "))
    }

    else{
        res.staus(200)
        .json(new ApiResponse(200,{},"no comment found on the videos "))
    }
})

const addComment = asyncHandler(async (req, res) => {
    console.log("htt bsdka");
    console.log(req.body);
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {comment} = req.body
    

    const newComment = await Comment.create({
        video:videoId,
        content:comment,
        owner:req.user?._id,
    })

    const publishedComment = await Comment.findById(newComment?._id)



    res.status(200).json(
        new ApiResponse(200,publishedComment,"Successfully added comment to the video")
    )
})


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} =req.params
    console.log(commentId)
    console.log(req.body)
    const {content} = req.body
    console.log(content)
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content
            }
        },
        {new:true}
        )

        res.status(200).json(new ApiResponse(200,comment,"comment got updated successfully"))
})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const {content} = req.body
    const comment = await Comment.findByIdAndDelete(commentId)

        res.status(200).json(new ApiResponse(200,comment,"comment got deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }