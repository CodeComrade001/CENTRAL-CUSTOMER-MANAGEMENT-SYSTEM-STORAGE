import { API__Admin_SchoolCBT_Students } from "@/services/api";
import TableSecondStructure from "../reusable_component/second_table_schems";
import { useEffect, useState } from "react";

const headers = [
  'email',
  'school_name',
  'student_name',
  'student_department',
  'student_class',
  'student_age',
];

interface allStudentDataType {
  id: number
  school_name: string
  student_name: string
  student_department: string
  student_class: string
  student_age: number

  [key: string]: string | number;
}

export default function AllSchoolStudent() {
  const [allCustomersStudent, setAllCustomersStudent] = useState<allStudentDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_SchoolCBT_Students();
        setAllCustomersStudent(admin.data); // <-- you forgot to update state
      } catch {
        setAllCustomersStudent([]); // <-- you forgot to update state
      }
    }
    fetchAllDetails();
  }, []);

  return (
    <TableSecondStructure
      tableCaption="This table displays all student profiles across subscribed schools"
      headers={headers}
      data={allCustomersStudent}
    />
  );
}

