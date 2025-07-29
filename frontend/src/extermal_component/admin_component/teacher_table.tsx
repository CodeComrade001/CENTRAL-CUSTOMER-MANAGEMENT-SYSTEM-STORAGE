import { useEffect, useState } from "react";
import TableSecondStructure from "../reusable_component/second_table_schems";
import { API__Admin_SchoolTeachers } from "@/services/api";

const headers = [
  'id',
  'school_name',
  'email',
  'teacher_name',
  'teacher_email'
];

interface allTeacherDataType {
  id: number
  school_name: string;
  email: string;
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
        console.log("Turbo Log  ~ fetchAllDetails ~ admin:", admin.data);
        setAllCustomersTeacher(admin.data); // <-- you forgot to update state
      } catch (err) {
        console.log("Turbo Log  ~ fetchAllDetails ~ err:", err);
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
