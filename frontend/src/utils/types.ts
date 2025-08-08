export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export type SchoolManagementRow = {
  customer_id: string;
  school_name: string;
  package: string;
  renewal_date: string; // ISO string or human-friendly
  student_count: number;
  staff_count: number;
  last_payment_date: string;
  is_verified: boolean;
};

export type SortState = { column: keyof SchoolManagementRow | null; direction: "asc" | "desc" | null };

export type FilterState = {
  global: string;
  columnFilters: Partial<Record<keyof SchoolManagementRow, string | number>>;
};

export type FetchParams = {
  page: number;
  pageSize: number;
  filters: FilterState;
  sort: SortState;
};

export type FetchResult = { rows: SchoolManagementRow[]; total: number };

export type SchoolManagementProps = {
  data?: SchoolManagementRow[]; // required for client-side mode
  serverSide?: boolean;
  fetchData?: (params: FetchParams) => Promise<FetchResult>;
  onUpdate?: (row: SchoolManagementRow) => Promise<void> | void;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
};


