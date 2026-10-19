import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Briefcase, Calendar, Wrench, Target, Globe, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { NoiseBackground } from "./noise-background";
import type { CaseStudyData } from "./ProjectCard";
import { Button } from "./button";

export interface ProjectData {
  title: string;
  description: string;
  image: string;
  link?: string;
  caseStudy?: CaseStudyData;
}

interface ExpandableProjectGridProps {
  projects: ProjectData[];
}

export function ExpandableProjectGrid({ projects }: ExpandableProjectGridProps) {
  const [active, setActive] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active]);

  // Handle escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
      }
    };
    if (active) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      {/* Background Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active && active.caseStudy && (
          <div className="fixed inset-0 z-[101] grid place-items-center p-4 md:p-8 pointer-events-none">
            <motion.div
              layoutId={`card-${active.title}`}
              className="relative w-full max-w-7xl h-full max-h-[90vh] bg-canvas rounded-3xl shadow-2xl overflow-hidden flex flex-row pointer-events-auto transform-gpu will-change-transform"
            >
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Header / Sticky Nav */}
              <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none">
                <motion.span layoutId={`title-${active.title}`} className="text-white font-serif text-xl tracking-tight drop-shadow-md">
                  {active.title}
                </motion.span>
                <div className="flex items-center gap-3">
                  {active.caseStudy.externalLink && (
                    <Button asChild variant="custom" className="h-10 px-4 rounded-full bg-canvas/20 backdrop-blur-md text-white hover:bg-canvas hover:text-ink border-0 pointer-events-auto transition-colors font-semibold text-sm">
                      <a
                        href={active.caseStudy.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <Globe size={16} /> Live Project
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="custom"
                    size="icon"
                    onClick={() => setActive(null)}
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
                  <motion.img layoutId={`image-${active.title}`} src={active.caseStudy.heroImage} alt={active.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none" />
                </div>

                <div className="px-6 md:px-12 relative z-10 max-w-5xl mx-auto py-12">
                  <div className="">
                    <h2 className="text-4xl md:text-6xl font-serif text-ink tracking-tight mb-4">{active.title}</h2>
                    <p className="text-xl md:text-2xl text-ink-muted font-light mb-8">{active.caseStudy.subtitle}</p>
                    <p className="text-lg text-ink-muted leading-relaxed mb-12">{active.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-line">
                      <div>
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-faint font-bold mb-3">
                          <Briefcase size={14} /> Roles
                        </span>
                        <ul className="text-sm text-ink space-y-1">
                          {active.caseStudy.roles.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-faint font-bold mb-3">
                          <Calendar size={14} /> Timeline
                        </span>
                        <span className="text-sm text-ink">{active.caseStudy.timeline}</span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-faint font-bold mb-3">
                          <Wrench size={14} /> Tools
                        </span>
                        <ul className="text-sm text-ink space-y-1">
                          {active.caseStudy.tools.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-faint font-bold mb-3">
                          <Target size={14} /> Outcome
                        </span>
                        <span className="text-sm text-ink">Premium, Intuitive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div className="px-6 md:px-12 max-w-6xl mx-auto mt-24 space-y-32">
                  {active.caseStudy.sections.map((section, index) => (
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
                  {active.caseStudy.externalLink && (
                    <Button asChild size="lg" className="rounded-full font-bold">
                      <a
                        href={active.caseStudy.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        View Full Project
                        <ExternalLink size={20} />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              </div>

              {/* Sidebar Area */}
              <div className="hidden lg:flex w-80 shrink-0 bg-canvas flex-col overflow-y-auto border-l border-line custom-scrollbar z-30">
                <div className="p-6 sticky top-0 bg-canvas/90 backdrop-blur-sm z-10 border-b border-line">
                  <h3 className="font-semibold text-lg text-ink">More Projects</h3>
                </div>
                <div className="p-4 space-y-4">
                  {projects.filter(p => p.caseStudy && p.title !== active.title).map((project, index) => (
                    <button 
                      key={index}
                      onClick={() => setActive(project)}
                      className="group flex flex-col items-start gap-3 w-full text-left p-3 rounded-2xl hover:bg-canvas hover:shadow-sm transition-all border border-transparent hover:border-line"
                    >
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-canvas-raised">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-ink">{project.title}</h4>
                        <p className="text-sm text-ink-muted line-clamp-1">{project.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto w-full">
        {projects.map((project, index) => (
          <li key={project.title}>
            <a 
              href={project.caseStudy ? "#" : (project.link || "#")} 
              onClick={(e) => {
                if (project.caseStudy) {
                  e.preventDefault();
                  setActive(project);
                }
              }} 
              className="block w-full"
            >
              <div className="mx-auto w-full group cursor-pointer">
                <NoiseBackground
                  containerClassName="bg-canvas-raised transition-transform duration-500 group-hover:scale-[1.02] transform-gpu will-change-transform"
                  gradientColors={[
                    "rgb(255, 100, 150)",
                    "rgb(100, 150, 255)",
                    "rgb(255, 200, 100)",
                  ]}
                >
                  <motion.div layoutId={`card-${project.title}`} className="flex h-full min-h-80 flex-col overflow-hidden rounded-lg bg-canvas text-center transform-gpu will-change-transform">
                    <motion.img
                      layoutId={`image-${project.title}`}
                      src={project.image}
                      alt={project.title}
                      className="h-60 w-full rounded-lg object-cover transform-gpu"
                    />
                    <div className="px-4 py-4 relative z-10 bg-canvas">
                      <h3 className="text-left text-lg font-semibold text-balance text-ink flex items-center justify-between">
                        <motion.span layoutId={`title-${project.title}`}>{project.title}</motion.span>
                        {project.caseStudy && <span className="text-xs font-normal text-ink-muted uppercase tracking-widest bg-canvas-raised px-2 py-1 rounded-md">View Case Study</span>}
                      </h3>
                      <p className="mt-2 text-left text-sm text-ink-muted">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                </NoiseBackground>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
