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
    console.log("Humare yha toh bdwbduwb");
    console.log(data);
    const res = await axios.get(`/api/v1/comments/${data}`);
    const response = await res;
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error?.response?.data?.message);
    throw error;
  }
  
});

export const addCommentOnVideos = createAsyncThunk(
  "comment/addComment",
  async ( {id, comment}) => { // Destructure id and data from the payload
    try {
      console.log(id);
      console.log(comment);
      const res = axios.post(`/api/v1/comments/${id}`, {comment:comment});
      toast.promise(res,{
        loading:"wait posting your comment",
        success:(data)=>{
          console.log(data);
          return data?.data?.message;
        }
      })

      await res;
      return res.data;
    } 
    
    catch (error) {
      // Handle errors
      console.error('Error posting comment:', error);
      throw error;
    }
  }
);


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
