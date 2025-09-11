import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";
import { User, Profile } from "../types";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

if (!admin.apps.length) {
  const serviceAccount: any = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: JSON.stringify({ message: "Método não permitido." }) };

  const { email, password, nome, username, profile } = JSON.parse(event.body || "{}") as { email: string, password: string, nome: string, username: string, profile: Profile };

  if (!email || !password || !nome || !username || !profile) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Todos os campos são obrigatórios." }) };
  }

  if (profile !== "admin" && profile !== "user") {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Profile deve ser 'admin' ou 'user'." }) };
  }

  try {
    // Verifica se o username já existe
    const usernameQuery = await db.collection("users").where("username", "==", username).get();
    if (!usernameQuery.empty) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Username já está em uso." }) };
    }

    // Checa se já existe algum admin
    const listUsers = await admin.auth().listUsers(1000);
    const hasAdmin = listUsers.users.some(u => u.customClaims?.admin);

    // Se já existe admin, exige token e valida admin
    if (hasAdmin) {
      const authHeader = event.headers["Authorization"] || event.headers["authorization"];
      if (!authHeader?.startsWith("Bearer ")) {
        return { statusCode: 401, headers: cors, body: JSON.stringify({ message: "Token não fornecido." }) };
      }

      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken.admin) {
        return { statusCode: 403, headers: cors, body: JSON.stringify({ message: "Apenas admins podem criar usuários." }) };
      }
    } else {
      // Se não existe admin, força o primeiro usuário a ser admin
      console.log("Primeiro usuário cadastrado será admin automaticamente.");
    }

    // Cria o usuário
    const userRecord = await admin.auth().createUser({ email, password, displayName: nome });

    // Define custom claim: admin = true se for profile admin ou se for o primeiro admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: profile === "admin" || !hasAdmin });

    const userData: User = {
      id: userRecord.uid,
      email,
      nome,
      username,
      profile: profile === "admin" || !hasAdmin ? "admin" : profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    return { statusCode: 201, headers: cors, body: JSON.stringify(userData) };
  } catch (error: any) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ message: "Erro ao criar usuário.", error: error.message }) };
  }
};
