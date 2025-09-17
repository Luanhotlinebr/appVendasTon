import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import * as admin from "firebase-admin";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const apiKey = process.env.API_KEY;

if (!admin.apps.length) {
  const serviceAccount: any = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS!
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ message: "Método não permitido." }),
    };
  }

  try {
    let { email, username, password } = JSON.parse(event.body || "{}");

    if ((!email && !username) || !password) {
      return {
        statusCode: 400,
        headers: cors,
        body: JSON.stringify({
          message: "Email ou username e senha são obrigatórios.",
        }),
      };
    }

    // Se forneceu username, busca o e-mail correspondente no Firestore
    if (username && !email) {
      const userQuery = await db
        .collection("users")
        .where("username", "==", username)
        .limit(1)
        .get();
      if (userQuery.empty) {
        return {
          statusCode: 401,
          headers: cors,
          body: JSON.stringify({ message: "Usuário não encontrado." }),
        };
      }
      const userDoc = userQuery.docs[0].data() as { email: string };
      email = userDoc.email; // substitui o email pelo encontrado
    }

    // Chama a REST API do Firebase Auth
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 401,
        headers: cors,
        body: JSON.stringify({ message: "Falha no login", error: data }),
      };
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ message: "Erro interno", error: error.message }),
    };
  }
};
