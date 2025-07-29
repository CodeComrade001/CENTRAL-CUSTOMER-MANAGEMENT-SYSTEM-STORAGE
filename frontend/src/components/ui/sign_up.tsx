"use client";

import { API__UserSignUp } from "@/services/api";
import { getNewAccountStatusMessage } from "@/utils/authNewAccountStatusCode";
import { SunIcon as Sunburst } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const UserFullScreenSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [schoolNameError, setSchoolNameError] = useState("");
  const [signUpText, setSignUpText] = useState("Create New Account");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateSchoolName = (value: string) => {
    return /^[A-Za-z\s]{3,50}$/.test(value.trim());
  };

  const validatePassword = (value: string) => {
    return value.length >= 8;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSignUpText("Creating Account...");

    let isValid = true;

    // Validation
    if (!validateSchoolName(schoolName)) {
      setSchoolNameError("School name must be 3–50 characters long and contain only letters and spaces.");
      isValid = false;
    } else {
      setSchoolNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      setSignUpText("❌ Invalid Input");
      setSubmitted(false);
      return;
    }

    try {
      const response = await API__UserSignUp({ schoolName, email, password });
      if (response.status === 200) {
        navigate("/user/dashboard"); // 👈 your destination route
      }
      setSignUpText(getNewAccountStatusMessage(response.status));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Turbo Log: Signup error", error);
      const status = error?.response?.status;
      setSignUpText(getNewAccountStatusMessage(status));
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center overflow-hidden p-4l">
      <div className=" w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
        <div className="flex absolute z-2  overflow-hidden backdrop-blur-2xl ">
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
        </div>
        <div className="w-[15rem] h-[15rem] bg-orange-500 absolute z-1 rounded-full bottom-0"></div>
        <div className="w-[8rem] h-[5rem] bg-white absolute z-1 rounded-full bottom-0"></div>
        <div className="w-[8rem] h-[5rem] bg-white absolute z-1 rounded-full bottom-0"></div>

        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl  overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight z-10 tracking-tight relative">
            CCMSS User Dashboard New Account.
          </h1>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-orange-500 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              Still using spreadsheets? Upgrade your workflow now.
            </h2>
            <p className="text-left opacity-80">
              From the first student to your 1000th customer — grow without chaos.
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Your School Name
              </label>
              <input
                type="text"
                id="schoolName"
                placeholder="High school of Boys"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${emailError ? "border-red-500" : "border-gray-300"
                  }`}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                aria-invalid={!!schoolNameError}
                aria-describedby="email-error"
              />
              {schoolNameError && (
                <p id="school-name-error" className="text-red-500 text-xs mt-1">
                  {schoolNameError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="hi@hextastudio.in"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${emailError ? "border-red-500" : "border-gray-300"
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Create new password
              </label>
              <input
                type="password"
                id="password"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full text-white font-medium py-2 px-4 rounded-lg transition-colors
    ${submitted ? 'bg-orange-400 opacity-50 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}
  `}
              disabled={submitted}
            >
              {signUpText}
            </button>


            <div className="text-center text-gray-600 text-sm">
              Already have account?{" "}
              <a href="/user/login" className="text-secondary-foreground font-medium underline">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
