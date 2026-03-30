import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import RecruiterLayout from "./layout/RecruiterLayout";
import Home from "./pages/Home";
import RecruiterDashboard from "./pages/RecruiterDashboard";

const isAuthenticated = !!localStorage.getItem("token");

function App() {  

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              !isAuthenticated ? <Home /> : <Navigate to="/recruiter" />
            }
          />
        </Route>

        <Route element={<RecruiterLayout />}>
          <Route
            path="/recruiter"
            element={
              isAuthenticated ? <RecruiterDashboard /> : <Navigate to="/" />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;