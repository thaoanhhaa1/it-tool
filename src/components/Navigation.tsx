import Image from 'next/image';
import Link from 'next/link';
import { NavigationClient } from './NavigationClient';

// Static navigation data - can be rendered on server
const navItems = [
    {
        href: '/',
        label: 'Trang chủ',
    },
    {
        href: '/json-to-typescript',
        label: 'JSON to TypeScript',
    },
    {
        href: '/interface-to-zod',
        label: 'Interface to Zod',
    },
    {
        href: '/html-to-jsx',
        label: 'HTML to JSX',
    },
    {
        href: '/curl-converter',
        label: 'CURL Converter',
    },
    {
        href: '/code-library',
        label: 'Code Library',
    },
];

// Server Component - renders most of the navigation
export default function Navigation() {
    return (
        <nav className='sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo/Brand - Server rendered */}
                    <Link
                        href='/'
                        className='flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200'
                        aria-label='Trang chủ - It Tools'
                    >
                        <Image
                            src='/coding_192.png'
                            alt='It Tools Logo'
                            width={32}
                            height={32}
                            className='rounded-lg'
                            priority
                        />
                        <span className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                            It Tools
                        </span>
                    </Link>

                    {/* Desktop Navigation Items */}
                    <div className='hidden lg:block'>
                        <NavigationClient navItems={navItems} />
                    </div>

                    {/* Mobile menu button */}
                    <div className='lg:hidden'>
                        <NavigationClient navItems={navItems} isMobile={true} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
