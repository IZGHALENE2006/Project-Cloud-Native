import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  User: null,
  AllUser:[],
  Token: localStorage.getItem("token") || null,
  loading:false,
  error:null
}
//Register User
 export const RejisterUser = createAsyncThunk("Register",async(User,{rejectWithValue})=>{
    
    try{
        const res = await axios.post("http://localhost:7000/api/user/Register",User)
        return res.data
    }catch(error){
         return rejectWithValue(error.response.data.message)
        }
})

//login User
 export const Loginuser = createAsyncThunk("Login",async(data,{rejectWithValue})=>{
    console.log(data);
    
    try{
        const res = await axios.post("http://localhost:7000/api/user/Login",data)
        return res.data
    }catch(error){
         return rejectWithValue(error.response.data.message)
        }
})

//Get Me 
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:7000/api/user/getMe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;

    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

 const SlicEauth     = createSlice({
     name:"Register",
     initialState:initialState,
     reducers:{
               logoutUser:(state)=>{
           state.User = null;
           state.Token = null;
           state.error = null;
           localStorage.removeItem("token");
          }
     },
     extraReducers(bulder){
        //Register user 
        bulder.addCase(RejisterUser.pending,(state,action)=>{
             state.loading=true
            state.error=null
        }),
        bulder.addCase(RejisterUser.fulfilled,(state,action)=>{
          state.loading = false;
              state.User=action.payload
        }),
          bulder.addCase(RejisterUser.rejected,(state,action)=>{
              state.loading=false
            state.error=action.payload
        }),
        //Login USER

         bulder.addCase(Loginuser.pending,(state,action)=>{
             state.loading=true
            state.error=null
        }),
        bulder.addCase(Loginuser.fulfilled,(state,action)=>{
          state.loading = false;
              state.User=action.payload.user
              state.Token=action.payload.Token
          localStorage.setItem('token',action.payload.Token)

        }),
          bulder.addCase(Loginuser.rejected,(state,action)=>{
              state.loading=false
            state.error=action.payload
        })
  
        
     }
})
export const {logoutUser} = SlicEauth.actions

export default SlicEauth.reducer