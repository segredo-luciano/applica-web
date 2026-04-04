import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import RecruiterLayout from "./layout/RecruiterLayout";
import Home from "./pages/Home";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            !isAuthenticated ? <Home /> : <Navigate to="/recrutador" />
          }
        />
      </Route>

      <Route element={<RecruiterLayout />}>
        <Route
          path="/recrutador"
          element={
            isAuthenticated ? <RecruiterDashboard /> : <Navigate to="/" />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} 
          toastOptions={{
            success: {
              style: {
                background: "#BFDBFE",
                color: "#2563EB",
              },
            },
            error: {
              style: {
                background: "#FECACA",
                color: "#DC2626",
              },
            },
          }}/>

        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}