import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import Footer from '../components/Footer';
import './globals.css';

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
    ],
};

export const metadata: Metadata = {
    title: {
        default: 'It Tools - Bộ công cụ miễn phí dành cho Developers',
        template: '%s | It Tools - Developer Tools',
    },
    description:
        'Bộ công cụ tiện ích miễn phí dành cho developers. Chuyển đổi JSON sang TypeScript interface, TypeScript interface sang Zod schema, HTML sang JSX và nhiều công cụ khác.',
    keywords: [
        'developer tools',
        'JSON to TypeScript',
        'Interface to Zod',
        'HTML to JSX',
        'code converter',
        'TypeScript interface',
        'Zod schema',
        'JSON parser',
        'free online tool',
        'programming tools',
        'web development',
        'React tools',
        'TypeScript tools',
    ],
    authors: [{ name: 'It Tools' }],
    creator: 'It Tools',
    publisher: 'It Tools',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://it-tool-two.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'It Tools - Bộ công cụ miễn phí dành cho Developers',
        description:
            'Bộ công cụ tiện ích miễn phí dành cho developers. Chuyển đổi JSON sang TypeScript, Interface sang Zod, HTML sang JSX và nhiều công cụ khác.',
        url: 'https://it-tool-two.vercel.app',
        siteName: 'It Tools',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'It Tools - Developer Tools',
            },
        ],
        locale: 'vi_VN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'It Tools - Bộ công cụ miễn phí dành cho Developers',
        description:
            'Bộ công cụ tiện ích miễn phí: JSON to TypeScript, Interface to Zod, HTML to JSX và nhiều công cụ khác.',
        images: ['/og-image.jpg'],
        creator: '@ittools_dev',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
    category: 'technology',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='vi' suppressHydrationWarning>
            <head>
                {/* Structured Data for SEO */}
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebApplication',
                            name: 'It Tools',
                            description:
                                'Bộ công cụ tiện ích miễn phí dành cho developers. Chuyển đổi JSON sang TypeScript interface, TypeScript interface sang Zod schema, HTML sang JSX và nhiều công cụ khác.',
                            url: 'https://it-tool-two.vercel.app',
                            applicationCategory: 'DeveloperApplication',
                            operatingSystem: 'Any',
                            permissions: 'none',
                            isAccessibleForFree: true,
                            offers: {
                                '@type': 'Offer',
                                price: '0',
                                priceCurrency: 'USD',
                            },
                            author: {
                                '@type': 'Organization',
                                name: 'It Tools',
                            },
                            featureList: [
                                'Chuyển đổi JSON sang TypeScript interface',
                                'Chuyển đổi TypeScript interface sang Zod schema',
                                'Chuyển đổi HTML sang JSX component',
                                'Hỗ trợ camelCase formatting',
                                'Xử lý nested objects và arrays',
                                'Copy kết quả vào clipboard',
                                'Dark mode support',
                                'Miễn phí và không cần đăng ký',
                                'Open source',
                                'Responsive design',
                            ],
                            hasAction: [
                                {
                                    '@type': 'ConvertAction',
                                    name: 'JSON to TypeScript',
                                    description:
                                        'Chuyển đổi JSON thành TypeScript interface',
                                    target: 'https://it-tool-two.vercel.app/json-to-typescript',
                                },
                                {
                                    '@type': 'ConvertAction',
                                    name: 'Interface to Zod',
                                    description:
                                        'Chuyển đổi TypeScript interface thành Zod schema',
                                    target: 'https://it-tool-two.vercel.app/interface-to-zod',
                                },
                                {
                                    '@type': 'ConvertAction',
                                    name: 'HTML to JSX',
                                    description:
                                        'Chuyển đổi HTML thành JSX component',
                                    target: 'https://it-tool-two.vercel.app/html-to-jsx',
                                },
                            ],
                        }),
                    }}
                />
                {/* Preload important resources */}
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />
            </head>
            <body className={`${roboto.className} antialiased`}>
                <div className='flex flex-col min-h-screen'>
                    <main className='flex-1'>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
