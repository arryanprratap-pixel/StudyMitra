import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  BrainCircuit, 
  ListTodo, 
  Bookmark, 
  FileText, 
  CalendarRange, 
  Mail, 
  MapPin, 
  Phone, 
  Heart, 
  Sparkles, 
  Save, 
  Award, 
  Compass,
  Github,
  Twitter,
  ExternalLink,
  MessageSquare,
  BookA
} from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NotesGenerator from "./components/NotesGenerator";
import QuizPractice from "./components/QuizPractice";
import HomeworkPlanner from "./components/HomeworkPlanner";
import BookReviewMaker from "./components/BookReviewMaker";
import ProjectFormatMaker from "./components/ProjectFormatMaker";
import StudyTimetableMaker from "./components/StudyTimetableMaker";
import SavedWork from "./components/SavedWork";
import WordMeanings from "./components/WordMeanings";
import ChapterLearningSystem from "./components/ChapterLearningSystem";
import UniversalAnswerSolver from "./components/UniversalAnswerSolver";

// Types
import { SavedWorkItem } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedWorkItem[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Initialize theme from system preference or local storage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("student_theme");
      if (storedTheme) {
        setIsDark(storedTheme === "dark");
      } else {
        const wantsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(wantsDark);
      }
    } catch (e) {
      console.error(e);
    }

    // Load initial saved items
    try {
      const items = localStorage.getItem("student_saved_hub");
      if (items) {
        setSavedItems(JSON.parse(items));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update DOM when dark theme toggled
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("student_theme", isDark ? "dark" : "light");
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  // Handle saving items to central hub
  const handleSaveWork = (newItem: Omit<SavedWorkItem, "id" | "timestamp">) => {
    const freshItem: SavedWorkItem = {
      ...newItem,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };

    const updated = [freshItem, ...savedItems];
    setSavedItems(updated);
    try {
      localStorage.setItem("student_saved_hub", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveSavedWork = (id: string) => {
    const updated = savedItems.filter((item) => item.id !== id);
    setSavedItems(updated);
    try {
      localStorage.setItem("student_saved_hub", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllSaved = () => {
    if (window.confirm("Are you sure you want to delete all saved study sessions? This cannot be undone.")) {
      setSavedItems([]);
      try {
        localStorage.setItem("student_saved_hub", "[]");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setContactSubmitted(false);
      alert("🎉 Message received! Your study buddy will write back very soon!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-yellow-200 transition-colors duration-300">
      
      {/* Brand Navigation Header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />

      {/* Main Container Core Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Dynamic content anchor section */}
        <div id="main-content-section" className="scroll-mt-24">
          {currentTab === "home" && (
            <div className="space-y-12">
              <Hero setCurrentTab={setCurrentTab} subjectsCount={savedItems.length} />
              
              {/* Feature Preview Snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/60 dark:border-slate-800/600">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-800 flex gap-4">
                  <div className="p-3 bg-[#E0F2FE] text-[#0284C7] dark:bg-[#0C4A6E] dark:text-[#38BDF8] rounded-2xl h-fit">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold font-display text-slate-900 dark:text-white">Active Classroom Guidance</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      All outputs are custom calibrated for Class 1 to Class 12. We keep answers extremely simple and short for lower classes, and richer for higher classes, always in student-friendly learning language!
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-800 flex gap-4">
                  <div className="p-3 bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F] dark:text-[#FBBF24] rounded-2xl h-fit">
                    <Save className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold font-display text-slate-900 dark:text-white">Recent Saved Activity ({savedItems.length})</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Need your previous search notes or lesson project layouts back? Hop onto the <span className="font-semibold text-sky-500 cursor-pointer hover:underline" onClick={() => setCurrentTab("saved-hub")}>Saved Work Hub</span> to download and edit them any time you want!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "notes" && (
            <NotesGenerator onSaveWork={handleSaveWork} />
          )}

          {currentTab === "chapter-learning" && (
            <ChapterLearningSystem onSaveWork={handleSaveWork} />
          )}

          {currentTab === "answers-solver" && (
            <UniversalAnswerSolver onSaveWork={handleSaveWork} />
          )}

          {currentTab === "quiz" && (
            <QuizPractice />
          )}

          {currentTab === "planner" && (
            <HomeworkPlanner />
          )}

          {currentTab === "word-meanings" && (
            <WordMeanings onSaveWork={handleSaveWork} />
          )}

          {currentTab === "book-review" && (
            <BookReviewMaker onSaveWork={handleSaveWork} />
          )}

          {currentTab === "project-format" && (
            <ProjectFormatMaker onSaveWork={handleSaveWork} />
          )}

          {currentTab === "timetable" && (
            <StudyTimetableMaker onSaveWork={handleSaveWork} />
          )}

          {currentTab === "saved-hub" && (
            <SavedWork 
              savedItems={savedItems} 
              onRemoveItem={handleRemoveSavedWork} 
              onClearAll={handleClearAllSaved} 
            />
          )}

          {currentTab === "about" && (
            <div className="space-y-8 animate-in fade-in" id="about-section">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-3 border-yellow-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto space-y-6">
                <div className="inline-flex p-3 bg-yellow-100 text-yellow-750 dark:bg-yellow-950 dark:text-yellow-405 rounded-2xl">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-display">
                  About Student Helper Hub 📖
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                  The <strong>Student Helper Hub</strong> was designed with one simple goal: to make school homework and self-study exciting, fast, and completely stress-free. Covering grades from Class 1 to 12 represents various crucial phases of student learning, and our tools customize answers precisely for every classroom age!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <span className="text-lg">👶</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">Simple Vocabulary</h4>
                    <p className="text-xs text-slate-400">Explanations keep terms basic and easy so school kids can directly understand and make notes.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-lg">🔌</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">Offline Local Save</h4>
                    <p className="text-xs text-slate-400">Everything is stored inside your browser's LocalStorage—no login needed, keep files private and handy.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-lg">✨</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">Free Study Tools</h4>
                    <p className="text-xs text-slate-400">Generate notes, play interactive math/science quizzes, make cover templates or balance daily routes free of cost.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-140 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-400 italic">
                    Designed for classrooms everywhere. Have fun studying today! 🌟
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentTab === "contact" && (
            <div className="space-y-8 animate-in fade-in" id="contact-section">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
                {/* Left Panel Contact Details */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 space-y-6">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white font-display">
                    Connect With Us! 📬
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Have idea suggestions for a new homework tool, or found an issue practicing a quiz? Let us know! Your teachers, parents, or friends can also drop friendly notes.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block font-semibold">Teacher / Student Support</strong>
                        <span className="text-slate-400">support@studenthelperhub.example.com</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block font-semibold">Our Classroom Hub</strong>
                        <span className="text-slate-400">Learning Circle Road, Sector 12, Delhi-NCR, India</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="p-2 rounded-xl bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-405">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block font-semibold">Emergency Helpline desk</strong>
                        <span className="text-slate-400">+1-800-STUDY-FRIEND (9AM - 5PM IST)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Form panel */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border-3 border-yellow-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h4 className="text-md font-bold text-slate-877 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3">
                    Write Your Message 📝
                  </h4>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        placeholder="e.g., Rohan, Aisha"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-yellow-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                        Email Address (or Parent's Email)
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="e.g., student@school.abc"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-707 focus:border-yellow-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-msg" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                        What can we help you with?
                      </label>
                      <textarea
                        id="contact-msg"
                        required
                        rows={3}
                        placeholder="Write down any message or suggestion..."
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-707 focus:border-yellow-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white resize-none"
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitted}
                      className="w-full py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs tracking-wide transition-all shadow border-b-4 border-yellow-600 disabled:opacity-50 cursor-pointer"
                    >
                      {contactSubmitted ? "Calling Study Buddies..." : "Send Message! 🚀"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global floating link shortcut button for Saved Work Hub */}
        {currentTab !== "saved-hub" && savedItems.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 animate-bounce hover:animate-none">
            <button
              onClick={() => {
                setCurrentTab("saved-hub");
                const mainSec = document.getElementById("main-content-section");
                if (mainSec) mainSec.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs shadow-xl transition-transform hover:scale-105 cursor-pointer border-2 border-white dark:border-slate-900"
              title="Go read your bookmarked materials"
            >
              <Save className="w-4 h-4" />
              <span>Saved History ({savedItems.length})</span>
            </button>
          </div>
        )}

      </main>

      {/* Elegant Footer Block */}
      <footer className="bg-white dark:bg-slate-900 border-t-4 border-yellow-250 dark:border-slate-800 transition-colors duration-300 mt-20" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            {/* Branding Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400 dark:bg-yellow-550 p-1.5 rounded-lg text-slate-900">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-md text-slate-900 dark:text-white font-display">
                  Student Helper <span className="text-sky-500">Hub</span>
                </span>
              </div>
              <p className="text-xs text-slate-450 dark:text-slate-400 max-w-xs leading-relaxed font-sans">
                A simple classroom suite built carefully with child-safe explanations and daily planners to keep learning playful and exciting.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-widest font-display">
                Quick Navigation Links
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button onClick={() => setCurrentTab("notes")} className="text-left text-slate-500 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Simple Notes</button>
                <button onClick={() => setCurrentTab("chapter-learning")} className="text-left text-emerald-650 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-white cursor-pointer font-bold">Chapter Learning</button>
                <button onClick={() => setCurrentTab("answers-solver")} className="text-left text-indigo-650 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-white cursor-pointer font-bold">Answer Solver</button>
                <button onClick={() => setCurrentTab("quiz")} className="text-left text-slate-500 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Practice Quiz</button>
                <button onClick={() => setCurrentTab("planner")} className="text-left text-slate-500 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Task Planner</button>
                <button onClick={() => setCurrentTab("word-meanings")} className="text-left text-slate-500 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Word Meanings</button>
                <button onClick={() => setCurrentTab("book-review")} className="text-left text-slate-505 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Book Review</button>
                <button onClick={() => setCurrentTab("project-format")} className="text-left text-slate-505 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Project Form</button>
                <button onClick={() => setCurrentTab("timetable")} className="text-left text-slate-505 hover:text-sky-505 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium">Study Planner</button>
              </div>
            </div>

            {/* Support Desk Column */}
            <div className="space-y-3">
              <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-widest font-display">
                Curriculum Grades Support
              </h5>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-normal font-sans">
                Covering primary, middle, and high school chapters for Class 1 up to Class 12 studies.
              </p>
              <div className="flex flex-wrap gap-1.5 text-slate-400 dark:text-slate-350 max-w-[280px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-bold font-mono">Class 1-5</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-bold font-mono">Class 6-8</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-bold font-mono">Class 9-10</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-bold font-mono">Class 11-12</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4" id="copyright-box">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for school students globally. All rights reserved &copy; 2026.
            </span>
            <div className="flex gap-4">
              <button onClick={() => setCurrentTab("about")} className="hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</button>
              <button onClick={() => setCurrentTab("contact")} className="hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors">Student Helpdesk Terms</button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
