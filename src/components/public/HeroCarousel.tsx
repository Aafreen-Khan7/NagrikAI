import React, { useState, useEffect } from 'react';
import { HERO_CAROUSEL_SLIDES } from '../../data/nagpurData';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { setActiveView } = useApp();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
  };

  const slide = HERO_CAROUSEL_SLIDES[currentSlide];

  return (
    <div className="relative w-full min-h-[540px] lg:min-h-[580px] flex items-center overflow-hidden bg-[#142C54]">
      {/* Background Image Carousel with Smooth Fade */}
      {HERO_CAROUSEL_SLIDES.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          {/* Restrained Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#142C54]/95 via-[#142C54]/85 to-[#142C54]/60" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#142C54]/40 to-[#142C54]/90" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-3xl space-y-6 text-white">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E56B2F]/20 border border-[#E56B2F]/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E56B2F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4D8C7]">
              Nagpur City Traffic Intelligence • {slide.location}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Safer roads.{' '}
            <span className="text-[#E56B2F] italic font-serif-accent font-normal">
              Faster response.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#DCDCD6] font-normal leading-relaxed max-w-2xl">
            MargRakshak helps Nagpur traffic commanders identify rising risk, understand contributing bottlenecks, and strategically deploy limited police personnel where they have the greatest impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              id="hero-report-incident-btn"
              onClick={() => setActiveView('report-incident')}
              className="flex items-center justify-center gap-2.5 bg-[#E56B2F] hover:bg-[#B94A1F] text-white px-6 py-3.5 rounded-md text-base font-bold shadow-lg shadow-[#E56B2F]/25 hover:shadow-xl transition-all transform active:scale-95"
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>Report a Traffic Incident</span>
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={() => setActiveView('how-it-works')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3.5 rounded-md text-base font-semibold backdrop-blur-md transition-colors"
            >
              <span>How MargRakshak Works</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Metrics Row */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-[#DCDCD6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E6B4A]" />
              <span>Decision Support with Human Approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E56B2F]" />
              <span>Real-Time Nagpur Risk Scoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Manual Arrows & Dots */}
      <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        <button
          id="hero-carousel-prev-btn"
          onClick={prevSlide}
          className="p-1 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {HERO_CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              id={`hero-carousel-dot-${i}`}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide ? 'w-5 bg-[#E56B2F]' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          id="hero-carousel-next-btn"
          onClick={nextSlide}
          className="p-1 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
