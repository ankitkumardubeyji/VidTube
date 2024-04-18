import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/authSlice";
import videoSliceReducer, { updateViewsOnVideo } from "../Redux/videoSlice";
import subSliceReducer from "../Redux/subSlice";
import likeSliceReducer from "../Redux/likeSlice"
import commentSliceReducer from "./commentSlice";


const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    video:videoSliceReducer,
    sub:subSliceReducer,
    like:likeSliceReducer,
    comment:commentSliceReducer,
    
   
  },
});

export default store;
