import { useState, useEffect } from "react";
import { ListTodo, Trash2, CheckSquare, Square, Calendar, Plus, Sparkles, Trophy, Download } from "lucide-react";
import { HomeworkTask } from "../types";
import { downloadTextFile } from "../utils";

export default function HomeworkPlanner() {
  const [tasks, setTasks] = useState<HomeworkTask[]>([]);
  const [taskText, setTaskText] = useState("");
  const [subject, setSubject] = useState("Science");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("student_tasks");
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load tasks from local storage", e);
    }
  }, []);

  // Save to LocalStorage
  const saveTasks = (newTasks: HomeworkTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem("student_tasks", JSON.stringify(newTasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask: HomeworkTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      task: taskText.trim(),
      subject,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      priority,
      completed: false,
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setTaskText("");
    // Default next due date to today
    setDueDate("");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const clearCompleted = () => {
    const updated = tasks.filter((t) => !t.completed);
    saveTasks(updated);
  };

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "active") return !t.completed;
    return true;
  });

  const generatePlannerText = () => {
    let report = `=== MY STUDENT HOMEWORK PLANNER ===\n`;
    report += `Generated On: ${new Date().toLocaleDateString()}\n`;
    report += `Active Tasks: ${activeCount} | Completed Tasks: ${completedCount}\n`;
    report += `===================================\n\n`;

    const remaining = tasks.filter((t) => !t.completed);
    if (remaining.length > 0) {
      report += `⏳ REMAINING TASKS:\n`;
      remaining.forEach((t, i) => {
        report += `${i + 1}. [ ] ${t.task} (${t.subject}) - Due: ${t.dueDate} [Priority: ${t.priority.toUpperCase()}]\n`;
      });
      report += `\n`;
    }

    const done = tasks.filter((t) => t.completed);
    if (done.length > 0) {
      report += `✅ COMPLETED TASKS:\n`;
      done.forEach((t, i) => {
        report += `${i + 1}. [x] ${t.task} (${t.subject}) - Completed\n`;
      });
    }

    report += `\nKeep up the great study work!\nPowered by Student Helper Hub`;
    return report;
  };

  const handleDownloadPlanner = () => {
    const text = generatePlannerText();
    downloadTextFile(`student-homework-planner-${new Date().toISOString().slice(0, 10)}.txt`, text);
  };

  // Pre-fill a sample planner to inspire them if empty
  const loadDemoTasks = () => {
    const demo: HomeworkTask[] = [
      {
        id: "demo-1",
        task: "Read Chapter 4 of Science Book (Living Organisms)",
        subject: "Science",
        dueDate: new Date().toISOString().slice(0, 10),
        priority: "high",
        completed: false,
      },
      {
        id: "demo-2",
        task: "Solve Exercises 1 to 5 in Maths homework copy",
        subject: "Mathematics",
        dueDate: new Date(Date.now() + 86450000).toISOString().slice(0, 10),
        priority: "medium",
        completed: false,
      },
      {
        id: "demo-3",
        task: "Fill political map with Indian rivers",
        subject: "Social Studies",
        dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
        priority: "low",
        completed: true,
      },
    ];
    saveTasks(demo);
  };

  return (
    <div className="space-y-8" id="homework-planner">
      {/* Overview Block */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#10B981]/20 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Homework & School Task Planner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep a check on your assignments. Add new school tasks, set subject categories and importance, then tick them off cleanly!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planner Left Form Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3">
            Add New Lesson Task 📖
          </h3>

          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="task-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                What is the homework task?
              </label>
              <textarea
                id="task-input"
                rows={2}
                maxLength={100}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white transition-all placeholder:text-slate-400 resize-none"
                placeholder="e.g., Read chapter 2 and do page 15 questions"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="planner-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                Subject
              </label>
              <select
                id="planner-subject"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-705 focus:border-emerald-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Science">Science (Physics/Chem/Bio)</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Social Studies">Social Studies / Geography</option>
                <option value="English">English Lit / Language</option>
                <option value="Second Language">Language II / regional</option>
                <option value="Computer Science">Computer Science / Coding</option>
                <option value="GK / Sports">GK or Art & Craft</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="due-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due-date-input"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-705 focus:border-emerald-400 outline-none font-sans text-xs dark:bg-slate-800 dark:text-white cursor-pointer"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="priority-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                  Importance
                </label>
                <select
                  id="priority-select"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-705 focus:border-emerald-400 outline-none font-display font-medium text-xs dark:bg-slate-800 dark:text-white cursor-pointer"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="high">🔴 High priority</option>
                  <option value="medium">🟡 Medium priority</option>
                  <option value="low">🟢 Low priority</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-700"
              id="add-task-btn"
            >
              <Plus className="w-4 h-4" /> Add Task Planner
            </button>
          </form>
        </div>

        {/* Task List Right Panel */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px]">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-emerald-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-grow">
            
            {/* Filter Controllers */}
            <div className="bg-slate-50 dark:bg-slate-855 px-6 py-4 border-b-2 border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-display">Items:</span>
                <div className="flex gap-1" id="planner-filter-buttons">
                  {(["all", "active", "completed"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-display uppercase transition-colors cursor-pointer ${
                        filter === f
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {tasks.length > 0 && (
                  <>
                    <button
                      onClick={handleDownloadPlanner}
                      className="text-xs font-semibold text-slate-650 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Download full routine as text file"
                    >
                      <Download className="w-4 h-4" /> Download Tracker
                    </button>
                    
                    <button
                      onClick={clearCompleted}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-650 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Clear done tasks"
                    >
                      <Trash2 className="w-4 h-4" /> Clear Finished
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Main Listing block */}
            <div className="p-6 flex-grow overflow-y-auto max-h-[500px]">
              {filteredTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-75">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl shadow-inner">
                    📝
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-750 dark:text-slate-350 font-display">
                      {tasks.length === 0 ? "You're All Caught Up!" : "No tasks in this filter!"}
                    </h4>
                    <p className="text-xs text-slate-450 max-w-sm mt-1">
                      {tasks.length === 0 
                        ? "Enter your tasks on the left side to build your customized routine card, or load some school examples below!" 
                        : "Change the navigation filters to see other tasks."}
                    </p>
                    
                    {tasks.length === 0 && (
                      <button
                        onClick={loadDemoTasks}
                        className="mt-4 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-605 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold font-display shadow-sm cursor-pointer transition-colors"
                      >
                        Load Study Examples 💡
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3" id="planner-tasks-list">
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-start justify-between gap-4 p-4 rounded-2xl border-2 transition-all ${
                        t.completed
                          ? "bg-slate-50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-850 opacity-60"
                          : "bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 hover:border-slate-205 dark:hover:border-slate-750"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Custom Checkbox */}
                        <button
                          onClick={() => toggleTask(t.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                        >
                          {t.completed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <p className={`text-sm font-semibold leading-snug ${t.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-white"}`}>
                            {t.task}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 font-display">
                              {t.subject}
                            </span>
                            
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-350 flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5" /> Due: {t.dueDate}
                            </span>

                            {/* Priority tags badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                              t.priority === "high"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                : t.priority === "medium"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                                : "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title="Delete this task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress indicators bottom count */}
            {tasks.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-xs font-semibold text-slate-505 dark:text-slate-400 font-display">
                    Completed: <strong className="text-emerald-560">{completedCount}</strong>
                  </span>
                  <span className="text-xs font-semibold text-slate-505 dark:text-slate-400 font-display">
                    Pending: <strong className="text-slate-700 dark:text-slate-205">{activeCount}</strong>
                  </span>
                </div>

                {tasks.length > 0 && activeCount === 0 && (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 text-[11px] font-bold font-display animate-bounce">
                    <Trophy className="w-4 h-4" /> Awesome! All homework finished!
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
