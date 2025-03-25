import type { BaseModel, PaginationModel } from "../baseModel";

export interface FixedAssetModel extends BaseModel {
    fixedAssetNo: string | null;
    fixedAssetName: string | null;
    branCode: string | null;
    printStatus: number;
    lastCheckDate: string | null;
}

export interface FixedAssetPaginationModel extends PaginationModel {
    rows: FixedAssetModel[] | [];
}