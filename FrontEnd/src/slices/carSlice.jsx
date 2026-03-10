import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add Caterory
export const Addcar = createAsyncThunk("AddCar",async(Car,{rejectWithValue})=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.post("http://localhost:1000/Car/Add",Car,{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
        
        return res.data
    }catch(error){
        return rejectWithValue(
        error.response?.data?.message || "Server error"
        )
    }
})
//Get All Caterory 
export const GetAllCar = createAsyncThunk("GetAllCar",async()=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.get("http://localhost:1000/Car/get",{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
       

        return res.data
    }catch(error){
     console.log(error)
     
    }
})

//Delete Category
export const DeleteCar  = createAsyncThunk('DeleteCategory',async(id,{rejectWithValue})=>{
    const Token = localStorage.getItem('token')
    try{
        const res  = await axios.delete(`http://localhost:1000/Car/Delete/${id}`,
            {
                headers:{
                    Authorization:`Bearer ${Token}`
                }
            }
        )
        return res.data
    }catch(err){
        return rejectWithValue(
        err.response?.data?.message || "Server error"

        )
    }

})
//UpdateCategory
export const UpdateCar = createAsyncThunk("UpdateCategory",async(data,{rejectWithValue})=>{
    const Token  = localStorage.getItem('token')
  
    console.log(data);
    
    try{
        const res = await axios.patch(`http://localhost:1000/Car/Update/${data.id}`,{name:data.name},{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
        
        return res.data
    }catch(error){
        return rejectWithValue(
        error.response?.data?.message || "Server error"
        )
    }
})
const inialState ={
Cars:[],
loading:false,
error:null
}
const SliceCar = createSlice(
    {
        name:"car",
     
     initialState:inialState,
        reducers:{},
     extraReducers: (builder) => {

  //  Add Car
  builder
    .addCase(Addcar.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(Addcar.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
    state.Category.push(action.payload);

    })
    .addCase(Addcar.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

  //  Get all car
  builder
    .addCase(GetAllCar.fulfilled, (state, action) => {
      state.Category = action.payload
    })
    //Delete car 
   builder  
   .addCase(DeleteCar.pending,(state,action)=>{
      state.loading = true
      state.error = null
   })
   .addCase(DeleteCar.fulfilled,(state,action)=>{
          state.loading = false
      state.error = null
    state.Category = state.Category.filter((t)=>t._id!==action.payload._id)
   })
     .addCase(DeleteCar.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
   })
   //UpdateCar
   builder  
   .addCase(UpdateCar.pending,(state,action)=>{
      state.loading = true
      state.error = null
   })
   .addCase(UpdateCar.fulfilled,(state,action)=>{
          state.loading = false
      state.error = null
      const Caritem = state.Category.find((t)=>t._id ===action.payload._id)
     
    if(Caritem){
         Categoryitem.name = action.payload.name
    }


   })
     .addCase(UpdateCar.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
   })
}

     
        
    }
)
export default SliceCar.reducer