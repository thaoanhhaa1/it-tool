import { Metadata } from 'next';
import JsonToInterfaceZodConverter from '../../components/JsonToInterfaceZodConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'JSON to Interface & Zod Converter - Chuyển đổi JSON sang Interface và Zod Schema',
    description:
        'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface và Zod schema cùng lúc. Hỗ trợ nested objects, arrays, optional fields và type inference. Tạo code validation hoàn chỉnh.',
    keywords: [
        'JSON to Interface Zod',
        'JSON to TypeScript Zod',
        'JSON converter',
        'TypeScript interface generator',
        'Zod schema generator',
        'JSON parser',
        'TypeScript tools',
        'Zod tools',
        'convert JSON to interface',
        'convert JSON to Zod',
        'nested objects',
        'validation schema',
        'runtime validation',
        'type safety',
        'free JSON converter',
        'developer tools',
        'programming tools',
        'web development',
    ],
    openGraph: {
        title: 'JSON to Interface & Zod Converter - Chuyển đổi JSON sang Interface và Zod Schema',
        description:
            'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface và Zod schema cùng lúc. Hỗ trợ nested objects, arrays, validation.',
        url: 'https://it-tool-two.vercel.app/json-to-interface-zod',
        images: [
            {
                url: '/og-json-interface-zod.jpg',
                width: 1200,
                height: 630,
                alt: 'JSON to Interface & Zod Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JSON to Interface & Zod Converter - Miễn phí',
        description:
            'Chuyển đổi JSON sang TypeScript interface và Zod schema. Hỗ trợ nested objects, arrays, validation.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/json-to-interface-zod',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON to Interface & Zod Converter',
    description:
        'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface và Zod schema với hỗ trợ nested objects, arrays và validation.',
    url: 'https://it-tool-two.vercel.app/json-to-interface-zod',
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
        'Chuyển đổi JSON sang Zod schema',
        'Hỗ trợ nested objects',
        'Hỗ trợ arrays',
        'Hỗ trợ optional fields',
        'CamelCase formatting',
        'Type inference tự động',
        'Runtime validation với Zod',
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
        name: 'JSON to Interface & Zod Converter',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function JsonToInterfaceZodPage() {
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
                <JsonToInterfaceZodConverter />
            </div>
        </>
    );
}
