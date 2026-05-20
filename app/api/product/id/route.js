import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data/products.json");
function read()      { return JSON.parse(fs.readFileSync(FILE, "utf-8")); }
function write(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET(_, { params }) {
  const store = read();
  const p = store.products.find(p => p.id === params.id);
  return p ? NextResponse.json(p) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req, { params }) {
  const body  = await req.json();
  const store = read();
  const idx   = store.products.findIndex(p => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store.products[idx] = { ...store.products[idx], ...body, id: params.id };
  write(store);
  return NextResponse.json({ success: true });
}

export async function DELETE(_, { params }) {
  const store = read();
  const idx   = store.products.findIndex(p => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store.products.splice(idx, 1);
  write(store);
  return NextResponse.json({ success: true });
}