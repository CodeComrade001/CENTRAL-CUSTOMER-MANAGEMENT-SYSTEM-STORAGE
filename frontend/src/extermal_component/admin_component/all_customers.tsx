import { API__Admin_AllCustomers } from "@/services/api";
import TableFirstStructure from "../reusable_component/first_table_schema";
import { useEffect, useState } from "react";

const headers = [
  "school_id",
  "email",
  "school_name",
  "computer_based_test_slot",
  "school_management_slot",
  "status",
  "computer_based_test",
  "school_management",
  "health_management",
];

interface allCustomersDataType {
  id: number;
  email: string;
  school_name: string;
  computer_based_test_slot: string;
  school_management_slot: string;
  activate: boolean;
  deactivate: boolean;
  computer_based_test: boolean;
  school_management: boolean;
  health_management: boolean;
  [key: string]: string | number | boolean;
}

export default function AllRegisteredCustomers() {
  const [allCustomer, setAllCustomers] = useState<allCustomersDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_AllCustomers();
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin.data);
        setAllCustomers(admin.data); // <-- you forgot to update state
      } catch (err) {
        console.log("Turbo Log  ~ fetchAllDetails ~ err:", err);
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
