import { useRef, useState } from "react";
import { extractDate } from "../utils/dateFormat";
import { getCompanyLogo } from "../utils/getCompanyLogo";
import { apply } from "../services/application.service";
import toast from "react-hot-toast";

export default function JobDetail({ onClose, job }: any) {

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleApply = async (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {        
        const file = e.target.files?.[0];

        if (!file) return;

        setLoading(true);

        if (file.type !== "application/pdf") {
            setLoading(false);
            toast.error("Currículo deve ser no formato PDF");
            return;
        }

        await apply(file, job.code);

        setLoading(false);

        onClose();
    };

    if (!job) return null;

    return (
        <div onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl w-1/2 h-11/12 relative flex flex-col"> 
                <div className="pr-2 pt-2">
                    <div className="flex text-[12px] justify-self-end">Vaga postada em: {extractDate(job.created_at!)}</div>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="text-lg font-bold">{job.title}</div>
                    <div className="mt-8 ml-4 mr-4 text-sm">{job.description}</div>
                                                 
                </div>

                <div className="flex justify-between items-center p-2 pl-6 border-t-2 border-gray-100">
                    <div className="flex">
                        <img className="w-7 h-7 self-center mr-2" 
                            src={getCompanyLogo(job.company_domain, job.company_logo)} alt="" />
                        <p className="text-xl text-gray-500">{job.company}</p>
                    </div>

                    <div className="text-xl justify-self-end">
                        {loading ? (
                            <div className="justify-center flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        )
                        :
                        (
                            <button onClick={handleUpload}
                                className="bg-blue-600 text-white font-medium
                                p-1 pl-3 pr-3 rounded-xl cursor-pointer
                                transition motion-safe:hover:-translate-x-0.5
                                hover:bg-blue-800">
                                Applicar
                            </button> 
                        )}                        

                        <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleApply}
                        />                       
                    </div>
                </div>
            </div>
        </div>
    )
}