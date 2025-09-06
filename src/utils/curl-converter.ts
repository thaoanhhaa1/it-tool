interface CurlObject {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: Record<string, unknown>;
    params?: Record<string, string | number>;
}

export interface ConvertedResult {
    query?: string;
    mutation?: string;
    api: string;
    type?: string;
}

type TypeCase =
    | 'camelCase'
    | 'PascalCase'
    | 'snake_case'
    | 'kebab-case'
    | 'UPPER_CASE';

export interface ConvertOptions {
    entityName?: string;
    operationName?: string;
    isQuery?: boolean;
    isMutation?: boolean;
    isInfiniteQuery?: boolean;
    responseType?: string;
    requestType?: string;
    hasParams?: boolean;
    hasBody?: boolean;
    responseData?: Record<string, unknown> | Record<string, unknown>[];
    pathParams?: Record<string, unknown>;
    sourceTypeCase?: TypeCase;
    targetTypeCase?: TypeCase;
}

type ZodPrimitive = 'string' | 'number' | 'boolean' | 'date';
type ZodType = ZodPrimitive | 'array' | 'object' | 'unknown';

interface SchemaField {
    name: string;
    type: ZodType;
    optional: boolean;
    arrayType?: ZodType;
    objectFields?: SchemaField[];
}

export class CurlConverter {
    private static convertCase(
        str: string,
        fromCase: TypeCase,
        toCase: TypeCase,
    ): string {
        if (fromCase === toCase) return str;

        let words: string[] = [];

        switch (fromCase) {
            case 'camelCase':
                words = str
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .toLowerCase()
                    .split(' ');
                break;
            case 'PascalCase':
                words = str
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .toLowerCase()
                    .split(' ');
                break;
            case 'snake_case':
                words = str.toLowerCase().split('_');
                break;
            case 'kebab-case':
                words = str.toLowerCase().split('-');
                break;
            case 'UPPER_CASE':
                words = str.toLowerCase().split('_');
                break;
            default:
                words = [str.toLowerCase()];
        }

        switch (toCase) {
            case 'camelCase':
                return (
                    words[0] +
                    words
                        .slice(1)
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join('')
                );
            case 'PascalCase':
                return words
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('');
            case 'snake_case':
                return words.join('_');
            case 'kebab-case':
                return words.join('-');
            case 'UPPER_CASE':
                return words.join('_').toUpperCase();
            default:
                return str;
        }
    }

    private static convertObjectKeys(
        obj: Record<string, unknown>,
        fromCase: TypeCase,
        toCase: TypeCase,
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        Object.entries(obj).forEach(([key, value]) => {
            const convertedKey = this.convertCase(key, fromCase, toCase);

            if (Array.isArray(value)) {
                result[convertedKey] = value.map((item) => {
                    if (typeof item === 'object' && item !== null) {
                        return this.convertObjectKeys(
                            item as Record<string, unknown>,
                            fromCase,
                            toCase,
                        );
                    }
                    return item;
                });
            } else if (typeof value === 'object' && value !== null) {
                result[convertedKey] = this.convertObjectKeys(
                    value as Record<string, unknown>,
                    fromCase,
                    toCase,
                );
            } else {
                result[convertedKey] = value;
            }
        });

        return result;
    }

    private static parseCurl(curlCommand: string): CurlObject {
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
                parsedBody = JSON.parse(dataMatch[1]) as Record<
                    string,
                    unknown
                >;
            } catch {
                parsedBody = undefined;
            }
        }

        const hasDataFlag =
            normalizedCurl.includes('--data-raw') ||
            normalizedCurl.includes('--data ') ||
            normalizedCurl.includes('-d ');
        const defaultMethod = hasDataFlag ? 'POST' : 'GET';

        const result = {
            url: urlMatch?.[1] || '',
            method: methodMatch?.[1]?.toUpperCase() || defaultMethod,
            headers,
            body: parsedBody,
            params: Object.keys(params).length > 0 ? params : undefined,
        };

        if (!result.url) {
            console.warn('Warning: Could not extract URL from curl command');
            console.warn('Normalized curl:', normalizedCurl);
            console.warn('URL match result:', urlMatch);
        }

        return result;
    }

    private static inferZodType(value: unknown, key?: string): ZodType {
        if (typeof value === 'number') {
            return 'number';
        }
        if (typeof value === 'boolean') {
            return 'boolean';
        }
        if (Array.isArray(value)) {
            return 'array';
        }
        if (typeof value === 'object' && value !== null) {
            return 'object';
        }
        if (typeof value === 'string') {
            if (key?.toLowerCase().includes('date')) {
                return 'date';
            }

            if (!isNaN(Number(value)) && value.trim() !== '') {
                return 'number';
            }

            if (
                value.toLowerCase() === 'true' ||
                value.toLowerCase() === 'false'
            ) {
                return 'boolean';
            }

            if (
                (value.startsWith('[') && value.endsWith(']')) ||
                (value.startsWith('{') && value.endsWith('}'))
            ) {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        return 'array';
                    }
                    if (typeof parsed === 'object' && parsed !== null) {
                        return 'object';
                    }
                } catch {}
            }
            return 'string';
        }
        return 'unknown';
    }

    private static analyzeObjectStructure(
        obj: Record<string, unknown>,
        sourceTypeCase?: TypeCase,
        targetTypeCase?: TypeCase,
    ): SchemaField[] {
        return Object.entries(obj).map(([key, value]) => {
            const convertedKey =
                sourceTypeCase &&
                targetTypeCase &&
                sourceTypeCase !== targetTypeCase
                    ? this.convertCase(key, sourceTypeCase, targetTypeCase)
                    : key;

            const type = this.inferZodType(value, key);
            const field: SchemaField = {
                name: convertedKey,
                type,
                optional: value === null || value === undefined,
            };

            if (type === 'array' && Array.isArray(value) && value.length > 0) {
                field.arrayType = this.inferZodType(value[0]);
                if (
                    field.arrayType === 'object' &&
                    typeof value[0] === 'object' &&
                    value[0] !== null
                ) {
                    field.objectFields = this.analyzeObjectStructure(
                        value[0] as Record<string, unknown>,
                        sourceTypeCase,
                        targetTypeCase,
                    );
                }
            } else if (
                type === 'object' &&
                typeof value === 'object' &&
                value !== null
            ) {
                field.objectFields = this.analyzeObjectStructure(
                    value as Record<string, unknown>,
                    sourceTypeCase,
                    targetTypeCase,
                );
            }

            return field;
        });
    }

    private static generateZodSchema(
        fields: SchemaField[],
        isParams: boolean = false,
        pathParams?: string[],
    ): string {
        const generateFieldType = (field: SchemaField): string => {
            let zodType: string;

            switch (field.type) {
                case 'string':
                    zodType = 'z.string().trim()';
                    break;
                case 'number':
                    zodType = 'z.number()';
                    break;
                case 'boolean':
                    zodType = 'z.boolean()';
                    break;
                case 'date':
                    zodType = 'z.string().trim()';
                    break;
                case 'array':
                    if (field.arrayType === 'object' && field.objectFields) {
                        const objectSchema = this.generateZodSchema(
                            field.objectFields,
                            isParams,
                            pathParams,
                        );
                        zodType = `z.array(${objectSchema})`;
                    } else {
                        const arrayItemType = field.arrayType || 'unknown';
                        const itemZodType =
                            arrayItemType === 'unknown'
                                ? 'z.unknown()'
                                : arrayItemType === 'string'
                                ? 'z.string().trim()'
                                : arrayItemType === 'number'
                                ? 'z.number()'
                                : arrayItemType === 'boolean'
                                ? 'z.boolean()'
                                : 'z.unknown()';
                        zodType = `z.array(${itemZodType})`;
                    }
                    break;
                case 'object':
                    if (field.objectFields) {
                        zodType = this.generateZodSchema(
                            field.objectFields,
                            isParams,
                            pathParams,
                        );
                    } else {
                        zodType = 'z.record(z.unknown())';
                    }
                    break;
                default:
                    zodType = 'z.unknown()';
            }

            // Path params không được optional
            const isPathParam = pathParams && pathParams.includes(field.name);
            if (isPathParam) {
                return zodType;
            }

            if (isParams) {
                return `${zodType}.optional()`;
            }

            return field.optional ? `${zodType}.optional()` : zodType;
        };

        const fieldStrings = fields.map(
            (field) => `  ${field.name}: ${generateFieldType(field)}`,
        );

        return `z.object({\n${fieldStrings.join(',\n')}\n})`;
    }

    private static generateSchema(
        data: Record<string, unknown> | Record<string, string>,
        schemaName: string,
        sourceTypeCase?: TypeCase,
        targetTypeCase?: TypeCase,
        isParams: boolean = false,
        pathParams?: string[],
    ): string {
        const fields = this.analyzeObjectStructure(
            data as Record<string, unknown>,
            sourceTypeCase,
            targetTypeCase,
        );
        const zodSchema = this.generateZodSchema(fields, isParams, pathParams);

        return `const ${schemaName}Schema = ${zodSchema};\n\nexport type ${
            schemaName.charAt(0).toUpperCase() + schemaName.slice(1)
        }Schema = z.infer<typeof ${schemaName}Schema>;`;
    }

    private static generateResponseInterface(
        responseData: Record<string, unknown> | Record<string, unknown>[],
        interfaceName: string,
        sourceTypeCase?: TypeCase,
        targetTypeCase?: TypeCase,
    ): string {
        const isArray = Array.isArray(responseData);
        const dataToAnalyze = isArray
            ? (responseData[0] as Record<string, unknown>)
            : (responseData as Record<string, unknown>);

        if (!dataToAnalyze || typeof dataToAnalyze !== 'object') {
            return `export interface ${interfaceName} {
      
    }`;
        }

        const generateInterfaceField = (
            key: string,
            value: unknown,
        ): string => {
            const convertedKey =
                sourceTypeCase &&
                targetTypeCase &&
                sourceTypeCase !== targetTypeCase
                    ? this.convertCase(key, sourceTypeCase, targetTypeCase)
                    : key;

            const optional = value === null || value === undefined;
            const optionalSuffix = optional ? '?' : '';

            if (typeof value === 'string') {
                return `  ${convertedKey}${optionalSuffix}: string;`;
            }
            if (typeof value === 'number') {
                return `  ${convertedKey}${optionalSuffix}: number;`;
            }
            if (typeof value === 'boolean') {
                return `  ${convertedKey}${optionalSuffix}: boolean;`;
            }
            if (value === null) {
                return `  ${convertedKey}?: null;`;
            }
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return `  ${convertedKey}${optionalSuffix}: unknown[];`;
                }
                const firstItem = value[0];
                if (typeof firstItem === 'object' && firstItem !== null) {
                    const convertedKeyPascal =
                        sourceTypeCase &&
                        targetTypeCase &&
                        sourceTypeCase !== targetTypeCase
                            ? this.convertCase(
                                  key,
                                  sourceTypeCase,
                                  'PascalCase',
                              )
                            : key.charAt(0).toUpperCase() + key.slice(1);

                    const nestedInterfaceName = `${interfaceName}${convertedKeyPascal}Item`;
                    return `  ${convertedKey}${optionalSuffix}: ${nestedInterfaceName}[];`;
                }
                const itemType = typeof firstItem;
                return `  ${convertedKey}${optionalSuffix}: ${itemType}[];`;
            }
            if (typeof value === 'object' && value !== null) {
                const convertedKeyPascal =
                    sourceTypeCase &&
                    targetTypeCase &&
                    sourceTypeCase !== targetTypeCase
                        ? this.convertCase(key, sourceTypeCase, 'PascalCase')
                        : key.charAt(0).toUpperCase() + key.slice(1);

                const nestedInterfaceName = `${interfaceName}${convertedKeyPascal}`;
                return `  ${convertedKey}${optionalSuffix}: ${nestedInterfaceName};`;
            }
            return `  ${convertedKey}${optionalSuffix}: unknown;`;
        };

        const generateNestedInterfaces = (
            obj: Record<string, unknown>,
            baseName: string,
        ): string => {
            let nestedInterfaces = '';

            Object.entries(obj).forEach(([key, value]) => {
                if (
                    Array.isArray(value) &&
                    value.length > 0 &&
                    typeof value[0] === 'object' &&
                    value[0] !== null
                ) {
                    const convertedKeyPascal =
                        sourceTypeCase &&
                        targetTypeCase &&
                        sourceTypeCase !== targetTypeCase
                            ? this.convertCase(
                                  key,
                                  sourceTypeCase,
                                  'PascalCase',
                              )
                            : key.charAt(0).toUpperCase() + key.slice(1);

                    const nestedInterfaceName = `${baseName}${convertedKeyPascal}Item`;
                    const nestedObj = value[0] as Record<string, unknown>;

                    const fields = Object.entries(nestedObj)
                        .map(([nestedKey, nestedValue]) =>
                            generateInterfaceField(nestedKey, nestedValue),
                        )
                        .join('\n');

                    nestedInterfaces += `\nexport interface ${nestedInterfaceName} {\n${fields}\n}\n`;
                    nestedInterfaces += generateNestedInterfaces(
                        nestedObj,
                        nestedInterfaceName,
                    );
                } else if (typeof value === 'object' && value !== null) {
                    const convertedKeyPascal =
                        sourceTypeCase &&
                        targetTypeCase &&
                        sourceTypeCase !== targetTypeCase
                            ? this.convertCase(
                                  key,
                                  sourceTypeCase,
                                  'PascalCase',
                              )
                            : key.charAt(0).toUpperCase() + key.slice(1);

                    const nestedInterfaceName = `${baseName}${convertedKeyPascal}`;
                    const nestedObj = value as Record<string, unknown>;

                    const fields = Object.entries(nestedObj)
                        .map(([nestedKey, nestedValue]) =>
                            generateInterfaceField(nestedKey, nestedValue),
                        )
                        .join('\n');

                    nestedInterfaces += `\nexport interface ${nestedInterfaceName} {\n${fields}\n}\n`;
                    nestedInterfaces += generateNestedInterfaces(
                        nestedObj,
                        nestedInterfaceName,
                    );
                }
            });

            return nestedInterfaces;
        };

        const fields = Object.entries(dataToAnalyze)
            .map(([key, value]) => generateInterfaceField(key, value))
            .join('\n');

        const mainInterface = `export interface ${interfaceName} {\n${fields}\n}`;
        const nestedInterfaces = generateNestedInterfaces(
            dataToAnalyze,
            interfaceName,
        );

        return nestedInterfaces + mainInterface;
    }

    private static extractEntityAndOperationFromUrl(
        url: string,
        method: string,
    ): {
        entityName: string;
        operationName: string;
    } {
        try {
            const urlObj = new URL(url);
            const pathSegments = urlObj.pathname
                .split('/')
                .filter((segment) => segment.length > 0);

            const filteredSegments = pathSegments.filter(
                (segment) =>
                    !['api', 'v1', 'v2', 'v3'].includes(segment.toLowerCase()),
            );

            let entityName = 'api';
            let operationName = 'request';

            if (filteredSegments.length > 0) {
                const lastSegment =
                    filteredSegments[filteredSegments.length - 1];

                if (this.isOperationSegment(lastSegment)) {
                    entityName =
                        filteredSegments.length > 1
                            ? filteredSegments[filteredSegments.length - 2]
                            : filteredSegments[0];

                    operationName =
                        this.extractOperationFromSegment(lastSegment);
                } else {
                    entityName = lastSegment;
                    operationName = this.inferOperationName(
                        method,
                        filteredSegments,
                        urlObj.search,
                    );
                }
            }

            entityName = this.toCamelCase(entityName);
            operationName = this.toCamelCase(operationName);

            return { entityName, operationName };
        } catch {
            return {
                entityName: 'api',
                operationName: method.toLowerCase(),
            };
        }
    }

    private static isOperationSegment(segment: string): boolean {
        const operationKeywords = [
            'get',
            'post',
            'put',
            'delete',
            'patch',
            'create',
            'update',
            'remove',
            'fetch',
            'list',
            'search',
            'find',
            'query',
            'add',
            'edit',
            'save',
            'load',
        ];

        const lowerSegment = segment.toLowerCase();
        return operationKeywords.some((keyword) =>
            lowerSegment.includes(keyword),
        );
    }

    private static extractOperationFromSegment(segment: string): string {
        return this.toCamelCase(segment);
    }

    private static toCamelCase(str: string): string {
        return str
            .replace(/[-_\s]+(.)?/g, (_, char) =>
                char ? char.toUpperCase() : '',
            )
            .replace(/^[A-Z]/, (char) => char.toLowerCase());
    }

    private static toPascalCase(str: string): string {
        const camelCase = this.toCamelCase(str);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }

    private static inferOperationName(
        method: string,
        pathSegments: string[],
        queryString: string,
    ): string {
        const hasQuery = queryString.length > 0;
        const lastSegment = pathSegments[pathSegments.length - 1];
        const hasId =
            pathSegments.length > 1 &&
            (pathSegments[1].match(/^\d+$/) || pathSegments[1].length > 10);

        switch (method.toUpperCase()) {
            case 'GET':
                if (hasId) {
                    return 'getById';
                } else if (
                    hasQuery ||
                    lastSegment?.includes('search') ||
                    lastSegment?.includes('list')
                ) {
                    return 'getList';
                } else {
                    return 'get';
                }

            case 'POST':
                if (lastSegment?.includes('create')) {
                    return 'create';
                } else if (lastSegment?.includes('search')) {
                    return 'search';
                } else {
                    return 'create';
                }

            case 'PUT':
                if (lastSegment?.includes('update')) {
                    return 'update';
                } else {
                    return 'update';
                }

            case 'PATCH':
                return 'patch';

            case 'DELETE':
                if (hasId) {
                    return 'deleteById';
                } else {
                    return 'delete';
                }

            default:
                return method.toLowerCase();
        }
    }

    private static sanitizeName(name: string): string {
        const cleaned = name.replace(/[^a-zA-Z0-9\-_\s]/g, '');
        return this.toCamelCase(cleaned);
    }

    private static generateQuery(
        options: ConvertOptions,
        curlObj: CurlObject,
        entityName: string,
        operationName: string,
    ): string {
        const { isInfiniteQuery, pathParams } = options;
        const hasSchema = Boolean(curlObj.params || curlObj.body || pathParams);

        const schemaName = `${operationName}${this.toPascalCase(
            entityName,
        )}ParamsSchema`;

        const serviceName = `${entityName}${this.toPascalCase(operationName)}`;

        if (isInfiniteQuery) {
            return `export const ${serviceName}Infinite = new InfiniteQueryService({
          name: '${entityName}-${operationName}-infinite',${
                hasSchema ? `\n  schema: ${schemaName},` : ''
            }
          fn: ({ signal, pageParam = 1${
              hasSchema ? ', payload' : ''
          } }) => ${entityName}Api.${operationName}(${
                hasSchema
                    ? '{ ...payload, page: pageParam }, '
                    : '{ page: pageParam }, '
            }{ signal }),
          getNextPageParam: (lastPage, allPages) => {
            if (lastPage.Data && Array.isArray(lastPage.Data) && lastPage.Data.length > 0) {
              return allPages.length + 1;
            }
            return undefined;
          },
          initialPageParam: 1,
        });`;
        }

        return `export const ${serviceName} = new QueryService({
    name: '${entityName}-${operationName}',${
            hasSchema ? `\n    schema: ${schemaName},` : ''
        }
    fn: ({ signal${
        hasSchema ? ', payload' : ''
    } }) => ${entityName}Api.${operationName}(${
            hasSchema ? 'payload, ' : ''
        }{ signal }),
});`;
    }

    private static generateMutation(
        options: ConvertOptions,
        curlObj: CurlObject,
        entityName: string,
        operationName: string,
    ): string {
        const { pathParams } = options;
        const hasBody = Boolean(curlObj.body || pathParams);

        const schemaName = hasBody
            ? `${this.toPascalCase(
                  operationName,
              )}${entityName[0].toUpperCase()}${entityName.slice(1)}Schema`
            : 'void';

        const serviceName = `${this.toPascalCase(
            operationName,
        )}${this.toPascalCase(entityName)}`;

        return `export const ${serviceName} = new MutationService${
            hasBody ? `<${schemaName}>` : '<void>'
        }({
    fn: (${hasBody ? 'body' : ''}) => ${entityName}Api.${operationName}(${
            hasBody ? 'body' : ''
        }),
    onSuccess: () => {
        ${entityName}List.invalidate();
    },
});`;
    }

    private static generateApi(
        options: ConvertOptions,
        curlObj: CurlObject,
        entityName: string,
        operationName: string,
    ): string {
        const { responseType, responseData, isInfiniteQuery, pathParams } =
            options;
        const { method, url } = curlObj;

        const urlObj = new URL(url);
        let cleanPath = urlObj.pathname;

        // Detect và replace path params trong URL
        const usedPathParams: string[] = [];
        if (pathParams) {
            // Thay thế các pattern path params (:key, {key}, [key])
            Object.keys(pathParams).forEach((key) => {
                const pathParamPattern = new RegExp(
                    `:${key}|\\{${key}\\}|\\[${key}\\]`,
                    'g',
                );
                if (pathParamPattern.test(cleanPath)) {
                    cleanPath = cleanPath.replace(
                        pathParamPattern,
                        `\${${key}}`,
                    );
                    usedPathParams.push(key);
                }
            });

            // Thay thế các value trong path params bằng key
            Object.entries(pathParams).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const valueStr = String(value);
                    const valuePattern = new RegExp(`/${valueStr}(?=/|$)`, 'g');
                    if (valuePattern.test(cleanPath)) {
                        cleanPath = cleanPath.replace(
                            valuePattern,
                            `/\${${key}}`,
                        );
                        if (!usedPathParams.includes(key)) {
                            usedPathParams.push(key);
                        }
                    }
                }
            });
        }

        // Với GET method, path params không được replace sẽ được đưa vào params
        // Với các method khác, path params không được replace sẽ được đưa vào body
        const isGetMethod = method === 'GET';
        const remainingPathParams = pathParams
            ? Object.fromEntries(
                  Object.entries(pathParams).filter(
                      ([key]) => !usedPathParams.includes(key),
                  ),
              )
            : undefined;

        const hasParams = Boolean(
            curlObj.params || (remainingPathParams && isGetMethod),
        );
        const hasBody = Boolean(
            curlObj.body || (remainingPathParams && !isGetMethod),
        );
        const hasConfig = true;

        let paramType = '';
        if (hasParams || isInfiniteQuery) {
            const baseParamType = hasParams
                ? `${this.toPascalCase(operationName)}${this.toPascalCase(
                      entityName,
                  )}ParamsSchema`
                : '{}';

            if (isInfiniteQuery) {
                paramType = `params?: ${baseParamType} & { page?: number }`;
            } else {
                paramType = hasParams ? `params?: ${baseParamType}` : '';
            }
        }

        const bodyType = hasBody
            ? `body: ${this.toPascalCase(operationName)}${this.toPascalCase(
                  entityName,
              )}Schema`
            : '';
        const configType = hasConfig ? `config?: AxiosRequestConfig` : '';

        // Tạo parameters với destructuring cho path params và rest cho others
        const hasExistingParams =
            curlObj.params ||
            isInfiniteQuery ||
            (remainingPathParams && isGetMethod);
        const hasExistingBody =
            curlObj.body || (remainingPathParams && !isGetMethod);

        const parameters: string[] = [];

        // Thêm path params với destructuring
        if (usedPathParams.length > 0) {
            if (hasExistingParams && method !== 'DELETE') {
                // Destructure path params từ params (không áp dụng cho DELETE)
                const pathParamsDestructure = `{ ${usedPathParams.join(
                    ', ',
                )}, ...params }`;
                parameters.push(
                    `${pathParamsDestructure}: ${paramType.replace('?', '')}`,
                );
            } else if (hasExistingBody && method !== 'DELETE') {
                // Destructure path params từ body (không áp dụng cho DELETE)
                const pathParamsDestructure = `{ ${usedPathParams.join(
                    ', ',
                )}, ...restBody }`;
                parameters.push(
                    `${pathParamsDestructure}: ${bodyType.replace(
                        'body: ',
                        '',
                    )}`,
                );
            } else {
                // Path params riêng (áp dụng cho DELETE hoặc khi không có params/body)
                const pathParamsDestructure = `{ ${usedPathParams.join(
                    ', ',
                )} }`;
                parameters.push(
                    `${pathParamsDestructure}: ${this.toPascalCase(
                        operationName,
                    )}${this.toPascalCase(entityName)}PathParamsSchema`,
                );
            }
        }

        // Thêm các parameters khác
        if (hasExistingParams && usedPathParams.length === 0) {
            parameters.push(paramType);
        }
        if (
            hasExistingBody &&
            usedPathParams.length === 0 &&
            method !== 'DELETE'
        ) {
            parameters.push(bodyType);
        }
        if (configType) {
            parameters.push(configType);
        }

        const finalParameters = parameters.join(', ');

        const axiosMethod = method.toLowerCase();
        const axiosParams: string[] = [];

        // Tạo endpoint với path params được replace
        const pathWithParams = `\`${cleanPath}\``;

        if (method === 'GET' || method === 'DELETE') {
            // Sử dụng path params trong URL template với destructuring
            let urlWithPathParams = pathWithParams;
            if (usedPathParams.length > 0) {
                // Sử dụng destructured path params trực tiếp
                urlWithPathParams = `\`${cleanPath.replace(
                    /\$\{(\w+)\}/g,
                    (match, key) => `\${${key}}`,
                )}\``;
            }
            axiosParams.push(urlWithPathParams);

            // Sử dụng params cho query parameters
            if (hasParams || isInfiniteQuery || hasConfig) {
                if (usedPathParams.length > 0 && hasExistingParams) {
                    axiosParams.push('{ params, ...config }');
                } else if (hasParams || isInfiniteQuery) {
                    axiosParams.push('{ params, ...config }');
                } else {
                    axiosParams.push('{ ...config }');
                }
            }
        } else {
            // Sử dụng path params trong URL template với destructuring
            let urlWithPathParams = pathWithParams;
            if (usedPathParams.length > 0) {
                // Sử dụng destructured path params trực tiếp
                urlWithPathParams = `\`${cleanPath.replace(
                    /\$\{(\w+)\}/g,
                    (match, key) => `\${${key}}`,
                )}\``;
            }
            axiosParams.push(urlWithPathParams);

            // Sử dụng restBody cho body parameters (chỉ với POST/PUT/PATCH)
            if (hasBody && !['DELETE'].includes(method)) {
                if (usedPathParams.length > 0 && hasExistingBody) {
                    axiosParams.push('restBody');
                } else {
                    axiosParams.push('body');
                }
            }
            if (hasConfig) axiosParams.push('config');
        }

        let finalResponseType = 'unknown';
        if (responseData) {
            const isArray = Array.isArray(responseData);
            const interfaceName = `${this.toPascalCase(
                operationName,
            )}${this.toPascalCase(entityName)}Response`;
            finalResponseType = isArray ? `${interfaceName}[]` : interfaceName;
        } else if (responseType) {
            finalResponseType = responseType;
        }

        const defaultReturn = finalResponseType.includes('[]')
            ? `{ data: [] as ${finalResponseType}, statusCode: 0, message: '', totalRecord: 0 }`
            : `{ data: {} as ${finalResponseType}, statusCode: 0, message: '' }`;

        if (method === 'GET')
            return `const ${entityName}Api = {
    ${operationName}: async (${finalParameters}) => {
        try {
            const response = await axiosClient.${axiosMethod}<BaseResponse<${finalResponseType}>>(${axiosParams.join(
                ', ',
            )});
            return response.data;
        } catch (error) {
            return ${defaultReturn};
        }
    }
}

export default ${entityName}Api;`;

        return `const ${entityName}Api = {
    ${operationName}: async (${finalParameters}) => {
        await axiosClient.${axiosMethod}<BaseResponse<${finalResponseType}>>(${axiosParams.join(
            ', ',
        )});
    }
}

export default ${entityName}Api;`;
    }

    private static generateTypes(
        options: ConvertOptions,
        curlObj: CurlObject,
        operationName: string,
        entityName: string,
    ): string {
        const {
            responseType,
            responseData,
            sourceTypeCase,
            targetTypeCase,
            isInfiniteQuery,
            pathParams,
        } = options;

        let types = '';

        // Detect path params được sử dụng trong URL
        const usedPathParams: string[] = [];
        if (pathParams) {
            // Detect các pattern path params (:key, {key}, [key])
            Object.keys(pathParams).forEach((key) => {
                const pathParamPattern = new RegExp(
                    `:${key}|\\{${key}\\}|\\[${key}\\]`,
                    'g',
                );
                if (pathParamPattern.test(curlObj.url)) {
                    usedPathParams.push(key);
                }
            });

            // Detect các value trong path params
            Object.entries(pathParams).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const valueStr = String(value);
                    const valuePattern = new RegExp(`/${valueStr}(?=/|$)`, 'g');
                    if (valuePattern.test(curlObj.url)) {
                        if (!usedPathParams.includes(key)) {
                            usedPathParams.push(key);
                        }
                    }
                }
            });
        }

        // Xử lý params cho GET method hoặc infinite query (loại trừ path params đã được replace)
        const isGetMethod = curlObj.method === 'GET';
        const remainingPathParams = pathParams
            ? Object.fromEntries(
                  Object.entries(pathParams).filter(
                      ([key]) => !usedPathParams.includes(key),
                  ),
              )
            : undefined;

        // Chỉ tạo schema riêng cho path params khi không có params/body
        const hasExistingParams =
            curlObj.params ||
            isInfiniteQuery ||
            (remainingPathParams && isGetMethod);
        const hasExistingBody =
            curlObj.body || (remainingPathParams && !isGetMethod);

        if (
            usedPathParams.length > 0 &&
            !hasExistingParams &&
            !hasExistingBody
        ) {
            const pathParamsData: Record<string, string | number> = {};
            usedPathParams.forEach((key) => {
                if (pathParams && pathParams[key] !== undefined) {
                    const value = pathParams[key];
                    if (
                        typeof value === 'string' ||
                        typeof value === 'number'
                    ) {
                        pathParamsData[key] = value;
                    } else {
                        pathParamsData[key] = String(value);
                    }
                }
            });

            const pathParamsSchemaName = `${operationName}${this.toPascalCase(
                entityName,
            )}PathParams`;
            types +=
                this.generateSchema(
                    pathParamsData,
                    pathParamsSchemaName,
                    sourceTypeCase,
                    targetTypeCase,
                    false, // Path params không optional
                    usedPathParams,
                ) + '\n\n';
        }

        if (
            curlObj.params ||
            isInfiniteQuery ||
            (remainingPathParams && isGetMethod)
        ) {
            const schemaName = `${operationName}${this.toPascalCase(
                entityName,
            )}Params`;

            let paramsData: Record<string, string | number> =
                curlObj.params || {};

            // Merge path params vào params data
            if (usedPathParams.length > 0 && isGetMethod) {
                usedPathParams.forEach((key) => {
                    if (pathParams && pathParams[key] !== undefined) {
                        const value = pathParams[key];
                        if (
                            typeof value === 'string' ||
                            typeof value === 'number'
                        ) {
                            paramsData[key] = value;
                        } else {
                            paramsData[key] = String(value);
                        }
                    }
                });
            }

            if (remainingPathParams && isGetMethod) {
                // Convert remainingPathParams to the correct type
                const convertedPathParams: Record<string, string | number> = {};
                Object.entries(remainingPathParams).forEach(([key, value]) => {
                    if (
                        typeof value === 'string' ||
                        typeof value === 'number'
                    ) {
                        convertedPathParams[key] = value;
                    } else {
                        convertedPathParams[key] = String(value);
                    }
                });
                paramsData = { ...paramsData, ...convertedPathParams };
            }
            if (isInfiniteQuery && !curlObj.params && !remainingPathParams) {
                paramsData = { page: 1 };
            } else if (
                isInfiniteQuery &&
                (curlObj.params || remainingPathParams)
            ) {
                paramsData = { ...paramsData, page: 1 };
            }

            types +=
                this.generateSchema(
                    paramsData,
                    schemaName,
                    sourceTypeCase,
                    targetTypeCase,
                    true,
                    usedPathParams,
                ) + '\n\n';
        }

        // Xử lý body cho non-GET methods (loại trừ path params đã được replace)
        if (curlObj.body || (remainingPathParams && !isGetMethod)) {
            const schemaName = `${operationName}${entityName[0].toUpperCase()}${entityName.slice(
                1,
            )}`;

            let bodyData = curlObj.body || {};

            // Merge path params vào body data
            if (usedPathParams.length > 0 && !isGetMethod) {
                usedPathParams.forEach((key) => {
                    if (pathParams && pathParams[key] !== undefined) {
                        bodyData[key] = pathParams[key];
                    }
                });
            }

            if (remainingPathParams && !isGetMethod) {
                bodyData = { ...bodyData, ...remainingPathParams };
            }

            types +=
                this.generateSchema(
                    bodyData,
                    schemaName,
                    sourceTypeCase,
                    targetTypeCase,
                    false,
                    usedPathParams,
                ) + '\n\n';
        }

        if (responseData) {
            const interfaceName = `${this.toPascalCase(
                operationName,
            )}${this.toPascalCase(entityName)}Response`;
            types +=
                this.generateResponseInterface(
                    responseData,
                    interfaceName,
                    sourceTypeCase,
                    targetTypeCase,
                ) + '\n\n';
        } else if (
            responseType &&
            !['unknown', 'string', 'number', 'boolean'].includes(responseType)
        ) {
            const baseType = responseType.replace('[]', '');
            types += `export interface ${baseType} {
              id: string;
              
            }\n\n`;
        }

        return types;
    }

    public static convertCurlToObject(
        curlCommand: string,
        options: ConvertOptions,
    ): ConvertedResult {
        const curlObj = this.parseCurl(curlCommand);

        const extracted = this.extractEntityAndOperationFromUrl(
            curlObj.url,
            curlObj.method,
        );
        const entityName = options.entityName || extracted.entityName;
        const operationName = options.operationName || extracted.operationName;

        const result: ConvertedResult = {
            api: this.generateApi(options, curlObj, entityName, operationName),
        };

        const types = this.generateTypes(
            options,
            curlObj,
            operationName,
            entityName,
        );
        if (types.trim()) {
            result.type = types;
        }

        if (
            curlObj.method === 'GET' ||
            options.isQuery ||
            options.isInfiniteQuery
        ) {
            result.query = this.generateQuery(
                options,
                curlObj,
                entityName,
                operationName,
            );
        } else if (
            ['POST', 'PUT', 'PATCH', 'DELETE'].includes(curlObj.method) ||
            options.isMutation
        ) {
            result.mutation = this.generateMutation(
                options,
                curlObj,
                entityName,
                operationName,
            );
        }

        return result;
    }
}

export function convertCurl(
    curlCommand: string,
    options: ConvertOptions,
): ConvertedResult {
    return CurlConverter.convertCurlToObject(curlCommand, options);
}
