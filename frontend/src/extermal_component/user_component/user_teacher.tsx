import { useState, useEffect } from 'react';
import { API__CreateTeachers, API__GetAllTeachers } from '@/services/api';
import TableThirdStructure from '../reusable_component/third_table_schema';
import AddTeacherModal, { type EditTeacher } from './reusable_component/add_new_teacher';

const headers = [
  'id',
  'teacher_name',
  'teacher_email'
];

interface allTeacherDataType {
  id: number;
  teacher_name: string;
  teacher_email: string;
  [key: string]: string | number;
}

export default function AllUserSchoolTeacher() {
  const [allTeacher, setAllTeacher] = useState<allTeacherDataType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing teachers
  useEffect(() => {
    async function fetchAllDetails() {
      try {
        const admin = await API__GetAllTeachers();
        setAllTeacher(admin.data);
      } catch (err) {
        console.error('Turbo Log  ~ fetchAllDetails ~ err:', err);
      }
    }
    fetchAllDetails();
  }, []);

  // Handle new teacher submissions
  const submitTeachers = async (teachers: EditTeacher[]) => {
    setLoading(true);
    try {
      await API__CreateTeachers(teachers);
      const refreshed = await API__GetAllTeachers();
      setAllTeacher(refreshed.data);
      setModalOpen(false);
    } catch (err) {
      console.error('AddTeacher error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Toggle Add Teacher Modal */}
      <button
        onClick={() => setModalOpen(true)}
        className=" mb-4 px-4 py-2 
    bg-black text-white 
    rounded-lg 
    hover:bg-gray-800 
    disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'New Teacher'}
      </button>

      <AddTeacherModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitTeachers}
      />

      {/* Teachers Table */}
      <TableThirdStructure
        tableCaption="This is a table to show all school teachers"
        headers={headers}
        data={allTeacher}
      />
    </div>
  );
}
