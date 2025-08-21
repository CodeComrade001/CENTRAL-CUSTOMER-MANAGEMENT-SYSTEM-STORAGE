/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { api__admin_changeCustomerVerificationForCBT, api__admin_changeSlotForCBT, api__admin_fetchAllCustomerForCBT } from "@/services/api";
import type { ColumnDef } from "../reusable_component/table";
import GenericTable from "../reusable_component/table";

interface Customer {
  customer_id: string,
  center_name: string,
  available_slot: number,
  used_slot: number,
  number_of_server: number,
  last_slot_purchase: string,
  last_login: string
  is_verified: boolean,
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function SubscribedCBTManagementPackage() {
  const [allSMSCustomer, setAllSMSCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // alert state used by GenericTable via onAlert
  const [alert, setAlert] = useState<{ msg: string; ok: boolean } | null>(null);

  // date format choice: 'long' => "5th August 2023", 'short' => "05/25/20"
  const [dateFormat, setDateFormat] = useState<"long" | "short">("long");

  useEffect(() => {
    async function fetchAllDetails() {
      setLoading(true);
      try {
        const admin = await api__admin_fetchAllCustomerForCBT();
        const { rows } = admin.data ?? {};
        setAllSMSCustomers(rows || []);
      } catch {
        setAllSMSCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllDetails();
  }, []);

  // Format function passed into GenericTable
  const formatDateFn = useCallback(
    (v?: any) => {
      if (!v) return "-";
      const d = new Date(String(v));
      if (Number.isNaN(d.getTime())) {
        // fallback: try to parse flexible-ish formats (minimal)
        // If invalid, return original string
        return String(v);
      }
      if (dateFormat === "short") {
        // mm/dd/yy
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yy = String(d.getFullYear()).slice(-2);
        return `${mm}/${dd}/${yy}`;
      }
      // long: "5th August 2023"
      const day = d.getDate();
      const month = d.toLocaleString(undefined, { month: "long" });
      const year = d.getFullYear();
      return `${ordinal(day)} ${month} ${year}`;
    },
    [dateFormat]
  );

  // Columns mapping for GenericTable
  const columns: ColumnDef<Customer>[] = [
    { key: "customer_id", label: "Customer ID", sortable: true, editable: false, type: "string" },
    { key: "center_name", label: "Center Name", sortable: true, editable: false, type: "string" },
    { key: "available_slot", label: "Avaiable Slot", sortable: true, editable: true, type: "number" },
    { key: "used_slot", label: "Used Slot", sortable: true, editable: false, type: "number" },
    { key: "number_of_server", label: "No Of Servers", sortable: true, editable: false, type: "number" },
    { key: "last_slot_purchase", label: "Last Slot Purchase", sortable: true, editable: false, type: "date" },
    { key: "last_login", label: "Last Login", sortable: true, editable: false, type: "date" },
    { key: "is_verified", label: "status", sortable: true, editable: true, type: "boolean" },
  ];

  // onUpdate passed to GenericTable. It MUST return a "status" to be treated as success in GenericTable.
  // Here we optimistic-update local state and return the expected shape.
  async function handleUpdate(updatedRow: Customer) {
    try {
      const id = updatedRow.customer_id;
      if (!id) return { status: 400, message: "Missing customer_id" };

      // snapshot current row from state
      const existing = allSMSCustomer.find((r) => r.customer_id === id);
      if (!existing) {
        return { status: 404, message: "Row not found locally" };
      }

      // detect which fields actually changed (only check editable fields)
      const changedIsVerified = existing.is_verified !== updatedRow.is_verified;
      const changedPackage = existing.available_slot !== updatedRow.available_slot;

      // nothing changed — no API call, no state update
      if (!changedIsVerified && !changedPackage) {
        return { status: 200, message: "No changes detected for user  verification" };
      }

      // prepare API calls for only the changed fields
      const calls: Promise<any>[] = [];
      if (changedIsVerified) {
        // api__admin_changeCustomerVerificationForSMS expects { customer_id, status }
        calls.push(api__admin_changeCustomerVerificationForCBT({ customer_id: id, status: updatedRow.is_verified }));
      }
      if (changedPackage) {
        // api__admin_changeCustomerPackageForSMS expects { customer_id, newPackage }
        calls.push(api__admin_changeSlotForCBT({ customer_id: id, newSlot: updatedRow.available_slot }));
      }

      // execute calls in parallel and capture any failures
      const results = await Promise.allSettled(calls);

      // If any call failed -> abort and return failure (no local mutation)
      const rejected = results.find((r) => r.status === "rejected");
      if (rejected) {
        return { status: 500, message: "Failed to update on server" };
      }

      // Optionally inspect fulfilled results for non-200 shapes if needed.
      // For now treat any fulfilled as success (you can add shape checks here).
      // Merge only changed fields into the existing local row
      setAllSMSCustomers((prev) =>
        prev.map((r) =>
          r.customer_id === id
            ? {
              ...r,
              // keep everything else exactly the same, only apply what's changed
              ...(changedIsVerified ? { is_verified: updatedRow.is_verified } : {}),
              ...(changedPackage ? { available_slot: updatedRow.available_slot } : {}),
            }
            : r
        )
      );

      return { status: 200, message: "Saved successfully" };
    } catch {
      return { status: 500, message: "Update failed" };
    }
  }

  return (
    <div className="p-4 w-[100%] h-[100%]" >
      <div className="mb-3 flex items-center gap-3">
        <label className="text-sm">Date format:</label>
        <select title="select date format" value={dateFormat} onChange={(e) => setDateFormat(e.target.value as any)} className="p-2 border rounded">
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </div>

      {alert ? (
        <div className={`p-2 mb-3 rounded ${alert.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {alert.msg}
        </div>
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : (
        // ensure container has explicit height so GenericTable's 100% height works.
        <div style={{ height: 600 }}>
          <GenericTable<Customer>
            data={allSMSCustomer}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialPageSize={50}
            onUpdate={handleUpdate}
            onAlert={(message, ok) => setAlert({ msg: message, ok })}
            formatDateFn={formatDateFn}
            className="h-full"
          />
        </div>
      )}
    </div>
  );
}
