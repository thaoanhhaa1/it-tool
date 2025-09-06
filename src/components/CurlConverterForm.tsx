'use client';

import { useState } from 'react';
import {
    convertCurl,
    ConvertedResult,
    ConvertOptions,
} from '../utils/curl-converter';
import { CodeEditor } from './animate-ui/components/code-editor';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export default function CurlConverterForm() {
    const [curlCommand, setCurlCommand] = useState('');
    const [convertedResult, setConvertedResult] =
        useState<ConvertedResult | null>(null);
    const [error, setError] = useState('');

    // New state for options
    const [entityName, setEntityName] = useState('user');
    const [operationName, setOperationName] = useState('getList');
    const [isQuery, setIsQuery] = useState(true);
    const [isMutation, setIsMutation] = useState(false);
    const [isInfiniteQuery, setIsInfiniteQuery] = useState(false);
    const [responseData, setResponseData] = useState('');
    const [pathParams, setPathParams] = useState('');
    const [sourceTypeCase, setSourceTypeCase] = useState<
        | 'camelCase'
        | 'PascalCase'
        | 'snake_case'
        | 'kebab-case'
        | 'UPPER_CASE'
        | undefined
    >(undefined);
    const [targetTypeCase, setTargetTypeCase] = useState<
        | 'camelCase'
        | 'PascalCase'
        | 'snake_case'
        | 'kebab-case'
        | 'UPPER_CASE'
        | undefined
    >(undefined);

    const handleConvert = () => {
        setError('');
        setConvertedResult(null);

        if (!curlCommand.trim()) {
            setError('Vui lòng nhập curl command');
            return;
        }

        try {
            let parsedResponseData:
                | Record<string, unknown>
                | Record<string, unknown>[]
                | undefined;

            if (responseData.trim()) {
                try {
                    parsedResponseData = JSON.parse(responseData);
                } catch {
                    setError('Response Data không đúng định dạng JSON');
                    return;
                }
            }

            let parsedPathParams: Record<string, unknown> | undefined;
            if (pathParams.trim()) {
                try {
                    // Parse format key:value\nkey:value
                    const lines = pathParams.trim().split('\n');
                    parsedPathParams = {};
                    for (const line of lines) {
                        const [key, ...valueParts] = line.split(':');
                        if (key && valueParts.length > 0) {
                            const value = valueParts.join(':').trim();
                            // Try to parse as number, boolean, or keep as string
                            if (!isNaN(Number(value)) && value.trim() !== '') {
                                parsedPathParams[key.trim()] = Number(value);
                            } else if (value.toLowerCase() === 'true') {
                                parsedPathParams[key.trim()] = true;
                            } else if (value.toLowerCase() === 'false') {
                                parsedPathParams[key.trim()] = false;
                            } else {
                                parsedPathParams[key.trim()] = value;
                            }
                        }
                    }
                } catch {
                    setError('Path Params không đúng định dạng key:value');
                    return;
                }
            }

            const options: ConvertOptions = {
                entityName,
                operationName,
                isQuery,
                isMutation,
                isInfiniteQuery,
                responseData: parsedResponseData,
                pathParams: parsedPathParams,
                sourceTypeCase,
                targetTypeCase,
                hasParams: true,
                hasBody: true,
            };

            const result = convertCurl(curlCommand, options);
            setConvertedResult(result);
        } catch {
            setError(
                'Lỗi khi chuyển đổi curl command. Vui lòng kiểm tra lại format.',
            );
        }
    };

    const renderCodeBlock = (title: string, code: string | undefined) => {
        if (!code) return null;

        // Xác định title phù hợp dựa trên nội dung
        let fileTitle = 'types.ts';
        if (title.includes('API')) {
            fileTitle = 'api.ts';
        } else if (title.includes('Query')) {
            fileTitle = 'query.ts';
        } else if (title.includes('Mutation')) {
            fileTitle = 'mutation.ts';
        } else if (title.includes('TypeScript')) {
            fileTitle = 'types.ts';
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle className='flex justify-between items-center'>
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeEditor
                        className='w-full h-fit max-h-[480px]'
                        lang='ts'
                        title={fileTitle}
                        duration={0}
                        delay={0}
                        writing={false}
                        copyButton={true}
                        cursor={false}
                    >
                        {code}
                    </CodeEditor>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div>
                        <Label htmlFor='curl-command'>Curl Command</Label>
                        <Textarea
                            id='curl-command'
                            placeholder='Ví dụ: curl -X GET "https://api.example.com/users?id=123" -H "Authorization: Bearer token123"'
                            value={curlCommand}
                            onChange={(e) => setCurlCommand(e.target.value)}
                            className='min-h-[120px] max-h-[300px]'
                        />
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                            Ví dụ: curl -X POST
                            &quot;https://api.example.com/users&quot; -H
                            &quot;Content-Type: application/json&quot; -d{' '}
                            {'{"name":"John","email":"john@example.com"}'}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div>
                            <Label htmlFor='entity-name'>Entity Name</Label>
                            <input
                                id='entity-name'
                                type='text'
                                value={entityName}
                                onChange={(e) => setEntityName(e.target.value)}
                                className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600'
                                placeholder='user'
                            />
                        </div>
                        <div>
                            <Label htmlFor='operation-name'>
                                Operation Name
                            </Label>
                            <input
                                id='operation-name'
                                type='text'
                                value={operationName}
                                onChange={(e) =>
                                    setOperationName(e.target.value)
                                }
                                className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600'
                                placeholder='getList'
                            />
                        </div>
                        <div>
                            <Label htmlFor='operation-type'>
                                Operation Type
                            </Label>
                            <select
                                id='operation-type'
                                value={isQuery ? 'query' : 'mutation'}
                                onChange={(e) => {
                                    const isQueryValue =
                                        e.target.value === 'query';
                                    setIsQuery(isQueryValue);
                                    setIsMutation(!isQueryValue);
                                    // Reset infinite query when switching to mutation
                                    if (!isQueryValue) {
                                        setIsInfiniteQuery(false);
                                    }
                                }}
                                className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600'
                            >
                                <option value='query'>Query</option>
                                <option value='mutation'>Mutation</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor='infinite-query'>
                                Infinite Query
                            </Label>
                            <div className='flex items-center space-x-2'>
                                <input
                                    id='infinite-query'
                                    type='checkbox'
                                    checked={isInfiniteQuery}
                                    onChange={(e) => {
                                        setIsInfiniteQuery(e.target.checked);
                                        // Ensure it's a query when enabling infinite query
                                        if (e.target.checked) {
                                            setIsQuery(true);
                                            setIsMutation(false);
                                        }
                                    }}
                                    disabled={!isQuery}
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                />
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    Enable infinite query
                                </span>
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                                Chỉ áp dụng cho Query
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor='response-data'>
                            Response Data (JSON)
                        </Label>
                        <Textarea
                            id='response-data'
                            placeholder='Ví dụ: {"id": 1, "name": "John", "email": "john@example.com"} hoặc [{"id": 1, "name": "John"}]'
                            value={responseData}
                            onChange={(e) => setResponseData(e.target.value)}
                            className='min-h-[100px] max-h-[300px]'
                        />
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                            Nhập JSON response data để tự động tạo TypeScript
                            interface
                        </div>
                    </div>

                    <div>
                        <Label htmlFor='path-params'>Path Params</Label>
                        <Textarea
                            id='path-params'
                            placeholder='Ví dụ: id:123\nuserId:456\nname:John'
                            value={pathParams}
                            onChange={(e) => setPathParams(e.target.value)}
                            className='min-h-[80px] max-h-[200px]'
                        />
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                            Nhập path params theo format key:value (mỗi dòng một
                            cặp). Với GET sẽ đưa vào params, các method khác sẽ
                            đưa vào body
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label htmlFor='source-type-case'>
                                Source Type Case
                            </Label>
                            <select
                                id='source-type-case'
                                value={sourceTypeCase || ''}
                                onChange={(e) =>
                                    setSourceTypeCase(
                                        e.target.value === ''
                                            ? undefined
                                            : (e.target.value as
                                                  | 'camelCase'
                                                  | 'PascalCase'
                                                  | 'snake_case'
                                                  | 'kebab-case'
                                                  | 'UPPER_CASE'),
                                    )
                                }
                                className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600'
                            >
                                <option value=''>-- Chọn định dạng --</option>
                                <option value='camelCase'>camelCase</option>
                                <option value='PascalCase'>PascalCase</option>
                                <option value='snake_case'>snake_case</option>
                                <option value='kebab-case'>kebab-case</option>
                                <option value='UPPER_CASE'>UPPER_CASE</option>
                            </select>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                                Định dạng của response data
                            </div>
                        </div>
                        <div>
                            <Label htmlFor='target-type-case'>
                                Target Type Case
                            </Label>
                            <select
                                id='target-type-case'
                                value={targetTypeCase || ''}
                                onChange={(e) =>
                                    setTargetTypeCase(
                                        e.target.value === ''
                                            ? undefined
                                            : (e.target.value as
                                                  | 'camelCase'
                                                  | 'PascalCase'
                                                  | 'snake_case'
                                                  | 'kebab-case'
                                                  | 'UPPER_CASE'),
                                    )
                                }
                                className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600'
                            >
                                <option value=''>-- Chọn định dạng --</option>
                                <option value='camelCase'>camelCase</option>
                                <option value='PascalCase'>PascalCase</option>
                                <option value='snake_case'>snake_case</option>
                                <option value='kebab-case'>kebab-case</option>
                                <option value='UPPER_CASE'>UPPER_CASE</option>
                            </select>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                                Định dạng mong muốn cho interface
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <Button onClick={handleConvert} className='flex-1'>
                            Chuyển đổi
                        </Button>
                        <Button
                            onClick={() => {
                                setCurlCommand(
                                    'curl -X GET "https://api.example.com/users/123/posts" -H "Authorization: Bearer token" -H "Content-Type: application/json"',
                                );
                                setResponseData(
                                    '{"Data": [{"id": 1, "name": "John Doe", "email": "john@example.com", "createdAt": "2024-01-01T00:00:00Z"}], "StatusCode": 200, "Message": "Success", "TotalRecord": 1}',
                                );
                                setPathParams('id:123');
                                setSourceTypeCase(undefined);
                                setTargetTypeCase(undefined);
                                setIsInfiniteQuery(true);
                            }}
                            variant='outline'
                            className='px-4'
                        >
                            Load Ví dụ
                        </Button>
                    </div>

                    {error && (
                        <div className='p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md'>
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {convertedResult && (
                <div className='space-y-6'>
                    {/* Types Section */}
                    {convertedResult.type &&
                        renderCodeBlock(
                            'TypeScript Types',
                            convertedResult.type,
                        )}

                    {/* API Section */}
                    {convertedResult.api &&
                        renderCodeBlock('API Method', convertedResult.api)}

                    {/* Query/Mutation Section */}
                    {convertedResult.query &&
                        renderCodeBlock('Query Service', convertedResult.query)}
                    {convertedResult.mutation &&
                        renderCodeBlock(
                            'Mutation Service',
                            convertedResult.mutation,
                        )}
                </div>
            )}
        </div>
    );
}
