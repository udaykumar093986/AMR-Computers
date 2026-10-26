import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Building,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const ContactSection = () => {
  const { showNotification } = useCart();
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry / Quote Request',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.message) {
      showNotification('Please fill in your name and message', 'error');
      return;
    }
    setSubmitted(true);
    showNotification('Thank you! Your message has been sent to AMR Computers.', 'success');
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/60 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Building className="w-3.5 h-3.5" />
            <span>Store & Tech Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Visit AMR Computers or Reach Out
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Have a custom build requirement, bulk office AMC query, or urgent motherboard diagnostic? Connect with our hardware specialists directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Store Details & Map Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>AMR Computers Showroom & Lab</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Store Address:</strong>
                    <span>Shop #12, Ground Floor, Tech Arcade, Commercial Complex, Main Road, Bengaluru, Karnataka 560001</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Phone Support:</strong>
                    <a href="tel:+919876543210" className="hover:text-cyan-400 transition-colors">
                      +91 98765 43210 / +91 91234 56789
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Email Inquiries:</strong>
                    <a href="mailto:contact@amrcomputers.in" className="hover:text-cyan-400 transition-colors">
                      support@amrcomputers.in / sales@amrcomputers.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Operating Hours:</strong>
                    <span>Monday – Saturday: 10:00 AM – 9:00 PM</span>
                    <span className="block text-slate-400">Sunday: 11:00 AM – 6:00 PM (Repairs & Pickups)</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <a
                href="https://wa.me/919876543210?text=Hello%20AMR%20Computers,%20I%20would%20like%20to%20consult%20with%20your%20technician"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>

            {/* Map Frame Placeholder with Real Tech Coordinates */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Google Maps Location</span>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Open Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-44 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-slate-500 border border-slate-800/80 p-4 text-center">
                <MapPin className="w-8 h-8 text-cyan-400 animate-bounce mb-2" />
                <span className="text-xs font-bold text-white">AMR Computers Flagship Experience Center</span>
                <span className="text-[11px] text-slate-400 mt-1">Open 6 Days a Week • Dedicated Parking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                Tell us about your custom workstation plan, corporate hardware quotation, or specific hardware inquiry. We respond within 2 hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Inquiry Received!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thanks for reaching out, {inquiry.name}. An AMR hardware technician will contact you on your email or phone shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiry({ name: '', email: '', phone: '', subject: 'General Inquiry / Quote Request', message: '' });
                    }}
                    className="mt-4 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inquiry.email}
                      onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={inquiry.subject}
                      onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Custom Gaming PC Build Quote">Custom Gaming PC Build Quote</option>
                      <option value="Enterprise / Studio Workstations">Enterprise / Studio Workstations</option>
                      <option value="Laptop or Motherboard Chip Repair">Laptop or Motherboard Chip Repair</option>
                      <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
                      <option value="Wholesale / Bulk Components">Wholesale / Bulk Components</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Message or Specs *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder="Please mention your budget, target games/applications (e.g. 4K Video editing, Cyberpunk, AutoCAD), or hardware symptoms..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Tech Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
