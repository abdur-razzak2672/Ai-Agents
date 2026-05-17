'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateFromUrl, getHistory, updateGeneration } from '@/lib/api';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  History,
  Layout,
  Code2,
  Eye,
  Save,
  Globe,
  Info,
  Mail,
  Phone,
  Terminal,
  Cpu,
  Sparkles,
  AlertCircle,
  X,
  Stethoscope,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function ReplicationPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [generation, setGeneration] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    'Analyzing URL & Metadata...',
    'Extracting UI Architecture...',
    'Identifying Color Palettes...',
    'Mapping Tailwind Components...',
    'Generating Premium Code...',
    'Finalizing Design Layout...'
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setElapsedTime(0);
      setLoadingStep(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setGeneration(null);
    try {
      const result = await generateFromUrl(url);
      setGeneration(result);
      fetchHistory();
    } catch (err: any) {
      console.error('Generation failed', err);
      setError(
        err.response?.status === 429
          ? 'Your AI limit has been reached. Please check your API quota or try again later.'
          : 'Something went wrong during generation. Please verify the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generation) return;
    try {
      await updateGeneration(generation.id, generation.generatedCode);
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar - History */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-white border-r border-slate-100 flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-sm shadow-indigo-100">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">AI Studio</h1>
              </Link>
            </div>

            <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects</span>
              <Link
                href="/medical"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-all text-[10px] font-semibold"
              >
                <Stethoscope className="w-3 h-3" /> Medical AI
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGeneration(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-center gap-3 ${generation?.id === item.id
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${generation?.id === item.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-sm font-medium truncate text-slate-700">{item.url}</div>
                    <div className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-slate-100 flex items-center px-6 justify-between z-10">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
            >
              <History className="w-5 h-5" />
            </button>

            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter website URL (e.g. https://apple.com)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-sm text-slate-700 placeholder-slate-400"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="gradient-bg px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{loading ? 'Analyzing...' : 'Generate'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setView('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button
                onClick={() => setView('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'code'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                <Code2 className="w-4 h-4" /> Code
              </button>
            </div>

            {generation && (
              <button
                onClick={handleSave}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-slate-500"
              >
                <Save className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-hidden flex">
          {generation ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-5 overflow-hidden">
                <div className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                  {view === 'preview' ? (
                    <div className="w-full h-full bg-white overflow-auto">
                      <iframe
                        title="preview"
                        className="w-full h-full border-none"
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <script src="https://cdn.tailwindcss.com"></script>
                              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                              <style>
                                body { font-family: 'Inter', sans-serif; }
                              </style>
                            </head>
                            <body>
                              <div id="root"></div>
                              <script>
                                document.body.innerHTML = \`${generation.generatedCode}\`;
                              </script>
                            </body>
                          </html>
                        `}
                      />
                    </div>
                  ) : (
                    <Editor
                      height="100%"
                      defaultLanguage="html"
                      theme="vs-light"
                      value={generation.generatedCode}
                      onChange={(value) => setGeneration({ ...generation, generatedCode: value })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 20 },
                        roundedSelection: true,
                        cursorStyle: 'line',
                        lineNumbers: 'on',
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden'
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Company Info Panel */}
              <div className="h-56 px-5 pb-5 grid grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><Globe className="w-4 h-4 text-blue-600" /></div>
                    <h3 className="font-semibold text-slate-700">Company</h3>
                  </div>
                  <p className="text-lg font-bold text-slate-900 mb-1">{generation.companyName || 'Unknown'}</p>
                  <p className="text-xs text-slate-400 line-clamp-3">{generation.about || 'No description available.'}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg"><Info className="w-4 h-4 text-indigo-600" /></div>
                    <h3 className="font-semibold text-slate-700">Context & Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Contact Email</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3 h-3" /> {generation.contactInfo?.email || 'Not found'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Phone Number</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3 h-3" /> {generation.contactInfo?.phone || 'Not found'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
              <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-100">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Ready to Replicate?</h2>
              <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                Enter a website URL above and watch our AI Agent analyze, extract, and recreate the design with professional precision.
              </p>

              <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-3xl">
                {[
                  { icon: <Layout />, label: 'Smart UI Extraction' },
                  { icon: <Code2 />, label: 'Code Generation' },
                  { icon: <Terminal />, label: 'Live Editor' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <div className="relative w-40 h-40 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-indigo-100 border-t-indigo-600"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-cyan-100 border-b-cyan-500"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
                  <div className="text-xs font-mono text-slate-400 mt-2">{elapsedTime}s</div>
                </div>
              </div>

              <motion.div
                key={loadingStep}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold mb-2 text-slate-900 flex items-center gap-2">
                  Agent is Thinking <span className="animate-bounce">...</span>
                </h3>
                <p className="text-indigo-600 font-medium tracking-wide flex items-center justify-center gap-2">
                  <Terminal className="w-4 h-4" /> {loadingSteps[loadingStep]}
                </p>
                <p className="text-slate-400 text-sm mt-4 italic">Please wait, analyzing {url}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Modal */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-slate-900">Generation Halted</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {error}
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setError(null)}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold transition-all text-slate-700"
                  >
                    Dismiss
                  </button>
                  <a
                    href="https://ai.studio/projects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Manage Quota in AI Studio
                  </a>
                </div>

                <button
                  onClick={() => setError(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
