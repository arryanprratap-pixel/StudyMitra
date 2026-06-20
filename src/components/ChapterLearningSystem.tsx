import { useState, useEffect } from "react";
import { 
  BookOpen, Compass, ClipboardList, HelpCircle, FileText, 
  Award, Sparkles, Copy, Download, Check, Save, Loader2, 
  Bookmark, ArrowRight, Lightbulb, GraduationCap, ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface ChapterLearningSystemProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

// 12 sections mapping with matching icons and descriptive names
const sections = [
  { id: "intro", label: "Chapter Introduction", emoji: "🌅", desc: "Catchy overview and warm welcome" },
  { id: "summary", label: "Simple Summary", emoji: "📋", desc: "Core concepts in easy bullet points" },
  { id: "definitions", label: "Important Definitions", emoji: "📚", desc: "Key academic definitions" },
  { id: "keywords", label: "Keywords & High-Yield Vocab", emoji: "🔑", desc: "Essential terminology decoded" },
  { id: "formulas", label: "Formulas & Core Concepts", emoji: "⚙️", desc: "Mathematical rules & equations" },
  { id: "examples", label: "Real-Life Examples", emoji: "💡", desc: "Everyday cases and applications" },
  { id: "short_q", label: "Short Q&A", emoji: "⚡", desc: "High-frequency school questions" },
  { id: "long_q", label: "Long Detailed Q&A", emoji: "📝", desc: "In-depth explanations with theory" },
  { id: "mcq_quiz", label: "Mini MCQ Quiz", emoji: "🎯", desc: "5 interactive multiple choice questions" },
  { id: "practice_q", label: "Practice Exercises", emoji: "🏋️", desc: "Prompts & self-assessment exercises" },
  { id: "homework_help", label: "Homework & Crafts Help", emoji: "🎨", desc: "Activity files & visual project ideas" },
  { id: "exam_tips", label: "Exam Marks Maximizer", emoji: "🏆", desc: "Secret pointers & revision hacks" }
];

export default function ChapterLearningSystem({ onSaveWork }: ChapterLearningSystemProps) {
  const [classNum, setClassNum] = useState<string>("7");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [customChapter, setCustomChapter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("intro");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  
  // Local cache for fetched active sections to feel lightning fast
  const [contentCache, setContentCache] = useState<Record<string, string>>({});

  // 1. subjects data according to school levels
  const getSubjectsForClass = (gradeStr: string) => {
    const grade = parseInt(gradeStr, 10);
    if (grade <= 5) {
      return ["English", "Hindi", "Maths", "EVS", "General Knowledge", "Computer", "Moral Science"];
    } else if (grade <= 8) {
      return ["English", "Hindi", "Maths", "Science", "Social Science", "Computer", "GK", "Sanskrit"];
    } else {
      return [
        "English", "Hindi", "Maths", "Physics", "Chemistry", "Biology", 
        "History", "Geography", "Civics", "Economics", "Political Science", 
        "Computer Science", "Accountancy", "Business Studies", "GK"
      ];
    }
  };

  // 2. Typical standard chapters DB
  const standardChaptersDB: Record<string, Record<string, string[]>> = {
    lower: {
      English: ["The Magic Garden", "Flying Man", "Alice in Wonderland", "Ice-Cream Man", "Robinson Crusoe", "My Shadow"],
      Maths: ["Fish Tale & Large Numbers", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Basic Division & Tables", "Smart Charts"],
      EVS: ["Super Senses", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Sunita in Space", "What if it Finishes?"],
      "General Knowledge": ["The Animal World", "Incredible India Heritage", "World Wonders & Flags", "Basic Human Body", "Famous Inventions"],
      Computer: ["Parts of a Desktop Computer", "Understanding Paintbrush Tool", "Introduction to MS Word", "Safe Browsing Habits", "Keyboard Shortcuts"],
      "Moral Science": ["Sharing is Caring", "The Power of Honesty", "Loving Pets & Nature", "Time is Precious", "Respecting Our Elders"]
    },
    middle: {
      English: ["Who Did Patrick's Homework?", "How the Dog Found a Master", "Taro's Reward", "A Different Kind of School", "The Banyan Tree"],
      Hindi: ["वह चिड़िया जो", "बचपन की यादें", "नादान दोस्त", "चाँद से थोड़ी सी गप्पें", "अक्षरों का महत्व"],
      Maths: ["Knowing Our Numbers", "Whole Numbers & Fractions", "Playing with Numbers", "Basic Geometrical Ideas", "Algebra Intro", "Data Handling"],
      Science: ["Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Light, Shadows and Reflections"],
      "Social Science": ["What, Where, How and When? (History)", "Diversity and Discrimination (Civics)", "The Earth in the Solar System (Geography)", "On the Trail of Earliest People", "What is Government?"],
      Computer: ["Generations of Computers", "Introduction to MS Excel", "Understanding HTML Coding", "E-Commerce Basics", "Computer Viruses & Security"],
      GK: ["Famous Indian Landmarks", "Space Expeditions & Satellites", "Nobel Prize Winners", "Medicinal Plants", "Major World Rivers"],
      Sanskrit: ["शब्दपरिचयः", "आकाशः पतति", "वर्णमाला परिचयः", "क्रीडास्पर्धा"]
    },
    higher: {
      English: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Road Not Taken"],
      Maths: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Quadratic Equations", "Probability & Statistics"],
      Physics: ["Motion & Speed", "Force and Laws of Motion", "Gravitation & Weight", "Work, Energy and Power", "Sound Waves", "Light Reflection & Refraction"],
      Chemistry: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "Chemical Reactions & Equations", "Carbon & its Compounds"],
      Biology: ["Cell - The Fundamental Unit of Life", "Plant and Animal Tissues", "Why Do We Fall Ill?", "Life Processes & Nutrition", "Control and Coordination", "Heredity & Evolution"],
      History: ["The French Revolution", "Socialism in Europe & Russian Revolution", "Nazism and the Rise of Hitler", "Nationalism in India", "The Making of a Global World"],
      Geography: ["India - Size and Location", "Physical Features of India", "Drainage Rivers System", "Climate and Weather", "Natural Vegetation & Wildlife"],
      Civics: ["What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights"],
      Economics: ["The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security in India"],
      "Political Science": ["Power Sharing", "Federalism in Government", "Gender, Religion and Caste", "Political Parties"],
      "Computer Science": ["Computer Networks & Protocol", "Variables & Loops in Python", "Introduction to SQL Queries", "Cyber Ethics"],
      Accountancy: ["Introduction to Accounting Principles", "Theory Base of Accounting", "Recording of Transactions - Ledger & Journal", "Bank Reconciliation Statement"],
      "Business Studies": ["Nature and Purpose of Business", "Forms of Business Organisations", "Private, Public and Global Enterprises", "Business Services"],
      GK: ["Advanced World Geopolitics", "Union Budget of India", "Environmental Conventions", "Scientific Innovations", "Cyber Laws & Cryptocurrencies"]
    }
  };

  const getChaptersForSubject = (gradeStr: string, subject: string) => {
    const grade = parseInt(gradeStr, 10);
    let category = "middle";
    if (grade <= 5) category = "lower";
    else if (grade >= 9) category = "higher";

    const catDb = standardChaptersDB[category] || {};
    return catDb[subject] || ["Chapter 1: Overview & History", "Chapter 2: Concept Core Level", "Chapter 3: Exercises & Practical File", "Chapter 4: Class Revision Chapter"];
  };

  // Reset subject and chapter when classNum changes
  useEffect(() => {
    const subs = getSubjectsForClass(classNum);
    setSelectedSubject(subs[0]);
    setContentCache({});
    setResultText("");
  }, [classNum]);

  // Reset chapter and custom text when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const chs = getChaptersForSubject(classNum, selectedSubject);
      setSelectedChapter(chs[0]);
      setCustomChapter("");
      setContentCache({});
      setResultText("");
    }
  }, [selectedSubject]);

  // Reset results and clean cache when active chapter or customChapter changes
  useEffect(() => {
    setContentCache({});
    setResultText("");
  }, [selectedChapter]);

  // Fetch learning section logic from express api
  const fetchSectionContent = async (sectionId: string, forceRefresh = false) => {
    setError("");
    const finalChapter = customChapter.trim() || selectedChapter;
    if (!finalChapter) {
      setError("Please search or specify a Chapter Name!");
      return;
    }

    const cacheKey = `${classNum}-${selectedSubject}-${finalChapter}-${sectionId}`;
    if (!forceRefresh && contentCache[cacheKey]) {
      setResultText(contentCache[cacheKey]);
      setActiveTab(sectionId);
      return;
    }

    setLoading(true);
    setResultText("");
    setActiveTab(sectionId);

    const matchName = sections.find(s => s.id === sectionId)?.label || sectionId;

    try {
      const resp = await fetch("/api/generate/chapter-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classNum,
          subject: selectedSubject,
          chapter: finalChapter,
          sectionId,
          sectionName: matchName
        })
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load chapter section.");
      }

      const data = await resp.json();
      const generated = data.text;

      // Update Cache
      setContentCache(prev => ({
        ...prev,
        [cacheKey]: generated
      }));
      setResultText(generated);
      setCopied(false);
      setSaved(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching guidelines.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resultText) return;
    const ok = await copyToClipboard(resultText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!resultText) return;
    const finalCh = customChapter.trim() || selectedChapter;
    const sectionName = sections.find(s => s.id === activeTab)?.label || activeTab;
    const filename = `Class-${classNum}-${selectedSubject.toLowerCase()}-${finalCh.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activeTab}.txt`;
    downloadTextFile(filename, resultText);
  };

  const handleSave = () => {
    if (!resultText) return;
    const finalCh = customChapter.trim() || selectedChapter;
    const sectionName = sections.find(s => s.id === activeTab)?.label || activeTab;
    
    onSaveWork({
      type: "Chapter Learning",
      title: `${selectedSubject} - Ch: ${finalCh} (${sectionName})`,
      content: resultText,
      metadata: { classNum, subject: selectedSubject, chapter: finalCh, sectionId: activeTab }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentClassSubjects = getSubjectsForClass(classNum);
  const currentSubjectChapters = getChaptersForSubject(classNum, selectedSubject);
  const displayedChapter = customChapter.trim() || selectedChapter;

  return (
    <div className="space-y-8" id="smart-chapter-learning-helper">
      
      {/* Title Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-150 dark:border-slate-805 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Smart Chapter-wise Learning System 📖
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any class from Class 1 to 12. Instantly unlock personalized summaries, homework assistances, step-by-step math formulas, and interactive tests carefully aligned to your standard!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation & Selectors Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-emerald-100 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" /> Lesson Selectors
            </h3>

            {/* 1. Class selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-class-num" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                1. Pick Standard / Class:
              </label>
              <select
                id="smart-class-num"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => {
                  let badge = "(Primary)";
                  if (grade > 5 && grade <= 8) badge = "(Middle)";
                  else if (grade > 8) badge = "(High School/Senior)";
                  return (
                    <option key={grade} value={grade.toString()}>
                      Class {grade} {badge}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Subject selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                2. Select Subject:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
                {currentClassSubjects.map((sub) => {
                  const isSel = selectedSubject === sub;
                  return (
                    <button
                      key={sub}
                      id={`smart-sub-btn-${sub.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Chapter Selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-chapter" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                3. Choose Chapter:
              </label>
              <select
                id="smart-chapter"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setCustomChapter("");
                }}
              >
                {currentSubjectChapters.map((ch, idx) => (
                  <option key={idx} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Or key-in Custom Chapter */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-805 space-y-1.5">
              <label htmlFor="smart-custom-chapter" className="block text-[10px] font-bold text-slate-400 tracking-wider font-display uppercase">
                Or Type Custom Chapter Name:
              </label>
              <input
                type="text"
                id="smart-custom-chapter"
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                placeholder="e.g. Ancient Roman Empire, Trigonometry"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-emerald-400 outline-none font-sans text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Stats / Lesson details card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-display">
              Standard Calibration 🧪
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-450">Active Class:</span>
                <span className="font-bold text-slate-900 dark:text-white">Class {classNum}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-450">Target Subject:</span>
                <span className="font-bold text-slate-905 dark:text-white">{selectedSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Vocabulary Level:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {parseInt(classNum, 10) <= 5 ? "Easy Primary" : parseInt(classNum, 10) <= 8 ? "Intermed Middle" : "Rich/Academic High"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Learning Deck Column */}
        <div className="lg:col-span-8 flex flex-col min-h-[580px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-850 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="smart-chapter-error">
              <span>⚠️</span>
              <div>
                <strong>Failed Loading Chapter:</strong> {error}
              </div>
            </div>
          )}

          {/* Main Workspace Board */}
          <div className="bg-white dark:bg-slate-905 rounded-3xl border-3 border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            
            {/* Top Chapter Head Info Banner */}
            <div className="bg-emerald-50/55 dark:bg-emerald-950/15 px-6 py-5 border-b border-slate-101 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/40 px-2 py-1 rounded">
                  Class {classNum} • {selectedSubject}
                </span>
                <h3 className="text-md font-bold text-slate-900 dark:text-white mt-1.5 font-display flex items-center gap-1.5">
                  📁 Current Chapter: "{displayedChapter}"
                </h3>
              </div>

              {resultText && (
                <div className="flex items-center gap-2" id="chapter-learning-header-actions">
                  <button
                    onClick={handleCopy}
                    id="copy-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    id="download-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    id="save-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900 border border-emerald-202 dark:border-emerald-850 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px]">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Save Work</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Smart 12 tabs horizontal scrollable container */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex overflow-x-auto whitespace-nowrap p-2 scrollbar-none gap-1">
              {sections.map((sec) => {
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    id={`chapter-tab-button-${sec.id}`}
                    onClick={() => fetchSectionContent(sec.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all font-display text-xs font-semibold cursor-pointer select-none ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-emerald-650 dark:text-emerald-400 border border-slate-200 dark:border-slate-750 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-850/60 dark:hover:text-slate-200"
                    }`}
                    title={sec.desc}
                  >
                    <span>{sec.emoji}</span>
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Markdown Viewer Area */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[640px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-emerald-150">
              
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-emerald-450 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Opening Smart School Textbook... 🔍
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our school study tutor is custom tailoring notes, definitions, example calculations, or MCQ test sheets for "{displayedChapter}"!
                    </p>
                  </div>
                </div>
              ) : resultText ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="chapter-learning-rendered-markdown">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold font-display text-emerald-650 dark:text-emerald-400 mt-2 mb-4 border-b border-emerald-100 dark:border-slate-800 pb-2 flex items-center gap-2" {...props} />,
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
                      strong: ({ ...props }) => <strong className="font-bold text-emerald-900 dark:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-955/15 pl-4 py-2 italic my-4 rounded-r-xl text-slate-600 dark:text-slate-350" {...props} />,
                    }}
                  >
                    {resultText}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 font-display">
                      Unlock Your School Chapter 🚀
                    </h5>
                    <p className="text-xs text-slate-400 max-w-sm mt-1.5 mx-auto leading-relaxed">
                      Select your class, subject, and chapter. Then click on any of the 12 textbook tabs above to load personalized study material instantly!
                    </p>
                  </div>

                  <button
                    onClick={() => fetchSectionContent("intro")}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-semibold text-xs rounded-2xl transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5 border-b-2 border-emerald-700"
                  >
                    Load Lesson Introduction <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
