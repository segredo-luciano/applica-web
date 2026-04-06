import { createContext, useContext, useEffect, useState } from "react";
import { getRecruiterLoggedIn } from "../services/auth.service";

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

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const data = await getRecruiterLoggedIn(); 
                console.log(data)

                setRecruiter(data.recruiter);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                setRecruiter(null);
                setIsAuthenticated(false);
            } 
        };

        initAuth();
    }, []);

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