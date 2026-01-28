import { Metadata } from 'next';
import InterfaceJsonCompareConverter from '../../components/InterfaceJsonCompareConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'Interface ↔ JSON Comparator - So sánh field và type miễn phí',
    description:
        'Công cụ miễn phí so sánh TypeScript interface với JSON để phát hiện field thiếu/dư và sai kiểu dữ liệu. Hỗ trợ nested objects/arrays và optional fields.',
    keywords: [
        'interface json compare',
        'compare interface and json',
        'typescript interface',
        'json validator',
        'type mismatch',
        'missing fields',
        'developer tools',
        'typescript tools',
    ],
    openGraph: {
        title: 'Interface ↔ JSON Comparator - So sánh field và type miễn phí',
        description:
            'So sánh TypeScript interface với JSON để phát hiện field thiếu/dư và sai type. Hỗ trợ nested objects/arrays và optional fields.',
        url: 'https://it-tool-two.vercel.app/interface-json-compare',
        images: [
            {
                url: '/og-interface-json-compare.jpg',
                width: 1200,
                height: 630,
                alt: 'Interface JSON Compare Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Interface ↔ JSON Comparator - Miễn phí',
        description:
            'So sánh TypeScript interface với JSON để phát hiện field thiếu/dư và sai type.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/interface-json-compare',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Interface JSON Comparator',
    description:
        'Công cụ miễn phí so sánh TypeScript interface với JSON để phát hiện field thiếu/dư và sai kiểu dữ liệu.',
    url: 'https://it-tool-two.vercel.app/interface-json-compare',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'So sánh field tồn tại/không tồn tại giữa interface và JSON',
        'Phát hiện sai type (string/number/boolean/object/array/null)',
        'So sánh nested objects và arrays theo path',
        'Hỗ trợ optional fields',
    ],
    author: {
        '@type': 'Organization',
        name: 'It Tools',
    },
};

export default function InterfaceJsonComparePage() {
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
                <InterfaceJsonCompareConverter />
            </div>
        </>
    );
}

