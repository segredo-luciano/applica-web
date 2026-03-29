import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ open, onClose }: any) {
    const [mode, setMode] = useState<'login' | 'register'>('login')

    if (!open) return null;

    return (
    <div onClick={onClose}
     className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl w-1/2 h-11/12 relative overflow-y-auto">
            <button onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
                X
            </button>

            {mode === "login" ? (
                <LoginForm switchToRegister={() => setMode("register")} />
            ) : (
                <RegisterForm switchToLogin={() => setMode("login")} />
            )}

        </div>
    </div>
  );

}