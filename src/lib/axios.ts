import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response interface
interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// Axios configuration
const axiosConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(axiosConfig);

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
        });

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    },
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Calculate request duration
        const endTime = new Date();
        const duration = response.config.metadata?.startTime
            ? endTime.getTime() - response.config.metadata.startTime.getTime()
            : 0;

        console.log('✅ API Response:', {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            duration: `${duration}ms`,
            data: response.data,
        });

        return response;
    },
    (error) => {
        console.error(
            '❌ Response Error:',
            error.response?.data || error.message,
        );

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        if (error.response?.status === 403) {
            console.error('Access forbidden');
        }

        if (error.response?.status >= 500) {
            console.error('Server error occurred');
        }

        return Promise.reject(error);
    },
);

// Helper functions for common HTTP methods
export const api = {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data.data;
    },

    post: async <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.post<ApiResponse<T>>(
            url,
            data,
            config,
        );
        return response.data.data;
    },

    put: async <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data.data;
    },

    patch: async <T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.patch<ApiResponse<T>>(
            url,
            data,
            config,
        );
        return response.data.data;
    },

    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data.data;
    },
};

// Export raw axios instance for advanced usage
export { apiClient };

// Export types
export type { ApiResponse };

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
    interface AxiosRequestConfig {
        metadata?: {
            startTime: Date;
        };
    }
}
