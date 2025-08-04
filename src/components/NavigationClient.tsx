'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
    href: string;
    label: string;
}

interface NavigationClientProps {
    navItems: NavItem[];
    isMobile?: boolean;
}

// Client Component - handles active state logic and mobile menu
export function NavigationClient({
    navItems,
    isMobile = false,
}: NavigationClientProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Desktop Navigation
    if (!isMobile) {
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

    // Mobile Navigation
    return (
        <div className='relative'>
            {/* Mobile Menu Button */}
            <button
                type='button'
                onClick={toggleMenu}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200'
                aria-expanded={isMenuOpen}
                aria-label='Mở menu'
            >
                <span className='sr-only'>Mở menu chính</span>
                {isMenuOpen ? (
                    <svg
                        className='block h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        aria-hidden='true'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                ) : (
                    <svg
                        className='block h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        aria-hidden='true'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16M4 18h16'
                        />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50'>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-25 z-40'
                    onClick={closeMenu}
                />
            )}
        </div>
    );
}
