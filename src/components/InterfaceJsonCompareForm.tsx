'use client';

import { useMemo, useState } from 'react';
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

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

type SchemaKind =
    | 'string'
    | 'number'
    | 'boolean'
    | 'null'
    | 'array'
    | 'object'
    | 'unknown';

type SchemaNode =
    | { kind: 'object'; properties: Record<string, SchemaProperty> }
    | { kind: 'array'; element: SchemaNode }
    | { kind: Exclude<SchemaKind, 'object' | 'array'> };

type SchemaProperty = {
    optional: boolean;
    schema: SchemaNode;
};

type DiffType = 'missing_in_json' | 'extra_in_json' | 'type_mismatch';

type DiffItem = {
    type: DiffType;
    path: string;
    expected?: string;
    actual?: string;
    message: string;
};

function isJsonObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function schemaKindToLabel(node: SchemaNode): string {
    if (node.kind === 'array') return `array<${schemaKindToLabel(node.element)}>`;
    if (node.kind === 'object') return 'object';
    return node.kind;
}

function valueToSchema(value: JsonValue): SchemaNode {
    if (value === null) return { kind: 'null' };
    if (typeof value === 'string') return { kind: 'string' };
    if (typeof value === 'number') return { kind: 'number' };
    if (typeof value === 'boolean') return { kind: 'boolean' };
    if (Array.isArray(value)) {
        if (value.length === 0) return { kind: 'array', element: { kind: 'unknown' } };
        return { kind: 'array', element: valueToSchema(value[0] as JsonValue) };
    }
    if (isJsonObject(value)) {
        const properties: Record<string, SchemaProperty> = {};
        for (const [k, v] of Object.entries(value)) {
            properties[k] = { optional: false, schema: valueToSchema(v as JsonValue) };
        }
        return { kind: 'object', properties };
    }
    return { kind: 'unknown' };
}

function stripComments(code: string): string {
    // remove /* */ and // comments
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function findFirstObjectTypeBlock(input: string): string | null {
    const s = stripComments(input).trim();
    if (!s) return null;

    // Prefer: interface X { ... }
    const interfaceIdx = s.search(/\binterface\b/);
    if (interfaceIdx !== -1) {
        const braceIdx = s.indexOf('{', interfaceIdx);
        if (braceIdx !== -1) {
            const block = extractBraceBlock(s, braceIdx);
            if (block) return block;
        }
    }

    // Fallback: type X = { ... }
    const typeIdx = s.search(/\btype\b/);
    if (typeIdx !== -1) {
        const braceIdx = s.indexOf('{', typeIdx);
        if (braceIdx !== -1) {
            const block = extractBraceBlock(s, braceIdx);
            if (block) return block;
        }
    }

    // Fallback: raw { ... }
    const rawBrace = s.indexOf('{');
    if (rawBrace !== -1) {
        const block = extractBraceBlock(s, rawBrace);
        if (block) return block;
    }

    return null;
}

function extractBraceBlock(s: string, openBraceIndex: number): string | null {
    if (s[openBraceIndex] !== '{') return null;
    let depth = 0;
    for (let i = openBraceIndex; i < s.length; i++) {
        const ch = s[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                return s.slice(openBraceIndex, i + 1);
            }
        }
    }
    return null;
}

function splitTopLevelMembers(body: string): string[] {
    // body includes outer braces { ... }
    const s = body.trim();
    if (!s.startsWith('{') || !s.endsWith('}')) return [];
    const inner = s.slice(1, -1);

    const members: string[] = [];
    let start = 0;
    let depthBrace = 0;
    let depthAngle = 0;
    let depthParen = 0;
    let depthBracket = 0;
    let inString: '"' | "'" | '`' | null = null;

    for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        const prev = inner[i - 1];
        if (inString) {
            if (ch === inString && prev !== '\\') inString = null;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') {
            inString = ch;
            continue;
        }
        if (ch === '{') depthBrace++;
        else if (ch === '}') depthBrace--;
        else if (ch === '<') depthAngle++;
        else if (ch === '>') depthAngle = Math.max(0, depthAngle - 1);
        else if (ch === '(') depthParen++;
        else if (ch === ')') depthParen--;
        else if (ch === '[') depthBracket++;
        else if (ch === ']') depthBracket--;

        const atTop =
            depthBrace === 0 &&
            depthAngle === 0 &&
            depthParen === 0 &&
            depthBracket === 0 &&
            !inString;

        if (atTop && (ch === ';' || ch === '\n')) {
            const part = inner.slice(start, i).trim();
            if (part) members.push(part);
            start = i + 1;
        }
    }

    const last = inner.slice(start).trim();
    if (last) members.push(last);
    return members;
}

function parseObjectSchema(objectBlock: string): SchemaNode {
    const members = splitTopLevelMembers(objectBlock);
    const properties: Record<string, SchemaProperty> = {};

    for (const raw of members) {
        // Skip signatures/index signatures for now
        if (/^\[.*\]\s*:/.test(raw)) continue;
        if (/^\w+\s*\(.*\)\s*:/.test(raw)) continue;

        // Note: avoid named capturing groups for lower TS targets
        const m = raw.match(
            /^\s*((?:[A-Za-z_$][\w$]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'))\s*(\?)?\s*:\s*([\s\S]+?)\s*$/,
        );
        if (!m) continue;

        const keyRaw = m[1]!.trim();
        const key = keyRaw.startsWith('"') || keyRaw.startsWith("'")
            ? keyRaw.slice(1, -1)
            : keyRaw;
        const optional = Boolean(m[2]);
        const typeText = m[3]!.trim().replace(/;$/, '').trim();

        properties[key] = {
            optional,
            schema: parseTypeToSchema(typeText),
        };
    }

    return { kind: 'object', properties };
}

function parseTypeToSchema(typeText: string): SchemaNode {
    const t = typeText.trim();

    // handle unions - if any side includes null => allow null by treating as unknown for mismatch checks
    // For simplicity: prefer non-null/non-undefined if present
    if (t.includes('|')) {
        const parts = t
            .split('|')
            .map((p) => p.trim())
            .filter(Boolean);
        const nonNullable = parts.filter(
            (p) => p !== 'null' && p !== 'undefined' && p !== 'void',
        );
        if (nonNullable.length === 1) return parseTypeToSchema(nonNullable[0]);
        // Too complex => unknown
        return { kind: 'unknown' };
    }

    if (t === 'string') return { kind: 'string' };
    if (t === 'number' || t === 'bigint') return { kind: 'number' };
    if (t === 'boolean') return { kind: 'boolean' };
    if (t === 'null') return { kind: 'null' };
    if (t === 'any' || t === 'unknown') return { kind: 'unknown' };

    // Array forms: T[] or Array<T>
    if (/\[\]\s*$/.test(t)) {
        const inner = t.replace(/\[\]\s*$/, '').trim();
        return { kind: 'array', element: parseTypeToSchema(inner) };
    }
    const arrayGeneric = t.match(/^Array\s*<\s*(.+)\s*>\s*$/);
    if (arrayGeneric) {
        return { kind: 'array', element: parseTypeToSchema(arrayGeneric[1]) };
    }

    // Inline object: { ... }
    if (t.startsWith('{')) {
        const block = extractBraceBlock(t, 0);
        if (block) return parseObjectSchema(block);
        return { kind: 'unknown' };
    }

    // Record<string, T> => object (treat values as unknown)
    const recordGeneric = t.match(/^Record\s*<\s*[^,]+,\s*(.+)\s*>\s*$/);
    if (recordGeneric) {
        // We cannot list keys; treat as object but unknown properties
        return { kind: 'object', properties: {} };
    }

    // Identifier / custom type => unknown
    return { kind: 'unknown' };
}

function parseInterfaceToSchema(interfaceText: string): SchemaNode {
    const block = findFirstObjectTypeBlock(interfaceText);
    if (!block) return { kind: 'unknown' };
    return parseObjectSchema(block);
}

function compareSchemas(
    expected: SchemaNode,
    actual: SchemaNode,
    path: string,
    diffs: DiffItem[],
) {
    // unknown means "skip strict type checking"
    if (expected.kind === 'unknown' || actual.kind === 'unknown') return;

    if (expected.kind !== actual.kind) {
        diffs.push({
            type: 'type_mismatch',
            path,
            expected: schemaKindToLabel(expected),
            actual: schemaKindToLabel(actual),
            message: `"${path}"`,
        });
        return;
    }

    if (expected.kind === 'array' && actual.kind === 'array') {
        compareSchemas(expected.element, actual.element, `${path}[]`, diffs);
        return;
    }

    if (expected.kind === 'object' && actual.kind === 'object') {
        const expectedKeys = Object.keys(expected.properties);
        const actualKeys = Object.keys(actual.properties);
        const expectedSet = new Set(expectedKeys);
        const actualSet = new Set(actualKeys);

        // missing in json (unless optional)
        for (const key of expectedKeys) {
            const prop = expected.properties[key];
            if (!actualSet.has(key)) {
                if (!prop.optional) {
                    diffs.push({
                        type: 'missing_in_json',
                        path: path ? `${path}.${key}` : key,
                        message: `Thiếu field trong JSON: "${path ? `${path}.` : ''
                            }${key}"`,
                    });
                }
                continue;
            }
            const nextPath = path ? `${path}.${key}` : key;
            compareSchemas(prop.schema, actual.properties[key]!.schema, nextPath, diffs);
        }

        // extra in json
        for (const key of actualKeys) {
            if (!expectedSet.has(key)) {
                diffs.push({
                    type: 'extra_in_json',
                    path: path ? `${path}.${key}` : key,
                    message: `Dư field trong JSON (không có trong interface): "${path ? `${path}.` : ''
                        }${key}"`,
                });
            }
        }
    }
}

function classForDiffType(type: DiffType): string {
    if (type === 'missing_in_json') return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-200';
    if (type === 'extra_in_json') return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/40 dark:text-amber-200';
    return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800/40 dark:text-purple-200';
}

export default function InterfaceJsonCompareForm() {
    const [interfaceInput, setInterfaceInput] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [diffs, setDiffs] = useState<DiffItem[]>([]);
    const [error, setError] = useState('');

    const sampleInterface = `interface User {
  id: number;
  name: string;
  email?: string;
  profile: {
    age: number;
    isActive: boolean;
    tags: string[];
  };
}`;

    const sampleJson = `{
  "id": "1",
  "name": "Alice",
  "profile": {
    "age": 22,
    "isActive": true,
    "tags": ["dev", "ts"],
    "extraField": 123
  },
  "unexpected": "field"
}`;

    const summary = useMemo(() => {
        const counts = { missing: 0, extra: 0, mismatch: 0 };
        for (const d of diffs) {
            if (d.type === 'missing_in_json') counts.missing++;
            else if (d.type === 'extra_in_json') counts.extra++;
            else counts.mismatch++;
        }
        return counts;
    }, [diffs]);

    const groupedDiffs = useMemo(() => {
        const fieldDiffs = diffs.filter(
            (d) => d.type === 'missing_in_json' || d.type === 'extra_in_json',
        );
        const typeDiffs = diffs.filter((d) => d.type === 'type_mismatch');
        return { fieldDiffs, typeDiffs };
    }, [diffs]);

    const handleCompare = () => {
        try {
            setError('');
            const expected = parseInterfaceToSchema(interfaceInput);
            if (expected.kind !== 'object') {
                throw new Error(
                    'Không parse được interface/type object. Hãy paste "interface X { ... }" hoặc "type X = { ... }".',
                );
            }

            const parsed: unknown = JSON.parse(jsonInput);
            const actualSchema =
                parsed === null || typeof parsed !== 'object'
                    ? valueToSchema(parsed as JsonValue)
                    : valueToSchema(parsed as JsonValue);

            if (actualSchema.kind !== 'object') {
                throw new Error('JSON input cần là object (vd: { "a": 1 }).');
            }

            const out: DiffItem[] = [];
            compareSchemas(expected, actualSchema, '', out);
            setDiffs(out);
        } catch (e) {
            setDiffs([]);
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi');
        }
    };

    const handleLoadSample = () => {
        setInterfaceInput(sampleInterface);
        setJsonInput(sampleJson);
        setError('');
        setDiffs([]);
    };

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-2'>
                <Button onClick={handleCompare}>So sánh</Button>
                <Button variant='outline' onClick={handleLoadSample}>
                    Tải mẫu
                </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>TypeScript Interface</CardTitle>
                        <CardDescription>
                            Paste interface/type dạng object để làm &quot;expected&quot;
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <Label htmlFor='interface-input'>Interface</Label>
                        <Textarea
                            id='interface-input'
                            value={interfaceInput}
                            onChange={(e) => setInterfaceInput(e.target.value)}
                            placeholder='interface X { a: string; b?: number; nested: { c: boolean } }'
                            className='min-h-[320px] font-mono text-sm'
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>JSON</CardTitle>
                        <CardDescription>
                            Paste JSON object để làm &quot;actual&quot;
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <Label htmlFor='json-input'>JSON</Label>
                        <Textarea
                            id='json-input'
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder='{"a":"x","b":1}'
                            className='min-h-[320px] font-mono text-sm'
                        />
                    </CardContent>
                </Card>
            </div>

            {error && (
                <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-md'>
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Kết quả so sánh</CardTitle>
                    <CardDescription>
                        Khác biệt field: {summary.missing + summary.extra} · Sai type: {summary.mismatch}
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                    {diffs.length === 0 && !error ? (
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                            Chưa có khác biệt (hoặc chưa bấm So sánh).
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {/* Group: Field diffs (missing + extra) */}
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                        Khác biệt field
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        Thiếu: {summary.missing} · Dư: {summary.extra}
                                    </div>
                                </div>

                                {groupedDiffs.fieldDiffs.length === 0 ? (
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                                        Không có khác biệt field.
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className='border rounded-md p-3 bg-white/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700'>
                                            <div className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                                                Thiếu field trong JSON:
                                            </div>
                                            {summary.missing === 0 ? (
                                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Không có.
                                                </div>
                                            ) : (
                                                <ul className='list-disc list-inside space-y-1 text-sm'>
                                                    {groupedDiffs.fieldDiffs
                                                        .filter(
                                                            (d) =>
                                                                d.type ===
                                                                'missing_in_json',
                                                        )
                                                        .map((d, idx) => (
                                                            <li
                                                                key={`missing-${d.path}-${idx}`}
                                                                className='font-mono text-red-700 dark:text-red-200'
                                                            >
                                                                {d.path}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div className='border rounded-md p-3 bg-white/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700'>
                                            <div className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                                                Dư field trong JSON (không có
                                                trong interface):
                                            </div>
                                            {summary.extra === 0 ? (
                                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Không có.
                                                </div>
                                            ) : (
                                                <ul className='list-disc list-inside space-y-1 text-sm'>
                                                    {groupedDiffs.fieldDiffs
                                                        .filter(
                                                            (d) =>
                                                                d.type ===
                                                                'extra_in_json',
                                                        )
                                                        .map((d, idx) => (
                                                            <li
                                                                key={`extra-${d.path}-${idx}`}
                                                                className='font-mono text-amber-700 dark:text-amber-200'
                                                            >
                                                                {d.path}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Group: Type mismatches */}
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                        Sai type
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        Tổng: {summary.mismatch}
                                    </div>
                                </div>

                                {groupedDiffs.typeDiffs.length === 0 ? (
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                                        Không có sai type.
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {groupedDiffs.typeDiffs.map((d, idx) => (
                                            <div
                                                key={`type-${d.type}-${d.path}-${idx}`}
                                                className={`flex justify-between items-center border rounded-md p-3 text-sm ${classForDiffType(
                                                    d.type,
                                                )}`}
                                            >
                                                <div className='font-medium'>{d.message}</div>
                                                {(d.expected || d.actual) && (
                                                    <div className='mt-1 text-xs opacity-90'>
                                                        {d.expected && (
                                                            <span className='mr-3'>
                                                                expected:{' '}
                                                                <span className='font-mono'>
                                                                    {d.expected}
                                                                </span>
                                                            </span>
                                                        )}
                                                        {d.actual && (
                                                            <span>
                                                                actual:{' '}
                                                                <span className='font-mono'>
                                                                    {d.actual}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

