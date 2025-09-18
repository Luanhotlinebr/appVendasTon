import { db } from "@/config/firebase.config";
import type { SaleRecord, SaleRecordDto } from "@/models/registerSale";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";

export class registerSaleRepositoryFirebase {
    static collection = collection(db, "registerSale");
    private static instance: registerSaleRepositoryFirebase;

    constructor() {
        console.log("Construindo registerSaleRepositoryFirebase");
    }

    static getInstance() {
        if (!registerSaleRepositoryFirebase.instance) {
            registerSaleRepositoryFirebase.instance = new registerSaleRepositoryFirebase();
        }
        return registerSaleRepositoryFirebase.instance;
    }

    async create(sale: SaleRecordDto): Promise<string> {
        const docRef = await addDoc(registerSaleRepositoryFirebase.collection, {
            ...sale,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    }

    async list(): Promise<SaleRecord[]> {
        const querySnapshot = await getDocs(registerSaleRepositoryFirebase.collection);
        const sales: SaleRecord[] = [];

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            sales.push({ 
                id: docSnap.id,
                clientName: data.clientName, 
                saleDate: data.saleDate,
                planName: data.planName,
                soldModel: data.soldModel,
                commissionValue: data.commissionValue,
                sellerName: data.sellerName,
                planId: data.planId,
                userId: data.userId,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            });
        });

        return sales;
    }

    getById(id: string): Promise<SaleRecord> {
        const saleRef = doc(registerSaleRepositoryFirebase.collection, id);
        return getDoc(saleRef).then((docSnap) => {
            if (!docSnap.exists()) {
                throw new Error("Sale not found");
            }
            const data = docSnap.data();
            return { 
                id: docSnap.id,
                clientName: data.clientName, 
                saleDate: data.saleDate,
                planName: data.planName,
                soldModel: data.soldModel,
                commissionValue: data.commissionValue,
                sellerName: data.sellerName,
                planId: data.planId,
                userId: data.userId,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            };
        });
    }
    async edit(id: string, dados_alterados: Partial<SaleRecord>): Promise<void> {
        const saleRef = doc(registerSaleRepositoryFirebase.collection, id);
        await updateDoc(saleRef, {
            ...dados_alterados, updatedAt: serverTimestamp() 
        });
    }

    async delete(id: string): Promise<void> {
        const saleRef = doc(registerSaleRepositoryFirebase.collection, id);
        await deleteDoc(saleRef);
    }
}