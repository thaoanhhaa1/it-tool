import ComponentCode from '@/components/ComponentCode';
import CopyButton from '@/components/CopyButton';
import Navigation from '@/components/Navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data - trong thực tế sẽ fetch từ database/API
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

const codeExamples: CodeExample[] = [
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
];

// Generate metadata cho từng component detail page
export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = params;
    const example = codeExamples.find((ex) => ex.id === id);

    if (!example) {
        return {
            title: 'Code không tìm thấy - Code Library',
            description: 'Code example bạn tìm kiếm không tồn tại.',
        };
    }

    return {
        title: `${example.name} - ${example.library} ${
            example.type === 'component' ? 'Component' : 'Function'
        } | Code Library`,
        description: `${example.description} Xem code example và cách sử dụng ${example.name} trong dự án React của bạn.`,
        keywords: [
            example.name,
            example.library,
            example.type,
            ...example.tags,
            'React',
            'JavaScript',
            'TypeScript',
            'Code example',
            'Tutorial',
        ],
        openGraph: {
            title: `${example.name} - ${example.library} ${
                example.type === 'component' ? 'Component' : 'Function'
            }`,
            description: example.description,
            type: 'article',
            locale: 'vi_VN',
        },
        alternates: {
            canonical: `/code-library/${example.id}`,
        },
    };
}

// Generate static params cho tất cả components có sẵn
export async function generateStaticParams() {
    return codeExamples.map((example) => ({
        id: example.id,
    }));
}

export default function CodeDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const example = codeExamples.find((ex) => ex.id === id);

    if (!example) {
        notFound();
    }

    const typeColors = {
        component: 'bg-indigo-100 text-indigo-800',
        function: 'bg-emerald-100 text-emerald-800',
    };

    const libraryColors = {
        MUI: 'bg-blue-100 text-blue-800',
        'Ant Design': 'bg-orange-100 text-orange-800',
        'Chakra UI': 'bg-teal-100 text-teal-800',
        Custom: 'bg-purple-100 text-purple-800',
        'Headless UI': 'bg-gray-100 text-gray-800',
        JavaScript: 'bg-yellow-100 text-yellow-800',
        TypeScript: 'bg-blue-100 text-blue-800',
        React: 'bg-cyan-100 text-cyan-800',
        Utility: 'bg-green-100 text-green-800',
    };

    const typeIcons = {
        component: '⚛️',
        function: '🔧',
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <Navigation />

            <div className='container mx-auto px-4 py-8'>
                {/* Breadcrumb */}
                <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-8'>
                    <Link href='/' className='hover:text-blue-600'>
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href='/code-library' className='hover:text-blue-600'>
                        Code Library
                    </Link>
                    <span>/</span>
                    <span className='text-gray-900'>{example.name}</span>
                </nav>

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='xl:col-span-2 space-y-6'>
                        {/* Header */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <div className='flex items-start justify-between mb-4'>
                                <div className='flex items-center gap-3'>
                                    <span className='text-2xl'>
                                        {typeIcons[example.type]}
                                    </span>
                                    <div>
                                        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                                            {example.name}
                                        </h1>
                                        <p className='text-gray-600'>
                                            {example.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            typeColors[example.type]
                                        }`}
                                    >
                                        {example.type === 'component'
                                            ? 'Component'
                                            : 'Function'}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            libraryColors[example.library]
                                        }`}
                                    >
                                        {example.library}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Code Section */}
                        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                                <h2 className='text-lg font-semibold text-gray-900'>
                                    Source Code
                                </h2>
                            </div>
                            <div className='p-6'>
                                <ComponentCode
                                    code={example.code}
                                    language={
                                        example.type === 'component'
                                            ? 'jsx'
                                            : 'javascript'
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Details */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Chi tiết
                            </h3>
                            <dl className='space-y-4'>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Loại
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {example.type === 'component'
                                            ? 'React Component'
                                            : 'JavaScript Function'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Thư viện
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {example.library}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Tags
                                    </dt>
                                    <dd className='flex flex-wrap gap-1 mt-1'>
                                        {example.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className='px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs'
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Installation */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Cài đặt Dependencies
                            </h3>
                            <div className='space-y-4'>
                                {example.library === 'MUI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @mui/material @emotion/react @emotion/styled'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library === 'Ant Design' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install antd'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library === 'Chakra UI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library === 'Headless UI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @headlessui/react'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {(example.library === 'JavaScript' ||
                                    example.library === 'TypeScript' ||
                                    example.library === 'React' ||
                                    example.library === 'Utility') && (
                                    <p className='text-sm text-gray-600'>
                                        Không cần cài đặt thêm dependencies.
                                        Code này sử dụng JavaScript/TypeScript
                                        thuần hoặc React built-in.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Hành động
                            </h3>
                            <div className='space-y-3'>
                                <CopyButton code={example.code} />
                                <Link
                                    href='/code-library'
                                    className='block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center'
                                >
                                    ← Quay lại thư viện
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
