import { IUser } from '../../models/User';

export interface ICodeExample {
    likedBy: unknown[];
    name: string;
    description: string;
    type: string;
    library: string;
    tags: string[];
    code: string;
    author: string;
    likes: number;
    views: number;
    downloads: number;
    isPublic: boolean;
    difficulty: string;
    version: string;
    dependencies: string[];
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface ICodeExampleDetail {
    likedBy: unknown[];
    name: string;
    description: string;
    type: string;
    library: string;
    tags: string[];
    code: string;
    author: string | IUser;
    likes: number;
    views: number;
    downloads: number;
    isPublic: boolean;
    difficulty: string;
    version: string;
    dependencies: string[];
    createdAt: string;
    updatedAt: string;
    id: string;
}
