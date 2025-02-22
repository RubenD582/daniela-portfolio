import React, { useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'
import TiltCard from '../components/TiltCard';
import service1 from '../assets/service1.png';
import service2 from '../assets/service2.png';
import service3 from '../assets/service3.png';
import background from '../assets/background.png';
import aboutme from '../assets/aboutme.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
			<div
				className="relative bg-[#F7D2C7]"
				style={{
					backgroundImage: `url(${background})`,
					backgroundRepeat: 'repeat',
					backgroundSize: '300px',
					backgroundPosition: 'center',
				}}
				data-aos="fade-in"
				data-aos-duration="2000"
			>
				<div className="max-w-6xl mx-auto px-6 py-24 md:px-4">
					<div className="text-center">
						<h1 className="text-4xl md:text-[50px] font-bodoni-moda text-gray-900 mb-5 md:mb-5 text-white">
							Modern Nail Artistry
						</h1>
						<p className="text-gray-500 mb-14 max-w-2xl mx-auto text-[14px] md:text-[18px] font-montserrat font-thin text-white">
							Discover premium, stylish press‑on nails by Press Ons by Dani for every occasion.
						</p>
						<a
							href="https://wa.me/27661043677"
							target="_blank"
							rel="noopener noreferrer"
						>
							<button className="group inline-flex text-white border-white items-center bg-[#FFFFFF30] border-[1px] border-gray-900 text-gray-900 font-thin px-8 py-3 hover:bg-[#FFFFFF00] transition-all duration-300">
								Book Session
								<ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-3" size={14} />
							</button>
						</a>

					</div>
				</div>
			</div>


      {/* Services Preview */}
      <div className="max-w-6xl mx-auto px-4 py-16" data-aos="fade-up">
				<h2 className="text-3xl font-bodoni-moda text-center text-gray-900 mb-12">
					Signature Services
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{[
						{ title: 'Effortless Elegance', description: 'Transform your look in minutes with our easy-to-apply press-on nails.', image: service1 },
						{ title: 'Salon-Quality at Home', description: 'Experience professional results without the salon—premium nails, instantly.', image: service2 },
						{ title: 'Modern Nail Art', description: 'Subtle elegance with lasting quality', image: service3 }
					].map((service) => (
						<div
							key={service.title}
							className="bg-white p-8 border hover:border-gray-400 transition-colors"
							data-aos="fade-up"
						>
							<img
								src={service.image}
								alt={service.title}
								className="h-64 w-full object-cover mb-4 border"
							/>
							<h3 className="text-xl text-gray-900 mb-1 text-[16px]">{service.title}</h3>
							<p className="text-gray-500 text-[12px] font-montserrat font-thin">{service.description}</p>
						</div>
					))}
				</div>
			</div>

      {/* About Section */}
      <div className="bg-[#FBE9E3] border-t border-b" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 py-24 md:flex items-center gap-12">
          <div className="md:w-1/2 mb-20 md:mb-0">
						<img
							src={aboutme}
							alt={"aboutme"}
							className="w-[400px] object-cover mb-4"
						/>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
						<h2 className="text-4xl font-bodoni-moda text-gray-900 mb-6 mt-0 md:mt-[50px]" data-aos="fade-up">
							What Makes Me Different?
						</h2>
						<p className="text-gray-500 mb-6 leading-relaxed text-sm font-montserrat font-thin" data-aos="fade-up">
							My passion for nail design sets me apart—each nail is a canvas for creativity and self-expression. I combine modern techniques with innovative artistry to craft designs that are as unique as you are, using only premium, non-toxic products. This commitment to clean, conscious beauty ensures that every detail is meticulously curated, resulting in nail art that is both striking and enduring.
						</p>
					</div>

        </div>
      </div>

			<div className="max-w-6xl mx-auto px-4 py-16" data-aos="fade-up">
				<h2 className="text-3xl font-bodoni-moda text-center text-gray-900 mb-12">
					Testimonials
				</h2>
				<div className="flex flex-col md:flex-row gap-8 justify-center">
					<div className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200">
						<div className="text-6xl font-bodoni-moda text-gray-300">"</div>
						<p className="text-sm italic text-gray-600">
							"Daniela’s artistry in nail design is truly inspiring. Every detail reflects her passion and innovative approach, leaving me feeling confident and uniquely styled. I highly recommend her exceptional work."
							<br /><br />— Ruben
						</p>
					</div>
					<div className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200">
						<div className="text-6xl font-bodoni-moda text-gray-300">"</div>
						<p className="text-sm italic text-gray-600">
							"I was amazed by the intricate designs and attention to detail. Daniela transformed my nails into a work of art that I proudly showcase every day."
							<br /><br />— Sophia
						</p>
					</div>
					<div className="bg-white shadow-lg rounded-lg p-8 max-w-md border border-gray-200">
						<div className="text-6xl font-bodoni-moda text-gray-300">"</div>
						<p className="text-sm italic text-gray-600">
							"From start to finish, my experience was top-notch. Daniela’s creativity and professionalism made me feel like a star."
							<br /><br />— James
						</p>
					</div>
				</div>
			</div>




      {/* Footer */}
      <footer className="">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="font-dancing-script text-2xl mb-4 text-gray-900">
              Daniela Aalves
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              {['Instagram', 'Pinterest', 'TikTok'].map((social) => (
                <a key={social} href="/" className="text-gray-500 hover:text-gray-700">
                  {social}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Daniela Aalves. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
