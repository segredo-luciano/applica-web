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
    const params = new URLSearchParams();

    if(payload.email) params.append('email', payload.email);
    if(payload.password) params.append('password', payload.password)

    try {
        const res = await fetch(`${API_URL}/recruiter/login?${params.toString()}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
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

export const getRecruiterLoggedIn = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/recruiter/get/loggedIn`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.status === 401) {
            localStorage.removeItem("token");

            window.location.href = "/";

            throw new Error("Sessão expirada. Faça login novamente.");
        }

        const data = await response.json();    
        if (!response.ok) {        
            throw new Error(data.message || "Erro ao recuperar dados da conta");
        }
    
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Erro ao recuperar dados da conta')
    }
}