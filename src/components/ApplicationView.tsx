import { useEffect, useState } from "react";
import type { Application } from "../types/application";
import { listJobApplications } from "../services/application.service";

type Props = {
  jobCode: number;
  onClose: () => void;
};

export default function ApplicationView({ jobCode, onClose }: Props) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const listApplications = async () => {
        try {
            const resp = await listJobApplications(jobCode);
            console.log(resp.data);
            setApplications(resp.data);
        } catch(err: any) {
            console.error(err);
        }
    }

    useEffect(() => {
        listApplications();
    }, [jobCode]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />

        <div className="relative z-50 w-[800px] h-[600px] flex items-center justify-center">
            {applications.map((app, index) => {
            const offset = index - currentIndex;

            if (Math.abs(offset) > 2) return null;

            return (
                <div
                key={app.code}
                className="absolute transition-all duration-500"
                style={{
                    transform: `
                    translateX(${offset * 40}px)
                    scale(${1 - Math.abs(offset) * 0.05})
                    `,
                    zIndex: 10 - Math.abs(offset),
                    opacity: offset === 0 ? 1 : 0.6,
                }}
                >
                <div className="bg-white rounded-xl shadow-2xl p-4 w-[600px] h-[500px]">

                    {offset === 0 && (
                    <iframe
                        src={app.cv_url}
                        className="w-full h-full rounded-lg"
                    />
                    )}

                </div>
                </div>
            );
            })}

            <div className="absolute bottom-4 flex gap-4">
            <button
                onClick={() => setCurrentIndex((p) => Math.max(p - 1, 0))}
                className="bg-white px-4 py-2 rounded shadow"
            >
                Prev
            </button>

            <button
                onClick={() =>
                setCurrentIndex((p) =>
                    Math.min(p + 1, applications.length - 1)
                )
                }
                className="bg-white px-4 py-2 rounded shadow"
            >
                Next
            </button>
            </div>
        </div>
        </div>
    );
}