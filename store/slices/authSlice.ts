import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/utils/apiClient';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  isDriver?: boolean;
  licenseNumber?: string;
  vehicleType?: string;
  licensePlate?: string;
  password?: string; // Added password field
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Fetch user by email from db.json
      const response = await apiClient.get(`/users?email=${email}`);
      const users: User[] = response;

      if (!users || users.length === 0) {
        return rejectWithValue('User not found');
      }

      const user = users[0]; // Email should be unique
      console.log('Entered password:', password);
      console.log('Stored password:', user.password);
      console.log('Password match:', user.password === password);

      if (!user.password || user.password !== password) {
        return rejectWithValue('Invalid email or password');
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;

      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);
export const register = createAsyncThunk(
  'auth/register',
  async (userData: Partial<User> & { password: string }, { rejectWithValue }) => {
    try {
      // Check if email already exists
      const existingUserResponse = await apiClient.get(`/users?email=${userData.email}`);
      const existingUsers: User[] = existingUserResponse;

      if (existingUsers.length > 0) {
        return rejectWithValue('Email already exists');
      }

      // Remove any undefined fields from userData to avoid issues with JSON-server
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );

      // Add the user to db.json
      const response = await apiClient.post('/users', cleanUserData);

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = response as User;

      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      // Remove password from userData if present
      const { password: _, ...cleanUserData } = userData;

      const response = await apiClient.put(`/users/${userId}`, cleanUserData);

      // Update AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response));

      return response;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Profile update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('user');
      return null;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AsyncStorage.getItem('user');

      if (!user) {
        return rejectWithValue('Not authenticated');
      }

      return JSON.parse(user) as User;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Auth check failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;