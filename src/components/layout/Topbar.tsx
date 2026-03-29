import { useState } from "react";
import logo from '../../assets/logo-complete-removebg-preview.png'
import AuthModal from "../auth/AuthModal";

const Topbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full bg-white">
            <div className="mx-auto flex items-center justify-between px-6 h-full w-4/5">
                <img src={logo} className="h-28"/>
                <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 cursor-pointer text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                Sou recrutador!
                </button>
            </div>
            
            <AuthModal open={open} onClose={() => setOpen(false)} />

        <div className="">
            </div>
        </header>
    );
};

export default Topbar;