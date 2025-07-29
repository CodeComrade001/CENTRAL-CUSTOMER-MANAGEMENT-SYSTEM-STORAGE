import { Routes, Route } from "react-router-dom"
import { AdminFullScreenSignIn } from "./components/ui/admin_sign_in"
import { UserFullScreenSignUp } from "./components/ui/sign_up"
import { UserFullScreenSignIn } from "./components/ui/sign_in"
import { UserIntroductionPage } from "./pages/user_page"
import { LandingPageIntroductionPage } from "./pages/landing_page"
import UserProtectedRoute from './extermal_component/middleware/userProtectedRoute';
import { AdminDashboard } from "./extermal_component/admin_dashboard"
import { UserDashboard } from "./extermal_component/user_dashborad"
import NotFoundPage from "./pages/not found_page"
import { UserDashboardPackages } from "./pages/user_dashboard_package_view"
import { AuthProvider } from "./context/authContext"

function App() {

  return (
    <>
      <Routes >
        <Route path="/" element={<LandingPageIntroductionPage />} />
        <Route path="/user" element={<UserIntroductionPage />} />
        <Route path="/admin" element={<LandingPageIntroductionPage />} />
        <Route path="/admin/login" element={<AdminFullScreenSignIn />} />
        <Route path="/user/create-account" element={<UserFullScreenSignUp />} />
        <Route path="/user/login" element={<UserFullScreenSignIn />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AuthProvider>
              <AdminDashboard />
            </AuthProvider >
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute  >
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard/packages"
          element={
            // <UserProtectedRoute  >
            <UserDashboardPackages />
            // </UserProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
