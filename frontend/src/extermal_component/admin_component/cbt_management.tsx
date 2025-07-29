import { API__Admin_CBT_AllDetails } from "@/services/api";
import TableSecondStructure from "../reusable_component/second_table_schems";
import { useEffect, useState } from "react";

const headers = [
  "id",
  "email",
  "school_name",
  "school_management_slot",
  " used_school_management_slot",
];

interface subscribedSMSDataType {
  id: number
  email: string
  school_name: string
  school_management_slot: number
  used_school_management_slot: number

  [key: string]: string | number;
}

export default function SubscribedSchoolsCbtPackage() {
  const [allCBTCustomer, setAllCBTCustomers] = useState<subscribedSMSDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_CBT_AllDetails();
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin.data);
        setAllCBTCustomers(admin.data); // <-- you forgot to update state
      } catch (err) {
        console.log("Turbo Log  ~ fetchAllDetails ~ err:", err);
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
