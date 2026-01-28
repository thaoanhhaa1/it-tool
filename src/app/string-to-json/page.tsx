import { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import StringifiedJsonToJsonViewer from '../../components/StringifiedJsonToJsonViewer';

export const metadata: Metadata = {
    title: 'Stringified JSON to JSON Viewer - Parse chuỗi JSON stringify',
    description:
        'Công cụ giúp parse chuỗi JSON đã được JSON.stringify (thường copy từ log, network) trở lại JSON object với format đẹp, dễ đọc và dễ debug.',
    keywords: [
        'stringified JSON',
        'JSON stringify viewer',
        'parse JSON string',
        'JSON debugger',
        'view JSON from logs',
        'decode JSON string',
        'developer tools',
        'it tools',
    ],
    openGraph: {
        title: 'Stringified JSON to JSON Viewer - Parse chuỗi JSON stringify',
        description:
            'Dán chuỗi JSON đã được stringify và xem lại JSON gốc với format đẹp, hỗ trợ debug nhanh hơn.',
        url: 'https://it-tool-two.vercel.app/string-to-json',
        images: [
            {
                url: '/og-string-to-json.jpg',
                width: 1200,
                height: 630,
                alt: 'Stringified JSON to JSON Viewer Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stringified JSON to JSON Viewer - Miễn phí',
        description:
            'Công cụ online giúp parse chuỗi JSON stringify trở lại JSON object format đẹp để dễ xem và debug.',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/string-to-json',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Stringified JSON to JSON Viewer',
    description:
        'Công cụ giúp parse chuỗi JSON đã được JSON.stringify trở lại JSON object format đẹp, phục vụ debug và đọc log.',
    url: 'https://it-tool-two.vercel.app/string-to-json',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Dán chuỗi JSON stringify và parse lại thành JSON',
        'Hiển thị JSON với format đẹp bằng code viewer',
        'Hỗ trợ xử lý chuỗi copy từ log hoặc network tab',
        'Hoàn toàn miễn phí, không cần đăng ký',
    ],
    author: {
        '@type': 'Organization',
        name: 'It Tools',
    },
    mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Stringified JSON to JSON Viewer',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
        },
    },
};

export default function StringToJsonPage() {
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
                <StringifiedJsonToJsonViewer />
            </div>
        </>
    );
}


