import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Calendar } from 'lucide-react';
import { Button } from './button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    // Theme check
    if (typeof document !== 'undefined') {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  const textColor = isScrolled ? "text-ink" : "text-white";
  const navBackground = isScrolled 
    ? "bg-canvas-raised/80 backdrop-blur-xl border border-line shadow-sm" 
    : "glass";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-base ease-organic">
      <nav className={`${navBackground} mx-auto flex items-center justify-between px-6 py-4 rounded-3xl max-w-[1312px] transition-all duration-300`}>
        {/* Logo */}
        <a href="/" className={`hover:opacity-70 transition-opacity flex items-center ${isScrolled ? "invert dark:invert-0" : ""}`}>
          <img src="/logo.png" alt="medJadi" className="h-8 w-auto object-contain" />
          <span className="sr-only">medJadi</span>
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          <a href="/projects" className={`text-sm font-bold ${textColor} hover:opacity-70 transition-colors`}>Work</a>
          <a href="/about" className={`text-sm font-bold ${textColor} hover:opacity-70 transition-colors`}>About</a>
          <a href="/services" className={`text-sm font-bold ${textColor} hover:opacity-70 transition-colors`}>Services</a>
        </div>

        {/* Call to Action & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full ${isScrolled ? 'text-ink hover:bg-canvas-raised dark:hover:bg-ink-muted' : 'text-white hover:bg-canvas/10 hover:text-white'}`}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button asChild variant="custom" className={`rounded-full font-bold px-6 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${isScrolled ? "bg-ink text-canvas hover:bg-ink/90 shadow-md" : "glass text-white hover:bg-canvas/20 shadow-soft"}`}>
            <a href="https://cal.com/mohammed-nedjadi-odx7mx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <Calendar size={18} />
              <span>Book a call</span>
            </a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <Button 
          variant="ghost"
          size="icon"
          className={`md:hidden rounded-full ${isScrolled ? "text-ink hover:bg-line" : "text-white hover:bg-glass-highlight hover:text-white"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </nav>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className={`md:hidden absolute top-[calc(100%+0.5rem)] left-4 right-4 ${navBackground} rounded-2xl p-6 flex flex-col space-y-5 animate-accordion-down shadow-lifted`}>
          <a href="/projects" className={`text-base font-bold ${textColor} hover:opacity-70 transition-colors`}>Work</a>
          <a href="/about" className={`text-base font-bold ${textColor} hover:opacity-70 transition-colors`}>About</a>
          <a href="/services" className={`text-base font-bold ${textColor} hover:opacity-70 transition-colors`}>Services</a>
          
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <span className={`text-sm font-bold ${textColor}`}>Theme</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full ${isScrolled ? 'bg-canvas-raised dark:bg-neutral-800 text-ink' : 'bg-canvas/10 text-white hover:bg-canvas/20 hover:text-white'}`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          <div className="pt-2">
            <Button asChild variant="custom" className={`w-full rounded-full font-bold px-5 py-3 transition-all duration-300 active:scale-95 ${isScrolled ? "bg-ink text-canvas hover:bg-ink/90 shadow-md" : "glass text-white hover:bg-canvas/20 shadow-soft"}`}>
              <a href="https://cal.com/mohammed-nedjadi-odx7mx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                <Calendar size={18} />
                <span>Book a call</span>
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
