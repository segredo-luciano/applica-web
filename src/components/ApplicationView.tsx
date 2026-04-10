import React, { useEffect, useRef, useState } from "react";
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
    const [totalApplies, setTotalApplies] = useState(0);
    const [pdfPages, setPdfPages] = useState<any>(0);
    const [loading, setLoading] = useState(false);

    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [isEntering, setIsEntering] = useState(false);

    const [pages, setPages] = useState(1);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const listApplications = async () => {
        try {
            setLoading(true)
            const resp = await listJobApplications(jobCode, pages);            
            
            setApplications(resp.data);            
            setTotalApplies(resp.total);

            setDirection(null);
                       
        } catch(err: any) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listApplications();
    }, [jobCode, pages]);

    const currentApp = applications[0];

    return (
                    
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative z-50 w-full h-11/12 flex items-center justify-center overflow-hidden">                  
                    <div
                        className="absolute left-4 z-100 cursor-pointer
                            transition-all duration-500 ease-out hover:-translate-x-2"
                        onClick={() => {
                            if (loading) return;

                            setDirection("right");
                            setIsEntering(false);

                            setTimeout(() => {
                                setPages((prev) =>
                                    prev <= 1 ? totalApplies : prev - 1
                                );

                                setIsEntering(true);
                            }, 400);
                        }}
                        >
                        <ChevronLeft color="white" size={124} />
                    </div>

                    {currentApp && (
                        <div className="relative h-full flex items-center justify-center">
                            <div
                                className={`w-full h-full flex justify-center transition-all duration-400 ease-in-out ${
                                    !direction
                                        ? "translate-x-0 opacity-100"
                                        : isEntering
                                        ? direction === "left"
                                        ? "translate-x-full opacity-0"
                                        : "-translate-x-full opacity-0"
                                        : direction === "left"
                                        ? "-translate-x-full opacity-0"
                                        : "translate-x-full opacity-0"
                                    }`
                                }
                            >
                            <div
                                ref={scrollRef}
                                className="bg-white rounded-2xl shadow-2xl overflow-y-scroll w-full min-w-96 h-full flex flex-col items-center"
                            >
                                <Document
                                    file={currentApp.cvUrl}
                                    loading={
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex space-x-1 h-full items-center justify-center">
                                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    }
                                    onLoadSuccess={({ numPages }) =>
                                        setPdfPages((prev: any) => ({
                                        ...prev,
                                        [currentApp.code]: numPages,
                                        }))
                                    }
                                    className="flex flex-col items-center bg-gray-100 w-full"
                                    >
                                    {Array.from(
                                        new Array(pdfPages[currentApp.code] || 0),
                                        (_, pageIndex) => (
                                        <div key={pageIndex} className="flex flex-col items-center">
                                            <div className="bg-white shadow-lg rounded-sm overflow-hidden">
                                            <Page
                                                pageNumber={pageIndex + 1}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                width={600}
                                            />
                                            </div>

                                            {pageIndex <
                                            (pdfPages[currentApp.code] || 0) - 1 && (
                                            <div className="h-10 w-full flex items-center justify-center">
                                                <div className="w-24 h-[2px] bg-gray-300 rounded-full" />
                                            </div>
                                            )}
                                        </div>
                                        )
                                    )}
                                </Document>
                            </div>
                            </div>
                        </div>
                    )}                

                    <div
                        className="absolute right-4 z-50 cursor-pointer transition-all duration-500 hover:translate-x-2"
                        onClick={() => {
                            if (loading) return;

                            setDirection("left");
                            setIsEntering(false); 
                        
                            setTimeout(() => {
                                setPages((prev) =>
                                    prev === totalApplies ? 1 : prev + 1
                                );

                                setIsEntering(true); 
                            }, 400);                         
                        }}
                        >
                        <ChevronRight color="white" size={124} />
                    </div>
                </div>            
            </div>
        
    );
}