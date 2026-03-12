import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add Caterory
export const Addcar = createAsyncThunk("AddCar", async (Car, { rejectWithValue }) => {
  const Token = localStorage.getItem('token')
  try {
    const res = await axios.post("http://localhost:1000/Car/Add", Car, {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    })

    return res.data
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || "Server error"
    )
  }

})
//Get All Car 
export const GetAllCar = createAsyncThunk("GetAllCar", async () => {
  const Token = localStorage.getItem('token')
  try {
    const res = await axios.get("http://localhost:1000/Car/get", {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    })


    return res.data
  } catch (error) {
    console.log(error)

  }
})

//Delete Category
export const DeleteCar = createAsyncThunk('DeleteCategory', async (id, { rejectWithValue }) => {
  const Token = localStorage.getItem('token')
  try {
    const res = await axios.delete(`http://localhost:1000/Car/Delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      }
    )
    return res.data
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || "Server error"

    )
  }

})
//UpdateCategory
export const UpdateCar = createAsyncThunk(
  "UpdateCar",
  async ({ id, data }, { rejectWithValue }) => {
    console.log(id);
    console.log('///////////////////////////////////////////');

    console.log(data);

    const Token = localStorage.getItem("token");

    try {
      // data هنا هي FormData
      const res = await axios.put(`http://localhost:1000/Car/Update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "multipart/form-data", // مهم للملفات
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);
const inialState = {
  Cars: [],
  loading: false,
  error: null
}
const SliceCar = createSlice(
  {
    name: "car",

    initialState: inialState,
    reducers: {},
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
          state.Cars.push(action.payload);

        })
        .addCase(Addcar.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload
        })

      //  Get all car
      builder
        .addCase(GetAllCar.fulfilled, (state, action) => {
          state.Cars = action.payload
        })
      //Delete car 
      builder
        .addCase(DeleteCar.pending, (state, action) => {
          state.loading = true
          state.error = null
        })
        .addCase(DeleteCar.fulfilled, (state, action) => {
          state.loading = false
          state.error = null
          state.Cars = state.Cars.filter((t) => t._id !== action.payload._id)
        })
        .addCase(DeleteCar.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload
        })
      //UpdateCar
      builder
        .addCase(UpdateCar.pending, (state, action) => {
          state.loading = true
          state.error = null
        })
        .addCase(UpdateCar.fulfilled, (state, action) => {
          state.loading = false
          state.error = null

          const index = state.Cars.findIndex(car => car._id === action.payload._id)

          if (index !== -1) {
            state.Cars[index] = action.payload
          }
        })
        .addCase(UpdateCar.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload
        })
    }



  }
)
export default SliceCar.reducer