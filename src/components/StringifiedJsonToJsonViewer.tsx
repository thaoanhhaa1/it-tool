'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import ComponentCode from './ComponentCode';

export default function StringifiedJsonToJsonViewer() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleConvert = () => {
        try {
            setError('');

            if (!input.trim()) {
                setOutput('');
                return;
            }

            // Bước 1: parse chuỗi đầu vào (thường là kết quả của JSON.stringify)
            let intermediate: unknown = input;
            try {
                intermediate = JSON.parse(input);
            } catch {
                // Nếu không parse được thì giữ nguyên, xử lý ở bước 2
                intermediate = input;
            }

            // Bước 2: nếu kết quả là string và có vẻ là JSON, parse thêm lần nữa
            let finalValue: unknown = intermediate;
            if (
                typeof intermediate === 'string' &&
                intermediate.trim().length > 0 &&
                ['{', '[', '"'].includes(intermediate.trim()[0] ?? '')
            ) {
                try {
                    finalValue = JSON.parse(intermediate);
                } catch {
                    finalValue = intermediate;
                }
            }

            // Chuẩn hóa output: pretty JSON nếu là object/array, còn lại thì hiển thị như giá trị JS
            if (
                typeof finalValue === 'object' &&
                finalValue !== null
            ) {
                setOutput(JSON.stringify(finalValue, null, 2));
            } else {
                setOutput(
                    JSON.stringify(
                        {
                            value: finalValue,
                            type: typeof finalValue,
                        },
                        null,
                        2,
                    ),
                );
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Đã xảy ra lỗi khi parse JSON',
            );
            setOutput('');
        }
    };

    const handleLoadSample = () => {
        const sample = JSON.stringify(
            JSON.stringify({
                id: 1,
                name: 'John Doe',
                active: true,
                tags: ['admin', 'user'],
            }),
        );
        setInput(sample);
        setError('');
        setOutput('');
    };

    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    Stringified JSON to JSON Viewer
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    Chuyển đổi chuỗi JSON đã được <code>JSON.stringify</code> sang
                    JSON object dễ đọc và dễ debug.
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Dán chuỗi đã stringify (thường copy từ log, network, v.v) để xem
                    lại JSON gốc dưới dạng format đẹp.
                </p>
            </header>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Input */}
                <Card>
                    <CardHeader>
                        <div className='flex justify-between items-start'>
                            <div>
                                <CardTitle>Stringified JSON</CardTitle>
                                <CardDescription>
                                    Dán chuỗi JSON đã được stringify (có hoặc không dấu
                                    ngoặc kép bao quanh)
                                </CardDescription>
                            </div>
                            <div className='flex gap-2'>
                                <Button size='sm' onClick={handleConvert}>
                                    Convert
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='stringified-json'>Chuỗi input</Label>
                            <Textarea
                                id='stringified-json'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Ví dụ: "{&quot;id&quot;:1,&quot;name&quot;:&quot;John&quot;}" hoặc kết quả của JSON.stringify(...)'
                                className='min-h-[260px] font-mono text-sm'
                            />
                        </div>

                        <div className='flex gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                className='flex-1'
                                onClick={handleLoadSample}
                            >
                                Tải ví dụ
                            </Button>
                            <Button
                                type='button'
                                variant='ghost'
                                className='flex-1'
                                onClick={() => {
                                    setInput('');
                                    setOutput('');
                                    setError('');
                                }}
                            >
                                Xóa
                            </Button>
                        </div>

                        {error && (
                            <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Output */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kết quả JSON</CardTitle>
                        <CardDescription>
                            JSON được parse lại dưới dạng format đẹp, hiển thị với{' '}
                            <code>ComponentCode</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {output ? (
                            <ComponentCode code={output} language='json' />
                        ) : (
                            <div className='h-[260px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-md'>
                                Kết quả JSON sẽ xuất hiện ở đây sau khi convert
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}


