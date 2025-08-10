export interface ICategory {
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    parentCategory: null;
    isActive: boolean;
    sortOrder: number;
    codeExampleCount: number;
    createdAt: string;
    updatedAt: string;
    id: string;
}
