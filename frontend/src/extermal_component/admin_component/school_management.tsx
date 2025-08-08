import { useEffect, useState } from "react";
import { api__admin_fetchAllCustomerForSMS } from "@/services/api";
import SignUpTable from "../reusable_component/table";

interface Customer {
  customer_id: string;
  school_name: string;
  package: string;
  renewal_date: string;
  student_count: number;
  staff_count: number;
  last_payment_date: string;
  is_verified: boolean;
}

export default function SubscribedSchoolManagementPackage() {
  const [allSMSCustomer, setAllSMSCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  // const [useMock, setUseMock] = useState(true); // toggle to false for API



  useEffect(() => {
    async function fetchAllDetails() {
      setLoading(true);
      try {
        const admin = await api__admin_fetchAllCustomerForSMS();
        const { rows } = admin.data
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin);
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

  async function handleUpdate(updatedRow: Customer) {
    try {
      // here you can make API call to save changes
      console.log("Updating row:", updatedRow);

      // update local state
      setAllSMSCustomers((prev) =>
        prev.map((row) =>
          row.customer_id === updatedRow.customer_id ? updatedRow : row
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <SignUpTable
          data={allSMSCustomer}
          pageSizeOptions={[10, 25, 50]}
          initialPageSize={10}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
