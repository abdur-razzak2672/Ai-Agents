'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Cpu, HelpCircle, Shield, Zap } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals trying out our AI tools.',
      price: isAnnual ? '0' : '0',
      popular: false,
      features: [
        '5 Website Replications per month',
        'Basic Medical AI Diagnostics',
        'Standard Export Formats',
        'Community Support'
      ],
      missing: [
        'Advanced Clinical Reporting',
        'Unlimited Replications',
        'Priority Support'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline'
    },
    {
      name: 'Pro',
      description: 'Advanced features for professionals and agencies.',
      price: isAnnual ? '29' : '39',
      popular: true,
      features: [
        'Unlimited Website Replications',
        'Advanced Medical AI Diagnostics',
        'Verified Doctor Prescriptions',
        'Premium Export (React, Next.js)',
        'Priority Email Support'
      ],
      missing: [
        'Custom AI Model Training'
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'solid'
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large scale operations.',
      price: 'Custom',
      popular: false,
      features: [
        'Everything in Pro',
        'Custom AI Model Training',
        'Dedicated Account Manager',
        'SSO Authentication',
        'SLA Guarantee'
      ],
      missing: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">AI Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-[15px] font-bold text-slate-800">
            <Link href="/#services" className="hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full py-1">Services</Link>
            <Link href="/#features" className="hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full py-1">Features</Link>
            <Link href="/#about" className="hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full py-1">About Us</Link>
            <Link href="/pricing" className="text-indigo-600 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 py-1">Pricing</Link>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/#services" className="hidden md:block text-[15px] font-bold text-slate-800 hover:text-indigo-600 transition-colors">
              Log In
            </Link>
            <Link href="/#services" className="bg-indigo-600 hover:bg-indigo-700 px-7 py-3 rounded-full text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Simple, transparent <span className="text-indigo-600">pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-12 font-medium">
              No hidden fees. No surprise charges. Choose the plan that best fits your needs and start building with AI today.
            </p>
          </motion.div>

          {/* Monthly/Annual Toggle */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center justify-center gap-5">
            <span className={`text-[15px] font-bold transition-colors ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-[68px] h-9 bg-slate-200 rounded-full p-1 transition-colors hover:bg-slate-300 focus:outline-none"
            >
              <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${isAnnual ? 'translate-x-[32px]' : 'translate-x-0'}`}>
                {isAnnual && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
              </div>
            </button>
            <span className={`text-[15px] font-bold flex items-center gap-2 transition-colors ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Annually <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-28">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`relative bg-white rounded-[2rem] p-8 md:p-10 border transition-all duration-300 ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-600/10 scale-105 z-10' : 'border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed h-12">{plan.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1.5">
                  {plan.price !== 'Custom' && <span className="text-3xl font-extrabold text-slate-900">$</span>}
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-lg text-slate-400 font-medium ml-1">/mo</span>}
                </div>
                <div className="h-5 mt-2">
                  {isAnnual && plan.price !== 'Custom' && plan.price !== '0' && (
                    <span className="text-[13px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">Billed annually</span>
                  )}
                </div>
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-bold text-[15px] mb-10 transition-all active:scale-95 ${
                  plan.buttonVariant === 'solid' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="flex-1 space-y-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">What's included</div>
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3.5">
                    <div className="mt-0.5 bg-indigo-50 p-1 rounded-full shrink-0">
                      <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                    </div>
                    <span className="text-[15px] font-medium text-slate-700 leading-snug">{feature}</span>
                  </div>
                ))}
                {plan.missing.map(feature => (
                  <div key={feature} className="flex items-start gap-3.5 opacity-50 grayscale">
                    <div className="mt-0.5 bg-slate-100 p-1 rounded-full shrink-0">
                      <X className="w-3.5 h-3.5 text-slate-400" strokeWidth={3} />
                    </div>
                    <span className="text-[15px] font-medium text-slate-500 leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition / Trust */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-28 border-y border-slate-200 py-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Secure & Private</div>
              <div className="text-sm text-slate-500 font-medium">Enterprise-grade security</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">24/7 Support</div>
              <div className="text-sm text-slate-500 font-medium">Always here to help you</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Lightning Fast</div>
              <div className="text-sm text-slate-500 font-medium">Built for ultimate speed</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500 font-medium">Need more help? Contact our support team.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and applied to your next billing cycle.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.' },
              { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee on all premium plans. If you\'re not satisfied, we\'ll refund your payment in full.' },
              { q: 'Is there a long-term contract?', a: 'No, all our plans (except Custom Enterprise) are month-to-month or annual, and you can cancel at any time.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group">
                <div className="flex gap-5">
                  <div className="text-indigo-600 mt-1 shrink-0 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h4>
                    <p className="text-[15px] text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AI Studio</span>
          </div>
          <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed text-slate-500 font-medium">
            Empowering creators and healthcare professionals with next-generation artificial intelligence.
          </p>
          <div className="text-sm font-bold text-slate-400">
            &copy; {new Date().getFullYear()} AI Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
