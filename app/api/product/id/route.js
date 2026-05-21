import { NextResponse } from "next/server";
import { getAllProducts, saveAllProducts } from "@/lib/products";

export async function GET(_, { params }) {
  try {
    const products = await getAllProducts();
    const product  = products.find(p => p.id === params.id);
    return product
      ? NextResponse.json(product)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body     = await req.json();
    const products = await getAllProducts();
    const idx      = products.findIndex(p => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    products[idx] = { ...products[idx], ...body, id: params.id };
    await saveAllProducts(products);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const products = await getAllProducts();
    const idx      = products.findIndex(p => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await saveAllProducts(products.filter((_, i) => i !== idx));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
