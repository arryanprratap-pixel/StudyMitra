import { useState } from "react";
import { FileText, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface ProjectFormatMakerProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

function getLocalProjectFormat(topic: string, subject: string, classNum: string): string {
  const finalTopic = topic.trim() || `Amazing ${subject} Exploration`;
  return `# 🎨 Creative School Project Guide: ${finalTopic}
*Subject Category: ${subject} • Tailored for Class ${classNum} Standard • Local Calibration Mode*

## 📁 1. Project Cover Page Guidelines:
- **School Name**: [Write Your Registered School Name]
- **Project Topic Title**: Investigated Analysis of "${finalTopic}"
- **Course Subject**: ${subject}
- **Submitted By**: [Your Name], Class ${classNum}
- **Submitted To**: [Your Class Teacher's Name]

---

## 📝 2. Outline & Introduction:
This project aims to investigate the deep conceptual features behind **${finalTopic}**. We explore how its rules apply to daily scenarios, execute mock calculations where appropriate, and summarize core curriculum points.

### 🎯 Core Objectives:
1. To understand the primary laws governing ${finalTopic}.
2. To compile neat, structured references suitable for Class ${classNum} students.
3. To build interactive, hands-on craft representations.

---

## 🛠️ 3. Materials & Craft Tools Required:
- Clean white chart papers or project catalog files.
- Sketch markers, rulers, pencil set, and glues.
- Grade ${classNum} ${subject} textbook references.
- Printed maps, diagram drawings, or hand-painted sketches showing cycles.

---

## 👣 4. Step-by-Step Layout Instructions:
- **Step 1: Front Page Design**: Create an elegant double border with light geometric leaves or stars. Use large bold fonts for the title.
- **Step 2: Introduction**: Lay out a paragraph summarizing why learning ${finalTopic} matters.
- **Step 3: Core Diagram Page**: Draw a neat, labeled sketch (e.g., flowchart or step-by-step cycle) representing the concept inputs and results.
- **Step 4: Practical Findings/Case Study**: Write 3 points detailing how we observe this concept in nature or local neighborhoods.
- **Step 5: Learnings Summary**: Outline what you figured out while preparing this project layout!

---

## 🏆 5. Summary & Self-Evaluation:
Completing this CBSE-aligned project format proved that studying **${finalTopic}** teaches us practical, long-term skills in ${subject}. Consistent efforts, neat margins, and bulleted text keys deliver excellent classroom grades!`;
}

export default function ProjectFormatMaker({ onSaveWork }: ProjectFormatMakerProps) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Science");
  const [classNum, setClassNum] = useState("7");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalTopic = topic.trim();
    if (!finalTopic) {
      finalTopic = `Class ${classNum} ${subject} Practical File`;
      setTopic(finalTopic);
    }

    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/project-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic, subject, classNum }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to make project format. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Project Format API failed, returning locally generated layout:", err);
      const generated = getLocalProjectFormat(finalTopic, subject, classNum);
      setResult(generated);
      setIsDemo(true);
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
    const cleanFilename = `project-format-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${dateStr}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Project Format",
      title: `Project: ${topic} (${subject}) - Class ${classNum}`,
      content: result,
      metadata: { topic, subject, classNum },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sampleProjects = [
    { topic: "Solar Cooking Box Model", subject: "Science" },
    { topic: "Ancient Indus Valley Civilization", subject: "Social Studies" },
    { topic: "Simple Electromagnetic Crane", subject: "Science" },
    { topic: "Climate Change & Local Forests", subject: "Geography" }
  ];

  return (
    <div className="space-y-8" id="project-format-maker">
      {/* Intro box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-150 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-955 dark:text-white font-display">
              School Project Format Maker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stuck on science models, history scrapbooks, or civics write-ups? Get standard lists of cover templates, intro segments, material logs, and sequential instructions!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left inputs */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-indigo-150 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-905 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3">
            Project Outlines 📂
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="proj-topic-input" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                What is your project topic / title?
              </label>
              <input
                type="text"
                id="proj-topic-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-indigo-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                placeholder="e.g., Simple Lemon Battery, Solar Oven"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="proj-subject-select" className="block text-xs font-semibold text-slate-755 dark:text-slate-355 mb-1.5 font-display">
                Subject
              </label>
              <select
                id="proj-subject-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-indigo-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Science">Science (Physics/Chem/Bio)</option>
                <option value="Social Studies">Social Studies (History/Civics)</option>
                <option value="Geography">Geography & Environment</option>
                <option value="English">English / Language Arts</option>
                <option value="Mathematics">Mathematics Projects</option>
              </select>
            </div>

            <div>
              <label htmlFor="proj-class-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-355 mb-1.5 font-display">
                Your Class
              </label>
              <select
                id="proj-class-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-indigo-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-550 hover:bg-indigo-600 text-white font-display font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-indigo-750 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Gathering Materials...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Layout My Project!
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestion Card */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-2.5 font-display uppercase">
              🧪 Popular School Ideas:
            </span>
            <div className="space-y-1.5 flex flex-col">
              {sampleProjects.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setSubject(item.subject);
                  }}
                  className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors cursor-pointer text-slate-655 dark:text-slate-300 font-medium truncate"
                >
                  {item.topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output details */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-955/30 text-rose-800 dark:text-rose-300 border-2 border-rose-220 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="project-error">
              <span>⚠️</span>
              <div>
                <strong>Error formatting project: </strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-indigo-150 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            {/* Header toolbar panel */}
            <div className="bg-slate-50 dark:bg-slate-855 px-6 py-4 border-b-2 border-slate-101 dark:border-slate-805 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-202 font-display">
                Project Format Board 📖
              </h4>

              {result && (
                <div className="flex items-center gap-2" id="project-actions">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-101 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Design!</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-101 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-101 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-220 dark:border-indigo-800 text-xs font-semibold text-indigo-705 dark:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved Format!</span>
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

            {/* Content viewport */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-indigo-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-yellow-550 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Gathering Chart Paper... ✂️
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our school consultant is outlining exact materials, cover page titles, and assembly instructions perfect for class submissions!
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="project-rendered-content">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          This school project guide was composed in offline-calibration mode because live AI secrets are not active. To build customized, real-time files on any class topic, provide your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-950 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-xl font-bold font-display text-indigo-650 dark:text-indigo-400 mt-2 mb-4 border-b border-indigo-100 dark:border-slate-800 pb-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-md font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 mt-4 mb-2" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-705 dark:text-slate-300 leading-relaxed font-sans" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5" {...props} />,
                      li: ({ ...props }) => <li className="text-slate-655 dark:text-slate-350" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-slate-900 dark:text-white bg-indigo-50 dark:bg-indigo-950/20 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/15 pl-4 py-2 italic my-4 rounded-r-xl" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    📁
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-705 dark:text-slate-300 font-display">
                      Project design is empty!
                    </h5>
                    <p className="text-xs text-slate-450 max-w-xs mt-1">
                      Choose settings and click "Layout My Project!" to get step-by-step layout formats instantly.
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
