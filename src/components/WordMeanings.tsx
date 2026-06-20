import { useState } from "react";
import { BookA, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile, getClassLevelStyle } from "../utils";
import { SavedWorkItem } from "../types";

interface WordMeaningsProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

function getLocalWordMeaning(word: string, classNum: string): string {
  const normWord = word.trim() || "Delightful";
  const syll = normWord.toLowerCase().split("").join("-");
  const style = getClassLevelStyle(classNum);

  if (style.tier === "kinder") {
    return `# 🎒 Fun Word Card: "${normWord}" 🎈
*Class ${classNum} • Super Easy Kids Dictionary*

### 🌟 Hey there little friend! Let's learn to say and spell: **"${normWord}"**

- **How do we say it?** It is spelled like: **${syll}**! Say it open loud: *"We can read together!"*
- **What does it mean?** It means something that is **very happy, warm, and fun to look at** (like a sweet red apple, a friendly yellow sun, or a little puppy dog tail wagging).
- **Fun Example**: *"We had a really **${normWord}** afternoon drawing green trees in our school sketchbooks!"*

---
### 🎨 Kid's Active Worksheet Challenge:
> **Fun Activity**: Write the word **"${normWord}"** three times on a clean white paper using your favorite blue or green colored crayons! ⭐`;
  }

  if (style.tier === "elementary") {
    return `# 💡 Elementary Word Finder: "${normWord}"
*Grade standard: Class ${classNum} • Simple Student Learner*

### 📝 Definition and Primary Explanation:
In Class ${classNum} worksheets, **"${normWord}"** describes any situation or quality that is highly creative, special, and makes school studies exciting.

### ✍️ Fun Sentence Examples:
- *Our science teacher gave us a **${normWord}** explanation of how little seeds grow into huge green trees!*
- *It is very **${normWord}** to see how magnets pull iron paperclips closer together.*

### ❓ 5 Basic Questions & Answers for Word Practice:
1. **Q: Is "${normWord}" an action doing verb or a description adjective?**
   - *A: It is usually a description word (adjective) that adds color to your essays.*
2. **Q: What is a similar simple word for "${normWord}"?**
   - *A: "Happy", "Lovely", or "Wonderful" represent excellent matches!*
3. **Q: What is the opposite word?**
   - *A: "Dull" or "Boring" show the exact opposite.*
4. **Q: How can I spell it correctly in class tests?**
   - *A: Remember: **${syll}**! Break it down into easy sounds.*
5. **Q: What lesson example is in our books?**
   - *A: Like the lovely processes found in *${style.examples[0]}*.*`;
  }

  if (style.tier === "middle") {
    return `# 📖 Classroom Dictionary Word: "${normWord}"
*Grade standard: Class ${classNum} • StudyMitra Vocabulary Companion*

---
### 🔍 Pronunciation & Part of Speech:
* **Target Word**: **${normWord}**
* **Syllables**: *${syll}*
* **Part of Speech**: Adjective / Noun / Verb (Grade-appropriate school context)

---
### 💡 Core Classroom Meaning:
At a Class ${classNum} standard, **${normWord}** describes factors or variables showing high value, cleanliness, or systematic design. It characterizes concepts that function perfectly under standard conditions.

---
### ✍️ Simple Sentences:
1. *The school assembly praised our creative team for delivering a **${normWord}** presentation on natural resource protection.*
2. *During our lesson experiment, the indicator gave a clear, **${normWord}** shift in colors.*

---
### 📋 Synonyms & Antonyms:
| Category | Synonyms (Similar Meaning) | Antonyms (Opposite Meaning) |
| :--- | :--- | :--- |
| **Common Use** | Excellent / Balanced / Neat | Confusing / Disorganized / Dull |
| **Lesson Context** | Systematic / Productive | Random / Static / Inactive |

---
### 🏆 Memory Revision Mind Hack:
To memorize how to spell and write **"${normWord}"** perfectly on exam papers:
> *Keep this visual target in mind: "Our answers are **${normWord}** because we follow systematic, bulleted points!"*`;
  }

  if (style.tier === "secondary") {
    return `# 🎯 Board Exam-Focused Vocabulary: "${normWord}"
*Class ${classNum} • Subject Terminology Master • CBSE / Academic Core*

---
### 🔍 Phonetic Transcription & Morphological Breakdown:
- **Lexical Entry**: **${normWord}**
- **Morphology**: Derived through base stem attachments.
- **Syllabic division**: *${syll}*
- **Syllabus Category**: High-frequency academic lexicon.

---
### 📋 Precise Contextual Definition:
In high-school exams, the term **"${normWord}"** is deployed in literature, social studies, or scientific theories to qualify variables, arguments, or artistic movements that exhibit exquisite structure, cohesive logic, or remarkable utility.

---
### 🏆 Model Sentences (CBSE Word Usage Standards):
1. *The writer's **${normWord}** utilization of parallel structures in the third act highlights historical societal changes.*
2. *Scientists observed a **${normWord}** correlation between catalyst concentration adjustments and overall chemical velocity.*

---
### 📚 Synonyms, Antonyms, & Roots:
* **Academic Synonyms**: Exquisite, exemplary, meritorious, highly structured.
* **Academic Antonyms**: Superfluous, disordered, disjointed, chaotic.
* **Root Origin**: Derived from classical Latin/Middle Germanic verbs signifying deep appreciation, structural balance, or logical cohesion.

---
### 🏋️ Practice Homework Prompt:
> **Question (2 Marks)**: Construct a compound sentence containing the word **"${normWord}"** to describe a laboratory or social process. Check your spellings!`;
  }

  // Tier 5: Class 11-12 Senior
  return `# 🎓 Advanced Senior Lexicon: "${normWord}"
*Class ${classNum} • University-Prep Philology • Scholarly Glossary Tracker*

---
### 🎯 1. Philological and Semantic Analysis:
An in-depth semantic mapping of **"${normWord}"** exposes nuanced layered contexts. In senior curriculum tracks (English Core, Classical Literature, or advanced humanities/science research), this word functions to annotate paradigms, methodologies, or philosophical tenets defined by flawless internal consistency.

- **Syllabic Rhythm**: *${syll}*
- **Register**: Formal, Academic, Literary, Scientific.

---
### 📐 2. Semantic Equations & Etymological Progression:
- **Etymological Roots**: Traced to foundational frameworks of rational appreciation and structural utility.
- **Systemic Model**:
  $$\\text{Semantic Resonance} \\propto \\text{Register Specificity} \\times \\text{Contextual Precision}$$

---
### 💼 3. Analytical Scholarly Contexts & Board Usage:
* **Literature Context**: *The critic scrutinized the prose, finding that the author's **${normWord}** attention to subtext elevated what would otherwise have been an elementary narrative into a profound allegory.*
* **Scientific Research Context**: *The experimenters established a **${normWord}** system of controls, suppressing ambient friction and heat leakage to secure a clean, reproducible yield.*

---
### 🔬 4. Case Study & Assertion-Reason:
* **Assertion [A]**: Utilizing diverse vocabulary like **"${normWord}"** enhances structural essay grading metrics.
* **Reason [R]**: Advanced vocabulary choices establish a precise, professional register, signaling deep cognitive mastery to examiners.
* **Selection**: *Both [A] and [R] are true, and [R] represents the correct conceptual reason for [A].*`;
}

export default function WordMeanings({ onSaveWork }: WordMeaningsProps) {
  const [word, setWord] = useState("Delightful");
  const [classNum, setClassNum] = useState("6");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalWord = word.trim();
    if (!finalWord) {
      finalWord = "Delightful";
      setWord(finalWord);
    }
    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/word-meanings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: finalWord, classNum }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to find word details. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Word Dictionary API call failed. Generating local guide instead:", err);
      const generated = getLocalWordMeaning(finalWord, classNum);
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
    const cleanFilename = `vocabulary-${word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Word Meanings",
      title: `Word Meaning: ${word} (Class ${classNum})`,
      content: result,
      metadata: { word, classNum },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Preset words for quick click
  const presets = [
    { text: "⭐ Class 1-5 Words", words: ["Delightful", "Giggle", "Enormous", "Scurry", "Curious"] },
    { text: "📘 Class 6-8 Words", words: ["Benevolent", "Symbiosis", "Metaphor", "Astonished", "Evaluate"] },
    { text: "🎓 Class 9-12 Words", words: ["Hypothesize", "Anachronism", "Melancholy", "Photosynthesis", "Pragmatic"] }
  ];

  return (
    <div className="space-y-8" id="word-meanings-helper-section">
      {/* Intro box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-150 dark:border-slate-805 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            <BookA className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Word Meaning & Vocabulary Helper 🧠
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Type or select any English word to get simplified definitions tailored exactly to your school standard (Classes 1 to 12). Learn funny memory tricks to never forget them!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-amber-100 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3">
            Search Parameters 📝
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="vocab-word-input" className="block text-xs font-semibold text-slate-705 dark:text-slate-300 mb-1.5 font-display">
                Enter your word:
              </label>
              <input
                type="text"
                id="vocab-word-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-amber-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                placeholder="e.g., Curious, Benevolent, Photosynthesis"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="vocab-class-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                Which grade list are you in?
              </label>
              <select
                id="vocab-class-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-amber-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <option key={grade} value={grade}>
                    Class {grade} {grade <= 5 ? "(Primary School)" : grade <= 8 ? "(Middle School)" : "(High School)"}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              id="vocab-submit-button"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Gathering Wisdom...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Word Magic Explainer!
                </>
              )}
            </button>
          </form>

          {/* Quick presets */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-805 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block font-display uppercase">
              🧪 Fun words to understand:
            </span>
            <div className="space-y-3">
              {presets.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    {group.text}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {group.words.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        id={`vocab-preset-${groupIdx}-${idx}`}
                        onClick={() => {
                          setWord(item);
                          const inferredClass = groupIdx === 0 ? "3" : groupIdx === 1 ? "7" : "11";
                          setClassNum(inferredClass);
                        }}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] rounded-xl text-slate-600 dark:text-slate-300 transition-all cursor-pointer font-medium"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output details panel */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]" id="vocab-result-panel">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="vocab-error">
              <span>⚠️</span>
              <div>
                <strong>Error Searching Word: </strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-905 rounded-3xl border-3 border-amber-100 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            {/* Toolbar panel */}
            <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b-2 border-slate-101 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-222 font-display">
                Word Explanation Card 📇
              </h4>

              {result && (
                <div className="flex items-center gap-2" id="vocabulary-result-actions">
                  <button
                    onClick={handleCopy}
                    id="copy-vocab-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Notes!</span>
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
                    id="download-vocab-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-101 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    id="save-vocab-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-955/40 dark:hover:bg-amber-950 border border-amber-202 dark:border-amber-900 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved is Board!</span>
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

            {/* Display Markdown Content */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-amber-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-amber-450 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Opening magical student dictionary... ⏰
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our English counselor is defining, finding cute metaphors, and making sentence checklists for "{word}"!
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="vocab-explain-rendered-markdown">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          This word summary was compiled in offline-calibration mode because live AI secrets are not active. To find definitions for any vocabulary term with customized examples in real-time, configure a <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-955 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 mt-2 mb-4 border-b border-amber-100 dark:border-slate-800 pb-2 flex items-center gap-2" {...props} />,
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
                      td: ({ ...props }) => <td className="px-4 py-3 text-xs font-medium text-slate-707 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-amber-400 bg-amber-50/30 dark:bg-amber-955/15 pl-4 py-2 italic my-4 rounded-r-xl text-slate-600 dark:text-slate-350" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    🧠
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-300 font-display">
                      Write or Click any word!
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Choose settings on the left and click "Word Magic Explainer!" to retrieve simple definitions, school usages, synonyms and funny memory tracks.
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
