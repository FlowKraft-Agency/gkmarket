import "server-only";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { courierProfiles, sellerProfiles, users } from "@/db/schema";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "__session";

export type CurrentUser = typeof users.$inferSelect & {
  sellerProfile: typeof sellerProfiles.$inferSelect | null;
  courierProfile: typeof courierProfiles.$inferSelect | null;
};

/**
 * Résout l'utilisateur courant depuis le cookie de session.
 * Retourne null si non connecté, session invalide ou compte suspendu/banni.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session);
    const rows = await db
      .select()
      .from(users)
      .leftJoin(sellerProfiles, eq(sellerProfiles.userId, users.id))
      .leftJoin(courierProfiles, eq(courierProfiles.userId, users.id))
      .where(eq(users.firebaseUid, decoded.uid))
      .limit(1);

    const row = rows[0];
    if (!row || row.users.status !== "active") return null;

    return {
      ...row.users,
      sellerProfile: row.seller_profiles,
      courierProfile: row.courier_profiles,
    };
  } catch {
    return null;
  }
}
