import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_et71par',
          template_id: 'template_9jjgnog',
          user_id: 'mFxKhq0zMQ6F6Ivj5',
          template_params: {
            name: formData.name,
            from_name: formData.name,
            from_email: formData.email,
            email: formData.email,
            message: formData.message,
          }
        })
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      // Fallback: Show instructions for manual setup
      setStatus('To enable email sending, please set up EmailJS or a backend service. For now, use WhatsApp below.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-4xl font-extralight mb-12 mt-10 text-gray-900 font-bodoni-moda">
              LET'S CREATE
              <span className="block text-[#CFB53B]">SOMETHING BEAUTIFUL</span>
            </h2>
            
            <p className="text-gray-600 font-light mb-12 text-md leading-relaxed font-sans text-lg">
              Ready to elevate your style? Book a consultation and let's bring your nail vision to life.
            </p>

            <div className="space-y-6 mb-12 mt-10">
              {[
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: 'Phone',
                  value: '+27 66 104 3677',
                  href: 'tel:+27661043677'
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: 'Email',
                  value: 'danielaalves3677@gmail.com',
                  href: 'mailto:danielaalves3677@gmail.com'
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: 'Location',
                  value: 'Vanderbijlpark, SE3, South Africa',
                  href: 'https://www.google.com/maps/search/?api=1&query=Vanderbijlpark+SE3+%2C+South+Africa'
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  label: 'Instagram',
                  value: '@nails_by_danielaalves',
                  href: 'https://instagram.com/nails_by_danielaalves'
                }
              ].map((contact, idx) => (
                <a
                  key={idx}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center space-x-4 hover:underline text-gray-700 hover:text-gray-900"
                >
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-sans">
                      {contact.label}
                    </div>
                    <div className="text-gray-800 font-sans">
                      {contact.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-8">
            <h3 className="text-2xl font-light mb-8 text-gray-900">BOOK CONSULTATION</h3>
            
            {status && (
              <div className={`p-4 mb-6 text-center rounded ${
                status.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {status}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full bg-white border border-gray-300 p-4 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full bg-white border border-gray-300 p-4 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your vision..."
                  rows={4}
                  className="w-full bg-white border border-gray-300 p-4 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button
                onClick={sendEmail}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white p-4 font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Email'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href="https://wa.me/27661043677"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-100 text-gray-900 p-4 font-light hover:bg-gray-200 transition-colors text-center border border-gray-300"
              >
                Or Send via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;