import { useEffect, useState } from "react";
import TableThirdStructure from "../reusable_component/third_table_schema";
import { API__GetCBTStudents } from "@/services/api";

const headers = [
  'id',
  'student_name',
  'student_class',
  'student_department',
  'student_age',
];

interface allCbtStudentDataType {
  id: number;
  student_name: string;
  student_class: string;
  student_department: string;
  student_age: string;

  [key: string]: string | number;
}


export default function AllUserCbtStudent() {
  const [allCbtStudent, setAllCbtStudent] = useState<allCbtStudentDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__GetCBTStudents();
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin.data);
        setAllCbtStudent(admin.data); // <-- you forgot to update state
      } catch (err) {
        console.log("Turbo Log  ~ fetchAllDetails ~ err:", err);
      }
    }
    fetchAllDetails();
  }, []);



  return (
    <TableThirdStructure
      tableCaption="This table displays all student profiles across subscribed schools"
      headers={headers}
      data={allCbtStudent}
    />
  );
}

