import ComponentCode from '@/components/ComponentCode';
import CopyButton from '@/components/CopyButton';
import Navigation from '@/components/Navigation';
import { codeExampleService } from '@/services/apiService';
import { ICodeExampleDetail } from '@/types/codeExample/codeExample.interface';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Async function để fetch code example từ API (không gọi incrementView)
async function getCodeExample(id: string): Promise<ICodeExampleDetail | null> {
    try {
        const codeExample = await codeExampleService.getById(id);
        return codeExample;
    } catch (error) {
        console.error('Error fetching code example:', error);
        return null;
    }
}

// Generate metadata cho từng component detail page
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const example = await getCodeExample(id);

    if (!example) {
        return {
            title: 'Code không tìm thấy - Code Library',
            description: 'Code example bạn tìm kiếm không tồn tại.',
        };
    }

    return {
        title: `${example.name} - ${example.library} ${
            example.type.name === 'component' ? 'Component' : 'Function'
        } | Code Library`,
        description: `${example.description} Xem code example và cách sử dụng ${example.name} trong dự án React của bạn.`,
        keywords: [
            example.name,
            example.library.name,
            example.type.name,
            ...example.tags.map((item) => item.name),
            'React',
            'JavaScript',
            'TypeScript',
            'Code example',
            'Tutorial',
        ],
        openGraph: {
            title: `${example.name} - ${example.library} ${
                example.type.name === 'component' ? 'Component' : 'Function'
            }`,
            description: example.description,
            type: 'article',
            locale: 'vi_VN',
        },
        alternates: {
            canonical: `/code-library/${example.id}`,
        },
    };
}

// Generate static params cho tất cả components có sẵn
export async function generateStaticParams() {
    // Trả về mảng rỗng để tránh lỗi khi build mà API chưa sẵn sàng
    // Các trang sẽ được tạo on-demand
    return [];
}

export default async function CodeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const example = await getCodeExample(id);

    if (!example) {
        notFound();
    }

    codeExampleService.incrementView(id).finally();

    const typeColors: Record<string, string> = {
        component: 'bg-indigo-100 text-indigo-800',
        function: 'bg-emerald-100 text-emerald-800',
    };

    const libraryColors: Record<string, string> = {
        MUI: 'bg-blue-100 text-blue-800',
        'Ant Design': 'bg-orange-100 text-orange-800',
        'Chakra UI': 'bg-teal-100 text-teal-800',
        Custom: 'bg-purple-100 text-purple-800',
        'Headless UI': 'bg-gray-100 text-gray-800',
        JavaScript: 'bg-yellow-100 text-yellow-800',
        TypeScript: 'bg-blue-100 text-blue-800',
        React: 'bg-cyan-100 text-cyan-800',
        Utility: 'bg-green-100 text-green-800',
    };

    const typeIcons: Record<string, string> = {
        component: '⚛️',
        function: '🔧',
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <Navigation />

            <div className='container mx-auto px-4 py-8'>
                {/* Breadcrumb */}
                <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-8'>
                    <Link href='/' className='hover:text-blue-600'>
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href='/code-library' className='hover:text-blue-600'>
                        Code Library
                    </Link>
                    <span>/</span>
                    <span className='text-gray-900'>{example.name}</span>
                </nav>

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='xl:col-span-2 space-y-6'>
                        {/* Header */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <div className='flex items-start justify-between mb-4'>
                                <div className='flex items-center gap-3'>
                                    <span className='text-2xl'>
                                        {typeIcons[example.type.name]}
                                    </span>
                                    <div>
                                        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                                            {example.name}
                                        </h1>
                                        <p className='text-gray-600'>
                                            {example.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            typeColors[example.type.name]
                                        }`}
                                    >
                                        {example.type.name === 'component'
                                            ? 'Component'
                                            : 'Function'}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            libraryColors[
                                                example.library.name
                                            ] || 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {example.library.name}
                                    </span>
                                </div>
                            </div>

                            {/* Author và Stats */}
                            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                        <span className='text-blue-600 font-medium text-sm'>
                                            {example.authorInfo.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>
                                            {example.authorInfo.fullName}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            @{example.authorInfo.username}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4 text-sm text-gray-500'>
                                    <span>👀 {example.views} views</span>
                                    <span>❤️ {example.likes} likes</span>
                                </div>
                            </div>
                        </div>

                        {/* Code Section */}
                        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                                <h2 className='text-lg font-semibold text-gray-900'>
                                    Source Code
                                </h2>
                            </div>
                            <div className='p-6'>
                                <ComponentCode
                                    code={example.code}
                                    language={
                                        example.type.name === 'component'
                                            ? 'jsx'
                                            : 'javascript'
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Details */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Chi tiết
                            </h3>
                            <dl className='space-y-4'>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Loại
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {example.type.name === 'component'
                                            ? 'React Component'
                                            : 'JavaScript Function'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Thư viện
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {example.library.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Độ khó
                                    </dt>
                                    <dd className='text-sm text-gray-900 capitalize'>
                                        {example.difficulty}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Ngày tạo
                                    </dt>
                                    <dd className='text-sm text-gray-900'>
                                        {formatDate(example.createdAt)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-sm font-medium text-gray-500'>
                                        Tags
                                    </dt>
                                    <dd className='flex flex-wrap gap-1 mt-1'>
                                        {example.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className='px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs'
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Dependencies */}
                        {example.dependencies &&
                            example.dependencies.length > 0 && (
                                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                        Dependencies
                                    </h3>
                                    <div className='space-y-2'>
                                        {example.dependencies.map(
                                            (dependency) => (
                                                <div
                                                    key={dependency}
                                                    className='flex items-center gap-2 text-sm'
                                                >
                                                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                                    <code className='bg-gray-100 px-2 py-1 rounded text-xs'>
                                                        {dependency}
                                                    </code>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Installation */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Cài đặt Dependencies
                            </h3>
                            <div className='space-y-4'>
                                {example.library.name === 'MUI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @mui/material @emotion/react @emotion/styled'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library.name === 'Ant Design' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install antd'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library.name === 'Chakra UI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {example.library.name === 'Headless UI' && (
                                    <div>
                                        <ComponentCode
                                            code='npm install @headlessui/react'
                                            language='bash'
                                        />
                                    </div>
                                )}
                                {(example.library.name === 'JavaScript' ||
                                    example.library.name === 'TypeScript' ||
                                    example.library.name === 'React' ||
                                    example.library.name === 'Utility') && (
                                    <p className='text-sm text-gray-600'>
                                        Không cần cài đặt thêm dependencies.
                                        Code này sử dụng JavaScript/TypeScript
                                        thuần hoặc React built-in.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Hành động
                            </h3>
                            <div className='space-y-3'>
                                <CopyButton code={example.code} />
                                <Link
                                    href='/code-library'
                                    className='block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center'
                                >
                                    ← Quay lại thư viện
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
