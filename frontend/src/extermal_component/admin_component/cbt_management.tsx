import TableSecondStructure from "../reusable_component/second_table_schems";

const headers = ["Subscription ID", "School Name", "School Email"];

const cbtSubscribedSchools = [
  {
    subscriptionid: "CBT001",
    schoolname: "Bright Future College",
    schoolemail: "admin@brightfuture.edu.ng",
  },
  {
    subscriptionid: "CBT002",
    schoolname: "Unity High School",
    schoolemail: "principal@unityhigh.edu.ng",
  },
  {
    subscriptionid: "CBT003",
    schoolname: "Golden Gate Academy",
    schoolemail: "contact@goldengate.edu.ng",
  },
  {
    subscriptionid: "CBT004",
    schoolname: "Rising Stars Secondary School",
    schoolemail: "info@risingstars.edu.ng",
  },
];

export default function SubscribedSchoolsCbtPackage() {
  return (
    <TableSecondStructure
      tableCaption="Schools Subscribed to CBT Package"
      headers={headers}
      data={cbtSubscribedSchools}
    />

  );
}
