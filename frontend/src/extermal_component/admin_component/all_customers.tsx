import { APi__FetchUserDeails } from "@/services/api";
import TableFirstStructure from "../reusable_component/first_table_schema";
import { useEffect } from "react";

const headers = [
  'Subscription ID',
  'Customer Name',
  'Slot',
  'CBT',
  'School Management',
  'Health Management'
];

const data = [
  {
    subscriptionid: 'SUB004',
    customername: 'Emily Johnson',
    slot: 5000,
    cbt: 'Active',
    schoolmanagement: 'Active',
    healthmanagement: 'DeActivated'
  },
  {
    subscriptionid: 'SUB004',
    customername: 'Emily Johnson',
    slot: 5000,
    cbt: 'Active',
    schoolmanagement: 'Active',
    healthmanagement: 'DeActivated'
  },
  {
    subscriptionid: 'SUB004',
    customername: 'Emily Johnson',
    slot: 5000,
    cbt: 'Active',
    schoolmanagement: 'Active',
    healthmanagement: 'DeActivated'
  }
];


export default function AllRegisteredCustomers() {
  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await APi__FetchUserDeails()
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin.data);

      } catch (err) {
        console.log("Turbo Log  ~ fetchAllDetails ~ err:", err);
      }
    }
    fetchAllDetails()
  }, [])
  return <TableFirstStructure tableCaption="THis a a table to show all my customers" headers={headers} data={data} />;
}
