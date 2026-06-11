"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sellerProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.isAdmin ? user : null;
}

export async function approveSeller(
  profileId: string,
): Promise<{ error?: string }> {
  if (!(await requireAdmin())) return { error: "Accès refusé." };

  await db
    .update(sellerProfiles)
    .set({
      status: "approved",
      rejectionReason: null,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(sellerProfiles.id, profileId));

  revalidatePath("/admin/vendeurs");
  return {};
}

export async function rejectSeller(
  profileId: string,
  reason: string,
): Promise<{ error?: string }> {
  if (!(await requireAdmin())) return { error: "Accès refusé." };
  if (!reason?.trim()) {
    return { error: "Indiquez le motif du refus (visible par le vendeur)." };
  }

  await db
    .update(sellerProfiles)
    .set({
      status: "rejected",
      rejectionReason: reason.trim(),
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(sellerProfiles.id, profileId));

  revalidatePath("/admin/vendeurs");
  return {};
}
