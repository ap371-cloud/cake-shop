import type { ContactMessage, CustomCakeRequest } from "@/types";
import { getDb } from "./db";

type CakeRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  flavour: string;
  size: string;
  shape: string;
  occasion: string;
  design_description: string;
  preferred_date: string | Date;
  budget_range: string;
  reference_image_url: string | null;
  status: CustomCakeRequest["status"];
  created_at: string | Date;
};

function toCakeRequest(row: CakeRow): CustomCakeRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    flavour: row.flavour,
    size: row.size,
    shape: row.shape,
    occasion: row.occasion,
    designDescription: row.design_description,
    preferredDate: new Date(row.preferred_date).toISOString().slice(0, 10),
    budgetRange: row.budget_range,
    referenceImageUrl: row.reference_image_url ?? undefined,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function createCakeRequest(
  input: Omit<CustomCakeRequest, "id" | "status" | "createdAt">,
  userId?: string
): Promise<CustomCakeRequest> {
  const db = await getDb();
  const { rows } = await db.query<CakeRow>(
    `insert into public.custom_cake_requests
       (user_id, name, email, phone, flavour, size, shape, occasion,
        design_description, preferred_date, budget_range, reference_image_url)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     returning *`,
    [
      userId ?? null,
      input.name,
      input.email,
      input.phone,
      input.flavour,
      input.size,
      input.shape,
      input.occasion,
      input.designDescription,
      input.preferredDate,
      input.budgetRange,
      input.referenceImageUrl ?? null,
    ]
  );

  return toCakeRequest(rows[0]);
}

export async function listCakeRequests(): Promise<CustomCakeRequest[]> {
  const db = await getDb();
  const { rows } = await db.query<CakeRow>(
    "select * from public.custom_cake_requests order by created_at desc"
  );
  return rows.map(toCakeRequest);
}

export async function createContactMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const db = await getDb();
  const { rows } = await db.query<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    created_at: string | Date;
  }>(
    "insert into public.contact_messages (name, email, phone, message) values ($1, $2, $3, $4) returning *",
    [input.name, input.email, input.phone, input.message]
  );

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const db = await getDb();
  const { rows } = await db.query<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    created_at: string | Date;
  }>("select * from public.contact_messages order by created_at desc");

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}
