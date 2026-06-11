import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminStorage } from "@/lib/firebase/admin";

/**
 * Consultation des documents KYC, réservée aux admins. Les fichiers ne sont
 * jamais accessibles directement depuis Storage (règles read: false) :
 * cette route est l'unique porte d'entrée, via firebase-admin.
 */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return new NextResponse(null, { status: 403 });
  }

  const path = new URL(request.url).searchParams.get("path");
  if (!path || !path.startsWith("kyc/")) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const file = adminStorage.bucket().file(path);
    const [metadata] = await file.getMetadata();
    const [contents] = await file.download();

    return new NextResponse(new Uint8Array(contents), {
      headers: {
        "Content-Type": metadata.contentType ?? "application/octet-stream",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
