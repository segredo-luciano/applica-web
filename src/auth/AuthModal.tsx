import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SuccessScreen from "./Success";

export default function AuthModal({ open, onClose }: any) {
    const [mode, setMode] = useState<'login' | 'register' | 'success'>('login')

    useEffect(() => {
        if (open) {
            setMode("login");
        }
    }, [open]);

    if (!open) return null;    

    return (
        <div onClick={onClose}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-xl h-114 relative overflow-y-auto">       

                {mode === "login" && (
                    <LoginForm switchToRegister={() => setMode("register")} />
                )}

                {mode === "register" && (
                    <RegisterForm 
                        switchToLogin={() => setMode("login")}
                        onSuccess={() => setMode("success")}
                    />
                )}

                {mode === "success" && (
                    <SuccessScreen goToLogin={() => setMode("login")} />
                )}

            </div>
        </div>
    );

}