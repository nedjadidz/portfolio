import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { NoiseBackground } from "./noise-background";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Globe } from "lucide-react";
import { Button } from "./button";

export interface CaseStudySection {
  title: string;
  content: string;
  image?: string;
}

export interface CaseStudyData {
  subtitle: string;
  heroImage: string;
  roles: string[];
  timeline: string;
  tools: string[];
  externalLink?: string;
  sections: CaseStudySection[];
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  caseStudy?: CaseStudyData;
}

export function ProjectCard({ title, description, image, link, caseStudy }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent) => {
    if (caseStudy) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && caseStudy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-[#F9F9F7] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 transform-gpu will-change-transform"
          >
            {/* Header / Sticky Nav */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none">
              <span className="text-white font-serif text-xl tracking-tight drop-shadow-md">
                {title}
              </span>
              <div className="flex items-center gap-3">
                {caseStudy.externalLink && (
                  <Button asChild variant="custom" className="h-10 px-4 rounded-full bg-canvas/20 backdrop-blur-md text-white hover:bg-canvas hover:text-ink border-0 pointer-events-auto transition-colors font-semibold text-sm">
                    <a
                      href={caseStudy.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <Globe size={16} />
                      Live Project
                    </a>
                  </Button>
                )}
                <Button 
                  variant="custom"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-canvas/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-canvas hover:text-ink border-0 pointer-events-auto transition-colors"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto w-full h-full pb-24 custom-scrollbar">
              
              {/* Hero */}
              <div className="relative h-[40vh] md:h-[60vh] min-h-[300px] w-full bg-ink">
                <img src={caseStudy.heroImage} alt={title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F9F9F7] via-transparent to-transparent" />
              </div>

              <div className="px-6 md:px-12 -mt-16 md:-mt-32 relative z-10 max-w-4xl mx-auto">
                <div className="bg-canvas p-8 md:p-12 rounded-3xl shadow-xl border border-line">
                  <h2 className="text-4xl md:text-6xl font-serif text-ink tracking-tight mb-4">{title}</h2>
                  <p className="text-xl md:text-2xl text-ink-muted font-light mb-8">{caseStudy.subtitle}</p>
                  <p className="text-lg text-ink-muted leading-relaxed mb-12">{description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-line">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-ink-faint font-bold block mb-2">Roles</span>
                      <ul className="text-sm text-ink space-y-1">
                        {caseStudy.roles.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-ink-faint font-bold block mb-2">Timeline</span>
                      <span className="text-sm text-ink">{caseStudy.timeline}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-ink-faint font-bold block mb-2">Tools</span>
                      <ul className="text-sm text-ink space-y-1">
                        {caseStudy.tools.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-ink-faint font-bold block mb-2">Outcome</span>
                      <span className="text-sm text-ink">Premium, Intuitive</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="px-6 md:px-12 max-w-5xl mx-auto mt-24 space-y-32">
                {caseStudy.sections.map((section, index) => (
                  <div key={index} className={`grid grid-cols-1 ${section.image ? 'lg:grid-cols-12' : ''} gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={`${section.image ? 'lg:col-span-5' : 'max-w-3xl mx-auto text-center'} ${index % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <h3 className="text-3xl md:text-4xl font-serif text-ink tracking-tight mb-6">{section.title}</h3>
                      <div className="text-lg text-ink-muted leading-relaxed space-y-4">
                        {section.content.split('\n').map((paragraph, pIdx) => {
                          if (!paragraph.trim()) return null;
                          const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={pIdx}>
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={partIdx} className="text-ink font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                    {section.image && (
                      <div className={`lg:col-span-7 ${index % 2 !== 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="rounded-3xl overflow-hidden shadow-soft border border-line bg-canvas p-2">
                          <img src={section.image} alt={section.title} className="w-full h-auto rounded-2xl object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-32 pt-16 border-t border-line px-6 max-w-3xl mx-auto text-center mb-16">
                <h3 className="text-3xl font-serif text-ink tracking-tight mb-4">Final Thoughts</h3>
                <p className="text-lg text-ink-muted leading-relaxed mb-8">
                  The project demonstrates my approach to designing websites where visual quality, usability and business goals work together harmoniously.
                </p>
                {caseStudy.externalLink && (
                  <Button asChild size="lg" className="rounded-full font-bold">
                    <a
                      href={caseStudy.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      View Full Project
                      <ArrowRight size={20} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <a href={link || "#"} onClick={handleClick} className="block w-full">
        <div className="mx-auto w-full group cursor-pointer">
          <NoiseBackground
            containerClassName="bg-canvas-raised transition-transform duration-500 group-hover:scale-[1.02] transform-gpu will-change-transform"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <div className="flex h-full min-h-80 flex-col overflow-hidden rounded-lg bg-canvas text-center">
              <img
                src={image}
                alt={title}
                className="h-60 w-full rounded-lg object-cover"
              />
              <div className="px-4 py-4 relative z-10 bg-canvas">
                <h3 className="text-left text-lg font-semibold text-balance text-ink flex items-center justify-between">
                  <span>{title}</span>
                  {caseStudy && <span className="text-xs font-normal text-ink-muted uppercase tracking-widest bg-canvas-raised px-2 py-1 rounded-md">View Case Study</span>}
                </h3>
                <p className="mt-2 text-left text-sm text-ink-muted">
                  {description}
                </p>
              </div>
            </div>
          </NoiseBackground>
        </div>
      </a>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
