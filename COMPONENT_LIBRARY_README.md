# Component Library - Thư viện Component React

## 🎯 Giới thiệu

Thư viện component React hiện đại với các component được xây dựng bằng MUI, Ant Design, Chakra UI và nhiều thư viện UI phổ biến khác. Tất cả component đều có SSR (Server-Side Rendering) và SEO được tối ưu hóa.

## ✨ Tính năng chính

-   🎨 **Component đa dạng**: Buttons, Forms, Layout, Navigation, Data Display
-   🏗️ **Multi-library support**: MUI, Ant Design, Chakra UI, Custom components
-   🔍 **Tìm kiếm nâng cao**: Filter theo category, library, complexity, tags
-   📱 **Responsive design**: Tối ưu cho mọi thiết bị
-   🚀 **SSR & SEO**: Server-side rendering và SEO optimized
-   📋 **Copy-paste ready**: Code có thể copy và sử dụng ngay
-   🎭 **Live preview**: Xem component trực tiếp
-   📚 **Documentation**: Hướng dẫn chi tiết cho từng component

## 🛠️ Cài đặt

### Dependencies cơ bản

```bash
npm install react react-dom next typescript tailwindcss
```

### Optional dependencies (tùy component)

```bash
# Material-UI
npm install @mui/material @emotion/react @emotion/styled

# Ant Design
npm install antd

# Chakra UI
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Framer Motion (cho animations)
npm install framer-motion
```

## 🚀 Sử dụng

### 1. Truy cập Component Library

Mở browser và đi đến `/component-library`

### 2. Duyệt và tìm kiếm

-   Sử dụng search box để tìm component
-   Filter theo danh mục, thư viện, độ khó
-   Click vào tags để filter nhanh

### 3. Xem chi tiết component

-   Click "Chi tiết" để xem trang chi tiết
-   Xem live preview
-   Copy source code
-   Đọc documentation

### 4. Sử dụng component

1. Copy code từ component detail page
2. Cài đặt dependencies cần thiết
3. Paste vào project của bạn
4. Tùy chỉnh styling theo nhu cầu

## 📁 Cấu trúc Component

Mỗi component trong library có:

```typescript
interface ComponentExample {
    id: string; // Unique identifier
    name: string; // Tên hiển thị
    description: string; // Mô tả ngắn gọn
    category: string; // Danh mục (Buttons, Forms, etc.)
    library: string; // Thư viện UI (MUI, Ant Design, etc.)
    complexity: string; // Độ khó (Beginner, Intermediate, Advanced)
    tags: string[]; // Tags để search
    code: string; // Source code
    previewComponent: Component; // Live preview component
    author: string; // Tác giả
    version: string; // Version
    lastUpdated: string; // Ngày cập nhật
    downloads: number; // Số lượt download
    relatedComponents: string[]; // Component liên quan
    documentation: string; // Documentation chi tiết
}
```

## 🎨 Categories

### Buttons

-   MUI Button Variants
-   Ant Design Buttons
-   Custom Animated Buttons
-   Loading Buttons

### Forms

-   Registration Forms
-   Login Forms
-   Survey Forms
-   Multi-step Forms

### Layout

-   Cards
-   Modals
-   Sidebars
-   Headers

### Navigation

-   Breadcrumbs
-   Tabs
-   Pagination
-   Menus

### Data Display

-   Tables
-   Lists
-   Charts
-   Calendars

## 🔧 Customization

### Styling

Hầu hết component sử dụng Tailwind CSS hoặc styled-components, bạn có thể:

-   Thay đổi colors trong theme
-   Tùy chỉnh spacing và typography
-   Override CSS classes
-   Sử dụng CSS variables

### Theme Integration

```javascript
// Ví dụ với MUI
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

// Wrap app với ThemeProvider
<ThemeProvider theme={theme}>
    <YourComponent />
</ThemeProvider>;
```

## 📈 SEO Features

Component Library được tối ưu SEO với:

-   **Server-side rendering (SSR)**
-   **Meta tags tối ưu** cho từng trang
-   **Structured data** với JSON-LD
-   **Sitemap** tự động
-   **Open Graph** tags
-   **Twitter Cards**
-   **Canonical URLs**
-   **robots.txt** được cấu hình

## 🔍 Advanced Search

### URL Parameters

Component library hỗ trợ search thông qua URL parameters:

```
/component-library?q=button&category=Buttons&library=MUI&complexity=Beginner&tags=animation,responsive
```

### Search Filters

-   `q`: Search query
-   `category`: Component category
-   `library`: UI library
-   `complexity`: Difficulty level
-   `tags`: Comma-separated tags

## 📝 Đóng góp Component

Để thêm component mới:

1. Tạo component data trong `componentExamples` array
2. Bao gồm đầy đủ thông tin metadata
3. Viết documentation chi tiết
4. Test trên nhiều devices
5. Đảm bảo accessibility

## 🌟 Best Practices

### Component Development

-   ✅ TypeScript support
-   ✅ Responsive design
-   ✅ Accessibility (a11y)
-   ✅ Error boundaries
-   ✅ Loading states
-   ✅ Dark mode support

### Performance

-   ✅ Code splitting
-   ✅ Lazy loading
-   ✅ Image optimization
-   ✅ Bundle analysis
-   ✅ Caching strategies

### SEO

-   ✅ Server-side rendering
-   ✅ Meta tags optimization
-   ✅ Structured data
-   ✅ Fast loading times
-   ✅ Mobile-first design

## 🚀 Deployment

Component library được deploy cùng với main application. Để deploy:

```bash
npm run build
npm run start
```

## 📞 Support

Nếu bạn gặp vấn đề hoặc có suggestions:

1. Check documentation trước
2. Search trong existing components
3. Open issue trên GitHub
4. Contact development team

## 📊 Analytics

Component library tracking:

-   Page views cho từng component
-   Download/copy statistics
-   Popular search terms
-   User engagement metrics

---

Made with ❤️ by Component Library Team
