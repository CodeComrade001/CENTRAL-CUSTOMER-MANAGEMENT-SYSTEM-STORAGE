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
            <TableHead>count</TableHead>
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
                <TableCell>
                  {rowIndex + 1}
                </TableCell>
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={colIndex === headers.length - 1 ? 'text-right' : ''}
                  >
                    {row[header.toLowerCase().replace(/\s/g, '')] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}


