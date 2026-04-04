import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
    company: string;
    company_domain: string | null;
}) => {    
    const res = await fetch(`${API_URL}/recruiter/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to register");
    }

    return res.json();
};

export const loginUser = async (payload: {
    email: string;
    password: string;
}) => {
    try {
        const res = await fetch(`${API_URL}/recruiter/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    
        const data = await res.json();    
        if (!res.ok) {        
            throw new Error(data.message || "Erro ao realizar login");
        }
    
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Erro ao realizar login')
    }
};