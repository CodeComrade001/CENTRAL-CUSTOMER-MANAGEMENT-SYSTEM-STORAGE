import { formatDate, reducer, type State } from "@/utils/helpers";
import type { SchoolManagementProps, SchoolManagementRow } from "@/utils/types";
import { useEffect, useMemo, useReducer } from "react";

export default function SignUpTable(props: SchoolManagementProps) {
  const {
    data = [],
    serverSide = false,
    fetchData,
    onUpdate,
    initialPageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
    className = "",
  } = props;

  const initialState: State = {
    page: 1,
    pageSize: initialPageSize,
    sort: { column: null, direction: null },
    filters: { global: "", columnFilters: {} },
    editingId: null,
    loading: false,
    rows: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Derived client-side filtered + sorted data (only used in client mode)
  const clientProcessed = useMemo(() => {
    // apply global filter then column filters
    const g = state.filters.global.trim().toLowerCase();
    let filtered = data.slice();
    if (g) {
      filtered = filtered.filter((r) =>
        Object.values(r).some((val) => String(val).toLowerCase().includes(g))
      );
    }
    // column filters
    Object.entries(state.filters.columnFilters).forEach(([k, v]) => {
      if (v === undefined || v === "") return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((r) => String((r as any)[k]).toLowerCase().includes(String(v).toLowerCase()));
    });

    // sort
    if (state.sort.column && state.sort.direction) {
      const col = state.sort.column;
      const dir = state.sort.direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const av = (a as any)[col];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bv = (b as any)[col];
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }

    const total = filtered.length;
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const pageRows = filtered.slice(start, end);
    return { rows: pageRows, total };
  }, [data, state.page, state.pageSize, state.filters, state.sort]);

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
          // client-side: use memoized processing
          const { rows, total } = clientProcessed;
          dispatch({ type: "SET_ROWS", payload: { rows, total } });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [serverSide, fetchData, clientProcessed, state.page, state.pageSize, state.filters, state.sort]);

  // Column definitions
  const columns: { key: keyof SchoolManagementRow; label: string; sortable?: boolean }[] = [
    { key: "customer_id", label: "Customer ID", sortable: true },
    { key: "school_name", label: "School / Center Name", sortable: true },
    { key: "package", label: "Package", sortable: true },
    { key: "renewal_date", label: "Renewal Date", sortable: true },
    { key: "student_count", label: "Students", sortable: true },
    { key: "staff_count", label: "Staff", sortable: true },
    { key: "last_payment_date", label: "Last Payment", sortable: true },
    { key: "is_verified", label: "Verified", sortable: true },
    // actions column
  ];

  const toggleSort = (col: keyof SchoolManagementRow) => {
    const current = state.sort;
    if (current.column !== col) {
      dispatch({ type: "SET_SORT", payload: { column: col, direction: "asc" } });
    } else if (current.direction === "asc") {
      dispatch({ type: "SET_SORT", payload: { column: col, direction: "desc" } });
    } else if (current.direction === "desc") {
      dispatch({ type: "SET_SORT", payload: { column: null, direction: null } });
    }
  };

  const startEditing = (id: string) => dispatch({ type: "START_EDIT", payload: id });
  const stopEditing = () => dispatch({ type: "STOP_EDIT" });

  const saveRow = async (row: SchoolManagementRow) => {
    if (!onUpdate) return;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await onUpdate(row);
      dispatch({ type: "UPDATE_LOCAL_ROW", payload: row });
      stopEditing();
    } catch (err) {
      console.error(err);
      // In production you'd want to show a user-friendly toast / inline error
      alert("Failed to save. See console for details.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeCell = (id: string, key: keyof SchoolManagementRow, value: any) => {
    const row = state.rows.find((r) => r.customer_id === id);
    if (!row) return;
    const updated: SchoolManagementRow = { ...row, [key]: value } as SchoolManagementRow;
    dispatch({ type: "UPDATE_LOCAL_ROW", payload: updated });
  };

  // Table rows to render
  const rowsToRender = state.rows;

  return (
    <div className={`w-full ${className}`}>
      {/* FILTER + CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex-1 flex gap-2">
          <input
            aria-label="Search"
            placeholder="Search all columns..."
            className="w-full md:w-96 p-2 border rounded-lg"
            value={state.filters.global}
            onChange={(e) => dispatch({ type: "SET_FILTER", payload: { ...state.filters, global: e.target.value } })}
          />

          {/* Example of quick column filter: package */}
          <input
            placeholder="Filter package"
            className="p-2 border rounded-lg"
            value={(state.filters.columnFilters.package as string) ?? ""}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER", payload: { ...state.filters, columnFilters: { ...state.filters.columnFilters, package: e.target.value } } })
            }
          />
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

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  scope="col"
                  className="px-3 py-2 text-left text-sm font-medium text-gray-700"
                >
                  <button className="flex items-center gap-2" onClick={() => c.sortable && toggleSort(c.key)}>
                    <span>{c.label}</span>
                    {state.sort.column === c.key ? (
                      <span className="text-xs">{state.sort.direction === "asc" ? "▲" : "▼"}</span>
                    ) : null}
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
                  Loading...
                </td>
              </tr>
            ) : rowsToRender.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-gray-500">
                  No rows to display
                </td>
              </tr>
            ) : (
              rowsToRender.map((row) => {
                const editing = state.editingId === row.customer_id;
                return (
                  <tr key={row.customer_id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{row.customer_id}</td>
                    <td className="px-3 py-2 text-sm">
                      {editing ? (
                        <input value={row.school_name} title="school_name" onChange={(e) => onChangeCell(row.customer_id, "school_name", e.target.value)} className="p-1 border rounded w-full" />
                      ) : (
                        row.school_name
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {editing ? (
                        <input value={row.package} title="package" onChange={(e) => onChangeCell(row.customer_id, "package", e.target.value)} className="p-1 border rounded w-full" />
                      ) : (
                        row.package
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">{editing ? (
                      <input value={row.renewal_date} title="renewal date" onChange={(e) => onChangeCell(row.customer_id, "renewal_date", e.target.value)} className="p-1 border rounded w-full" />
                    ) : (
                      formatDate(row.renewal_date)
                    )}</td>
                    <td className="px-3 py-2 text-sm">
                      {editing ? (
                        <input type="number" title="student count" value={row.student_count} onChange={(e) => onChangeCell(row.customer_id, "student_count", Number(e.target.value))} className="p-1 border rounded w-24" />
                      ) : (
                        row.student_count
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {editing ? (
                        <input type="number" title="staff_count" value={row.staff_count} onChange={(e) => onChangeCell(row.customer_id, "staff_count", Number(e.target.value))} className="p-1 border rounded w-24" />
                      ) : (
                        row.staff_count
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">{editing ? (
                      <input title="last payment date" value={row.last_payment_date} onChange={(e) => onChangeCell(row.customer_id, "last_payment_date", e.target.value)} className="p-1 border rounded w-full" />
                    ) : (
                      formatDate(row.last_payment_date)
                    )}</td>
                    <td className="px-3 py-2 text-sm">{String(row.is_verified)}</td>

                    <td className="px-3 py-2 text-sm flex gap-2">
                      {/* Only allow edit if verified */}
                      {row.is_verified ? (
                        editing ? (
                          <>
                            <button onClick={() => saveRow(row)} className="px-3 py-1 bg-black text-white rounded">Save</button>
                            <button onClick={() => stopEditing()} className="px-3 py-1 border rounded">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => startEditing(row.customer_id)} className="px-3 py-1 border rounded">Edit</button>
                        )
                      ) : (
                        <span className="text-xs italic text-gray-500">Not editable</span>
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
