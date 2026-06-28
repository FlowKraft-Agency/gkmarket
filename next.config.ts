import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome pour une image Docker minimale (.next/standalone).
  output: "standalone",
  // Un package-lock.json parasite existe dans le profil utilisateur ;
  // on fixe la racine pour que Next ne s'y trompe pas.
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
