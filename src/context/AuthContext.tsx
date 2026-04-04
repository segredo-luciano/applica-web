import { createContext, useContext, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    recruiter: any,
    setRecruiter: React.Dispatch<React.SetStateAction<any>>
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );    

    const [recruiter, setRecruiter] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, recruiter, setRecruiter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

// const initAuth = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     try {
//       const response = await fetch(`${API_URL}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error();

//       const data = await response.json();

//       setRecruiter(data.recruiter);
//       setIsAuthenticated(true);
//     } catch {
//       localStorage.removeItem("token");
//       setRecruiter(null);
//       setIsAuthenticated(false);
//     }
// };