'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { analyzeSymptoms, getMedicalHistory, verifyPrescription } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import {
  Stethoscope,
  Send,
  User,
  ShieldCheck,
  Download,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity,
  Plus,
  ArrowLeft,
  Printer,
  Zap,
  Info,
  Search,
  History as HistoryIcon,
  Layout,
  Code,
  Eye,
  Sparkles,
  Settings,
  MoreVertical,
  Cpu,
  Home
} from 'lucide-react';

// Professional Prescription Preview (Light Theme)
const ProfessionalPrescription = ({ consultation, innerRef }: { consultation: any, innerRef: React.RefObject<HTMLDivElement | null> }) => {
  if (!consultation) return null;
  const prescription = consultation.doctorPrescription || consultation.aiPrescription;

  return (
    <div className="bg-white text-slate-900 p-0 font-sans relative flex flex-col w-full max-w-[720px] mx-auto min-h-[900px] rounded-2xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="p-10 pb-8 flex justify-between items-start border-b border-slate-100 bg-slate-50/50">
        <div className="w-[65%]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-indigo-950 text-xl font-bold tracking-tight">Dr. AI Assistant</h1>
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mb-3">MD, PhD (Medical Intelligence) • Reg: AI-2026-04</div>
          <div className="text-[12px] text-slate-500 leading-relaxed font-medium">
            Senior Clinical Consultant, AI Medical Center<br />
            Digital Health Research Institute, Palo Alto, CA
          </div>
        </div>

        <div className="w-[30%] text-right">
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-bold mb-3 inline-block">
            Internal Medicine
          </div>
          <div className="text-[11px] text-slate-400 font-bold leading-tight">
            Mon - Fri: 09:00 - 18:00<br />
            +1-555-0199
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-indigo-50/50 px-10 py-4 flex border-b border-slate-100 text-[11px] font-bold text-slate-600">
        <div className="flex-1">Patient: <span className="text-slate-950">Test User</span></div>
        <div className="w-32 text-right">Date: <span className="text-slate-950">{new Date(consultation.createdAt).toLocaleDateString()}</span></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex relative">
        <div className="w-[32%] border-r border-slate-100 p-8 space-y-8 bg-slate-50/30">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Symptoms</h3>
            <p className="text-[13px] font-medium leading-relaxed text-slate-600 border-l-2 border-indigo-400 pl-4 capitalize">
              {consultation.symptoms}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Recommended Tests</h3>
            <ul className="text-[12px] font-semibold text-slate-700 space-y-2.5">
              {(consultation.diagnosticTests || []).map((test: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-indigo-500 mt-1">•</span> {test}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-[68%] p-10 relative">
          <div className="text-5xl font-serif font-bold text-indigo-900/5 mb-6">Rx</div>

          <div className="space-y-8 min-h-[400px]">
            {(prescription?.medications || []).map((med: any, i: number) => (
              <div key={i} className="pl-5 border-l border-slate-100">
                <div className="flex items-baseline gap-2.5 mb-1">
                  <span className="text-base font-bold text-indigo-950">{i + 1}. {med.name}</span>
                  <span className="text-[10px] font-bold text-slate-400">({med.dosage})</span>
                </div>
                <div className="flex items-center gap-5 text-[12px] font-medium text-slate-500 ml-5">
                  <span className="text-indigo-600 font-semibold">{med.frequency}</span>
                  <span className="text-slate-200 font-normal">|</span>
                  <span>{med.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-dashed border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 mb-3 text-left uppercase tracking-wider">Physician Notes</h4>
            <p className="text-[12px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
              {prescription?.instructions || "Ensure strict adherence to the dosage. Monitor for any allergic reactions."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 text-white p-6 text-center text-[10px] font-bold tracking-[0.2em] uppercase">
        Digital Medical Records • Secured by MediAI
      </div>
    </div>
  );
};

export default function MedicalAi() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [currentConsultation, setCurrentConsultation] = useState<any>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userId] = useState('user-123');
  const [downloading, setDownloading] = useState(false);

  const prescriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getMedicalHistory(userId);
      setConsultations(data);
    } catch (error) {
      console.error('Failed to fetch medical history', error);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const result = await analyzeSymptoms(userId, symptoms);
      setCurrentConsultation(result.consultation);
      setConsultations([result.consultation, ...consultations]);
      setSymptoms('');
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const data = {
        doctorPrescription: currentConsultation.aiPrescription,
        doctorComments: 'Verified by Dr. AI Assistant.',
        status: 'APPROVED'
      };
      const result = await verifyPrescription(id, data);
      setCurrentConsultation(result);
      fetchHistory();
    } catch (error) {
      console.error('Approval failed', error);
    }
  };

  const downloadPrescription = async () => {
    if (!currentConsultation) return;
    setDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const prescription = currentConsultation.doctorPrescription || currentConsultation.aiPrescription;
      const primaryColor = [30, 58, 138];

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 2, 'F');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Dr. AI Assistant', 15, 20);
      doc.setFontSize(8);
      doc.text('Certified AI Medical Specialist', 15, 25);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(9);
      doc.text('MD, PhD (Medical Intelligence) • Reg: AI-2026-04', 15, 32);
      doc.save(`Prescription-MediAI-${currentConsultation.id.substring(0, 8)}.pdf`);
    } catch (error) {
      console.error('PDF failed', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-700 font-sans selection:bg-indigo-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-sm shadow-indigo-100">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">MediAI</span>
          </Link>
          <Link href="/" className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400" title="Back to Home">
            <Home className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultations</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-bold text-indigo-600">
              <Sparkles className="w-2.5 h-2.5" /> Medical AI
            </div>
          </div>

          <div className="space-y-2">
            {consultations.length === 0 ? (
              <div className="text-center py-10 text-slate-300">
                <HistoryIcon className="w-10 h-10 mx-auto mb-3" />
                <p className="text-[11px]">No history found</p>
              </div>
            ) : consultations.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentConsultation(item)}
                className={`w-full group text-left p-3 rounded-xl transition-all flex items-center gap-3 ${currentConsultation?.id === item.id
                    ? 'bg-indigo-50 border border-indigo-100'
                    : 'hover:bg-slate-50 border border-transparent'
                  }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${currentConsultation?.id === item.id
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-50 text-slate-400'
                  }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 truncate">
                  <div className={`text-[13px] font-semibold truncate max-w-[150px] ${currentConsultation?.id === item.id ? 'text-indigo-700' : 'text-slate-700'
                    }`}>
                    {item.symptoms}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                {item.status === 'APPROVED' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button className="flex items-center gap-3 w-full p-2.5 hover:bg-slate-50 rounded-lg transition-all text-sm text-slate-500">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <div className="flex items-center justify-between p-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Test User</span>
            </div>
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50">

        {/* Top Navigation Bar */}
        <header className="h-[72px] bg-white border-b border-slate-100 px-6 flex items-center justify-between">
          <div className="flex items-center gap-5 flex-1">
            <HistoryIcon className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" />
            <div className="relative flex-1 max-w-[500px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Describe symptoms... (e.g. sore throat, fever)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="gradient-bg text-white px-7 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setIsDoctor(false)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${!isDoctor ? 'bg-white text-slate-700 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button onClick={() => setIsDoctor(true)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${isDoctor ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <Code className="w-3.5 h-3.5" /> Doctor Mode
              </button>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!currentConsultation ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl w-full text-center mt-16"
              >
                <div className="w-24 h-24 gradient-bg rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-100 mb-10">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-5 tracking-tight">Ready for Assessment?</h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-14">
                  Enter your symptoms above and watch our AI Agent analyze, assess, and suggest a clinical path with professional precision.
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-7 bg-white border border-slate-100 rounded-2xl group card-hover">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-all">
                      <Layout className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-[13px] font-bold text-slate-900 mb-1">Smart Assessment</div>
                    <div className="text-[11px] text-slate-400">UI-driven clinical logic</div>
                  </div>
                  <div className="p-7 bg-white border border-slate-100 rounded-2xl group card-hover">
                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-100 transition-all">
                      <Code className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="text-[13px] font-bold text-slate-900 mb-1">AI Diagnostics</div>
                    <div className="text-[11px] text-slate-400">Deep symptom analysis</div>
                  </div>
                  <div className="p-7 bg-white border border-slate-100 rounded-2xl group card-hover">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-all">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-[13px] font-bold text-slate-900 mb-1">Doctor Verification</div>
                    <div className="text-[11px] text-slate-400">Authenticated reports</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full"
              >
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentConsultation(null)} className="p-2.5 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all border border-slate-200"><ArrowLeft className="w-5 h-5" /></button>
                    <h2 className="text-2xl font-bold text-slate-900">Clinical Assessment</h2>
                  </div>
                  {currentConsultation.status === 'APPROVED' && (
                    <button onClick={downloadPrescription} disabled={downloading} className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50">
                      <Printer className="w-4 h-4" /> Download PDF
                    </button>
                  )}
                </div>

                <div className="p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                  <ProfessionalPrescription consultation={currentConsultation} innerRef={prescriptionRef} />
                </div>

                <div className="max-w-[720px] mx-auto">
                  {isDoctor && currentConsultation.status === 'PENDING' ? (
                    <button onClick={() => handleApprove(currentConsultation.id)} className="w-full gradient-bg text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95">
                      <ShieldCheck className="w-7 h-7" /> Authorize Clinical Record
                    </button>
                  ) : currentConsultation.status === 'APPROVED' && (
                    <div className="w-full p-10 bg-emerald-50 border border-emerald-100 rounded-3xl text-center">
                      <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold text-lg mb-2"><CheckCircle2 className="w-6 h-6" /> Authenticated by Physician</div>
                      <p className="text-slate-500 mb-8 text-base">This clinical report has been digitally signed and is now a valid medical record.</p>
                      <button onClick={downloadPrescription} className="w-full max-w-sm mx-auto gradient-bg text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                        <Download className="w-5 h-5" /> Download Final PDF
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
