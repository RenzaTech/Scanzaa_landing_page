import React, { useState } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    phone: '',
    email: '',
    tablesCount: '10-25',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#050808]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-[#00D2C4]/30 shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00D2C4]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#00D2C4]/20 rounded-full flex items-center justify-center mx-auto border border-[#00D2C4]/50">
              <CheckCircle2 className="w-8 h-8 text-[#00D2C4]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
            <p className="text-[#8B9696] max-w-md mx-auto text-sm leading-relaxed">
              Thank you for expressing interest in ScanzAA! Our restaurant tech deployment team will reach out to <span className="text-[#00D2C4] font-medium">{formData.phone || 'your phone'}</span> within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-[#00D2C4] text-[#050808] font-semibold text-sm hover:bg-[#80FFF5] transition-all glow-turquoise"
              >
                Back to ScanzAA
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Transform Your Tables</h3>
            <p className="text-sm text-[#8B9696] mb-6">
              Get in touch with our team to set up your restaurant's digital menu infrastructure.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B9696] mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artisan Bistro"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B9696] mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B9696] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B9696] mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="owner@restaurant.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8B9696] mb-1">Number of Restaurant Tables</label>
                <select
                  value={formData.tablesCount}
                  onChange={(e) => setFormData({ ...formData, tablesCount: e.target.value })}
                  className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4]"
                >
                  <option value="1-10">1 - 10 Tables</option>
                  <option value="10-25">10 - 25 Tables</option>
                  <option value="25-50">25 - 50 Tables</option>
                  <option value="50+">50+ Tables (Chain / Franchise)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8B9696] mb-1">Additional Requirements (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your menu size, venue type, or custom acrylic QR requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#050808]/80 border border-white/10 focus:border-[#00D2C4] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00D2C4] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#00D2C4] text-[#050808] font-semibold text-sm hover:bg-[#80FFF5] transition-all flex items-center justify-center gap-2 glow-turquoise"
              >
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
