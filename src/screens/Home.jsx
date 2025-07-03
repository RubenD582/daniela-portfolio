import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToElement } from '../components/scrollUtils';
import ContactSection from './Contact';

const faqs = [
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

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div style={{ backgroundColor: 'white', width: '100%', margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '0 20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            marginBottom: '24px', 
            padding: '8px 16px', 
            backgroundColor: 'rgba(255,255,255,0.9)',
            fontSize: '12px',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Certified Nail Technician
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2rem, 8vw, 5rem)', 
            fontWeight: '300', 
            color: '#111', 
            marginBottom: '32px',
            lineHeight: '1.1',
            margin: '0 0 32px 0'
          }}>
            PRECISION
            <br />
            & <span style={{ color: '#CFB53B' }}>ELEGANCE</span>
          </h1>

          <p style={{ 
            fontSize: '18px', 
            color: '#666', 
            marginBottom: '48px', 
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 48px auto'
          }}>
            Transforming your nails into works of art with meticulous attention to detail and contemporary elegance.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => scrollToElement('contact', 1500)}
              style={{
              backgroundColor: '#111',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Book Now
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={() => navigate('/designs')}
              style={{
                backgroundColor: 'white',
                color: '#333',
                padding: '16px 32px',
                border: '1px solid #ddd',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              View Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 6vw, 4rem)', 
              fontWeight: '300', 
              color: '#111', 
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              Professional Services
            </h2>
            <p style={{ 
              color: '#666', 
              fontSize: '18px', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Expert nail care and artistry with premium products and meticulous attention to detail.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginBottom: '60px'
          }}>
            {[
              {
                title: 'Gel & Acrylic Overlays',
                description: 'Professional overlays on your natural nails for strength and lasting beauty.',
                price: 'FROM R160',
                discount: '20% OFF'
              },
              {
                title: 'Extensions & Sculptures',
                description: 'Expert extension services to create perfect length and elegant shape.',
                price: 'FROM R210',
                discount: '25% OFF',
                popular: true
              },
              {
                title: 'Nail Art & Services',
                description: 'Custom nail art, professional fills, repairs and maintenance services.',
                price: 'FROM R5',
                discount: '67% OFF'
              }
            ].map((service, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  border: '1px solid #e5e5e5',
                  position: 'relative'
                }}
              >
                {service.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#111',
                    color: 'white',
                    padding: '8px 20px',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#999', textTransform: 'uppercase' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '300', 
                  color: '#111', 
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  {service.title}
                </h3>

                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6', 
                  marginBottom: '30px',
                  fontSize: '15px'
                }}>
                  {service.description}
                </p>

                <div style={{ 
                  paddingTop: '20px', 
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '300', color: '#111' }}>
                    {service.price}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                    {service.discount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/services')}
              style={{
                backgroundColor: 'white',
                color: '#111',
                border: '1px solid #111',
                padding: '16px 40px',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ 
        padding: '80px 20px', 
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: '300', 
              color: '#111', 
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              Client Stories
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px'
          }}>
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
                style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  border: '1px solid #e5e5e5'
                }}
              >
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  marginBottom: '20px',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ color: '#111', fontSize: '14px' }}>— {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: '300', 
              color: '#111',
              margin: '0 0 20px 0'
            }}>
              Frequently Asked
            </h2>
          </div>

          <div>
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    marginBottom: '8px'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '24px',
                      textAlign: 'left',
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#111'
                    }}
                  >
                    <span>{item.question}</span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '1px',
                        backgroundColor: '#999',
                        position: 'absolute'
                      }}></div>
                      <div style={{
                        width: '1px',
                        height: '16px',
                        backgroundColor: '#999',
                        position: 'absolute'
                      }}></div>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div style={{ padding: '0 24px 24px 24px' }}>
                      <p style={{ 
                        color: '#666', 
                        lineHeight: '1.6',
                        margin: 0,
                        fontSize: '15px'
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div id="contact">
        <ContactSection />
      </div>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 20px', 
        backgroundColor: '#111', 
        color: '#999'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ 
            fontSize: '24px', 
            color: 'white', 
            fontWeight: '300',
            cursor: 'pointer'
          }}>
            Daniela Alves
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} Daniela Alves. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}