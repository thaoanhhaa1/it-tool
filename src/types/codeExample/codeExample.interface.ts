interface Type {
    id: string;
    name: string;
}

interface Library {
    id: string;
    name: string;
}

interface TagsItem {
    id: string;
    name: string;
}

interface AuthorInfo {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: null;
    bio: string;
    github: string;
    linkedin: string;
}

export interface ICodeExample {
    name: string;
    description: string;
    type: Type;
    library: Library;
    tags: TagsItem[];
    code: string;
    author: string;
    authorInfo: AuthorInfo;
    difficulty: string;
    dependencies: string[];
    isPublic: boolean;
    views: number;
    likes: number;
    likedBy: unknown[];
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface ICodeExampleDetail {
    name: string;
    description: string;
    type: Type;
    library: Library;
    tags: TagsItem[];
    code: string;
    author: string;
    authorInfo: AuthorInfo;
    difficulty: string;
    dependencies: string[];
    isPublic: boolean;
    views: number;
    likes: number;
    likedBy: unknown[];
    createdAt: string;
    updatedAt: string;
    id: string;
}
