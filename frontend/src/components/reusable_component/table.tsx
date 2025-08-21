/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useReducer } from "react";
import { reducer, formatDate as helperFormatDate } from "@/utils/helpers";
import DbLoading from "./DBloading";

/**
 * Column definition for the generic table.
 * - key: property name on your row objects (string)
 * - label: human-readable column header
 * - sortable?: allow sorting
 * - editable?: whether the cell is editable inline
 * - type?: 'string'|'number'|'date'|'boolean' (date type enables date-aware filtering)
 * - render?: optional custom cell renderer (value, row, editing) => ReactNode
 */
export type ColumnDef<T = any> = {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  type?: "string" | "number" | "date" | "boolean" | "dropdown_column";
  render?: (value: any, row: T, editing: boolean) => React.ReactNode;
};

type ColumnDropdownDef<K = string, V = string | number> = {
  key: K;
  columnVal: V[];
};
type FetchArgs = { page: number; pageSize: number; filters: any; sort: any };
type FetchResult<T> = { rows: T[]; total: number };

type GenericTableProps<T = any> = {
  data?: T[]; // local client data.
  columns?: ColumnDef<T>[];
  serverSide?: boolean;
  fetchData?: (args: FetchArgs) => Promise<FetchResult<T>>;
  onUpdate?: (row: T) => Promise<any>; // function that updates a row on backend; should return {status, message} or a fetch Response or throw
  onAlert?: (message: string, success: boolean) => void; // alert component handler
  initialPageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  columnDropdowns?: ColumnDropdownDef<string, string | number>[] | Record<string, (string | number)[]>;
  // optional formatter for date display (value) => string
  formatDateFn?: (v?: any) => string;
};

export default function GenericTable<T extends { [k: string]: any; customer_id?: string }>(
  props: GenericTableProps<T>
) {
  const {
    data = [],
    columns = [],
    serverSide = false,
    fetchData,
    onUpdate,
    onAlert,
    initialPageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
    className = "",
    columnDropdowns = [], // <- ADD THIS
    formatDateFn,
  } = props;

  // NOTE: helper reducer and State type reference SchoolManagementRow in your helpers file.
  // We keep using reducer for actions but relax types here; initialState is shaped to match helper expectations.
  const initialState = {
    page: 1,
    pageSize: initialPageSize,
    sort: { column: null, direction: null },
    filters: { global: "", columnFilters: {} },
    editingId: null,
    filteringColumn: columns.length ? columns[0].key : "",
    loading: false,
    rows: [] as T[],
    total: 0,
  } as any;

  const [state, dispatch] = useReducer(reducer as any, initialState);

  // utility: normalize/parse many human date formats into Date object (best-effort)
  function parseDateFlexible(input: any): Date | null {
    if (input == null) return null;
    if (input instanceof Date && !Number.isNaN(input.getTime())) return input;
    let s = String(input).trim();

    // remove ordinal suffixes like "1st", "2nd", "3rd", "4th"
    s = s.replace(/\b(\d+)(st|nd|rd|th)\b/gi, "$1");

    // remove "of" (e.g. "5th of August 2023" -> "5 August 2023")
    s = s.replace(/\bof\b/gi, " ");

    // Try default Date parse
    const d1 = new Date(s);
    if (!Number.isNaN(d1.getTime())) return d1;

    // Try common slash formats: MM/DD/YY(YY) or DD/MM/YY(YY)
    const slashMatch = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (slashMatch) {
      const p1 = Number(slashMatch[1]);
      const p2 = Number(slashMatch[2]);
      let p3 = Number(slashMatch[3]);
      if (p3 < 100) p3 += p3 < 70 ? 2000 : 1900; // heuristic for 2-digit years

      // Heuristic: if first part > 12, interpret as DD/MM/YYYY
      if (p1 > 12) {
        return new Date(p3, p2 - 1, p1);
      }
      // otherwise MM/DD/YYYY
      return new Date(p3, p1 - 1, p2);
    }

    // Try "Month DD YYYY" by swapping common separators
    const spaced = s.replace(/[-/,]/g, " ");
    const d2 = new Date(spaced);
    if (!Number.isNaN(d2.getTime())) return d2;


    return null;
  }

  // format date display: prefer user-provided fn, fallback to helper.formatDate
  const formatDate = (v?: any) => {
    if (!v) return "-";
    if (formatDateFn) {
      try {
        return formatDateFn(v);
      } catch {
        // fall back
      }
    }
    return helperFormatDate(String(v));
  };

  // Derived client-side filtered + sorted data (only used in client mode)
  const clientProcessed = useMemo(() => {
    const g = (state.filters.global || "").trim().toLowerCase();
    let filtered = (data || []).slice();

    if (g) {
      filtered = filtered.filter((r) =>
        Object.values(r).some((val) => String(val ?? "").toLowerCase().includes(g))
      );
    }

    // column filters: be date-aware if column.type === 'date'
    Object.entries(state.filters.columnFilters || {}).forEach(([k, v]) => {
      if (v === undefined || v === "") return;
      const col = columns.find((c) => String(c.key) === k);
      if (col && col.type === "date") {
        // parse filter value and compare by date equality (or substring of year/month/day)
        const filterDate = parseDateFlexible(v);
        if (filterDate) {
          const fv = filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((r) => {
            const val = (r as any)[k];
            const rowDate = parseDateFlexible(val);
            if (!rowDate) return false;
            return rowDate.setHours(0, 0, 0, 0) === fv;
          });
        } else {
          // if filter could not be parsed, fallback to string include
          filtered = filtered.filter((r) => String((r as any)[k] ?? "").toLowerCase().includes(String(v).toLowerCase()));
        }
      } else {
        // non-date columns: substring match (case-insensitive)
        filtered = filtered.filter((r) =>
          String((r as any)[k] ?? "").toLowerCase().includes(String(v).toLowerCase())
        );
      }
    });

    // sorting
    if (state.sort.column && state.sort.direction) {
      const colKey = state.sort.column;
      const dir = state.sort.direction === "asc" ? 1 : -1;
      filtered.sort((a: T, b: T) => {
        const av = (a as any)[colKey];
        const bv = (b as any)[colKey];
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        // if date type column, try date compare
        const colDef = columns.find((c) => c.key === colKey);
        if (colDef?.type === "date") {
          const da = parseDateFlexible(av);
          const db = parseDateFlexible(bv);
          if (da && db) return (da.getTime() - db.getTime()) * dir;
        }
        return String(av).localeCompare(String(bv)) * dir;
      });
    }

    const total = filtered.length;
    const start = (state.page - 1) * state.pageSize;
    const pageRows = filtered.slice(start, start + state.pageSize);
    return { rows: pageRows, total };
  }, [data, state.page, state.pageSize, state.filters, state.sort, columns]);

  // Fetching logic (server-side) or derive local page
  useEffect(() => {
    let isMounted = true;
    async function load() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        if (serverSide) {
          if (!fetchData) throw new Error("fetchData is required in serverSide mode");
          const result = await fetchData({
            page: state.page,
            pageSize: state.pageSize,
            filters: state.filters,
            sort: state.sort,
          });
          if (!isMounted) return;
          dispatch({ type: "SET_ROWS", payload: { rows: result.rows, total: result.total } });
        } else {
          const { rows, total } = clientProcessed;
          dispatch({ type: "SET_ROWS", payload: { rows, total } });
        }
      } catch (err) {
        // keep error handling minimal (the caller can supply onAlert too)
        console.error(err);
        onAlert?.("Failed to load rows", false);
      } finally {
        if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    load();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSide, fetchData, clientProcessed, state.page, state.pageSize, state.filters, state.sort]);

  // Sorting
  const toggleSort = (colKey: string) => {
    const current = state.sort || {};
    if (current.column !== colKey) {
      dispatch({ type: "SET_SORT", payload: { column: colKey, direction: "asc" } });
    } else if (current.direction === "asc") {
      dispatch({ type: "SET_SORT", payload: { column: colKey, direction: "desc" } });
    } else {
      dispatch({ type: "SET_SORT", payload: { column: null, direction: null } });
    }
  };

  const startEditing = (id: string) => dispatch({ type: "START_EDIT", payload: id });
  const stopEditing = () => dispatch({ type: "STOP_EDIT" });

  // Local update of a row in UI while editing
  const onChangeCell = (id: string, key: string, value: any) => {
    const row = (state.rows || []).find((r: T) => r.customer_id === id);
    if (!row) return;
    const updated = { ...row, [key]: value } as T;
    dispatch({ type: "UPDATE_LOCAL_ROW", payload: updated });
  };

  // Save row -> call onUpdate, handle various return shapes.
  const saveRow = async (row: T) => {
    if (!onUpdate) {
      // just update locally
      dispatch({ type: "UPDATE_LOCAL_ROW", payload: row });
      stopEditing();
      onAlert?.("Updated locally (no onUpdate provided)", true);
      return;
    }
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await onUpdate(row);

      // Flexible result handling:
      // - If fetch Response: check status and try to parse message
      // - If {status, message}: use those
      // - If undefined / truthy: treat as success
      let ok = false;
      let message = "Updated successfully";
      if (result instanceof Response) {
        ok = result.status === 200;
        let json: any;
        try {
          json = await result.json().catch(() => null);
          if (json && json.message) message = json.message;
        } catch {
          // ignore
        }
        if (!json && typeof (await result.text().catch(() => "")) === "string") {
          // maybe text
        }
      } else if (result && typeof result === "object" && "status" in result) {
        ok = result.status === 200 || result.status === "200";
        message = result.message ?? message;
      } else if (result === undefined || result) {
        // treat as success (some callers return nothing)
        ok = true;
        if (typeof result === "string") message = result;
      }

      // update local copy always on success
      if (ok) {
        dispatch({ type: "UPDATE_LOCAL_ROW", payload: row });
        onAlert?.(message, true);
        stopEditing()
      } else {
        const errMsg = (result && result.message) || "Failed to update";
        onAlert?.(errMsg, false);
        stopEditing()
      }
    } catch (err) {
      console.error(err);
      onAlert?.("Failed to save. See console for details.", false);
      stopEditing()
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const rowsToRender: T[] = state.rows || [];

  // helper to render cell default value (format dates, booleans)
  const renderCellValue = (col: ColumnDef<T>, row: T, editing: boolean, dropDowns?: ColumnDropdownDef<string, string | number>[] | Record<string, (string | number)[]>) => {
    const key = col.key;
    const val = (row as any)[key];
    if (editing && col.editable) {
      // inline editor based on type
      if (col.type === "boolean") {
        return (
          <select
            title="select cell"
            value={String(!!val)}
            onChange={(e) => onChangeCell(row.customer_id!, key, e.target.value === "true")}
            className="p-1 border rounded"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      }
      if (col.type === "dropdown_column") {
        // handle both shapes: array-of-defs OR record lookup
        let dropdownVals: (string | number)[] | undefined;
        if (Array.isArray(dropDowns)) {
          const def = dropDowns.find((dd) => String(dd.key) === col.key);
          dropdownVals = def?.columnVal;
        } else if (dropDowns && typeof dropDowns === "object") {
          dropdownVals = (dropDowns as Record<string, (string | number)[]>)[col.key];
        }

        if (!dropdownVals || !dropdownVals.length) return val; // fallback if no dropdown defined

        return (
          <select
            title="select cell"
            value={val ?? ""}
            onChange={(e) => onChangeCell(row.customer_id!, key, e.target.value)}
            className="p-1 border rounded"
          >
            {dropdownVals.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }
      if (col.type === "number") {
        return (
          <input
            title="select number"
            type="number"
            value={val ?? ""}
            onChange={(e) => onChangeCell(row.customer_id!, key, e.target.value === "" ? null : Number(e.target.value))}
            className="p-1 border rounded w-full"
          />
        );
      }
      // default text/date editor
      return (
        <input
          placeholder="Input date"
          value={val ?? ""}
          onChange={(e) => onChangeCell(row.customer_id!, key, e.target.value)}
          className="p-1 border rounded w-full"
        />
      );
    }

    // not editing - custom render if provided
    if (col.render) return col.render(val, row, editing);

    // boolean -> colored badge (for is_verified-like fields)
    if (col.type === "boolean") {
      const ok = !!val;
      return (
        <span
          className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {String(ok)}
        </span>
      );
    }

    if (col.type === "date") {
      return formatDate(val);
    }

    return val == null ? "-" : String(val);
  };

  return (
    <div className={`w-full h-full ${className}`} style={{ width: "100%", height: "100%" }}>
      {/* FILTER + CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex-1 flex gap-2">
          <input
            aria-label="Search"
            placeholder="Search all columns..."
            className="w-full md:w-96 p-2 border rounded-lg"
            value={state.filters.global || ""}
            onChange={(e) => dispatch({ type: "SET_FILTER", payload: { ...state.filters, global: e.target.value } })}
          />

          <div>
            <input
              placeholder={`Filter ${state.filteringColumn}`}
              className="p-2 border rounded-lg"
              value={(state.filters.columnFilters || {})[state.filteringColumn] ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_FILTER",
                  payload: {
                    ...state.filters,
                    columnFilters: {
                      ...state.filters.columnFilters,
                      [state.filteringColumn]: e.target.value,
                    },
                  },
                })
              }
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Select {state.filteringColumn}</label>
              <select
                title="select row"
                className="p-2 border rounded-lg"
                value={state.filteringColumn}
                onChange={(e) => dispatch({ type: "SET_COLUMN_FOR_FILTER", payload: e.target.value })}
              >
                {columns.map((cols) => (
                  <option key={String(cols.key)} value={cols.key}>
                    {cols.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Rows:</label>
          <select
            title="select row"
            className="p-2 border rounded-lg"
            value={state.pageSize}
            onChange={(e) => dispatch({ type: "SET_PAGE_SIZE", payload: Number(e.target.value) })}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE (fills container, scrolls if overflow) */}
      <div className="w-full h-full bg-white relative rounded-lg shadow-sm overflow-auto">
        <table className="min-w-full divide-y " style={{ tableLayout: "auto" }}>
          <thead className="bg-gray-50 sticky">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">No</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                  <button className="flex items-center gap-2" onClick={() => c.sortable && toggleSort(c.key)}>
                    <span>{c.label}</span>
                    {state.sort.column === c.key ? <span className="text-xs">{state.sort.direction === "asc" ? "▲" : "▼"}</span> : null}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {state.loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-gray-500">
                  <div style={{ height: 600 }}>
                    <DbLoading message="Storing Data..." />
                  </div>
                </td>
              </tr>
            ) : rowsToRender.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-gray-500">
                  <div style={{ height: 600 }}>
                    <DbLoading message="No more row to display" />
                  </div>
                </td>
              </tr>
            ) : (
              rowsToRender.map((row, rowIndex) => {
                const editing = state.editingId === row.customer_id;
                return (
                  <tr key={row.customer_id ?? rowIndex} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{(state.page - 1) * state.pageSize + rowIndex + 1}</td>

                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-3 py-2 text-sm">
                        {col.render ? col.render((row as any)[col.key], row, editing) : renderCellValue(col, row, editing, columnDropdowns)}
                      </td>
                    ))}

                    <td className="px-3 py-2 text-sm flex gap-2">
                      {editing ? (
                        <>
                          <button onClick={() => saveRow(row)} className="px-3 py-1 bg-black text-white rounded">
                            Save
                          </button>
                          <button onClick={() => stopEditing()} className="px-3 py-1 border rounded">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEditing(row.customer_id ?? String(rowIndex))} className="px-3 py-1 border rounded">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="mt-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Showing {(state.page - 1) * state.pageSize + 1} - {Math.min(state.page * state.pageSize, state.total)} of {state.total}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: "SET_PAGE", payload: Math.max(1, state.page - 1) })}
            disabled={state.page === 1}
            className="px-3 py-1 border rounded disabled:opacity-60"
          >
            Prev
          </button>

          <div className="px-3 py-1 border rounded">Page {state.page}</div>

          <button
            onClick={() => dispatch({ type: "SET_PAGE", payload: state.page + 1 })}
            disabled={state.page * state.pageSize >= state.total}
            className="px-3 py-1 border rounded disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
