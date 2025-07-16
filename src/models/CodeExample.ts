import mongoose from 'mongoose';

// Interface cho TypeScript
export interface ICodeExample extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    type: 'component' | 'function';
    library:
        | 'MUI'
        | 'Ant Design'
        | 'Chakra UI'
        | 'Custom'
        | 'Headless UI'
        | 'JavaScript'
        | 'TypeScript'
        | 'React'
        | 'Utility';
    tags: string[];
    code: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    views: number;
    downloads: number;
    isPublic: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    version: string;
    dependencies: string[];
}

// Schema định nghĩa cấu trúc dữ liệu
const CodeExampleSchema = new mongoose.Schema<ICodeExample>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        type: {
            type: String,
            required: true,
            enum: ['component', 'function'],
            index: true,
        },
        library: {
            type: String,
            required: true,
            enum: [
                'MUI',
                'Ant Design',
                'Chakra UI',
                'Custom',
                'Headless UI',
                'JavaScript',
                'TypeScript',
                'React',
                'Utility',
            ],
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
        code: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        likes: {
            type: Number,
            default: 0,
            min: 0,
        },
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        downloads: {
            type: Number,
            default: 0,
            min: 0,
        },
        isPublic: {
            type: Boolean,
            default: true,
            index: true,
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
            index: true,
        },
        category: {
            type: String,
            trim: true,
            index: true,
        },
        version: {
            type: String,
            default: '1.0.0',
        },
        dependencies: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Indexes cho performance
CodeExampleSchema.index({ name: 'text', description: 'text', tags: 'text' });
CodeExampleSchema.index({ type: 1, library: 1 });
CodeExampleSchema.index({ createdAt: -1 });
CodeExampleSchema.index({ likes: -1 });
CodeExampleSchema.index({ views: -1 });

// Virtual fields
CodeExampleSchema.virtual('popularity').get(function () {
    return this.likes * 2 + this.views * 0.1 + this.downloads * 1.5;
});

// Middleware - cập nhật slug khi save
CodeExampleSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.id = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    next();
});

// Static methods
CodeExampleSchema.statics.findByLibrary = function (library: string) {
    return this.find({ library, isPublic: true }).sort({ createdAt: -1 });
};

CodeExampleSchema.statics.findPopular = function (limit: number = 10) {
    return this.find({ isPublic: true })
        .sort({ likes: -1, views: -1 })
        .limit(limit);
};

CodeExampleSchema.statics.searchByText = function (searchTerm: string) {
    return this.find({
        $text: { $search: searchTerm },
        isPublic: true,
    }).sort({ score: { $meta: 'textScore' } });
};

// Instance methods
CodeExampleSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

CodeExampleSchema.methods.incrementDownloads = function () {
    this.downloads += 1;
    return this.save();
};

// Export model
export default mongoose.models.CodeExample ||
    mongoose.model<ICodeExample>('CodeExample', CodeExampleSchema);
