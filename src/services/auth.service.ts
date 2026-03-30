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

    console.log('servico: ', res)

    if (!res.ok) {
        const error = await res.json();
        console.error('erro servico: ',error)
        throw new Error(error.message || "Failed to register");
    }

    return res.json();
};