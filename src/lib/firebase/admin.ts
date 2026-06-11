import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Deux modes :
// - Émulateur local : FIREBASE_AUTH_EMULATOR_HOST est défini, aucune clé requise.
// - Production : FIREBASE_SERVICE_ACCOUNT contient le JSON du compte de service.
function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT manquant (ou FIREBASE_AUTH_EMULATOR_HOST pour le développement local).",
    );
  }
  return initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
}

export const adminAuth = getAuth(getAdminApp());
