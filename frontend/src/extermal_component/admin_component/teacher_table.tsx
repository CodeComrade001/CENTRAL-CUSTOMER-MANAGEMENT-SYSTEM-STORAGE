import { useEffect, useState } from "react";
import TableSecondStructure from "../reusable_component/second_table_schems";
import { API__Admin_SchoolTeachers } from "@/services/api";

const headers = [
  'school_name',
  'teacher_name',
  'teacher_email'
];

interface allTeacherDataType {
  id: number
  school_name: string;
  teacher_name: string;
  teacher_email: string;

  [key: string]: string | number;
}


export default function AllSchoolTeacher() {
  const [allCustomersTeacher, setAllCustomersTeacher] = useState<allTeacherDataType[]>([]);

  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__Admin_SchoolTeachers();
        setAllCustomersTeacher(admin.data); // <-- you forgot to update state
      } catch {
        setAllCustomersTeacher([]); // <-- you forgot to update state
      }
    }
    fetchAllDetails();
  }, []);


  return (
    <TableSecondStructure
      tableCaption="This is a table to show all teacher customers"
      headers={headers}
      data={allCustomersTeacher}
    />
  );
}
