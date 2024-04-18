import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import axios from "axios";
import { useSelector } from "react-redux";



const initialState = {
    commentsOnVideoData: []
};

// function to get all courses
export const getCommentsOnVideos = createAsyncThunk("/comment/getComents", async (data) => {
  try {
    console.log("Humare yha toh bdwbduwb")
    console.log(data)
    const res = axios.get(`/api/v1/comments/${data}`);

    toast.promise(res, {
      loading: "Loading the comments on videos  data",
      success: "Loaded comments on the videos successfully ",
      error: "Failed to get the comments on the videos ",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});



const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getCommentsOnVideos.fulfilled, (state, action) => {
        if (action.payload) {
          state.commentsOnVideoData = [{...action.payload}][0].data;
        }
      })

    

    },
    
  });

export const {} = commentSlice.actions;
export default commentSlice.reducer;
