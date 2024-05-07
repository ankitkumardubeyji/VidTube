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

export const getAllSubscribers = createAsyncThunk("/sub/subscribers", async (data) => {
  try {
    console.log("edhar to aaya");
    console.log(data);
    const res = await axios.get(`/api/v1/subscriptions/u/${data}`);
    
    const response = await res;
    
    return response.data;
  } catch (error) {
    console.error("Failed to get subscribers:", error);
    throw error; // You can handle or customize the error further as needed
  }
  
});


export const checkIfSubscribedChannel = createAsyncThunk("/sub/check", async (data) => {
  try {
    console.log("edhar to aaya");
    console.log(data);
    const res = await axios.get(`/api/v1/subscriptions/cif/${data}`);
    const response = await res;
    return response.data;
  } catch (error) {
    console.error(error?.response?.data?.message);
    throw error;
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


export const getSubscribed = createAsyncThunk("/sub/subscribed",async(data)=>{
  const res = axios.get("/api/v1/subscriptions/")
  let result = []
  toast.promise(res,{
    loading:"wait loasding",
    success:(data)=>{
      result = data?.data?.data?.data; 
      return data?.data?.message 
    }
  })
  await res;
  return (await res).data;
})
  













const subSlice = createSlice({
    name: "sub",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAllSubscribers.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribersData = [{...action.payload}][0].data;
          console.log(state.subscribersData);
        }
      })

      builder.addCase(checkIfSubscribedChannel.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribed = [{...action.payload}][0].data.length>0?true:false;
          console.log([{...action.payload}][0].data);
        }
      })

      builder.addCase(toggleSubscriptionStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscribed = Object.entries([{...action.payload}][0].data).length>0?true:false;
        }
      })

      builder.addCase(getSubscribed.fulfilled,(state,action)=>{
        state.subscribedData = action.payload;
        console.log(state.subscribedData)
      })
    },
    
  });

export const {} = subSlice.actions;
export default subSlice.reducer;
