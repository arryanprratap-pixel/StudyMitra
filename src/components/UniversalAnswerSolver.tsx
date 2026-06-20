import { useState, useEffect } from "react";
import { 
  Sparkles, MessageSquare, Copy, Download, Check, Save, Loader2, 
  Trash2, RefreshCw, Send, HelpCircle, BookOpen, Clock, BrainCircuit
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface UniversalAnswerSolverProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

interface RecentSearchItem {
  id: string;
  question: string;
  classNum: string;
  subject: string;
  answer: string;
  timestamp: string;
}

export default function UniversalAnswerSolver({ onSaveWork }: UniversalAnswerSolverProps) {
  const [question, setQuestion] = useState("");
  const [classNum, setClassNum] = useState("7");
  const [subject, setSubject] = useState("General / Auto-detect");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("student_search_solver_history");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading localStorage", err);
    }
  }, []);

  // Save searches array to localStorage
  const saveSearchesToStorage = (updated: RecentSearchItem[]) => {
    setRecentSearches(updated);
    try {
      localStorage.setItem("student_search_solver_history", JSON.stringify(updated));
    } catch (err) {
      console.error("Error setting localStorage", err);
    }
  };

  const handleSolve = async (e?: React.FormEvent, customQ?: string, customClass?: string, customSub?: string) => {
    if (e) e.preventDefault();
    
    const finalQ = customQ !== undefined ? customQ : question;
    const finalClass = customClass !== undefined ? customClass : classNum;
    const finalSub = customSub !== undefined ? customSub : subject;

    if (!finalQ.trim()) {
      setError("Please type or speak your homework doubt/question!");
      return;
    }

    // Check if we literally have this exact cached answer in recentSearches already to be instantaneous!
    const existing = recentSearches.find(
      (s) => s.question.toLowerCase().trim() === finalQ.toLowerCase().trim() && s.classNum === finalClass
    );
    if (existing && customQ !== undefined) {
      // If student clicked from recent searches, quickly load the cached answer!
      setQuestion(existing.question);
      setClassNum(existing.classNum);
      setSubject(existing.subject);
      setResult(existing.answer);
      setError("");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/universal-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: finalQ.trim(),
          classNum: finalClass,
          subject: finalSub
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to find answer. Please try again.");
      }

      const data = await response.json();
      const answer = data.text;
      setResult(answer);
      setIsDemo(!!data.isDemo);

      // Save to recent searches (max 10)
      const newItem: RecentSearchItem = {
        id: Date.now().toString(),
        question: finalQ.trim(),
        classNum: finalClass,
        subject: finalSub,
        answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Remove overlapping questions
      const cleaned = recentSearches.filter(
        (s) => s.question.toLowerCase().trim() !== finalQ.toLowerCase().trim() || s.classNum !== finalClass
      );
      saveSearchesToStorage([newItem, ...cleaned].slice(0, 10));

    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const success = await copyToClipboard(result);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const cleanFilename = `solved-${classNum}-subject-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Solved Answer",
      title: `Solved Q: ${question.length > 30 ? question.substring(0, 30) + '...' : question} (Class ${classNum})`,
      content: result,
      metadata: { question, classNum, subject }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setQuestion("");
    setResult("");
    setError("");
  };

  const handleClearHistory = () => {
    saveSearchesToStorage([]);
  };

  // Pre-loaded homework doubts for kids to click and try
  const sampleDoubts = [
    { text: "🧮 Divide 456 by 12 step by step", cls: "5", sub: "Maths" },
    { text: "🧬 Explain Photosynthesis diagram steps", cls: "7", sub: "Science" },
    { text: "📚 Write a letter to principal for sickeness leave", cls: "8", sub: "English" },
    { text: "⚛️ Derive Newton's second law: F = ma", cls: "10", sub: "Physics" },
    { text: "🏰 Explain causes of the French Revolution", cls: "9", sub: "History" }
  ];

  return (
    <div className="space-y-8" id="universal-doubt-solver-component">
      
      {/* Informative Header Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-150 dark:border-slate-805 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Universal Answer Solver 🧠✨
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
              Type, paste, or speak any homework question from any subject. Our system instantly answers using explanations custom-calibrated specifically for your grade standards!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Parameter Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-indigo-100 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-101 dark:border-slate-800 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Doubt Wizard
            </h3>

            <form onSubmit={(e) => handleSolve(e)} className="space-y-4">
              <div>
                <label htmlFor="solver-class-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                  Select your Classroom level:
                </label>
                <select
                  id="solver-class-select"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-indigo-455 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <option key={grade} value={grade.toString()}>
                      Class {grade} {grade <= 5 ? "(Primary)" : grade <= 8 ? "(Middle)" : "(High School)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="solver-subject-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                  Core Subject Area:
                </label>
                <select
                  id="solver-subject-select"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-indigo-455 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="General / Auto-detect">🔍 General / Auto-detect</option>
                  <option value="Mathematics">🧮 Mathematics</option>
                  <option value="Science">🧬 Science (PCB / Physics / Chemistry)</option>
                  <option value="SST / History / Geography">🏰 Social Science / History</option>
                  <option value="English Grammar & Writing">📚 English Grammar & Essay</option>
                  <option value="Computer Computer Science">💻 Computer & Coding</option>
                  <option value="Hindi / Sanskrit">🎨 Hindi / Sanskrit / Grammar</option>
                  <option value="General Knowledge">💡 General Knowledge</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="solver-question-input" className="block text-xs font-semibold text-slate-707 dark:text-slate-350 font-display">
                  Write your homework question:
                </label>
                <textarea
                  id="solver-question-input"
                  className="w-full px-4 py-3 min-h-[120px] rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-indigo-400 outline-none font-sans text-xs dark:bg-slate-800 dark:text-white resize-none"
                  placeholder="e.g., Why is ocean water salty? OR Solve x^2 - 5x + 6 = 0 step by step..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-55 dark:hover:bg-slate-850 font-display text-xs font-semibold transition-all cursor-pointer"
                >
                  Clear Fields
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-4 rounded-xl bg-indigo-505 hover:bg-indigo-600 text-white font-display text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-indigo-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Solving...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Solve Doubt!
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick doubts presets */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block font-display uppercase">
              💡 Spark some ideas:
            </span>
            <div className="flex flex-col gap-2">
              {sampleDoubts.map((doubt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(doubt.text.substring(2)); // truncate emoji
                    setClassNum(doubt.cls);
                    setSubject(doubt.sub);
                    handleSolve(undefined, doubt.text.substring(2), doubt.cls, doubt.sub);
                  }}
                  className="text-left px-3.5 py-2 hover:bg-white dark:hover:bg-slate-800 text-[11px] rounded-xl text-slate-600 dark:text-slate-300 font-medium transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm flex items-start gap-1.5"
                >
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>{doubt.text} (C-{doubt.cls})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Workspace & Recent Searches */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="solver-error">
              <span>⚠️</span>
              <div>
                <strong>Solver Error encountered:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-905 rounded-3xl border-3 border-indigo-100 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            
            {/* Toolbar Area */}
            <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-101 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-display">
                Answers Explanation Board 📋
              </h4>

              {result && (
                <div className="flex items-center gap-2" id="solver-actions-menu">
                  <button
                    onClick={handleCopy}
                    id="copy-solve-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-705 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Answer!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    id="download-solve-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-705 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    id="save-solve-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-955/40 dark:hover:bg-indigo-950 border border-indigo-202 dark:border-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved to Hub!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Markdown rendering of answer */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[500px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-indigo-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-indigo-400 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Decompressing wisdom engines... 🧠💥
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1.5">
                      Analyzing parameters for Class {classNum}. Breaking down steps and phrasing simple explanations...
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="solved-explain-rendered-markdown">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          This solution breakdown was curated in offline-calibration mode because live AI secrets are not active. To pose customized academic questions and receive real-time textbook analyses, set your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-[11px] text-amber-955 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold font-display text-indigo-650 dark:text-indigo-400 mt-2 mb-4 border-b border-indigo-100 dark:border-slate-800 pb-2 flex items-center gap-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-md font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-sm" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-805" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-slate-50 dark:bg-slate-800" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 text-left text-xs font-bold font-display text-slate-655 dark:text-slate-350 uppercase tracking-wider border-b border-slate-200 dark:border-slate-750" {...props} />,
                      tr: ({ ...props }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 divide-x divide-slate-100 dark:divide-slate-800" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-xs font-medium text-slate-707 dark:text-slate-300 border-b border-slate-101 dark:border-slate-800" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-indigo-900 dark:text-indigo-350 bg-indigo-50 dark:bg-indigo-950/40 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/30 dark:bg-indigo-955/15 pl-4 py-2 italic my-4 rounded-r-xl text-slate-600 dark:text-slate-350" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-3 opacity-65">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    ⚡
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-750 dark:text-slate-300 font-display">
                      Write your doubt or copy queries!
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                      Enter any question on the left panel, select your standard class, and witness customized school-style solutions dynamically!
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Searches Panel in Drawer or footer */}
            {recentSearches.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-t border-slate-150 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block font-display uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Recent Searches History:
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 font-display"
                  >
                    <Trash2 className="w-3 h-3" /> Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto">
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSolve(undefined, item.question, item.classNum, item.subject)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-805 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-[10px] font-semibold rounded-xl text-slate-600 dark:text-slate-300 max-w-[200px] truncate cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      title={`[Class ${item.classNum}] ${item.question}`}
                    >
                      <span className="text-indigo-400 text-xs">●</span>
                      <span className="truncate">C-{item.classNum}: {item.question}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
