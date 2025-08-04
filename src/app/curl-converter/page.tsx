import { Metadata } from 'next';
import CurlConverter from '../../components/CurlConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'Curl to Query/Mutation/API/Type Converter - Chuyển đổi Curl sang code miễn phí',
    description:
        'Công cụ miễn phí chuyển đổi curl command sang GraphQL query, mutation, REST API và TypeScript types. Hỗ trợ Zod schema validation, React Query pattern và Axios integration. Nhanh chóng, chính xác, không cần đăng ký.',
    keywords: [
        'curl converter',
        'curl to GraphQL',
        'curl to query',
        'curl to mutation',
        'curl to API',
        'curl to TypeScript',
        'curl parser',
        'GraphQL tools',
        'REST API tools',
        'TypeScript tools',
        'convert curl command',
        'free curl converter',
        'developer tools',
        'programming tools',
        'web development',
        'Zod schema',
        'React Query',
        'Axios integration',
        'TypeScript validation',
    ],
    openGraph: {
        title: 'Curl to Query/Mutation/API/Type Converter - Chuyển đổi Curl sang code miễn phí',
        description:
            'Công cụ miễn phí chuyển đổi curl command sang GraphQL query, mutation, REST API và TypeScript types với Zod validation.',
        url: 'https://it-tool-two.vercel.app/curl-converter',
        images: [
            {
                url: '/og-curl-converter.jpg',
                width: 1200,
                height: 630,
                alt: 'Curl to Query/Mutation/API/Type Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Curl to Query/Mutation/API/Type Converter - Miễn phí',
        description:
            'Chuyển đổi curl command sang GraphQL query, mutation, REST API và TypeScript types với Zod validation.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/curl-converter',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Curl to Query/Mutation/API/Type Converter',
    description:
        'Công cụ miễn phí chuyển đổi curl command sang GraphQL query, mutation, REST API và TypeScript types với Zod validation.',
    url: 'https://it-tool-two.vercel.app/curl-converter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Chuyển đổi curl sang GraphQL query với Zod validation',
        'Chuyển đổi curl sang GraphQL mutation với type safety',
        'Chuyển đổi curl sang REST API với Axios integration',
        'Chuyển đổi curl sang TypeScript types',
        'Hỗ trợ headers và parameters',
        'React Query pattern integration',
        'Automatic cache invalidation',
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
        name: 'Curl to Query/Mutation/API/Type Converter',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function CurlConverterPage() {
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
                <CurlConverter />
            </div>
        </>
    );
}
