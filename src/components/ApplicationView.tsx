import { useEffect, useRef, useState } from "react";
import type { Application } from "../types/application";
import { listJobApplications } from "../services/application.service";

import { Document, Page, pdfjs } from "react-pdf";

import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type Props = {
  jobCode: number;
  onClose: () => void;
};

export default function ApplicationView({ jobCode, onClose }: Props) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalApplies, setTotalApplies] = useState(0);
    const [pdfPages, setPdfPages] = useState<any>(0);
    const [loading, setLoading] = useState(false);

    const [direction, setDirection] = useState<"next" | "prev">("next");

    const [pages, setPages] = useState(1);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const baseX = 150;

    const listApplications = async () => {
        try {
            setLoading(true)
            const resp = await listJobApplications(jobCode, pages);            
            setApplications(resp.data);
            setTotalApplies(resp.total)
        } catch(err: any) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listApplications();
    }, [jobCode]);

    useEffect(() => {
        listApplications();
    }, [pages])

    const displayApplications = [...applications];

    if (totalApplies > 1) {
        displayApplications.push({
            code: "ghost",
            isGhost: true,
        } as any);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-50 w-full h-11/12 flex items-center justify-center overflow-hidden">
                <div className="absolute left-72 z-100 cursor-pointer">
                    <ChevronsLeft className={`transition-all duration-500 ease-out hover:-translate-x-2`}
                        onClick={() => pages > 1 ? setPages(pages-1) : setPages(totalApplies)}
                        color={'white'} size={124} />
                </div>

                {displayApplications.map((app, index) => {
                const offset = index - currentIndex;

                    if (Math.abs(offset) > 2) return null;

                    return (
                        <>
                            <div
                            key={app.code}
                            className="absolute transition-all duration-500 h-full"
                            style={{
                                transform: `
                                    translateX(${offset * 180}px)
                                    scale(${offset === 0 ? 1 : 0.9 - Math.abs(offset) * 0.05})
                                    rotate(${offset * 4}deg)
                                `,
                                zIndex: offset === 0 ? 20 : 10 - Math.abs(offset),
                                opacity: offset === 0 ? 1 : 0.6,
                                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <div style={{
                                    transform: `
                                        translateX(${offset * 80}px)
                                        scale(${1 - Math.abs(offset) * 0.05})
                                        rotate(${offset * 2}deg)
                                    `,
                                    zIndex: 10 - Math.abs(offset),
                                    opacity: offset === 0 ? 1 : 0.5,
                                    filter: offset === 0 ? "none" : "blur(1px)",
                                    }}
                                    ref={offset === 0 ? scrollRef : null}
                                    className="relative bg-white rounded-2xl shadow-2xl overflow-y-scroll w-full min-w-96 h-full flex items-start justify-center"
                                    >
                                    {app.isGhost ? (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span />
                                        </div>
                                    ) : offset === 0 ? (
                                        <Document
                                        file={app.cvUrl}
                                        loading={
                                            <div className="justify-center justify-self-center flex space-x-1 h-full">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                        }
                                        onLoadSuccess={({ numPages }) =>
                                            setPdfPages((prev: any) => ({
                                            ...prev,
                                            [app.code]: numPages,
                                            }))
                                        }
                                        className="flex flex-col items-center bg-gray-100 w-full"
                                        >
                                        {Array.from(
                                            new Array(pdfPages[app.code] || 0),
                                            (_, pageIndex) => (
                                            <div
                                                key={pageIndex}
                                                className="w-full flex flex-col items-center">
                                                <div className="bg-white shadow-lg rounded-sm overflow-hidden">
                                                    <Page
                                                        pageNumber={pageIndex + 1}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                        width={600}
                                                    />
                                                </div>

                                                {pageIndex <
                                                (pdfPages[app.code] || 0) - 1 && (
                                                <div className="h-10 w-full flex items-center justify-center">
                                                    <div className="w-24 h-[2px] bg-gray-300 rounded-full" />
                                                </div>
                                                )}
                                            </div>
                                            )
                                        )}
                                        </Document>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />                                                              
                                    )}
                                    </div>
                                </div>
                            </div>                            
                        </>
                    );
                })}

                <div className="absolute right-72 z-100 cursor-pointer">
                    <ChevronsRight className={`transition-all duration-500 ease-out hover:translate-x-2`}
                        onClick={() => pages == totalApplies ? setPages(1) : setPages(pages+1)}
                        color={'white'} size={124} />
                </div>
            </div>            
        </div>
    );
}