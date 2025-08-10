'use client';

import { CodeEditor } from './animate-ui/components/code-editor';

interface ComponentCodeProps {
    code: string;
    language?: string;
}

export default function ComponentCode({
    code,
    language = 'tsx',
}: ComponentCodeProps) {
    return (
        <div className='space-y-4'>
            {/* Code Editor */}
            <CodeEditor
                className='w-full h-fit max-h-[480px]'
                lang={language}
                title={`${language.toUpperCase()} Code`}
                duration={0}
                delay={0}
                writing={false}
                copyButton={true}
                cursor={false}
            >
                {code}
            </CodeEditor>

            {/* Installation Note */}
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
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
            <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg'>
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
