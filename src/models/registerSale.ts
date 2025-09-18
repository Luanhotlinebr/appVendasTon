export type SaleRecordDto = Omit<SaleRecord, "id" | "create_at" | "update_at">

export interface SaleRecord {
    id: string;
    clientName: string;
    saleDate: Date;
    planName: string;
    soldModel: string;
    commissionValue: number;
    sellerName: string;
    planId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
