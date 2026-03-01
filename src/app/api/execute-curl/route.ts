import { parseCurlForExecution } from '@/utils/curl-executor';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { curlCommand } = (await request.json()) as {
            curlCommand?: string;
        };

        if (!curlCommand || typeof curlCommand !== 'string') {
            return NextResponse.json(
                { error: 'curlCommand is required' },
                { status: 400 },
            );
        }

        const parsed = parseCurlForExecution(curlCommand);

        if (!parsed.url) {
            return NextResponse.json(
                { error: 'Could not extract URL from curl command' },
                { status: 400 },
            );
        }

        const config: Parameters<typeof axios>[1] = {
            method: parsed.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
            url: parsed.url,
            headers: {
                'Content-Type': 'application/json',
                ...parsed.headers,
            },
            params: parsed.params,
            data: parsed.body,
            timeout: 30000,
        };

        const response = await axios(config);
        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                {
                    error: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                },
                { status: error.response?.status ?? 500 },
            );
        }
        return NextResponse.json(
            { error: 'Failed to execute curl command' },
            { status: 500 },
        );
    }
}
