import { Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { BUSINESS_ADDRESS_LINES } from '@/lib/contact';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderType: '',
    subject: '',
    message: ''
  });

  const phoneNumber = "054 972 9309";
  const whatsappNumber = "233549729309";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const smsMessage = `Hi! I'm ${formData.name}. Order Type: ${formData.orderType}. Subject: ${formData.subject}. Message: ${formData.message}. Contact: ${formData.phone}`;
    window.location.href = `sms:${phoneNumber.replace(/\s/g, '')}?body=${encodeURIComponent(smsMessage)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <section className="bg-black pt-32 pb-16 border-b border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-yellow-400">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to enjoy delicious Ghanaian cuisine? Get in touch and let's discuss your order.
            </p>
          </div>
        </div>
      </section>

      {/* Map — full width */}
      <section className="w-full bg-black border-b border-gray-800" aria-label="Believe Chops location">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7866319250124!2d-0.2558028241623261!3d5.598510733219002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9980be124299%3A0x952696fdabd10f2b!2sBelieveChops!5e0!3m2!1sen!2sgh!4v1779229742906!5m2!1sen!2sgh"
          className="block w-full min-h-[320px] sm:min-h-[400px] md:min-h-[480px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Believe Chops on Google Maps"
        />
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Left Side - Get in Touch */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-400 mb-10">
                We're here to answer your questions and help you place your order.
              </p>

              {/* Contact Info */}
              <div className="space-y-6 mb-10">
                {/* Phone */}
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <Phone className="w-5 h-5 text-yellow-400 group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <p className="text-gray-400">{phoneNumber}</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-gray-400">
                      {BUSINESS_ADDRESS_LINES.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="+233 55 123 4567"
                      />
                    </div>
                  </div>

                  {/* Row 2: Order Type & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="orderType" className="block text-sm font-medium text-gray-300 mb-2">
                        Order Type <span className="text-yellow-400">*</span>
                      </label>
                      <select
                        id="orderType"
                        name="orderType"
                        required
                        value={formData.orderType}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      >
                        <option value="">Select Type</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Dine-in">Dine-in</option>
                        <option value="Catering">Catering</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="What would you like to order?"
                      />
                    </div>
                  </div>

                  {/* Row 3: Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Message <span className="text-yellow-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your order or inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/25"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
