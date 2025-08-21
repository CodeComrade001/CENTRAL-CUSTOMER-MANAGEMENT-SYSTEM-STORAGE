import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  api__user_sgnupForSMS,
  api__user_sgnupForHMS,
  api__user_sgnupForCBT,
} from "../services/api"; // adjust path
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from '@/components/alert';
import { CircleCheckBig, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button"


export default function USerSignUpCard() {
  const HMS_PACKAGES = ["starter", "standard", "premium"];
  const SMS_PACKAGES = ["basic", "pro", "premium", "enterprise"];

  const [formData, setFormData] = useState({
    systemType: "",
    package: "",
    school_name: "",
    hospital_name: "",
    center_name: "",
    renewal_date: "",
    staff_count: 0,
    student_count: 0,
    last_payment_date: "",
    last_payment: "",
    available_slot: 0,
    used_slot: 0,
    last_slot_purchase: "",
    last_login: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationText, setShowNotificationText] = useState<{ text: string, textType: string }>({ text: "", textType: "" });
  let notificationTimer: ReturnType<typeof setTimeout>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const showNotificationWithDelay = () => {
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => {
      setShowNotificationText({ text: "", textType: "" });
    }, 3000);
  };

  const handleSubmit = async () => {
    if ((!formData.systemType || !formData.package) && formData.systemType == "SMS") {
      showNotificationWithDelay()
      return setShowNotificationText({ text: "Please select a system type and package", textType: "destructive" });
    }
    if ((!formData.systemType || !formData.package) && formData.systemType == "HMS") {
      showNotificationWithDelay()
      return setShowNotificationText({ text: "Please select a system type and package", textType: "destructive" });
    }
    setLoading(true);

    try {
      let res;
      if (formData.systemType === "SMS") {
        res = await api__user_sgnupForSMS({
          school_name: formData.school_name,
          package: formData.package,
          renewal_date: formData.renewal_date,
          staff_count: Number(formData.staff_count),
          student_count: Number(formData.student_count),
          last_payment_date: formData.last_payment_date,
        });
      } else if (formData.systemType === "HMS") {
        res = await api__user_sgnupForHMS({
          hospital_name: formData.hospital_name,
          package: formData.package,
          renewal_date: formData.renewal_date,
          last_payment: formData.last_payment,
        });
      } else if (formData.systemType === "CBT") {
        res = await api__user_sgnupForCBT({
          center_name: formData.center_name,
          available_slot: Number(formData.available_slot),
          used_slot: Number(formData.used_slot),
          last_slot_purchase: formData.last_slot_purchase,
          last_login: formData.last_login,
        });
      }

      if (res?.status === 200) {
        setShowNotificationText({ text: "Account Created Successfully. Navigate to admin Dashboard.", textType: "success" });
        setSuccess(true);
      }
    } catch {
      setShowNotificationText({ text: "Server Errror. Please try again.", textType: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getPackageOptions = () => {
    if (formData.systemType === "HMS") return HMS_PACKAGES;
    if (formData.systemType === "SMS") return SMS_PACKAGES;
    return [];
  };

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen bg-gray-50 p-4">

      {notificationText.text !== "" &&
        <div className="mx-auto">

          <Alert variant={notificationText.textType as 'secondary' | 'primary' | 'destructive' | 'success' | 'info' | 'warning'

          } close={true}>
            <AlertIcon>
              <CircleCheckBig />
            </AlertIcon>
            <AlertTitle>{notificationText.text}</AlertTitle>
            <AlertToolbar>
            </AlertToolbar>
          </Alert>
        </div>
      }
      <AnimatePresence>
        {!success ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
          >
            <h1 className="text-2xl font-bold text-center mb-4">
              Central Customer Management System
            </h1>
            <p className="text-gray-600 text-center text-sm mb-6">
              Store, organize, and access your customer data securely.
            </p>

            {/* System Type Dropdown */}
            <select
              title="System Type"
              name="systemType"
              value={formData.systemType}
              onChange={(e) => {
                setFormData({ ...formData, systemType: e.target.value, package: "" });
              }}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="">Select System</option>
              <option value="SMS">School Management System (SMS)</option>
              <option value="HMS">Hospital Management System (HMS)</option>
              <option value="CBT">CBT Center Management</option>
            </select>

            {/* Package Dropdown */}
            {(formData.systemType === "SMS" || formData.systemType === "HMS") && (
              <select
                title="Select package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg mb-4"
              >
                <option value="">Select Package</option>
                {getPackageOptions().map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
            )}

            {/* Conditional Fields */}
            {formData.systemType === "SMS" && (
              <>
                <input name="school_name" placeholder="School Name" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="renewal_date" placeholder="Renewal Date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="staff_count" placeholder="Staff Count" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="student_count" placeholder="Student Count" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="last_payment_date" placeholder="Last Payment Date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
              </>
            )}

            {formData.systemType === "HMS" && (
              <>
                <input name="hospital_name" placeholder="Hospital Name" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="renewal_date" placeholder="Renewal Date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="last_payment" placeholder="Last Payment Amount" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
              </>
            )}

            {formData.systemType === "CBT" && (
              <>
                <input name="center_name" placeholder="Center Name" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="available_slot" placeholder="Available Slot" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="used_slot" placeholder="Used Slot" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="last_slot_purchase" placeholder="Last Slot Purchase Date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                <input name="last_login" placeholder="Last Login Date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="bg-green-50 border border-green-300 p-6 rounded-xl shadow-md max-w-sm w-full text-center"
          >
            <h2 className="text-xl font-bold text-green-700">🎉 Signup Successful!</h2>
            <p className="text-green-600 mt-2">
              You have successfully signed up. Welcome to CCMSS!
              <Button size="lg" className="mx-5 gap-4">
                <a
                  href="/admin/dashboard"
                >
                  Next
                </a>
                <MoveRight className="w-4 h-4" />
              </Button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
