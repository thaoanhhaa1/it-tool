'use client';

import { useState } from 'react';
import ComponentPreview from './ComponentPreview';

// Types for code examples (components and functions)
interface CodeExample {
    id: string;
    name: string;
    description: string;
    type: 'component' | 'function';
    library:
        | 'MUI'
        | 'Ant Design'
        | 'Chakra UI'
        | 'Custom'
        | 'Headless UI'
        | 'JavaScript'
        | 'TypeScript'
        | 'React'
        | 'Utility';
    tags: string[];
    code: string;
}

import { mockCodeExamples } from '@/lib/seed-mock';

// Convert mock data to ComponentLibrary format
const codeExamples: CodeExample[] = mockCodeExamples.map((mock) => ({
    id: mock.id,
    name: mock.name,
    description: mock.description,
    type: mock.type as 'component' | 'function',
    library: mock.library as
        | 'MUI'
        | 'Ant Design'
        | 'Chakra UI'
        | 'Custom'
        | 'Headless UI'
        | 'JavaScript'
        | 'TypeScript'
        | 'React'
        | 'Utility',
    tags: mock.tags,
    code: mock.code,
}));

// Original hardcoded data (backup)
const originalCodeExamples: CodeExample[] = [
    // Component Examples
    {
        id: 'mui-button',
        name: 'MUI Button Variants',
        description:
            'Các biến thể button của Material-UI với styling tùy chỉnh',
        type: 'component',
        library: 'MUI',
        tags: ['button', 'mui', 'material-ui', 'variants'],
        code: `import { Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  '&.gradient': {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
    },
  },
}));

export default function MUIButtonVariants() {
  return (
    <Stack spacing={2} direction="row" flexWrap="wrap">
      <CustomButton variant="contained">
        Standard Button
      </CustomButton>
      <CustomButton variant="outlined">
        Outlined Button
      </CustomButton>
      <CustomButton className="gradient">
        Gradient Button
      </CustomButton>
    </Stack>
  );
}`,
    },
    {
        id: 'ant-form',
        name: 'Ant Design Form',
        description: 'Form validation và xử lý dữ liệu với Ant Design',
        type: 'component',
        library: 'Ant Design',
        tags: ['form', 'antd', 'validation', 'input'],
        code: `import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormValues) => {
    console.log('Received values:', values);
    message.success('Đăng nhập thành công!');
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      style={{ maxWidth: 300 }}
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Tên đăng nhập" 
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' }
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="Mật khẩu" 
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
}`,
    },
    // Function Examples
    {
        id: 'debounce-hook',
        name: 'useDebounce Hook',
        description: 'Custom hook để debounce giá trị, hữu ích cho search',
        type: 'function',
        library: 'React',
        tags: ['hook', 'debounce', 'performance', 'search'],
        code: `import { useState, useEffect } from 'react';

/**
 * Custom hook để debounce một giá trị
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms)
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Cách sử dụng:
export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Thực hiện API call ở đây
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Tìm kiếm..."
    />
  );
}`,
    },
    {
        id: 'format-currency',
        name: 'formatCurrency',
        description: 'Function format tiền tệ Việt Nam với đầy đủ options',
        type: 'function',
        library: 'Utility',
        tags: ['currency', 'format', 'vietnam', 'utility', 'intl'],
        code: `/**
 * Format số thành định dạng tiền tệ Việt Nam
 * @param amount - Số tiền cần format
 * @param options - Tùy chọn format
 */
interface FormatCurrencyOptions {
  currency?: 'VND' | 'USD' | 'EUR';
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = 'VND',
    locale = 'vi-VN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(amount);
}

// Cách sử dụng:
console.log(formatCurrency(1000000)); // "1.000.000 ₫"
console.log(formatCurrency(1234.56, { 
  currency: 'USD', 
  locale: 'en-US',
  maximumFractionDigits: 2 
})); // "$1,234.56"
console.log(formatCurrency(500000, { showSymbol: false })); // "500.000"`,
    },
    {
        id: 'api-client',
        name: 'API Client Class',
        description:
            'Class để xử lý API calls với error handling và interceptors',
        type: 'function',
        library: 'TypeScript',
        tags: ['api', 'http', 'axios', 'client', 'error-handling'],
        code: `import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }
}

// Cách sử dụng:
const apiClient = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// GET request
const users = await apiClient.get<User[]>('/users');

// POST request
const newUser = await apiClient.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});`,
    },
    {
        id: 'local-storage-hook',
        name: 'useLocalStorage Hook',
        description: 'Hook để quản lý localStorage với TypeScript safety',
        type: 'function',
        library: 'React',
        tags: ['hook', 'localStorage', 'persistence', 'typescript'],
        code: `import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý localStorage
 * @param key - Key trong localStorage
 * @param initialValue - Giá trị khởi tạo
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  // Function để set giá trị
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép value là function để có API giống useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue];
}

// Cách sử dụng:
export function UserPreferences() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'vi');

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Current theme: {theme}
      </button>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}`,
    },
];

export default function CodeLibrary() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLibrary, setSelectedLibrary] = useState<string>('');
    const [selectedType, setSelectedType] = useState<
        'all' | 'component' | 'function'
    >('all');

    // Filter examples based on search term, library, and type
    const filteredExamples = codeExamples.filter((example) => {
        const matchesSearch =
            example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            example.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            example.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase()),
            );

        const matchesLibrary =
            !selectedLibrary || example.library === selectedLibrary;

        const matchesType =
            selectedType === 'all' || example.type === selectedType;

        return matchesSearch && matchesLibrary && matchesType;
    });

    // Get unique libraries for filter
    const uniqueLibraries = Array.from(
        new Set(codeExamples.map((example) => example.library)),
    );

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='text-center space-y-4'>
                <h1 className='text-4xl font-bold text-gray-900'>
                    Code Library
                </h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    Chia sẻ và khám phá các React Components và JavaScript
                    Functions hữu ích được xây dựng với các thư viện UI phổ biến
                </p>
            </div>

            {/* Search and Filters */}
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
                {/* Search */}
                <div>
                    <input
                        type='text'
                        placeholder='Tìm kiếm components hoặc functions...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Filters */}
                <div className='flex flex-wrap gap-4'>
                    {/* Type Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Loại
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) =>
                                setSelectedType(
                                    e.target.value as
                                        | 'all'
                                        | 'component'
                                        | 'function',
                                )
                            }
                            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='all'>Tất cả</option>
                            <option value='component'>Components</option>
                            <option value='function'>Functions</option>
                        </select>
                    </div>

                    {/* Library Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Thư viện
                        </label>
                        <select
                            value={selectedLibrary}
                            onChange={(e) => setSelectedLibrary(e.target.value)}
                            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value=''>Tất cả thư viện</option>
                            {uniqueLibraries.map((library) => (
                                <option key={library} value={library}>
                                    {library}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                <div className='flex flex-wrap gap-2'>
                    {selectedType !== 'all' && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                            {selectedType === 'component'
                                ? 'Components'
                                : 'Functions'}
                            <button
                                onClick={() => setSelectedType('all')}
                                className='ml-2 text-blue-600 hover:text-blue-800'
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {selectedLibrary && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'>
                            {selectedLibrary}
                            <button
                                onClick={() => setSelectedLibrary('')}
                                className='ml-2 text-green-600 hover:text-green-800'
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className='text-gray-600'>
                Hiển thị {filteredExamples.length} kết quả
                {searchTerm && ` cho "${searchTerm}"`}
            </div>

            {/* Examples Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {filteredExamples.map((example) => (
                    <ComponentPreview key={example.id} example={example} />
                ))}
            </div>

            {/* No Results */}
            {filteredExamples.length === 0 && (
                <div className='text-center py-12'>
                    <div className='text-gray-500 text-lg'>
                        Không tìm thấy kết quả phù hợp
                    </div>
                    <p className='text-gray-400 mt-2'>
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                </div>
            )}
        </div>
    );
}

// Export types for use in other components
export type { CodeExample };
