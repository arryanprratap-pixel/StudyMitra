import { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  BookOpen, Award, CheckCircle2, Save, Timer, Plus, Minus, Coffee, Zap, Info
} from "lucide-react";
import { copyToClipboard, getClassLevelStyle } from "../utils";
import { SavedWorkItem } from "../types";

interface StudyTimerProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

export default function StudyTimer({ onSaveWork }: StudyTimerProps) {
  const [classNum, setClassNum] = useState<string>("8");
  const [subject, setSubject] = useState<string>("Science");
  const [focusNotes, setFocusNotes] = useState<string>("");
  const [sessionSaved, setSessionSaved] = useState<boolean>(false);

  // Timer states
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [preset, setPreset] = useState<"pomodoro" | "short" | "long" | "custom">("pomodoro");
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Total completed sessions this page load
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [showCompletionConfetti, setShowCompletionConfetti] = useState<boolean>(false);

  // References for keeping track of time
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const style = getClassLevelStyle(classNum);

  // Pre-configured times based on class levels to nudge appropriate behavior
  useEffect(() => {
    if (preset === "custom") return;

    if (style.tier === "kinder") {
      setMinutes(mode === "focus" ? 10 : 3);
      setSeconds(0);
    } else if (style.tier === "elementary") {
      setMinutes(mode === "focus" ? 15 : 5);
      setSeconds(0);
    } else {
      if (preset === "pomodoro") {
        setMinutes(mode === "focus" ? 25 : 5);
      } else if (preset === "short") {
        setMinutes(mode === "focus" ? 15 : 3);
      } else if (preset === "long") {
        setMinutes(mode === "focus" ? 45 : 10);
      }
      setSeconds(0);
    }
    setIsActive(false);
  }, [classNum, mode, preset]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Web Audio API Synthesizer chime to play safe, offline sound without remote assets
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Play a beautiful dual bell chime
      const playTone = (freq: number, delay: number, length: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + length);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + length);
      };

      // F major chord tones
      playTone(523.25, 0, 0.8); // C5
      playTone(659.25, 0.15, 0.8); // E5
      playTone(783.99, 0.3, 1.2); // G5
    } catch (e) {
      console.warn("Audio Context beep was blocked by iframe/browser security policies.", e);
    }
  };

  // Main countdown process
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (seconds === 0) {
          if (minutes > 0) {
            setMinutes(prev => prev - 1);
            setSeconds(59);
          } else {
            // Timer Finished!
            setIsActive(false);
            playChime();
            
            if (timerRef.current) clearInterval(timerRef.current);

            if (mode === "focus") {
              setCompletedCount(prev => prev + 1);
              setShowCompletionConfetti(true);
              setSessionSaved(false);
              alert(
                style.tier === "kinder" || style.tier === "elementary" 
                  ? "🎉 Amazing job! You completed your learning minutes! Let's take a happy little rest now!" 
                  : "🏆 Focus block completed successfully! Great stamina. Time to stretch and rest your eyes!"
              );
            } else {
              alert("🧠 Brain rest is over! Ready to return and conquer your study targets?");
            }
            
            // Toggle mode automatically
            setMode(prev => prev === "focus" ? "break" : "focus");
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds, mode]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    if (preset === "custom") {
      setMinutes(25);
    } else {
      if (style.tier === "kinder") {
        setMinutes(mode === "focus" ? 10 : 3);
      } else if (style.tier === "elementary") {
        setMinutes(mode === "focus" ? 15 : 5);
      } else {
        if (preset === "pomodoro") setMinutes(mode === "focus" ? 25 : 5);
        if (preset === "short") setMinutes(mode === "focus" ? 15 : 3);
        if (preset === "long") setMinutes(mode === "focus" ? 45 : 10);
      }
    }
  };

  const adjustMinutes = (amount: number) => {
    setPreset("custom");
    const newVal = Math.max(1, Math.min(180, minutes + amount));
    setMinutes(newVal);
    setSeconds(0);
    setIsActive(false);
  };

  const handleManualComplete = () => {
    setIsActive(false);
    playChime();
    setCompletedCount(prev => prev + 1);
    setShowCompletionConfetti(true);
    setSessionSaved(false);
    setMode("break");
    setMinutes(style.tier === "kinder" ? 3 : 5);
    setSeconds(0);
  };

  const progressTotalSeconds = (() => {
    let focusMin = 25;
    let breakMin = 5;

    if (style.tier === "kinder") {
      focusMin = 10;
      breakMin = 3;
    } else if (style.tier === "elementary") {
      focusMin = 15;
      breakMin = 5;
    } else {
      if (preset === "pomodoro") { focusMin = 25; breakMin = 5; }
      else if (preset === "short") { focusMin = 15; breakMin = 3; }
      else if (preset === "long") { focusMin = 45; breakMin = 10; }
      else { return 1; }
    }

    const totalSeconds = (mode === "focus" ? focusMin : breakMin) * 60;
    return totalSeconds || 1;
  })();

  const currentRemainingSeconds = minutes * 60 + seconds;
  const progressPercentage = preset === "custom" 
    ? 100 
    : Math.max(0, Math.min(100, Math.round((currentRemainingSeconds / progressTotalSeconds) * 100)));

  // Save session details to Central work hub
  const handleSaveSession = () => {
    const focusTimeStr = preset === "custom" 
      ? `Custom study block` 
      : `${mode === "focus" ? "Active Study Interval" : "Rest Period"}`;

    const studyReport = `# 🗓️ Study Session Completed Log: ${subject}
*Class ${classNum} • Calibrated for standard: ${style.tier.toUpperCase()} • Mode: ${mode === "focus" ? "FOCUS BLOCK" : "REST"}*

---
### 🏆 Session Summary:
- **Major Target Subject**: **${subject}**
- **Syllabus Category**: Calibrated at ${style.difficulty} level.
- **Duration Model**: Presetted to **${preset.toUpperCase()}** parameters.
- **Custom logged details**: 
  > *"${focusNotes.trim() || "Studying textbook chapters & practicing assignments with concentration."}"*

---
### 🧠 Cognitive Alignment Tip (Class ${classNum}):
* ${style.tier === "kinder" ? "Drawing and counting objects while learning triggers playful neural rewards." : ""}
* ${style.tier === "elementary" ? "Discussing these points with your parents after class ensures deep memory recall!" : ""}
* ${style.tier === "middle" ? "Solving standard 5-question mock interactive tasks cements textbook theory smoothly." : ""}
* ${style.tier === "secondary" ? "Formulating three-stage concept flowcharts saves time during final school exams." : ""}
* ${style.tier === "senior" ? "Deriving equations from baseline mathematical concepts eliminates manual cramming and builds university confidence." : ""}

*Keep tracking your study minutes to score perfect marks! Private LocalStorage file saved successfully.*`;

    onSaveWork({
      type: "Study Timer Log",
      title: `Study Log: ${subject} • Class ${classNum}`,
      content: studyReport,
      metadata: {
        subject,
        classNum,
        tier: style.tier,
        notes: focusNotes || "General Study Session"
      }
    });

    setSessionSaved(true);
    setTimeout(() => {
      setShowCompletionConfetti(false);
    }, 4000);
  };

  // Kid friendly rewards quotes list
  const getMotivationalQuote = () => {
    if (style.tier === "kinder") {
      return "🌟 You are doing so beautiful! Draw some stars on your paper!";
    }
    if (style.tier === "elementary") {
      return "💡 Focus for 15 minutes, then enjoy a cool glass of sweet milk!";
    }
    if (style.tier === "middle") {
      return "📚 'Success is the sum of small school efforts, repeated day in and day out.'" ;
    }
    if (style.tier === "secondary") {
      return "⚡ 'Focus is a muscle. Every Pomodoro interval you complete builds stronger exam recall!'" ;
    }
    return "🔬 'Deep work is the superpower of the 21st century. Eliminate friction, derive clearly, master variables.'";
  };

  return (
    <div id="study-timer-component" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Visual Header Grid wrapper */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl">
              <Timer className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white font-display flex items-center gap-2">
                Study Session Timer <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300 border border-red-200/50">Pomodoro Mode</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Stay aligned and focused. We calibrate counts and memory quotes to fit primary, middle, or board-exam classes!
              </p>
            </div>
          </div>

          {/* Quick Sound toggle & session count */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-display text-xs font-bold flex items-center gap-2 border border-indigo-100 dark:border-indigo-900">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Intervals Done: {completedCount}</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-2xl cursor-pointer transition-colors border ${
                soundEnabled 
                  ? "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-yellow-400" 
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900 text-red-500"
              }`}
              title={soundEnabled ? "Alert Sound is ON" : "Alert Sound is MUTED"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dashboard split content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Calibration Controls (Form & Logs) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                1. Calibrate Your School State:
              </h3>

              {/* Class Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-705 dark:text-slate-400 mb-2">
                  Select Your Class / Grade Level:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["2", "5", "8", "10", "12"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setClassNum(num)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-mono font-bold border transition-all ${
                        classNum === num
                          ? "bg-yellow-400 border-yellow-500 text-slate-900 shadow-sm font-black"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 dark:text-white"
                      }`}
                    >
                      {num === "2" ? "Class 1-2" : num === "5" ? "Class 3-5" : num === "8" ? "Class 6-8" : num === "10" ? "Class 9-10" : "Class 11-12"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject dropdown selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-705 dark:text-slate-405 mb-1">
                  Choose Subject to Study:
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-750 outline-none text-xs font-display dark:bg-slate-900 dark:text-white focus:border-yellow-400"
                >
                  <option value="Science">🧪 Science & EVS</option>
                  <option value="Mathematics">📐 Mathematics & Algebra</option>
                  <option value="English Literature">📖 English & Grammar</option>
                  <option value="Social Studies">🌍 Social Studies & History</option>
                  <option value="General Revision">🧠 General Workspace Homework</option>
                </select>
              </div>

              {/* Active task notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-705 dark:text-slate-405 mb-1.5 flex justify-between items-center">
                  <span>Focus Notes (What are you reading?):</span>
                  <span className="text-[10px] text-slate-400 italic">Optional</span>
                </label>
                <textarea
                  value={focusNotes}
                  onChange={(e) => setFocusNotes(e.target.value)}
                  rows={2}
                  placeholder={
                    style.tier === "kinder" 
                      ? "e.g., Drawing smiling animals or counting flowers page 4" 
                      : "e.g., Revising cell organelles or solving trigonometry numericals"
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs font-sans dark:bg-slate-900 dark:text-white focus:border-yellow-400 resize-none"
                />
              </div>
            </div>

            {/* Micro details panel indicating class standard changes */}
            <div className="p-4 rounded-xl border border-blue-105 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/40 text-xs flex gap-3">
              <Info className="w-5 h-5 text-sky-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-sky-300">
                  {style.tier === "kinder" && "👶 Kindergarten Mode Active"}
                  {style.tier === "elementary" && "🎒 Elementary Focus Active"}
                  {style.tier === "middle" && "📖 Middle-School Syllabus Plan"}
                  {style.tier === "secondary" && "🎯 Board Exam Calibration Level"}
                  {style.tier === "senior" && "🎓 Advanced Senior Study Active"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                  Focus cycles adjusted automatically to **{style.tier === "kinder" ? "10m" : style.tier === "elementary" ? "15m" : "25m"}** to lock maximum memory retention safely.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Countdown Visual Arena */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
            
            {/* Countdown Shell Graphic wrapper */}
            <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-md">
              
              {/* Spinning circular progress border using dynamic CSS values */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="144"
                  cy="144"
                  r="138"
                  fill="transparent"
                  stroke={mode === "focus" ? "#E2E8F0" : "#F1F5F9"}
                  strokeWidth="8"
                  className="dark:stroke-slate-800"
                />
                <circle
                  cx="144"
                  cy="144"
                  r="138"
                  fill="transparent"
                  stroke={mode === "focus" ? "#F59E0B" : "#10B981"}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 138}
                  strokeDashoffset={2 * Math.PI * 138 * (1 - progressPercentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Central Time Indicators */}
              <div className="z-10 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm bg-yellow-100 text-yellow-805 dark:bg-yellow-950 dark:text-yellow-405">
                  {mode === "focus" ? (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-yellow-500 animate-pulse text-yellow-600" />
                      <span>Focusing Period</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Brain Recovery Break</span>
                    </>
                  )}
                </div>

                <div className="text-5xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tighter">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>

                <p className="text-[10px] text-slate-400 font-mono">
                  {preset === "custom" ? "Custom Adjuster" : `${progressPercentage}% remaining`}
                </p>

                {/* Micro Plus/Minus Minutes Adjusters for custom setup */}
                <div className="flex justify-center gap-1.5 pt-1">
                  <button
                    onClick={() => adjustMinutes(-1)}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-white transition-colors cursor-pointer"
                    title="-1 minute"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => adjustMinutes(1)}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-white transition-colors cursor-pointer"
                    title="+1 minute"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Presets Row (Hidden for Kinder/Elementary to avoid bloating young minds) */}
            {style.tier !== "kinder" && style.tier !== "elementary" && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => { setPreset("pomodoro"); setMode("focus"); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-display transition-all border ${
                    preset === "pomodoro" 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 dark:text-slate-300"
                  }`}
                >
                  ⏱️ Pomodoro (25m)
                </button>
                <button
                  onClick={() => { setPreset("short"); setMode("focus"); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-display transition-all border ${
                    preset === "short" 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 dark:text-slate-300"
                  }`}
                >
                  ⏰ Quick Revision (15m)
                </button>
                <button
                  onClick={() => { setPreset("long"); setMode("focus"); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-display transition-all border ${
                    preset === "long" 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 dark:text-slate-300"
                  }`}
                >
                  🎯 Exam Deep Study (45m)
                </button>
              </div>
            )}

            {/* Action control bar */}
            <div className="flex items-center gap-4 w-full justify-center">
              <button
                onClick={handleResetTimer}
                className="p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white transition-all shadow-sm cursor-pointer hover:rotate-45"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handleToggleTimer}
                style={{ contentVisibility: "auto" }}
                className={`py-3.5 px-8 rounded-full font-display font-bold text-sm shadow-md transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900" 
                    : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-b-4 border-yellow-600"
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Studying!</span>
                  </>
                )}
              </button>

              {/* Fast Skip Option */}
              <button
                onClick={handleManualComplete}
                className="p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white transition-all shadow-sm cursor-pointer"
                title="Simulate / Force Finish Cycle"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </button>
            </div>

            {/* MOTIVATIONAL BOX QUOTES FEED */}
            <div className="p-4 rounded-2xl bg-yellow-50/50 dark:bg-yellow-950/20 border-2 border-yellow-105/50 text-center max-w-sm w-full">
              <span className="text-sm">🌟</span>
              <p className="text-xs text-yellow-905 dark:text-yellow-405 italic mt-1 font-sans font-medium">
                {getMotivationalQuote()}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* SUCCESS COMPLETION REWARD PANEL CONGRATULATORY CARD */}
      {showCompletionConfetti && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl animate-in fade-in zoom-in-95 duration-500 border-b-4 border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex p-2 rounded-xl bg-white/20 text-white shadow-inner mb-2 md:mb-0">
              <Award className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-xl font-black font-display tracking-tight flex items-center justify-center md:justify-start gap-2">
              Outstanding Work Champ! 🎉
            </h3>
            <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
              You completed a fully focused study block for <strong>{subject}</strong>. Your brain formed stable connections which will directly aid your homework and midterm scores. Let's record this milestone!
            </p>
          </div>

          <div className="shrink-0 flex gap-2">
            <button
              onClick={handleSaveSession}
              disabled={sessionSaved}
              className={`py-3 px-6 rounded-2xl font-display font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border-b-4 ${
                sessionSaved 
                  ? "bg-emerald-700 hover:bg-emerald-700 text-emerald-350 border-transparent cursor-not-allowed" 
                  : "bg-white hover:bg-slate-100 text-slate-900 border-slate-300"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{sessionSaved ? "Saved to History! ✓" : "Save Log to Hub!"}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
