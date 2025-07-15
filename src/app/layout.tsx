import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
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
    title: 'JSON to TypeScript Converter - Chuyển đổi JSON sang Interface miễn phí',
    description:
        'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ camelCase, nested objects, arrays và nhiều tùy chọn khác. Nhanh chóng, chính xác và dễ sử dụng.',
    keywords: [
        'JSON to TypeScript',
        'JSON converter',
        'TypeScript interface',
        'JSON parser',
        'TypeScript generator',
        'free online tool',
        'developer tools',
        'code converter',
    ],
    authors: [{ name: 'JSON to TypeScript Converter' }],
    creator: 'JSON to TypeScript Converter',
    publisher: 'JSON to TypeScript Converter',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://convert-json.vercel.app'), // Thay đổi URL này theo domain thực tế
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'JSON to TypeScript Converter - Chuyển đổi JSON sang Interface miễn phí',
        description:
            'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ camelCase, nested objects, arrays và nhiều tùy chọn khác.',
        url: 'https://convert-json.vercel.app', // Thay đổi URL này theo domain thực tế
        siteName: 'JSON to TypeScript Converter',
        images: [
            {
                url: '/og-image.jpg', // Bạn sẽ cần tạo ảnh này
                width: 1200,
                height: 630,
                alt: 'JSON to TypeScript Converter Tool',
            },
        ],
        locale: 'vi_VN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JSON to TypeScript Converter - Chuyển đổi JSON sang Interface miễn phí',
        description:
            'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ camelCase, nested objects, arrays.',
        images: ['/og-image.jpg'], // Bạn sẽ cần tạo ảnh này
        creator: '@your-twitter-handle', // Thay đổi theo Twitter handle thực tế
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
        google: 'your-google-verification-code', // Thêm Google Search Console verification code
        // yandex: 'your-yandex-verification-code',
        // bing: 'your-bing-verification-code',
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
                            name: 'JSON to TypeScript Converter',
                            description:
                                'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ camelCase, nested objects, arrays và nhiều tùy chọn khác.',
                            url: 'https://convert-json.vercel.app',
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
                                name: 'JSON to TypeScript Converter',
                            },
                            featureList: [
                                'Chuyển đổi JSON sang TypeScript interface',
                                'Hỗ trợ camelCase formatting',
                                'Xử lý nested objects và arrays',
                                'Copy kết quả vào clipboard',
                                'Dark mode support',
                                'Miễn phí và không cần đăng ký',
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
                {children}
            </body>
        </html>
    );
}
