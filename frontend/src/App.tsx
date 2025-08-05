import { Routes, Route } from "react-router-dom"
import { AdminFullScreenSignIn } from "./components/ui/admin_sign_in"
import { UserFullScreenSignUp } from "./components/ui/sign_up"
import { UserFullScreenSignIn } from "./components/ui/sign_in"
import { UserIntroductionPage } from "./pages/user_page"
import { LandingPageIntroductionPage } from "./pages/landing_page"
import { AdminDashboard } from "./extermal_component/admin_dashboard"
import { UserDashboard } from "./extermal_component/user_dashborad"
import NotFoundPage from "./pages/not found_page"
import { UserDashboardPackages } from "./pages/user_dashboard_package_view"
import ProtectedAdminRoute from "./middleware/admin/protectedAdminRoute"
import ProtectedUserRoute from "./middleware/user/protectedUserRoute"
import { AdminAuthProvider } from "./middleware/admin/adminAuthProvider"
import { UserAuthProvider } from "./middleware/user/userAuthProvider"

function App() {

  return (
    <>
      <UserAuthProvider>
        <AdminAuthProvider>
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
                <ProtectedAdminRoute  >
                  <AdminDashboard />
                </ProtectedAdminRoute >
              }
            />
            <Route />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedUserRoute  >
                  <UserDashboard />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/user/dashboard/packages"
              element={
                <ProtectedUserRoute  >
                  <UserDashboardPackages />
                </ProtectedUserRoute>
              }
            />
          </Routes>
        </AdminAuthProvider>
      </UserAuthProvider>
    </>
  )
}

export default App
