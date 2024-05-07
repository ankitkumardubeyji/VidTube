import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import axios from "axios";
import { useSelector } from "react-redux";



const initialState = {
  LikesOnVideoData: [],
  LikedVideos:[],
  liked:false,
};

// function to get all courses
export const getLikesOnVideos = createAsyncThunk("/like/getLikes", async (data) => {
  try {
    console.log("edhar to aaya");
    console.log(data);
    const res = await axios.get(`/api/v1/likes/${data}`);
    const response = await res;
    return response.data;
  } catch (error) {
    console.error(error?.response?.data?.message);
    throw error;
  }
  
});


export const checkIfLikedVideo = createAsyncThunk("/like/check", async (data) => {
  try {
    console.log("edhar to check krana phuch gya tha");
    console.log(data);
    const res = await axios.get(`/api/v1/likes/cif/${data}`);
    const response = await res;
    return response.data;
  } catch (error) {
    console.error(error?.response?.data?.message);
    throw error;
  }
  
});







export const toggleLikeStatus = createAsyncThunk("/like/toggle", async (data) => {
  try {
    console.log("toggle krwana aaya tha nischit rahiye ")
    console.log(data)
    const res = axios.post(`/api/v1/likes/toggle/v/${data}`);

    toast.promise(res, {
      loading: "toggling the liked  status ",
      success: "liked  successfully toggled",
      error: "Failed to toggle the like ",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});



const likeSlice = createSlice({
    name: "like",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getLikesOnVideos.fulfilled, (state, action) => {
        if (action.payload) {
          state.LikesOnVideoData = [{...action.payload}][0].data;
        }
      })

      builder.addCase(checkIfLikedVideo.fulfilled, (state, action) => {
        if (action.payload) {
          state.liked = [{...action.payload}][0].data.length>0?true:false;
        }
      })
      
      builder.addCase(toggleLikeStatus.fulfilled, (state, action) => {
        if (action.payload) {
            state.liked = Object.entries([{...action.payload}][0].data).length>0?true:false;
        }
      })



    },
    
  });

export const {} = likeSlice.actions;
export default likeSlice.reducer;
