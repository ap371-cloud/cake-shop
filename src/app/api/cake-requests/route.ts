import { NextResponse } from "next/server";
import { createCakeRequest } from "@/lib/store";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, unknown>;
    let referenceImage: { data: string; type: string; name: string } | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      body = {};
      for (const [k, v] of form.entries()) {
        if (k === "referenceImage" && v instanceof File) {
          if (v.size === 0) continue;
          if (v.size > MAX_IMAGE_BYTES) {
            return NextResponse.json({ error: "Reference image must be under 5 MB." }, { status: 400 });
          }
          if (!ALLOWED_IMAGE_TYPES.has(v.type)) {
            return NextResponse.json(
              { error: "Reference image must be JPG, PNG or WebP." },
              { status: 400 }
            );
          }
          referenceImage = {
            data: Buffer.from(await v.arrayBuffer()).toString("base64"),
            type: v.type,
            name: v.name,
          };
        } else if (k !== "referenceImage") {
          body[k] = String(v);
        }
      }
    } else {
      body = await request.json();
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const flavour = String(body.flavour ?? "").trim();
    const size = String(body.size ?? "").trim();
    const shape = String(body.shape ?? "").trim();
    const occasion = String(body.occasion ?? "").trim();
    const designDescription = String(body.designDescription ?? "").trim();
    const preferredDate = String(body.preferredDate ?? "").trim();
    const budgetRange = String(body.budgetRange ?? "").trim();

    if (!name || name.length > 100) return NextResponse.json({ error: "Name required." }, { status: 400 });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    if (!/^[0-9+\s()-]{7,15}$/.test(phone)) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
    if (!flavour || flavour.length > 120) return NextResponse.json({ error: "Flavour required." }, { status: 400 });
    if (!size || !shape || !occasion) return NextResponse.json({ error: "Size, shape and occasion required." }, { status: 400 });
    if (!designDescription || designDescription.length < 10 || designDescription.length > 2000) {
      return NextResponse.json({ error: "Design description must be 10–2000 characters." }, { status: 400 });
    }
    if (!preferredDate) return NextResponse.json({ error: "Preferred date required." }, { status: 400 });
    if (!budgetRange) return NextResponse.json({ error: "Budget range required." }, { status: 400 });

    const req = await createCakeRequest({
      name,
      email,
      phone,
      flavour,
      size,
      shape,
      occasion,
      designDescription,
      preferredDate,
      budgetRange,
      referenceImageUrl: referenceImage
        ? `data:${referenceImage.type};base64,${referenceImage.data}`
        : undefined,
    });
    return NextResponse.json(req, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not submit request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}