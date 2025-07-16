import clientPromise from '@/lib/mongodb';
import CodeExample from '@/models/CodeExample';
import User from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Kết nối database
async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        await clientPromise;
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const search = searchParams.get('search') || '';
        const type = searchParams.get('type') || '';
        const library = searchParams.get('library') || '';
        const difficulty = searchParams.get('difficulty') || '';
        const category = searchParams.get('category') || '';
        const author = searchParams.get('author') || '';
        const sortBy = searchParams.get('sortBy') || 'newest';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

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
        if (tags.length > 0) {
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

        return NextResponse.json({
            success: true,
            data: {
                codeExamples,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            name,
            description,
            type,
            library,
            tags,
            code,
            authorId,
            difficulty = 'beginner',
            category,
            dependencies = [],
            isPublic = true,
        } = body;

        // Validate required fields
        if (!name || !description || !type || !library || !code || !authorId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                },
                { status: 400 },
            );
        }

        // Validate author exists
        const author = await User.findById(authorId);
        if (!author) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Author not found',
                },
                { status: 404 },
            );
        }

        // Create code example
        const codeExample = new CodeExample({
            name,
            description,
            type,
            library,
            tags: tags || [],
            code,
            author: authorId,
            difficulty,
            category,
            dependencies,
            isPublic,
        });

        const savedCodeExample = await codeExample.save();
        await savedCodeExample.populate('author', 'username fullName avatar');

        return NextResponse.json(
            {
                success: true,
                data: savedCodeExample,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 },
        );
    }
}
