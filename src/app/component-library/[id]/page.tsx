import ComponentCode from '@/components/ComponentCode';
import Navigation from '@/components/Navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data - trong thực tế sẽ fetch từ database/API
const componentData = {
    'mui-button': {
        id: 'mui-button',
        name: 'MUI Button Variants',
        description:
            'Các biến thể button của Material-UI với styling tùy chỉnh cho dự án React hiện đại',
        library: 'MUI',
        tags: ['button', 'mui', 'material-ui', 'variants', 'styling'],
        author: 'Component Library Team',
        version: '1.0.0',
        lastUpdated: '2024-01-15',
        downloads: 1250,
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
      <CustomButton variant="text">
        Text Button
      </CustomButton>
    </Stack>
  );
}`,

        relatedComponents: ['antd-button', 'chakra-button'],
        documentation: `
## MUI Button Variants

Bộ sưu tập các biến thể button Material-UI được tùy chỉnh với styling hiện đại và responsive.

### Tính năng chính

- ✅ 4 biến thể button khác nhau
- ✅ Gradient background với hover effects
- ✅ Border radius tùy chỉnh
- ✅ Typography được tối ưu
- ✅ Responsive design
- ✅ Accessibility support

### Cách sử dụng

1. Cài đặt MUI dependencies
2. Import component vào project
3. Tùy chỉnh colors và styling theo brand
4. Sử dụng trong form hoặc UI

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'contained' \| 'outlined' \| 'text' | 'contained' | Kiểu button |
| className | string | - | CSS class tùy chỉnh |
| children | ReactNode | - | Nội dung button |

### Customization

Bạn có thể tùy chỉnh theme colors, spacing và typography thông qua MUI theme provider.
    `,
    },
    'antd-form': {
        id: 'antd-form',
        name: 'Ant Design Form',
        description:
            'Form validation và layout hoàn chỉnh với Ant Design components',
        category: 'Forms',
        library: 'Ant Design',
        complexity: 'Intermediate',
        tags: ['form', 'antd', 'validation', 'input', 'select', 'datepicker'],
        author: 'Component Library Team',
        version: '1.0.0',
        lastUpdated: '2024-01-15',
        downloads: 890,
        code: `import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function AntdForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    message.success('Form submitted successfully!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please check your form data');
  };

  return (
    <Form
      form={form}
      name="user_form"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{ maxWidth: 400 }}
    >
      <Form.Item
        label="Họ và tên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="example@email.com" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="0123456789" />
      </Form.Item>

      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="birthDate"
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Gửi thông tin
        </Button>
      </Form.Item>
    </Form>
  );
}`,
        previewComponent: () => (
            <div className='max-w-md space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Họ và tên
                    </label>
                    <input
                        type='text'
                        placeholder='Nhập họ và tên'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                    </label>
                    <input
                        type='email'
                        placeholder='example@email.com'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Số điện thoại
                    </label>
                    <input
                        type='tel'
                        placeholder='0123456789'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Giới tính
                    </label>
                    <select className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                        <option>Chọn giới tính</option>
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Ngày sinh
                    </label>
                    <input
                        type='date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>
                <button className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium'>
                    Gửi thông tin
                </button>
            </div>
        ),
        relatedComponents: ['mui-form', 'chakra-form'],
        documentation: `
## Ant Design Form

Form component đầy đủ với validation, layout responsive và UX tối ưu.

### Tính năng chính

- ✅ Form validation với rules tùy chỉnh
- ✅ Responsive layout
- ✅ Icon integration
- ✅ Multiple input types
- ✅ Error handling
- ✅ Success messages

### Form Fields

- Text input với icon
- Email validation
- Phone number input
- Select dropdown
- Date picker
- Submit button

### Validation Rules

Form bao gồm các validation rules:
- Required fields
- Email format validation
- Custom error messages
- Real-time validation
    `,
    },
    'custom-card': {
        id: 'custom-card',
        name: 'Custom Card Component',
        description: 'Card component với animation và hover effects đẹp mắt',
        category: 'Layout',
        library: 'Custom',
        complexity: 'Intermediate',
        tags: ['card', 'animation', 'hover', 'custom', 'framer-motion'],
        author: 'Component Library Team',
        version: '1.0.0',
        lastUpdated: '2024-01-15',
        downloads: 1450,
        code: `import { useState } from 'react';
import { motion } from 'framer-motion';

interface CustomCardProps {
  title: string;
  description: string;
  image?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function CustomCard({ 
  title, 
  description, 
  image, 
  onAction, 
  actionLabel = 'Learn More' 
}: CustomCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-2"
          animate={{ color: isHovered ? '#3B82F6' : '#111827' }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <motion.button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            whileHover={{ backgroundColor: '#2563EB' }}
            whileTap={{ scale: 0.95 }}
          >
            {actionLabel}
            <motion.svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}`,
        previewComponent: () => (
            <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 max-w-sm hover:shadow-xl transition-shadow duration-300'>
                <div className='h-40 bg-gradient-to-r from-purple-400 to-pink-400'></div>
                <div className='p-6'>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                        Custom Card
                    </h3>
                    <p className='text-gray-600 mb-4'>
                        Card component với animation và hover effects đẹp mắt
                        cho UI hiện đại
                    </p>
                    <button className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors'>
                        Learn More
                        <svg
                            className='ml-2 w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                            />
                        </svg>
                    </button>
                </div>
            </div>
        ),
        relatedComponents: ['mui-card', 'antd-card'],
        documentation: `
## Custom Card Component

Card component với animation mượt mà và interactive hover effects.

### Tính năng chính

- ✅ Framer Motion animations
- ✅ Hover state management
- ✅ Optional image support
- ✅ Customizable action button
- ✅ Responsive design
- ✅ TypeScript support

### Props Interface

\`\`\`typescript
interface CustomCardProps {
  title: string;
  description: string;
  image?: string;
  onAction?: () => void;
  actionLabel?: string;
}
\`\`\`

### Animation Features

- Lift and scale on hover
- Image zoom effect
- Color transitions
- Button interactions
- Arrow slide animation
    `,
    },
};

// Generate static params for all components
export async function generateStaticParams() {
    return Object.keys(componentData).map((id) => ({ id }));
}

// Generate metadata for each component page
export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const component = componentData[params.id as keyof typeof componentData];

    if (!component) {
        return {
            title: 'Component không tìm thấy',
            description: 'Component bạn đang tìm kiếm không tồn tại',
        };
    }

    return {
        title: `${component.name} - Component Library`,
        description: component.description,
        keywords: [
            component.name,
            component.library,
            ...component.tags,
            'React component',
            'UI library',
            'Frontend',
        ],
        authors: [{ name: component.author }],
        openGraph: {
            title: `${component.name} - Component Library`,
            description: component.description,
            type: 'article',
            locale: 'vi_VN',
            publishedTime: component.lastUpdated,
            tags: component.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${component.name} - Component Library`,
            description: component.description,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `/component-library/${component.id}`,
        },
    };
}

export default function ComponentDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const component = componentData[params.id as keyof typeof componentData];

    if (!component) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <Navigation />

            <div className='container mx-auto px-4 py-8'>
                {/* Breadcrumb */}
                <nav className='mb-8'>
                    <ol className='flex items-center space-x-2 text-sm text-gray-600'>
                        <li>
                            <Link href='/' className='hover:text-blue-600'>
                                Trang chủ
                            </Link>
                        </li>
                        <li className='mx-2'>/</li>
                        <li>
                            <Link
                                href='/component-library'
                                className='hover:text-blue-600'
                            >
                                Component Library
                            </Link>
                        </li>
                        <li className='mx-2'>/</li>
                        <li className='text-gray-900 font-medium'>
                            {component.name}
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <header className='mb-12'>
                    <div className='flex items-start justify-between mb-6'>
                        <div>
                            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                {component.name}
                            </h1>
                            <p className='text-xl text-gray-600 max-w-3xl'>
                                {component.description}
                            </p>
                        </div>

                        <div className='flex flex-col items-end gap-3'>
                            <div className='flex gap-2'>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        component.library === 'MUI'
                                            ? 'bg-blue-100 text-blue-800'
                                            : component.library === 'Ant Design'
                                            ? 'bg-orange-100 text-orange-800'
                                            : component.library === 'Custom'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {component.library}
                                </span>
                            </div>

                            <div className='text-sm text-gray-500 text-right'>
                                <div>
                                    📊 {component.downloads.toLocaleString()}{' '}
                                    downloads
                                </div>
                                <div>📅 {component.lastUpdated}</div>
                                <div>👤 {component.author}</div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className='flex flex-wrap gap-2'>
                        {component.tags.map((tag) => (
                            <span
                                key={tag}
                                className='px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors'
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main Content */}
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                    {/* Code Section */}
                    <div className='xl:col-span-2 space-y-8'>
                        {/* Source Code */}
                        <section className='bg-white rounded-lg shadow-sm border p-6'>
                            <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
                                💻 Source Code
                            </h2>
                            <ComponentCode
                                code={component.code}
                                language='tsx'
                            />
                        </section>

                        {/* Documentation */}
                        <section className='bg-white rounded-lg shadow-sm border p-6'>
                            <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
                                📚 Documentation
                            </h2>
                            <div className='prose prose-gray max-w-none'>
                                <div className='whitespace-pre-wrap text-gray-700 leading-relaxed'>
                                    {component.documentation}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Quick Info */}
                        <div className='bg-white rounded-lg shadow-sm border p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                ℹ️ Thông tin
                            </h3>
                            <dl className='space-y-3'>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Thư viện
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {component.library}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Version
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {component.version}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Cập nhật
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {component.lastUpdated}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Related Components */}
                        <div className='bg-white rounded-lg shadow-sm border p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                🔗 Component liên quan
                            </h3>
                            <div className='space-y-2'>
                                {component.relatedComponents.map(
                                    (relatedId) => (
                                        <Link
                                            key={relatedId}
                                            href={`/component-library/${relatedId}`}
                                            className='block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
                                        >
                                            <div className='text-sm font-medium text-gray-900'>
                                                {relatedId
                                                    .replace('-', ' ')
                                                    .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase(),
                                                    )}
                                            </div>
                                        </Link>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='bg-white rounded-lg shadow-sm border p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                ⚡ Hành động
                            </h3>
                            <div className='space-y-3'>
                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            component.code,
                                        )
                                    }
                                    className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                >
                                    📋 Copy Code
                                </button>
                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            window.location.href,
                                        )
                                    }
                                    className='w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    🔗 Share Link
                                </button>
                                <Link
                                    href='/component-library'
                                    className='w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    ← Quay lại Library
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
