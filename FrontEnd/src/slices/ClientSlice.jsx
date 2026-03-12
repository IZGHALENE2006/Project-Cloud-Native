import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:6001/Client";

// Get Token
const getToken = () => localStorage.getItem('token');

// Add Client
export const AddClient = createAsyncThunk(
  "client/addClient", 
  async (clientData, { rejectWithValue }) => {
    console.log(clientData);
    console.log(getToken());
    
    try {
      const res = await axios.post(`${API_URL}/add`, clientData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return res.data.client;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

// Get All Clients
export const GetAllClients = createAsyncThunk(
  "client/getAllClients", 
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/get`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

// Update Client
export const UpdateClient = createAsyncThunk(
  "client/updateClient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return res.data.client;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

// Delete Client
export const DeleteClient = createAsyncThunk(
  'client/deleteClient', 
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

const initialState = {
  clients: [],
  loading: false,
  error: null,
  successMessage: null
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Add Client
    builder
      .addCase(AddClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
        state.successMessage = "Client added successfully";
      })
      .addCase(AddClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Clients
    builder
      .addCase(GetAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(GetAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Client
    builder
      .addCase(UpdateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.successMessage = "Client updated successfully";
      })
      .addCase(UpdateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Client
    builder
      .addCase(DeleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter(c => c._id !== action.payload);
        state.successMessage = "Client deleted successfully";
      })
      .addCase(DeleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearMessage } = clientSlice.actions;
export default clientSlice.reducer;