# Hướng dẫn MongoDB Collections cho Code Library

## Tổng quan

Dự án Code Library sử dụng MongoDB với 4 collections chính để lưu trữ data:

1. **CodeExample** - Lưu trữ các code examples (components và functions)
2. **User** - Quản lý thông tin người dùng
3. **Category** - Phân loại code examples
4. **Comment** - Bình luận và đánh giá

## Cấu trúc Collections

### 1. CodeExample Collection

```typescript
interface ICodeExample {
    name: string; // Tên code example
    description: string; // Mô tả chi tiết
    type: 'component' | 'function'; // Loại: component hoặc function
    library: string; // Thư viện sử dụng (React, MUI, etc.)
    tags: string[]; // Tags để search
    code: string; // Source code
    author: ObjectId; // Tham chiếu đến User
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string; // Slug của category
    dependencies: string[]; // Các dependency cần thiết
    likes: number; // Số lượt like
    views: number; // Số lượt xem
    downloads: number; // Số lượt download
    isPublic: boolean; // Có công khai không
    createdAt: Date;
    updatedAt: Date;
}
```

### 2. User Collection

```typescript
interface IUser {
    username: string; // Tên đăng nhập (unique)
    email: string; // Email (unique)
    fullName: string; // Họ tên đầy đủ
    avatar?: string; // URL avatar
    bio?: string; // Tiểu sử
    github?: string; // GitHub username
    linkedin?: string; // LinkedIn profile
    role: 'user' | 'admin' | 'moderator';
    reputation: number; // Điểm uy tín
    followers: ObjectId[]; // Danh sách người theo dõi
    following: ObjectId[]; // Danh sách đang theo dõi
    favoriteCodeExamples: ObjectId[]; // Code examples đã like
    createdAt: Date;
    updatedAt: Date;
}
```

### 3. Category Collection

```typescript
interface ICategory {
    name: string; // Tên category
    slug: string; // Slug để URL (unique)
    description: string; // Mô tả category
    icon?: string; // Icon emoji
    color?: string; // Màu sắc (hex)
    parentCategory?: ObjectId; // Category cha (cho subcategory)
    codeExampleCount: number; // Số lượng code examples
    sortOrder: number; // Thứ tự sắp xếp
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

### 4. Comment Collection

```typescript
interface IComment {
    content: string; // Nội dung comment
    author: ObjectId; // Tác giả comment
    codeExample: ObjectId; // Code example được comment
    parentComment?: ObjectId; // Comment cha (cho reply)
    rating?: number; // Đánh giá 1-5 sao
    likes: ObjectId[]; // Users đã like comment
    isApproved: boolean; // Đã được duyệt chưa
    createdAt: Date;
    updatedAt: Date;
}
```

## Cài đặt và Setup

### 1. Cài đặt Dependencies

```bash
npm install mongodb mongoose @types/mongodb
```

### 2. Cấu hình Environment Variables

Tạo file `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/code_library
# Hoặc MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code_library

DB_NAME=code_library
NODE_ENV=development
```

### 3. Khởi tạo Database với Seed Data

```bash
# Chạy seed script để tạo dữ liệu mẫu
node scripts/seed.js

# Hoặc chạy trực tiếp
npm run seed
```

## API Endpoints

### Code Examples

```bash
# Lấy danh sách code examples
GET /api/code-examples?search=button&type=component&library=React&page=1&limit=20

# Tạo code example mới
POST /api/code-examples
{
  "name": "Custom Button",
  "description": "Reusable button component",
  "type": "component",
  "library": "React",
  "tags": ["button", "ui"],
  "code": "...",
  "authorId": "user_id",
  "difficulty": "beginner",
  "category": "ui-components"
}

# Lấy chi tiết code example
GET /api/code-examples/[id]

# Cập nhật code example
PUT /api/code-examples/[id]

# Xóa code example
DELETE /api/code-examples/[id]?userId=user_id
```

### Categories

```bash
# Lấy danh sách categories
GET /api/categories

# Lấy categories với subcategories
GET /api/categories?includeSubcategories=true

# Tạo category mới
POST /api/categories
{
  "name": "UI Components",
  "description": "User interface components",
  "icon": "🎨",
  "color": "#3B82F6"
}
```

## Queries thường dùng

### 1. Tìm kiếm Code Examples

```javascript
// Tìm theo text
const results = await CodeExample.find({
    $text: { $search: 'button react' },
    isPublic: true,
}).populate('author', 'username avatar');

// Tìm theo tags
const results = await CodeExample.find({
    tags: { $in: ['react', 'typescript'] },
    isPublic: true,
});

// Tìm theo library và type
const results = await CodeExample.find({
    library: 'React',
    type: 'component',
    isPublic: true,
});
```

### 2. Thống kê

```javascript
// Đếm số code examples theo library
const stats = await CodeExample.aggregate([
    { $match: { isPublic: true } },
    { $group: { _id: '$library', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
]);

// Top contributors
const topUsers = await User.find({ isActive: true })
    .sort({ reputation: -1 })
    .limit(10);
```

### 3. Quản lý Categories

```javascript
// Lấy categories với số lượng code examples
const categories = await Category.find({ isActive: true }).sort({
    codeExampleCount: -1,
});

// Cập nhật count khi thêm code example
await Category.findOneAndUpdate(
    { slug: 'ui-components' },
    { $inc: { codeExampleCount: 1 } },
);
```

## Indexes được tạo

Để tối ưu performance, các indexes sau đã được tạo:

### CodeExample

-   `{ name: 'text', description: 'text', tags: 'text' }` - Full text search
-   `{ type: 1, library: 1 }` - Filter theo type và library
-   `{ author: 1, createdAt: -1 }` - Code examples của user
-   `{ likes: -1, views: -1 }` - Popular content

### User

-   `{ username: 1 }` - Unique constraint
-   `{ email: 1 }` - Unique constraint
-   `{ reputation: -1 }` - Top users

### Category

-   `{ slug: 1 }` - Unique constraint
-   `{ parentCategory: 1 }` - Subcategories
-   `{ codeExampleCount: -1 }` - Popular categories

### Comment

-   `{ codeExample: 1, createdAt: -1 }` - Comments của code example
-   `{ author: 1, createdAt: -1 }` - Comments của user

## Tips sử dụng

1. **Always populate author**: Khi lấy code examples, luôn populate thông tin author
2. **Use lean()**: Với read-only operations, sử dụng `.lean()` để tăng performance
3. **Pagination**: Luôn implement pagination cho danh sách dài
4. **Text Search**: Sử dụng MongoDB text search thay vì regex cho tìm kiếm
5. **Aggregation**: Sử dụng aggregation pipeline cho thống kê phức tạp

## Scripts hữu ích

```bash
# Backup database
mongodump --uri="mongodb://localhost:27017/code_library" --out=./backup

# Restore database
mongorestore --uri="mongodb://localhost:27017/code_library" ./backup/code_library

# Export collection to JSON
mongoexport --uri="mongodb://localhost:27017/code_library" --collection=codeexamples --out=codeexamples.json

# Create indexes manually
mongo code_library --eval "db.codeexamples.createIndex({name:'text',description:'text',tags:'text'})"
```

## Troubleshooting

### Connection Issues

-   Kiểm tra MONGODB_URI trong .env.local
-   Đảm bảo MongoDB service đang chạy
-   Kiểm tra network connectivity với MongoDB Atlas

### Performance Issues

-   Sử dụng indexes phù hợp
-   Implement pagination
-   Sử dụng .lean() cho read operations
-   Cache frequently accessed data

### Data Consistency

-   Sử dụng transactions cho multi-document operations
-   Validate data ở application level
-   Set up proper constraints và validations
