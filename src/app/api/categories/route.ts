import connectDB from '@/lib/mongoose';
import Category from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const includeSubcategories =
            searchParams.get('includeSubcategories') === 'true';
        const parentId = searchParams.get('parentId');

        let categories;

        if (parentId) {
            // Lấy subcategories của parent category
            categories = await Category.find({
                parentCategory: parentId,
                isActive: true,
            }).sort({ sortOrder: 1, name: 1 });
        } else if (includeSubcategories) {
            // Lấy tất cả categories và populate subcategories
            categories = await Category.find({
                parentCategory: null,
                isActive: true,
            })
                .populate({
                    path: 'subcategories',
                    match: { isActive: true },
                    options: { sort: { sortOrder: 1, name: 1 } },
                })
                .sort({ sortOrder: 1, name: 1 });
        } else {
            // Chỉ lấy parent categories
            categories = await Category.find({
                parentCategory: null,
                isActive: true,
            }).sort({ sortOrder: 1, name: 1 });
        }

        return NextResponse.json({
            success: true,
            data: categories,
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
            icon,
            color = '#3B82F6',
            parentCategory,
            sortOrder = 0,
        } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Name is required',
                },
                { status: 400 },
            );
        }

        // Tạo slug từ name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Kiểm tra slug đã tồn tại chưa
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category with this name already exists',
                },
                { status: 400 },
            );
        }

        // Validate parent category nếu có
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (!parent) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Parent category not found',
                    },
                    { status: 404 },
                );
            }
        }

        // Tạo category
        const category = new Category({
            name,
            slug,
            description,
            icon,
            color,
            parentCategory: parentCategory || null,
            sortOrder,
        });

        const savedCategory = await category.save();

        return NextResponse.json(
            {
                success: true,
                data: savedCategory,
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
