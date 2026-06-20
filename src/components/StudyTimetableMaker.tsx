import { useState } from "react";
import { CalendarRange, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface StudyTimetableMakerProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

function getLocalTimetable(schoolTime: string, subjects: string, classNum: string): string {
  const normTime = schoolTime.trim() || "8:00 AM to 2:00 PM";
  const finalSubs = subjects.trim() || "Science, Mathematics, Social Studies";
  const primarySubject = finalSubs.split(",")[0] || "Major Subjects";
  const secondarySubject = finalSubs.split(",")[1] || "Revision Core";

  return `# 🗓️ Class-Calibrated Personal Study Timetable
*Tailored for Class ${classNum} • School Hours: ${normTime} • Local Calibration Mode*

Here is your highly custom, balanced, and productive daily schedule built to cover **${finalSubs}** while securing healthy rest, hobbies, and sports!

| Time Slot | Scheduled Focus | Quick Tips & Goals |
| :--- | :--- | :--- |
| **07:00 AM - 08:00 AM** | Wake Up & School Prep☀️ | Stretch, drink warm waters, and eat a healthy breakfast! |
| **08:00 AM - 02:00 PM** | Academic School Hours 🏫 | Focus carefully on live explanations and clarify your doubts during active hours. |
| **02:00 PM - 03:00 PM** | Return Home & Lunch Break 🍽️ | Enjoy a nutritious hot lunch and rest your mind. |
| **03:00 PM - 04:00 PM** | Hobby Play & Sports Activity ⚽ | Unwind! Go outdoors, draw sketchbooks, or ride bikes. |
| **04:00 PM - 05:00 PM** | **Self-Study Block 1: Homework Tasks** 📝 | Prioritize **${primarySubject}** tasks. Clear up assignment lists! |
| **05:00 PM - 05:30 PM** | Healthy Refreshment Break 🥛 | Enjoy milk or orange fruits to re-energize. |
| **05:30 PM - 06:30 PM** | **Self-Study Block 2: Chapter Study** 📚 | Revision focus on **${secondarySubject}**. Memorize glossary lists. |
| **06:30 PM - 07:15 PM** | Interactive Quiz / Self-Review 🎯 | Play 1 mini practice MCQ session to check your recall. |
| **07:15 PM - 08:30 PM** | Screen Time / Family Talk 📺 | Relax with your brothers, sisters, and parents. |
| **08:30 PM - 09:15 PM**| Calming Family Dinner 🍲| Enjoy clean food and pack your school bag for tomorrow. |
| **09:15 PM - 09:30 PM**| Wash & Ready for Bed 🦷| Brush teeth, shut electronic screen displays, and relax. |
| **09:30 PM - 07:00 AM**| Sweet Rest Sleep Block 😴| Secure a full 9-hour restorative sleep to stay glowing! |

---

### 🏆 Study Counselor Advisory:
> "Dear Class ${classNum} student, consistency represents your main key! Study in short, focused blocks of 20-30 minutes, and reward yourself with a little stretch or water after every session. You possess the direct strength to achieve your absolute highest goals!"`;
}

export default function StudyTimetableMaker({ onSaveWork }: StudyTimetableMakerProps) {
  const [schoolTime, setSchoolTime] = useState("8:00 AM to 2:00 PM");
  const [subjects, setSubjects] = useState("Science, Mathematics");
  const [classNum, setClassNum] = useState("7");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolTime.trim() || !subjects.trim()) {
      setError("Please fill in both school hours and subjects.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolTime, subjects, classNum }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to make study routine. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Timetable API call failed. Generating localized template fallback:", err);
      const generated = getLocalTimetable(schoolTime, subjects, classNum);
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
    const cleanFilename = `daily-study-timetable-${dateStr}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Timetable",
      title: `Timetable (Class ${classNum}, School: ${schoolTime})`,
      content: result,
      metadata: { schoolTime, subjects, classNum },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const routines = [
    { schoolTime: "8:00 AM to 2:00 PM", subjects: "Maths, Science, English" },
    { schoolTime: "9:00 AM to 3:00 PM", subjects: "Social Studies, Science" },
    { schoolTime: "7:30 AM to 1:30 PM", subjects: "Maths, Geography, Regional Language" }
  ];

  return (
    <div className="space-y-8" id="study-timetable-maker">
      {/* Intro box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-violet-150 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-100 text-violet-605 dark:bg-violet-950 dark:text-violet-400">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-955 dark:text-white font-display">
              Study Timetable Builder ⏰
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your school hours and subjects you need help with. Get a beautiful, balanced daily study routine filled with play, snacks, and deep work slots!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-violet-150 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-905 dark:text-white font-display border-b border-slate-101 dark:border-slate-800 pb-3">
            Routine Setting 🗓️
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="school-time-input" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                What are your School / Coaching Hours?
              </label>
              <input
                type="text"
                id="school-time-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-violet-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                placeholder="e.g., 8:00 AM to 2:00 PM, 9 AM to 3:30 PM"
                value={schoolTime}
                onChange={(e) => setSchoolTime(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="routine-subjects-input" className="block text-xs font-semibold text-slate-755 dark:text-slate-350 mb-1.5 font-display">
                Subjects you want to self-study:
              </label>
              <input
                type="text"
                id="routine-subjects-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-violet-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                placeholder="e.g., Science, Mathematics, English"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="routine-class-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-355 mb-1.5 font-display">
                Your Class
              </label>
              <select
                id="routine-class-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-violet-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
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
              className="w-full py-3.5 px-4 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-display font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-violet-750 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Balancing Routine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Create Daily Timetable!
                </>
              )}
            </button>
          </form>

          {/* Quick presets */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-2.5 font-display uppercase">
              ⏰ Choose Quick Routine:
            </span>
            <div className="space-y-2">
              {routines.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSchoolTime(item.schoolTime);
                    setSubjects(item.subjects);
                  }}
                  className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-slate-101 dark:bg-slate-800 dark:hover:bg-slate-755 border border-slate-202 dark:border-slate-700 rounded-xl text-xs transition-colors cursor-pointer text-slate-655 dark:text-slate-300 font-medium truncate"
                >
                  🏫 School: {item.schoolTime}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-955/35 text-rose-800 dark:text-rose-300 border-2 border-rose-220 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="timetable-error">
              <span>⚠️</span>
              <div>
                <strong>Error Creating Routine: </strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-905 rounded-3xl border-3 border-violet-150 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            {/* Toolbar panel */}
            <div className="bg-slate-50 dark:bg-slate-855 px-6 py-4 border-b-2 border-slate-101 dark:border-slate-805 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-202 font-display">
                Your Balanced Routine Chart 🗓️
              </h4>

              {result && (
                <div className="flex items-center gap-2" id="timetable-actions">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-101 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-202 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-450">Copied Table!</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-101 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-202 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-101 dark:bg-violet-955 dark:hover:bg-violet-900 border border-violet-202 dark:border-violet-800 text-xs font-semibold text-violet-705 dark:text-violet-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved Routine!</span>
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

            {/* Display space */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-violet-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-yellow-550 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Harmonizing Schedule... ⏰
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our school counselor is organizing subjects, scheduling refreshing play brakes, and generating the perfect student table routine!
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="timetable-rendered-content">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          This study routine was dynamically formatted in offline-calibration mode because live AI secrets are not active. To generate fully personalized tables with customized subjects, enter a <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-950 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-xl font-bold font-display text-violet-605 dark:text-violet-400 mt-2 mb-4 border-b border-violet-100 dark:border-slate-800 pb-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-md font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-705 dark:text-slate-300 leading-relaxed font-sans" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-805" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-slate-50 dark:bg-slate-850" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 text-left text-xs font-bold font-display text-slate-655 dark:text-slate-350 uppercase tracking-wider border-b border-slate-200 dark:border-slate-750" {...props} />,
                      tr: ({ ...props }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 divide-x divide-slate-100 dark:divide-slate-855" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-xs font-medium text-slate-707 dark:text-slate-300 border-b border-slate-100 dark:border-slate-855" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-slate-905 dark:text-white bg-violet-50 dark:bg-violet-955/20 px-1 rounded animate-pulse" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-violet-400 bg-violet-50/50 dark:bg-violet-955/15 pl-4 py-2 italic my-4 rounded-r-xl" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    ⏰
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-705 dark:text-slate-300 font-display">
                      Routine list is clean!
                    </h5>
                    <p className="text-xs text-slate-450 max-w-xs mt-1">
                      Choose settings on the left and click "Create Daily Timetable!" to draft school routines automatically.
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
