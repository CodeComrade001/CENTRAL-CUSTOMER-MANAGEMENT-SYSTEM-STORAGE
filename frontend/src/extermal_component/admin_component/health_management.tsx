import TableSecondStructure from "../reusable_component/second_table_schems";

const headers = ["Subscription ID", "School Name", "School Email"];

const healthSubscribedSchools = [
  {
    subscriptionid: "HLT001",
    schoolname: "Silver Heights School",
    schoolemail: "health@silverheights.edu.ng",
  },
  {
    subscriptionid: "HLT002",
    schoolname: "Great Minds Academy",
    schoolemail: "support@greatminds.edu.ng",
  },
  {
    subscriptionid: "HLT003",
    schoolname: "Unity High School",
    schoolemail: "wellness@unityhigh.edu.ng",
  },
  {
    subscriptionid: "HLT004",
    schoolname: "New Dawn College",
    schoolemail: "clinic@newdawn.edu.ng",
  },
];

export default function SubscribedSchoolsHealthPackage() {
  return (
    <TableSecondStructure
      tableCaption="Schools Subscribed to Health Package"
      headers={headers}
      data={healthSubscribedSchools}
    />
  );
}
