import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

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
      return { statusCode: 403, headers: cors, body: JSON.stringify({ message: "Apenas admins podem deletar usuários." }) };
    }

    if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: JSON.stringify({ message: "Método não permitido." }) };

    const { id } = JSON.parse(event.body || "{}");
    if (!id) return { statusCode: 400, headers: cors, body: JSON.stringify({ message: "Campo obrigatório: id do usuário." }) };

    await admin.auth().deleteUser(id);
    await db.collection("users").doc(id).delete();

    return { statusCode: 200, headers: cors, body: JSON.stringify({ message: `Usuário ${id} deletado com sucesso.` }) };
  } catch (error: any) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ message: "Erro ao deletar usuário.", error: error.message }) };
  }
};
