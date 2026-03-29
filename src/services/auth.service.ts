const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
    company_name: string;
    company_domain: string | null;
}) => {
    const res = await fetch(`${API_URL}/register`, {
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