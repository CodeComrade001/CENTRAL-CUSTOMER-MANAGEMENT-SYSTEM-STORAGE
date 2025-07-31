import { API__Admin_AllCustomers } from "@/services/api";
import TableFirstStructure from "../reusable_component/first_table_schema";
import { useEffect, useState } from "react";

const headers = [
  "email",
  "school_name",
  "computer_based_test_slot",
  "school_management_slot",
];

interface allCustomersDataType {
  id: number;
  email: string;
  school_name: string;
  computer_based_test_slot: number;
  school_management_slot: number;
  activate: boolean;
  deactivate: boolean;
  [key: string]: string | number | boolean;
}

export default function AllRegisteredCustomers() {
  const [allCustomer, setAllCustomers] = useState<allCustomersDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_AllCustomers();
        setAllCustomers(admin.data);
      } catch {
        setAllCustomers([]);
      }
    }
    fetchAllDetails();
  }, []);

  return (
    <TableFirstStructure
      tableCaption="This is a table to show all my customers and their subscribed package"
      headers={headers}
      data={allCustomer}
    />
  );
}
