const API_BASE_URL = 'http://10.12.75.56:5000';

const handleResponse = async (response: Response) => {
  const text = await response.text();
  let data;
  try {
    data = text && JSON.parse(text);
  } catch (error) {
    return Promise.reject(`Failed to parse response: ${text || 'Empty response'}`);
  }

  if (!response.ok) {
    const error = (data && data.message) || response.statusText || 'Unknown error';
    return Promise.reject(error);
  }

  return data;
};

export const apiClient = {
  async get(endpoint: string) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return handleResponse(response);
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