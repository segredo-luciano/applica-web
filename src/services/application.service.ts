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

        if (!response.ok) {
        throw new Error("Upload failed");
        }

        alert("CV uploaded successfully!");
    } catch (err) {
        console.error(err);
        alert("Error uploading CV");
    }
};