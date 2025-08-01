"use client";

import { useAdminAuth } from "@/middleware/admin/useAdminAuth";
import { API__Admin_LogIn } from "@/services/api";
import { getLoginStatusMessage } from "@/utils/authLoginStatusCode";
import { SunIcon as Sunburst } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const AdminFullScreenSignIn = () => {
  const { login } = useAdminAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signInText, setSignInText] = useState("Log In ");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    setSignInText("Logging In...");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Basic validation
    if (!trimmedUsername || !trimmedPassword) {
      if (!trimmedUsername) setUserNameError("Username is empty");
      if (!trimmedPassword) setPasswordError("Password is empty");
      setSignInText("❌ Username or password is empty");
      setSubmitted(false);
      return;
    }

    try {
      const email = username
      const response = await API__Admin_LogIn({ email, password });
      if (response.status === 200) {
        await localStorage.setItem("user_token", response.data.token);
        await login(response.data.token);
        await navigate("/admin/dashboard/"); // 👈 your destination route
      }
      setSignInText(getLoginStatusMessage(response.status));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.response?.status;
      setSignInText(getLoginStatusMessage(status));
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
            CCMSS Admin Dashboard Login
          </h1>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-orange-500 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              Take a peek over your shoulder. Your login is your key — keep it safe.
            </h2>
            <p className="text-left opacity-80">
              Welcome to CCMSS Admin Page — Let's get started
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Enter Your Admin Username :
                <span className="ml-2 italic text-gray-500 text-xs align-middle">
                  demo username: <mark>adminaccount@gmail.com</mark>
                </span>
              </label>
              <input
                type="text"
                id="username"
                placeholder="username"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${userNameError ? "border-red-500" : "border-gray-300"
                  }`}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                aria-invalid={!!userNameError}
                aria-describedby="email-error"
              /> {userNameError && (
                <p id="username-error" className="text-red-500 text-xs mt-1">
                  {userNameError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Enter Your Admin password:
                <span className="ml-2 italic text-gray-500 text-xs align-middle">
                  demo password:<mark>Admin123456789</mark>
                </span>
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
              {signInText}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
