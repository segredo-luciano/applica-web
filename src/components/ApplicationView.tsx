import React, { useEffect, useRef, useState } from "react";
import type { Application } from "../types/application";
import { listJobApplications } from "../services/application.service";

import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [index, setIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const listApplications = async () => {
    try {
      setLoading(true);
      const resp = await listJobApplications(jobCode, pages);

      setApplications(resp.data);
      setIndex(0);
      setTotalApplies(resp.total);

      setDirection(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        listApplications();
        }, [jobCode, pages]);

        useEffect(() => {
        if (applications.length === 0) return;

        const isPrev = direction === "right";
        // const isNext = direction === "left";

        if (isPrev && index === 0) {
        setIndex(applications.length - 1);
        }

    }, [applications]);

  const currentApp = applications[index] || applications[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-50 w-full h-11/12 flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-0 right-4 z-50 cursor-pointer mr-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
          onClick={onClose}
        >
          <X color="white" size={54} />
        </div>

        <div
            className="absolute left-4 z-50 cursor-pointer transition-all duration-500 ease-out hover:-translate-x-2"
            onClick={() => {
                if (loading) return;

                setDirection("right");
                setIsEntering(false);

                setTimeout(() => {
                    setIndex((prev) => {
                    if (prev > 0) return prev - 1;

                    const isSinglePage = totalApplies <= applications.length;

                    if (isSinglePage) {
                        return applications.length - 1;
                    }

                    setPages((p) => (p <= 1 ? totalApplies : p - 1));
                    return 0;
                    });

                    setIsEntering(true);
                }, 300);
            }}
        >
          <ChevronLeft color="white" size={124} />
        </div>

        {currentApp ? (
          <div className="relative h-full flex items-center justify-center">
            <div
              className={`w-full h-full flex justify-center transition-all duration-300 ease-in-out ${
                !direction
                  ? "translate-x-0 opacity-100"
                  : isEntering
                  ? "translate-x-0 opacity-100"
                  : direction === "left"
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div
                ref={scrollRef}
                className="bg-white rounded-2xl shadow-2xl overflow-y-scroll w-full min-w-96 h-full flex flex-col items-center"
              >
                <Document
                  key={`${currentApp.code}-${pages}-${index}`}
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
                      <div
                        key={pageIndex}
                        className="flex flex-col items-center"
                      >
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
                            <div className="w-24 h-0.5 bg-gray-300 rounded-full" />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </Document>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white">Carregando...</div>
        )}

        <div
          className="absolute right-4 z-50 cursor-pointer transition-all duration-500 hover:translate-x-2"
          onClick={() => {
            if (loading) return;

            setDirection("left");
            setIsEntering(false);

            setTimeout(() => {
                setIndex((prev) => {
                const lastIndex = applications.length - 1;

                if (prev < lastIndex) return prev + 1;

                const isSinglePage = totalApplies <= applications.length;

                if (isSinglePage) {
                    return 0;
                }

                setPages((p) => (p === totalApplies ? 1 : p + 1));
                return 0;
                });

                scrollRef.current?.scrollTo({ top: 0 });
                setIsEntering(true);
            }, 300);
            }}
        >
          <ChevronRight color="white" size={124} />
        </div>
      </div>
    </div>
  );
}