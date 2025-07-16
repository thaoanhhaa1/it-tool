'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import ComponentCode from './ComponentCode';

interface CodeExample {
    id: string;
    name: string;
    description: string;
    type: 'component' | 'function';
    library: string;
    tags: string[];
    code: string;
    author?: {
        username: string;
        fullName: string;
    };
    likes?: number;
    views?: number;
    createdAt?: string;
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ComponentPreviewProps {
    example: CodeExample;
}

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

const typeColors = {
    component: 'bg-indigo-100 text-indigo-800',
    function: 'bg-emerald-100 text-emerald-800',
};

const typeIcons = {
    component: '⚛️',
    function: '🔧',
};

export default function ComponentPreview({ example }: ComponentPreviewProps) {
    return (
        <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
            <div className='p-6'>
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='text-lg'>
                                {typeIcons[example.type]}
                            </span>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                {example.name}
                            </h3>
                        </div>
                        <p className='text-gray-600 text-sm mb-3'>
                            {example.description}
                        </p>
                    </div>
                </div>

                {/* Tags and Type */}
                <div className='flex flex-wrap items-center gap-2 mb-4'>
                    {/* Type Badge */}
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            typeColors[example.type]
                        }`}
                    >
                        {example.type === 'component'
                            ? 'Component'
                            : 'Function'}
                    </span>

                    {/* Library Badge */}
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            libraryColors[example.library] ||
                            'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {example.library}
                    </span>

                    {/* Tags */}
                    {example.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600'
                        >
                            #{tag}
                        </span>
                    ))}
                    {example.tags.length > 3 && (
                        <span className='text-xs text-gray-500'>
                            +{example.tags.length - 3} more
                        </span>
                    )}
                </div>

                {/* Code Preview */}
                <div className='mb-4'>
                    <ComponentCode
                        code={example.code}
                        language={
                            example.type === 'component' ? 'jsx' : 'javascript'
                        }
                    />
                </div>

                {/* Actions */}
                <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
                    <Link
                        href={`/code-library/${example.id}`}
                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                    >
                        Xem chi tiết →
                    </Link>

                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                            navigator.clipboard.writeText(example.code);
                            // You might want to show a toast notification here
                        }}
                    >
                        Copy Code
                    </Button>
                </div>
            </div>
        </Card>
    );
}
