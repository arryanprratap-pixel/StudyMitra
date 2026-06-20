import { useState } from "react";
import { BookOpen, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface NotesGeneratorProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

export default function NotesGenerator({ onSaveWork }: NotesGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [classNum, setClassNum] = useState("7");
  const [subject, setSubject] = useState("Science");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic to learn about.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, classNum, subject, length }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate notes. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanFilename = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-class-${classNum}-notes-${dateStr}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Note",
      title: `${subject} Notes: ${topic} (Class ${classNum})`,
      content: result,
      metadata: { topic, classNum, subject, length },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sampleTopics = [
    { topic: "Photosynthesis", class: "7", subject: "Science" },
    { topic: "Water Cycle", class: "6", subject: "Science" },
    { topic: "Newton's Laws of Motion", class: "9", subject: "Science" },
    { topic: "The French Revolution", class: "9", subject: "Social Studies" },
    { topic: "Fractions and Decimals", class: "6", subject: "Mathematics" },
  ];

  return (
    <div className="space-y-8" id="notes-generator">
      {/* Introduction Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-sky-150 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Simple Notes Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Type in any topic, choose your class and subject, and get simple student-level notes with bullet points, examples, and fun facts!
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-yellow-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3">
            Notes Settings ✏️
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                What topic do you want to learn?
              </label>
              <input
                type="text"
                id="topic-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-sky-400 dark:focus:border-sky-500 font-sans text-sm outline-none dark:bg-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                placeholder="e.g., Solar System, Photosynthesis, Magnets"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="class-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                  Your Class
                </label>
                <select
                  id="class-select"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-sky-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer transition-all"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <option key={grade} value={grade.toString()}>
                      Class {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                  Subject
                </label>
                <select
                  id="subject-select"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-sky-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer transition-all"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="Science">Science</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="English">English</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-2 font-display">
                Notes Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`py-2 rounded-xl text-xs font-medium font-display capitalize border-2 cursor-pointer transition-all ${
                      length === l
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-display font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#047857] disabled:opacity-50 mt-2`}
              id="notes-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Writing Notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Make My Notes!
                </>
              )}
            </button>
          </form>

          {/* Quick Ideas Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider block mb-2.5 font-display uppercase">
              💡 Need an Idea? Try these:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleTopics.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(sample.topic);
                    setClassNum(sample.class);
                    setSubject(sample.subject);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-medium"
                >
                  {sample.topic} (Cl-{sample.class})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Screen Column */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3 items-center" id="notes-error">
              <span className="text-xl">⚠️</span>
              <div>
                <strong className="block font-bold">Oops! Something went wrong</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-sky-150 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            {/* Header Control Panel */}
            <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b-2 border-slate-100 dark:border-slate-800/85 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-display">
                Generated Note Board 📝
              </h4>
              {result && (
                <div className="flex items-center gap-2" id="notes-action-buttons">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-750 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Copy Markdown To Clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-750 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Download notes file (.txt)"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                    title="Save to your recent activity history"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Hub</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Content Board */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-yellow-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-yellow-500 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 font-display">
                      Reading Textbook... 📚
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our school buddy is compiling information from the textbook and putting it in super-simple words for Class {classNum}!
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="notes-rendered-output">
                  <ReactMarkdown 
                    components={{
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold font-display text-sky-600 dark:text-sky-400 mt-2 mb-4 border-b border-sky-100 dark:border-slate-800 pb-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-md font-bold font-display text-slate-800 dark:text-slate-100 mt-4 mb-2" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed font-sans" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5" {...props} />,
                      li: ({ ...props }) => <li className="text-slate-600 dark:text-slate-350" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-slate-900 dark:text-white bg-yellow-50 dark:bg-yellow-950/30 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/15 pl-4 py-2 italic my-4 rounded-r-xl" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    ✏️
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-705 dark:text-slate-300 font-display">
                      Your Desk is Empty!
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Choose settings on the left and click "Make My Notes!" to write amazing school study sheets instantly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
