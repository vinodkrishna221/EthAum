import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T | null;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        hasMore?: boolean;
        [key: string]: unknown;
    };
    error?: {
        code: string;
        message: string;
        details?: Array<{ field: string; message: string }>;
    } | null;
}

export function successResponse<T>(
    data: T,
    meta?: ApiResponse['meta'],
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            meta,
            error: null,
        },
        { status }
    );
}

export function errorResponse(
    code: string,
    message: string,
    status: number = 400,
    details?: Array<{ field: string; message: string }>
): NextResponse<ApiResponse<null>> {
    return NextResponse.json(
        {
            success: false,
            data: null,
            error: {
                code,
                message,
                details,
            },
        },
        { status }
    );
}

// Common error responses
export const Errors = {
    UNAUTHORIZED: () => errorResponse('UNAUTHORIZED', 'Invalid or missing auth token', 401),
    FORBIDDEN: () => errorResponse('FORBIDDEN', 'Insufficient permissions', 403),
    NOT_FOUND: (resource: string = 'Resource') =>
        errorResponse('NOT_FOUND', `${resource} not found`, 404),
    VALIDATION_ERROR: (details: Array<{ field: string; message: string }>) =>
        errorResponse('VALIDATION_ERROR', 'Invalid input data', 400, details),
    RATE_LIMITED: () => errorResponse('RATE_LIMITED', 'Too many requests', 429),
    SERVER_ERROR: (message: string = 'Internal server error') =>
        errorResponse('SERVER_ERROR', message, 500),
};
