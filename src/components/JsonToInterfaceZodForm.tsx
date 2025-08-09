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

// Hàm chuyển đổi JSON sang TypeScript interface (từ JsonConverterForm)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Hàm chuyển đổi JSON sang Zod schema trực tiếp
function jsonToZodSchema(
    jsonString: string,
    schemaName: string = 'mySchema',
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
): string {
    try {
        const obj: unknown = JSON.parse(jsonString);
        const zodSchema = convertValueToZodSchema(
            obj as JsonValue,
            useCamelCaseFields,
            useProperCamelCase,
        );

        const importStatement = "import { z } from 'zod';\n\n";
        const schemaDeclaration = `export const ${schemaName} = ${zodSchema};\n\n`;
        const typeInference = `// Type inference từ schema\ntype ${capitalizeFirstLetter(
            schemaName.replace('Schema', ''),
        )} = z.infer<typeof ${schemaName}>;`;

        return importStatement + schemaDeclaration + typeInference;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'JSON không hợp lệ',
        );
    }
}

function convertValueToZodSchema(
    value: JsonValue,
    useCamelCaseFields: boolean = false,
    useProperCamelCase: boolean = false,
): string {
    if (value === null) return 'z.null()';
    if (typeof value === 'boolean') return 'z.boolean()';
    if (typeof value === 'number') return 'z.number()';
    if (typeof value === 'string') return 'z.string()';

    if (isJsonArray(value)) {
        if (value.length === 0) return 'z.array(z.unknown())';
        const firstElement = value[0];
        const elementSchema = convertValueToZodSchema(
            firstElement,
            useCamelCaseFields,
            useProperCamelCase,
        );
        return `z.array(${elementSchema})`;
    }

    if (isJsonObject(value)) {
        let objectSchema = 'z.object({\n';

        for (const [key, val] of Object.entries(value)) {
            // Convert field name based on options
            let fieldName = key;
            if (useProperCamelCase) {
                fieldName = toProperCamelCase(key);
            } else if (useCamelCaseFields) {
                fieldName = toCamelCase(key);
            }

            const fieldSchema = convertValueToZodSchema(
                val,
                useCamelCaseFields,
                useProperCamelCase,
            );
            objectSchema += `  ${fieldName}: ${fieldSchema},\n`;
        }

        objectSchema += '})';
        return objectSchema;
    }

    return 'z.unknown()';
}

// Client-side interactive form component
export default function JsonToInterfaceZodForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [interfaceName, setInterfaceName] = useState('MyInterface');
    const [schemaName, setSchemaName] = useState('mySchema');
    const [interfaceOutput, setInterfaceOutput] = useState('');
    const [zodOutput, setZodOutput] = useState('');
    const [error, setError] = useState('');
    const [useCamelCaseFields, setUseCamelCaseFields] = useState(false);
    const [useProperCamelCase, setUseProperCamelCase] = useState(false);
    const [separateInterfaces, setSeparateInterfaces] = useState(false);
    const [copySuccessInterface, setCopySuccessInterface] = useState(false);
    const [copySuccessZod, setCopySuccessZod] = useState(false);
    const [copySuccessBoth, setCopySuccessBoth] = useState(false);

    const handleConvert = () => {
        try {
            setError('');

            // Generate TypeScript Interface
            const interfaceResult = jsonToTypeScript(
                jsonInput,
                interfaceName,
                useCamelCaseFields,
                useProperCamelCase,
                separateInterfaces,
            );
            setInterfaceOutput(interfaceResult);

            // Generate Zod Schema
            const zodResult = jsonToZodSchema(
                jsonInput,
                schemaName,
                useCamelCaseFields,
                useProperCamelCase,
            );
            setZodOutput(zodResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
            setInterfaceOutput('');
            setZodOutput('');
        }
    };

    const handleCopyInterface = async () => {
        try {
            await navigator.clipboard.writeText(interfaceOutput);
            setCopySuccessInterface(true);
            setTimeout(() => setCopySuccessInterface(false), 2000);
        } catch (err) {
            console.error('Không thể sao chép vào clipboard:', err);
        }
    };

    const handleCopyZod = async () => {
        try {
            await navigator.clipboard.writeText(zodOutput);
            setCopySuccessZod(true);
            setTimeout(() => setCopySuccessZod(false), 2000);
        } catch (err) {
            console.error('Không thể sao chép vào clipboard:', err);
        }
    };

    const handleCopyBoth = async () => {
        try {
            const combinedOutput = `${interfaceOutput}\n\n${zodOutput}`;
            await navigator.clipboard.writeText(combinedOutput);
            setCopySuccessBoth(true);
            setTimeout(() => setCopySuccessBoth(false), 2000);
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
        <div className='space-y-6'>
            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>JSON Input</CardTitle>
                    <CardDescription>
                        Nhập JSON của bạn vào đây để chuyển đổi sang TypeScript
                        interface và Zod schema
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            <Label htmlFor='schema-name'>Tên Schema</Label>
                            <input
                                id='schema-name'
                                type='text'
                                value={schemaName}
                                onChange={(e) => setSchemaName(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800'
                                placeholder='mySchema'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            <Label
                                htmlFor='proper-camel-case'
                                className='text-sm'
                            >
                                Chuyển tên field sang camelCase (vd: user_name →
                                userName)
                            </Label>
                        </div>
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
                            className='min-h-[200px] font-mono text-sm'
                        />
                    </div>

                    <div className='flex gap-2'>
                        <Button onClick={handleConvert} className='flex-1'>
                            Chuyển đổi cả hai
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
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* TypeScript Interface Output */}
                <Card>
                    <CardHeader>
                        <CardTitle>TypeScript Interface</CardTitle>
                        <CardDescription>
                            Kết quả TypeScript interface được generate tự động
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='interface-output'>Interface</Label>
                            <Textarea
                                id='interface-output'
                                value={interfaceOutput}
                                readOnly
                                placeholder='TypeScript interface sẽ xuất hiện ở đây...'
                                className='min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-900'
                            />
                        </div>

                        {interfaceOutput && (
                            <div className='space-y-2'>
                                <Button
                                    onClick={handleCopyInterface}
                                    variant='outline'
                                    className='w-full'
                                >
                                    Sao chép Interface
                                </Button>
                                {copySuccessInterface && (
                                    <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center'>
                                        ✓ Đã sao chép interface thành công!
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Zod Schema Output */}
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
                                    onClick={handleCopyZod}
                                    variant='outline'
                                    className='w-full'
                                >
                                    Sao chép Zod Schema
                                </Button>
                                {copySuccessZod && (
                                    <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center'>
                                        ✓ Đã sao chép Zod schema thành công!
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

            {/* Copy Both Button */}
            {interfaceOutput && zodOutput && (
                <Card>
                    <CardContent className='pt-6'>
                        <Button
                            onClick={handleCopyBoth}
                            className='w-full'
                            size='lg'
                        >
                            Sao chép cả Interface và Zod Schema
                        </Button>
                        {copySuccessBoth && (
                            <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center mt-4'>
                                ✓ Đã sao chép cả hai thành công!
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
