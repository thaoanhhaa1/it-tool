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

// Type definitions cho TypeScript parsing
interface TypeProperty {
    name: string;
    type: string;
    optional: boolean;
    isArray: boolean;
}

interface ParsedInterface {
    name: string;
    properties: TypeProperty[];
}

// Hàm parse TypeScript interface
function parseTypeScriptInterface(interfaceString: string): ParsedInterface[] {
    try {
        // Normalize the input - xóa comments và extra whitespace
        const normalized = interfaceString
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .trim();

        const interfaces: ParsedInterface[] = [];

        // Regex để tìm interface declarations
        const interfaceRegex =
            /interface\s+(\w+)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;

        let match;
        while ((match = interfaceRegex.exec(normalized)) !== null) {
            const interfaceName = match[1];
            const interfaceBody = match[2];

            const properties = parseInterfaceProperties(interfaceBody);

            interfaces.push({
                name: interfaceName,
                properties: properties,
            });
        }

        if (interfaces.length === 0) {
            throw new Error('Không tìm thấy interface hợp lệ trong input');
        }

        return interfaces;
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : 'Không thể parse interface',
        );
    }
}

function parseInterfaceProperties(body: string): TypeProperty[] {
    const properties: TypeProperty[] = [];

    // Tách các properties
    const propertyLines = body.split(';').filter((line) => line.trim());

    for (const line of propertyLines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Parse property: name?: type hoặc name: type
        const propertyMatch = trimmed.match(/^\s*(\w+)(\??):\s*(.+)$/);

        if (propertyMatch) {
            const [, name, optional, type] = propertyMatch;

            // Check if it's an array type
            const isArray = type.includes('[]') || type.includes('Array<');

            // Clean up the type
            const cleanType = type
                .replace(/\[\]/g, '')
                .replace(/Array<(.+)>/g, '$1')
                .trim();

            properties.push({
                name,
                type: cleanType,
                optional: optional === '?',
                isArray,
            });
        }
    }

    return properties;
}

// Hàm chuyển đổi TypeScript interface sang Zod schema
function interfaceToZodSchema(
    interfaces: ParsedInterface[],
    exportSchema: boolean = true,
    useConst: boolean = false,
): string {
    const schemas: string[] = [];

    for (const interfaceData of interfaces) {
        const schemaName = `${
            interfaceData.name.charAt(0).toLowerCase() +
            interfaceData.name.slice(1)
        }Schema`;

        let schemaBody = 'z.object({\n';

        for (const prop of interfaceData.properties) {
            const indent = '  ';
            let zodType = getZodType(prop.type);

            if (prop.isArray) {
                zodType = `z.array(${zodType})`;
            }

            if (prop.optional) {
                zodType = `${zodType}.optional()`;
            }

            schemaBody += `${indent}${prop.name}: ${zodType},\n`;
        }

        schemaBody += '})';

        const declaration = useConst ? 'const' : 'export const';
        const exportKeyword = exportSchema && !useConst ? '' : 'export ';

        if (useConst) {
            schemas.push(
                `${exportKeyword}const ${schemaName} = ${schemaBody};`,
            );
        } else {
            schemas.push(`${declaration} ${schemaName} = ${schemaBody};`);
        }
    }

    // Add import statement và type inference
    const importStatement = "import { z } from 'zod';\n\n";
    const schemasString = schemas.join('\n\n');

    // Add type inference examples
    let typeInference = '\n\n// Type inference từ schema';
    for (const interfaceData of interfaces) {
        const schemaName = `${
            interfaceData.name.charAt(0).toLowerCase() +
            interfaceData.name.slice(1)
        }Schema`;
        typeInference += `\ntype ${interfaceData.name} = z.infer<typeof ${schemaName}>;`;
    }

    return importStatement + schemasString + typeInference;
}

function getZodType(tsType: string): string {
    // Normalize type
    const normalizedType = tsType.toLowerCase().trim();

    // Basic types
    switch (normalizedType) {
        case 'string':
            return 'z.string().trim()';
        case 'number':
            return 'z.number()';
        case 'boolean':
            return 'z.boolean()';
        case 'date':
            return 'z.date()';
        case 'null':
            return 'z.null()';
        case 'undefined':
            return 'z.undefined()';
        case 'unknown':
            return 'z.unknown()';
        case 'any':
            return 'z.any()';
        default:
            // Union types
            if (tsType.includes('|')) {
                const unionTypes = tsType.split('|').map((t) => t.trim());
                const zodUnions = unionTypes.map(getZodType);
                return `z.union([${zodUnions.join(', ')}])`;
            }

            // Object type (assume it's another interface)
            if (tsType.match(/^[A-Z]/)) {
                // Assume it's a custom interface - convert to camelCase schema name
                const schemaName = `${
                    tsType.charAt(0).toLowerCase() + tsType.slice(1)
                }Schema`;
                return schemaName;
            }

            return 'z.unknown()';
    }
}

// Client-side interactive form component
export default function InterfaceToZodForm() {
    const [interfaceInput, setInterfaceInput] = useState('');
    const [zodOutput, setZodOutput] = useState('');
    const [error, setError] = useState('');
    const [exportSchema, setExportSchema] = useState(true);
    const [useConst, setUseConst] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleConvert = () => {
        try {
            setError('');
            const parsedInterfaces = parseTypeScriptInterface(interfaceInput);
            const result = interfaceToZodSchema(
                parsedInterfaces,
                exportSchema,
                useConst,
            );
            setZodOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
            setZodOutput('');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(zodOutput);
            setCopySuccess(true);
            // Tự động ẩn thông báo sau 2 giây
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Không thể sao chép vào clipboard:', err);
        }
    };

    const sampleInterface = `interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
  tags: string[];
  profile: UserProfile;
}

interface UserProfile {
  avatar?: string;
  bio: string;
  socialLinks: string[];
}`;

    const handleLoadSample = () => {
        setInterfaceInput(sampleInterface);
        setError('');
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>TypeScript Interface Input</CardTitle>
                    <CardDescription>
                        Nhập TypeScript interface của bạn vào đây để chuyển đổi
                        sang Zod schema
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='flex items-center space-x-2'>
                        <input
                            id='export-schema'
                            type='checkbox'
                            checked={exportSchema}
                            onChange={(e) => setExportSchema(e.target.checked)}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <Label htmlFor='export-schema' className='text-sm'>
                            Export schema (để sử dụng ở file khác)
                        </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            id='use-const'
                            type='checkbox'
                            checked={useConst}
                            onChange={(e) => setUseConst(e.target.checked)}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <Label htmlFor='use-const' className='text-sm'>
                            Sử dụng const thay vì export const
                        </Label>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='interface-input'>
                            TypeScript Interface
                        </Label>
                        <Textarea
                            id='interface-input'
                            value={interfaceInput}
                            onChange={(e) => setInterfaceInput(e.target.value)}
                            placeholder='Nhập TypeScript interface của bạn vào đây...'
                            className='min-h-[300px] font-mono text-sm'
                        />
                    </div>

                    <div className='flex gap-2'>
                        <Button onClick={handleConvert} className='flex-1'>
                            Chuyển đổi sang Zod
                        </Button>
                        <Button onClick={handleLoadSample} variant='outline'>
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
                    <CardTitle>Zod Schema</CardTitle>
                    <CardDescription>
                        Kết quả Zod schema được generate tự động
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='zod-output'>Zod Schema</Label>
                        <Textarea
                            id='zod-output'
                            value={zodOutput}
                            readOnly
                            placeholder='Zod schema sẽ xuất hiện ở đây...'
                            className='min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-900'
                        />
                    </div>

                    {zodOutput && (
                        <div className='space-y-2'>
                            <Button
                                onClick={handleCopy}
                                variant='outline'
                                className='w-full'
                            >
                                Sao chép vào Clipboard
                            </Button>
                            {copySuccess && (
                                <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center'>
                                    ✓ Đã sao chép thành công vào clipboard!
                                </div>
                            )}
                        </div>
                    )}

                    {zodOutput && (
                        <div className='p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm'>
                            <strong>Ghi chú:</strong> Đảm bảo đã cài đặt zod
                            trong project: <code>npm install zod</code>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
