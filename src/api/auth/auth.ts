import { auth } from "../../config/firebase.config";

export class Auth {
  private static instance: Auth;
  constructor() {
    console.log("Construindo auth");
  }

  static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  async login(username?: string, email?: string, password?: string) {
    if (!password) throw new Error("Senha é obrigatória");

    const body: any = { password, returnSecureToken: true };

    if (username) body.username = username;
    else if (email) body.email = email;
    else throw new Error("Email ou username são obrigatórios");

    const response = await fetch("/api/loginUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login");
    }

    return data; // idToken, refreshToken, expiresIn, localId
  }

  async logout() {
    await auth.signOut();
  }

  async register(
    email: string,
    password: string,
    nome: string,
    username: string,
    profile: "admin" | "user"
  ) {
    const adminToken = await auth.currentUser?.getIdToken();

    const headers: any = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

    const response = await fetch("/api/registerUser", {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, nome, username, profile }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao registrar usuário");
    }

    return data; // retorna os dados do usuário criado
  }

  async editUser(
    id: string,
    nome: string,
    profile: "admin" | "user",
    email?: string,
    password?: string
  ) {
    const adminToken = await auth.currentUser?.getIdToken();

    if (!adminToken) throw new Error("Token de admin não encontrado");

    const headers: any = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    };

    const body: any = { id, nome, profile };
    if (email) body.email = email;
    if (password) body.password = password;

    const response = await fetch("/api/editUser", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao editar usuário");
    }

    return data; // retorna { message: "Usuário atualizado com sucesso." }
  }
  async sendPasswordResetEmail(username?: string, email?: string) {
    if (!username && !email)
      throw new Error("Email ou username são obrigatórios");

    const response = await fetch("/api/recoverPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao enviar e-mail de recuperação");
    }

    return data; // { message: "E-mail de recuperação enviado com sucesso." }
  }
}
