import { useEffect, useState, useCallback } from 'react';
import { API__GetAllStudents, API__CreateStudents } from '@/services/api';
import TableThirdStructure from '../reusable_component/third_table_schema';
import AddStudentModal from './reusable_component/add_new_student';

const headers = [
  'id',
  'student_name',
  'student_class',
  'student_department',
  'student_age',
];

interface AllStudentDataType {
  id: number;
  student_name: string;
  student_class: string;
  student_department: string;
  student_age: string;
  [key: string]: string | number;
}

export default function AllUserSchoolStudent() {
  const [allStudent, setAllStudent] = useState<AllStudentDataType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing students
  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const res = await API__GetAllStudents();
        setAllStudent(res.data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    }
    fetchAllDetails();
  }, []);

  // Submit new students to API and refresh list
  const submitStudents = useCallback(
    async (students: {
      student_name?: string;
      student_class?: string;
      student_department?: string;
      student_age?: string;
    }[]) => {
      setLoading(true);
      try {
        // Ensure all fields are present
        const payload = students.map(s => ({
          student_name: s.student_name || '',
          student_class: s.student_class || '',
          student_department: s.student_department || '',
          student_age: s.student_age || '',
        }));
        await API__CreateStudents(payload);
        const refreshed = await API__GetAllStudents();
        setAllStudent(refreshed.data);
        setModalOpen(false);
      } catch (err) {
        console.error('Error adding students:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="p-4">
      {/* New Student Button */}
      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className=" mb-4 px-4 py-2 
    bg-black text-white 
    rounded-lg 
    hover:bg-gray-800 
    disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'New Student'}
      </button>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitStudents}
      />

      {/* Students Table */}
      <TableThirdStructure
        tableCaption="This table displays all student profiles across subscribed schools"
        headers={headers}
        data={allStudent}
      />
    </div>
  );
}
