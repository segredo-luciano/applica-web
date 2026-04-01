import { useEffect, useState } from "react";
import { getJobs } from "../services/job.service";
import type { Job } from "../types/job";
import { getCompanyLogo } from "../utils/getCompanyLogo";
import { extractDate } from "../utils/dateFormat";
import JobDetail from "../components/JobDetail";

export default function Home() {
    const [open, setOpen] = useState(false);

    const [company, setCompany] = useState(null);
    const [title, setTitle] = useState(null);
    const [range, setRange] = useState(null);
    const [isMostRecent, setIsMostRecent] = useState(true);

    const [jobs, setJobs] = useState<Job[] | null>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listJobs();
    }, [])

    const listJobs = async () => {
        try {
            setLoading(true);

            const resp = await getJobs({
                title,
                company, 
                range, 
                mostRecent: isMostRecent
            });

            console.log(resp.data);
            setJobs(resp.data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div>
                <div className="w-2/5 justify-self-center text-3xl text-blue-600 decoration-from-font font-extrabold
                        text-shadow-lg">Essas são as vagas postadas pelos recrutadores ⬇</div>                
            </div>   

            <div className="relative w-full mt-8 flex items-center justify-center">
                {jobs && (
                    <>
                    {jobs.slice(0, 3).map((job, index) => (
                        <div
                            onClick={() => setSelectedJob(job)}
                            key={job.code}
                            className={`
                                 w-80 bg-white rounded-2xl shadow-xl transition-all duration-500
                                 
                                 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:shadow-blue-300
                                cursor-pointer
                                ${index === 0 && "z-20 scale-100 translate-y-0"}
                                ${index === 1 && "z-10 scale-95 translate-y-4 opacity-90"}
                                ${index === 2 && "z-5 scale-90 translate-y-8 opacity-80"}
                            `}
                            >
                            <div className="pt-6 pr-6 pl-6 pb-2">
                                <div className="text-lg font-bold">{job.title}</div>
                                <div className="mt-8 mb-8 text-sm">{job.description!.length > 300 ? job.description!.slice(0, 300) + "..." : job.description!}</div>
                                <div className="">
                                    <div className="text-[12px] justify-self-end">Vaga postada em: {extractDate(job.created_at!)}</div>
                                </div>                                
                            </div>

                            <div className="justify-self-end border-t-2 border-t-gray-100 w-full">
                                <div className="flex p-2">
                                    <img className="w-5 h-5 self-center mr-2" 
                                        src={getCompanyLogo(job.company_domain, job.company_logo)} alt="" />
                                    <p className="text-gray-500">{job.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </>
                )}
            </div>  

            {selectedJob && (
                <JobDetail onClose={() => setSelectedJob(null)} job={selectedJob} />      
            )}
        </div>
    );
}