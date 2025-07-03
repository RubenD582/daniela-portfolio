import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToElement } from '../components/scrollUtils';
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
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl w-full"
        >
          {/* Professional Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center mb-6 px-4 py-2 bg-white bg-opacity-80"
          >
            <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">
              Certified Nail Technician
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-bodoni-moda text-5xl sm:text-6xl lg:text-8xl font-light text-gray-900 mb-8 tracking-tight leading-none"
          >
            PRECISION
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="block mt-2 sm:mt-3"
            >
              & <span style={{ color: '#CFB53B' }}>ELEGANCE</span>
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-sans text-md sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Transforming your nails into works of art with meticulous attention to detail and contemporary elegance.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-14 justify-center items-center"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => scrollToElement('contact', 1500)}
              className="bg-black text-white px-12 sm:px-14 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
            >
              <span className="relative z-10">Book Now</span>
              <ArrowRight className="ml-3 w-4 h-4" />
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => navigate('/designs')}
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium uppercase tracking-wider px-12 sm:px-14 py-4 border border-gray-200 hover:border-gray-400 flex items-center justify-center bg-white w-full sm:w-auto"
            >
              <span className="relative z-10">View Gallery</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-3 uppercase tracking-widest">
              Scroll Down
            </span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"
            ></motion.div>
          </div>
        </motion.div>

        {/* Corner Decorative Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="hidden lg:block absolute top-24 left-8 w-8 h-8 border-l border-t border-gray-200"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.95 }}
          className="hidden lg:block absolute top-24 right-8 w-8 h-8 border-r border-t border-gray-200"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          className="hidden lg:block absolute bottom-8 left-8 w-8 h-8 border-l border-b border-gray-200"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.05 }}
          className="hidden lg:block absolute bottom-8 right-8 w-8 h-8 border-r border-b border-gray-200"
        ></motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 sm:py-32 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-20 sm:mb-24"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-8 tracking-tight">
              Professional Services
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Expert nail care and artistry with premium products and meticulous attention to detail.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                title: 'Gel & Acrylic Overlays',
                description: 'Professional overlays on your natural nails for strength and lasting beauty.',
                price: 'FROM R160',
                discount: '20% OFF',
                categoryIndex: 0
              },
              {
                title: 'Extensions & Sculptures',
                description: 'Expert extension services to create perfect length and elegant shape.',
                price: 'FROM R210',
                discount: '25% OFF',
                popular: true,
                categoryIndex: 1
              },
              {
                title: 'Nail Art & Services',
                description: 'Custom nail art, professional fills, repairs and maintenance services.',
                price: 'FROM R5',
                discount: '67% OFF',
                categoryIndex: 3
              }
            ].map((service, idx) => {
              const handleServiceClick = () => {
                // Navigate to services page with category parameter
                navigate(`/services?category=${service.categoryIndex}`);
              };

              return (
                <motion.div
                  key={idx}
                  variants={scaleUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={handleServiceClick}
                  className="group bg-white p-8 sm:p-12 cursor-pointer transition-all duration-300 relative border border-gray-100 hover:border-gray-200"
                >
                  {service.popular && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-4 left-0 right-0 z-10 flex justify-center"
                    >
                      <div className="bg-black text-white px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap">
                        Most Popular
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 sm:border-l-6 sm:border-r-6 sm:border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
                    </motion.div>
                  )}

                  <div className="h-full flex flex-col">
                    <div className="mb-2">
                      <span className="text-sm sm:text-base text-gray-400 uppercase tracking-widest">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-light text-black mb-4 sm:mb-6 leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-gray-500 leading-relaxed mb-auto text-sm sm:text-base font-sans">
                      {service.description}
                    </p>

                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
                      <div className="flex items-end justify-between">
                        <div className="text-xl sm:text-2xl font-light text-black">
                          {service.price}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-black">
                          {service.discount}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-16 sm:mt-20"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => navigate('/services')}
              className="text-black border border-black px-12 sm:px-16 py-4 font-light text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200 bg-white"
            >
              View All Services
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Client Stories
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
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
              <motion.div
                key={idx}
                variants={idx % 2 === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white p-6 sm:p-8 border border-gray-100"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </motion.div>
                <p className="text-gray-600 font-light text-sm leading-relaxed italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="text-gray-900 font-light text-sm">— {testimonial.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 bg-white w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Frequently Asked
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="space-y-2"
          >
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white border border-gray-100 overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    transition={{ duration: 0.15 }}
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-6 sm:p-8 text-left transition-colors duration-200"
                  >
                    <span className="text-gray-900 font-light text-base sm:text-lg pr-4">{item.question}</span>
                    <motion.div 
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    >
                      <div className="w-4 h-px bg-gray-400"></div>
                      <div className="w-px h-4 bg-gray-400 absolute"></div>
                    </motion.div>
                  </motion.button>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        id="contact"
      >
        <ContactSection />
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-12 bg-black text-gray-400 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div 
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-xl sm:text-2xl text-white font-light cursor-pointer font-dancing-script"
              onClick={() => scrollToElement('hero', 1500)}
            >
              Daniela Alves
            </motion.div>
            <div className="text-xs sm:text-sm font-light text-center">
              &copy; {new Date().getFullYear()} Daniela Alves. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}