const API_BASE_URL = 'http://10.11.72.161:5000';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }
  
  try {
    return await response.json();
  } catch (error) {
    return {}; 
  }
};

export const apiClient = {
 async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return handleResponse(response);
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, body: any = {}) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },

  async put(endpoint: string, body: any = {}) {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },

  async patch(endpoint: string, body: any = {}) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },

  async delete(endpoint: string) {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
  },
};