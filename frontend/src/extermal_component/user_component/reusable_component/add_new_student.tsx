import React, { useState, useEffect, useCallback } from 'react';

interface EditStudent {
  student_name: string;
  student_class: string;
  student_department?: string;
  student_age: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (students: EditStudent[]) => Promise<void>;
}

export default function AddStudentModal({ isOpen, onClose, onSubmit }: AddStudentModalProps) {
  const [students, setStudents] = useState<EditStudent[]>([]);
  const [current, setCurrent] = useState<EditStudent>({ student_name: '', student_class: '', student_department: '', student_age: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStudents([]);
      setCurrent({ student_name: '', student_class: '', student_department: '', student_age: '' });
      setEditIndex(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const canAdd = Boolean(
    current.student_name?.trim() &&
    current.student_class?.trim() &&
    current.student_department?.trim() &&
    current.student_age?.trim()
  );

  const handleAddOrUpdate = () => {
    if (!canAdd) return;
    if (editIndex !== null) {
      const copy = [...students];
      copy[editIndex] = { ...current };
      setStudents(copy);
      setEditIndex(null);
    } else {
      setStudents(prev => [...prev, { ...current }]);
    }
    setCurrent({ student_name: '', student_class: '', student_department: '', student_age: '' });
  };

  const handleEdit = (index: number) => {
    setCurrent(students[index]);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    setStudents(prev => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setCurrent({ student_name: '', student_class: '', student_department: '', student_age: '' });
      setEditIndex(null);
    }
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;
    setLoading(true);
    try {
      await onSubmit(students);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative">
        <h2 className="text-xl font-semibold mb-4">Add New Student(s)</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Student Name"
            value={current.student_name}
            onChange={e => setCurrent(prev => ({ ...prev, student_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Class"
            value={current.student_class}
            onChange={e => setCurrent(prev => ({ ...prev, student_class: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Department"
            value={current.student_department}
            onChange={e => setCurrent(prev => ({ ...prev, student_department: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Age"
            value={current.student_age}
            onChange={e => setCurrent(prev => ({ ...prev, student_age: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleAddOrUpdate}
            disabled={!canAdd}
            className={`w-full py-2 rounded-lg font-semibold transition disabled:opacity-50 ${editIndex !== null ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {editIndex !== null ? 'Update' : 'Add'} Student
          </button>
        </div>

        {/* List of added students */}
        {students.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium">Added Students ({students.length})</h3>
            <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {students.map((s, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border border-gray-200 rounded-lg p-2"
                >
                  <div>
                    <p className="font-semibold">{s.student_name} - {s.student_class}</p>
                    <p className="text-sm text-gray-600">{s.student_department}, Age {s.student_age}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleEdit(i)} className="text-yellow-500 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleRemove(i)} className="text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            disabled={loading || students.length === 0}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
