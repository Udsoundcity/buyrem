import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data/products.json");

function read()        { return JSON.parse(fs.readFileSync(FILE, "utf-8")); }
function write(data)   { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }
function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function GET() {
  return NextResponse.json(read().products);
}

export async function POST(req) {
  const body  = await req.json();
  const store = read();
  const id    = body.id || slugify(body.name);
  if (store.products.find(p => p.id === id)) {
    return NextResponse.json({ error: "ID already exists" }, { status: 409 });
  }
  store.products.push({ ...body, id });
  write(store);
  return NextResponse.json({ success: true, id }, { status: 201 });
}