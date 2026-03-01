'use client';

import {
    extractDataRows,
    extractFieldPaths,
    getValueByPath,
} from '@/utils/data-to-excel';
import { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
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

type DataSource = 'curl' | 'json';

interface ColumnMapping {
    excelColumn: string;
    dataField: string; // path or selected field
}

export default function DataToExcelForm() {
    const [dataSource, setDataSource] = useState<DataSource>('json');
    const [curlCommand, setCurlCommand] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [templateColumns, setTemplateColumns] = useState<string[]>([]);
    const [mappings, setMappings] = useState<ColumnMapping[]>([]);
    const [data, setData] = useState<unknown>(null);
    const [dataFields, setDataFields] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDataFromCurl = useCallback(async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/execute-curl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ curlCommand }),
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || 'Lỗi khi thực thi curl');
            }
            setData(result);
            const rows = extractDataRows(result);
            if (rows.length > 0) {
                setDataFields(extractFieldPaths(rows[0]));
            } else {
                setDataFields(extractFieldPaths(result));
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    }, [curlCommand]);

    const parseJsonData = useCallback(() => {
        setError('');
        try {
            const parsed = JSON.parse(jsonInput);
            setData(parsed);
            const rows = extractDataRows(parsed);
            if (rows.length > 0) {
                setDataFields(extractFieldPaths(rows[0]));
            } else {
                setDataFields(extractFieldPaths(parsed));
            }
        } catch {
            setError('JSON không hợp lệ');
        }
    }, [jsonInput]);

    const handleTemplateUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const buf = ev.target?.result as ArrayBuffer;
                    const wb = XLSX.read(buf, { type: 'array' });
                    const sheet = wb.Sheets[wb.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                    }) as unknown[][];
                    const headers = (json[0] ?? []).filter(
                        (h): h is string => typeof h === 'string' && h !== '',
                    );
                    setTemplateColumns(headers);
                    setTemplateFile(file);
                    setMappings(
                        headers.map((col) => ({
                            excelColumn: col,
                            dataField: '',
                        })),
                    );
                } catch {
                    setError('Không thể đọc file Excel');
                }
            };
            reader.readAsArrayBuffer(file);
        },
        [],
    );

    const updateMapping = (index: number, dataField: string) => {
        setMappings((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], dataField };
            return next;
        });
    };

    const suggestMappingWithAI = useCallback(async () => {
        if (templateColumns.length === 0) {
            setError('Vui lòng tải template Excel trước');
            return;
        }
        if (dataFields.length === 0) {
            setError('Vui lòng phân tích dữ liệu (JSON hoặc cURL) trước');
            return;
        }

        setError('');
        setAiLoading(true);
        try {
            const res = await fetch('/api/ai-suggest-mapping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    excelColumns: templateColumns,
                    dataFields,
                }),
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || 'Lỗi AI gợi ý ánh xạ');
            }

            const suggestions = (result.suggestions || []) as ColumnMapping[];
            if (suggestions.length > 0) {
                setMappings((prev) =>
                    prev.map((m) => {
                        const found = suggestions.find(
                            (s) => s.excelColumn === m.excelColumn,
                        );
                        return found ? { ...m, dataField: found.dataField } : m;
                    }),
                );
            } else if (result.rawReply) {
                // Trường hợp AI trả về text nhưng không parse được JSON
                setError(
                    'AI không trả về JSON hợp lệ cho ánh xạ. Vui lòng chỉnh lại prompt của AI service.',
                );
            }
        } catch (e) {
            setError(
                e instanceof Error ? e.message : 'Lỗi khi gọi AI gợi ý ánh xạ',
            );
        } finally {
            setAiLoading(false);
        }
    }, [templateColumns, dataFields]);

    const generateExcel = useCallback(async () => {
        if (!templateFile) {
            setError('Vui lòng tải lên file template Excel');
            return;
        }
        if (!data) {
            setError('Vui lòng nhập dữ liệu (từ curl hoặc JSON) trước');
            return;
        }

        setError('');
        try {
            const rows = extractDataRows(data);
            if (rows.length === 0) {
                setError(
                    'Không tìm thấy dữ liệu dạng mảng. Kiểm tra cấu trúc JSON.',
                );
                return;
            }

            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    const buf = ev.target?.result as ArrayBuffer;
                    const wb = XLSX.read(buf, { type: 'array' });
                    const sheetName = wb.SheetNames[0];
                    const ws = wb.Sheets[sheetName];

                    const startDataRow = 1;

                    for (let i = 0; i < rows.length; i++) {
                        const rowIndex = startDataRow + i;
                        const row = rows[i];
                        for (let c = 0; c < mappings.length; c++) {
                            const map = mappings[c];
                            if (!map.dataField) continue;

                            const value =
                                getValueByPath(row, map.dataField) ||
                                map.dataField;
                            const cellRef = XLSX.utils.encode_cell({
                                r: rowIndex,
                                c,
                            });
                            if (value !== undefined && value !== null) {
                                ws[cellRef] = {
                                    t: typeof value === 'number' ? 'n' : 's',
                                    v: value,
                                };
                            }
                        }
                    }

                    const out = XLSX.write(wb, {
                        bookType: 'xlsx',
                        type: 'array',
                    });
                    const blob = new Blob([out], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `export-${Date.now()}.xlsx`;
                    a.click();
                    URL.revokeObjectURL(url);
                } catch (err) {
                    setError(
                        err instanceof Error ? err.message : 'Lỗi tạo file',
                    );
                }
            };
            reader.readAsArrayBuffer(templateFile);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    }, [templateFile, data, mappings]);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
            {/* Column 1: Nguồn dữ liệu */}
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>1. Nguồn dữ liệu</CardTitle>
                        <CardDescription>
                            Lấy dữ liệu từ lệnh cURL (API) hoặc dán trực tiếp
                            JSON
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex gap-4'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='source'
                                    checked={dataSource === 'json'}
                                    onChange={() => setDataSource('json')}
                                    className='rounded'
                                />
                                <span>JSON</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='source'
                                    checked={dataSource === 'curl'}
                                    onChange={() => setDataSource('curl')}
                                    className='rounded'
                                />
                                <span>cURL</span>
                            </label>
                        </div>

                        {dataSource === 'json' ? (
                            <div className='space-y-2'>
                                <Label>Dán JSON</Label>
                                <Textarea
                                    placeholder='{"data": [{"name": "A", "email": "a@x.com"}, ...]}'
                                    value={jsonInput}
                                    onChange={(e) =>
                                        setJsonInput(e.target.value)
                                    }
                                    rows={8}
                                    className='font-mono text-sm max-h-[400px]'
                                />
                                <Button onClick={parseJsonData}>
                                    Phân tích & lấy danh sách field
                                </Button>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                <Label>Lệnh cURL</Label>
                                <Textarea
                                    placeholder='curl -X GET "https://api.example.com/users" -H "Authorization: Bearer xxx"'
                                    value={curlCommand}
                                    onChange={(e) =>
                                        setCurlCommand(e.target.value)
                                    }
                                    rows={8}
                                    className='font-mono text-sm max-h-[400px]'
                                />
                                <Button
                                    onClick={fetchDataFromCurl}
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Đang lấy dữ liệu...'
                                        : 'Lấy dữ liệu từ API'}
                                </Button>
                            </div>
                        )}

                        {dataFields.length > 0 && (
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                <span className='font-medium'>
                                    Các field có sẵn:{' '}
                                </span>
                                {dataFields.join(', ')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Column 2: Template Excel và Ánh xạ cột */}
            <div className='space-y-6'>
                {/* Excel template */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. Template Excel</CardTitle>
                        <CardDescription>
                            Tải lên file Excel mẫu (cột header ở dòng đầu tiên)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <input
                            type='file'
                            accept='.xlsx,.xls'
                            onChange={handleTemplateUpload}
                            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                        />
                        {templateFile && (
                            <p className='mt-2 text-sm text-green-600 dark:text-green-400'>
                                Đã tải: {templateFile.name}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Field mapping */}
                {templateColumns.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Ánh xạ cột</CardTitle>
                            <CardDescription>
                                Chọn field hoặc nhập đường dẫn thủ công (vd:
                                profile.name)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex justify-end mb-4'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={suggestMappingWithAI}
                                    disabled={
                                        aiLoading || dataFields.length === 0
                                    }
                                >
                                    {aiLoading
                                        ? 'Đang gợi ý với AI...'
                                        : 'Gợi ý ánh xạ bằng AI'}
                                </Button>
                            </div>
                            <div className='space-y-3 max-h-[400px] overflow-y-auto pr-2'>
                                {mappings.map((m, i) => (
                                    <div
                                        key={m.excelColumn}
                                        className='flex flex-wrap items-center gap-3'
                                    >
                                        <Label
                                            className='w-24 shrink-0 text-xs truncate'
                                            title={m.excelColumn}
                                        >
                                            {m.excelColumn}
                                        </Label>
                                        <div className='flex-1 min-w-[150px] relative'>
                                            <input
                                                type='text'
                                                list={`fields-${i}`}
                                                placeholder='Field...'
                                                value={m.dataField}
                                                onChange={(e) =>
                                                    updateMapping(
                                                        i,
                                                        e.target.value,
                                                    )
                                                }
                                                className='w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm'
                                            />
                                            <datalist id={`fields-${i}`}>
                                                {dataFields.map((f) => (
                                                    <option key={f} value={f} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generate */}
                <Card>
                    <CardContent className='pt-6'>
                        <Button
                            size='lg'
                            className='w-full'
                            onClick={generateExcel}
                            disabled={
                                !templateFile || !data || mappings.length === 0
                            }
                        >
                            Tạo file Excel
                        </Button>
                    </CardContent>
                </Card>

                {error && (
                    <div className='p-4 rounded-md bg-destructive/10 text-destructive text-sm'>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
