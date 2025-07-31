import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import {
  API__Admin_ActivateCustomer,
  API__Admin_DeactivateCustomer,
  API__Admin_UpdateSMS_Slot,
} from '@/services/api';
import { useCallback, useState } from 'react';

interface TableRowData {
  [key: string]: string | number | boolean;
}

interface TableStructureProps {
  tableCaption: string;
  headers: string[];
  data: TableRowData[];
}

export default function TableFirstStructure({
  tableCaption,
  headers,
  data,
}: TableStructureProps) {
  // Track per-row states using records
  const [slotValues, setSlotValues] = useState<Record<number, number | ''>>({});
  const [slotStatuses, setSlotStatuses] = useState<Record<number, string>>({});
  const [buttonActive, setButtonActive] = useState<Record<number, boolean>>({});

  const [deactivateText, setDeactivateText] = useState<string>('activated');
  const [activateText, setActivateText] = useState<string>('deactivated');

  const handleSlotInputChange = useCallback(
    (value: string, schoolId: number) => {
      const parsed = parseInt(value);
      setSlotValues((prev) => ({
        ...prev,
        [schoolId]: isNaN(parsed) ? '' : parsed,
      }));

      setButtonActive((prev) => ({
        ...prev,
        [schoolId]: !isNaN(parsed),
      }));
    },
    []
  );

  const handleConfirmUser = useCallback(
    async (schoolId: number) => {
      const slotValue = slotValues[schoolId];
      if (typeof slotValue !== 'number') {
        console.warn('Invalid slot value for school ID:', schoolId);
        setSlotStatuses((prev) => ({ ...prev, [schoolId]: '❌' }));
        return;
      }

      setSlotStatuses((prev) => ({ ...prev, [schoolId]: '⏳' }));
      setButtonActive((prev) => ({ ...prev, [schoolId]: true }));

      try {
        const response = await API__Admin_UpdateSMS_Slot({
          schoolId,
          slotValue,
        });
        if (response.status === 200) {
          setSlotStatuses((prev) => ({ ...prev, [schoolId]: '✅' }));
        } else {
          setSlotStatuses((prev) => ({ ...prev, [schoolId]: '⚠️' }));
        }
      } catch (error) {
        console.error('handleConfirmUser error:', error);
        setSlotStatuses((prev) => ({ ...prev, [schoolId]: '⚠️' }));
      } finally {
        setButtonActive((prev) => ({ ...prev, [schoolId]: false }));
      }
    },
    [slotValues]
  );

  const deActivateCustomer = async (schoolId: number) => {
    setDeactivateText('Deactivating...');
    try {
      const admin = await API__Admin_DeactivateCustomer({ schoolId });
      if (admin.status === 200) {
        setDeactivateText('Account Deactivated');
      }
    } catch (error) {
      console.error('deActivateCustomer error:', error);
      setDeactivateText('Server Error');
    }
  };

  const activateCustomer = async (schoolId: number) => {
    setActivateText('Activating...');
    try {
      const admin = await API__Admin_ActivateCustomer({ schoolId });
      if (admin.status === 200) {
        setActivateText('Account Activated');
      }
    } catch (error) {
      console.error('activateCustomer error:', error);
      setActivateText('Server Error');
    }
  };

  return (
    <div className="px-5 py-10 w-full h-full">
      <Table>
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Count</TableHead>
            {headers.map((header, i) => (
              <TableHead key={i} className={i === headers.length - 1 ? 'text-right' : ''}>
                {header}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const id = row.id as number;
            const isActive = row.activated === true;
            const isNotActive = row.activated === false;
            const currentSlotValue = slotValues[id] ?? '';
            const currentStatus = slotStatuses[id] ?? '🔘';
            const isActiveBtn = buttonActive[id] ?? false;

            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={colIndex === headers.length - 1 ? 'text-right' : ''}
                  >
                    {row[header.toLowerCase().replace(/\s/g, '')] || '-'}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex flex-col gap-3">
                    <div
                      onClick={() =>
                        isActive ? deActivateCustomer(id) : activateCustomer(id)
                      }
                      className={`cursor-pointer w-32 text-center py-1 px-3 rounded-lg font-semibold transition-colors duration-300
                        ${isActive && 'bg-green-600 text-white hover:bg-green-700'} 
                        ${isNotActive && 'bg-red-600 text-white hover:bg-red-700'}
                      `}
                    >
                      {isActive ? deactivateText : activateText}
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={currentSlotValue}
                        onChange={(e) =>
                          handleSlotInputChange(e.target.value, id)
                        }
                        placeholder="Enter a number"
                        className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {isActiveBtn && (
                        <div
                          onClick={() => handleConfirmUser(id)}
                          className="cursor-pointer bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
                        >
                          {currentStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
