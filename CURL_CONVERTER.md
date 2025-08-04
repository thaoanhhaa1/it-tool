# Curl Converter Module

## Tổng quan

Module Curl Converter là một công cụ mạnh mẽ để chuyển đổi curl commands thành các đoạn code TypeScript/JavaScript có thể sử dụng ngay, bao gồm:

-   **Query Service**: Tạo React Query services với Zod validation
-   **Mutation Service**: Tạo mutation services với type safety
-   **API Methods**: Tạo REST API methods với Axios
-   **TypeScript Types**: Tự động tạo interfaces và schemas

## Cấu trúc Module

```
src/
├── app/curl-converter/
│   └── page.tsx                    # Trang chính của curl converter
├── components/
│   ├── CurlConverter.tsx           # Component chính (wrapper)
│   └── CurlConverterForm.tsx       # Form xử lý chuyển đổi
└── utils/
    └── curl-converter.ts           # Logic chuyển đổi chính
```

## Components

### 1. CurlConverter.tsx

Component wrapper chính hiển thị giao diện người dùng và SEO content.

**Tính năng:**

-   Header với mô tả module
-   SEO content section
-   Features showcase
-   Responsive design

**Props:** Không có props (static component)

### 2. CurlConverterForm.tsx

Component form chính xử lý việc chuyển đổi curl commands.

**State Management:**

```typescript
const [curlCommand, setCurlCommand] = useState('');
const [entityName, setEntityName] = useState('user');
const [operationName, setOperationName] = useState('getList');
const [isQuery, setIsQuery] = useState(true);
const [isMutation, setIsMutation] = useState(false);
const [isInfiniteQuery, setIsInfiniteQuery] = useState(false);
const [responseData, setResponseData] = useState('');
const [sourceTypeCase, setSourceTypeCase] = useState<TypeCase | undefined>(
    undefined,
);
const [targetTypeCase, setTargetTypeCase] = useState<TypeCase | undefined>(
    undefined,
);
```

**Tính năng:**

-   Input validation
-   JSON parsing cho response data
-   Type case conversion
-   Infinite query support
-   Code generation với CodeEditor component

## Utils

### curl-converter.ts

Core logic chuyển đổi curl commands thành code.

#### Interfaces

```typescript
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
    sourceTypeCase?: TypeCase;
    targetTypeCase?: TypeCase;
}
```

#### Type Cases

Hỗ trợ 5 định dạng naming convention:

-   `camelCase`: `userName`
-   `PascalCase`: `UserName`
-   `snake_case`: `user_name`
-   `kebab-case`: `user-name`
-   `UPPER_CASE`: `USER_NAME`

#### Methods

##### 1. parseCurl(curlCommand: string): CurlObject

Phân tích curl command và trích xuất thông tin:

-   URL và method
-   Headers
-   Query parameters
-   Request body

**Hỗ trợ formats:**

```bash
# Standard format
curl -X GET "https://api.example.com/users"

# With headers
curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{"name":"John","email":"john@example.com"}'

# Long format
curl --location --request PUT 'https://api.example.com/users/1' \
  --header 'Content-Type: application/json' \
  --data-raw '{"name":"John Doe"}'
```

##### 2. convertCurl(curlCommand: string, options: ConvertOptions): ConvertedResult

Method chính để chuyển đổi curl command thành code.

**Ví dụ sử dụng:**

```typescript
const result = convertCurl(
    'curl -X GET "https://api.example.com/users?id=123" -H "Authorization: Bearer token"',
    {
        entityName: 'user',
        operationName: 'getById',
        isQuery: true,
        responseData: { id: 1, name: 'John', email: 'john@example.com' },
        sourceTypeCase: 'camelCase',
        targetTypeCase: 'PascalCase',
    },
);
```

## Tính năng chính

### 1. Query Service Generation

Tạo React Query services với Zod validation:

```typescript
// Regular Query
export const userGetById = new QueryService({
    name: 'user-getById',
    schema: getByIdParamsSchema,
    fn: ({ signal, payload }) => userApi.getById(payload, { signal }),
});

// Infinite Query
export const userGetListInfinite = new InfiniteQueryService({
    name: 'user-getList-infinite',
    schema: getListParamsSchema,
    fn: ({ signal, pageParam = 1, payload }) =>
        userApi.getList({ ...payload, page: pageParam }, { signal }),
    getNextPageParam: (lastPage, allPages) => {
        if (
            lastPage.Data &&
            Array.isArray(lastPage.Data) &&
            lastPage.Data.length > 0
        ) {
            return allPages.length + 1;
        }
        return undefined;
    },
    initialPageParam: 1,
});
```

### 2. Mutation Service Generation

Tạo mutation services với type safety:

```typescript
export const CreateUser = new MutationService<CreateUserBodySchema>({
    fn: (body) => userApi.create(body),
    onSuccess: () => {
        userList.invalidate();
    },
});
```

### 3. API Method Generation

Tạo REST API methods với Axios:

```typescript
getById: async (params?: GetByIdParamsSchema, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosClient.get<BaseResponse<GetByIdResponse>>(
      `${BASE_PATH}/users/${params.id}`,
      { ...config }
    );
    return response.data;
  } catch (error) {
    return { Data: {} as GetByIdResponse, StatusCode: 0, Message: '' };
  }
},
```

### 4. TypeScript Types Generation

Tự động tạo interfaces và Zod schemas:

```typescript
// Zod Schema
const getByIdParamsSchema = z.object({
    id: z.number(),
});

export type GetByIdParamsSchema = z.infer<typeof getByIdParamsSchema>;

// TypeScript Interface
export interface GetByIdResponse {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}
```

### 5. Type Case Conversion

Chuyển đổi naming convention tự động:

```typescript
// Input: camelCase
{ userName: "John", userEmail: "john@example.com" }

// Output: PascalCase
interface GetByIdResponse {
  UserName: string;
  UserEmail: string;
}
```

## Cách sử dụng

### 1. Basic Usage

```typescript
import { convertCurl } from '../utils/curl-converter';

const curlCommand = 'curl -X GET "https://api.example.com/users?id=123"';

const result = convertCurl(curlCommand, {
    entityName: 'user',
    operationName: 'getById',
    isQuery: true,
});

console.log(result.query); // Query service code
console.log(result.api); // API method code
console.log(result.type); // TypeScript types
```

### 2. Advanced Usage với Response Data

```typescript
const result = convertCurl(curlCommand, {
    entityName: 'user',
    operationName: 'getList',
    isQuery: true,
    isInfiniteQuery: true,
    responseData: {
        Data: [{ id: 1, name: 'John', email: 'john@example.com' }],
        StatusCode: 200,
        Message: 'Success',
        TotalRecord: 1,
    },
    sourceTypeCase: 'camelCase',
    targetTypeCase: 'PascalCase',
});
```

### 3. Form Usage

```tsx
import CurlConverterForm from './components/CurlConverterForm';

export default function CurlConverterPage() {
    return (
        <main>
            <CurlConverterForm />
        </main>
    );
}
```

## Error Handling

Module xử lý các lỗi sau:

1. **Invalid JSON**: Response data không đúng định dạng JSON
2. **Invalid Curl**: Curl command không đúng format
3. **Missing Required Fields**: Thiếu thông tin bắt buộc
4. **Type Case Conversion**: Lỗi khi chuyển đổi naming convention

## Dependencies

```json
{
    "dependencies": {
        "react": "^18.0.0",
        "typescript": "^5.0.0",
        "zod": "^3.0.0"
    }
}
```

## Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## Performance

-   **Parsing**: O(n) với n là độ dài curl command
-   **Type Generation**: O(m) với m là số fields trong response data
-   **Memory Usage**: Minimal, chỉ lưu trữ kết quả cuối cùng

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes với conventional commits
4. Push và tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.

## Changelog

### v1.0.0

-   ✅ Basic curl parsing
-   ✅ Query/Mutation service generation
-   ✅ API method generation
-   ✅ TypeScript types generation

### v1.1.0

-   ✅ Infinite query support
-   ✅ Type case conversion
-   ✅ Response data parsing
-   ✅ Enhanced error handling

### v1.2.0

-   ✅ Multi-line curl support
-   ✅ Advanced URL parsing
-   ✅ Auto entity/operation extraction
-   ✅ Improved UI/UX
