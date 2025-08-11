'use client';

import { Card } from '@/components/ui/card';
import { ICodeExample } from '@/types/codeExample/codeExample.interface';
import Link from 'next/link';
import { CodeEditor } from './animate-ui/components/code-editor';

interface ComponentPreviewProps {
    example: ICodeExample;
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

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
};

const difficultyIcons = {
    beginner: '🟢',
    intermediate: '🟡',
    advanced: '🔴',
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
                                {
                                    typeIcons[
                                        example.type
                                            .name as keyof typeof typeIcons
                                    ]
                                }
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
                            typeColors[
                                example.type.name as keyof typeof typeColors
                            ]
                        }`}
                    >
                        {example.type.name === 'component'
                            ? 'Component'
                            : 'Function'}
                    </span>

                    {/* Library Badge */}
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            libraryColors[example.library.name] ||
                            'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {example.library.name}
                    </span>

                    {/* Difficulty Badge */}
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            difficultyColors[
                                example.difficulty as keyof typeof difficultyColors
                            ] || 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {
                            difficultyIcons[
                                example.difficulty as keyof typeof difficultyIcons
                            ]
                        }{' '}
                        {example.difficulty}
                    </span>

                    {/* Tags */}
                    {example.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag.id}
                            className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600'
                        >
                            #{tag.name}
                        </span>
                    ))}
                    {example.tags.length > 3 && (
                        <span className='text-xs text-gray-500'>
                            +{example.tags.length - 3} more
                        </span>
                    )}
                </div>

                {/* Dependencies */}
                {example.dependencies && example.dependencies.length > 0 && (
                    <div className='mb-4'>
                        <div className='text-xs text-gray-500 mb-2'>
                            Dependencies:
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {example.dependencies.map((dep) => (
                                <span
                                    key={dep}
                                    className='inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200'
                                >
                                    📦 {dep}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Code Preview */}
                <div className='mb-4'>
                    <CodeEditor
                        className='w-full h-fit max-h-[480px]'
                        lang={
                            example.type.name === 'component'
                                ? 'jsx'
                                : 'javascript'
                        }
                        title={example.name}
                        duration={0}
                        delay={0}
                        writing={false}
                        copyButton={true}
                        cursor={false}
                    >
                        {example.code}
                    </CodeEditor>
                </div>

                {/* Stats */}
                <div className='flex items-center gap-4 mb-4 text-xs text-gray-500'>
                    <div className='flex items-center gap-1'>
                        <span>👁️</span>
                        <span>{example.views} views</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <span>❤️</span>
                        <span>{example.likes} likes</span>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end items-center pt-4 border-t border-gray-100'>
                    <Link
                        href={`/code-library/${example.id}`}
                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                    >
                        Xem chi tiết →
                    </Link>
                </div>
            </div>
        </Card>
    );
}
