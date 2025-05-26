import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  driverId?: string;
  pickupLocation: string;
  destination: string;
  rideType: 'Economy' | 'Premium' | 'Shared';
  passengers: number;
  dateTime: string;
  duration: number;
  cost: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null
};

const PRICING = {
  Economy: 500, // RWF per km
  Premium: 800, // RWF per km
  Shared: 300   // RWF per km
};

export const calculateCost = (rideType: 'Economy' | 'Premium' | 'Shared', distance: number = 5) => {
  return PRICING[rideType] * distance;
};

export const generateBookingId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Partial<Booking>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: { id: string } } };
      const userId = state.auth.user.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }
      
      const bookingId = generateBookingId();
      const cost = calculateCost(bookingData.rideType as 'Economy' | 'Premium' | 'Shared');
      
      const newBooking = {
        ...bookingData,
        bookingId,
        userId,
        cost,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      const response = await apiClient.post('/bookings', newBooking);
      
      // Update cache
      await updateBookingCache(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create booking');
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async ({ userId, status }: { userId?: string; status?: string }, { rejectWithValue }) => {
    try {
      let url = '/bookings';
      const params = [];
      
      if (userId) params.push(`userId=${userId}`);
      if (status) params.push(`status=${status}`);
      
      if (params.length) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      
      // Return empty array if no data
      if (!response || !Array.isArray(response)) {
        return [];
      }
      
      return response;
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchDriverRequests = createAsyncThunk(
  'bookings/fetchDriverRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/bookings?status=Pending');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch driver requests');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/bookings?bookingId=${bookingId}`);
      
      if (!response.data || response.data.length === 0) {
        return rejectWithValue('Booking not found');
      }
      
      return response.data[0];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async (
    { id, bookingData }: { id: string; bookingData: Partial<Booking> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      
      // Update cache
      await updateBookingCache(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/bookings/${id}`, { status: 'Cancelled' });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel booking');
    }
  }
);

export const respondToBooking = createAsyncThunk(
  'bookings/respondToBooking',
  async (
    { 
      id, 
      driverId, 
      isApproved, 
      rejectionReason 
    }: { 
      id: string; 
      driverId: string; 
      isApproved: boolean; 
      rejectionReason?: string 
    },
    { rejectWithValue }
  ) => {
    try {
      const updateData: Partial<Booking> = isApproved 
        ? { status: 'Confirmed', driverId } 
        : { status: 'Rejected', driverId, rejectionReason };
      
      const response = await apiClient.patch(`/bookings/${id}`, updateData);
      
      // Update cache
      await updateBookingCache(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to respond to booking');
    }
  }
);

const updateBookingCache = async (booking: Booking) => {
  try {
    const cachedData = await AsyncStorage.getItem('bookings');
    if (cachedData) {
      const bookings = JSON.parse(cachedData);
      const index = bookings.findIndex((b: Booking) => b.id === booking.id);
      
      if (index !== -1) {
        bookings[index] = booking;
      } else {
        bookings.push(booking);
      }
      
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
    }
  } catch (error) {
    console.error('Failed to update booking cache', error);
  }
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.currentBooking = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch driver requests
      .addCase(fetchDriverRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverRequests.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchDriverRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Respond to booking
      .addCase(respondToBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(respondToBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.bookings = state.bookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        );
      })
      .addCase(respondToBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;