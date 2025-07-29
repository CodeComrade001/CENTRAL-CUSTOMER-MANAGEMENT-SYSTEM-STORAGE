import { useEffect, useState } from "react";
import TableThirdStructure from "../reusable_component/third_table_schema";

const headers = [
  'Student ID',
  'Full Name',
  'Class',
  'Gender',
  'Email',
  'Phone Number'
];

const data = [
  {
    studentid: 'STD001',
    fullname: 'Daniel Adekunle',
    class: 'JSS1',
    gender: 'Male',
    email: 'daniel.adekunle@brightfuture.edu.ng',
    phonenumber: '08012345678'
  },
  {
    studentid: 'STD002',
    fullname: 'Blessing Okoro',
    class: 'SS2',
    gender: 'Female',
    email: 'blessing.okoro@unityhigh.edu.ng',
    phonenumber: '07098765432'
  },
  {
    studentid: 'STD003',
    fullname: 'John Mark',
    class: 'JSS3',
    gender: 'Male',
    email: 'john.mark@goldengate.edu.ng',
    phonenumber: '09022334455'
  },
  {
    studentid: 'STD004',
    fullname: 'Chioma Nwosu',
    class: 'SS1',
    gender: 'Female',
    email: 'chioma.nwosu@brightfuture.edu.ng',
    phonenumber: '08155667788'
  },
  {
    studentid: 'STD005',
    fullname: 'Emeka Obi',
    class: 'SS3',
    gender: 'Male',
    email: 'emeka.obi@silverheights.edu.ng',
    phonenumber: '08099887766'
  }
];

export default function AllUserCbtStudent() {
  const [cbtStudents, setCbtStudents] = useState()
  const [addStudents, setAddStudents] = useState()

  useEffect(() => {
    (async () => {
      try {
        const res = await API__UserSelectedPlan();
        console.log("Turbo Log  ~ UserDashboard ~ res:", res);
        setUserPackage(res.data); // Adjust depending on actual API response
      } catch (err) {
        console.error("Failed to fetch user package", err);
      }
    })();
  }, []);


  return (
    <TableThirdStructure
      tableCaption="This table displays all student profiles across subscribed schools"
      headers={headers}
      data={data}
    />
  );
}

