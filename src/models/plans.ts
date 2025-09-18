export type PlanDto = Omit<Plan, 'id' | 'creat_at' | 'update_at'>;

export interface PlanOption {
    model: string;   
    price: number;  
}

export interface Plan {
    id: string;
    name: string;           
    options: PlanOption[];  
    commissionRate?: number; // percentual da comissão (ex: 0.1 = 10%)
    createAt: Date;
    updateAt: Date;
}
