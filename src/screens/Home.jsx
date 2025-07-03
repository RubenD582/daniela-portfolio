import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToElement } from '../components/scrollUtils';
import StatItem from '../components/Stats';
import GalleryPreview from './GalleryPreview';
import ContactSection from './Contact';

export const faqs = [
  {
    question: 'How long do gel nails last?',
    answer: 'Gel nails typically last 2-4 weeks with proper care. The longevity depends on your lifestyle, nail growth rate, and aftercare routine. Most clients book touch-ups every 3 weeks to maintain that fresh, salon-perfect look.',
  },
  {
    question: 'What\'s the difference between gel and regular polish?',
    answer: 'Gel polish is cured under UV/LED light, making it chip-resistant and long-lasting for weeks. Regular polish air-dries and typically lasts 3-7 days. Gel provides a glossy, durable finish that maintains its shine throughout wear.',
  },
  {
    question: 'How should I prepare for my nail appointment?',
    answer: 'Remove any existing polish, keep your cuticles moisturized, and avoid cutting your nails too short beforehand. If you have design inspiration, bring photos! Also, let me know about any allergies or sensitivities during booking.',
  },
  {
    question: 'Can you work on damaged or weak nails?',
    answer: 'Absolutely! I specialize in nail rehabilitation and strengthening treatments. We can build up weak spots, repair breaks, and use strengthening base coats to improve your natural nail health while creating beautiful manicures.',
  },
  {
    question: 'How do I make my manicure last longer?',
    answer: 'Wear gloves when cleaning, use cuticle oil daily, avoid using nails as tools, and book regular touch-ups. I\'ll provide specific aftercare instructions and recommend products to extend your manicure\'s lifespan.',
  },
  {
    question: 'Do you offer nail art and custom designs?',
    answer: 'Yes! I love creating unique nail art, from simple accent nails to intricate hand-painted designs. Whether you want seasonal themes, special occasion nails, or personalized artwork, we can bring your vision to life.',
  },
  {
    question: 'How often should I get my nails done?',
    answer: 'Most clients visit every 2-4 weeks depending on the service. Gel manicures typically need refreshing every 3 weeks, while maintenance appointments for nail health can be monthly. I\'ll recommend the best schedule for your lifestyle and nail goals.',
  },
  {
    question: 'What if I have an allergic reaction to products?',
    answer: 'Your safety is my priority! I use high-quality, professional products and can perform patch tests for sensitive clients. If you have known allergies, please inform me during booking so I can select appropriate hypoallergenic alternatives.',
  },
  {
    question: 'Can I bring my own nail polish?',
    answer: 'While I stock professional-grade polishes in many colors, you\'re welcome to bring your own special shades! Just ensure they\'re compatible with professional application techniques for the best results.',
  },
  {
    question: 'What are your prices for different services?',
    answer: 'Prices vary by service: basic manicures start around R200-300, gel manicures R350-450, and nail art R450-600+ depending on complexity. I offer package deals for regular clients and seasonal promotions. Contact me for a detailed price list!',
  },
  {
    question: 'How do I book an appointment?',
    answer: 'You can book through my website, WhatsApp, or call directly. I recommend booking 1-2 weeks in advance, especially for weekends and special occasions. Cancellations require 24-hour notice to avoid fees.',
  },
  {
    question: 'Do you offer mobile nail services?',
    answer: 'Yes! I provide mobile services for special events, bridal parties, or clients who prefer the convenience of home appointments. Mobile service includes a small travel fee depending on location within my service area.',
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const handleGalleryClick = () => {
    navigate('/designs');
  };

  const visibilityObject = {
    services: true,
    testimonials: true,
    faq: true,
    gallery: true,
    about: true
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center bg-white overflow-hidden">
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl w-full">
          {/* Professional Badge */}
          <div className="inline-flex items-center mb-6 px-4 py-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-sm shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">
              Certified Nail Technician
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-light text-gray-900 mb-8 tracking-tight leading-none">
            PRECISION
            <span className="block mt-2 sm:mt-3">
              & <span className="text-yellow-600">ELEGANCE</span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Transforming your nails into works of art with meticulous attention to detail and contemporary elegance.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-14 justify-center items-center">
            <button
              onClick={() => scrollToElement('contact', 1500)}
              className="group relative bg-gray-900 text-white px-12 sm:px-14 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
            >
              <span className="relative z-10">Book Now</span>
              <ArrowRight className="ml-3 w-4 h-4" />
            </button>
            
            <button 
              onClick={handleGalleryClick}
              className="group relative text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium uppercase tracking-wider px-12 sm:px-14 py-4 border border-gray-200 hover:border-gray-400 flex items-center justify-center bg-white w-full sm:w-auto"
            >
              <span className="relative z-10">View Gallery</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-3 uppercase tracking-widest">
              Scroll Down
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
          </div>
        </div>

        {/* Corner Decorative Elements */}
        <div className="hidden lg:block absolute top-24 left-8 w-8 h-8 border-l border-t border-gray-200"></div>
        <div className="hidden lg:block absolute top-24 right-8 w-8 h-8 border-r border-t border-gray-200"></div>
        <div className="hidden lg:block absolute bottom-8 left-8 w-8 h-8 border-l border-b border-gray-200"></div>
        <div className="hidden lg:block absolute bottom-8 right-8 w-8 h-8 border-r border-b border-gray-200"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-8 tracking-tight">
              Professional Services
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Expert nail care and artistry with premium products and meticulous attention to detail.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="group bg-white p-8 sm:p-12 cursor-pointer hover:-translate-y-2 transition-transform duration-200 relative border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg"
              >
                {/* Most Popular Banner */}
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-black text-white px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium">
                      Most Popular
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 sm:border-l-6 sm:border-r-6 sm:border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
                  </div>
                )}

                {/* Content */}
                <div className="h-full flex flex-col">
                  <div className="mb-2">
                    <span className="text-sm sm:text-base text-gray-400 uppercase tracking-widest">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-light text-black mb-4 sm:mb-6 leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed mb-auto text-sm sm:text-base">
                    {service.description}
                  </p>

                  {/* Pricing */}
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs sm:text-sm text-gray-400 mb-1 font-light line-through">
                          WAS {service.originalPrice}
                        </div>
                        <div className="text-xl sm:text-2xl font-light text-black">
                          {service.price}
                        </div>
                      </div>
                      
                      <div className="text-xs sm:text-sm font-medium text-black">
                        {service.discount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 sm:mt-20">
            <button
              onClick={() => navigate('/services')}
              className="text-black border border-black px-12 sm:px-16 py-4 font-light text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200 bg-white"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      <GalleryPreview isVisible={visibilityObject} />

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Client Stories
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="bg-white p-6 sm:p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 font-light text-sm leading-relaxed italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="text-gray-900 font-light text-sm">— {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 bg-white w-full" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-6 sm:p-8 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-900 font-light text-base sm:text-lg pr-4">{item.question}</span>
                    <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                      <div className="w-4 h-px bg-gray-400"></div>
                      <div className="w-px h-4 bg-gray-400 absolute"></div>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
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
      <footer className="py-12 bg-gray-900 text-gray-400 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div 
              className="text-xl sm:text-2xl text-white font-light cursor-pointer"
              onClick={() => scrollToElement('hero', 1500)}
            >
              Daniela Alves
            </div>
            <div className="text-xs sm:text-sm font-light text-center">
              &copy; {new Date().getFullYear()} Daniela Alves. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}