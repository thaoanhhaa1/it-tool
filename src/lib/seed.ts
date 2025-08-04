import Category from '@/models/Category';
import CodeExample from '@/models/CodeExample';
import User from '@/models/User';
import 'dotenv/config';
import mongoose from 'mongoose';

// Sample data
const categories = [
    {
        name: 'UI Components',
        slug: 'ui-components',
        description: 'Các component giao diện người dùng',
        icon: '🎨',
        color: '#3B82F6',
        sortOrder: 1,
    },
    {
        name: 'Hooks',
        slug: 'hooks',
        description: 'Custom React Hooks hữu ích',
        icon: '🪝',
        color: '#10B981',
        sortOrder: 2,
    },
    {
        name: 'Utilities',
        slug: 'utilities',
        description: 'Các function tiện ích JavaScript/TypeScript',
        icon: '🛠️',
        color: '#F59E0B',
        sortOrder: 3,
    },
    {
        name: 'Forms',
        slug: 'forms',
        description: 'Components và logic xử lý form',
        icon: '📝',
        color: '#8B5CF6',
        sortOrder: 4,
    },
    {
        name: 'Animation',
        slug: 'animation',
        description: 'Components và functions cho animation',
        icon: '✨',
        color: '#EC4899',
        sortOrder: 5,
    },
];

const users = [
    {
        username: 'admin',
        email: 'admin@codeLibrary.com',
        fullName: 'System Admin',
        role: 'admin',
        bio: 'Quản trị viên hệ thống Code Library',
        reputation: 10000,
        emailVerified: true,
    },
    {
        username: 'john_dev',
        email: 'john@example.com',
        fullName: 'John Developer',
        role: 'user',
        bio: 'Frontend Developer với 5+ năm kinh nghiệm React',
        github: 'johndev',
        website: 'https://johndev.com',
        reputation: 2500,
        emailVerified: true,
    },
    {
        username: 'jane_ui',
        email: 'jane@example.com',
        fullName: 'Jane UI Designer',
        role: 'user',
        bio: 'UI/UX Designer chuyên về design system',
        linkedin: 'jane-ui-designer',
        reputation: 1800,
        emailVerified: true,
    },
];

const codeExamples = [
    {
        name: 'Button with Loading State',
        description:
            'Component Button với trạng thái loading và nhiều variant khác nhau',
        type: 'component' as const,
        library: 'React',
        tags: ['button', 'loading', 'ui', 'typescript'],
        difficulty: 'beginner' as const,
        category: 'ui-components',
        dependencies: ['react', '@types/react'],
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
    },
    {
        name: 'useLocalStorage Hook',
        description:
            'Custom hook để quản lý localStorage với TypeScript safety và SSR support',
        type: 'function' as const,
        library: 'React',
        tags: ['hook', 'localStorage', 'typescript', 'ssr'],
        difficulty: 'intermediate' as const,
        category: 'hooks',
        dependencies: ['react'],
        code: `import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
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

  // Function để xóa giá trị
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
    },
    {
        name: 'Format Currency VND',
        description:
            'Function format tiền tệ Việt Nam với đầy đủ options và localization',
        type: 'function' as const,
        library: 'Utility',
        tags: ['currency', 'format', 'vietnam', 'intl', 'utility'],
        difficulty: 'beginner' as const,
        category: 'utilities',
        dependencies: [],
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
}

// Examples:
// formatCurrency(1000000) // "1.000.000 ₫"
// formatCurrency(1234567, { compact: true }) // "1.2M ₫"
// formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' }) // "$1,234.56"
// formatCurrency(500000, { showSymbol: false }) // "500.000"`,
    },
];

async function connectToMongoDB() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Connect with proper options and timeout
    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        socketTimeoutMS: 10000, // 10 second socket timeout
        maxPoolSize: 10,
    });
}

export async function seedDatabase() {
    try {
        console.log('🔌 Attempting to connect to MongoDB...');

        // Test connection with timeout
        const connectPromise = connectToMongoDB();
        const timeout = new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error('Connection timeout after 5 seconds')),
                5000,
            ),
        );

        await Promise.race([connectPromise, timeout]);
        console.log('✅ Connected to MongoDB successfully!');

        // Test if we can actually perform operations
        console.log('🧪 Testing database operations...');
        await Category.countDocuments({}).maxTimeMS(3000);
        console.log('✅ Database operations working!');

        console.log('🌱 Starting database seeding...');

        // Xóa dữ liệu cũ
        await Promise.all([
            Category.deleteMany({}),
            User.deleteMany({}),
            CodeExample.deleteMany({}),
        ]);

        console.log('🧹 Cleared existing data');

        // Tạo categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`📂 Created ${createdCategories.length} categories`);

        // Tạo users
        const createdUsers = await User.insertMany(users);
        console.log(`👥 Created ${createdUsers.length} users`);

        // Tạo code examples với author reference
        const codeExamplesWithAuthor = codeExamples.map((example, index) => ({
            ...example,
            author: createdUsers[index % createdUsers.length]._id,
        }));

        const createdCodeExamples = await CodeExample.insertMany(
            codeExamplesWithAuthor,
        );
        console.log(`💻 Created ${createdCodeExamples.length} code examples`);

        // Cập nhật category count
        for (const category of createdCategories) {
            const count = createdCodeExamples.filter(
                (example) => example.category === category.slug,
            ).length;

            await Category.findByIdAndUpdate(category._id, {
                codeExampleCount: count,
            });
        }

        console.log('📊 Updated category counts');
        console.log('✅ Database seeding completed successfully!');

        // Close connection
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');

        return {
            categories: createdCategories.length,
            users: createdUsers.length,
            codeExamples: createdCodeExamples.length,
        };
    } catch (error) {
        console.error('❌ Error seeding database:', error);

        // Cleanup connection on error
        try {
            if (mongoose.connection.readyState !== 0) {
                await mongoose.disconnect();
                console.log('🔌 Disconnected from MongoDB (cleanup)');
            }
        } catch {
            // Ignore disconnect errors
        }

        console.log('\n💡 MongoDB không khả dụng. Sử dụng mock data thay thế:');
        console.log('   1. Chạy: npm test (để xem mock data)');
        console.log(
            '   2. Hoặc chạy: npm run dev (ứng dụng sẽ dùng mock data)',
        );
        console.log('\n🛠️ Để sử dụng MongoDB:');
        console.log(
            '   - Cài đặt MongoDB local: https://www.mongodb.com/try/download/community',
        );
        console.log('   - Hoặc dùng MongoDB Atlas: https://cloud.mongodb.com');
        console.log('   - Cập nhật MONGODB_URI trong .env.local');

        // Return mock stats instead of throwing
        return {
            categories: 0,
            users: 0,
            codeExamples: 0,
            useMockData: true,
        };
    }
}

// Script để chạy seeding
if (require.main === module) {
    seedDatabase()
        .then((stats) => {
            if (stats.useMockData) {
                console.log('\n📝 Hướng dẫn tiếp theo:');
                console.log('   ✅ Mock data đã sẵn sàng');
                console.log('   🚀 Chạy: npm run dev');
                console.log('   📊 Xem data: npm test');
            } else {
                console.log('📊 Seeding stats:', stats);
                console.log('✅ Database seeded successfully!');
            }
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Unexpected error:', error);
            process.exit(1);
        });
}
