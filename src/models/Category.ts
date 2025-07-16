import mongoose from 'mongoose';

// Interface cho TypeScript
export interface ICategory extends mongoose.Document {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    color?: string;
    parentCategory?: mongoose.Types.ObjectId;
    isActive: boolean;
    sortOrder: number;
    codeExampleCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Schema định nghĩa cấu trúc dữ liệu Category
const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[a-z0-9-]+$/,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        icon: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            match: /^#[0-9A-F]{6}$/i,
            default: '#3B82F6',
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        codeExampleCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Additional indexes (unique constraints are handled in schema)
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ codeExampleCount: -1 });

// Virtual fields
CategorySchema.virtual('isParentCategory').get(function () {
    return !this.parentCategory;
});

CategorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentCategory',
});

// Pre-save middleware để tạo slug
CategorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    next();
});

// Static methods
CategorySchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isActive: true });
};

CategorySchema.statics.findParentCategories = function () {
    return this.find({
        parentCategory: null,
        isActive: true,
    }).sort({ sortOrder: 1, name: 1 });
};

CategorySchema.statics.findSubcategories = function (
    parentId: mongoose.Types.ObjectId,
) {
    return this.find({
        parentCategory: parentId,
        isActive: true,
    }).sort({ sortOrder: 1, name: 1 });
};

CategorySchema.statics.findPopularCategories = function (limit: number = 10) {
    return this.find({ isActive: true })
        .sort({ codeExampleCount: -1 })
        .limit(limit);
};

// Instance methods
CategorySchema.methods.incrementCodeExampleCount = function () {
    this.codeExampleCount += 1;
    return this.save();
};

CategorySchema.methods.decrementCodeExampleCount = function () {
    if (this.codeExampleCount > 0) {
        this.codeExampleCount -= 1;
        return this.save();
    }
    return Promise.resolve(this);
};

// Export model
export default mongoose.models.Category ||
    mongoose.model<ICategory>('Category', CategorySchema);
