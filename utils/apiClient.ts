import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for API
const API_BASE_URL = 'http://10.12.75.56:3000';

// Helper methods for HTTP requests
const handleResponse = async (response: Response) => {
  const text = await response.text();
  let data;
  try {
    data = text && JSON.parse(text);
  } catch (error) {
    return text;
  }
  
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// API client with common methods
export const apiClient = {
  async get(endpoint: string) {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },
  
  async post(endpoint: string, body: any = {}) {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },
  
  async put(endpoint: string, body: any = {}) {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },
  
  async patch(endpoint: string, body: any = {}) {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },
  
  async delete(endpoint: string) {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  }
};