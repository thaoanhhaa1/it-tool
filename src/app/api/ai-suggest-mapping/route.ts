import { NextResponse } from 'next/server';

interface ColumnMapping {
    excelColumn: string;
    dataField: string;
}

const AI_ENDPOINT = 'https://i-ai-service.onrender.com/ai/chat-fallback';

export async function POST(request: Request) {
    try {
        const { excelColumns, dataFields } = (await request.json()) as {
            excelColumns?: string[];
            dataFields?: string[];
        };

        if (
            !excelColumns ||
            !Array.isArray(excelColumns) ||
            excelColumns.length === 0
        ) {
            return NextResponse.json(
                { error: 'excelColumns is required' },
                { status: 400 },
            );
        }

        if (!dataFields || !Array.isArray(dataFields) || dataFields.length === 0) {
            return NextResponse.json(
                { error: 'dataFields is required' },
                { status: 400 },
            );
        }

        const prompt = `
Bạn là trợ lý giúp ánh xạ cột Excel với field trong dữ liệu JSON.

Danh sách cột Excel:
${excelColumns.map((c) => `- ${c}`).join('\n')}

Danh sách field trong dữ liệu:
${dataFields.map((f) => `- ${f}`).join('\n')}

Hãy trả về JSON THUẦN (không giải thích thêm) với dạng:
[
  { "excelColumn": "Tên cột Excel", "dataField": "tên_field_trong_dữ_liệu" }
]

Chỉ trả về JSON hợp lệ.
        `.trim();

        const aiResponse = await fetch(AI_ENDPOINT, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`,
            },
            body: JSON.stringify({
                message: prompt,
                targets: [
                    {
                        provider: 'openrouter',
                        model: 'google/gemma-3-4b-it:free',
                    },
                    {
                        provider: 'cerebras',
                        model: 'llama3.1-8b',
                    },
                    {
                        provider: 'cloudflare',
                        model: '@cf/google/gemma-2b-it-lora',
                    },
                    {
                        provider: 'cohere',
                        model: 'command-a-03-2025',
                    },
                    {
                        provider: 'gemini',
                        model: 'gemini-2.0-flash-lite',
                    },
                    {
                        provider: 'github',
                        model: 'deepseek/deepseek-r1',
                    },
                    {
                        provider: 'mistral',
                        model: 'mistral-small-2506',
                    },
                ],
            }),
        });

        if (!aiResponse.ok) {
            return NextResponse.json(
                { error: 'AI service error', status: aiResponse.status },
                { status: 502 },
            );
        }

        const aiJson = (await aiResponse.json()) as {
            data?: {
                reply?: string;
                message?: string;
                [key: string]: unknown;
            }
        };

        const rawReply = (aiJson?.data?.reply || aiJson?.data?.message || '') as string;

        /** Tiền xử lý: trích JSON array từ rawReply (có thể có text giải thích trước/sau) */
        const extractJsonArray = (str: string): string | null => {
            const s = str.trim();
            const start = s.indexOf('[');
            const end = s.lastIndexOf(']');
            if (start !== -1 && end !== -1 && end > start) {
                return s.slice(start, end + 1);
            }
            return null;
        };

        const jsonStr = extractJsonArray(rawReply) ?? rawReply;

        let suggestions: ColumnMapping[] = [];
        if (typeof jsonStr === 'string' && jsonStr.trim()) {
            try {
                const parsed = JSON.parse(jsonStr) as unknown;

                if (Array.isArray(parsed)) {
                    suggestions = parsed
                        .map((item) => {
                            if (
                                item &&
                                typeof item === 'object' &&
                                'excelColumn' in item &&
                                'dataField' in item
                            ) {
                                return {
                                    excelColumn: String(
                                        (item as { excelColumn: unknown }).excelColumn,
                                    ),
                                    dataField: String(
                                        (item as { dataField: unknown }).dataField,
                                    ),
                                };
                            }
                            return null;
                        })
                        .filter(
                            (x): x is ColumnMapping =>
                                x !== null &&
                                x.excelColumn.length > 0 &&
                                x.dataField.length > 0,
                        );
                }
            } catch {
                // Ignore JSON parse error and just return rawReply
            }
        }

        return NextResponse.json({
            suggestions,
            rawReply,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to call AI mapping service',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}

