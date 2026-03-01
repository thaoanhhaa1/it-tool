/**
 * Parse curl command for HTTP execution
 * Extracts URL, method, headers, body, and params
 */
export interface ParsedCurl {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: Record<string, unknown>;
    params?: Record<string, string>;
}

export function parseCurlForExecution(curlCommand: string): ParsedCurl {
    const normalizedCurl = curlCommand
        .replace(/\\\s*\n\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const urlMatch =
        normalizedCurl.match(
            /curl\s+(?:--location\s+)?(?:--request\s+\w+\s+)?['"]([^'"]+)['"]/,
        ) ||
        normalizedCurl.match(/curl\s+['"]([^'"]+)['"]/) ||
        normalizedCurl.match(/curl\s+(?:--location\s+)?['"]([^'"]+)['"]/) ||
        normalizedCurl.match(
            /curl\s+(?:-X\s+['"]?\w+['"]?\s+)?['"]([^'"]+)['"]/,
        ) ||
        normalizedCurl.match(/curl\s+(?:[^'"]*\s+)?['"]([^'"]+)['"]/);

    const methodMatch =
        normalizedCurl.match(/--request\s+['"]?(\w+)['"]?/) ||
        normalizedCurl.match(/-X\s+['"]?(\w+)['"]?/);

    const headerMatches = normalizedCurl.matchAll(
        /(?:--header|-H)\s+['"]([^'"]+)['"]/g,
    );

    const dataMatch =
        normalizedCurl.match(/(?:--data-raw|--data|-d)\s+'([^']+)'/) ||
        normalizedCurl.match(/(?:--data-raw|--data|-d)\s+"([^"]+)"/);

    const paramMatch = normalizedCurl.match(/\?([^'"]+)/);

    const headers: Record<string, string> = {};
    for (const match of headerMatches) {
        const [key, value] = match[1].split(':').map((s) => s.trim());
        if (key && value) {
            headers[key] = value;
        }
    }

    const params: Record<string, string> = {};
    if (paramMatch) {
        const paramString = paramMatch[1];
        paramString.split('&').forEach((param) => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }

    let parsedBody: Record<string, unknown> | undefined;
    if (dataMatch?.[1]) {
        try {
            parsedBody = JSON.parse(dataMatch[1]) as Record<string, unknown>;
        } catch {
            parsedBody = undefined;
        }
    }

    const hasDataFlag =
        normalizedCurl.includes('--data-raw') ||
        normalizedCurl.includes('--data ') ||
        normalizedCurl.includes('-d ');
    const defaultMethod = hasDataFlag ? 'POST' : 'GET';

    return {
        url: urlMatch?.[1] || '',
        method: methodMatch?.[1]?.toUpperCase() || defaultMethod,
        headers,
        body: parsedBody,
        params: Object.keys(params).length > 0 ? params : undefined,
    };
}
