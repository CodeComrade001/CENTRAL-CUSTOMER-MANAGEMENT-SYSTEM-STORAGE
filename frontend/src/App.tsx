import { Routes, Route } from "react-router-dom"
import { AdminFullScreenSignIn } from "./components/ui/admin_sign_in"
import { UserFullScreenSignUp } from "./components/ui/sign_up"
import { UserFullScreenSignIn } from "./components/ui/sign_in"
import { UserIntroductionPage } from "./pages/user_page"
import { LandingPageIntroductionPage } from "./pages/landing_page"
import UserProtectedRoute from './extermal_component/middleware/userProtectedRoute';
import AdminProtectedRoute from "./extermal_component/middleware/adminProtectedRoute"
import { AdminDashboard } from "./extermal_component/admin_dashboard"
import { UserDashboard } from "./extermal_component/user_dashborad"
import NotFoundPage from "./pages/not found_page"
import { UserDashboardPackages } from "./pages/package_view"

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
            <AdminProtectedRoute >
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute isUserAuthenticated={true} >
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard/packages"
          element={
            <UserProtectedRoute isUserAuthenticated={true} >
              <UserDashboardPackages />
            </UserProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
