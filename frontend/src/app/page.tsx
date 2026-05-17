'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  Stethoscope,
  Zap,
  Shield,
  Cpu,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Code2,
  Users,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a2e] font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">AI Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#services" className="nav-link hover:text-slate-900 transition-colors">Services</Link>
            <Link href="#features" className="nav-link hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#about" className="nav-link hover:text-slate-900 transition-colors">About Us</Link>
            <Link href="/pricing" className="nav-link hover:text-slate-900 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#services" className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="#services" className="gradient-bg px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 px-6 overflow-hidden">
        {/* Soft gradient blobs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-100/50 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-600 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Welcome to the future of AI tools</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900"
          >
            Empower Your Workflow <br className="hidden md:block" />
            with <span className="gradient-text">Advanced AI Agents</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Experience next-generation automation. From seamless website replication to intelligent medical diagnostics — our AI models are built for maximum efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="#services" className="w-full sm:w-auto gradient-bg px-8 py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-200 text-lg">
              Explore Services <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto bg-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all border border-slate-200 text-lg text-slate-700">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 section-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-slate-900">Our <span className="gradient-text">Services</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Powerful AI solutions designed to transform how you build, diagnose, and create.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Website Replication Card */}
            <Link href="/replication">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group h-full bg-white p-8 rounded-3xl border border-slate-100 card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -z-10 group-hover:bg-indigo-100/60 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 flex items-center justify-between">
                  Website Replication
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1" />
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Enter any URL and watch our AI extract the UI architecture, map components, and generate production-ready code in seconds.
                </p>
              </motion.div>
            </Link>

            {/* Medical AI Card */}
            <Link href="/medical">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group h-full bg-white p-8 rounded-3xl border border-slate-100 card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50 rounded-full blur-3xl -z-10 group-hover:bg-teal-100/60 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 text-teal-600 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 flex items-center justify-between">
                  Medical AI Assistant
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-colors group-hover:translate-x-1" />
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Advanced clinical decision support system. Analyze symptoms, review medical history, and get AI-driven diagnostic insights securely.
                </p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-slate-900">Platform <span className="gradient-text">Features</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Built with cutting-edge technology to ensure unmatched performance and reliability.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Optimized infrastructure ensuring millisecond response times.", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption protecting your sensitive data.", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: Cpu, title: "Advanced Models", desc: "Powered by the latest generation of LLMs for high accuracy.", color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: Clock, title: "24/7 Availability", desc: "Highly available systems with 99.99% uptime guarantee.", color: "text-cyan-600", bg: "bg-cyan-50" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 section-alt relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">About <span className="gradient-text">Us</span></h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              We are a team of visionary engineers and researchers dedicated to making advanced artificial intelligence accessible, practical, and highly secure. Our mission is to bridge the gap between complex AI models and everyday utility.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Whether you are a developer looking to streamline your workflow or a healthcare professional seeking reliable digital assistance, our platform is built to elevate your capabilities.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl text-center shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">10k+</div>
                <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Users</div>
              </div>
              <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl text-center shadow-sm">
                <div className="text-3xl font-bold text-teal-600">99%</div>
                <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Accuracy</div>
              </div>
              <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl text-center shadow-sm">
                <div className="text-3xl font-bold text-amber-500">50+</div>
                <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Countries</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-square w-full max-w-sm mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-cyan-50 border border-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(79,70,229,0.08)_0%,_transparent_60%)]" />
              <div className="text-center relative z-10">
                <Cpu className="w-20 h-20 text-indigo-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">AI Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-sm shadow-indigo-100">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AI Studio</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} AI Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
