import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import axios from "axios";
import { useSelector } from "react-redux";



const initialState = {
  subscribersData: [],
  subscribedData:[],
  subscribed:false 
};

// function to get all courses
export const getAllSubscribers = createAsyncThunk("/sub/subscribers", async (data) => {
  try {
    console.log("edhar to aaya")
    console.log(data)
    const res = axios.get(`/api/v1/subscriptions/u/${data}`);

    toast.promise(res, {
      loading: "Loading subscribers data",
      success: "Loaded subscribers successfully",
      error: "Failed to get subscribers",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


export const checkIfSubscribedChannel = createAsyncThunk("/sub/check", async (data) => {
  try {
    console.log("edhar to aaya")
    console.log(data)
    const res = axios.get(`/api/v1/subscriptions/cif/${data}`);

    toast.promise(res, {
      loading: "checking if subscribed the channel",
      success: "subscription information successfully received",
      error: "Failed to get subscribers",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const toggleSubscriptionStatus = createAsyncThunk("/sub/toggle", async (data) => {
  try {
    console.log("edhar to aaya")
    console.log(data)
    const res = axios.post(`/api/v1/subscriptions/c/${data}`);

    toast.promise(res, {
      loading: "toggling the subscription status ",
      success: "subscription successfully toggled",
      error: "Failed to toggle the subscription",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});















const subSlice = createSlice({
    name: "sub",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAllSubscribers.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribersData = [{...action.payload}][0].data;
        }
      })

      builder.addCase(checkIfSubscribedChannel.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribed = [{...action.payload}][0].data.length>0?true:false;
        }
      })

      builder.addCase(toggleSubscriptionStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribed = Object.entries([{...action.payload}][0].data).length>0?true:false;
        }
      })
    },
    
  });

export const {} = subSlice.actions;
export default subSlice.reducer;
