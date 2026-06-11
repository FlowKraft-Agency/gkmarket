import { FirebaseError } from "firebase/app";

/** Traduit les codes d'erreur Firebase Auth en messages français. */
export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Un compte existe déjà avec cet email.";
      case "auth/invalid-email":
        return "Adresse email invalide.";
      case "auth/weak-password":
        return "Le mot de passe doit contenir au moins 6 caractères.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email ou mot de passe incorrect.";
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessayez dans quelques minutes.";
      case "auth/network-request-failed":
        return "Problème de connexion réseau. Vérifiez votre connexion.";
    }
  }
  return "Une erreur est survenue. Réessayez.";
}
