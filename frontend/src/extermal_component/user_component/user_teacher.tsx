import TableThirdStructure from "../reusable_component/third_table_schema";

const headers = [
  'teacher Id',
  'teacher Name',
  'teacher email',
  'teacher Phone No'
];

const data = [
  {
    teacherid: 'TCH101',
    teachername: 'Alice Smith',
    teacheremail: 'alice.smith@greenfield.edu',
    teacherphoneno: '08123456789'
  },
  {
    teacherid: 'TCH102',
    teachername: 'Michael Johnson',
    teacheremail: 'michael.j@bluebell.edu',
    teacherphoneno: '08098765432'
  },
  {
    teacherid: 'TCH103',
    teachername: 'Fatima Bello',
    teacheremail: 'fatima.bello@sunrise.edu',
    teacherphoneno: '07055667788'
  },
  {
    teacherid: 'TCH104',
    teachername: 'John Doe',
    teacheremail: 'john.doe@hopeintl.edu',
    teacherphoneno: '09033221144'
  }
];

export default function AllUserSchoolTeacher() {
  return (
    <TableThirdStructure
      tableCaption="This is a table to show all teacher customers"
      headers={headers}
      data={data}
    />
  );
}
