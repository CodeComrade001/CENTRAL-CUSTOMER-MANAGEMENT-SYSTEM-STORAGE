import { API__Admin_SchoolManagement_AllDetails } from "@/services/api";
import TableSecondStructure from "../reusable_component/second_table_schems";
import { useEffect, useState } from "react";

const headers = [
  "email",
  "school_name",
  "school_management_slot",
];

interface subscribedSMSDataType {
  id: number
  email: string
  school_name: string
  school_management_slot: number

  [key: string]: string | number;
}

export default function SubscribedSchoolManagementPackage() {
  const [allSMSCustomer, setAllSMSCustomers] = useState<subscribedSMSDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_SchoolManagement_AllDetails();
        setAllSMSCustomers(admin.data); // <-- you forgot to update state
      } catch {
        setAllSMSCustomers([]); // <-- you forgot to update state
      }
    }
    fetchAllDetails();
  }, []);

  return (
    <TableSecondStructure
      tableCaption="Schools Subscribed to School Management Package"
      headers={headers}
      data={allSMSCustomer}
    />
  );
}
