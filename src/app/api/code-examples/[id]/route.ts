import clientPromise from '@/lib/mongodb';
import CodeExample from '@/models/CodeExample';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Kết nối database
async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        await clientPromise;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await connectDB();

        const { id } = params;

        const codeExample = await CodeExample.findById(id)
            .populate(
                'author',
                'username fullName avatar reputation bio github linkedin',
            )
            .lean();

        if (!codeExample) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Code example not found',
                },
                { status: 404 },
            );
        }

        // Tăng view count
        await CodeExample.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return NextResponse.json({
            success: true,
            data: codeExample,
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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await connectDB();

        const { id } = params;
        const body = await request.json();

        const {
            name,
            description,
            type,
            library,
            tags,
            code,
            userId, // ID của user thực hiện update
            difficulty,
            category,
            dependencies,
            isPublic,
        } = body;

        // Kiểm tra code example tồn tại
        const codeExample = await CodeExample.findById(id);
        if (!codeExample) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Code example not found',
                },
                { status: 404 },
            );
        }

        // Kiểm tra quyền (chỉ author mới được update)
        if (codeExample.author.toString() !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Permission denied',
                },
                { status: 403 },
            );
        }

        // Update fields
        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (type !== undefined) updateData.type = type;
        if (library !== undefined) updateData.library = library;
        if (tags !== undefined) updateData.tags = tags;
        if (code !== undefined) updateData.code = code;
        if (difficulty !== undefined) updateData.difficulty = difficulty;
        if (category !== undefined) updateData.category = category;
        if (dependencies !== undefined) updateData.dependencies = dependencies;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const updatedCodeExample = await CodeExample.findByIdAndUpdate(
            id,
            updateData,
            { new: true },
        ).populate('author', 'username fullName avatar');

        return NextResponse.json({
            success: true,
            data: updatedCodeExample,
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await connectDB();

        const { id } = params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User ID is required',
                },
                { status: 400 },
            );
        }

        // Kiểm tra code example tồn tại
        const codeExample = await CodeExample.findById(id);
        if (!codeExample) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Code example not found',
                },
                { status: 404 },
            );
        }

        // Kiểm tra quyền (chỉ author mới được xóa)
        if (codeExample.author.toString() !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Permission denied',
                },
                { status: 403 },
            );
        }

        // Xóa code example
        await CodeExample.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Code example deleted successfully',
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
