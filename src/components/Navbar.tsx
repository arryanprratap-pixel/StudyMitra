import { useState } from "react";
import { GraduationCap, Sun, Moon, Menu, X, BookOpen, Clock, ListTodo } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export default function Navbar({ currentTab, setCurrentTab, isDark, setIsDark }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "notes", label: "Simple Notes" },
    { id: "quiz", label: "Quiz Practice" },
    { id: "planner", label: "Homework Planner" },
    { id: "word-meanings", label: "Word Meanings" },
    { id: "book-review", label: "Book Review Maker" },
    { id: "project-format", label: "Project Format" },
    { id: "timetable", label: "Study Timetable" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    
    // Smooth scroll to content top
    const topOfContent = document.getElementById("main-content-section");
    if (topOfContent) {
      topOfContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b-4 border-yellow-200 dark:border-slate-800 transition-colors duration-300 shadow-sm" id="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentTab("home")} 
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo"
          >
            <div className="bg-yellow-400 dark:bg-yellow-500 text-slate-900 p-2 rounded-xl shadow-md group-hover:rotate-6 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1 font-display">
                Student Helper <span className="text-sky-500 font-bold">Hub</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">
                Simple study help for every student
              </p>
            </div>
          </div>

          {/* Desktop Nav Menus */}
          <div className="hidden lg:flex items-center gap-1" id="nav-desktop-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-xs font-display font-medium transition-all duration-200 ${
                  currentTab === item.id
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                }`}
                id={`tab-btn-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions: Theme Toggle & Responsive Burger */}
          <div className="flex items-center gap-2" id="nav-actions">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggler"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
              id="burger-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-top-4 duration-200" id="mobile-menu-drawer">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium font-display transition-all duration-150 ${
                  currentTab === item.id
                    ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 pl-6"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                }`}
                id={`mobile-tab-btn-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
