'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { refuelContent } from '@/config/siteContent';
import { trackEvent } from '@/lib/analytics';

export default function RefuelSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const canSubmit =
    form.name.trim().length > 1 &&
    emailLooksValid &&
    form.message.trim().length >= 10 &&
    status !== 'sending';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!emailLooksValid) newErrors.email = 'Valid email required';
    if (form.message.trim().length < 10) newErrors.message = 'Min 10 characters';

    if (Object.keys(newErrors).length > 0) {
      trackEvent('contact_form_validation_failed', {
        has_name_error: Boolean(newErrors.name),
        has_email_error: Boolean(newErrors.email),
        has_message_error: Boolean(newErrors.message),
      });
      setErrors(newErrors);
      return;
    }

    trackEvent('contact_form_submit_attempt', {
      message_length: form.message.trim().length,
    });

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        trackEvent('contact_form_submit_success', {
          message_length: form.message.trim().length,
        });
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        trackEvent('contact_form_submit_failed', {
          status_code: res.status,
        });
        setStatus('error');
      }
    } catch {
      trackEvent('contact_form_submit_failed', {
        status_code: 0,
      });
      setStatus('error');
    }
  }

  return (
    <>
      <section
        id="contact"
        className="relative flex flex-col items-center overflow-hidden bg-white my-6 px-3 pt-6 pb-10 sm:my-8 sm:px-4 sm:pt-8 sm:pb-12 lg:my-10 lg:px-6 lg:pt-10 lg:pb-14"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(0,119,255,0.06), transparent 35%), radial-gradient(circle at bottom right, rgba(0,212,255,0.05), transparent 40%), white',
        }}
      >
      {/* Premium gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-50/80 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-50/60 blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:gap-10 lg:px-8 lg:py-10">
        {/* Hero Section - Clean & Spacious */}
        <motion.div
          className="w-full flex flex-col items-center text-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/50 text-blue-700 font-semibold text-sm uppercase tracking-wide">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {refuelContent.badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            <h1 className="text-[2rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem] font-black tracking-tight text-gray-900 leading-[0.9]">
              {refuelContent.heading}
              <br />
              <span className="hero-line-script text-[1.5rem] sm:text-[1.8rem] md:text-[2.15rem] lg:text-[2.5rem]" style={{ textTransform: 'none' }}>
                {refuelContent.headingAccent}
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-body text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {refuelContent.subtitle}
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid - Premium Two Column */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* Left Column - Contact Cards & Info */}
            <motion.div
              className="flex flex-col justify-start space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* Info Card */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  We&apos;re Here to Help
                </h2>
                <p className="text-xs sm:text-sm font-body text-gray-600 leading-relaxed">
                  Got questions? Partnership ideas? Just want to say hi? Drop us a line and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {refuelContent.contactCards.map((card, idx) => (
                  <motion.div
                    key={card.title}
                    className="group relative p-5 sm:p-6 lg:p-8 rounded-2xl border border-gray-200/50 bg-white hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.35 + idx * 0.1 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div className="text-4xl">{card.icon}</div>
                      <div>
                        <h3 className="font-black text-gray-900 text-sm sm:text-base">{card.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">{card.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Hydration Fact */}
              <motion.div
                className="mt-4 p-6 sm:p-8 rounded-2xl border border-cyan-200/30 bg-gradient-to-br from-cyan-50/50 to-blue-50/30"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="font-black text-gray-900 text-sm sm:text-base uppercase tracking-tight">
                  {refuelContent.hydrationFact?.title || 'Fun Fact'}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mt-3 leading-relaxed">
                  {refuelContent.hydrationFact?.text}
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <form
                onSubmit={handleSubmit}
                className="sticky top-20 p-6 sm:p-8 lg:p-10 rounded-2xl border border-gray-200/60 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.04)]"
              >
                <div className="space-y-8">
                  {/* Form Header */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      Send us a Message
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-light">
                      Fill out the form below and we'll respond promptly.
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-label font-extrabold uppercase tracking-widest text-gray-700">
                        {refuelContent.formFields.name.label}
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder={refuelContent.formFields.name.placeholder}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-medium text-gray-900 placeholder:text-gray-400 rounded-xl border-2 transition-all duration-200 outline-none"
                        style={{
                          borderColor: focused === 'name' ? '#0077FF' : '#E5E7EB',
                          backgroundColor: focused === 'name' ? '#F0F7FF' : '#FFFFFF',
                          boxShadow: focused === 'name' ? '0 0 0 3px rgba(0,119,255,0.1)' : 'none',
                        }}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm font-semibold">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-label font-extrabold uppercase tracking-widest text-gray-700">
                        {refuelContent.formFields.email.label}
                      </label>
                      <input
                        type="email"
                        maxLength={254}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder={refuelContent.formFields.email.placeholder}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-medium text-gray-900 placeholder:text-gray-400 rounded-xl border-2 transition-all duration-200 outline-none"
                        style={{
                          borderColor: focused === 'email' ? '#0077FF' : '#E5E7EB',
                          backgroundColor: focused === 'email' ? '#F0F7FF' : '#FFFFFF',
                          boxShadow: focused === 'email' ? '0 0 0 3px rgba(0,119,255,0.1)' : 'none',
                        }}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm font-semibold">{errors.email}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-label font-extrabold uppercase tracking-widest text-gray-700">
                          {refuelContent.formFields.message.label}
                        </label>
                        <span className="text-[9px] text-gray-500 font-medium">
                          {form.message.length}/2000
                        </span>
                      </div>
                      <textarea
                        maxLength={2000}
                        rows={7}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        placeholder={refuelContent.formFields.message.placeholder}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-medium text-gray-900 placeholder:text-gray-400 rounded-xl border-2 transition-all duration-200 outline-none resize-none"
                        style={{
                          borderColor: focused === 'message' ? '#0077FF' : '#E5E7EB',
                          backgroundColor: focused === 'message' ? '#F0F7FF' : '#FFFFFF',
                          boxShadow: focused === 'message' ? '0 0 0 3px rgba(0,119,255,0.1)' : 'none',
                        }}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-sm font-semibold">{errors.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full py-4 px-6 text-sm sm:text-base font-black uppercase tracking-wider text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: canSubmit
                        ? 'linear-gradient(135deg, #0077FF 0%, #00B8FF 100%)'
                        : '#D1D5DB',
                      boxShadow: canSubmit
                        ? '0 12px 24px rgba(0,119,255,0.3)'
                        : 'none',
                    }}
                    whileHover={canSubmit ? { y: -2 } : {}}
                    whileTap={canSubmit ? { scale: 0.98 } : {}}
                  >
                    {status === 'sending' ? refuelContent.sendingLabel : refuelContent.submitLabel}
                  </motion.button>

                  {/* Form Note */}
                  <p className="text-center text-[10px] sm:text-xs text-gray-500 font-light">
                    We'll respond within 24 hours. Promise.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Success/Error Modal */}
    <AnimatePresence>
      {(status === 'sent' || status === 'error') && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStatus('idle')}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-2xl"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="mb-6 text-6xl inline-block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                {status === 'sent' ? '✅' : '❌'}
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
                {status === 'sent' ? refuelContent.sentLabel : 'Error'}
              </h3>

              <p className="text-gray-600 mb-8 font-light text-xs sm:text-sm">
                {status === 'sent'
                  ? refuelContent.successMessage
                  : refuelContent.errorMessage}
              </p>

              <motion.button
                onClick={() => setStatus('idle')}
                className="w-full py-3 px-4 text-sm font-black uppercase tracking-wider text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
