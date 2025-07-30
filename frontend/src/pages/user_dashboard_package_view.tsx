"use client";

import { useCallback, useEffect, useState } from "react";
import { User, BatteryPlus, Computer, BookMinus, SquarePen } from "lucide-react";
import AllUserCbtStudent from "@/extermal_component/user_component/user_cbt";
import AllUserSchoolStudent from "@/extermal_component/user_component/User_student";
import AllUserSchoolTeacher from "@/extermal_component/user_component/user_teacher";

import { motion, AnimatePresence } from "framer-motion";
import { APi__FetchUserDeails, API__UserSelectedPlan } from "@/services/api";
import UserLogoutButton from "@/extermal_component/user_component/reusable_component/logOutUser";


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


type UserPackage = {
  id: number;
  school_management: boolean;
  computer_based_test: boolean;
  health_management: boolean;
};
interface userDetails {
  email: string;
  school_name: string;
  conputer_based_test_slot: number;
  school_management_slot: number;
}


const UserDashboardPackages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string>("teacher")
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  console.log("Turbo Log  ~ UserDashboardPackages ~ userPackage:", userPackage);
  const [userDetails, setUserDetails] = useState<userDetails>({
    email: "",
    school_name: "",
    conputer_based_test_slot: 0,
    school_management_slot: 0,
  })

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const activateBtnAction = useCallback(() => {
    switch (activeBtn) {
      case "teacher":
        return <AllUserSchoolTeacher />
      case "student":
        return <AllUserSchoolStudent />
      case "cbt":
        return <AllUserCbtStudent />
      default:
        return <AllUserSchoolTeacher />
    }
  }, [activeBtn])

  const getStatusBadge = (status: boolean | null | undefined) => {
    if (status === true)
      return <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Activated</span>;
    if (status === false)
      return <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Deactivated</span>;
    return <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Not Subscribed</span>;
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  useEffect(() => {
    (async () => {
      try {
        // Fetch selected plan
        const res = await API__UserSelectedPlan();
        const { data: planData } = res;

        // Log for debugging
        console.log("Turbo Log ~ UserDashboardPackages ~ planData:", planData);

        // Fetch user details
        const user = await APi__FetchUserDeails();
        const { data: userData } = user;

        // Set states
        setUserDetails(userData?.[0] ?? null);
        setUserPackage(planData?.[0] ?? null); // If planData is array, use the first object

      } catch (err) {
        console.error("Failed to fetch user package", err);
      }
    })();
  }, []);


  return (
    <div className="flex h-screen">
      <UserLogoutButton />
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
                    <p className="font-semibold"> Name:{userDetails.school_name}</p>
                    <p className="text-sm text-gray-500"> Email:  {userDetails.email}</p>
                  </div>
                </div>
              </div>
              {/* Navigation Section */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul>

                  {/* Health Management System */}
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveBtn("health_management")}
                      className="flex justify-between items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <div className="flex gap-2 font-medium text-sm items-center">
                        <BatteryPlus className="h-5 w-5" />
                        Health Management System
                      </div>
                      {getStatusBadge(userPackage?.health_management)}
                    </button>
                  </li>

                  {/* CBT System */}
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveBtn("cbt_system")}
                      className="flex justify-between items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <div className="flex gap-2 font-medium text-sm items-center">
                        <Computer className="h-5 w-5" />
                        CBT System (Enterprise)
                      </div>
                      {getStatusBadge(userPackage?.computer_based_test)}
                    </button>
                  </li>

                  {/* School Management System */}
                  <li className="mb-2">
                    <CollapsibleSection title="School Management System">
                      {getStatusBadge(userPackage?.computer_based_test)}
                      <ul>
                        {/* Teacher */}
                        <li className="mb-2">
                          <button
                            onClick={() => setActiveBtn("teacher")}
                            className="flex justify-between items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                          >
                            <div className="flex gap-2 font-medium text-sm items-center">
                              <BookMinus className="h-5 w-5" />
                              Teacher
                            </div>

                          </button>
                        </li>

                        {/* Student */}
                        <li className="mb-2">
                          <button
                            onClick={() => setActiveBtn("student")}
                            className="flex justify-between items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                          >
                            <div className="flex gap-2 font-medium text-sm items-center">
                              <SquarePen className="h-5 w-5" />
                              Student
                            </div>
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
            <div className="w-12 h-12 bg-gray-200 rounded-full flex  items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div  >
              <p className="font-semibold"> Name:{userDetails.school_name}</p>
              <p className="text-sm text-gray-500"> Email:  {userDetails.email}</p>
            </div>
          </div>
        </div>
        {/* Navigation Section */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveBtn("cbt_system")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <Computer className="h-5 w-5" />
                CBT System (Enterprise)
              </button>
              {getStatusBadge(userPackage?.computer_based_test)}
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveBtn("health_management")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                <BatteryPlus className="h-5 w-5" />
                Health management System
              </button>
              {getStatusBadge(userPackage?.health_management)}
            </li>
            <li className="mb-2">
              {/* <University className="h-5 w-5" /> */}
              <CollapsibleSection title="School Management System">
                {getStatusBadge(userPackage?.school_management)}
                <ul>
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveBtn("teacher")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100">
                      <BookMinus className="h-5 w-5" />
                      Teacher
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveBtn("student")}
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
        <div className="p-4 bg-gray-100 border-b border-gray-200 md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold">Main Content</h1>
          <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard View</h1>
          <div className="text-sm font-medium">
            {/* Additional details and settings can be found here. */}
            {activateBtnAction()}

          </div>
        </div>
      </div>
    </div>
  );
};

export { UserDashboardPackages };
