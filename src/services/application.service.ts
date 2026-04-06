import toast from "react-hot-toast";
import type { Job } from "../types/job";

const API_URL = import.meta.env.VITE_API_URL;

export const apply = async (file: File, jobCode: number) => {
    const formData = new FormData();

    formData.append("cv_file", file);
    formData.append("job_code", jobCode.toString());

    try {
        const response = await fetch(`${API_URL}/application`, {
        method: "POST",
        body: formData,
        });        

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erro ao enviar currículo");
        }

        toast.success("Currículo applicado com sucesso!");
    } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Erro ao enviar currículo");
    }
};

export const listJobApplications = async (
    jobCode: number
) => {
    const token = localStorage.getItem("token");

    try {
        const params = new URLSearchParams();

        if(jobCode) {
            params.append('jobCode', jobCode.toString())
        }

        const response = await fetch(`${API_URL}/application?${params.toString()}`, {
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
}