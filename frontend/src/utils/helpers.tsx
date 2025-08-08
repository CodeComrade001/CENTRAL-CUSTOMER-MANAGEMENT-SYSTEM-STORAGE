import type { FilterState, SchoolManagementRow, SortState } from "./types";

export type State = {
  page: number;
  pageSize: number;
  sort: SortState;
  filters: FilterState;
  editingId: string | null;
  loading: boolean;
  rows: SchoolManagementRow[]; // current page rows
  total: number; // total rows available (server-side) or filtered total (client-side)
};

export type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_SORT"; payload: SortState }
  | { type: "SET_FILTER"; payload: FilterState }
  | { type: "SET_ROWS"; payload: { rows: SchoolManagementRow[]; total: number } }
  | { type: "START_EDIT"; payload: string }
  | { type: "STOP_EDIT" }
  | { type: "UPDATE_LOCAL_ROW"; payload: SchoolManagementRow };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_FILTER":
      return { ...state, filters: action.payload, page: 1 };
    case "SET_ROWS":
      return { ...state, rows: action.payload.rows, total: action.payload.total };
    case "START_EDIT":
      return { ...state, editingId: action.payload };
    case "STOP_EDIT":
      return { ...state, editingId: null };
    case "UPDATE_LOCAL_ROW":
      return {
        ...state,
        rows: state.rows.map((r) => (r.customer_id === action.payload.customer_id ? action.payload : r)),
      };
    default:
      return state;
  }
}

// Safe formatter helpers
export function formatDate(d?: string) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
