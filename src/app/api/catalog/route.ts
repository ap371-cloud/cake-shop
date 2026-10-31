import { NextResponse } from "next/server";
import { listCatalog, listCategories } from "@/lib/server/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const result = await listCatalog({
      category: searchParams.get("category"),
      q: searchParams.get("q"),
      sort: searchParams.get("sort"),
      page: parseInt(searchParams.get("page") ?? "1", 10),
      limit: parseInt(searchParams.get("limit") ?? "24", 10),
    });

    return NextResponse.json({ ...result, categories: await listCategories() });
  } catch (error) {
    console.error("catalog query failed", error);
    return NextResponse.json({ error: "Could not load the catalogue." }, { status: 500 });
  }
}
