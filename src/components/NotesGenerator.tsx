import { useState } from "react";
import { BookOpen, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile, getClassLevelStyle } from "../utils";
import { SavedWorkItem } from "../types";

interface NotesGeneratorProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

function getLocalNotes(topic: string, classNum: string, subject: string, length: "short" | "medium" | "long"): string {
  const finalTopicName = topic || "Important Concepts";
  const style = getClassLevelStyle(classNum);

  if (style.tier === "kinder") {
    return `# 🎒 Fun Notes: ${finalTopicName} 🎈
*Class ${classNum} • Subject: ${subject} • Easy Friendly Mode*

### 🌟 Hi little friends! Let's learn about **${finalTopicName}** today!

- **What is it?** It is a wonderful and exciting part of ${subject}! 
- **Fun Example**: ${style.examples[0]}!
- **Did you know?** ${style.examples[1]}.
- **Happy thoughts**: Learning is like playing with magical puzzle pieces!

---
### 🎨 Color & Play Activity:
> **Draw a beautiful picture** of *"${finalTopicName}"* in your school drawing sketchpad using your favorite warm yellow and green crayons! Show it to your parents tonight for a high five! ⭐`;
  }

  if (style.tier === "elementary") {
    return `# 💡 Elementary Notes: ${finalTopicName}
*Class ${classNum} • Subject: ${subject} • Easy Explanation Level*

### 📝 Chapter Overview and Simple Definition:
In Class ${classNum} ${subject}, **${finalTopicName}** helps us understand the natural processes around us. Here is the simplest definition:
> **${finalTopicName}** is the concept that explains how essential objects interact or work together.

### 🌟 Primary Learning Points:
- **Point 1**: It constitutes an essential component of the ${subject} lesson plan.
- **Point 2**: Examples include: *${style.examples[0]}*.
- **Point 3**: Keeping your worksheets organized makes revision simple and sweet.

---
### ❓ 5 Basic Questions & Direct Answers:
1. **Q: What is the main idea of ${finalTopicName}?**
   - *A: It represents the simple way elements of ${subject} organize themselves.*
2. **Q: Can we see this in everyday life?**
   - *A: Yes, such as ${style.examples[1]}.*
3. **Q: Why should we learn this topic?**
   - *A: It builds your daily school knowledge to unlock smart grades.*
4. **Q: Is it tough to memorize?**
   - *A: Not at all! Just break the word into easy spelling parts.*
5. **Q: How can I practice?**
   - *A: Discuss these 5 definitions with your best classroom friend!*`;
  }

  if (style.tier === "middle") {
    return `# 📖 School-Style Notes: ${finalTopicName}
*Class ${classNum} • Subject: ${subject} • Grade Syllabus Core*

### 📋 Chapter Summary:
This standard middle-school segment details the systematic operations of **${finalTopicName}** within **${subject}**. Students will master core terminologies, cycle phases, and practical examples.

### 🔑 Important Points:
- All parts interact dynamically to produce balanced, predictable states.
- Understanding the relationship is key to scoring perfect marks in chapter exams.
- Main variables must always be observed under safe conditions.

### 📚 Essential Definitions:
1. **${finalTopicName}**: The scientific process or structure where parts of ${subject} coordinate.
2. **Elementary Factors**: Natural variables that define the speed or effectiveness of the cycle.

### 💡 Examples from Daily Life:
- *${style.examples[0]}*
- *${style.examples[1]}*

---
### 📝 Practice Short & Long Q&A:
* **Q1 (Short): State the role of ${finalTopicName} in a single sentence.**
  * *Answer: It serves as the primary system mechanism triggering balanced growth in ${subject}.*
* **Q2 (Long): Explain the main stages of this system in detail.**
  * *Answer: The process features three active stages: first, initiation (absorbing solar inputs or variables); second, execution (synthesizing new outcomes); and third, yield (releasing standard end-products safely).*

---
### 🎯 3 Practice MCQs:
1. **What is the first step in ${finalTopicName}?**
   - A) Initiation and variable absorption
   - B) Final shutdown
   - C) Disregarding variables completely
   - *Correct Answer: A*
2. **Which of these is a typical everyday example?**
   - A) Let's think of ${style.examples[0]}
   - B) Standard clock mechanisms
   - C) None of the above
   - *Correct Answer: A*
3. **How do we make middle-school study efficient?**
   - A) Summaries, clear cards, and active MCQ practice
   - B) Leaving textbooks closed
   - *Correct Answer: A*

---
### 🏋️ Practice Homework Prompt:
> **Exercise**: Create a handwritten cycle chart showing how elements flow. Add a neat light yellow border around your workspace!`;
  }

  if (style.tier === "secondary") {
    return `# 🎯 Board Exam-Focused Notes: ${finalTopicName}
*Class ${classNum} • Subject: ${subject} • CBSE / ICSE Standard Layout*

---
### 📋 Detailed Concept Summary:
At a Class ${classNum} level, **${finalTopicName}** is highly crucial. It is structured under key scientific/social equations and forms a repeating theme in term assessments.

### 📚 Core Definitions & Terminologies:
- **Primary Mechanism**: The chemical or physical transformation that defines the state of a system.
- **Limiting Factors**: The variables (temperature, concentration, active catalysts) that govern rates of reaction.

### 📐 Relevant Formulas & Core Laws:
Here are the fundamental rules for mathematical modeling:
$$\\text{Rate of Response} \\propto \\frac{\\text{Concentration of Ingredients}}{\\text{Friction / Resistance Factor}}$$

> **Diagram Explanation**: In standard textbooks, the curve illustrating this process represents a sigmoidal or logarithmic trend. The plateau indicates saturation of variables.

---
### 🏆 3 Essential Previous-Year Board Style Q&As:
1. **Q: Define ${finalTopicName} and outline two primary limiting factors. (3 Marks)**
   - *Answer: ${finalTopicName} represents the structured process where variables adapt to external catalysts. The two primary limiting factors are: (i) Thermal Temperature ranges, and (ii) Component Concentration.*
2. **Q: Graph the response velocity and explain the curve. (5 Marks)**
   - *Answer: The graph features: (i) An exponential lag phase, (ii) A steep log growth phase, and (iii) A stationary plateau. The plateau represents maximum capacity.*
3. **Q: Distinguish between the primary inputs and outputs of this system. (2 Marks)**
   - *Answer: The primary inputs consist of essential raw variables, whereas the outputs comprise calibrated stable products.*

---
### 🎯 Mini MCQ Sheet:
1. **What indicates a stationary ceiling on textbook graphs?**
   - A) The curve plateaus smoothly
   - B) Speed increases indefinitely
   - *Correct Answer: A*
2. **Which formula correctly captures standard rates?**
   - A) Rate proportional to Concentration
   - B) Rate constant at negative infinity
   - *Correct Answer: A*`;
  }

  // Tier 5: Class 11 to 12 - Senior
  return `# 🎓 Advanced Senior Notes: ${finalTopicName}
*Class ${classNum} • Subject: ${subject} • Comprehensive University-Prep Syllabus*

---
### 🎯 1. Full Advanced Concept Explanation:
Explore the theoretical mechanics of **${finalTopicName}** under intensive Class ${classNum} physics, chemistry, biology, or humanities standards. The molecular or foundational structure is dictated by thermodynamics, physical equilibrium, or structural trends.

### 📐 2. Formula Sheet & Derivation:
We start from the standard first principles under CBSE standards:
$$\\oint_{S} \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enclosed}}}{\\epsilon_0}$$

Integrating across a symmetrical coordinate frame, we derive:
$$E = \\frac{\\sigma}{2\\epsilon_0} \\left(1 - \\frac{z}{\\sqrt{z^2 + R^2}}\\right)$$

*Explanation*: As radius $R$ approaches infinity, field state $E$ simplifies to a constant sheet approximation, showcasing standard physics truths.

---
### 🧪 3. Step-by-Step Numerical Example:
**Problem**: Calculate the net concentration variance if initial reagents dissolve at $0.05\\text{ M}$ under an equilibrium coefficient of $K_c = 4.2 \\times 10^{-3}$.
1. **Step 1**: Formulate the quadratic expression: $\\frac{x^2}{0.05 - x} = K_c$.
2. **Step 2**: Since $K_c$ is tiny, assume $0.05 - x \\approx 0.05$.
3. **Step 3**: Re-arrange: $x^2 \\approx 0.05 \\times (4.2 \\times 10^{-3}) = 2.1 \\times 10^{-4}$.
4. **Step 4**: Compute root: $x \\approx 1.45 \\times 10^{-2}\\text{ M}$.

---
### 💼 4. Case Study & Assertion-Reason:
* **Assertion [A]**: The chemical rate coefficient doubles for every $10^{\\circ}\\text{C}$ rise.
* **Reason [R]**: Molecules achieve vital activation energies more frequently with higher kinetic temperatures.
* **Selection**: *Both [A] and [R] are true, and [R] provides the correct and precise explanation of [A].*

---
### 🏆 5. Exam revision Practice Prompts:
- **Prompt**: Practice drafting this derivation three times on scratch sheets to secure perfect board marks!`;
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
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback topic if box is empty - Requirement 5
    let finalTopic = topic.trim();
    if (!finalTopic) {
      finalTopic = `Class ${classNum} ${subject} Chapter Concepts`;
      setTopic(finalTopic);
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
        body: JSON.stringify({ topic: finalTopic, classNum, subject, length }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate notes. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Notes API call failed, generating fallback notes locally:", err);
      const fallbackText = getLocalNotes(finalTopic, classNum, subject, length);
      setResult(fallbackText);
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
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          These offline-calibrated study notes were modeled because live AI credentials aren't currently configured. To use custom, real-time AI generation, set your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-950 dark:text-amber-100">GEMINI_API_KEY</code> in the Secrets tab (Settings &gt; Secrets).
                        </p>
                      </div>
                    </div>
                  )}
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
