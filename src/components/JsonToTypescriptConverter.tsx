'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Label } from './ui/label';

// Hàm chuyển đổi JSON sang TypeScript interface
function jsonToTypeScript(
    jsonString: string,
    interfaceName: string = 'GeneratedInterface',
): string {
    try {
        const obj = JSON.parse(jsonString);
        return convertObjectToInterface(obj, interfaceName);
    } catch (error) {
        throw new Error('JSON không hợp lệ');
    }
}

function convertObjectToInterface(
    obj: any,
    interfaceName: string,
    depth: number = 0,
): string {
    const indent = '  '.repeat(depth);

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return 'any[]';
        }
        const firstElement = obj[0];
        if (typeof firstElement === 'object' && firstElement !== null) {
            const elementInterface = convertObjectToInterface(
                firstElement,
                `${interfaceName}Item`,
                depth,
            );
            return `${elementInterface}[]`;
        } else {
            return `${getTypeFromValue(firstElement)}[]`;
        }
    }

    if (typeof obj !== 'object' || obj === null) {
        return getTypeFromValue(obj);
    }

    let interfaceString = `interface ${interfaceName} {\n`;

    for (const [key, value] of Object.entries(obj)) {
        const type = getTypeFromValue(
            value,
            `${capitalizeFirstLetter(key)}`,
            depth + 1,
        );
        interfaceString += `${indent}  ${key}: ${type};\n`;
    }

    interfaceString += `${indent}}`;

    return interfaceString;
}

function getTypeFromValue(
    value: any,
    typeName?: string,
    depth: number = 0,
): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        const firstElement = value[0];
        if (typeof firstElement === 'object' && firstElement !== null) {
            const elementInterface = convertObjectToInterface(
                firstElement,
                `${typeName}Item`,
                depth,
            );
            return `${elementInterface}[]`;
        }
        return `${getTypeFromValue(firstElement)}[]`;
    }
    if (typeof value === 'object') {
        return convertObjectToInterface(
            value,
            typeName || 'NestedInterface',
            depth,
        );
    }
    return 'any';
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function JsonToTypescriptConverter() {
    const [jsonInput, setJsonInput] = useState('');
    const [interfaceName, setInterfaceName] = useState('MyInterface');
    const [typescriptOutput, setTypescriptOutput] = useState('');
    const [error, setError] = useState('');

    const handleConvert = () => {
        try {
            setError('');
            const result = jsonToTypeScript(jsonInput, interfaceName);
            setTypescriptOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
            setTypescriptOutput('');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(typescriptOutput);
            // Có thể thêm toast notification ở đây
        } catch (err) {
            console.error('Không thể sao chép vào clipboard:', err);
        }
    };

    const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "contacts": [
    {
      "type": "email",
      "value": "john@example.com"
    },
    {
      "type": "phone",
      "value": "+1234567890"
    }
  ]
}`;

    const handleLoadSample = () => {
        setJsonInput(sampleJson);
        setError('');
    };

    return (
        <div className='max-w-6xl mx-auto p-6 space-y-6'>
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    JSON to TypeScript Interface Converter
                </h1>
                <p className='text-gray-600 dark:text-gray-400'>
                    Chuyển đổi JSON thành TypeScript interface một cách dễ dàng
                </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>JSON Input</CardTitle>
                        <CardDescription>
                            Nhập JSON của bạn vào đây
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='interface-name'>
                                Tên Interface
                            </Label>
                            <input
                                id='interface-name'
                                type='text'
                                value={interfaceName}
                                onChange={(e) =>
                                    setInterfaceName(e.target.value)
                                }
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800'
                                placeholder='MyInterface'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='json-input'>JSON</Label>
                            <Textarea
                                id='json-input'
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='Nhập JSON của bạn vào đây...'
                                className='min-h-[300px] font-mono text-sm'
                            />
                        </div>

                        <div className='flex gap-2'>
                            <Button onClick={handleConvert} className='flex-1'>
                                Chuyển đổi
                            </Button>
                            <Button
                                onClick={handleLoadSample}
                                variant='outline'
                            >
                                Tải mẫu
                            </Button>
                        </div>

                        {error && (
                            <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-md'>
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>TypeScript Interface</CardTitle>
                        <CardDescription>
                            Kết quả TypeScript interface
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='typescript-output'>Interface</Label>
                            <Textarea
                                id='typescript-output'
                                value={typescriptOutput}
                                readOnly
                                placeholder='TypeScript interface sẽ xuất hiện ở đây...'
                                className='min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-900'
                            />
                        </div>

                        {typescriptOutput && (
                            <Button
                                onClick={handleCopy}
                                variant='outline'
                                className='w-full'
                            >
                                Sao chép vào Clipboard
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
