/**
 * Utilities for mapping JSON data to Excel
 */

/**
 * Extract all possible field paths from a JSON object/array for mapping
 * Supports nested objects and arrays (uses first item for array structure)
 */
export function extractFieldPaths(data: unknown, prefix = ''): string[] {
    const paths: string[] = [];

    if (data === null || data === undefined) {
        return paths;
    }

    if (Array.isArray(data)) {
        if (data.length > 0) {
            // Use first item to infer structure
            return extractFieldPaths(data[0], prefix ? `${prefix}[]` : '');
        }
        return paths;
    }

    if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
            const path = prefix ? `${prefix}.${key}` : key;

            if (value === null || value === undefined) {
                paths.push(path);
            } else if (Array.isArray(value)) {
                paths.push(path);
                if (
                    value.length > 0 &&
                    typeof value[0] === 'object' &&
                    value[0] !== null
                ) {
                    paths.push(...extractFieldPaths(value[0], `${path}[]`));
                }
            } else if (typeof value === 'object') {
                paths.push(path);
                paths.push(...extractFieldPaths(value, path));
            } else {
                paths.push(path);
            }
        }
    }

    return paths;
}

/**
 * Get value from object by dot-notation path (e.g. "data.items.0.name")
 */
export function getValueByPath(obj: unknown, path: string): unknown {
    if (!path) return obj;

    const parts = path
        .replace(/\[\]/g, '')
        .split(/[.[\]\)]+/)
        .filter(Boolean);

    let current: unknown = obj;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(current)) {
            current = current[index];
        } else if (typeof current === 'object' && part in current) {
            current = (current as Record<string, unknown>)[part];
        } else {
            return undefined;
        }
    }
    return current;
}

/**
 * Recursively find first array of objects in nested structure
 */
function findObjectArray(val: unknown): Record<string, unknown>[] | null {
    if (Array.isArray(val)) {
        const filtered = val.filter(
            (item): item is Record<string, unknown> =>
                typeof item === 'object' && item !== null,
        );
        return filtered.length > 0 ? filtered : null;
    }
    if (typeof val === 'object' && val !== null) {
        for (const v of Object.values(val)) {
            const found = findObjectArray(v);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Get array of items from data - handles common response shapes (array, { data: [] }, { items: [] }, etc.)
 */
export function extractDataRows(data: unknown): Record<string, unknown>[] {
    if (Array.isArray(data)) {
        return data.filter(
            (item): item is Record<string, unknown> =>
                typeof item === 'object' && item !== null,
        );
    }

    const found = findObjectArray(data);
    return found ?? [];
}
