import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { useCart } from '../context/useCart';
import { useProducts } from '../context/useProducts';
import { STORE_INFO } from '../data/storeInfo';
import {
  Wrench,
  Clock,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Send,
  MessageSquare,
  Check
} from 'lucide-react';

export const RepairBooking = () => {
  const { formatPrice, showNotification } = useCart();
  const { addTicket } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deviceType: 'Gaming Desktop PC',
    serviceType: 'Motherboard & Chip-Level Repair',
    mode: 'Doorstep Pickup',
    preferredDate: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    issueDescription: ''
  });

  const [submittedBooking, setSubmittedBooking] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectServiceFromCard = (serviceTitle) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: serviceTitle
    }));
    // smooth scroll to booking form
    const formElement = document.getElementById('booking-form-anchor');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isSavingBooking, setIsSavingBooking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showNotification('Please enter your name and phone number', 'error');
      return;
    }
    if (isSavingBooking) return;

    const ticketId = `AMR-REP-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticket = {
      ...formData,
      ticketId,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    setIsSavingBooking(true);
    try {
      await addTicket(ticket);
      setSubmittedBooking(ticket);
      showNotification(`Repair booking saved to Firebase! Ticket #${ticketId}`, 'success');
    } catch (error) {
      console.error('[AMR Computers] Repair booking save failed:', error?.code || error?.message || error);
      showNotification('Repair booking could not be saved. Please try again.', 'error');
    } finally {
      setIsSavingBooking(false);
    }
  };

  const shareBookingWhatsApp = () => {
    if (!submittedBooking) return;
    const msg = `Hello AMR Computers! I booked a repair service online.%0A%0A*Ticket ID:* ${submittedBooking.ticketId}%0A*Name:* ${submittedBooking.name}%0A*Phone:* ${submittedBooking.phone}%0A*Device:* ${submittedBooking.deviceType}%0A*Service:* ${submittedBooking.serviceType}%0A*Mode:* ${submittedBooking.mode}%0A*Preferred Slot:* ${submittedBooking.preferredDate || 'Earliest available'} (${submittedBooking.timeSlot})%0A*Issue:* ${submittedBooking.issueDescription || 'Standard diagnosis'}`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <section id="services" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Hardware Diagnostics & Care Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Professional Repair & Maintenance Services
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Equipped with state-of-the-art infrared BGA soldering workstations and ultrasonic cleaners. We resurrect dead motherboards, revive liquid-damaged laptops, and overclock gaming rigs.
          </p>
        </div>

        {/* Services Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-lg shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between hover:border-cyan-400" 
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {srv.category}
                  </span>
                  {srv.popular && (
                    <span className="text-[10px] font-extrabold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded">
                      Most Requested
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{srv.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-300 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{srv.turnaround}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>90-Day Warranty</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 text-xs text-slate-300">
                  {srv.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Starts from</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {formatPrice(srv.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectServiceFromCard(srv.title)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-xs font-bold border border-slate-700 transition-colors"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Service Booking Form Anchor */}
        <div id="booking-form-anchor" className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Background glow accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {submittedBooking ? (
              /* Success Confirmation Screen */
              <div className="text-center py-8 space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                    Booking Confirmed
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Your Service Request is Scheduled!
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                    Our lead engineer will contact you shortly on {submittedBooking.phone} to coordinate pickup/drop-off.
                  </p>
                </div>

                {/* Ticket Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Service Ticket:</span>
                    <span className="text-cyan-400 font-bold">{submittedBooking.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="text-slate-200">{submittedBooking.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="text-slate-200">{submittedBooking.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device:</span>
                    <span className="text-slate-200">{submittedBooking.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode:</span>
                    <span className="text-emerald-400">{submittedBooking.mode}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={shareBookingWhatsApp}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Ticket Details to AMR on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSubmittedBooking(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Book Another Service
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Schedule a Diagnostic / Repair Session
                    </h3>
                    <p className="text-xs text-slate-400">
                      Fill out the form below. Free diagnostic quote provided prior to any hardware work.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Verma"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 97007 68383"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Device Type
                      </label>
                      <select
                        name="deviceType"
                        value={formData.deviceType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Gaming Desktop PC">Gaming Desktop PC</option>
                        <option value="Gaming Laptop">Gaming Laptop</option>
                        <option value="Business Office Laptop">Business Office Laptop</option>
                        <option value="MacBook / iMac">Apple MacBook / iMac</option>
                        <option value="Motherboard / GPU Component">Motherboard / GPU Component</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Requested
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Mode
                      </label>
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Doorstep Pickup">Doorstep Pickup</option>
                        <option value="In-Store Drop-off">In-Store Drop-off (AMR Showroom)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Preferred Time Slot
                      </label>
                      <select
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                        <option value="Evening (5:00 PM - 8:30 PM)">Evening (5:00 PM - 8:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Describe the problem / symptoms (optional)
                    </label>
                    <textarea
                      name="issueDescription"
                      rows={3}
                      value={formData.issueDescription}
                      onChange={handleChange}
                      placeholder="e.g. PC won't power on after a thunderstorm, or laptop fan making grinding noise..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">
                      ⚡ Free diagnosis estimate provided prior to repair. No advance fee.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm Service Appointment</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
