'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    href: string;
    label: string;
}

interface NavigationClientProps {
    navItems: NavItem[];
}

// Client Component - only handles active state logic
export function NavigationClient({ navItems }: NavigationClientProps) {
    const pathname = usePathname();

    return (
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
                            <div className='font-medium'>{item.label}</div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
