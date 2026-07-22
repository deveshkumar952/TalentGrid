import { createSlice } from "@reduxjs/toolkit"
import { loginUser, registerUser } from "@/config/redux/action/authAction/index.js"

const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
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
            state.message ={
                message:"Registration successful!",
            };
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
})

export default authSlice.reducer

export const {reset,emptyMessage} = authSlice.actions;