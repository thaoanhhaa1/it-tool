import { Metadata } from 'next';
import HtmlToJsxConverter from '../../components/HtmlToJsxConverter';
import Navigation from '../../components/Navigation';

export const metadata: Metadata = {
    title: 'HTML to JSX Converter - Chuyển đổi HTML sang JSX Component miễn phí',
    description:
        'Công cụ miễn phí chuyển đổi HTML sang JSX component cho React. Tự động convert attributes, style objects, self-closing tags và event handlers. Nhanh chóng và chính xác.',
    keywords: [
        'HTML to JSX',
        'HTML converter',
        'JSX converter',
        'React converter',
        'HTML to React',
        'JSX component generator',
        'React tools',
        'HTML parser',
        'attribute conversion',
        'style objects',
        'self-closing tags',
        'free converter',
        'developer tools',
        'web development',
    ],
    openGraph: {
        title: 'HTML to JSX Converter - Chuyển đổi HTML sang JSX Component miễn phí',
        description:
            'Công cụ miễn phí chuyển đổi HTML sang JSX component cho React. Tự động convert attributes, style objects, self-closing tags.',
        url: 'https://it-tool-two.vercel.app/html-to-jsx',
        images: [
            {
                url: '/og-html-jsx.jpg',
                width: 1200,
                height: 630,
                alt: 'HTML to JSX Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HTML to JSX Converter - Miễn phí',
        description:
            'Chuyển đổi HTML sang JSX component cho React. Tự động convert attributes, style objects, event handlers.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/html-to-jsx',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HTML to JSX Converter',
    description:
        'Công cụ miễn phí chuyển đổi HTML sang JSX component cho React với tự động convert attributes, style objects và event handlers.',
    url: 'https://it-tool-two.vercel.app/html-to-jsx',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Chuyển đổi HTML sang JSX component',
        'Attribute conversion (class → className)',
        'Style object conversion',
        'Self-closing tags formatting',
        'Event handlers conversion',
        'SVG attributes support',
        'Comments conversion',
        'Example template có sẵn',
    ],
    author: {
        '@type': 'Organization',
        name: 'It Tools',
    },
    mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'HTML to JSX Converter',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function HtmlToJsxPage() {
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
                <HtmlToJsxConverter />
            </div>
        </>
    );
}
