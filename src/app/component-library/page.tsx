import CodeLibrary from '@/components/ComponentLibrary';
import Navigation from '@/components/Navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Code Library - Thư viện Component & Function React',
    description:
        'Chia sẻ các React Components và JavaScript Functions hữu ích được xây dựng với MUI, Ant Design và các thư viện khác. Tìm hiểu, sao chép và sử dụng trong dự án của bạn.',
    keywords: [
        'React components',
        'JavaScript functions',
        'MUI components',
        'Ant Design components',
        'React hooks',
        'UI library',
        'Frontend components',
        'React examples',
        'Component sharing',
        'Function sharing',
        'Thư viện component',
        'Thư viện function',
        'React Việt Nam',
        'JavaScript utilities',
        'TypeScript utilities',
    ],
    authors: [{ name: 'Code Library Team' }],
    openGraph: {
        title: 'Code Library - Thư viện Component & Function React',
        description:
            'Chia sẻ các React Components và JavaScript Functions hữu ích được xây dựng với MUI, Ant Design và các thư viện khác.',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Code Library',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Code Library - Thư viện Component & Function React',
        description:
            'Chia sẻ các React Components và JavaScript Functions hữu ích.',
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
        google: 'your-google-site-verification',
    },
    alternates: {
        canonical: '/code-library',
    },
};

export default function CodeLibraryPage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <Navigation />

            <div className='container mx-auto px-4 py-8'>
                <CodeLibrary />
            </div>
        </div>
    );
}
