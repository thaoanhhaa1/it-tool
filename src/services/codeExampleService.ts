import clientPromise from '@/lib/mongodb';
import Category from '@/models/Category';
import CodeExample from '@/models/CodeExample';
import User from '@/models/User';
import mongoose from 'mongoose';

// Interface cho search filters
interface SearchFilters {
    search?: string;
    type?: 'component' | 'function';
    library?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    category?: string;
    author?: string;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
    page?: number;
    limit?: number;
}

// Interface cho tạo mới Code Example
interface CreateCodeExampleData {
    name: string;
    description: string;
    type: 'component' | 'function';
    library: string;
    tags: string[];
    code: string;
    authorId: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    dependencies?: string[];
    isPublic?: boolean;
}

export class CodeExampleService {
    // Kết nối database
    private async ensureConnection() {
        if (mongoose.connection.readyState !== 1) {
            await clientPromise;
        }
    }

    // Lấy danh sách code examples với filters
    async getCodeExamples(filters: SearchFilters = {}) {
        await this.ensureConnection();

        const {
            search,
            type,
            library,
            difficulty,
            tags,
            category,
            author,
            sortBy = 'newest',
            page = 1,
            limit = 20,
        } = filters;

        // Build query
        const query: Record<string, unknown> = { isPublic: true };

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Type filter
        if (type) {
            query.type = type;
        }

        // Library filter
        if (library) {
            query.library = library;
        }

        // Difficulty filter
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Tags filter
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Author filter
        if (author) {
            const user = await User.findOne({ username: author });
            if (user) {
                query.author = user._id;
            }
        }

        // Sorting
        let sort: Record<string, 1 | -1> = {};
        switch (sortBy) {
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'popular':
                sort = { likes: -1, views: -1 };
                break;
            case 'trending':
                // Trending based on recent activity (likes + views in last 7 days)
                sort = { likes: -1, views: -1, createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Execute query
        const skip = (page - 1) * limit;

        const [codeExamples, total] = await Promise.all([
            CodeExample.find(query)
                .populate('author', 'username fullName avatar reputation')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            CodeExample.countDocuments(query),
        ]);

        return {
            codeExamples,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Lấy chi tiết một code example
    async getCodeExampleById(id: string) {
        await this.ensureConnection();

        const codeExample = await CodeExample.findById(id)
            .populate(
                'author',
                'username fullName avatar reputation bio github linkedin',
            )
            .lean();

        if (!codeExample) {
            throw new Error('Code example not found');
        }

        // Tăng view count
        await CodeExample.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return codeExample;
    }

    // Lấy code example theo slug
    async getCodeExampleBySlug(slug: string) {
        await this.ensureConnection();

        const codeExample = await CodeExample.findOne({
            id: slug,
            isPublic: true,
        })
            .populate(
                'author',
                'username fullName avatar reputation bio github linkedin',
            )
            .lean();

        if (!codeExample) {
            throw new Error('Code example not found');
        }

        // Tăng view count
        await CodeExample.findOneAndUpdate(
            { id: slug },
            { $inc: { views: 1 } },
        );

        return codeExample;
    }

    // Tạo mới code example
    async createCodeExample(data: CreateCodeExampleData) {
        await this.ensureConnection();

        // Validate author exists
        const author = await User.findById(data.authorId);
        if (!author) {
            throw new Error('Author not found');
        }

        // Create code example
        const codeExample = new CodeExample({
            name: data.name,
            description: data.description,
            type: data.type,
            library: data.library,
            tags: data.tags,
            code: data.code,
            author: data.authorId,
            difficulty: data.difficulty || 'beginner',
            category: data.category,
            dependencies: data.dependencies || [],
            isPublic: data.isPublic ?? true,
        });

        const savedCodeExample = await codeExample.save();

        // Update category count if applicable
        if (data.category) {
            await Category.findOneAndUpdate(
                { slug: data.category },
                { $inc: { codeExampleCount: 1 } },
            );
        }

        return savedCodeExample.populate('author', 'username fullName avatar');
    }

    // Cập nhật code example
    async updateCodeExample(
        id: string,
        data: Partial<CreateCodeExampleData>,
        userId: string,
    ) {
        await this.ensureConnection();

        const codeExample = await CodeExample.findById(id);
        if (!codeExample) {
            throw new Error('Code example not found');
        }

        // Check permission
        if (codeExample.author.toString() !== userId) {
            throw new Error('Permission denied');
        }

        // Update fields
        Object.keys(data).forEach((key) => {
            if (data[key as keyof CreateCodeExampleData] !== undefined) {
                (codeExample as Record<string, unknown>)[key] =
                    data[key as keyof CreateCodeExampleData];
            }
        });

        const updatedCodeExample = await codeExample.save();
        return updatedCodeExample.populate(
            'author',
            'username fullName avatar',
        );
    }

    // Xóa code example
    async deleteCodeExample(id: string, userId: string) {
        await this.ensureConnection();

        const codeExample = await CodeExample.findById(id);
        if (!codeExample) {
            throw new Error('Code example not found');
        }

        // Check permission
        if (codeExample.author.toString() !== userId) {
            throw new Error('Permission denied');
        }

        // Update category count
        if (codeExample.category) {
            await Category.findOneAndUpdate(
                { slug: codeExample.category },
                { $inc: { codeExampleCount: -1 } },
            );
        }

        await CodeExample.findByIdAndDelete(id);
        return { success: true };
    }

    // Like/Unlike code example
    async toggleLike(codeExampleId: string, userId: string) {
        await this.ensureConnection();

        const codeExample = await CodeExample.findById(codeExampleId);
        if (!codeExample) {
            throw new Error('Code example not found');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if already liked
        const isLiked = user.favoriteCodeExamples.includes(codeExample._id);

        if (isLiked) {
            // Unlike
            await Promise.all([
                CodeExample.findByIdAndUpdate(codeExampleId, {
                    $inc: { likes: -1 },
                }),
                User.findByIdAndUpdate(userId, {
                    $pull: { favoriteCodeExamples: codeExampleId },
                }),
            ]);
        } else {
            // Like
            await Promise.all([
                CodeExample.findByIdAndUpdate(codeExampleId, {
                    $inc: { likes: 1 },
                }),
                User.findByIdAndUpdate(userId, {
                    $push: { favoriteCodeExamples: codeExampleId },
                }),
            ]);
        }

        return { isLiked: !isLiked };
    }

    // Tăng download count
    async incrementDownload(id: string) {
        await this.ensureConnection();

        await CodeExample.findByIdAndUpdate(id, { $inc: { downloads: 1 } });
        return { success: true };
    }

    // Lấy code examples phổ biến
    async getPopularCodeExamples(limit: number = 10) {
        await this.ensureConnection();

        return CodeExample.find({ isPublic: true })
            .populate('author', 'username fullName avatar reputation')
            .sort({ likes: -1, views: -1 })
            .limit(limit)
            .lean();
    }

    // Lấy code examples mới nhất
    async getLatestCodeExamples(limit: number = 10) {
        await this.ensureConnection();

        return CodeExample.find({ isPublic: true })
            .populate('author', 'username fullName avatar reputation')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    // Lấy code examples theo tác giả
    async getCodeExamplesByAuthor(
        authorId: string,
        page: number = 1,
        limit: number = 20,
    ) {
        await this.ensureConnection();

        const skip = (page - 1) * limit;

        const [codeExamples, total] = await Promise.all([
            CodeExample.find({ author: authorId, isPublic: true })
                .populate('author', 'username fullName avatar reputation')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CodeExample.countDocuments({ author: authorId, isPublic: true }),
        ]);

        return {
            codeExamples,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Lấy thống kê
    async getStats() {
        await this.ensureConnection();

        const [
            totalCodeExamples,
            totalComponents,
            totalFunctions,
            totalViews,
            totalDownloads,
        ] = await Promise.all([
            CodeExample.countDocuments({ isPublic: true }),
            CodeExample.countDocuments({ type: 'component', isPublic: true }),
            CodeExample.countDocuments({ type: 'function', isPublic: true }),
            CodeExample.aggregate([
                { $match: { isPublic: true } },
                { $group: { _id: null, totalViews: { $sum: '$views' } } },
            ]),
            CodeExample.aggregate([
                { $match: { isPublic: true } },
                {
                    $group: {
                        _id: null,
                        totalDownloads: { $sum: '$downloads' },
                    },
                },
            ]),
        ]);

        return {
            totalCodeExamples,
            totalComponents,
            totalFunctions,
            totalViews: totalViews[0]?.totalViews || 0,
            totalDownloads: totalDownloads[0]?.totalDownloads || 0,
        };
    }
}

// Export singleton instance
export const codeExampleService = new CodeExampleService();
