import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import service1 from '../assets/service1.jpg';
import service2 from '../assets/service2.jpg';
import service3 from '../assets/service3.jpg';
import background from '../assets/background.png';
import AOS from 'aos';
import aboutme from '../assets/aboutme2.png';
import 'aos/dist/aos.css';

export const faqs = [
  {
    question: 'How long do press-on nails last?',
    answer:
      'With proper application and care, our premium press-on nails typically last 1-3 weeks. The longevity depends on your daily activities, nail prep, and how well you follow the aftercare instructions. Office workers often get 2-3 weeks, while those with hands-on jobs may get 1-2 weeks.',
  },
  {
    question: 'Will press-on nails damage my natural nails?',
    answer:
      'Not at all! When applied and removed correctly, press-on nails are actually gentler than gel or acrylic extensions. Our nails use high-quality, non-toxic adhesive that bonds safely without drilling or filing your natural nails. Always follow proper removal techniques to maintain nail health.',
  },
  {
    question: 'How do I apply press-on nails properly?',
    answer:
      'Clean and push back cuticles, buff nail surface lightly, wipe with alcohol, select correct sizes, apply thin layer of glue, press firmly for 10-15 seconds, and file to desired shape. I provide detailed instructions and video tutorials with every purchase to ensure perfect application.',
  },
  {
    question: 'Can I reuse press-on nails?',
    answer:
      'Yes! High-quality press-on nails can often be reused 2-3 times if removed carefully and stored properly. Gently file off old glue residue, clean with alcohol, and reapply with fresh adhesive. This makes them incredibly cost-effective compared to salon visits.',
  },
  {
    question: 'What if a nail pops off early?',
    answer:
      'If a nail comes off within the first few days, it\'s usually due to oil residue, incorrect sizing, or insufficient pressure during application. Clean both the nail and your natural nail with alcohol, reapply with a thin layer of glue, and press firmly. I\'m always available to troubleshoot any issues!',
  },
  {
    question: 'How do I remove press-on nails safely?',
    answer:
      'Soak your nails in warm soapy water for 10-15 minutes, then gently lift from the sides using a cuticle pusher. Never force or peel them off! For stubborn nails, use acetone or nail glue remover around the edges. Take your time to preserve both the press-ons and your natural nails.',
  },
  {
    question: 'Can I do household tasks with press-on nails?',
    answer:
      'Absolutely! Press-on nails are designed for everyday life. You can type, cook, clean, and exercise normally. Just treat them like you would natural long nails - use your fingertips rather than nails for opening things, wear gloves for cleaning, and avoid using them as tools.',
  },
  {
    question: 'Do you offer custom designs and sizes?',
    answer:
      'Yes! I specialize in custom designs tailored to your style, occasion, and nail shape. Whether you want subtle elegance for work, bold art for events, or seasonal themes, I can create your perfect set. I also offer custom sizing for the most comfortable fit possible.',
  },
  {
    question: 'How much do press-on nail sets cost?',
    answer:
      'Prices vary based on design complexity and customization. Basic sets start around R150-250, while intricate custom designs range from R300-500. This includes the full set, application kit, and aftercare instructions. It\'s a fraction of salon costs with salon-quality results!',
  },
  {
    question: 'What\'s the difference between your nails and store-bought ones?',
    answer:
      'My press-on nails use premium materials, hand-painted details, and professional-grade adhesive. Each set is carefully crafted with attention to shape, thickness, and durability. Unlike mass-produced options, mine offer custom sizing, unique designs, and personalized service with ongoing support.',
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div
        className="relative bg-[#F3BAB1]"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'center',
          backgroundBlendMode: 'color-burn',
          zIndex: 0,
        }}
        data-aos="fade-in"
      >
        <div className="relative z-[10]">
          <div className="max-w-6xl mx-auto px-6 py-24 md:px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-[50px] font-bodoni-moda mb-5 md:mb-5 text-white">
                Modern Nail Artistry
              </h1>
              <p className="mb-14 max-w-2xl mx-auto text-[14px] md:text-sm font-montserrat font-thin text-white">
                Discover premium, stylish press-on nails by Press Ons by Dani for every occasion.
              </p>
              <a
                href="https://wa.me/27661043677"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="group inline-flex items-center bg-[#FFFFFF10] border-[1px] border-white text-white font-thin px-8 py-3 hover:bg-[#FFFFFF40] transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)', // for Safari
                  }}
                >
                  Book Session
                  <ArrowRight
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-3"
                    size={14}
                  />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Preview - Enhanced */}
      <div className="max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
        <h2 className="text-3xl font-bodoni-moda text-center text-gray-900 mb-12">
          Signature Services
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: 'Effortless Elegance',
              description: 'Transform your look in minutes with our easy-to-apply press-on nails designed for the modern woman.',
              image: service1,
            },
            {
              title: 'Salon-Quality at Home',
              description: 'Experience professional results without the salon visit—premium nails with lasting beauty, instantly.',
              image: service2,
            },
            {
              title: 'Modern Nail Art',
              description: 'Subtle elegance meets contemporary design with our curated collection of artistic nail sets.',
              image: service3,
            },
          ].map((service, idx) => (
            <div
              key={service.title}
              className="group bg-white p-8 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-72 w-full object-cover mb-6 border border-gray-100 group-hover:scale-105 transition-transform duration-500"
                />
                <h3 className="text-xl text-gray-900 mb-1 text-[16px]">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-[12px] font-montserrat font-thin">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[#F3BAB1] border-t border-b" data-aos="fade-up"
				style={{
					backgroundImage: 'url(`${background}`)',
					backgroundRepeat: 'repeat',
					backgroundSize: '300px',
					backgroundPosition: 'center',
					backgroundBlendMode: 'color-burn',
					zIndex: 0,
				}}
			>
        <div className='z-[10]'>
					<div className="max-w-6xl mx-auto px-4 py-14 md:flex items-center gap-12">
						<div className="md:w-1/2 mb-20 md:mb-0">
							<img
								src={aboutme}
								alt={"aboutme"}
								className="w-[400px] object-cover mb-4"
							/>
						</div>
						<div className="md:w-1/2 text-center md:text-left">
							<h2 className="text-4xl font-bodoni-moda mb-6 mt-0 md:mt-[50px] text-white" data-aos="fade-up">
								What Makes Me Different?
							</h2>
							<p className="mb-6 leading-relaxed text-sm font-montserrat font-thin text-white" data-aos="fade-up">
								My passion for nail design sets me apart—each nail is a canvas for creativity and self-expression. I combine modern techniques with innovative artistry to craft designs that are as unique as you are, using only premium, non-toxic products. This commitment to clean, conscious beauty ensures that every detail is meticulously curated, resulting in nail art that is both striking and enduring.
							</p>
						</div>

					</div>
				</div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-16" data-aos="fade-up">
        <h2 className="text-3xl font-bodoni-moda text-center text-gray-900 mb-12">
          Testimonials
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div
            className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200"
            data-aos="fade-up"
          >
            <div className="text-6xl font-bodoni-moda text-gray-300">"</div>
            <p className="text-sm italic text-gray-600">
              "Daniela's artistry in nail design is truly inspiring. Every detail reflects her passion
              and innovative approach, leaving me feeling confident and uniquely styled. I highly
              recommend her exceptional work."
              <br />
              <br />— Ruben
            </p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-6xl font-bodoni-moda text-gray-300">"</div>
            <p className="text-sm italic text-gray-600">
              "I was amazed by the intricate designs and attention to detail. Daniela transformed my
              nails into a work of art that I proudly showcase every day."
              <br />
              <br />— Sophia
            </p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="text-6xl font-bodoni-moda text-gray-300">"</div>
            <p className="text-sm italic text-gray-600">
              "From start to finish, my experience was top-notch. Daniela's creativity and
              professionalism made me feel like a star."
              <br />
              <br />— James
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section - Fixed mobile cutoff */}
      <div className="max-w-4xl mx-auto px-6 py-16" data-aos="fade-up">
        <h2 className="text-3xl font-bodoni-moda text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="w-full bg-white border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out"
              >
                {/* Question Row */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-8 transition-colors duration-200"
                >
                  <span className="font-bodoni-moda text-xl text-gray-900 text-left">
                    {item.question}
                  </span>
                  <Plus
                    size={24}
                    className={`text-black transition-transform duration-200 ease-in-out flex-shrink-0 ml-4 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>

                {/* Answer Section with dynamic height */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                  style={{
                    maxHeight: isOpen ? 'fit-content' : '0px',
                    overflow: isOpen ? 'visible' : 'hidden'
                  }}
                >
                  <div className="px-8 pb-8">
                    <p className="text-gray-600 font-montserrat leading-relaxed text-sm">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="font-dancing-script text-2xl mb-4 text-gray-900">
              Daniela Alves
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              {['Instagram', 'Pinterest', 'TikTok'].map((social) => (
                <a
                  key={social}
                  href="/"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {social}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Daniela Alves. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}