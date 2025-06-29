import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const AllServicesPage = () => {
  const [animatedItems, setAnimatedItems] = useState(new Set());

  // Function to generate WhatsApp booking link
  const generateWhatsAppLink = (serviceName, price, priceNote = "") => {
    const phoneNumber = "27661043677";
    const message = `Hey Daniela!

I'm interested in booking the ${serviceName} service for ${price}${priceNote ? ` ${priceNote}` : ''}

Could we please schedule an appointment? Let me know your available times.

Thank you!`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // Intersection Observer for service items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId) {
              setAnimatedItems(prev => new Set([...prev, itemId]));
            }
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: '50px'
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const serviceItems = document.querySelectorAll('[data-item-id]');
      serviceItems.forEach(item => observer.observe(item));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const serviceCategories = [
    {
      categoryName: "Gel & Acrylic Overlays",
      services: [
        {
          price: "R160",
          name: "Gel Overlay",
          description: "Professional gel overlay on your natural nails for strength and durability. Includes base coat, gel application, cuticle care, shaping, and high-gloss top coat finish."
        },
        {
          price: "R180",
          name: "Acrylic Overlay", 
          description: "Strong acrylic overlay system providing excellent durability and smooth finish. Includes nail preparation, acrylic application, shaping, buffing, and cuticle care."
        }
      ]
    },
    {
      categoryName: "Extensions & Sculptures",
      services: [
        {
          price: "R210",
          name: "Gel Extensions - Short",
          description: "Professional gel extensions for added length and strength. Perfect for everyday wear with a natural look. Includes nail preparation, extension application, shaping, and finishing."
        },
        {
          price: "R230", 
          name: "Gel Extensions - Medium",
          description: "Medium length extensions providing the perfect balance between practicality and elegance."
        },
        {
          price: "R250",
          name: "Gel Extensions - Long", 
          description: "Dramatic long extensions for those who want to make a statement with their nails."
        },
        {
          price: "R230",
          name: "Acrylic Sculptures - Short",
          description: "Hand-sculpted acrylic nails with superior strength and durability in a short, practical length."
        },
        {
          price: "R250",
          name: "Acrylic Sculptures - Medium",
          description: "Medium length acrylic sculptures offering the perfect combination of style and functionality."
        },
        {
          price: "R270",
          name: "Acrylic Sculptures - Long",
          description: "Long acrylic sculptures for maximum impact and glamour. Perfect for special occasions or everyday elegance."
        }
      ]
    },
    {
      categoryName: "Maintenance & Repairs", 
      services: [
        {
          price: "R120",
          name: "Gel Fill",
          description: "Maintain your gel nails with professional fill service. Keeps your nails looking fresh and extends their lifespan. Includes growth area fill, reshaping, and cuticle care."
        },
        {
          price: "R120",
          name: "Acrylic Fill",
          description: "Professional acrylic fill service to maintain the strength and appearance of your acrylic nails."
        },
        {
          price: "R20",
          name: "Broken Nail Repair",
          description: "Quick and effective repair for broken or damaged nails. Restore your nail to its original beauty."
        },
        {
          price: "R50",
          name: "Soak Off Service", 
          description: "Safe and gentle removal of gel or acrylic nails without damage to your natural nails. Includes professional removal process and nail conditioning treatment."
        }
      ]
    },
    {
      categoryName: "Add-Ons",
      services: [
        {
          price: "R5",
          priceNote: "per nail",
          name: "Nail Art",
          description: "Custom nail art designs to express your personal style. From simple accents to intricate patterns. Can be added to any nail service for personalized flair.",
          note: "*Our most popular add-on"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className={`text-center py-32 mt-20 transition-all duration-1000 opacity-100 translate-y-0`}>
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-8">
            Nail Services
          </h1>
          <p className="text-stone-600 font-light leading-relaxed font-sans">
            Professional nail preparation, cuticle care, shaping, filing, buffing, and application with premium products. 
            Each service includes meticulous attention to detail and personalized care for optimal results.
          </p>
          <p className="text-stone-600 font-light text-sm mt-4 italic">
            [ Additional services and nail art available upon request. ]
          </p>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {serviceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Service Category Name */}
              <div 
                data-item-id={`category-${categoryIndex}`}
                className={`transition-all duration-1000 ease-out ${
                  animatedItems.has(`category-${categoryIndex}`) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-8'
                }`}
              >
                <h2 className="text-4xl font-light text-stone-900">{category.categoryName}</h2>
              </div>
              
              {/* Services List */}
              <div className="space-y-8">
                {category.services.map((service, serviceIndex) => {
                  const itemId = `service-${categoryIndex}-${serviceIndex}`;
                  
                  return (
                    <a 
                      key={serviceIndex}
                      data-item-id={itemId}
                      href={generateWhatsAppLink(service.name, service.price, service.priceNote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-6 border border-transparent hover:border-stone-300 transition-all duration-300 ease-out cursor-pointer ${
                        animatedItems.has(itemId) 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{
                        transitionDelay: animatedItems.has(itemId) ? '0ms' : `${serviceIndex * 150}ms`
                      }}
                    >
                      <div className="mb-2">
                        <span className="text-sm text-stone-600 font-montserrat">{service.price}</span>
                        {service.priceNote && (
                          <span className="text-sm text-stone-600 ml-2">{service.priceNote}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg text-stone-900 uppercase tracking-wide">
                          {service.name}
                        </h3>
                        <ArrowRight size={18} className="text-stone-400" />
                      </div>
                      <p className="text-stone-600 font-light leading-relaxed mb-4 font-montserrat text-sm">
                        {service.description}
                      </p>
                      {service.note && (
                        <p className="text-stone-600 font-light text-sm italic">
                          {service.note}
                        </p>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div 
          data-item-id="contact-section"
          className={`border-t border-stone-200 pt-12 transition-all duration-1200 ease-out ${
            animatedItems.has('contact-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <h3 className="text-2xl font-light text-stone-900 mb-4">
              Have Questions About Our Services?
            </h3>
            <p className="text-stone-600 font-light mb-8">
              Contact me for consultations, custom requests, or any questions about treatments.
            </p>
            <div className="space-y-4">
              <div>
                <a 
                  href={generateWhatsAppLink("General Consultation", "Free", "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-stone-900 text-white px-8 py-3 hover:bg-stone-800 transition-colors duration-300 font-light mr-4"
                >
                  Chat on WhatsApp
                </a>
                <a 
                  href="tel:0661043677" 
                  className="inline-block bg-stone-100 text-stone-900 px-8 py-3 hover:bg-stone-200 transition-colors duration-300 font-light"
                >
                  Call +27 66 104 3677
                </a>
              </div>
              <p className="text-stone-500 text-sm">
                Professional nail services • Expert care • Premium products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;