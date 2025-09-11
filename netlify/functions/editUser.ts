import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";
import { Profile } from "../types";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };

  const authHeader = event.headers["Authorization"] || event.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ message: "Token não fornecido." }) };
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.admin) {
      return { statusCode: 403, headers: cors, body: JSON.stringify({ message: "Apenas admins podem editar usuários." }) };
    }

    if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: JSON.stringify({ message: "Método não permitido." }) };

    // Apenas campos que podem ser alterados
    const { id, nome, email, password, profile } = JSON.parse(event.body || "{}") as {
      id: string;
      nome: string;
      email?: string;
      password?: string;
      profile: Profile;
    };

    if (!id || !nome || !profile) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Campos obrigatórios: id, nome, profile." }) };
    }

    if (profile !== "admin" && profile !== "user") {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Profile deve ser 'admin' ou 'user'." }) };
    }

    // Atualiza custom claim
    await admin.auth().setCustomUserClaims(id, { admin: profile === "admin" });

    // Atualiza Firestore (username não será alterado)
    const updateData: any = {
      nome,
      profile,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (email) updateData.email = email;
    await db.collection("users").doc(id).update(updateData);

    // Atualiza email e senha no Firebase Auth, se fornecidos
    const authUpdateData: any = {};
    if (email) authUpdateData.email = email;
    if (password) authUpdateData.password = password;
    if (Object.keys(authUpdateData).length > 0) {
      await admin.auth().updateUser(id, authUpdateData);
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ message: "Usuário atualizado com sucesso." }),
    };
  } catch (error: any) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ message: "Erro ao editar usuário.", error: error.message }) };
  }
};
