import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vehicle {
  id: string;
  vehicleId: string;
  type: 'Sedan' | 'SUV' | 'Minivan';
  capacity: number;
  driverName: string;
  driverId: string;
  available: boolean;
  image: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  filteredVehicles: [],
  currentVehicle: null,
  isLoading: false,
  error: null
};

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/vehicles');
      
      if (!response || !Array.isArray(response)) {
        return [];
      }
      
      return response;
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Failed to fetch vehicles');
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vehicle');
    }
  }
);

export const updateVehicleAvailability = createAsyncThunk(
  'vehicles/updateVehicleAvailability',
  async ({ vehicleId, available }: { vehicleId: string; available: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/vehicles/${vehicleId}`, { available });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update vehicle availability');
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    resetVehicleState: (state) => {
      state.currentVehicle = null;
      state.error = null;
    },
    filterVehicles: (state, action: PayloadAction<{ type?: string; available?: boolean }>) => {
      const { type, available } = action.payload;
      
      // Start with all vehicles
      let filtered = [...state.vehicles];
      
      // Filter by type if specified
      if (type && type !== 'All') {
        filtered = filtered.filter(vehicle => vehicle.type === type);
      }
      
      // Filter by availability if specified
      if (available !== undefined) {
        filtered = filtered.filter(vehicle => vehicle.available === available);
      }
      
      state.filteredVehicles = filtered;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action: PayloadAction<Vehicle[]>) => {
        state.isLoading = false;
        state.vehicles = action.payload;
        state.filteredVehicles = action.payload; // Initially, show all vehicles
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch vehicle by ID
      .addCase(fetchVehicleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.isLoading = false;
        state.currentVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update vehicle availability
      .addCase(updateVehicleAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVehicleAvailability.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.isLoading = false;
        state.vehicles = state.vehicles.map(vehicle =>
          vehicle.vehicleId === action.payload.vehicleId ? action.payload : vehicle
        );
        state.filteredVehicles = state.filteredVehicles.map(vehicle =>
          vehicle.vehicleId === action.payload.vehicleId ? action.payload : vehicle
        );
      })
      .addCase(updateVehicleAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetVehicleState, filterVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;