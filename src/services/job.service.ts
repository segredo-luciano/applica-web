import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (payload: {
    title: string | null,
    company: string | null,
    range: string | null,
    mostRecent: boolean;
}) => {
    const params = new URLSearchParams();

    if (payload.title) {
        params.append("title", payload.title);
    }

    if (payload.company) {
        params.append("company", payload.company);
    }

    if (payload.range) {
        params.append("range", payload.range);
    }

    if (payload.mostRecent !== null) {
        params.append("order", payload.mostRecent ? "recent" : "oldest");
    }
    const resp = await fetch(`${API_URL}/job/list?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.message || "Failed to fetch jobs");
    }

    return resp.json();
}

export const getJobsByRecruiter = async (payload: {
    title: string | null,
    company: string | null,
    range: string | null,
    mostRecent: boolean;
}) => {
    const token = localStorage.getItem("token");

    try {
        const params = new URLSearchParams();

        if (payload.title) {
            params.append("title", payload.title);
        }

        if (payload.company) {
            params.append("company", payload.company);
        }

        if (payload.range) {
            params.append("range", payload.range);
        }

        if (payload.mostRecent !== null) {
            params.append("order", payload.mostRecent ? "recent" : "oldest");
        }
        const response = await fetch(`${API_URL}/job/list/recruiter?${params.toString()}`, {
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
            throw new Error(data.message || "Erro ao buscar vagas");
        }

        return data;
    } catch (err: any) {
        toast.error(err.message || "Erro ao listar suas vagas");

        console.error(err)
    }
};