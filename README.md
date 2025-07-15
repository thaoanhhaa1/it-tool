# 🛠️ It Tools - Bộ công cụ tiện ích dành cho Developers

Một ứng dụng web hiện đại được xây dựng với Next.js để hỗ trợ lập trình viên trong việc chuyển đổi và xử lý dữ liệu. Hiện tại hỗ trợ chuyển đổi JSON sang TypeScript interface, TypeScript interface sang Zod schema, và HTML sang JSX, và sẽ được mở rộng với nhiều tính năng hữu ích khác.

![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC)

## ✨ Tính năng hiện tại

### 🔧 JSON to TypeScript Interface Converter

-   **Chuyển đổi JSON phức tạp** sang TypeScript interface tự động
-   **Hỗ trợ nested objects và arrays** với độ sâu không giới hạn
-   **CamelCase formatting** tự động cho property names
-   **Copy to clipboard** một click duy nhất
-   **Dark/Light mode** hỗ trợ
-   **Responsive design** hoạt động mượt mà trên mọi thiết bị
-   **Real-time preview** hiển thị kết quả ngay lập tức

### ✅ TypeScript Interface to Zod Schema Converter

-   **Chuyển đổi TypeScript interface** sang Zod schema tự động
-   **Hỗ trợ optional fields** (`name?: string`)
-   **Hỗ trợ arrays và nested objects** với validation chính xác
-   **Union types support** (`string | number`)
-   **Type inference** tự động generate type từ schema
-   **Export options** linh hoạt (export const, const)
-   **Runtime validation** với Zod schema

### 🎨 HTML to JSX Converter

-   **Chuyển đổi HTML sang JSX** tự động và chính xác
-   **Attribute conversion** (class → className, for → htmlFor, onclick → onClick)
-   **Style object conversion** (style="color: red" → style={{color: 'red'}})
-   **Self-closing tags** automatic formatting (`<img>` → `<img />`)
-   **Event handlers** conversion (onclick → onClick, onchange → onChange)
-   **SVG attributes** support (stroke-width → strokeWidth)
-   **Comments conversion** (<!-- --> → {/\* \*/})
-   **Example template** có sẵn để test nhanh

## 🚀 Roadmap phát triển

### Phase 2: Zod & Validation Enhancement

-   [ ] **Zod Schema Validator** - Validate JSON data với Zod schema
-   [ ] **Enhanced Zod Support** - Custom validators, transforms, refinements
-   [ ] **JSON Schema Generator** - Tạo JSON Schema từ JSON data
-   [ ] **Schema to TypeScript** - Convert JSON Schema sang TypeScript types

### Phase 3: Multi-language Support

-   [ ] **JSON to Python Dataclasses** - Convert sang Python dataclasses/Pydantic models
-   [ ] **JSON to Java Classes** - Generate Java POJOs
-   [ ] **JSON to C# Classes** - Generate C# classes với attributes
-   [ ] **JSON to Go Structs** - Generate Go struct definitions

### Phase 4: API & Integration Tools

-   [ ] **API Response Formatter** - Format và beautify API responses
-   [ ] **Mock Data Generator** - Generate mock data từ TypeScript interfaces
-   [ ] **OpenAPI/Swagger Integration** - Convert JSON examples sang OpenAPI specs
-   [ ] **GraphQL Schema Generator** - Generate GraphQL types từ JSON

### Phase 5: Advanced Features

-   [ ] **Batch Processing** - Xử lý multiple JSON files cùng lúc
-   [ ] **CLI Tool** - Command line interface cho automation
-   [ ] **VS Code Extension** - Plugin tích hợp với VS Code
-   [ ] **API Endpoint** - REST API cho integration với other tools

### Phase 6: Developer Experience

-   [ ] **Code Templates** - Pre-built templates cho common patterns
-   [ ] **Export Options** - Export sang multiple formats (PDF, Word, etc.)
-   [ ] **History & Bookmarks** - Lưu và quản lý conversion history
-   [ ] **Team Collaboration** - Share và collaborate on conversions

## 🛠️ Công nghệ sử dụng

-   **Framework**: Next.js 15 với App Router
-   **Frontend**: React 19, TypeScript 5
-   **Styling**: Tailwind CSS 4, Radix UI components
-   **Validation**: Zod schema validation
-   **Build Tool**: Turbopack cho dev performance
-   **Code Quality**: ESLint, TypeScript strict mode

## 📦 Cài đặt và chạy

### Prerequisites

-   Node.js 18.17 hoặc mới hơn
-   npm hoặc yarn hoặc pnpm

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🎯 Hướng dẫn sử dụng

### JSON to TypeScript Converter

1. Truy cập [http://localhost:3000/json-to-typescript](http://localhost:3000/json-to-typescript)
2. Nhập JSON data vào ô input bên trái
3. Đặt tên interface và chọn các tùy chọn formatting
4. Click "Chuyển đổi" để generate TypeScript interface
5. Copy kết quả từ ô output bên phải

### Interface to Zod Schema Converter

1. Truy cập [http://localhost:3000/interface-to-zod](http://localhost:3000/interface-to-zod)
2. Nhập TypeScript interface vào ô input
3. Chọn export options (export const, const)
4. Click "Chuyển đổi sang Zod" để generate schema
5. Copy kết quả bao gồm cả import statement và type inference

**Ví dụ Input/Output:**

**Input Interface:**

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
    tags: string[];
}
```

**Output Zod Schema:**

```typescript
import { z } from 'zod';

export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().optional(),
    tags: z.array(z.string()),
});

// Type inference từ schema
type User = z.infer<typeof userSchema>;
```

### HTML to JSX Converter

1. Truy cập [http://localhost:3000/html-to-jsx](http://localhost:3000/html-to-jsx)
2. Nhập HTML code vào ô input bên trái hoặc click "Tải ví dụ" để load sample
3. Click "Chuyển đổi HTML sang JSX" để generate JSX code
4. Copy kết quả từ ô output bên phải

**Ví dụ Input/Output:**

**Input HTML:**

```html
<div class="container">
    <h1 style="color: blue; font-size: 24px;">Hello World</h1>
    <button onclick="handleClick()">Click me</button>
    <img src="image.jpg" alt="Example" />
    <!-- This is a comment -->
</div>
```

**Output JSX:**

```jsx
<div className='container'>
    <h1 style={{ color: 'blue', fontSize: '24px' }}>Hello World</h1>
    <button onClick='handleClick()'>Click me</button>
    <img src='image.jpg' alt='Example' />
    {/* This is a comment */}
</div>
```

### Build for production

```bash
npm run build
npm run start
```

## 📁 Cấu trúc dự án

```
convert-json/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── html-to-jsx/     # HTML to JSX page
│   │   │   └── page.tsx     # HTML to JSX converter
│   │   ├── interface-to-zod/# Interface to Zod page
│   │   │   └── page.tsx     # Interface to Zod converter
│   │   ├── json-to-typescript/ # JSON to TypeScript page
│   │   │   └── page.tsx     # JSON to TypeScript converter
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page với tools grid
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navigation.tsx   # Navigation với logo và menu
│   │   ├── NavigationClient.tsx # Client-side navigation
│   │   ├── HtmlToJsxForm.tsx
│   │   ├── HtmlToJsxConverter.tsx
│   │   ├── JsonConverterForm.tsx
│   │   ├── JsonToTypescriptConverter.tsx
│   │   ├── InterfaceToZodForm.tsx
│   │   └── InterfaceToZodConverter.tsx
│   └── lib/                 # Utilities và helpers
│       └── utils.ts
├── public/                  # Static assets
│   ├── coding_192.png       # Logo file
│   └── ...                  # Other assets
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Dự án này được thiết kế để trở thành một bộ công cụ toàn diện cho lập trình viên.

### Cách đóng góp:

1. Fork repository này
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Guidelines:

-   **Code Style**: Tuân theo ESLint config có sẵn
-   **TypeScript**: Sử dụng strict typing
-   **Components**: Follow React best practices
-   **Testing**: Thêm tests cho features mới (sẽ setup trong tương lai)
-   **Documentation**: Update README khi thêm features mới

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🌟 Roadmap Contributions

Bạn muốn implement một feature trong roadmap? Tuyệt vời! Hãy:

1. **Check Issues** - Xem có ai đang làm feature đó chưa
2. **Create Issue** - Tạo issue mô tả feature bạn muốn làm
3. **Discussion** - Thảo luận approach và implementation details
4. **Start Coding** - Begin development sau khi có consensus

## 📞 Liên hệ

-   **Issues**: [GitHub Issues](../../issues)
-   **Discussions**: [GitHub Discussions](../../discussions)

---

**✨ It Tools - Nơi developers tìm thấy những công cụ hữu ích nhất**

**Made with ❤️ by Vietnamese Developers for the Global Community**
