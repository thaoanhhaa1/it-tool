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
    const [openGroup, setOpenGroup] = useState<string | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleGroup = (title: string) => {
        setOpenGroup((prev) => (prev === title ? null : title));
    };

    const closeGroups = () => {
        setOpenGroup(null);
    };

    // Desktop Navigation
    if (!isMobile) {
        const homeItem = navItems[0];
        const toolItems = navItems.slice(1);

        const groupedTools = [
            {
                title: 'JSON & TypeScript',
                items: toolItems.filter((item) =>
                    [
                        '/json-to-typescript',
                        '/json-to-interface-zod',
                        '/string-to-json',
                    ].includes(item.href),
                ),
            },
            {
                title: 'Validation & Zod',
                items: toolItems.filter((item) =>
                    ['/interface-to-zod'].includes(item.href),
                ),
            },
            {
                title: 'HTML & UI',
                items: toolItems.filter((item) =>
                    ['/html-to-jsx', '/code-library'].includes(item.href),
                ),
            },
            {
                title: 'Network & API',
                items: toolItems.filter((item) =>
                    ['/curl-converter'].includes(item.href),
                ),
            },
        ].filter((group) => group.items.length > 0);

        return (
            <div className='flex items-center space-x-4'>
                {/* Home link */}
                {homeItem && (
                    <Link
                        href={homeItem.href}
                        className={`relative py-4 px-1 inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                            pathname === homeItem.href
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300'
                        }`}
                    >
                        <span className='font-medium'>{homeItem.label}</span>
                    </Link>
                )}

                {/* Grouped dropdowns */}
                {groupedTools.map((group) => {
                    const isActiveGroup = group.items.some(
                        (item) => pathname === item.href,
                    );
                    const isOpen = openGroup === group.title;

                    return (
                        <div key={group.title} className='relative'>
                            <button
                                type='button'
                                onClick={() => toggleGroup(group.title)}
                                className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-full text-sm font-medium border shadow-sm transition-all duration-200 ${
                                    isActiveGroup || isOpen
                                        ? 'bg-blue-50/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-md'
                                        : 'bg-white/80 text-gray-700 dark:bg-gray-800/70 dark:text-gray-200 border-gray-200/80 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                                aria-expanded={isOpen}
                            >
                                <span>{group.title}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                >
                                    <path
                                        d='M6 9l6 6 6-6'
                                        strokeWidth={2}
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </button>

                            {isOpen && (
                                <div className='absolute right-0 mt-3 w-[320px] max-h-[70vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50'>
                                    <div className='px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500'>
                                        {group.title}
                                    </div>
                                    <div className='space-y-1 px-1 pb-1'>
                                        {group.items.map((item) => {
                                            const isActive =
                                                pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={closeGroups}
                                                    className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    <span className='mt-0.5 h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600' />
                                                    <span className='truncate'>
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
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
