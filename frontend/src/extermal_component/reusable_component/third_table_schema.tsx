import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';


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



export default function TableThirdStructure({
  tableCaption,
  headers,
  data,
}: TableStructureProps) {



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
                      className="cursor-pointer w-32 text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-300 bg-black text-white hover:bg-gray-800"
                    >
                      Add
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


