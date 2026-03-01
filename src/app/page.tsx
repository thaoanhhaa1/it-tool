import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export const metadata: Metadata = {
    title: 'It Tools - Bộ công cụ tiện ích miễn phí cho Developers',
    description:
        'Bộ công cụ toàn diện cho developers: JSON to TypeScript, Interface to Zod, JSON to Interface & Zod, HTML to JSX, CURL Converter, Data to Excel. Miễn phí, nhanh chóng, chính xác và không cần đăng ký.',
    keywords: [
        'it tools',
        'developer tools',
        'JSON to TypeScript converter',
        'Interface to Zod converter',
        'JSON to Interface Zod converter',
        'HTML to JSX converter',
        'CURL converter',
        'Data to Excel',
        'GraphQL converter',
        'programming tools',
        'code converter',
        'web development tools',
        'TypeScript tools',
        'Zod schema generator',
        'React tools',
        'free online tools',
    ],
    openGraph: {
        title: 'It Tools - Bộ công cụ tiện ích miễn phí cho Developers',
        description:
            'Bộ công cụ toàn diện cho developers: JSON to TypeScript, Interface to Zod, JSON to Interface & Zod, HTML to JSX, CURL Converter. Miễn phí, nhanh chóng và chính xác.',
        url: 'https://it-tool-two.vercel.app',
        images: [
            {
                url: '/og-home.jpg',
                width: 1200,
                height: 630,
                alt: 'It Tools - Developer Tools Homepage',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'It Tools - Bộ công cụ tiện ích miễn phí cho Developers',
        description:
            'JSON to TypeScript, Interface to Zod, HTML to JSX, CURL Converter, Data to Excel và nhiều công cụ khác. Miễn phí và không cần đăng ký.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app',
    },
};

export default function Home() {
    const tools = [
        {
            href: '/json-to-typescript',
            title: 'JSON to TypeScript',
            description:
                'Chuyển đổi JSON thành TypeScript interface một cách dễ dàng và nhanh chóng',
            icon: '🔄',
            features: [
                'Nested objects',
                'Arrays support',
                'CamelCase formatting',
                'Type inference',
            ],
            color: 'blue',
        },
        {
            href: '/interface-json-compare',
            title: 'Interface ↔ JSON Compare',
            description:
                'So sánh TypeScript interface với JSON để phát hiện field thiếu/dư và sai kiểu dữ liệu',
            icon: '🧩',
            features: [
                'Missing/extra fields',
                'Type mismatch',
                'Nested objects/arrays',
                'Optional fields',
            ],
            color: 'green',
        },
        {
            href: '/interface-to-zod',
            title: 'Interface to Zod',
            description:
                'Chuyển đổi TypeScript interface sang Zod schema để validation',
            icon: '✅',
            features: [
                'Schema validation',
                'Type safety',
                'Runtime checks',
                'Error handling',
            ],
            color: 'purple',
        },
        {
            href: '/json-to-interface-zod',
            title: 'JSON to Interface & Zod',
            description:
                'Chuyển đổi JSON sang cả TypeScript interface và Zod schema cùng lúc',
            icon: '🚀',
            features: [
                'Dual conversion',
                'Type safety + Validation',
                'Copy separately',
                'Complete solution',
            ],
            color: 'pink',
        },
        {
            href: '/string-to-json',
            title: 'Stringified JSON to JSON',
            description:
                'Parse chuỗi JSON đã được JSON.stringify (copy từ log, network, v.v) trở lại JSON object dễ đọc',
            icon: '🧵',
            features: [
                'Parse chuỗi stringify',
                'Hiển thị JSON format đẹp',
                'Hỗ trợ debug log',
                'Dán là xem ngay',
            ],
            color: 'cyan',
        },
        {
            href: '/html-to-jsx',
            title: 'HTML to JSX',
            description:
                'Chuyển đổi HTML thành JSX component cho React một cách tự động',
            icon: '⚛️',
            features: [
                'Attribute conversion',
                'Style objects',
                'Self-closing tags',
                'Comment handling',
            ],
            color: 'purple',
        },
        {
            href: '/curl-converter',
            title: 'CURL Converter',
            description:
                'Chuyển đổi curl command sang GraphQL query, mutation, REST API và TypeScript types',
            icon: '🌐',
            features: [
                'GraphQL Query/Mutation',
                'REST API code',
                'TypeScript types',
                'Headers support',
            ],
            color: 'indigo',
        },
        {
            href: '/data-to-excel',
            title: 'Data to Excel',
            description:
                'Lấy dữ liệu từ cURL hoặc JSON, điền vào template Excel qua ánh xạ field với gợi ý AI',
            icon: '📊',
            features: [
                'cURL / JSON nguồn',
                'Upload template Excel',
                'Gợi ý ánh xạ AI',
                'Tải file đã điền',
            ],
            color: 'emerald',
        },
        {
            href: '/code-library',
            title: 'Code Library',
            description: 'Thư viện code mẫu và snippets hữu ích cho developers',
            icon: '📚',
            features: [
                'Code snippets',
                'Best practices',
                'Common patterns',
                'Ready to use',
            ],
            color: 'yellow',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'hover:border-blue-300 dark:hover:border-blue-600 group-hover:text-blue-600 dark:group-hover:text-blue-400',
            green: 'hover:border-green-300 dark:hover:border-green-600 group-hover:text-green-600 dark:group-hover:text-green-400',
            purple: 'hover:border-purple-300 dark:hover:border-purple-600 group-hover:text-purple-600 dark:group-hover:text-purple-400',
            indigo: 'hover:border-indigo-300 dark:hover:border-indigo-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
            yellow: 'hover:border-yellow-300 dark:hover:border-yellow-600 group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
            pink: 'hover:border-pink-300 dark:hover:border-pink-600 group-hover:text-pink-600 dark:group-hover:text-pink-400',
            cyan: 'hover:border-cyan-300 dark:hover:border-cyan-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
            emerald:
                'hover:border-emerald-300 dark:hover:border-emerald-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* Hero Section */}
                <div className='text-center mb-16'>
                    <h1 className='text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
                        It Tools
                    </h1>
                    <p className='text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed'>
                        Bộ công cụ tiện ích dành cho developers. Chuyển đổi JSON
                        sang TypeScript interface, Interface sang Zod schema,
                        JSON sang cả Interface & Zod cùng lúc, HTML sang JSX
                        component, điền dữ liệu vào template Excel (Data to
                        Excel), và nhiều công cụ khác một cách nhanh chóng, miễn
                        phí và dễ sử dụng.
                    </p>
                    <div className='flex flex-wrap justify-center gap-4'>
                        <span className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium'>
                            Miễn phí 100%
                        </span>
                        <span className='px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium'>
                            Không cần đăng ký
                        </span>
                        <span className='px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium'>
                            Open Source
                        </span>
                        <span className='px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium'>
                            Responsive
                        </span>
                    </div>
                </div>

                {/* Tools Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                    {tools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className={`group block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${getColorClasses(
                                tool.color,
                            )}`}
                        >
                            <div className='text-4xl mb-4'>{tool.icon}</div>
                            <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors'>
                                {tool.title}
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 mb-6 leading-relaxed'>
                                {tool.description}
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {tool.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm'
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <div className='mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform'>
                                Sử dụng ngay
                                <svg
                                    className='w-5 h-5 ml-2'
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
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Features Section */}
                <div className='text-center mb-16'>
                    <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8'>
                        Tại sao chọn It Tools?
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='p-6'>
                            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg
                                    className='w-8 h-8 text-blue-600 dark:text-blue-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M13 10V3L4 14h7v7l9-11h-7z'
                                    />
                                </svg>
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                                Nhanh chóng
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Chuyển đổi code chỉ trong vài giây với giao diện
                                đơn giản
                            </p>
                        </div>
                        <div className='p-6'>
                            <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg
                                    className='w-8 h-8 text-green-600 dark:text-green-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                </svg>
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                                Chính xác
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Tự động phát hiện kiểu dữ liệu và tạo code chính
                                xác
                            </p>
                        </div>
                        <div className='p-6'>
                            <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg
                                    className='w-8 h-8 text-purple-600 dark:text-purple-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                                    />
                                </svg>
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                                Tùy chỉnh
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Nhiều tùy chọn định dạng và cấu hình theo nhu
                                cầu
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className='text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white'>
                    <h2 className='text-3xl font-bold mb-4'>
                        Bắt đầu ngay hôm nay
                    </h2>
                    <p className='text-xl mb-8 opacity-90'>
                        Chuyển đổi code của bạn một cách nhanh chóng và chính
                        xác chỉ trong vài click
                    </p>
                    <div className='flex flex-wrap justify-center gap-4'>
                        <Link
                            href='/json-to-typescript'
                            className='inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg'
                        >
                            JSON to TypeScript
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                        <Link
                            href='/json-to-interface-zod'
                            className='inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                        >
                            JSON to Interface & Zod
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                        <Link
                            href='/interface-to-zod'
                            className='inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                        >
                            Interface to Zod
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                        <Link
                            href='/html-to-jsx'
                            className='inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                        >
                            HTML to JSX
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                        <Link
                            href='/curl-converter'
                            className='inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                        >
                            Curl Converter
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                        <Link
                            href='/data-to-excel'
                            className='inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                        >
                            Data to Excel
                            <svg
                                className='w-5 h-5 ml-2'
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
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
