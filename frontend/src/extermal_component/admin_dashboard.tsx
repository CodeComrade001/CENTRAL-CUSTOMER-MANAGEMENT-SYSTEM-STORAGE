"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BatteryPlus, University, Computer, BookMinus, SquarePen } from "lucide-react";
import AllRegisteredCustomers from "./admin_component/all_customers";
import SubscribedSchoolManagementPackage from "./admin_component/school_management";
import SubscribedSchoolsCbtPackage from "./admin_component/cbt_management";
import SubscribedSchoolsHealthPackage from "./admin_component/health_management";
import AllSchoolTeacher from "./admin_component/teacher_table";
import AllSchoolStudent from "./admin_component/student_table";
import AdminLogoutButton from "./admin_component/logOutAdmin";



const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between py-2 px-4 rounded-xl hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold">{title}</span>
        {open ? <XIcon /> : <MenuIcon />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const MenuIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <motion.line x1="3" y1="12" x2="21" y2="12" />
  </motion.svg>
);

const XIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <motion.line x1="18" y1="6" x2="6" y2="18" />
    <motion.line x1="6" y1="6" x2="18" y2="18" />
  </motion.svg>
);

const AnimatedMenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (



  <button
    onClick={toggle}
    aria-label="Toggle menu"
    className="focus:outline-none z-999"
  >
    <motion.div animate={{ y: isOpen ? 13 : 0 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="text-black"
      >
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 22 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 12 L 22 12", opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 21.5 L 22 21.5" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
        />
      </motion.svg>
    </motion.div>
  </button>
);



const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string>("all_customer")
  const [activeBtnText, setActiveBtnText] = useState<string>("All Customers")

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const bottonSetters = useCallback(
    (newActiveBtn: string, activeBtnText: string) => {
      setActiveBtn(newActiveBtn);
      setActiveBtnText(activeBtnText);
    },
    [] // Add dependencies here if setActiveBtn/setActiveBtnText are not stable
  );


  const activateBtnAction = useCallback(() => {
    switch (activeBtn) {
      case "all_customer":
        return < AllRegisteredCustomers />
      case "school_management":
        return <SubscribedSchoolManagementPackage />
      case "cbt_system":
        return <SubscribedSchoolsCbtPackage />
      case "health_system":
        return <SubscribedSchoolsHealthPackage />
      case "teacher":
        return <AllSchoolTeacher />
      case "student":
        return <AllSchoolStudent />
      default:
        return <AllRegisteredCustomers />
    }
  }, [activeBtn])

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen w-screen">

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileSidebarVariants}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white text-black"
          >
            <div className="flex flex-col h-full">
              {/* Profile Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">HextaUI</p>
                    <p className="text-sm text-gray-500">hi@preetsuthar.me</p>
                  </div>
                </div>
              </div>
              {/* Navigation Section */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul>
                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("all_customers", "All Customers")}

                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <User className="h-5 w-5" />
                      All Customers
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("school_management", "School Mangement")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      School Management System
                    </button>
                  </li>


                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("health_system", "Health Mangement")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <BatteryPlus className="h-5 w-5" />
                      Health management System
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("cbt_system", "Computer Based Test")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <Computer className="h-5 w-5" />
                      CBT System (Enterprise)
                    </button>
                  </li>
                  <li className="mb-2">
                    <CollapsibleSection title="School Management System">
                      <ul>
                        <li className="mb-2">
                          <button
                            onClick={() => bottonSetters("teacher", "All School Teachers")}
                            className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                            <BookMinus className="h-5 w-5" />
                            Teacher
                          </button>
                        </li>
                        <li className="mb-2">
                          <button
                            onClick={() => bottonSetters("student", "All School Student")}
                            className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                            <SquarePen className="h-5 w-5" />
                            Student
                          </button>
                        </li>
                      </ul>
                    </CollapsibleSection>
                  </li>
                </ul>
              </nav>
              {/* Footer / Action Button */}
              <div className="p-4 border-t border-gray-200">
                <button className="w-full font-medium text-sm p-2 text-center bg-blue-100 rounded-xl hover:bg-blue-200">
                  View profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-[20%] bg-white text-black shadow">
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">HextaUI</p>
              <p className="text-sm text-gray-500">hi@preetsuthar.me</p>
            </div>
          </div>
        </div>
        {/* Navigation Section */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => bottonSetters("all_customers", "All Customers")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <User className="h-5 w-5" />
                All Customers
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => bottonSetters("school_management", "School Mangement")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <University className="h-5 w-5" />
                School Management System
              </button>
            </li>


            <li className="mb-2">
              <button
                onClick={() => bottonSetters("cbt_system", "Computer Based Test")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <Computer className="h-5 w-5" />
                CBT System (Enterprise)
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => bottonSetters("health_system", "Health Mangement")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <BatteryPlus className="h-5 w-5" />
                Health management System
              </button>
            </li>
            <li className="mb-2">
              {/* <University className="h-5 w-5" /> */}
              <CollapsibleSection title="School Management System">
                <ul>
                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("teacher", "All School Teachers")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <BookMinus className="h-5 w-5" />
                      Teacher
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => bottonSetters("student", "All School Student")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <SquarePen className="h-5 w-5" />
                      Student
                    </button>
                  </li>
                </ul>
              </CollapsibleSection>
            </li>
          </ul>
        </nav>
        {/* Footer / Action Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full font-medium text-sm p-2 text-center bg-blue-100 rounded-xl hover:bg-blue-200">
            View profile
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-[20%] transition-all duration-300">
        {/* Top bar for mobile toggle */}
        <div className="p-4 bg-gray-100  border-b border-gray-200 md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold">Main Content</h1>

          <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
        </div>
        <div className="p-6 relative ">
          <h1 className="text-2xl font-bold">{activeBtnText} View</h1>
          <AdminLogoutButton />
          <div className="text-sm font-medium">
            {/* Additional details and settings can be found here. */}
            {activateBtnAction()}

          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboard };
