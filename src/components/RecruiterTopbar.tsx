import { useState } from "react";
import logo from '../assets/logo-complete-removebg-preview.png'
import { LogOut, UserRound } from 'lucide-react';

const RecruiterTopbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="shadow-md">
            <header className="w-full bg-white">
                <div className="mx-auto flex items-center justify-between px-6 h-full w-4/5">
                    <img src={logo} className="h-28"/>
                    <div className="flex">
                        <UserRound strokeWidth={3} className="w-6 h-6 cursor-pointer" />
                        <LogOut strokeWidth={3} className="w-6 h-6 ml-4 cursor-pointer text-red-300" />
                    </div>                    
                </div>
                
                

            <div className="">
                </div>
            </header>
        </div>
    );
};

export default RecruiterTopbar;