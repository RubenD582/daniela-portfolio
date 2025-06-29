import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Calendar, Phone, Mail, Instagram, MapPin, Clock, Shield, Sparkles, Award, Users, Heart } from 'lucide-react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { scrollToElement } from '../components/scrollUtils';
import { useNavigate } from 'react-router-dom';
import StatItem from '../components/Stats';
import GalleryPreview from './GalleryPreview';
import ContactSection from './Contact';
import heroImage from '../assets/image.jpg';

export const faqs = [
  {
    question: 'How long do gel nails last?',
    answer:
      'Gel nails typically last 2-4 weeks with proper care. The longevity depends on your lifestyle, nail growth rate, and aftercare routine. Most clients book touch-ups every 3 weeks to maintain that fresh, salon-perfect look.',
  },
  {
    question: 'What\'s the difference between gel and regular polish?',
    answer:
      'Gel polish is cured under UV/LED light, making it chip-resistant and long-lasting for weeks. Regular polish air-dries and typically lasts 3-7 days. Gel provides a glossy, durable finish that maintains its shine throughout wear.',
  },
  {
    question: 'How should I prepare for my nail appointment?',
    answer:
      'Remove any existing polish, keep your cuticles moisturized, and avoid cutting your nails too short beforehand. If you have design inspiration, bring photos! Also, let me know about any allergies or sensitivities during booking.',
  },
  {
    question: 'Can you work on damaged or weak nails?',
    answer:
      'Absolutely! I specialize in nail rehabilitation and strengthening treatments. We can build up weak spots, repair breaks, and use strengthening base coats to improve your natural nail health while creating beautiful manicures.',
  },
  {
    question: 'How do I make my manicure last longer?',
    answer:
      'Wear gloves when cleaning, use cuticle oil daily, avoid using nails as tools, and book regular touch-ups. I\'ll provide specific aftercare instructions and recommend products to extend your manicure\'s lifespan.',
  },
  {
    question: 'Do you offer nail art and custom designs?',
    answer:
      'Yes! I love creating unique nail art, from simple accent nails to intricate hand-painted designs. Whether you want seasonal themes, special occasion nails, or personalized artwork, we can bring your vision to life.',
  },
  {
    question: 'How often should I get my nails done?',
    answer:
      'Most clients visit every 2-4 weeks depending on the service. Gel manicures typically need refreshing every 3 weeks, while maintenance appointments for nail health can be monthly. I\'ll recommend the best schedule for your lifestyle and nail goals.',
  },
  {
    question: 'What if I have an allergic reaction to products?',
    answer:
      'Your safety is my priority! I use high-quality, professional products and can perform patch tests for sensitive clients. If you have known allergies, please inform me during booking so I can select appropriate hypoallergenic alternatives.',
  },
  {
    question: 'Can I bring my own nail polish?',
    answer:
      'While I stock professional-grade polishes in many colors, you\'re welcome to bring your own special shades! Just ensure they\'re compatible with professional application techniques for the best results.',
  },
  {
    question: 'What are your prices for different services?',
    answer:
      'Prices vary by service: basic manicures start around R200-300, gel manicures R350-450, and nail art R450-600+ depending on complexity. I offer package deals for regular clients and seasonal promotions. Contact me for a detailed price list!',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'You can book through my website, WhatsApp, or call directly. I recommend booking 1-2 weeks in advance, especially for weekends and special occasions. Cancellations require 24-hour notice to avoid fees.',
  },
  {
    question: 'Do you offer mobile nail services?',
    answer:
      'Yes! I provide mobile services for special events, bridal parties, or clients who prefer the convenience of home appointments. Mobile service includes a small travel fee depending on location within my service area.',
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Add loading state to prevent FOUC
  useEffect(() => {
    // Ensure component is fully mounted and styles loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Simple scroll-based animation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'testimonials', 'faq'];
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element && !animatedSections.has(sectionId)) {
          const rect = element.getBoundingClientRect();
          // Changed from 0.8 to 0.6 so animations trigger when 60% of viewport shows the section
          const isVisible = rect.top < window.innerHeight * 0.6;
          
          if (isVisible) {
            setAnimatedSections(prev => new Set([...prev, sectionId]));
          }
        }
      });
    };

    // Only start scroll handling after component is loaded
    if (isLoaded) {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [animatedSections, isLoaded]);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const handleGalleryClick = () => {
    navigate('/designs');
  };

  const isVisible = (sectionId) => animatedSections.has(sectionId);

  // Create visibility object for components that expect the old format
  const visibilityObject = {
    services: isVisible('services'),
    testimonials: isVisible('testimonials'),
    faq: isVisible('faq'),
    gallery: isVisible('services'), // Assuming gallery should show when services is visible
    about: isVisible('services') // If there's an about section
  };

  // Show loading state or skeleton
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-2xl font-light text-gray-400 uppercase font-bodoni-moda">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Always visible, but with proper initial state */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-white"
        style={{
          // Add a fallback background to prevent gray flash
          backgroundColor: '#ffffff'
        }}
      >
        <div className="relative z-10 text-center px-6 max-w-5xl w-full">
          <div className={`transition-all duration-700 ease-out ${isLoaded ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            {/* Professional Badge */}
            <div className="inline-flex items-center mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">
                Certified Nail Technician
              </p>
            </div>

            <h1 className={`text-5xl md:text-8xl font-light font-bodoni-moda text-neutral-900 mb-8 tracking-tight leading-[0.85] transition-all duration-1000 ease-out ${isLoaded ? 'animate-fade-in-up-delay-1' : 'opacity-0 translate-y-8'}`}>
              PRECISION
              <span className={`block mt-3 transition-all duration-1200 ease-out ${isLoaded ? 'animate-fade-in-up-delay-2' : 'opacity-0 translate-y-8'}`}>
                & <span className="text-[#CFB53B] relative">
                  ELEGANCE
                </span>
              </span>
            </h1>

            {/* Elegant Tagline */}
            <p className={`text-sm md:text-lg font-sans text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light transition-all duration-1000 ease-out ${isLoaded ? 'animate-fade-in-up-delay-3' : 'opacity-0 translate-y-8'}`}>
              Transforming your nails into works of art with meticulous attention to detail and contemporary elegance.
            </p>

            {/* Call-to-Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-6 mt-14 justify-center items-center transition-all duration-1000 ease-out ${isLoaded ? 'animate-fade-in-up-delay-4' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={() => scrollToElement('contact', 1500)}
                className="group relative bg-neutral-900 text-white px-14 py-4 text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-center hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 transform translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
                <span className="relative z-10">Book Now</span>
                <ArrowRight className="ml-3 w-4 h-4 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-1" />
              </button>
              <button 
                onClick={handleGalleryClick}
                className="group relative text-neutral-700 hover:text-neutral-900 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-sm font-medium uppercase tracking-wider px-14 py-4 border border-neutral-200 hover:border-neutral-400 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <span className="relative z-10 flex items-center">
                  View Gallery
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 transform translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className={`hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out ${isLoaded ? 'animate-fade-in-delay-5' : 'opacity-0'}`}>
          <div className="flex flex-col items-center group">
            <span className="text-xs text-neutral-500 mb-3 uppercase tracking-widest group-hover:text-neutral-700 transition-colors duration-300">
              Scroll Down
            </span>
            <div className="relative">
              <div className="w-px h-12 bg-gradient-to-b from-neutral-400 to-transparent transition-colors duration-300"></div>
            </div>
          </div>
        </div>

        {/* Corner Decorative Elements */}
        <div className="hidden md:block absolute top-24 left-8 w-8 h-8 border-l border-t border-neutral-200"></div>
        <div className="hidden md:block absolute top-24 right-8 w-8 h-8 border-r border-t border-neutral-200"></div>
        <div className="hidden md:block absolute bottom-8 left-8 w-8 h-8 border-l border-b border-neutral-200"></div>
        <div className="hidden md:block absolute bottom-8 right-8 w-8 h-8 border-r border-b border-neutral-200"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          
          {/* Header */}
          <div className={`text-center mb-24 transition-all duration-1000 ease-out ${isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-5xl md:text-6xl font-extralight text-black mb-8 tracking-tight">
              Professional Services
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg leading-relaxed font-sans">
              Expert nail care and artistry with premium products and meticulous attention to detail.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Gel & Acrylic Overlays',
                description: 'Professional overlays on your natural nails for strength and lasting beauty.',
                originalPrice: 'R200',
                price: 'FROM R160',
                discount: '20% OFF'
              },
              {
                title: 'Extensions & Sculptures',
                description: 'Expert extension services to create perfect length and elegant shape.',
                originalPrice: 'R280',
                price: 'FROM R210',
                discount: '25% OFF',
                popular: true
              },
              {
                title: 'Nail Art & Services',
                description: 'Custom nail art, professional fills, repairs and maintenance services.',
                originalPrice: 'R15',
                price: 'FROM R5',
                discount: '67% OFF'
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className={`group bg-white p-12 cursor-pointer hover:-translate-y-2 transition-all duration-700 ease-out relative border border-gray-100 hover:border-gray-200 ${
                  isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ 
                  transitionDelay: isVisible('services') ? `${idx * 150}ms` : '0ms'
                }}
              >
                {/* Most Popular Banner */}
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest font-sans font-medium">
                      Most Popular
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                  </div>
                )}

                {/* Content */}
                <div className="h-full flex flex-col">
                  <div className="mb-2">
                    <span className="text-base text-gray-400 uppercase tracking-widest font-lora">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-xl font-light text-black mb-6 leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed mb-auto text-[15px] font-sans">
                    {service.description}
                  </p>

                  {/* Pricing */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm text-gray-400 mb-1 font-light line-through">
                          WAS {service.originalPrice}
                        </div>
                        <div className="text-2xl font-light text-black">
                          {service.price}
                        </div>
                      </div>
                      
                      <div className="text-sm font-medium text-black">
                        {service.discount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={`text-center mt-20 transition-all duration-1000 ease-out ${isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isVisible('services') ? '600ms' : '0ms' }}>
            <button
              onClick={() => navigate('services')}
              className="group relative text-black border border-black px-16 py-4 font-light text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
              <span className="relative z-10">View All Services</span>
            </button>
          </div>
        </div>
      </section>

      <GalleryPreview isVisible={visibilityObject} />

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-stone-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ease-out ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Client Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ruben',
                text: "Daniela's artistry in nail design is truly inspiring. Every detail reflects her passion and innovative approach, leaving me feeling confident and uniquely styled."
              },
              {
                name: 'Sophia',
                text: "I was amazed by the intricate designs and attention to detail. Daniela transformed my nails into a work of art that I proudly showcase every day."
              },
              {
                name: 'James',
                text: "From start to finish, my experience was top-notch. Daniela's creativity and professionalism made me feel like a star."
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 border border-stone-100 transition-all duration-1000 ease-out ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ 
                  transitionDelay: isVisible('testimonials') ? `${idx * 200}ms` : '0ms'
                }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-stone-600 font-light text-sm mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="text-stone-900 font-light text-sm">— {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ease-out ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white border border-stone-100 overflow-hidden transition-all duration-1000 ease-out ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ 
                    transitionDelay: isVisible('faq') ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-8 text-left hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-stone-900 font-light text-lg">{item.question}</span>
                    <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      <div className="w-4 h-px bg-stone-400"></div>
                      <div className="w-px h-4 bg-stone-400 absolute"></div>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 pb-8">
                      <p className="text-stone-600 font-light leading-relaxed font-montserrat font-xs">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="py-12 bg-stone-950 text-stone-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div 
              className="text-2xl font-dancing-script text-white font-thin cursor-pointer"
              onClick={() => scrollToElement('hero', 1500)}
            >
              Daniela Alves
            </div>
            <div className="text-sm font-light">
              &copy; {new Date().getFullYear()} Daniela Alves. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-up-delay-1 {
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-up-delay-4 {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-5 {
          animation: fadeIn 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}