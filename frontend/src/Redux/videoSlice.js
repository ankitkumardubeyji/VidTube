import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import axios from "axios";
import { useSelector } from "react-redux";



const initialState = {
  videosData: [],
  userVideosData:[],
  currentVideo:0,
  currentVideoData:{},
};

// function to get all courses
export const getAllVideos = createAsyncThunk("/video/get", async () => {
  let result = []
  try {
    console.log("edhar to aaya")
    const res = axios.get("/api/v1/videos/");

    toast.promise(res, {
      loading: "Loading videos data...",
      success: (data)=>{
        result = data?.data?.data
        return data?.data?.message;
      }
      
    });
 await res;

    return result;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const publishVideo =  createAsyncThunk("/video/publishVideo",async(data)=>{
  console.log(data)
  console.log("ethe aata ")
  try{
    let result={}
    const res =  axios.post("/api/v1/videos/",data)
    toast.promise(res,{
        loading:"wait! uploading your video",
        success:(data)=>{
            Object.assign(result,data.data)
            console.log(data)
            return data?.data?.message;
        },
        error:"failed to upload video"
    })
    console.log("here comes the response")
    console.log(result)
     await res
    return result;
}

catch(error){
    console.log(error)
    toast.error(error?.response?.data?.message)
}
}
);


export const getVideoById =  createAsyncThunk("/video/getVideoById",async(data)=>{
  console.log(data)
  console.log("ethe aata ")
  try{
    let result ={}
    const res =  axios.get(`/api/v1/videos/${data}`)
    toast.promise(res,{
        loading:"wait! fetching required video",
        success:(data)=>{
            Object.assign(result,data.data)
            return data?.data?.message;
        },
        error:"failed to upload video"
    })
    console.log("here comes the response")
    console.log(result)
     await res
    return result;
}

catch(error){
    console.log(error)
    toast.error(error?.response?.data?.message)
}
}
);

export const updateViewsOnVideo = createAsyncThunk("video/updateViews",async(item)=>{
  console.log("chaliye atleast yha tak to aaya ")
  console.log(item)
  const res = axios.patch(`/api/v1/videos/uvc/${item}`)
    toast.promise(res,{
        loading:"wait! updating the views for the videos ",
        success:(data)=>{
            return data?.data?.message;
        },
        error:"sorry couldnt update the count of the videos"
    })
    console.log("here comes the response")

     await res
    return res;


})


export const getUserVideos = createAsyncThunk("video/getUserVideo",async(item)=>{

  try {
    console.log("edhar to aaya")
    const res = axios.get(`/api/v1/videos/u/${item}`)
    toast.promise(res, {
      loading: "Loading user videos data...",
      success: "Videos loaded successfully",
      error: "Failed to get videos",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})


export const updateCurrentVideo =  createAsyncThunk("/video/current",async(item)=>{
  console.log("here is item")
  console.log(item)
  return {payload:item}

}
);





const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAllVideos.fulfilled, (state, action) => {
        state.videosData = action.payload
      })
      .addCase(updateCurrentVideo.fulfilled, (state=initialState, action) => {
        if (action.payload) {
         
          console.log(action.payload)
         state.currentVideoData = action.payload.payload;  // the data returned by the updateCurrentVideo is being stored in the action.payload 
        }
      })
      .addCase(getUserVideos.fulfilled,(state,action)=>{
          if(action.payload){
            state.userVideosData = [{...action.payload}][0].data;
          }
      })
    ;
    },
    
  });



export const {} = videoSlice.actions;
export default videoSlice.reducer;
