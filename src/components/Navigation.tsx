import Image from 'next/image';
import Link from 'next/link';
import { NavigationClient } from './NavigationClient';

// Static navigation data - can be rendered on server
const navItems = [
    {
        href: '/',
        label: 'Trang chủ',
        description: 'Về trang chủ It Tools',
    },
    {
        href: '/json-to-typescript',
        label: 'JSON to TypeScript',
        description: 'Chuyển đổi JSON sang TypeScript interface',
    },
    {
        href: '/interface-to-zod',
        label: 'Interface to Zod',
        description: 'Chuyển đổi TypeScript interface sang Zod schema',
    },
    {
        href: '/html-to-jsx',
        label: 'HTML to JSX',
        description: 'Chuyển đổi HTML sang JSX component',
    },
];

// Server Component - renders most of the navigation
export default function Navigation() {
    return (
        <nav className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
            <div className='max-w-6xl mx-auto px-6'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo/Brand - Server rendered */}
                    <Link href='/' className='flex items-center space-x-3'>
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

                    {/* Navigation Items - delegated to client component for active state */}
                    <NavigationClient navItems={navItems} />
                </div>
            </div>
        </nav>
    );
}
