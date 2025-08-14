"use client";

import LoadingIcon from "@/extermal_component/reusable_component/loading";
import { useAdminAuth } from "@/middleware/admin/useAuth";
import { api__admin_LogIn } from "@/services/api";
import { getLoginStatusMessage } from "@/utils/authLoginStatusCode";
import { SunIcon as Sunburst } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminFullScreenSignIn
 * - Login-only flow (no inline validation call here)
 * - Shows Loading while auth hook resolves
 * - Redirects to dashboard if already authenticated
 * - After successful login (HTTP 200) navigate to dashboard
 *
 * Important: Ensure api__admin_LogIn includes credentials if server uses cookies:
 *  - fetch(..., { credentials: "include" })
 *  - or axios(..., { withCredentials: true })
 */

export const AdminFullScreenSignIn = () => {
  const { isAdmin, loading, refreshValidation } = useAdminAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signInText, setSignInText] = useState("Log In");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // avoid state updates when unmounted
  // const mountedRef = useRef(true);
  // useEffect(() => {
  //   return () => {
  //     mountedRef.current = false;
  //   };
  // }, []);

  // If auth hook finished and user is admin, redirect to dashboard immediately
  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset
    setUserNameError("");
    setPasswordError("");
    setSignInText("Logging In...");
    setSubmitted(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // client-side validation
    if (!trimmedUsername || !trimmedPassword) {
      if (!trimmedUsername) setUserNameError("Username is empty");
      if (!trimmedPassword) setPasswordError("Password is empty");
      setSignInText("❌ Username or password is empty");
      setSubmitted(false);
      return;
    }

    try {
      // Call your login service (ensure it sends cookies if your backend uses sessions)
      const response = await api__admin_LogIn({ username: trimmedUsername, password: trimmedPassword });

      // Defensive display
      setSignInText(getLoginStatusMessage(response.status));

      if (response.status === 200) {
        // Successful login — navigate to dashboard
        // NOTE: do NOT await navigate; it's synchronous
        setSignInText(getLoginStatusMessage(response.status));
        await refreshValidation()
        navigate("/admin/dashboard", { replace: true });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      const status = err?.response?.status ?? null;
      console.log("Turbo Log  ~ handleSubmit ~ status:", status);
      setSignInText(getLoginStatusMessage(status));
    } finally {
      setSubmitted(false);
    }
  };

  // While the auth hook is resolving, show loader to avoid flicker
  if (loading) return <LoadingIcon />;

  // If already admin we've navigated away in effect; return null as a safe fallback
  if (isAdmin) return null;

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl bg-white/5 rounded-lg">
        <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-20 pointer-events-none"></div>

        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl overflow-hidden z-10">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
            CCMSS Admin Dashboard Login
          </h1>
          <p className="mt-4 text-sm opacity-80">Sign in to manage the system.</p>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-20 text-secondary-foreground">
          <div className="flex flex-col items-start mb-6">
            <div className="text-orange-500 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-medium mb-1">Keep your credentials secure.</h2>
            <p className="text-left opacity-80 text-sm">Welcome to CCMSS — enter admin credentials to continue.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="username" className="block text-sm mb-2">
                Enter Your Admin Username
                <span className="ml-2 italic text-gray-500 text-xs align-middle">
                  demo username: <mark>Admin_00001</mark>
                </span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${userNameError ? "border-red-500" : "border-gray-300"}`}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                aria-invalid={!!userNameError}
                aria-describedby="username-error"
                autoComplete="username"
              />
              {userNameError && (
                <p id="username-error" className="text-red-500 text-xs mt-1">
                  {userNameError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Enter Your Admin Password
                <span className="ml-2 italic text-gray-500 text-xs align-middle">
                  demo password: <mark>Admin123456789</mark>
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${passwordError ? "border-red-500" : "border-gray-300"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                autoComplete="current-password"
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full text-white font-medium py-2 px-4 rounded-lg transition-colors ${submitted ? "bg-orange-400 opacity-50 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
              disabled={submitted}
            >
              {submitted ? "Logging In…" : signInText}
            </button>

            <div aria-live="polite" className="mt-2 text-sm">
              <span className="text-ellipsis block">{signInText}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
