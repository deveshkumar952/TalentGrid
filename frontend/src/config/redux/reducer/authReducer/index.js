import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, loginUser, registerUser } from "@/config/redux/action/authAction/index.js"

const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    isTokenThere:false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profile_fetched:false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=>{
            state.message = "hello"
        },
        emptyMessage:(state)=>{
            state.message = ""
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere = true
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere = false
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading = true
            state.message = "Knock knock! Who's there? It's the login process, and it's loading!"
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.loggedIn = true
            state.message = "Login successful! Welcome back!"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true
            state.message = "Registering user, please wait..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Registration successful!"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload.user;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profile_fetched = true;
            state.all_users = action.payload.profiles;
        })
    }
})

export default authSlice.reducer

export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere} = authSlice.actions;