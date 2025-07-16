// Mock seed data để test mà không cần MongoDB
export const mockCategories = [
    {
        _id: '507f1f77bcf86cd799439011',
        name: 'UI Components',
        slug: 'ui-components',
        description: 'Các component giao diện người dùng',
        icon: '🎨',
        color: '#3B82F6',
        sortOrder: 1,
        codeExampleCount: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '507f1f77bcf86cd799439012',
        name: 'Hooks',
        slug: 'hooks',
        description: 'Custom React Hooks hữu ích',
        icon: '🪝',
        color: '#10B981',
        sortOrder: 2,
        codeExampleCount: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '507f1f77bcf86cd799439013',
        name: 'Utilities',
        slug: 'utilities',
        description: 'Các function tiện ích JavaScript/TypeScript',
        icon: '🛠️',
        color: '#F59E0B',
        sortOrder: 3,
        codeExampleCount: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const mockUsers = [
    {
        _id: '507f1f77bcf86cd799439021',
        username: 'admin',
        email: 'admin@codeLibrary.com',
        fullName: 'System Admin',
        role: 'admin',
        bio: 'Quản trị viên hệ thống Code Library',
        reputation: 10000,
        emailVerified: true,
        isActive: true,
        followers: [],
        following: [],
        favoriteCodeExamples: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '507f1f77bcf86cd799439022',
        username: 'john_dev',
        email: 'john@example.com',
        fullName: 'John Developer',
        role: 'user',
        bio: 'Frontend Developer với 5+ năm kinh nghiệm React',
        github: 'johndev',
        website: 'https://johndev.com',
        reputation: 2500,
        emailVerified: true,
        isActive: true,
        followers: [],
        following: [],
        favoriteCodeExamples: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const mockCodeExamples = [
    {
        _id: '507f1f77bcf86cd799439031',
        id: 'button-loading-state',
        name: 'Button with Loading State',
        description:
            'Component Button với trạng thái loading và nhiều variant khác nhau',
        type: 'component',
        library: 'React',
        tags: ['button', 'loading', 'ui', 'typescript'],
        difficulty: 'beginner',
        category: 'ui-components',
        dependencies: ['react', '@types/react'],
        author: '507f1f77bcf86cd799439021',
        likes: 15,
        views: 120,
        downloads: 8,
        isPublic: true,
        code: `import React from 'react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  );
};`,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '507f1f77bcf86cd799439032',
        id: 'use-localstorage-hook',
        name: 'useLocalStorage Hook',
        description:
            'Custom hook để quản lý localStorage với TypeScript safety và SSR support',
        type: 'function',
        library: 'React',
        tags: ['hook', 'localStorage', 'typescript', 'ssr'],
        difficulty: 'intermediate',
        category: 'hooks',
        dependencies: ['react'],
        author: '507f1f77bcf86cd799439022',
        likes: 28,
        views: 250,
        downloads: 15,
        isPublic: true,
        code: `import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
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

  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(\`Error removing localStorage key "\${key}":\`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}`,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '507f1f77bcf86cd799439033',
        id: 'format-currency-vnd',
        name: 'Format Currency VND',
        description:
            'Function format tiền tệ Việt Nam với đầy đủ options và localization',
        type: 'function',
        library: 'Utility',
        tags: ['currency', 'format', 'vietnam', 'intl', 'utility'],
        difficulty: 'beginner',
        category: 'utilities',
        dependencies: [],
        author: '507f1f77bcf86cd799439021',
        likes: 12,
        views: 85,
        downloads: 5,
        isPublic: true,
        code: `interface FormatCurrencyOptions {
  currency?: 'VND' | 'USD' | 'EUR';
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  compact?: boolean;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = 'VND',
    locale = 'vi-VN',
    minimumFractionDigits = 0,
    maximumFractionDigits = currency === 'VND' ? 0 : 2,
    showSymbol = true,
    compact = false
  } = options;

  if (compact && amount >= 1000000) {
    const millions = amount / 1000000;
    return \`\${millions.toFixed(1)}M ₫\`;
  }

  if (compact && amount >= 1000) {
    const thousands = amount / 1000;
    return \`\${thousands.toFixed(1)}K ₫\`;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(amount);
}`,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export function getMockData() {
    console.log('📊 Mock database seeded successfully!');
    console.log(`📂 Categories: ${mockCategories.length}`);
    console.log(`👥 Users: ${mockUsers.length}`);
    console.log(`💻 Code Examples: ${mockCodeExamples.length}`);

    return {
        categories: mockCategories,
        users: mockUsers,
        codeExamples: mockCodeExamples,
        stats: {
            categories: mockCategories.length,
            users: mockUsers.length,
            codeExamples: mockCodeExamples.length,
        },
    };
}
