import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';
export type LanguageType = 'English' | 'Kinyarwanda' | 'French';

interface SettingsState {
  theme: ThemeType;
  language: LanguageType;
  notificationsEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'English',
  notificationsEnabled: true,
  isLoading: false,
  error: null
};

// Async thunk to load settings from AsyncStorage
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      return settings ? JSON.parse(settings) : initialState;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load settings');
    }
  }
);

// Async thunk to save settings to AsyncStorage
export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings: Partial<SettingsState>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { settings: SettingsState };
      const updatedSettings = { ...state.settings, ...settings };
      
      // Remove loading and error states before saving
      const { isLoading, error, ...settingsToSave } = updatedSettings;
      
      await AsyncStorage.setItem('userSettings', JSON.stringify(settingsToSave));
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load settings
      .addCase(loadSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action: PayloadAction<SettingsState>) => {
        state.isLoading = false;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
        state.notificationsEnabled = action.payload.notificationsEnabled;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Save settings
      .addCase(saveSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action: PayloadAction<Partial<SettingsState>>) => {
        state.isLoading = false;
        if (action.payload.theme !== undefined) state.theme = action.payload.theme;
        if (action.payload.language !== undefined) state.language = action.payload.language;
        if (action.payload.notificationsEnabled !== undefined) 
          state.notificationsEnabled = action.payload.notificationsEnabled;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default settingsSlice.reducer;