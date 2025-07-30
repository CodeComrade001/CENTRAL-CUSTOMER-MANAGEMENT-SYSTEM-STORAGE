import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { API__Admin_ActivateCustomer, API__Admin_DeactivateCustomer, API__Admin_UpdateSMS_Slot } from '@/services/api';
import { useCallback, useState } from 'react';


interface TableRowData {
  [key: string]: string | number | boolean;
}

interface TableStructureProps {
  tableCaption: string;
  headers: string[];
  data: TableRowData[];
  showTotal?: boolean;
  totalColumnKey?: string;
}



export default function TableFirstStructure({
  tableCaption,
  headers,
  data,
}: TableStructureProps) {

  const [slotValue, setSlotValue] = useState<number | ''>('');
  const [schoolId, setSchoolId] = useState<number | string | boolean>('');
  const [deactivateText, setDeactivateText] = useState<string>("activate")
  const [activateText, setActivateText] = useState<string>("deactivate")
  const [slotStatus, setSlotStatus] = useState<string>("🔘")
  const [isBtnActive, setIsBtnActive] = useState<boolean>(false)

  const handleConfirmUser = useCallback(async () => {
    setSlotStatus("⏳");
    setIsBtnActive(true);

    // 1) Runtime guard using correct typeof check
    if (typeof slotValue !== "number" || typeof schoolId !== "number") {
      console.warn("Invalid inputs:", { slotValue, schoolId });
      setSlotStatus("❌");        // show “failed” emoji
      setIsBtnActive(false);
      return;
    }

    try {
      const admin = await API__Admin_UpdateSMS_Slot({ slotValue, schoolId });
      if (admin.status === 200) {
        setSlotStatus("✅");
      } else {
        // non-200 response
        setSlotStatus("⚠️");
      }
    } catch (err) {
      console.error("UpdateSMS_Slot error:", err);
      setSlotStatus("⚠️");
    } finally {
      // always re‑enable the button
      setIsBtnActive(false);
    }
  }, [slotValue, schoolId]);


  const deActivateCustomer = async (schoolId: number | string | boolean) => {
    if (typeof schoolId !== "number") {
      setDeactivateText("Invalid ID: must be a number");
      return;
    }

    setDeactivateText("Deactivating...");
    try {
      const admin = await API__Admin_DeactivateCustomer({ schoolId });
      if (admin.status === 200) {
        setDeactivateText("Account Deactivated");
      }
    } catch (error) {
      console.error("Turbo Log  ~ deActivateCustomer ~ error:", error);
      setDeactivateText("Server Error");
    }
  };

  const activateCustomer = async (schoolId: number | string | boolean) => {
    if (typeof schoolId !== "number") {
      setActivateText("Invalid ID: must be a number");
      return;
    }

    setActivateText("Activating...");
    try {
      const admin = await API__Admin_ActivateCustomer({ schoolId });
      if (admin.status === 200) {
        setActivateText("Account Activated");
      }
    } catch (error) {
      console.error("Turbo Log  ~ activateCustomer ~ error:", error);
      setActivateText("Server Error");
    }
  };



  return (
    <div className="px-5 py-10 w-full  h-[100%] ">
      <Table>
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i} className={i === headers.length - 1 ? 'text-right' : ''}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const isActive = row.activate == true; // Toggle logic per row
            const isNotActive = row.deactivate == true; // Toggle logic per row

            return (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell
                    onClick={() => setSchoolId(row.id)}  // Only set when user interacts
                    key={colIndex}
                    className={colIndex === headers.length - 1 ? 'text-right' : ''}
                  >
                    {row[header.toLowerCase().replace(/\s/g, '')] || '-'}
                  </TableCell>
                ))}

                {/* Toggle Button Cell at the END of the row */}
                <TableCell>
                  <div className="flex flex-col gap-3" >
                    <div
                      onClick={() => isActive ? deActivateCustomer(row.id) : activateCustomer(row.id)}
                      className={`cursor-pointer w-32 text-center py-1 px-3 rounded-lg font-semibold transition-colors duration-300
                      ${isActive && 'bg-green-600 text-white hover:bg-green-700'} ${isNotActive && 'bg-red-600 text-white hover:bg-red-700'} `}
                    >
                      {isActive ? deactivateText : activateText}
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Number input */}
                      <input
                        type="number"
                        value={slotValue}
                        onChange={(e) => setSlotValue(Number(e.target.value))}
                        placeholder="Enter a number"
                        className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* If user is not set, show confirm button */}
                      {isBtnActive && (
                        <div
                          onClick={handleConfirmUser}
                          className="cursor-pointer bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
                        >
                          {slotStatus}
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


