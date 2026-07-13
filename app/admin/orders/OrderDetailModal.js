"use client";

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "postponed", label: "Postponed" },
  { value: "delivered", label: "Delivered" },
  { value: "unserious", label: "Unserious" },
];

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrderDetailModal({ order, onClose, onDelete, onStatusChange }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Order details
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-neutral-800">
            Status
          </label>
          <select
            value={order.status || "submitted"}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Full Name" value={order.full_name} />
          <Row label="Phone Number" value={order.phone} />
          <Row label="Address" value={order.address} />
          <Row label="State" value={order.state} />
          <Row label="Product" value={order.product_name} />
          {order.tier_label && <Row label="Quantity Option" value={order.tier_label} />}
          <Row label="Price" value={formatNaira(order.price)} />
          <Row label="Submitted" value={formatDate(order.created_at)} />
        </dl>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700"
          >
            Close
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Delete order
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-100 pb-2">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
