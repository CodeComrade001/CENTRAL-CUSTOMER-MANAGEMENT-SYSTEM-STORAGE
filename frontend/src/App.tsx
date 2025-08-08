import { Routes, Route } from "react-router-dom"
import { AdminFullScreenSignIn } from "./components/ui/admin_sign_in"
import { LandingPageIntroductionPage } from "./pages/landing_page"
import { AdminDashboard } from "./extermal_component/admin_dashboard"
import NotFoundPage from "./pages/not found_page"
import USerSignUpCard from "./extermal_component/user_dashborad"

function App() {
  console.log("app has started")

  return (
    <>
      {/* <AdminAuthProvider> */}
      <Routes >
        <Route path="/" element={<LandingPageIntroductionPage />} />
        <Route path="/user" element={<USerSignUpCard />} />
        <Route path="/admin" element={<LandingPageIntroductionPage />} />
        <Route path="/admin/login" element={<AdminFullScreenSignIn />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard />
          }
        />
        <Route />
      </Routes>
      {/* </AdminAuthProvider> */}
    </>
  )
}

export default App
