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

// Type definitions for JSON values
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

// Interface collector for separate interfaces
interface InterfaceCollector {
    interfaces: Map<string, string>;
    usedNames: Set<string>;
}

// Type guard functions
function isJsonObject(value: JsonValue): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonArray(value: JsonValue): value is JsonArray {
    return Array.isArray(value);
}

// Hàm chuyển đổi JSON sang TypeScript interface
function jsonToTypeScript(
    jsonString: string,
    interfaceName: string = 'GeneratedInterface',
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
    separateInterfaces: boolean = false,
): string {
    try {
        const obj: unknown = JSON.parse(jsonString);

        if (separateInterfaces) {
            const collector: InterfaceCollector = {
                interfaces: new Map(),
                usedNames: new Set(),
            };

            const mainInterfaceBody = convertObjectToSeparateInterface(
                obj as JsonValue,
                interfaceName,
                0,
                useCamelCaseFields,
                useProperCamelCase,
                collector,
            );

            // Build the final result with all interfaces
            const allInterfaces: string[] = [];

            // Add nested interfaces first
            for (const [, definition] of collector.interfaces) {
                allInterfaces.push(definition);
            }

            // Add main interface last
            allInterfaces.push(
                `interface ${interfaceName} {\n${mainInterfaceBody}}`,
            );

            return allInterfaces.join('\n\n');
        } else {
            return convertObjectToInterface(
                obj as JsonValue,
                interfaceName,
                0,
                useCamelCaseFields,
                useProperCamelCase,
            );
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'JSON không hợp lệ',
        );
    }
}

function convertObjectToInterface(
    obj: JsonValue,
    interfaceName: string,
    depth: number = 0,
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
): string {
    const indent = '  '.repeat(depth);

    if (isJsonArray(obj)) {
        if (obj.length === 0) {
            return 'unknown[]';
        }
        const firstElement = obj[0];
        if (isJsonObject(firstElement)) {
            const elementInterface = convertObjectToInterface(
                firstElement,
                `${interfaceName}Item`,
                depth,
                useCamelCaseFields,
                useProperCamelCase,
            );
            return `${elementInterface}[]`;
        } else {
            return `${getTypeFromValue(
                firstElement,
                undefined,
                0,
                useCamelCaseFields,
                useProperCamelCase,
            )}[]`;
        }
    }

    if (!isJsonObject(obj)) {
        return getTypeFromValue(
            obj,
            undefined,
            0,
            useCamelCaseFields,
            useProperCamelCase,
        );
    }

    let interfaceString = `interface ${interfaceName} {\n`;

    for (const [key, value] of Object.entries(obj)) {
        // Convert field name based on options
        let fieldName = key;
        if (useProperCamelCase) {
            fieldName = toProperCamelCase(key);
        } else if (useCamelCaseFields) {
            fieldName = toCamelCase(key);
        }

        const type = getTypeFromValue(
            value,
            `${capitalizeFirstLetter(key)}`,
            depth + 1,
            useCamelCaseFields,
            useProperCamelCase,
        );
        interfaceString += `${indent}  ${fieldName}: ${type};\n`;
    }

    interfaceString += `${indent}}`;

    return interfaceString;
}

function convertObjectToSeparateInterface(
    obj: JsonValue,
    interfaceName: string,
    depth: number = 0,
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
    collector: InterfaceCollector,
): string {
    const indent = '  '.repeat(depth);

    if (isJsonArray(obj)) {
        if (obj.length === 0) {
            return 'unknown[]';
        }
        const firstElement = obj[0];
        if (isJsonObject(firstElement)) {
            const elementInterfaceName = getUniqueInterfaceName(
                `${interfaceName}Item`,
                collector,
            );
            const elementInterface = convertObjectToSeparateInterface(
                firstElement,
                elementInterfaceName,
                0,
                useCamelCaseFields,
                useProperCamelCase,
                collector,
            );

            collector.interfaces.set(
                elementInterfaceName,
                `interface ${elementInterfaceName} {\n${elementInterface}}`,
            );
            return `${elementInterfaceName}[]`;
        } else {
            return `${getTypeFromValueSeparate(
                firstElement,
                undefined,
                0,
                useCamelCaseFields,
                useProperCamelCase,
                collector,
            )}[]`;
        }
    }

    if (!isJsonObject(obj)) {
        return getTypeFromValueSeparate(
            obj,
            undefined,
            0,
            useCamelCaseFields,
            useProperCamelCase,
            collector,
        );
    }

    let interfaceBody = '';

    for (const [key, value] of Object.entries(obj)) {
        // Convert field name based on options
        let fieldName = key;
        if (useProperCamelCase) {
            fieldName = toProperCamelCase(key);
        } else if (useCamelCaseFields) {
            fieldName = toCamelCase(key);
        }

        const type = getTypeFromValueSeparate(
            value,
            `${capitalizeFirstLetter(key)}`,
            depth + 1,
            useCamelCaseFields,
            useProperCamelCase,
            collector,
        );
        interfaceBody += `${indent}  ${fieldName}: ${type};\n`;
    }

    return interfaceBody;
}

function getTypeFromValue(
    value: JsonValue,
    typeName?: string,
    depth: number = 0,
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';

    if (isJsonArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const firstElement = value[0];
        if (isJsonObject(firstElement)) {
            const elementInterface = convertObjectToInterface(
                firstElement,
                `${typeName}Item`,
                depth,
                useCamelCaseFields,
                useProperCamelCase,
            );
            return `${elementInterface}[]`;
        }
        return `${getTypeFromValue(
            firstElement,
            undefined,
            0,
            useCamelCaseFields,
            useProperCamelCase,
        )}[]`;
    }

    if (isJsonObject(value)) {
        return convertObjectToInterface(
            value,
            typeName || 'NestedInterface',
            depth,
            useCamelCaseFields,
            useProperCamelCase,
        );
    }

    // Fallback for unexpected values
    return 'unknown';
}

function getTypeFromValueSeparate(
    value: JsonValue,
    typeName: string | undefined = undefined,
    _depth: number = 0,
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
    collector: InterfaceCollector,
): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';

    if (isJsonArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const firstElement = value[0];
        if (isJsonObject(firstElement)) {
            const elementInterfaceName = getUniqueInterfaceName(
                `${typeName}Item`,
                collector,
            );
            const elementInterface = convertObjectToSeparateInterface(
                firstElement,
                elementInterfaceName,
                0,
                useCamelCaseFields,
                useProperCamelCase,
                collector,
            );

            collector.interfaces.set(
                elementInterfaceName,
                `interface ${elementInterfaceName} {\n${elementInterface}}`,
            );
            return `${elementInterfaceName}[]`;
        }
        return `${getTypeFromValueSeparate(
            firstElement,
            undefined,
            0,
            useCamelCaseFields,
            useProperCamelCase,
            collector,
        )}[]`;
    }

    if (isJsonObject(value)) {
        const nestedInterfaceName = getUniqueInterfaceName(
            typeName || 'NestedInterface',
            collector,
        );
        const nestedInterface = convertObjectToSeparateInterface(
            value,
            nestedInterfaceName,
            0,
            useCamelCaseFields,
            useProperCamelCase,
            collector,
        );

        collector.interfaces.set(
            nestedInterfaceName,
            `interface ${nestedInterfaceName} {\n${nestedInterface}}`,
        );
        return nestedInterfaceName;
    }

    // Fallback for unexpected values
    return 'unknown';
}

function getUniqueInterfaceName(
    baseName: string,
    collector: InterfaceCollector,
): string {
    let counter = 0;
    let name = baseName;

    while (collector.usedNames.has(name)) {
        counter++;
        name = `${baseName}${counter}`;
    }

    collector.usedNames.add(name);
    return name;
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toCamelCase(string: string): string {
    // Chỉ chuyển ký tự đầu tiên thành chữ thường
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// Hàm chuyển đổi tên field sang camelCase thực sự
function toProperCamelCase(string: string): string {
    return string
        .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

// Client-side interactive form component
export default function JsonConverterForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [interfaceName, setInterfaceName] = useState('MyInterface');
    const [typescriptOutput, setTypescriptOutput] = useState('');
    const [error, setError] = useState('');
    const [useCamelCaseFields, setUseCamelCaseFields] = useState(false);
    const [useProperCamelCase, setUseProperCamelCase] = useState(false);
    const [separateInterfaces, setSeparateInterfaces] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleConvert = () => {
        try {
            setError('');
            const result = jsonToTypeScript(
                jsonInput,
                interfaceName,
                useCamelCaseFields,
                useProperCamelCase,
                separateInterfaces,
            );
            setTypescriptOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
            setTypescriptOutput('');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(typescriptOutput);
            setCopySuccess(true);
            // Tự động ẩn thông báo sau 2 giây
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Không thể sao chép vào clipboard:', err);
        }
    };

    const sampleJson = `{
  "Name": "John Doe",
  "Age": 30,
  "IsActive": true,
  "Address": {
    "Street": "123 Main St",
    "City": "New York",
    "ZipCode": "10001"
  },
  "Hobbies": ["reading", "swimming", "coding"],
  "ContactInfo": [
    {
      "Type": "email",
      "Value": "john@example.com"
    },
    {
      "Type": "phone",
      "Value": "+1234567890"
    }
  ]
}`;

    const handleLoadSample = () => {
        setJsonInput(sampleJson);
        setError('');
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>JSON Input</CardTitle>
                    <CardDescription>
                        Nhập JSON của bạn vào đây để chuyển đổi sang TypeScript
                        interface
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='interface-name'>Tên Interface</Label>
                        <input
                            id='interface-name'
                            type='text'
                            value={interfaceName}
                            onChange={(e) => setInterfaceName(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800'
                            placeholder='MyInterface'
                        />
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            id='camel-case'
                            type='checkbox'
                            checked={useCamelCaseFields}
                            onChange={(e) =>
                                setUseCamelCaseFields(e.target.checked)
                            }
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <Label htmlFor='camel-case' className='text-sm'>
                            Chuyển ký tự đầu của field thành chữ thường
                        </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            id='proper-camel-case'
                            type='checkbox'
                            checked={useProperCamelCase}
                            onChange={(e) =>
                                setUseProperCamelCase(e.target.checked)
                            }
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <Label htmlFor='proper-camel-case' className='text-sm'>
                            Chuyển tên field sang camelCase (vd: user_name →
                            userName)
                        </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            id='separate-interfaces'
                            type='checkbox'
                            checked={separateInterfaces}
                            onChange={(e) =>
                                setSeparateInterfaces(e.target.checked)
                            }
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <Label
                            htmlFor='separate-interfaces'
                            className='text-sm'
                        >
                            Tách các interface riêng biệt (nếu có)
                        </Label>
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
                    <CardTitle>TypeScript Interface</CardTitle>
                    <CardDescription>
                        Kết quả TypeScript interface được generate tự động
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
                </CardContent>
            </Card>
        </div>
    );
}
