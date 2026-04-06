import { useEffect, useState } from "react";
import { getJobsByRecruiter } from "../services/job.service.js";
import type { Job } from "../types/job.js";
import { BookX, ChevronLeft, ChevronRight, FolderClosed, FolderOpen, FunnelPlus, ListFilter } from "lucide-react";
import { getCompanyLogo } from "../utils/getCompanyLogo";
import { RangeJobFilter } from "../types/rangeJobFilter";
import { extractDate } from "../utils/dateFormat.js";
import { useAuth } from "../context/AuthContext.js";
import { listJobApplications } from "../services/application.service.js";
import ApplicationView from "../components/ApplicationView.js";

export default function RecruiterDashboard() {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<Job[] | null>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const [openFilter, setOpenFilter] = useState(false);

    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('');
    const [range, setRange] = useState('');
    const [isMostRecent, setIsMostRecent] = useState(true);

    const { recruiter } = useAuth();

    const listRecruiterPosts = async () => {
        try {
            setLoading(true);

            const resp = await getJobsByRecruiter({
                title,
                company, 
                range, 
                mostRecent: isMostRecent
            });
            setJobs(resp?.data)
        } catch(err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenJob = async (job: Job) => {
        try {
            setSelectedJob(job);
            setOpenModal(true);

            const resp = await listJobApplications(job.code);
            setApplications(resp.data);
            setCurrentIndex(0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        listRecruiterPosts();
    }, [])

    useEffect(() => {
        setCompany('');
        setTitle('');
    }, [openFilter])

    useEffect(() => {
        listRecruiterPosts();
    }, [range])

    return (
        <div className="w-11/12 justify-self-center flex">
            <div className="w-1/4">
                <div className="flex">
                    <div
                        className={`
                            overflow-hidden transition-all duration-500
                            ${openFilter ? "w-64 opacity-100 mr-4" : "w-0 opacity-0"}
                        `}
                        >
                        <div className="text-gray-500 font-bold rounded-xl p-3">
                            Filtro de vagas
                        </div>

                        <div>
                            <input value={title} onChange={(e) => setTitle(e.target.value)}
                                placeholder="Por posição da vaga" 
                                className="input outline-none focus:outline-none focus:ring-0 mt-2 w-full border-b-2 border-gray-200 p-2" />

                            <input value={company} onChange={(e) => setCompany(e.target.value)}
                                placeholder="Por empresa" 
                                className="input outline-none focus:outline-none focus:ring-0 mt-2 w-full border-b-2 border-gray-200 p-2" />

                            <div className="mt-3">
                                <button className="flex justify-self-end cursor-pointer
                                    transition-all duration-500 ease-out hover:-translate-x-2"
                                    onClick={() => listRecruiterPosts()}>
                                    <span className="text-blue-900 font-bold">Filtrar</span>
                                    <FunnelPlus strokeWidth={3} className="ml-2 text-blue-900" />
                                </button>
                            </div>
                            
                        </div>
                    </div>

                    <div className={`flex cursor-pointer transition-all duration-500 ease-out 
                        ${!openFilter ? 'hover:translate-x-2' : 'hover:-translate-x-2'}`}
                        onClick={() => setOpenFilter((prev) => !prev)}>
                        <ListFilter strokeWidth={4}  
                            className="text-blue-900 shadow-2xl"/>
                        {!openFilter ? (
                            <ChevronRight strokeWidth={3} className="text-blue-900 font-extrabold ml-2" />
                        ) : (
                            <ChevronLeft strokeWidth={3} className="text-blue-900 font-extrabold ml-2" />
                        )}
                    </div>
                </div>
            </div>

            <div className="w-3/4 justify-items-start ml-2">
                
                
                <div className="w-1/2">
                    <div className="text-3xl text-blue-900 decoration-from-font font-extrabold
                            text-shadow-lg">Essas são suas vagas ativas, {recruiter?.name}
                    </div>                
                </div>   

                {loading ? (
                    <div className="w-1/2 justify-center mt-24 flex space-x-1">
                        <div className="w-4 h-4 bg-blue-900 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-blue-900 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-4 h-4 bg-blue-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                )
                :
                (
                    
                    
                <div className="relative w-full mt-4">
                    <div className="w-1/2 flex justify-center mb-4">
                        <button onClick={() =>
                                setRange((prev) =>
                                prev === RangeJobFilter.DAY ? '' : RangeJobFilter.DAY
                                )
                            }
                            className={`bg-white rounded-2xl p-2
                                text-xs font-semibold cursor-pointer
                                transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]
                                hover:shadow-blue-900
                                ${range === RangeJobFilter.DAY
                                ? 'shadow-lg shadow-blue-900/50 text-blue-900'
                                : 'shadow-lg'
                                }`}>Últimas 24 horas</button>
                        <button onClick={() =>
                                setRange((prev) =>
                                prev === RangeJobFilter.WEEK ? "" : RangeJobFilter.WEEK
                                )
                            }
                            className={`bg-white rounded-2xl p-2 ml-8
                                text-xs font-semibold cursor-pointer
                                transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]
                                hover:shadow-blue-900
                                ${range === RangeJobFilter.WEEK
                                    ? 'shadow-lg shadow-blue-900/50 text-blue-900'
                                    : 'shadow-lg'
                                }`}>Última semana</button>
                    </div>
                    {jobs?.length! > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {jobs?.map((job) => (
                                <div
                                    key={job.code}
                                    onClick={() => handleOpenJob(job)}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:scale-105">
                                    <FolderClosed strokeWidth={3} className="text-blue-900 w-12 h-12 mb-2" />

                                    <div className="text-center font-semibold text-gray-800 text-sm">
                                    {job.title}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-1">
                                    Postada em {extractDate(job.created_at!)}
                                    </div>
                                </div>
                                ))}
                            </div>
                        </>
                    )
                    :
                    (
                        <div className="mt-24 flex">
                            <BookX className="w-12 h-12 text-gray-400" />

                            <div className="text-2xl text-gray-400 content-center ml-4 underline">Você não possui vagas ativas</div>
                        </div>
                    )}
                </div>  
                )}
            </div>
            {openModal && (
                <ApplicationView
                    jobCode={selectedJob?.code!}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
}