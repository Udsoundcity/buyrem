"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NIGERIAN_STATES } from "@/lib/constants/nigerian-states";
import { downloadCsv, ordersToCsv } from "@/lib/csv";
import OrderDetailModal from "./OrderDetailModal";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "postponed", label: "Postponed" },
  { value: "delivered", label: "Delivered" },
  { value: "unserious", label: "Unserious" },
];

const STATUS_STYLES = {
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  postponed: "bg-amber-50 text-amber-700 border-amber-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unserious: "bg-red-50 text-red-700 border-red-200",
};

function StatusBadgeSelect({ status, onChange }) {
  return (
    <select
      value={status || "submitted"}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/10 ${
        STATUS_STYLES[status] || STATUS_STYLES.submitted
      }`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

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

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(new Set());
  const [viewOrder, setViewOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  async function loadOrders() {
    setLoading(true);
    setLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError("Couldn't load orders. Please refresh the page.");
    } else {
      setOrders(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !q ||
        order.full_name.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q);
      const matchesState = !stateFilter || order.state === stateFilter;
      const matchesStatus = !statusFilter || (order.status || "submitted") === statusFilter;
      return matchesSearch && matchesState && matchesStatus;
    });
  }, [orders, search, stateFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageOrders = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [search, stateFilter, statusFilter]);

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllOnPage() {
    const pageIds = pageOrders.map((o) => o.id);
    const allSelected = pageIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this order? This can't be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setViewOrder(null);
    } else {
      alert("Couldn't delete this order. Please try again.");
    }
    setDeletingId(null);
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `Delete ${selected.size} selected order${
          selected.size > 1 ? "s" : ""
        }? This can't be undone.`
      )
    )
      return;

    setBulkDeleting(true);
    const supabase = createClient();
    const ids = Array.from(selected);
    const { error } = await supabase.from("orders").delete().in("id", ids);
    if (!error) {
      setOrders((prev) => prev.filter((o) => !selected.has(o.id)));
      setSelected(new Set());
    } else {
      alert("Couldn't delete the selected orders. Please try again.");
    }
    setBulkDeleting(false);
  }

  async function handleStatusChange(id, status) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (viewOrder?.id === id) setViewOrder((prev) => ({ ...prev, status }));

    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      setOrders(previous);
      alert("Couldn't update status. Please try again.");
    }
  }

  function handleExportCsv() {
    const rows =
      selected.size > 0 ? filtered.filter((o) => selected.has(o.id)) : filtered;
    if (rows.length === 0) return;
    const csv = ordersToCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `orders-${date}.csv`);
  }

  const pageIds = pageOrders.map((o) => o.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone number"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 sm:max-w-xs"
          />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 sm:w-56"
          >
            <option value="">All states</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 sm:w-44"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {bulkDeleting
                ? "Deleting..."
                : `Delete (${selected.size})`}
            </button>
          )}
          <button
            onClick={handleExportCsv}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            {selected.size > 0 ? `Export Selected (${selected.size})` : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            Loading orders...
          </div>
        ) : loadError ? (
          <div className="p-8 text-center text-sm text-red-600">
            {loadError}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No orders found.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm sm:table">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleSelectAllOnPage}
                      aria-label="Select all on page"
                    />
                  </th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pageOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleSelected(order.id)}
                        aria-label={`Select order from ${order.full_name}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {order.full_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{order.phone}</td>
                    <td className="px-4 py-3 text-neutral-600">{order.state}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatNaira(order.price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadgeSelect
                        status={order.status}
                        onChange={(status) => handleStatusChange(order.id, status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deletingId === order.id}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-neutral-100 sm:hidden">
              {pageOrders.map((order) => (
                <li key={order.id} className="flex flex-col gap-2 p-4">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleSelected(order.id)}
                      className="mt-1"
                      aria-label={`Select order from ${order.full_name}`}
                    />
                    <button
                      onClick={() => setViewOrder(order)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium text-neutral-900">
                        {order.full_name}
                      </p>
                      <p className="text-sm text-neutral-500">{order.phone}</p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {order.state} &middot; {formatDate(order.created_at)}
                      </p>
                    </button>
                    <span className="whitespace-nowrap text-sm font-medium text-neutral-900">
                      {formatNaira(order.price)}
                    </span>
                  </div>
                  <div className="pl-7">
                    <StatusBadgeSelect
                      status={order.status}
                      onChange={(status) => handleStatusChange(order.id, status)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-sm">
                <span className="text-neutral-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {viewOrder && (
        <OrderDetailModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
