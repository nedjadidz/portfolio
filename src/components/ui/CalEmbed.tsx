import React, { useEffect, useState, useRef } from "react";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";

export function CalEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [CalComponent, setCalComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Observe changes to the html class for dark mode toggle
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkNow = document.documentElement.classList.contains("dark");
          setTheme(isDarkNow ? "dark" : "light");
        }
      });
    });

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  // IntersectionObserver: Defer loading Cal widget until user approaches within 350px of the booking section
  useEffect(() => {
    if (isNear) return;

    const el = containerRef.current;
    if (!el) return;

    // Check if element is already close to viewport on mount
    const checkProximity = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 350) {
        setIsNear(true);
        return true;
      }
      return false;
    };

    if (checkProximity()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "350px 0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isNear]);

  // Dynamically load Cal embed when isNear is true
  useEffect(() => {
    if (!isNear) return;

    let mounted = true;

    import("@calcom/embed-react")
      .then(async (mod) => {
        if (!mounted) return;
        setCalComponent(() => mod.default);
        setIsLoading(false);

        const cal = await mod.getCalApi({});
        if (!mounted || !cal) return;

        cal("ui", {
          theme: theme,
          cssVarsPerTheme: {
            light: {
              "cal-bg": "transparent",
              "cal-bg-muted": "rgba(255, 255, 255, 0.2)",
              "cal-border-booker": "rgba(255, 255, 255, 0.2)",
              "cal-border-booker-dark": "rgba(255, 255, 255, 0.2)",
              "cal-border": "rgba(255, 255, 255, 0.3)",
              "cal-border-subtle": "rgba(255, 255, 255, 0.15)",
              "cal-border-muted": "rgba(255, 255, 255, 0.1)",
              "cal-bg-emphasis": "rgba(255, 255, 255, 0.4)",
              "cal-brand": "rgba(255, 255, 255, 0.7)",
              "cal-brand-text": "#111",
              "cal-text": "#111",
              "cal-text-muted": "rgba(0, 0, 0, 0.6)",
            },
            dark: {
              "cal-bg": "transparent",
              "cal-bg-muted": "rgba(255, 255, 255, 0.08)",
              "cal-border-booker": "rgba(255, 255, 255, 0.1)",
              "cal-border-booker-dark": "rgba(255, 255, 255, 0.1)",
              "cal-border": "rgba(255, 255, 255, 0.15)",
              "cal-border-subtle": "rgba(255, 255, 255, 0.05)",
              "cal-border-muted": "rgba(255, 255, 255, 0.05)",
              "cal-bg-emphasis": "rgba(255, 255, 255, 0.15)",
              "cal-brand": "rgba(255, 255, 255, 0.15)",
              "cal-brand-text": "#fff",
              "cal-text": "#fff",
              "cal-text-muted": "rgba(255, 255, 255, 0.5)",
            },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      })
      .catch((err) => {
        console.error("Failed to load Cal embed:", err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isNear, theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] glass backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative p-2 md:p-6 transform-gpu will-change-transform"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]"></div>
      <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative z-10 flex flex-col">
        {isNear && CalComponent ? (
          <CalComponent
            key={theme}
            calLink="mohammed-nedjadi-odx7mx/30min"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view", theme: theme }}
          />
        ) : (
          /* Glassmorphic Placeholder & Skeleton Loader to avoid CLS */
          <div className="w-full h-full min-h-[560px] flex flex-col justify-between p-6 md:p-8 animate-pulse text-ink">
            {/* Header placeholder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/40 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-line/20 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-ink-muted opacity-60" />
                </div>
                <div>
                  <div className="h-5 w-44 bg-line/30 rounded-md mb-2"></div>
                  <div className="h-3.5 w-28 bg-line/20 rounded-md"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Clock className="w-4 h-4 opacity-50" />
                <span>30 Min Discovery Call</span>
              </div>
            </div>

            {/* Calendar grid skeleton */}
            <div className="my-8 grid grid-cols-7 gap-2 md:gap-4 max-w-xl mx-auto w-full">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-xs font-semibold text-ink-muted/50 py-1">
                  {d}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-line/10 flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-line/20"></div>
                </div>
              ))}
            </div>

            {/* Bottom status */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-line/40 text-xs text-ink-muted gap-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin opacity-70" />
                <span>
                  {isNear ? "Initializing booking calendar..." : "Calendar loads when approaching..."}
                </span>
              </div>
              {!isNear && (
                <button
                  type="button"
                  onClick={() => setIsNear(true)}
                  className="px-4 py-2 rounded-full bg-line/20 hover:bg-line/40 transition-colors font-medium text-ink cursor-pointer"
                >
                  Load now
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
