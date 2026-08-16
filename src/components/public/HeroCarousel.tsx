import React, { useState, useEffect } from 'react';
import { HERO_CAROUSEL_SLIDES } from '../../data/nagpurData';
import { useApp } from '../../context/AppContext';
import { NagpurTrafficPoliceEmblem } from '../NagpurTrafficPoliceEmblem';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle 
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#142C54]/90 via-[#142C54]/80 to-[#142C54]/95" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#142C54]/40 to-[#142C54]/80" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full flex items-center justify-center">
        <div className="max-w-3xl space-y-6 text-white text-center flex flex-col items-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
            <NagpurTrafficPoliceEmblem size={24} className="drop-shadow-sm" />
            <span 
              className="text-sm font-semibold tracking-normal text-white"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Orange city Traffic police
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-center">
            Safer roads.{' '}
            <span className="text-[#E56B2F] italic font-serif-accent font-normal">
              Faster response.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#DCDCD6] font-normal leading-relaxed max-w-2xl text-center mx-auto">
            MargRakshak helps Nagpur traffic commanders identify rising risk, understand contributing bottlenecks, and strategically deploy limited police personnel where they have the greatest impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-report-incident-btn"
              onClick={() => setActiveView('report-incident')}
              className="flex items-center justify-center gap-2.5 bg-[#E56B2F] hover:bg-[#B94A1F] text-white px-6 py-3.5 rounded-md text-base font-bold shadow-lg shadow-[#E56B2F]/25 hover:shadow-xl transition-all transform active:scale-95"
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>Report a Traffic Incident</span>
            </button>
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
