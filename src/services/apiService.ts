import { api } from '@/lib/axios';
import { ICategory } from '@/types/category/category.interface';
import {
    ICodeExample,
    ICodeExampleDetail,
} from '@/types/codeExample/codeExample.interface';

// Types
export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentCategory?: string | null;
    subcategories?: Category[];
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CodeExample {
    _id: string;
    name: string;
    description: string;
    type: 'component' | 'function';
    library: string;
    tags: string[];
    code: string;
    author: {
        _id: string;
        username: string;
        fullName: string;
        avatar?: string;
        reputation?: number;
    };
    category?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    likes: number;
    views: number;
    dependencies: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CodeExampleFilters {
    search?: string;
    type?: 'component' | 'function';
    library?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    author?: string;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
    page?: number;
    limit?: number;
    tags?: string[];
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface CodeExamplesResponse {
    codeExamples: CodeExample[];
    pagination: PaginationInfo;
}

// Category API Service
export const categoryService = {
    // Get all categories
    getAll: async (includeSubcategories = false): Promise<Array<ICategory>> => {
        const params = new URLSearchParams();
        if (includeSubcategories) {
            params.append('includeSubcategories', 'true');
        }

        return api.get<Array<ICategory>>(
            `/api/categories?${params.toString()}`,
        );
    },

    // Get category by ID
    getById: async (id: string): Promise<Category> => {
        return api.get<Category>(`/api/categories/${id}`);
    },

    // Get subcategories by parent ID
    getSubcategories: async (parentId: string): Promise<Category[]> => {
        return api.get<Category[]>(`/api/categories?parentId=${parentId}`);
    },

    // Create new category
    create: async (categoryData: Partial<Category>): Promise<Category> => {
        return api.post<Category>('/api/categories', categoryData);
    },

    // Update category
    update: async (
        id: string,
        categoryData: Partial<Category>,
    ): Promise<Category> => {
        return api.put<Category>(`/api/categories/${id}`, categoryData);
    },

    // Delete category
    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/categories/${id}`);
    },
};

// Code Examples API Service
export const codeExampleService = {
    // Get all code examples with filters
    getAll: async (
        filters: CodeExampleFilters = {},
    ): Promise<Array<ICodeExample>> => {
        const params = new URLSearchParams();

        // Add filters to params
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    params.append(key, value.join(','));
                } else {
                    params.append(key, String(value));
                }
            }
        });

        return api.get<Array<ICodeExample>>(
            `/api/code-examples?${params.toString()}`,
        );
    },

    // Get code example by ID
    getById: async (id: string): Promise<ICodeExampleDetail> => {
        return api.get<ICodeExampleDetail>(`/api/code-examples/${id}`);
    },

    // Create new code example
    create: async (
        codeExampleData: Partial<CodeExample>,
    ): Promise<CodeExample> => {
        return api.post<CodeExample>('/api/code-examples', codeExampleData);
    },

    // Update code example
    update: async (
        id: string,
        codeExampleData: Partial<CodeExample>,
    ): Promise<CodeExample> => {
        return api.put<CodeExample>(
            `/api/code-examples/${id}`,
            codeExampleData,
        );
    },

    // Delete code example
    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/code-examples/${id}`);
    },

    // Like/Unlike code example
    toggleLike: async (
        id: string,
    ): Promise<{ liked: boolean; likes: number }> => {
        return api.post<{ liked: boolean; likes: number }>(
            `/api/code-examples/${id}/like`,
        );
    },

    // Increment view count
    incrementView: async (id: string): Promise<void> => {
        return api.post<void>(`/api/code-examples/${id}/view`);
    },
};

// Search API Service
export const searchService = {
    // Global search across all content
    globalSearch: async (
        query: string,
        filters: {
            type?: 'all' | 'categories' | 'code-examples';
            limit?: number;
        } = {},
    ): Promise<{
        categories: Category[];
        codeExamples: CodeExample[];
        total: number;
    }> => {
        const params = new URLSearchParams();
        params.append('q', query);

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });

        return api.get<{
            categories: Category[];
            codeExamples: CodeExample[];
            total: number;
        }>(`/api/search?${params.toString()}`);
    },

    // Get popular search terms
    getPopularTerms: async (): Promise<string[]> => {
        return api.get<string[]>('/api/search/popular');
    },
};

// Stats API Service
export const statsService = {
    // Get general stats
    getGeneralStats: async (): Promise<{
        totalCategories: number;
        totalCodeExamples: number;
        totalUsers: number;
        totalViews: number;
        totalLikes: number;
    }> => {
        return api.get('/api/stats');
    },

    // Get trending content
    getTrending: async (
        period: 'day' | 'week' | 'month' = 'week',
    ): Promise<{
        categories: Category[];
        codeExamples: CodeExample[];
    }> => {
        return api.get(`/api/stats/trending?period=${period}`);
    },
};
