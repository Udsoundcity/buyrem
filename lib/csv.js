function escapeCsvValue(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_COLUMNS = [
  { key: "full_name", label: "Full Name" },
  { key: "phone", label: "Phone Number" },
  { key: "address", label: "Address" },
  { key: "state", label: "State" },
  { key: "product_name", label: "Product" },
  { key: "tier_label", label: "Quantity Option" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Date" },
];

export function ordersToCsv(orders) {
  const header = CSV_COLUMNS.map((c) => escapeCsvValue(c.label)).join(",");
  const rows = orders.map((order) =>
    CSV_COLUMNS.map((c) => escapeCsvValue(order[c.key])).join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
