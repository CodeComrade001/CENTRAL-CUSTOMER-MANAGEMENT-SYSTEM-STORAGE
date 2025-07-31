import React, { useState, useEffect, useCallback } from 'react';

export interface EditTeacher {
  teacher_name: string;
  teacher_email: string;
}

export interface EditTeacherDatatype {
  id?: string;
  teacher_name?: string;
  teacher_email?: string;
}

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teachers: EditTeacher[]) => Promise<void>;
}

export default function AddTeacherModal({ isOpen, onClose, onSubmit }: AddTeacherModalProps) {
  const [teachers, setTeachers] = useState<EditTeacher[]>([]);
  const [current, setCurrent] = useState<EditTeacher>({ teacher_name: '', teacher_email: '' });
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
      setTeachers([]);
      setCurrent({ teacher_name: '', teacher_email: '' });
      setEditIndex(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const canAdd = current.teacher_name?.trim() !== '' && current.teacher_email?.trim() !== '';

  const handleAddOrUpdate = () => {
    if (!canAdd) return;
    if (editIndex !== null) {
      const copy = [...teachers];
      copy[editIndex] = { ...current };
      setTeachers(copy);
      setEditIndex(null);
    } else {
      setTeachers(prev => [...prev, { ...current }]);
    }
    setCurrent({ teacher_name: '', teacher_email: '' });
  };

  const handleEdit = (index: number) => {
    setCurrent(teachers[index]);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    setTeachers(prev => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setCurrent({ teacher_name: '', teacher_email: '' });
      setEditIndex(null);
    }
  };

  const handleSubmit = async () => {
    if (teachers.length === 0) return;
    setLoading(true);
    try {
      await onSubmit(teachers);
      setLoading(false);
      onClose();
    } catch  {
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
        <h2 className="text-xl font-semibold mb-4">Add New Teacher(s)</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Teacher Name"
            value={current.teacher_name}
            onChange={e => setCurrent(prev => ({ ...prev, teacher_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="email"
            placeholder="Teacher Email"
            value={current.teacher_email}
            onChange={e => setCurrent(prev => ({ ...prev, teacher_email: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleAddOrUpdate}
            disabled={!canAdd}
            className={`w-full py-2 rounded-lg font-semibold transition disabled:opacity-50 ${editIndex !== null ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {editIndex !== null ? 'Update' : 'Add'} Teacher
          </button>
        </div>

        {/* List of added teachers */}
        {teachers.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium">Added Teachers ({teachers.length})</h3>
            <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {teachers.map((t, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border border-gray-200 rounded-lg p-2"
                >
                  <div>
                    <p className="font-semibold">{t.teacher_name}</p>
                    <p className="text-sm text-gray-600">{t.teacher_email}</p>
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
            disabled={loading || teachers.length === 0}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
