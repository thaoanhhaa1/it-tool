import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        tools: [
            {
                href: '/json-to-typescript',
                label: 'JSON to TypeScript',
            },
            {
                href: '/interface-to-zod',
                label: 'Interface to Zod',
            },
        ],
        resources: [
            {
                href: 'https://www.typescriptlang.org/',
                label: 'TypeScript Docs',
                external: true,
            },
            {
                href: 'https://zod.dev/',
                label: 'Zod Documentation',
                external: true,
            },
            {
                href: 'https://json.org/',
                label: 'JSON Specification',
                external: true,
            },
        ],
    };

    return (
        <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
            <div className='max-w-6xl mx-auto px-6 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                    {/* Brand Section */}
                    <div className='md:col-span-2'>
                        <Link
                            href='/'
                            className='flex items-center space-x-3 mb-4'
                        >
                            <Image
                                src='/coding_192.png'
                                alt='It Tools Logo'
                                width={32}
                                height={32}
                                className='rounded-lg'
                            />
                            <span className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                It Tools
                            </span>
                        </Link>
                        <p className='text-gray-600 dark:text-gray-400 mb-4 max-w-md'>
                            Bộ công cụ tiện ích miễn phí dành cho developers.
                            Chuyển đổi JSON sang TypeScript interface và
                            TypeScript interface sang Zod schema một cách nhanh
                            chóng và chính xác.
                        </p>
                        <div className='flex space-x-4'>
                            <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium'>
                                Miễn phí 100%
                            </span>
                            <span className='px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium'>
                                Open Source
                            </span>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                            Công cụ
                        </h3>
                        <ul className='space-y-3'>
                            {footerLinks.tools.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Section */}
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                            Tài liệu tham khảo
                        </h3>
                        <ul className='space-y-3'>
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        {...(link.external
                                            ? {
                                                  target: '_blank',
                                                  rel: 'noopener noreferrer',
                                              }
                                            : {})}
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center'
                                    >
                                        {link.label}
                                        {link.external && (
                                            <svg
                                                className='w-4 h-4 ml-1'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                                                />
                                            </svg>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                        <div className='text-gray-600 dark:text-gray-400 text-sm'>
                            © {currentYear} It Tools. Tất cả quyền được bảo lưu.
                        </div>
                        <div className='flex items-center space-x-6'>
                            <div className='text-gray-600 dark:text-gray-400 text-sm flex items-center'>
                                <span className='mr-2'>Được xây dựng với</span>
                                <svg
                                    className='w-4 h-4 text-red-500 mx-1'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                                </svg>
                                <span className='ml-2'>và Next.js</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
