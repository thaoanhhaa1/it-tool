'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        {
            href: '/',
            label: 'JSON to TypeScript',
            description: 'Chuyển đổi JSON sang TypeScript interface',
        },
        {
            href: '/interface-to-zod',
            label: 'Interface to Zod',
            description: 'Chuyển đổi TypeScript interface sang Zod schema',
        },
    ];

    return (
        <nav className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
            <div className='max-w-6xl mx-auto px-6'>
                <div className='flex space-x-8'>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative py-4 px-1 inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300'
                                }`}
                            >
                                <div className='text-center'>
                                    <div className='font-medium'>
                                        {item.label}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
