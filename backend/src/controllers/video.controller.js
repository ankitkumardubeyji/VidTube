import mongoose, {Mongoose, isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { Playlist } from "../models/playlist.model.js"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"



const getAllVideos = asyncHandler(async (req, res) => {
    console.log("edhar")
    let { page = 1,
            limit = 10,
            query,
            sortBy,
            sortType,
            userId ,
            fullName
        } = req.query;

    // Parse page and limit to numbers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Validate and adjust page and limit values
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.min(20, Math.max(1, limit)); // Ensure limit is between 1 and 20

    const pipeline = [];

    if(fullName){
        const user = await User.find({fullName:fullName})
        console.log(user)
        for(let i=0;i<user.length;i++){
            pipeline.push({
                $match: {
                    owner: new mongoose.Types.ObjectId(user[i]._id)
                }
            });
        }
    }

    
    // Match videos by owner userId if provided
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "userId is invalid");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    // Match videos based on search query
    if (query) {
        pipeline.push({
            $match: {
                $text: {  // based on text it will search in the document if the document title, description matches with the text
                    $search: query
                }
            }
        });
    }

    // Sort pipeline stage based on sortBy and sortType
    const sortCriteria = {};
    if (sortBy && sortType) {
        sortCriteria[sortBy] = sortType === "asc" ? 1 : -1;
        pipeline.push({
            $sort: sortCriteria
        });
    } else {
        // Default sorting by createdAt if sortBy and sortType are not provided
        sortCriteria["createdAt"] = -1;
        pipeline.push({
            $sort: sortCriteria
        });
    }

    // Apply pagination using skip and limit
    pipeline.push({
        $skip: (page - 1) * limit
    });
    pipeline.push({
        $limit: limit
    });

    // getting the videos owner information
    pipeline.push({
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {
                    $project:{
                        fullName:1,
                        avatar:1,
                        
                    }
                }
               
            ]
        },
    })

    pipeline.push(   {
        $addFields:{
            owner:{
                $first:"$owner"
            }
        }
    })

    // Execute aggregation pipeline
    const Videos = await Video.aggregate(pipeline);

    if (!Videos || Videos.length === 0) {
        throw new ApiError(404, "Videos not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, Videos, "Videos fetched Successfully"));
});


const searchVideo = asyncHandler(async(req,res)=>{
    
console.log("humare pass marane aaya tha")
    console.log("edhar")
    let { page = 1,
            limit = 10,
            query,
            sortBy,
            sortType,
            userId ,
            fullName
        } = req.query;

    // Parse page and limit to numbers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Validate and adjust page and limit values
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.min(20, Math.max(1, limit)); // Ensure limit is between 1 and 20

    const pipeline = [];


    // Match videos based on search query
   // Match videos based on search query
if (query) {
    console.log("query")
    pipeline.push({
        $match: {
            $text: {
                $search: query
            }
        }
    });
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    });
    pipeline.push({
        $addFields: {
            owner: {
                $first: "$owner"
            }
        }
    });
}

if (fullName) {
    console.log("fullname")
    const users = await User.find({ fullName: fullName });
    if (users.length === 0) {
        console.log("here")
        throw new ApiError(400, "user not found");
    }
    console.log(users)
    for (let i = 0; i < users.length; i++) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(users[i]._id)
            }
        });
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        });
        pipeline.push({
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        });
    }
}

// Sort pipeline stage based on sortBy and sortType
const sortCriteria = {};
if (sortBy && sortType) {
    sortCriteria[sortBy] = sortType === "asc" ? 1 : -1;
    pipeline.push({
        $sort: sortCriteria
    });
} else {
    sortCriteria["createdAt"] = -1;
    pipeline.push({
        $sort: sortCriteria
    });
}

pipeline.push({
    $skip: (page - 1) * limit
});
pipeline.push({
    $limit: limit
});

// Execute aggregation pipeline
const videos = await Video.aggregate(pipeline);

if (!videos || videos.length === 0) {
    throw new ApiError(404, "Videos not found");
}

return res.status(200).json(new ApiResponse(200, videos, "Videos fetched Successfully"));

});



const publishAVideo = asyncHandler(async (req, res) => {
    console.log('publish krne phuch gye video')
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!(title||description)){
        throw new ApiError(400,"title or description is required")
    }

    const videoLocalFile = req.files?.videoFile[0]?.path;
    const thumbnailLocalFile = req.files?.thumbnail[0]?.path;


    if(!videoLocalFile){
        throw new ApiError(400,"local file doesnt exists")
    }


    if(!thumbnailLocalFile){
        throw new ApiError(400,"thumbnail doesnt exists")
    }

    const video = await uploadOnCloudinary(videoLocalFile)

    if(!video.url){
        throw new ApiError(400,"video file couldnt be uploaded on cloudinary")
    }

    const thumbnail =await uploadOnCloudinary(thumbnailLocalFile)
    if(!thumbnail.url){
        throw new ApiError(400,"thumbnail couldnt be uploaded on cloudinary")
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile:video?.url ,
        duration: video?.duration,
        thumbnail:thumbnail?.url,
        isPublished:true,
        owner:req.user?._id, 
    })


    const publishedVideo = await Video.findById(newVideo?._id);
    res.status(200)
    .json(new ApiResponse(200,publishedVideo,"Video and thumbnail published successfully"))
})


const updateVideosCount = asyncHandler(async(req,res)=>{
    console.log("came here with the videos")
    const {videoId} = req.params
    const newVideo = await Video.findByIdAndUpdate(videoId) 
        if(!newVideo){
            throw new ApiError("Video with the given id couldnt be fetched ")
        }
        newVideo.views = newVideo.views+1
        await newVideo.save({validateBeforeSave:false})

       const updatedVideo = await Video.findById(videoId)
       console.log(updatedVideo)


        return res.status(200)
        .json(new ApiResponse(200,updatedVideo,"Video views got updated successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    console.log()
    const { videoId } = req.params
    //TODO: get video by id
    console.log(videoId)

    const video = await Video.findById(videoId)
    console.log(video.owner.toString())
    console.log(req.user._id.toString())

    // giving the access of the video only to the user who has published the video, if the request of the video has not come from the user who has published the video, then dont show video
    if(!video  || !video?.isPublished || !(video?.owner.toString() === req.user?._id.toString())){
        throw new ApiError(400,"video with the given id doesnt exists ")
    }

    res.status(200).json(
        new ApiResponse(200,video,"Video information successfully received")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    console.log("here")
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(404,"Video id is required")
    }

    //TODO: update video details like title, description, thumbnail

    const video = await Video.findById(videoId);
    console.log(video)

    if(!video){
        throw new ApiError(404,"video doesnt not exists")
    }

    const authorised = video.owner.toString()== req.user?._id.toString()

    if(!authorised){
        throw new ApiError(404,"user not authorised to access the video")
    }
 
    const {title,description} = req.body

    if(!title || !description){
        throw new ApiError(404,"title or description is required")
    }
    
    const thumbnailLocalFile = req.file?.path;
    
    console.log(thumbnailLocalFile)
    
    if(!thumbnailLocalFile){
        throw new ApiError(400,"thumbnail file doesnt exists in server")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalFile)
    if(!thumbnail.url){
        throw new ApiError(400,"thumbnail could nt be uploaded on cloudinary")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                title,
                description,
                thumbnail:thumbnail.url,
            },
            
        },
        {new:true}
        )

        if(!updatedVideo){
            throw new ApiError(500,"something went wrong in updating the video")
        }
        
res.status(200)
.json(new ApiResponse(200,updatedVideo,"Video successfully updated"))
})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(404,"video id is required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video doesnt exists")
    }

    const authorised = video.owner.toString()== req.user?._id.toString()

    if(!authorised){
        throw new ApiError(300,"unauthrorised access")
    }

    const videoDeleted = await Video.findByIdAndDelete(videoId)

    

    // if there is no video then there is not any relevance to store the like and comments on the video.
    await Comment.deleteMany({video:videoId})
    await Like.deleteMany({video:videoId})


    // removing the video if it exists in any of the playlists.

    const playlists = await Playlist.find({videos:videoId}) // will return the array of playlists containing that video
    for(const playlist of playlists){
        
        // we are iterating through those playlists one by one and and from those playlists we are removing the video with videoId
        await Playlist.findByIdAndUpdate(Playlist._id,
            {
                $pull:{videos:videoId}
            },

            {
                new:true 
            }
            )
    }
    
    if(!videoDeleted){
        throw new ApiError(400,"Some error happened in deleting the video")
    }


    res.status(200)
    .json(new ApiResponse(200,videoDeleted,"Video got deleted successfully"))
})


const getUserVideos = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    
    const video = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
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
                            username:1,
                            avatar:1,
                            _id:1
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
    
    if(!video){
        throw new ApiError(400,"No Videos of the user got found out")
    }
    
    res.status(200).json(new ApiResponse(200,video,"video of the demanded user got successfully found out "))

})




const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log(videoId)

    if(!videoId){
        throw new ApiError(404,"video id is required")
    }


    const  video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"video doesnt exists")
    }

    const authorised = (video.owner.toString() == req.user._id )
    
    if(!authorised){
        throw new ApiError(400,"UnAuthorised access ")
    }
    
    video.isPublished = !video.isPublished,
    await video.save({validateBeforeSave:false})

    res.status(200).json(
        new ApiResponse(200,video,"video status successfully toggled")
    )
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateVideosCount,
    getUserVideos,
    searchVideo
}