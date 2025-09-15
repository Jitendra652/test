import { authStorage, getAuthHeaders } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    authStorage.clear();
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}

export const api = {
  // Auth endpoints
  auth: {
    login: (data: any) => apiRequest('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    register: (data: any) => apiRequest('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    me: () => apiRequest('/v1/auth/me'),
  },

  // User endpoints
  user: {
    getProfile: () => apiRequest('/v1/user/profile'),
    updateProfile: (data: any) => apiRequest('/v1/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    createPayment: (data: any) => apiRequest('/v1/user/create-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    executePayment: (data: any) => apiRequest('/v1/user/execute-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    cancelPayment: (data: any) => apiRequest('/v1/user/cancel-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getPayments: () => apiRequest('/v1/user/payments'),
  },

  // Events endpoints
  events: {
    getAll: (params?: any) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return apiRequest(`/v1/events${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiRequest(`/v1/events/${id}`),
    create: (data: any) => apiRequest('/v1/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Files endpoints
  files: {
    getAll: () => apiRequest('/v1/files'),
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('/upload', {
        method: 'POST',
        body: formData,
        headers: {
          ...getAuthHeaders(),
        },
      });
    },
    generateToken: (fileId: string) => apiRequest('/v1/files/generate-token', {
      method: 'POST',
      body: JSON.stringify({ fileId }),
    }),
    download: (token: string) => `${API_BASE}/v1/files/download?token=${token}`,
    transform: (data: any) => apiRequest('/v1/transform', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Budget endpoints
  budget: {
    get: (month?: number, year?: number) => {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      return apiRequest(`/v1/budget${params.toString() ? `?${params.toString()}` : ''}`);
    },
    create: (data: any) => apiRequest('/v1/budget', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Metrics endpoints
  metrics: {
    get: () => apiRequest('/v1/metrics'),
  },

  // PayPal endpoints
  paypal: {
    setup: () => apiRequest('/paypal/setup'),
    createOrder: (data: any) => apiRequest('/paypal/order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    captureOrder: (orderId: string) => apiRequest(`/paypal/order/${orderId}/capture`, {
      method: 'POST',
    }),
  },
};
