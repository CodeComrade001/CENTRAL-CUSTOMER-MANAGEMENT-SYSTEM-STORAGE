import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { useState } from 'react';


interface TableRowData {
  [key: string]: string | number;
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

  const [value, setValue] = useState<number | ''>('');
  const [user, setUser] = useState<string | null>('none');

  const handleConfirmUser = () => {
    // Simulate user assignment (e.g., from modal, form, etc.)
    setUser('user123');
    alert('User confirmed!');
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
            // const rowId = row.subscriptionid; // Or whatever unique ID you're using
            const isActive = row.status === 'deactivate'; // Toggle logic per row

            return (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell
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
                      className={`cursor-pointer w-32 text-center py-1 px-3 rounded-lg font-semibold transition-colors duration-300
                      ${isActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}
                      `}
                    >
                      {isActive ? 'Active' : 'Deactivated'}
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Number input */}
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        placeholder="Enter a number"
                        className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* If user is not set, show confirm button */}
                      {user === 'none' && (
                        <div
                          onClick={handleConfirmUser}
                          className="cursor-pointer bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
                        >
                          ✅
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


