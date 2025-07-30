import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useEffect, useState } from "react";
import { API__UserPlanEdit, API__UserSelectedPlan } from "@/services/api";
import { getFunctionStatusMessage } from "@/utils/authFunctionNotification";
import UserLogoutButton from "./user_component/reusable_component/logOutUser";


const features = [
  {
    Icon: FileTextIcon,
    id: "school_management",
    name: "School Management System",
    description: "A powerful SaaS solution for managing school records, students, staff, results, and attendance — all in one place.",
    href: "/user/dashboard/packages",
    cta: "Explore system",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    id: "computer_based_test",
    name: "CBT System ",
    description: "A scalable Computer-Based Testing platform now upgraded with enterprise-level analytics and security.",
    href: "/user/dashboard/packages",
    cta: "View CBT suite",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Health management System",
    id: "health_management",
    description: "A secure Electronic Medical Record (EMR) system designed for hospitals, clinics, and health centers.",
    href: "/user/dashboard/packages",
    cta: "See how it works",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    id: "CalendarIcon",
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Real-time Notifications",
    id: "Real-time Notifications",
    description: "Stay informed instantly when patients, students, or users take action — alerts, mentions, and system updates.",
    href: "/user/dashboard/packages",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Contact Us & Support",
    id: "Contact Us & Support",
    description: "Need help or want a demo? Our team is ready to assist and walk you through any of the systems.",
    href: "/user/dashboard/packages",
    cta: "Reach out",
    background: <img className="absolute -right-20 -top-20 opacity-60" title="background image" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  }
];


type CoreProduct = "school_management" | "computer_based_test" | "health_management";

type UserPackage = {
  id: number;
  school_management: boolean;
  computer_based_test: boolean;
  health_management: boolean;
};

const CORE_PRODUCTS: CoreProduct[] = ["school_management", "computer_based_test", "health_management"];

export default function UserDashboard() {
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  const [packageCondition, setPackageCondition] = useState<Record<string, string>>({});

  async function activatePackageForUser(product: string) {
    if (!CORE_PRODUCTS.includes(product as CoreProduct)) return;

    const isCurrentlyActive = userPackage?.[product as CoreProduct];
    setPackageCondition((prev) => ({ ...prev, [product]: "⏳ Updating..." }));

    const msg = getFunctionStatusMessage(408);
    if (!userPackage || userPackage.id === undefined) {
      return setPackageCondition((prev) => ({ ...prev, [product]: msg }));
    }

    const id = userPackage.id;
    console.log("Turbo Log  ~ activatePackageForUser ~ id:", id);

    try {
      const res = await API__UserPlanEdit({
        id,
        product,
        product_subscription: !isCurrentlyActive,
      });

      const msg = getFunctionStatusMessage(res.status);
      setPackageCondition((prev) => ({ ...prev, [product]: msg }));

      if (res.status === 200) {
        const updated = await API__UserSelectedPlan();
        setUserPackage(updated.data?.[0] ?? null); // Safe fallback if array is empty
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = getFunctionStatusMessage(status);
      setPackageCondition((prev) => ({ ...prev, [product]: msg }));
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await API__UserSelectedPlan();
        console.log("Turbo Log  ~ UserDashboard ~ res:", res);
        const { data } = res;
        setUserPackage(data?.[0] ?? null); // Assumes it's an array, grabs the first object
      } catch (err) {
        console.error("Failed to fetch user package", err);
      }
    })();
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <UserLogoutButton />
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => {
          const productId = feature.id as CoreProduct;
          const isCore = CORE_PRODUCTS.includes(productId);
          const isActive = isCore && userPackage?.[productId];
          const statusLabel =
            packageCondition[productId] ||
            (isCore ? (isActive ? "Activated" : "Deactivated") : "");

          // Determine button color
          const buttonColor = !userPackage
            ? "bg-blue-500"
            : isActive
              ? "bg-green-600"
              : "bg-red-600";

          return (
            <div key={feature.id} className="p-2">
              <BentoCard {...feature} />
              {isCore && (
                <button
                  onClick={() => activatePackageForUser(productId)}
                  className={`mt-2 px-4 py-1 rounded text-white ${buttonColor}`}
                >
                  {statusLabel}
                </button>
              )}
            </div>
          );
        })}
      </BentoGrid>
    </div>
  );
}

export { UserDashboard };