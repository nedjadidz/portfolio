import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Smartphone, Zap, Globe, LineChart } from 'lucide-react';
import { cn } from '../../lib/utils';

const services = [
  {
    title: "Web Development",
    description: "Building fast, responsive, and robust websites using modern frameworks and best practices. We ensure high performance and accessibility.",
    icon: Globe,
    color: "from-blue-500 to-cyan-400",
    bgClass: "bg-blue-50/50 dark:bg-blue-900/10"
  },
  {
    title: "UI/UX Design",
    description: "Creating intuitive, aesthetic, and user-friendly interfaces that drive engagement and convert visitors into loyal customers.",
    icon: Palette,
    color: "from-purple-500 to-pink-400",
    bgClass: "bg-purple-50/50 dark:bg-purple-900/10"
  },
  {
    title: "Mobile Apps",
    description: "Developing cross-platform applications with native-like performance, bringing your vision to iOS and Android devices seamlessly.",
    icon: Smartphone,
    color: "from-orange-500 to-yellow-400",
    bgClass: "bg-orange-50/50 dark:bg-orange-900/10"
  },
  {
    title: "Performance Optimization",
    description: "Improving speed, accessibility, and SEO for better user experience. We tune your web applications to load instantly anywhere.",
    icon: Zap,
    color: "from-emerald-500 to-teal-400",
    bgClass: "bg-emerald-50/50 dark:bg-emerald-900/10"
  },
  {
    title: "Custom Software",
    description: "Tailored software solutions to meet your unique business requirements, scalable architectures and solid backend integrations.",
    icon: Code2,
    color: "from-indigo-500 to-blue-500",
    bgClass: "bg-indigo-50/50 dark:bg-indigo-900/10"
  },
  {
    title: "SEO & Growth",
    description: "Enhancing visibility and driving organic traffic to your product through advanced technical SEO and conversion rate optimization.",
    icon: LineChart,
    color: "from-rose-500 to-red-400",
    bgClass: "bg-rose-50/50 dark:bg-rose-900/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

export function ServicesGrid() {
  return (
    <div className="py-12">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative bg-canvas p-8 rounded-[2rem] overflow-hidden border border-line hover:border-line-strong hover:shadow-soft transition-all duration-500 flex flex-col h-full transform-gpu will-change-transform"
          >
            {/* Animated hover gradient background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 z-0",
              service.color
            )} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-line/50 shadow-sm transition-transform duration-500 group-hover:scale-110",
                service.bgClass
              )}>
                <service.icon size={26} className="text-ink" />
              </div>
              
              <h3 className="text-2xl font-serif text-ink mb-4 tracking-tight group-hover:text-ink transition-colors">
                {service.title}
              </h3>
              
              <p className="text-base text-ink-muted leading-relaxed flex-grow">
                {service.description}
              </p>
              
              <div className="mt-8 flex items-center text-sm font-bold tracking-wide text-ink uppercase">
                <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Discuss project
                </span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
