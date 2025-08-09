/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { api__admin_fetchAllCustomerForCBT } from "@/services/api";
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
      } catch (err) {
        console.error("Error fetching data:", err);
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
      // TODO: replace with real update API call if you have one — e.g.
      // await api__admin_updateCustomer(updatedRow)
      // and return that API's response (or {status:200, message:'OK'}).

      // For now: update local state
      setAllSMSCustomers((prev) => prev.map((r) => (r.customer_id === updatedRow.customer_id ? updatedRow : r)));

      // simulate server success response
      return { status: 200, message: "Saved successfully" };
    } catch (err) {
      console.error("Update failed:", err);
      // return failure shape
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
