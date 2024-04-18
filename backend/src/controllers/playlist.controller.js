import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    console.log(req.body)

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner:req.user?._id
    })

    console.log(newPlaylist)

    //TODO: create playlist
    const publishedPlaylist = await Playlist.findById(newPlaylist._id)

    res.status(200)
    .json(new ApiResponse(200,publishedPlaylist,"the playlist got successfully created"))
})



const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlist = await Playlist.find({owner:userId})
    if(!playlist){
        throw new ApiError(400,"Sorry no playlist of user exists")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"User playlist successfullly found out"))
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400,"Sorry no playlist of user exists")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist," playlist successfullly found out"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId)
    playlist.videos.push(videoId),
    await playlist.save({validateBeforeSave:false})

    const newPlaylist = await  Playlist.findById(playlistId)

    res.status(200)
    .json(new ApiResponse(200,newPlaylist,"video got successfully added to the playlists"))
           
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist = await Playlist.findById(playlistId)
    playlist.videos = playlist.videos.filter((video)=> video!=videoId)

    await playlist.save({validateBeforeSave:false})

    const newPlaylist = await Playlist.findById(playlistId)
    res.status(200)
    .json(new ApiResponse(200,newPlaylist,"Video successfully removed from the playlists"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const del = await Playlist.findByIdAndDelete(playlistId)
    if(!del){
        throw new ApiError(400,"no playlist with given id exists")
    }
    res.status(200)
    .json(new ApiResponse(200,del,"playlist got successfully deleted"))
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                name,
                description
            }
        },
        
        {new:true}
        )
        console.log("here")
        console.log(newPlaylist)

     res.status(200)
     .json(new ApiResponse(200,newPlaylist,"playlist got successfully updated"))   
})



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}