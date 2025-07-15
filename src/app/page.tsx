import Link from 'next/link';
import Navigation from '../components/Navigation';

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
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />

            <main className='max-w-6xl mx-auto px-6 py-12'>
                {/* Hero Section */}
                <div className='text-center mb-16'>
                    <h1 className='text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
                        It Tools
                    </h1>
                    <p className='text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto'>
                        Bộ công cụ tiện ích dành cho developers. Chuyển đổi JSON
                        sang TypeScript interface, TypeScript interface sang Zod
                        schema, và HTML sang JSX component một cách nhanh chóng,
                        miễn phí và dễ sử dụng.
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
                    </div>
                </div>

                {/* Tools Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
                    {tools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className='group block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        >
                            <div className='text-4xl mb-4'>{tool.icon}</div>
                            <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
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
                                Chuyển đổi JSON thành TypeScript interface chỉ
                                trong vài giây
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
                                Tự động phát hiện kiểu dữ liệu và tạo interface
                                chính xác
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
                            className='inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg'
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
                            href='/interface-to-zod'
                            className='inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
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
                            className='inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
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
                    </div>
                </div>
            </main>
        </div>
    );
}
