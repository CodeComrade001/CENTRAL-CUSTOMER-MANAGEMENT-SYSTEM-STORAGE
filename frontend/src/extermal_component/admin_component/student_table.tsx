import TableSecondStructure from "../reusable_component/second_table_schems";

const headers = [
  'Subscription ID',
  'School Name',
  'Student ID',
  'Full Name',
  'Class',
  'Gender',
  'Email',
  'Phone Number'
];

const data = [
  {
    subscriptionid: 'SUB101',
    schoolname: 'Bright Future College',
    studentid: 'STD001',
    fullname: 'Daniel Adekunle',
    class: 'JSS1',
    gender: 'Male',
    email: 'daniel.adekunle@brightfuture.edu.ng',
    phonenumber: '08012345678'
  },
  {
    subscriptionid: 'SUB102',
    schoolname: 'Unity High School',
    studentid: 'STD002',
    fullname: 'Blessing Okoro',
    class: 'SS2',
    gender: 'Female',
    email: 'blessing.okoro@unityhigh.edu.ng',
    phonenumber: '07098765432'
  },
  {
    subscriptionid: 'SUB103',
    schoolname: 'Golden Gate Academy',
    studentid: 'STD003',
    fullname: 'John Mark',
    class: 'JSS3',
    gender: 'Male',
    email: 'john.mark@goldengate.edu.ng',
    phonenumber: '09022334455'
  },
  {
    subscriptionid: 'SUB101',
    schoolname: 'Bright Future College',
    studentid: 'STD004',
    fullname: 'Chioma Nwosu',
    class: 'SS1',
    gender: 'Female',
    email: 'chioma.nwosu@brightfuture.edu.ng',
    phonenumber: '08155667788'
  },
  {
    subscriptionid: 'SUB104',
    schoolname: 'Silver Heights School',
    studentid: 'STD005',
    fullname: 'Emeka Obi',
    class: 'SS3',
    gender: 'Male',
    email: 'emeka.obi@silverheights.edu.ng',
    phonenumber: '08099887766'
  }
];

export default function AllSchoolStudent() {
  return (
    <TableSecondStructure
      tableCaption="This table displays all student profiles across subscribed schools"
      headers={headers}
      data={data}
    />
  );
}

