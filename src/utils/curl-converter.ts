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
    entityName?: string; // Make optional
    operationName?: string; // Make optional
    isQuery?: boolean;
    isMutation?: boolean;
    isInfiniteQuery?: boolean;
    responseType?: string;
    requestType?: string;
    hasParams?: boolean;
    hasBody?: boolean;
    responseData?: Record<string, unknown> | Record<string, unknown>[];
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

        // First, convert to a normalized format (words array)
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

        // Convert to target case
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
        // Normalize multiline curl command
        const normalizedCurl = curlCommand
            .replace(/\\\n/g, ' ')
            .replace(/\\\s+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Cập nhật regex để hỗ trợ nhiều format URL khác nhau
        const urlMatch =
            // Format: curl --location --request PUT 'https://...'
            normalizedCurl.match(
                /curl\s+(?:--location\s+)?(?:--request\s+\w+\s+)?['"]([^'"]+)['"]/,
            ) ||
            // Format: curl 'https://...' -X 'PUT'
            normalizedCurl.match(/curl\s+['"]([^'"]+)['"]/) ||
            // Format: curl --location 'https://...'
            normalizedCurl.match(/curl\s+(?:--location\s+)?['"]([^'"]+)['"]/) ||
            // Format: curl -X PUT 'https://...'
            normalizedCurl.match(/curl\s+(?:-X\s+\w+\s+)?['"]?([^'"?\s]+)/) ||
            // Fallback format
            normalizedCurl.match(
                /curl\s+(?:--location\s+)?(?:-X\s+\w+\s+)?['"]?([^'"?\s]+)/,
            );

        // Cập nhật regex để hỗ trợ cả --request và -X
        const methodMatch =
            normalizedCurl.match(/--request\s+(\w+)/) ||
            normalizedCurl.match(/-X\s+['"]?(\w+)['"]?/);

        // Cập nhật regex để hỗ trợ cả --header và -H
        const headerMatches = normalizedCurl.matchAll(
            /(?:--header|-H)\s+['"]([^'"]+)['"]/g,
        );

        // Cập nhật regex để hỗ trợ cả --data, --data-raw và -d
        const dataMatch =
            normalizedCurl.match(/(?:--data-raw|--data|-d)\s+'([^']+)'/) ||
            normalizedCurl.match(/(?:--data-raw|--data|-d)\s+"([^"]+)"/);

        const paramMatch = normalizedCurl.match(/\?([^'"?\s]+)/);

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

        // Cập nhật logic xác định method - nếu có data thì mặc định POST
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

        return result;
    }

    private static inferZodType(value: unknown, key?: string): ZodType {
        if (typeof value === 'string') {
            return key?.toLowerCase().includes('date') ? 'date' : 'string';
        }
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
        return 'unknown';
    }

    private static analyzeObjectStructure(
        obj: Record<string, unknown>,
        sourceTypeCase?: TypeCase,
        targetTypeCase?: TypeCase,
    ): SchemaField[] {
        return Object.entries(obj).map(([key, value]) => {
            // Convert field name if type case conversion is specified
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

    private static generateZodSchema(fields: SchemaField[]): string {
        const generateFieldType = (field: SchemaField): string => {
            let zodType: string;

            switch (field.type) {
                case 'string':
                    zodType = 'z.string()';
                    break;
                case 'number':
                    zodType = 'z.number()';
                    break;
                case 'boolean':
                    zodType = 'z.boolean()';
                    break;
                case 'date':
                    zodType = 'z.string()';
                    break;
                case 'array':
                    if (field.arrayType === 'object' && field.objectFields) {
                        const objectSchema = this.generateZodSchema(
                            field.objectFields,
                        );
                        zodType = `z.array(${objectSchema})`;
                    } else {
                        const arrayItemType = field.arrayType || 'unknown';
                        const itemZodType =
                            arrayItemType === 'unknown'
                                ? 'z.unknown()'
                                : arrayItemType === 'string'
                                ? 'z.string()'
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
                        zodType = this.generateZodSchema(field.objectFields);
                    } else {
                        zodType = 'z.record(z.unknown())';
                    }
                    break;
                default:
                    zodType = 'z.unknown()';
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
    ): string {
        // Không cần convert object keys ở đây vì sẽ convert trong analyzeObjectStructure
        const fields = this.analyzeObjectStructure(
            data as Record<string, unknown>,
            sourceTypeCase,
            targetTypeCase,
        );
        const zodSchema = this.generateZodSchema(fields);

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

        // Không convert keys ở đây vì sẽ convert trong generateInterfaceField

        if (!dataToAnalyze || typeof dataToAnalyze !== 'object') {
            return `export interface ${interfaceName} {
      // Unable to generate interface from provided response data
    }`;
        }

        const generateInterfaceField = (
            key: string,
            value: unknown,
        ): string => {
            // Apply type case conversion to field name
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
                    // Apply type case conversion to nested interface name
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
                // Apply type case conversion to nested interface name
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
                    // Apply type case conversion to nested interface name
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
                    // Apply type case conversion to nested interface name
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

            // Remove common prefixes like 'api', 'v1', 'v2', etc.
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
                    // Use the second-to-last segment as entity name
                    entityName =
                        filteredSegments.length > 1
                            ? filteredSegments[filteredSegments.length - 2]
                            : filteredSegments[0];

                    // Use the last segment as operation name
                    operationName =
                        this.extractOperationFromSegment(lastSegment);
                } else {
                    // Use the last segment as entity name
                    entityName = lastSegment;
                    operationName = this.inferOperationName(
                        method,
                        filteredSegments,
                        urlObj.search,
                    );
                }
            }

            // Convert to camelCase
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
        // Convert segments like 'get-list-form-request' to camelCase
        return this.toCamelCase(segment);
    }

    private static toCamelCase(str: string): string {
        // Handle different separators: dash, underscore, space
        return str
            .replace(/[-_\s]+(.)?/g, (_, char) =>
                char ? char.toUpperCase() : '',
            )
            .replace(/^[A-Z]/, (char) => char.toLowerCase()); // Ensure first letter is lowercase
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
        // Remove special characters first, then convert to camelCase
        const cleaned = name.replace(/[^a-zA-Z0-9\-_\s]/g, '');
        return this.toCamelCase(cleaned);
    }

    private static generateQuery(
        options: ConvertOptions,
        curlObj: CurlObject,
        entityName: string,
        operationName: string,
    ): string {
        const { isInfiniteQuery } = options;
        const hasSchema = Boolean(curlObj.params || curlObj.body);

        // Use camelCase for schema name
        const schemaName = `${operationName}ParamsSchema`;

        // Use camelCase for service name
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
            hasSchema ? `\n  schema: ${schemaName},` : ''
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
        const hasBody = Boolean(curlObj.body);

        // Use camelCase for schema name
        const schemaName = hasBody ? `${operationName}BodySchema` : 'void';

        // Use camelCase for service name
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
        const { responseType, responseData, isInfiniteQuery } = options;
        const { method, url } = curlObj;

        // Parse URL và loại bỏ query parameters
        const urlObj = new URL(url);
        const cleanPath = urlObj.pathname; // Chỉ lấy path, không có query params
        const urlParts = cleanPath.split('/');
        const endpoint = urlParts.slice(3).join('/'); // Loại bỏ protocol và domain

        const hasParams = Boolean(curlObj.params);
        const hasBody = Boolean(curlObj.body);
        const hasConfig = true;

        // Use camelCase for parameter types
        let paramType = '';
        if (hasParams || isInfiniteQuery) {
            const baseParamType = hasParams
                ? `${this.toPascalCase(operationName)}ParamsSchema`
                : '{}';

            if (isInfiniteQuery) {
                paramType = `params?: ${baseParamType} & { page?: number }`;
            } else {
                paramType = hasParams ? `params?: ${baseParamType}` : '';
            }
        }

        const bodyType = hasBody
            ? `body: ${this.toPascalCase(operationName)}BodySchema`
            : '';
        const configType = hasConfig ? `config?: AxiosRequestConfig` : '';

        const parameters = [paramType, bodyType, configType]
            .filter(Boolean)
            .join(', ');

        const axiosMethod = method.toLowerCase();
        const axiosParams: string[] = [];

        if (method === 'GET' || method === 'DELETE') {
            // Chỉ sử dụng clean endpoint không có query params
            axiosParams.push(`\`\${BASE_PATH}/${endpoint}\``);
            if (hasParams || isInfiniteQuery || hasConfig) {
                axiosParams.push(
                    `{ ${
                        hasParams || isInfiniteQuery ? 'params, ' : ''
                    }...config }`,
                );
            }
        } else {
            // Đối với POST, PUT, PATCH cũng sử dụng clean endpoint
            axiosParams.push(`\`\${BASE_PATH}/${endpoint}\``);
            if (hasBody) axiosParams.push('body');
            if (hasConfig) axiosParams.push('config');
        }

        let finalResponseType = 'unknown';
        if (responseData) {
            const isArray = Array.isArray(responseData);
            const interfaceName = `${this.toPascalCase(operationName)}Response`;
            finalResponseType = isArray ? `${interfaceName}[]` : interfaceName;
        } else if (responseType) {
            finalResponseType = responseType;
        }

        const defaultReturn = finalResponseType.includes('[]')
            ? `{ Data: [] as ${finalResponseType}, StatusCode: 0, Message: '', TotalRecord: 0 }`
            : `{ Data: {} as ${finalResponseType}, StatusCode: 0, Message: '' }`;

        return `  ${operationName}: async (${parameters}) => {
                try {
                  const response = await axiosClient.${axiosMethod}<BaseResponse<${finalResponseType}>>(${axiosParams.join(
            ', ',
        )});
                  return response.data;
                } catch (error) {
                  return ${defaultReturn};
                }
              },`;
    }

    private static generateTypes(
        options: ConvertOptions,
        curlObj: CurlObject,
        operationName: string,
    ): string {
        const {
            responseType,
            responseData,
            sourceTypeCase,
            targetTypeCase,
            isInfiniteQuery,
        } = options;

        let types = '';

        // Generate params schema with camelCase naming
        if (curlObj.params || isInfiniteQuery) {
            const schemaName = `${operationName}Params`; // camelCase

            let paramsData = curlObj.params || {};
            if (isInfiniteQuery && !curlObj.params) {
                paramsData = { page: 1 };
            } else if (isInfiniteQuery && curlObj.params) {
                paramsData = { ...curlObj.params, page: 1 };
            }

            types +=
                this.generateSchema(
                    paramsData,
                    schemaName,
                    sourceTypeCase,
                    targetTypeCase,
                ) + '\n\n';
        }

        // Generate body schema with camelCase naming
        if (curlObj.body) {
            const schemaName = `${operationName}Body`; // camelCase
            types +=
                this.generateSchema(
                    curlObj.body,
                    schemaName,
                    sourceTypeCase,
                    targetTypeCase,
                ) + '\n\n';
        }

        // Generate response interface with PascalCase naming
        if (responseData) {
            const interfaceName = `${this.toPascalCase(operationName)}Response`;
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
              // Define your ${baseType.toLowerCase()} properties here
            }\n\n`;
        }

        return types;
    }

    public static convertCurlToObject(
        curlCommand: string,
        options: ConvertOptions,
    ): ConvertedResult {
        const curlObj = this.parseCurl(curlCommand);

        // Extract entity and operation names from URL if not provided
        const extracted = this.extractEntityAndOperationFromUrl(
            curlObj.url,
            curlObj.method,
        );
        const entityName = options.entityName || extracted.entityName;
        const operationName = options.operationName || extracted.operationName;

        const result: ConvertedResult = {
            api: this.generateApi(options, curlObj, entityName, operationName),
        };

        const types = this.generateTypes(options, curlObj, operationName);
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
