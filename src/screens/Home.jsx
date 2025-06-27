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
  const [isVisible, setIsVisible] = useState({});
  const testimonialsRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(v => ({ ...v, testimonials: true }));
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Enhanced Feminine Animations */}
      <section
        id="hero"
        className="relative h-[100vh] mt-18 flex items-center justify-center overflow-hidden bg-[#F8F8F8]"
      >
        <div className="relative z-10 text-center px-6 max-w-4xl w-full">
          <div
            className={`transition-all duration-[750ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Professional Badge with Gentle Float */}
            <div 
              className={`inline-flex items-center bg-black text-white px-4 py-2 mb-10 transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isVisible.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{
                transitionDelay: isVisible.hero ? '100ms' : '0ms'
              }}
            >
              <span className="text-xs font-light uppercase tracking-widest">Certified Nail Technician</span>
            </div>

            {/* Animated Title with Staggered, Flowing Effect */}
            <h1
              className={`text-4xl md:text-7xl font-extralight text-stone-900 mb-6 tracking-tight leading-tight font-bodoni-moda transition-all duration-[1300ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
                isVisible.hero
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-20 scale-98'
              }`}
              style={{
                transitionDelay: isVisible.hero ? '200ms' : '0ms'
              }}
            >
              BRINGING FASION
              <span
                className={`block text-stone-900 transition-all duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isVisible.hero
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-24 scale-97'
                }`}
                style={{
                  transitionDelay: isVisible.hero ? '100ms' : '0ms'
                }}
              >
                TO YOUR <span className='text-[#CFB53B]'>FINGERTIPS.</span>
              </span>
            </h1>

            {/* Description with Soft Fade-in */}
            <p
              className={`text-sm md:text-md text-stone-600 mb-12 max-w-4xl mx-auto leading-relaxed mt-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                isVisible.hero
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{
                transitionDelay: isVisible.hero ? '200ms' : '0ms'
              }}
            >
              Precision-crafted press-on nails and bespoke manicure services.
              Where technical excellence meets artistic vision for the modern professional.
            </p>

            {/* Call-to-Action Buttons with Graceful Entrance */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-16 transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isVisible.hero
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-12 scale-96'
              }`}
              style={{
                transitionDelay: isVisible.hero ? '600ms' : '0ms'
              }}
            >
              <button
                onClick={() => scrollToElement('contact', 1500)}
                className="group bg-stone-900 text-white px-8 py-4 text-sm font-light hover:bg-stone-800 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-center transform hover:-translate-y-0.5 w-56"
              >
                <span>Book Appointment</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              </button>

              <button className="group bg-transparent text-stone-600 hover:text-stone-900 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-sm font-light px-8 py-4 border border-stone-200 hover:border-stone-300 transform hover:-translate-y-0.5 w-56 flex items-center justify-center">
                <span>View Nail Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Professional Nail Services
            </h2>
            <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg">
              Expert nail care and artistry with premium products and meticulous attention to detail.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Gel & Acrylic Overlays',
                description: 'Professional overlays on your natural nails for strength and beauty.',
                price: 'From R160',
              },
              {
                title: 'Extensions & Sculptures',
                description: 'Create length and shape with our expert extension services.',
                price: 'From R210',
              },
              {
                title: 'Nail Art & Services',
                description: 'Custom nail art, fills, repairs, and maintenance services.',
                price: 'From R5',
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className={`group bg-white p-8 cursor-pointer hover:-translate-y-2 transition-all duration-500 relative ${
                  idx === 1 
                    ? 'border border-black' 
                    : 'border border-stone-100 hover:border-black'
                } ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                {idx === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 text-xs font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-light text-stone-900 mb-3 uppercase">{service.title}</h3>
                <p className="text-stone-600 font-light text-sm mb-6 leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-stone-900 font-medium">{service.price}</span>
                  <button className="text-stone-600 hover:text-stone-900 transition-colors text-sm">
                    Book Now →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button 
              className="bg-stone-900 text-white px-8 py-3 hover:bg-stone-800 transition-colors duration-300 font-light"
              onClick={() => navigate('services')}
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      {/* <section id="about" className="py-24 bg-gradient-to-br from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="aspect-[4/5] bg-stone-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-100 flex items-center justify-center">
                  <span className="text-stone-500 font-light">Photo</span>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-8">
                The Artist Behind
                <span className="block text-stone-600">the Craft</span>
              </h2>
              
              <p className="text-stone-600 font-light mb-6 text-md leading-relaxed font-montserrat">
                With a year of dedicated experience in nail artistry, I've transformed my passion for beauty into a craft that celebrates individuality and self-expression.
              </p>
              
              <p className="text-stone-600 font-light mb-6 text-md leading-relaxed font-montserrat">
                Each set I create is more than just nails—it's a reflection of your personality, a boost to your confidence, and a testament to the artistry that happens when creativity meets precision.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8 mt-12">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: 'Premium Materials' },
                  { icon: <Users className="w-5 h-5" />, text: '50+ Happy Clients' },
                  { icon: <Award className="w-5 h-5" />, text: 'Certified Professional' },
                  { icon: <Clock className="w-5 h-5" />, text: '2+ Years Experience' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="text-stone-600">{item.icon}</div>
                    <span className="text-stone-600 font-light text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <GalleryPreview isVisible={isVisible} />

      {/* Testimonials */}
      <section ref={testimonialsRef} id="testimonials" className="py-24 bg-gradient-to-br from-stone-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
                className={`bg-white p-8 border border-stone-100 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${idx * 200}ms` }}
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
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Frequently Asked
            </h2>
          </div>

          <div id="faq" className="space-y-2">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white border border-stone-100 overflow-hidden transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
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
    </div>
  );
}