import { Metadata } from 'next';
import InterfaceToZodConverter from '../../components/InterfaceToZodConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'Interface to Zod Converter - Chuyển đổi TypeScript Interface sang Zod Schema',
    description:
        'Công cụ miễn phí chuyển đổi TypeScript interface sang Zod schema. Hỗ trợ optional fields, nested objects, arrays và type inference. Validation runtime miễn phí.',
    keywords: [
        'Interface to Zod',
        'TypeScript to Zod',
        'Zod schema generator',
        'TypeScript interface converter',
        'Zod validation',
        'schema validation',
        'runtime validation',
        'type safety',
        'TypeScript tools',
        'Zod tools',
        'free converter',
        'developer tools',
        'programming tools',
    ],
    openGraph: {
        title: 'Interface to Zod Converter - Chuyển đổi TypeScript Interface sang Zod Schema',
        description:
            'Công cụ miễn phí chuyển đổi TypeScript interface sang Zod schema. Hỗ trợ optional fields, nested objects, arrays.',
        url: 'https://it-tool-two.vercel.app/interface-to-zod',
        images: [
            {
                url: '/og-interface-zod.jpg',
                width: 1200,
                height: 630,
                alt: 'Interface to Zod Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Interface to Zod Converter - Miễn phí',
        description:
            'Chuyển đổi TypeScript interface sang Zod schema. Hỗ trợ validation, optional fields, nested objects.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/interface-to-zod',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Interface to Zod Converter',
    description:
        'Công cụ miễn phí chuyển đổi TypeScript interface sang Zod schema với hỗ trợ optional fields, nested objects và arrays.',
    url: 'https://it-tool-two.vercel.app/interface-to-zod',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Chuyển đổi TypeScript interface sang Zod schema',
        'Hỗ trợ optional fields',
        'Hỗ trợ nested objects',
        'Hỗ trợ arrays',
        'Union types support',
        'Type inference tự động',
        'Export options linh hoạt',
        'Runtime validation với Zod',
    ],
    author: {
        '@type': 'Organization',
        name: 'It Tools',
    },
    mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Interface to Zod Converter',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function InterfaceToZodPage() {
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
                <InterfaceToZodConverter />
            </div>
        </>
    );
}
