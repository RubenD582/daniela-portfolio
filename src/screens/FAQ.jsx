import { faqs } from "./Home";
import React, { useEffect, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div>
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
                    <p className="text-gray-600/70 font-montserrat leading-relaxed text-sm">
                    {item.answer}
                    </p>
                </div>
                </div>
            </div>
            );
        })}
        </div>
      </div>
    </div>
  );
}