import { db } from "@/config/firebase.config";
import type { Plan, PlanDto } from "@/models/plans";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, getDoc  } from "firebase/firestore"; 
export class PlanRepositoryFirebase {
    static collection = collection(db, "plans");
    private static instance: PlanRepositoryFirebase
    constructor(){
        console.log("Construindo PlanRepositoryFirebase");
    }
    static getInstance() {
        if (!PlanRepositoryFirebase.instance) {
            PlanRepositoryFirebase.instance = new PlanRepositoryFirebase();
        }
        return PlanRepositoryFirebase.instance;
    }

    async createPlan(plan: PlanDto):Promise<Plan> {
        const docRef = await addDoc(PlanRepositoryFirebase.collection, {
            ...plan,
            commissionRate: plan.commissionRate ?? 0.4,
            createAt: serverTimestamp(),
            updateAt: serverTimestamp()
        });
        return { id: docRef.id, name:plan.name, options:plan.options, commissionRate: plan.commissionRate ?? 0.4, createAt: new Date(), updateAt: new Date() };
    }

    getPlanById(id: string):Promise<Plan> {
        const planRef = doc(PlanRepositoryFirebase.collection, id);
        return getDoc(planRef).then((docSnap) => {
            if (!docSnap.exists()) {
                throw new Error("Plan not found");
            }
            const data = docSnap.data();
            return { 
                id: docSnap.id, 
                name: data.name, 
                options: data.options, 
                commissionRate: data.commissionRate, 
                createAt: data.createAt.toDate(),
                updateAt: data.updateAt.toDate()
            };
        });
    }
    async listPlans(): Promise<Plan[]> {
        const querySnapshot = await getDocs(PlanRepositoryFirebase.collection);
        const plans: Plan[] = [];

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            plans.push({ 
                id: docSnap.id, 
                name: data.name, 
                options: data.options, 
                commissionRate: data.commissionRate, 
                createAt: data.createAt.toDate(),
                updateAt: data.updateAt.toDate()
            });
        });

        return plans;
    }
    async editPlan(id: string, dados_alterados: Partial<Plan>):Promise<void> {
        const planRef = doc(PlanRepositoryFirebase.collection, id);
        await updateDoc(planRef, {
            ...dados_alterados, updateAt: serverTimestamp()});
        }
    async deletePlan(id: string):Promise<void> {
        const planRef = doc(PlanRepositoryFirebase.collection, id);
        await deleteDoc(planRef)
    }
}