import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data/products.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const store = read();

  const index = store.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  store.products[index] = {
    ...store.products[index],
    ...body,
  };

  write(store);

  return NextResponse.json({
    success: true,
    product: store.products[index],
  });
}