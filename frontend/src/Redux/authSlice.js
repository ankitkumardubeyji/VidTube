import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import axios from "axios";
import { useEffect } from "react";

const isLoggedInString = localStorage.getItem("isLoggedIn");
const isLoggedIn = isLoggedInString ? isLoggedInString === 'true' : false;

let data;
try {
    const dataString = localStorage.getItem("data");
    data = dataString ? JSON.parse(dataString) : {};
} catch (error) {
    console.error("Error parsing data from localStorage:", error);
    data = {};
}

const initialState = {
    isLoggedIn: isLoggedIn,
    data: data,
  watchHistory:JSON.parse(localStorage.getItem("watchHistory"))||[],
  addedVideoId:JSON.parse(localStorage.getItem("addedVideoId"))||[],
};



//console.log(localStorage.getItem("data"))

export const createAccount = createAsyncThunk("/auth/signup",async(data)=>{
    try{
        let result =""
        const res = axios.post("/api/v1/users/register",data)
        toast.promise(res,{
            loading:"wait! creating your account...",
            success:(data)=>{
                console.log(data)
                result = data?.data?.data.user 
                return data?.data?.message
            },
            error:"failed to create the account"
        })
        await res ;
        return result;
    }
    catch(err){
       toast.error(err?.response?.data?.message)
    }

})

export const getUserChannelProfile = createAsyncThunk("auth/profile",async(data)=>{
  let result = {}
    try{
      const res = axios.get(`/api/v1/users/c/${data}`)
      toast.promise(res,{
        loading:"wait! creating your account",
        success:(data)=>{
            console.log(data?.data)
            result = data?.data
            return data?.data?.message;
        },
        error:"failed to create Account"
    })
    
    console.log(res)
     await res
    return result;
}

catch(error){
    console.log(error)
    toast.error(error?.response?.data?.message)
}
    }
)



export const validateUserAccount = createAsyncThunk("/auth/signup",async(data)=>{
  let result = {}
    try{
        const res =  axios.post("/api/v1/users/login",data)
        toast.promise(res,{
            loading:"wait logging you in",
            success:(data)=>{
                console.log(data?.data.data.user)
                result = data?.data.data.user 
                return data?.data?.message;
            },
            error:"Invalid Credentials Please Try Again"
        })
        
        console.log(res)
         await res
        return result;
    }

    catch(error){
        console.log(error)
        toast.error(error?.response?.data?.message)
    }

})

export const logout = createAsyncThunk("auth/logout", async () => {  // asyncThunk because this method is handling some of the async data.

    try {
      let res = axios.post("/api/v1/users/logout");
  
      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          console.log(data?.data)
          return data?.data?.message;
        },
        error: "Failed to log out",
      });
  
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  });


  export const getCurrentUser = createAsyncThunk("auth/current-user", async () => {  // asyncThunk because this method is handling some of the async data.

    try {
      let res = axios.get("/api/v1/users/current-user");
      
      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to get information of the logged in user",
      });
  
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  });



  export const getUserById = createAsyncThunk("auth/getUserById", async (data) => {  // asyncThunk because this method is handling some of the async data.
      console.log(data)
    try {
      console.log("kitne bar aaoge yha ")
    let res = axios.get(`/api/v1/users/u/${data}`);
  
      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          console.log(data+" "+"hine aabo")
          return data?.data?.message;
        },
        error: "Failed to get Information of the user ",
      });
  
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  });


  export const updateWatchHistory = createAsyncThunk("auth/updateWatchHistory",async(data)=>{
    let result = [];
try {
  console.log(data.length + " is leb");
  const res = await axios.patch(`api/v1/users/uwh/${data}`);
  const response = await res;
  result = response.data.data;
  return result;
} catch (error) {
  console.error(error.message);
  throw error;
}

  })

  export const getWatchHistory = createAsyncThunk("auth/getWatchHistory",async()=>{
    let result = [];
    try {
      const res = await axios.get(`api/v1/users/history`);
      const response = await res;
      result = response.data.data;
      return result;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    
  })




const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
          // for user login
          .addCase(validateUserAccount.fulfilled, (state, action) => {
            console.log(action.payload)
            localStorage.setItem("data", JSON.stringify(action?.payload));
            localStorage.setItem("isLoggedIn", true);
            state.isLoggedIn = true;
            state.data = action?.payload
          })

              .addCase(createAccount.fulfilled,(state,action)=>{
            console.log(action.payload)
            localStorage.setItem("data",JSON.stringify(action?.payload))
            localStorage.setItem("isLoggedIn",true)
            state.isLoggedIn = true
            state.data = action?.payload 
        })
            

          .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.data = {};
          })

          .addCase(updateWatchHistory.fulfilled,(state,action)=>{
            state.addedVideoId = action.payload.watchHistory 
            console.log(state.addedVideoId)
            localStorage.setItem("addedVideoId",JSON.stringify(state.addedVideoId))

          })

          .addCase(getWatchHistory.fulfilled,(state,action)=>{
           state.watchHistory = []

           let hist = []
           hist = action.payload
           for(let i=0;i<state.addedVideoId.length;i++){
            for(let j=0;j<hist.length;j++){
              console.log("edhar");
              if(state.addedVideoId[i]== hist[j]._id){
                state.watchHistory.push(hist[j]);
              }
            }
           }
           console.log(hist)
           console.log(state.addedVideoId.length)
           console.log(state.watchHistory)

           localStorage.setItem("watchHistory",JSON.stringify(state.watchHistory))
          })

  }

});





export const {} = authSlice.actions;
export default authSlice.reducer;
