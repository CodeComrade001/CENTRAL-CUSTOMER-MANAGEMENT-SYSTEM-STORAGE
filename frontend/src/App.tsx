import { Routes, Route } from "react-router-dom"
import { AdminFullScreenSignIn } from "./components/ui/admin_sign_in"
import { LandingPageIntroductionPage } from "./pages/landing_page"
import { AdminDashboard } from "./pages/admin_dashboard"
import NotFoundPage from "./pages/not found_page"
import USerSignUpCard from "./pages/user_dashborad"
import { ProtectedAdminRoute } from "./middleware/admin/ProtectedRoute"

function App() {

  return (
    <>
      <Routes >
        <Route path="/" element={<LandingPageIntroductionPage />} />
        <Route path="/user" element={<USerSignUpCard />} />
        <Route path="/admin" element={<LandingPageIntroductionPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/admin/login" element={<AdminFullScreenSignIn />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute element={<AdminDashboard />} />
          }
        />
        <Route />
      </Routes>

    </>
  )
}

export default App
