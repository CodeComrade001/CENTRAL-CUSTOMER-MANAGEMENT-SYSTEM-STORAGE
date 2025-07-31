import { API__Admin_CBT_AllDetails } from "@/services/api";
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

export default function SubscribedSchoolsCbtPackage() {
  const [allCBTCustomer, setAllCBTCustomers] = useState<subscribedSMSDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_CBT_AllDetails();
        setAllCBTCustomers(admin.data); // <-- you forgot to update state
      } catch {
        setAllCBTCustomers([]); // <-- you forgot to update state
      }
    }
    fetchAllDetails();
  }, []);
  return (
    <TableSecondStructure
      tableCaption="Schools Subscribed to CBT Package"
      headers={headers}
      data={allCBTCustomer}
    />

  );
}
