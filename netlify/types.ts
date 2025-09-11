export type Profile = 'admin' | 'user';

export interface User {
    id: string;
    nome: string;
    username: string;
    email: string;
    profile: Profile;
    createdAt: Date;
    updatedAt: Date;
}
