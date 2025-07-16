'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ComponentCodeProps {
    code: string;
    language?: string;
}

export default function ComponentCode({
    code,
    language = 'tsx',
}: ComponentCodeProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <div className='relative'>
            {/* Code Header */}
            <div className='flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-sm rounded-t-lg'>
                <span className='font-mono'>{language.toUpperCase()}</span>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopy}
                    className='text-white hover:text-gray-300 hover:bg-gray-700 h-auto p-1'
                >
                    {copied ? (
                        <span className='flex items-center gap-1'>
                            ✅ Copied
                        </span>
                    ) : (
                        <span className='flex items-center gap-1'>📋 Copy</span>
                    )}
                </Button>
            </div>

            {/* Code Content */}
            <div className='bg-gray-900 rounded-b-lg overflow-x-auto'>
                <pre className='p-4 text-sm text-gray-100 overflow-x-auto'>
                    <code className='language-tsx whitespace-pre-wrap break-words'>
                        {code}
                    </code>
                </pre>
            </div>

            {/* Installation Note */}
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <h4 className='text-sm font-medium text-blue-900 mb-2'>
                    📦 Cài đặt dependencies
                </h4>
                <div className='text-xs text-blue-800 space-y-1'>
                    {language === 'tsx' && (
                        <>
                            {code.includes('@mui/material') && (
                                <div className='font-mono bg-blue-100 px-2 py-1 rounded'>
                                    npm install @mui/material @emotion/react
                                    @emotion/styled
                                </div>
                            )}
                            {code.includes('antd') && (
                                <div className='font-mono bg-blue-100 px-2 py-1 rounded'>
                                    npm install antd
                                </div>
                            )}
                            {code.includes('framer-motion') && (
                                <div className='font-mono bg-blue-100 px-2 py-1 rounded'>
                                    npm install framer-motion
                                </div>
                            )}
                            {code.includes('@chakra-ui') && (
                                <div className='font-mono bg-blue-100 px-2 py-1 rounded'>
                                    npm install @chakra-ui/react @emotion/react
                                    @emotion/styled framer-motion
                                </div>
                            )}
                            {!code.includes('@mui/material') &&
                                !code.includes('antd') &&
                                !code.includes('@chakra-ui') && (
                                    <div className='text-blue-700'>
                                        Component này sử dụng Tailwind CSS hoặc
                                        CSS thuần
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>

            {/* Usage Tips */}
            <div className='mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <h4 className='text-sm font-medium text-amber-900 mb-2'>
                    💡 Hướng dẫn sử dụng
                </h4>
                <ul className='text-xs text-amber-800 space-y-1'>
                    <li>• Copy code và paste vào project của bạn</li>
                    <li>• Đảm bảo đã cài đặt đủ dependencies</li>
                    <li>• Tùy chỉnh styling theo nhu cầu dự án</li>
                    <li>• Kiểm tra responsive design trên nhiều thiết bị</li>
                </ul>
            </div>
        </div>
    );
}
