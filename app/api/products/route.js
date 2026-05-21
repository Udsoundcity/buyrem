import { NextResponse } from "next/server";
import { getAllProducts, saveAllProducts } from "@/lib/products";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req) {
  const body     = await req.json();
  const products = await getAllProducts();
  const id       = body.id || slugify(body.name);

  if (products.find(p => p.id === id)) {
    return NextResponse.json({ error: "ID already exists" }, { status: 409 });
  }

  await saveAllProducts([...products, { ...body, id }]);
  return NextResponse.json({ success: true, id }, { status: 201 });
}
