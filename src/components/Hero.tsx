import { BookOpen, BrainCircuit, ListTodo, Bookmark, FileText, CalendarRange, ArrowRight, Sparkles, Trophy, BookA, GraduationCap, Timer } from "lucide-react";

interface HeroProps {
  setCurrentTab: (tab: string) => void;
  subjectsCount: number;
}

export default function Hero({ setCurrentTab, subjectsCount }: HeroProps) {
  const tools = [
    {
      id: "timer",
      title: "⏳ Pomodoro Study Timer",
      desc: "Stay concentrated! We configure focus/rest blocks with playful stars and audio chimes for younger minds or rigid Pomodoros for secondary exams.",
      icon: Timer,
      iconBg: "bg-red-100 text-red-650 dark:bg-red-950/60 dark:text-red-400",
      border: "hover:border-red-300 dark:hover:border-red-850 border-red-200 border-2",
      accent: "red",
    },
    {
      id: "chapter-learning",
      title: "Smart Chapter Learning System",
      desc: "Comprehensive chapter summaries, definitions, formulas, MCQs, and exam hacks for all subjects (Class 1-12).",
      icon: GraduationCap,
      iconBg: "bg-emerald-100 text-emerald-750 dark:bg-emerald-950/60 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-850 border-emerald-200 border-2",
      accent: "emerald",
    },
    {
      id: "answers-solver",
      title: "Universal Answer Solver",
      desc: "Solve homework doubts, maths steps, coding, essays, letters, grammar rules, tailored carefully to your class grade.",
      icon: BrainCircuit,
      iconBg: "bg-indigo-100 text-indigo-755 dark:bg-indigo-950/60 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-850 border-indigo-200 border-2",
      accent: "indigo",
    },
    {
      id: "notes",
      title: "Simple Notes Generator",
      desc: "Turn any topic into clear English, Science, or History notes made just for you.",
      icon: BookOpen,
      iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
      border: "hover:border-sky-300 dark:hover:border-sky-850",
      accent: "sky",
    },
    {
      id: "quiz",
      title: "Quiz Practice",
      desc: "Challenge yourself with 5 simple multiple choice questions and track your score.",
      icon: BrainCircuit,
      iconBg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400",
      border: "hover:border-yellow-300 dark:hover:border-yellow-850",
      accent: "yellow",
    },
    {
      id: "planner",
      title: "Homework Planner",
      desc: "Stay organized! Write down tasks, set due dates, and mark them complete.",
      icon: ListTodo,
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-850",
      accent: "green",
    },
    {
      id: "word-meanings",
      title: "Word Meanings & Vocab",
      desc: "Instantly find easy-to-understand definitions, simplified example sentences, and helpful synonyms.",
      icon: BookA,
      iconBg: "bg-teal-100 text-teal-650 dark:bg-teal-950/60 dark:text-teal-400",
      border: "hover:border-teal-300 dark:hover:border-teal-850",
      accent: "teal",
    },
    {
      id: "book-review",
      title: "Book Review Maker",
      desc: "Tell us about a book you read and make a beautiful review for school.",
      icon: Bookmark,
      iconBg: "bg-rose-100 text-rose-650 dark:bg-rose-950/60 dark:text-rose-400",
      border: "hover:border-rose-300 dark:hover:border-rose-850",
      accent: "rose",
    },
    {
      id: "project-format",
      title: "Project Format Maker",
      desc: "Type a project topic to get steps, cover page info, ingredients, and summary.",
      icon: FileText,
      iconBg: "bg-indigo-100 text-indigo-650 dark:bg-indigo-950/60 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-850",
      accent: "indigo",
    },
    {
      id: "timetable",
      title: "Study Timetable Maker",
      desc: "Put in your school hours and create a balanced study plus playtime schedule.",
      icon: CalendarRange,
      iconBg: "bg-violet-100 text-violet-650 dark:bg-violet-950/60 dark:text-violet-400",
      border: "hover:border-violet-300 dark:hover:border-violet-850",
      accent: "violet",
    },
  ];

  const motivationalQuotes = [
    "“The beautiful thing about learning is that no one can take it away from you.” — B.B. King",
    "“You don't have to be perfect. You just have to try your best every single day!”",
    "“Every expert was once a beginner. Keep exploring, keep learning!”",
  ];

  const randomQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="space-y-12 py-4" id="hero-section">
      {/* Dynamic Header Block */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-yellow-50 to-emerald-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-8 md:p-12 border-3 border-yellow-300 dark:border-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-yellow-500" />
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 font-display font-medium text-xs mb-6 shadow-sm border border-yellow-250">
            <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-600" />
            Class 1 to Class 12 Study Companion
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight font-display">
            Student Helper <span className="text-sky-500 underline decoration-yellow-400 decoration-wavy">Hub</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl text-slate-600 dark:text-slate-350 font-medium tracking-tight font-display">
            Simple study help for every student
          </p>
          <p className="mt-4 text-sm md:text-md text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Stuck on homework? Need quick notes, a fun practice quiz, a balanced study schedule, or a science project outline? We have put together simple tools powered by friendly help to make studying stress-free.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                const notesSection = document.getElementById("main-content-section");
                if (notesSection) {
                  setCurrentTab("notes");
                  notesSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-display font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 text-sm border-b-4 border-sky-700/80"
              id="get-started-btn"
            >
              Start Generating Notes <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => {
                const quizSection = document.getElementById("main-content-section");
                if (quizSection) {
                  setCurrentTab("quiz");
                  quizSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-yellow-400 font-display font-medium shadow-md border-b-4 border-slate-300 dark:border-slate-950 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 text-sm"
              id="quick-quiz-btn"
            >
              Play Practice Quiz
            </button>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="bg-[#4ADE80]/15 text-[#16A34A] dark:text-[#4ADE80] p-2 rounded-xl text-xs font-semibold flex-shrink-0 animate-bounce">
            💡 TIP OF THE DAY
          </div>
          <p className="text-xs md:text-sm italic font-medium text-slate-500 dark:text-slate-400">
            {randomQuote}
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div>
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            Choose Your Study Tool
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick any tool below to begin. It takes less than 10 seconds to get structured results!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tools-shortcut-grid">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  setCurrentTab(tool.id);
                  const contentSec = document.getElementById("main-content-section");
                  if (contentSec) contentSec.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-3xl border-3 border-transparent ${tool.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
                id={`tool-card-${tool.id}`}
              >
                <div>
                  <div className={`p-3.5 rounded-2xl inline-block ${tool.iconBg} mb-5 transition-transform group-hover:scale-110 duration-200`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display group-hover:text-sky-500 transition-colors duration-200">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between text-xs font-medium text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform duration-250">
                  <span className="font-display">Use this tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
