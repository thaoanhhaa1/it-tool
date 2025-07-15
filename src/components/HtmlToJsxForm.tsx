'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export default function HtmlToJsxForm() {
    const [htmlInput, setHtmlInput] = useState('');
    const [jsxOutput, setJsxOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const convertHtmlToJsx = () => {
        setIsLoading(true);

        try {
            let jsx = htmlInput;

            // First, convert all kebab-case attributes to camelCase (including SVG attributes)
            jsx = jsx.replace(
                /\s([a-z][a-z0-9]*(?:-[a-z0-9]+)+)=/g,
                (match, attribute) => {
                    // Convert kebab-case to camelCase
                    const camelAttribute = attribute.replace(
                        /-([a-z0-9])/g,
                        (_: string, letter: string) => letter.toUpperCase(),
                    );
                    return match.replace(attribute, camelAttribute);
                },
            );

            // Then handle specific HTML to JSX attribute conversions
            jsx = jsx.replace(/\sclass=/g, ' className=');
            jsx = jsx.replace(/\sfor=/g, ' htmlFor=');

            // Convert event handlers (onclick, onchange, etc.) to camelCase
            jsx = jsx.replace(/\s(on[a-z]+)=/g, (match, eventHandler) => {
                // Convert first letter after 'on' to uppercase
                const camelEventHandler = eventHandler.replace(
                    /^on([a-z])/,
                    (_: string, letter: string) => 'on' + letter.toUpperCase(),
                );
                return match.replace(eventHandler, camelEventHandler);
            });

            // Convert style attributes to JSX style objects
            jsx = jsx.replace(/style="([^"]+)"/g, (match, styleString) => {
                const styleObj: Record<string, string> = {};
                styleString.split(';').forEach((style: string) => {
                    const [property, value] = style
                        .split(':')
                        .map((s: string) => s.trim());
                    if (property && value) {
                        // Convert kebab-case to camelCase
                        const camelProperty = property.replace(
                            /-([a-z])/g,
                            (g) => g[1].toUpperCase(),
                        );
                        styleObj[camelProperty] = value;
                    }
                });
                return `style={{${Object.entries(styleObj)
                    .map(([key, value]) => `${key}: '${value}'`)
                    .join(', ')}}}`;
            });

            // Convert self-closing tags
            jsx = jsx.replace(
                /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?:\s*\/)?>/g,
                '<$1$2 />',
            );

            // Convert comments
            jsx = jsx.replace(/<!--(.*?)-->/g, '{/* $1 */}');

            // Add proper indentation and formatting
            jsx = jsx.replace(/^\s+/gm, ''); // Remove leading whitespace
            jsx = jsx.trim();

            setJsxOutput(jsx);
        } catch (error) {
            console.error('Error converting HTML to JSX:', error);
            setJsxOutput(
                'Có lỗi xảy ra khi chuyển đổi HTML. Vui lòng kiểm tra lại cú pháp HTML.',
            );
        }

        setIsLoading(false);
    };

    const clearAll = () => {
        setHtmlInput('');
        setJsxOutput('');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(jsxOutput);
            // You might want to add a toast notification here
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const exampleHtml = `<div class="container">
  <h1 style="color: blue; font-size: 24px;">Hello World</h1>
  <p for="name">Enter your name:</p>
  <input type="text" id="name" class="form-input" readonly />
  <img src="image.jpg" alt="Example" />
  <br>
  <!-- SVG example with kebab-case attributes -->
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904" />
  </svg>
  <!-- This is a comment -->
  <button onclick="handleClick()">Click me</button>
</div>`;

    const loadExample = () => {
        setHtmlInput(exampleHtml);
    };

    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Input Section */}
                <Card className='p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <Label
                            htmlFor='html-input'
                            className='text-lg font-semibold'
                        >
                            HTML Input
                        </Label>
                        <Button
                            onClick={loadExample}
                            variant='outline'
                            size='sm'
                        >
                            Tải ví dụ
                        </Button>
                    </div>
                    <Textarea
                        id='html-input'
                        placeholder='Nhập HTML code của bạn tại đây...'
                        value={htmlInput}
                        onChange={(e) => setHtmlInput(e.target.value)}
                        className='min-h-[400px] font-mono text-sm'
                    />
                </Card>

                {/* Output Section */}
                <Card className='p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <Label
                            htmlFor='jsx-output'
                            className='text-lg font-semibold'
                        >
                            JSX Output
                        </Label>
                        <div className='flex gap-2'>
                            <Button
                                onClick={copyToClipboard}
                                variant='outline'
                                size='sm'
                                disabled={!jsxOutput}
                            >
                                Sao chép
                            </Button>
                            <Button
                                onClick={clearAll}
                                variant='outline'
                                size='sm'
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        id='jsx-output'
                        placeholder='JSX code sẽ hiển thị tại đây...'
                        value={jsxOutput}
                        readOnly
                        className='min-h-[400px] font-mono text-sm bg-gray-50 dark:bg-gray-800'
                    />
                </Card>
            </div>

            {/* Convert Button */}
            <div className='text-center mt-8'>
                <Button
                    onClick={convertHtmlToJsx}
                    disabled={!htmlInput.trim() || isLoading}
                    className='px-8 py-3 text-lg'
                    size='lg'
                >
                    {isLoading
                        ? 'Đang chuyển đổi...'
                        : 'Chuyển đổi HTML sang JSX'}
                </Button>
            </div>
        </>
    );
}
