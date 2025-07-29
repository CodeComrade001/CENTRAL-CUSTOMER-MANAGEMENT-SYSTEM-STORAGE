import TableSecondStructure from "../reusable_component/second_table_schems";

const headers = [
  'Subscription ID',
  'school Name',
  'teacher Id',
  'teacher Name',
  'teacher email',
  'teacher Phone No'
];

const data = [
  {
    subscriptionid: 'SUB001',
    schoolname: 'Greenfield Academy',
    teacherid: 'TCH101',
    teachername: 'Alice Smith',
    teacheremail: 'alice.smith@greenfield.edu',
    teacherphoneno: '08123456789'
  },
  {
    subscriptionid: 'SUB002',
    schoolname: 'Bluebell High School',
    teacherid: 'TCH102',
    teachername: 'Michael Johnson',
    teacheremail: 'michael.j@bluebell.edu',
    teacherphoneno: '08098765432'
  },
  {
    subscriptionid: 'SUB003',
    schoolname: 'Sunrise Primary',
    teacherid: 'TCH103',
    teachername: 'Fatima Bello',
    teacheremail: 'fatima.bello@sunrise.edu',
    teacherphoneno: '07055667788'
  },
  {
    subscriptionid: 'SUB004',
    schoolname: 'Hope International',
    teacherid: 'TCH104',
    teachername: 'John Doe',
    teacheremail: 'john.doe@hopeintl.edu',
    teacherphoneno: '09033221144'
  }
];

export default function AllSchoolTeacher() {
  return (
    <TableSecondStructure
      tableCaption="This is a table to show all teacher customers"
      headers={headers}
      data={data}
    />
  );
}
