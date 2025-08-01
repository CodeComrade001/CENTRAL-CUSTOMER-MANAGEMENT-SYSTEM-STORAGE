import { useState } from "react";
import { useUserAuth } from "@/middleware/user/useUserAuth";
import { API__UserSignOut } from "@/services/api";

const UserLogoutButton = () => {
  const { logout } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleLogout = async () => {
    setLoading(true);
    setStatus("idle");

    try {
      const res = await API__UserSignOut();
      if (res.status === 200) {
        logout(); // Clear context/localStorage
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-20 right-4 z-50">
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`px-4 py-2 rounded text-white font-semibold bg-black hover:bg-gray-900 transition-all duration-200 flex items-center gap-2`}
      >
        {loading && (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Logging out..." : "Logout"}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-2 text-sm">Logged out ✅</p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2 text-sm">Logout failed ❌</p>
      )}
    </div>
  );
};

export default UserLogoutButton;
