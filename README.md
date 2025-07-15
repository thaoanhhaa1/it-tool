# 🔄 Convert JSON - Công cụ chuyển đổi dành cho lập trình viên

Một ứng dụng web hiện đại được xây dựng với Next.js để hỗ trợ lập trình viên trong việc chuyển đổi và xử lý dữ liệu JSON. Hiện tại hỗ trợ chuyển đổi JSON sang TypeScript interface, và sẽ được mở rộng với nhiều tính năng hữu ích khác.

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

## 🚀 Roadmap phát triển

### Phase 2: JSON Schema & Validation

-   [ ] **JSON Schema Generator** - Tạo JSON Schema từ JSON data
-   [ ] **JSON Schema Validator** - Validate JSON theo schema
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
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── JsonConverterForm.tsx
│   │   └── JsonToTypescriptConverter.tsx
│   └── lib/                 # Utilities và helpers
│       └── utils.ts
├── public/                  # Static assets
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

**Made with ❤️ by Vietnamese Developers for the Global Community**
