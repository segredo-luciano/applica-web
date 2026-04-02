import { useEffect, useState } from "react";
import { getJobs } from "../services/job.service";
import type { Job } from "../types/job";
import { getCompanyLogo } from "../utils/getCompanyLogo";
import { extractDate } from "../utils/dateFormat";
import JobDetail from "../components/JobDetail";
import { BookX, ChevronLeft, ChevronRight, FunnelPlus, ListFilter } from "lucide-react";
import { RangeJobFilter } from "../types/rangeJobFilter";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);

    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('');
    const [range, setRange] = useState('');
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
    
    useEffect(() => {
        setCompany('');
        setTitle('');
    }, [openFilter])

    useEffect(() => {
        listJobs();
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
                            <div className="text-gray-400 font-bold rounded-xl p-3">
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
                                        onClick={() => listJobs()}>
                                        <span className="text-blue-400 font-bold">Filtrar</span>
                                        <FunnelPlus strokeWidth={3} className="ml-2 text-blue-400" />
                                    </button>
                                </div>
                                
                            </div>
                        </div>

                        
                    <div className={`flex cursor-pointer transition-all duration-500 ease-out 
                        ${!openFilter ? 'hover:translate-x-2' : 'hover:-translate-x-2'}`}
                        onClick={() => setOpenFilter((prev) => !prev)}>
                        <ListFilter strokeWidth={4}  
                            className="text-blue-400 shadow-2xl"/>
                        {!openFilter ? (
                            <ChevronRight strokeWidth={3} className="text-blue-400 font-extrabold ml-2" />
                        ) : (
                            <ChevronLeft strokeWidth={3} className="text-blue-400 font-extrabold ml-2" />
                        )}
                    </div>
                        
                </div>
            </div>

            <div className="w-3/4 justify-items-start ml-2">
                
                
                <div className="w-1/2">
                    <div className="text-3xl text-blue-600 decoration-from-font font-extrabold
                            text-shadow-lg">Essas são as vagas postadas pelos recrutadores ⬇
                    </div>                
                </div>   

                {loading ? (
                    <div className="w-1/2 justify-center mt-24 flex space-x-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
                                hover:shadow-blue-400
                                ${range === RangeJobFilter.DAY
                                ? 'shadow-lg shadow-blue-400/50 text-blue-600'
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
                                hover:shadow-blue-400
                                ${range === RangeJobFilter.WEEK
                                    ? 'shadow-lg shadow-blue-400/50 text-blue-600'
                                    : 'shadow-lg'
                                }`}>Última semana</button>
                    </div>
                    {jobs?.length! > 0 ? (
                        <>                            
                            <div className="flex">
                                {jobs!.slice(0, 3).map((job, index) => (
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
                            </div>
                        </>
                    )
                    :
                    (
                        <div className="mt-24 flex">
                            <BookX className="w-12 h-12 text-gray-400" />

                            <div className="text-2xl text-gray-400 content-center ml-4 underline">Infelizmente não há vagas no momento</div>
                        </div>
                    )}
                </div>  
                )}
            </div>

            {selectedJob && (
                <JobDetail onClose={() => setSelectedJob(null)} job={selectedJob} />      
            )}
        </div>
    );
}