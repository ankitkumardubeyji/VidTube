import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

// Initial state setup
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
    watchHistory: JSON.parse(localStorage.getItem("watchHistory")) || [],
    addedVideoId: JSON.parse(localStorage.getItem("addedVideoId")) || [],
};

// Thunks for asynchronous actions
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axios.post("/api/v1/users/register", data);
        toast.promise(res, {
            loading: "wait! creating your account...",
            success: (data) => {
                console.log(data);
                return data?.data?.message;
            },
            error: "failed to create the account"
        });
        const result = await res;
        return result?.data?.data?.user;
    } catch (err) {
        toast.error(err?.response?.data?.message);
        throw err;
    }
});

// Similar implementations for other thunks
export const getUserChannelProfile = createAsyncThunk("auth/profile", async (data) => {
    try {
        const res = axios.get(`/api/v1/users/c/${data}`);
        toast.promise(res, {
            loading: "wait! fetching profile...",
            success: (data) => {
                console.log(data?.data);
                return data?.data?.message;
            },
            error: "failed to fetch profile"
        });
        const result = await res;
        return result.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const validateUserAccount = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axios.post("/api/v1/users/login", data);
        toast.promise(res, {
            loading: "wait logging you in",
            success: (data) => {
                console.log(data?.data.data.user);
                return data?.data?.message;
            },
            error: "Invalid Credentials Please Try Again"
        });
        const result = await res;
        return result?.data?.data?.user;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        const res = axios.post("/api/v1/users/logout");
        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                console.log(data?.data);
                return data?.data?.message;
            },
            error: "Failed to log out"
        });
        const result = await res;
        return result.data;
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
});

export const getCurrentUser = createAsyncThunk("auth/current-user", async () => {
    try {
        const res = axios.get("/api/v1/users/current-user");
        toast.promise(res, {
            loading: "Loading...",
            success: (data) => data?.data?.message,
            error: "Failed to get information of the logged in user"
        });
        const result = await res;
        return result.data;
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
});

export const getUserById = createAsyncThunk("auth/getUserById", async (data) => {
    try {
        const res = axios.get(`/api/v1/users/u/${data}`);
        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                console.log(data);
                return data?.data?.message;
            },
            error: "Failed to get Information of the user"
        });
        const result = await res;
        return result.data;
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
});

export const updateWatchHistory = createAsyncThunk("auth/updateWatchHistory", async (data) => {
    try {
        const res = await axios.patch(`api/v1/users/uwh/${data}`);
        const result = await res;
        return result.data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
});

export const getWatchHistory = createAsyncThunk("auth/getWatchHistory", async () => {
    try {
        const res = await axios.get(`api/v1/users/history`);
        const result = await res;
        return result.data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
});

// Redux slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.fulfilled, (state, action) => {
                console.log(action.payload);
                localStorage.setItem("data", JSON.stringify(action.payload));
                localStorage.setItem("isLoggedIn", true);
                state.isLoggedIn = true;
                state.data = action.payload;
            })
            .addCase(validateUserAccount.fulfilled, (state, action) => {
                console.log(action.payload);
                localStorage.setItem("data", JSON.stringify(action.payload));
                localStorage.setItem("isLoggedIn", true);
                state.isLoggedIn = true;
                state.data = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.isLoggedIn = false;
                state.data = {};
            })
            .addCase(updateWatchHistory.fulfilled, (state, action) => {
                state.addedVideoId = action.payload.watchHistory;
                console.log(state.addedVideoId);
                localStorage.setItem("addedVideoId", JSON.stringify(state.addedVideoId));
            })
            .addCase(getWatchHistory.fulfilled, (state, action) => {
                state.watchHistory = [];
                let hist = action.payload;
                for (let i = 0; i < state.addedVideoId.length; i++) {
                    for (let j = 0; j < hist.length; j++) {
                        if (state.addedVideoId[i] === hist[j]._id) {
                            state.watchHistory.push(hist[j]);
                        }
                    }
                }
                console.log(hist);
                console.log(state.addedVideoId.length);
                console.log(state.watchHistory);
                localStorage.setItem("watchHistory", JSON.stringify(state.watchHistory));
            });
    },
});

export default authSlice.reducer;
