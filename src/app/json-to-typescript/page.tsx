import { Metadata } from 'next';
import JsonToTypescriptConverter from '../../components/JsonToTypescriptConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'JSON to TypeScript Converter - Chuyển đổi JSON sang Interface miễn phí',
    description:
        'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ nested objects, arrays, camelCase formatting và copy clipboard. Nhanh chóng, chính xác, không cần đăng ký.',
    keywords: [
        'JSON to TypeScript',
        'JSON converter',
        'TypeScript interface generator',
        'JSON parser',
        'TypeScript tools',
        'convert JSON to interface',
        'nested objects',
        'camelCase formatting',
        'free JSON converter',
        'developer tools',
        'programming tools',
        'web development',
    ],
    openGraph: {
        title: 'JSON to TypeScript Converter - Chuyển đổi JSON sang Interface miễn phí',
        description:
            'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface. Hỗ trợ nested objects, arrays, camelCase formatting.',
        url: 'https://it-tool-two.vercel.app/json-to-typescript',
        images: [
            {
                url: '/og-json-typescript.jpg',
                width: 1200,
                height: 630,
                alt: 'JSON to TypeScript Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JSON to TypeScript Converter - Miễn phí',
        description:
            'Chuyển đổi JSON sang TypeScript interface. Hỗ trợ nested objects, arrays, camelCase formatting.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/json-to-typescript',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON to TypeScript Converter',
    description:
        'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface với hỗ trợ nested objects, arrays và camelCase formatting.',
    url: 'https://it-tool-two.vercel.app/json-to-typescript',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Chuyển đổi JSON sang TypeScript interface',
        'Hỗ trợ nested objects',
        'Hỗ trợ arrays',
        'CamelCase formatting',
        'Type inference tự động',
        'Copy kết quả vào clipboard',
        'Real-time preview',
        'Dark mode support',
    ],
    author: {
        '@type': 'Organization',
        name: 'It Tools',
    },
    mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'JSON to TypeScript Converter',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function JsonToTypescriptPage() {
    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <Navigation />
                <JsonToTypescriptConverter />
            </div>
        </>
    );
}
