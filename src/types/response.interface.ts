// Common response interfaces to avoid duplication across services

export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface SingleEntityResponse<T = Record<string, unknown>>
    extends BaseResponse {
    data?: T;
}

export interface MultipleEntitiesResponse<T = Record<string, unknown>>
    extends BaseResponse {
    data?: T[];
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
}

export interface PaginatedResponse<T = Record<string, unknown>>
    extends BaseResponse {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface AuthResponse extends BaseResponse {
    accessToken?: string;
    refreshToken?: string;
    user?: Record<string, unknown>;
}

export interface TokenResponse extends BaseResponse {
    accessToken?: string;
    refreshToken?: string;
}

export interface CountResponse extends BaseResponse {
    count: number;
}

// Legacy interfaces for backward compatibility (will be deprecated)
export interface CreateResponse extends BaseResponse {
    [key: string]: unknown;
}

export interface GetResponse extends BaseResponse {
    [key: string]: unknown;
}

export interface UpdateResponse extends BaseResponse {
    [key: string]: unknown;
}

export interface DeleteResponse extends BaseResponse {
    deletedId?: string | number;
}
