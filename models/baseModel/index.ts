export interface BaseModel {
    id: number;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface PaginationModel {
    currentPage: number;
    totalPage: number;
    count: number;
}

export interface ResponseModel {
    success: boolean;
    message: string;
    data: Object | null;
}