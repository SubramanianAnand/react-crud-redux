import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

// Async thunks for API operations
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.getUsers(page, 6);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.createUser(userData);
      // Generate a temporary ID for the new user since reqres.in returns limited data
      return {
        id: response.id || Date.now(),
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        avatar: userData.avatar,
        createdAt: response.createdAt,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUser(id, userData);
      return {
        id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        avatar: userData.avatar,
        updatedAt: response.updatedAt,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  filteredUsers: [],
  searchTerm: '',
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  usersPerPage: 6,
  viewMode: 'table',
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      
      if (action.payload === '') {
        state.filteredUsers = state.users;
      } else {
        state.filteredUsers = state.users.filter(user =>
          user.first_name.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.last_name.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.filteredUsers = action.payload.data;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.totalUsers = action.payload.total;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.filteredUsers = state.users.filter(user =>
          user.first_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
          state.filteredUsers = state.users.filter(user =>
            user.first_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.filteredUsers = state.users.filter(user =>
          user.first_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setCurrentPage,
  setViewMode,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;