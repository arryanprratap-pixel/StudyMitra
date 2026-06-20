import { useState } from "react";
import { BrainCircuit, Loader2, RefreshCw, CheckCircle2, XCircle, ArrowRight, Award, Copy, Download, Sparkles } from "lucide-react";
import { QuizQuestion } from "../types";
import { copyToClipboard, downloadTextFile } from "../utils";

function getLocalQuiz(classNum: string, subject: string): any[] {
  return [
    {
      id: 1,
      question: `Which of the following is a key foundational concept in Class ${classNum} ${subject}?`,
      options: [
        "The primary core curriculum standard",
        "A completely unrelated theory",
        "An advanced university-level equation",
        "A random guesswork answer"
      ],
      correctAnswer: "The primary core curriculum standard",
      explanation: `At a Class ${classNum} level, focusing on the primary curriculum of ${subject} ensures you build rich, lasting mastery.`
    },
    {
      id: 2,
      question: `What is highly recommended when completing homework tasks for ${subject}?`,
      options: [
        "Breaking problems into direct steps and writing key terminologies",
        "Leaving your textbook completely unread",
        "Cramming formula sheets the night before without understanding",
        "Copying your classmate's sheets exactly"
      ],
      correctAnswer: "Breaking problems into direct steps and writing key terminologies",
      explanation: "Organizing your worksheets step-by-step activates deep memory and yields maximum standard grades!"
    },
    {
      id: 3,
      question: "Which of these is the most effective approach to revise for standard school tests?",
      options: [
        "Reading summarized cards, active testing, and solving mini MCQs",
        "Continuous rereading of a single paragraph without attention",
        "Waiting until final hour of examinations to study",
        "Skipping all definitions that look difficult"
      ],
      correctAnswer: "Reading summarized cards, active testing, and solving mini MCQs",
      explanation: "Retrieving study info through quizzes simulates core recall, which is prime exam preparation."
    },
    {
      id: 4,
      question: `In Class ${classNum}, what should a student do if they face a complex doubt in ${subject}?`,
      options: [
        "Discuss with class peers or ask your teacher for guidance",
        "Fold the textbook and stop learning that chapter",
        "Write down a random default answer in your exams",
        "Postpone standard revision permanently"
      ],
      correctAnswer: "Discuss with class peers or ask your teacher for guidance",
      explanation: "Asking questions removes blockages and keeps your educational pathway continuous and exciting."
    },
    {
      id: 5,
      question: "How does StudyMitra / Student Helper Hub assist daily school prep?",
      options: [
        "By offering instant summaries, answer solvers, and custom schedules",
        "By writing and signing formal exam sheets on your behalf",
        "By physical delivery of school board notebooks",
        "By deleting your teacher's assignment checklists"
      ],
      correctAnswer: "By offering instant summaries, answer solvers, and custom schedules",
      explanation: "StudyMitra is an excellent companion that structures homework files, meaning finders, and plans safely."
    }
  ];
}

export default function QuizPractice() {
  const [classNum, setClassNum] = useState("7");
  const [subject, setSubject] = useState("Science");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerLog, setAnswerLog] = useState<{ question: string; chosen: string; correct: string; isCorrect: boolean }[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setAnswerLog([]);

    try {
      const response = await fetch("/api/generate/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classNum, subject }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to make quiz. Please try again.");
      }

      const data = await response.json();
      if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error("Invalid format returned by classroom generator.");
      }
      setQuestions(data.quiz);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Quiz API failed. Starting a curated local 5-question quiz automatically:", err);
      const offlineQuiz = getLocalQuiz(classNum, subject);
      setQuestions(offlineQuiz);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceClick = (option: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !questions[currentIdx]) return;
    
    const currentQ = questions[currentIdx];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswerLog((prev) => [
      ...prev,
      {
        question: currentQ.question,
        chosen: selectedAnswer,
        correct: currentQ.correctAnswer,
        isCorrect,
      },
    ]);

    setHasSubmitted(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const currentQ = questions[currentIdx];

  // Generate a shareable report text of the quiz
  const getQuizReportText = () => {
    let report = `=== STUDENT PRACTICE QUIZ REPORT ===\n`;
    report += `Subject: ${subject} | Class: ${classNum}\n`;
    report += `Score: ${score} / ${questions.length}\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n\n`;
    answerLog.forEach((item, index) => {
      report += `Q${index + 1}: ${item.question}\n`;
      report += `Your Answer: ${item.chosen} ${item.isCorrect ? "✅ (Correct)" : "❌ (Incorrect)"}\n`;
      if (!item.isCorrect) {
        report += `Correct Answer: ${item.correct}\n`;
      }
      report += `----------------------------------------\n`;
    });
    report += `Generated via Student Helper Hub`;
    return report;
  };

  const handleCopyReport = async () => {
    const text = getQuizReportText();
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReport = () => {
    const text = getQuizReportText();
    const cleanFilename = `${subject.toLowerCase()}-class-${classNum}-quiz-score-${score}.txt`;
    downloadTextFile(cleanFilename, text);
  };

  return (
    <div className="space-y-8" id="quiz-practice">
      {/* Description Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-yellow-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Quiz Practice Challenge
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your subject and class to generate a five-question interactive quiz. Match wits with friendly AI, see instant answers, and earn special badges!
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-950 p-5 rounded-3xl text-sm" id="quiz-error">
          <strong>Could not start quiz:</strong> {error}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-3xl mx-auto">
        {questions.length === 0 && !loading ? (
          /* Landing options */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-3 border-yellow-250 dark:border-slate-800 shadow-sm">
            <h4 className="text-lg font-bold text-slate-950 dark:text-white font-display mb-6 text-center">
              Configure Your Practice Quiz 🎒
            </h4>

            <form onSubmit={handleStartQuiz} className="space-y-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quiz-class" className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 font-display">
                    Your Class / Grade
                  </label>
                  <select
                    id="quiz-class"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-705 focus:border-yellow-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
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
                  <label htmlFor="quiz-subject" className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 font-display">
                    Subject Field
                  </label>
                  <select
                    id="quiz-subject"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-705 focus:border-yellow-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Science">Science (Physics/Chem/Bio)</option>
                    <option value="Social Studies">Social Studies (History/Civics)</option>
                    <option value="English">English Grammar / Books</option>
                    <option value="Mathematics">Mathematics Basics</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-display font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#B45309]"
                id="quiz-start-submit"
              >
                <RefreshCw className="w-5 h-5" />
                Generate My Practice Quiz!
              </button>
            </form>
          </div>
        ) : loading ? (
          /* Loading Screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border-3 border-yellow-200 dark:border-slate-800 text-center space-y-4 shadow-sm" id="quiz-loading">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white font-display">
                Sharpening Pencils... ✏️
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                We are talking to the virtual school teacher to create 5 interesting questions customized specifically for Class {classNum} {subject}. Hold tight!
              </p>
            </div>
          </div>
        ) : quizFinished ? (
          /* Results Summary badge screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-4 border-emerald-400 dark:border-slate-800 text-center space-y-6 shadow-md" id="quiz-finished-screen">
            <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-500 mb-2">
              <Award className="w-14 h-14 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                Quiz Completed! 🎉
              </h3>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                You Scored: <span className="text-emerald-500 font-extrabold text-2xl">{score} / {questions.length}</span>
              </p>
            </div>

            {/* Badge Assignment */}
            <div className="max-w-sm mx-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-205 dark:border-slate-700">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-semibold mb-1">
                YOUR MERIT BADGE
              </span>
              <span className="text-xl font-bold text-slate-800 dark:text-yellow-400 font-display">
                {score === 5 && "🥇 Golden Genius Scholar Badge!"}
                {score === 4 && "⭐ High Achiever Badge!"}
                {score === 3 && "🌟 Bright Spark Mind!"}
                {score < 3 && "✊ Dedicated Challenger badge!"}
              </span>
              <p className="text-xs text-slate-400 mt-1.5">
                {score === 5 && "Awesome! You obtained a clean perfect score. Exceptional textbook knowledge!"}
                {score === 4 && "Fantastic! You missed just one question. Keep up the brilliant focus!"}
                {score === 3 && "Good effort! A few corrections, but you did a super clean job."}
                {score < 3 && "Nice attempt! Review the correct solutions below and try again. Practice makes perfect!"}
              </p>
            </div>

            {/* Detailed Answers Breakdown */}
            <div className="text-left space-y-4 max-h-[300px] overflow-y-auto border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-inner">
              <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2 font-display">
                Answer Key & Review:
              </h5>
              {answerLog.map((log, idx) => (
                <div key={idx} className="border-b last:border-0 border-slate-100 dark:border-slate-800/60 pb-3 last:pb-0 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Q{idx + 1}: {log.question}
                  </p>
                  <p className={`mt-1 font-medium ${log.isCorrect ? "text-emerald-650" : "text-rose-600"}`}>
                    Your selection: {log.chosen} {log.isCorrect ? "✅" : "❌"}
                  </p>
                  {!log.isCorrect && (
                    <p className="text-emerald-700 font-bold mt-0.5">
                      Correct: {log.correct}
                    </p>
                  )}
                  {questions[idx]?.explanation && (
                    <p className="text-slate-400 italic mt-0.5 font-sans">
                      Reason: {questions[idx].explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Actions for quiz report */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleCopyReport}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? "Copied Report!" : "Copy Full Report"}
              </button>
              
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Download Report (.txt)
              </button>

              <button
                onClick={() => {
                  setQuestions([]);
                  setQuizFinished(false);
                }}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow border-b-2 border-yellow-600"
              >
                Change Options & Play Again
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Carousel */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-yellow-250 dark:border-slate-800 shadow-sm overflow-hidden" id="quiz-question-box">
            {/* Status indicator bar */}
            <div className="bg-yellow-50 dark:bg-slate-850 px-6 py-4 border-b-2 border-yellow-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-slate-708 dark:text-slate-300 font-display">
                  Grade {classNum} {subject} Practice
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white px-3 py-1 bg-yellow-200 dark:bg-yellow-950/70 rounded-full font-display">
                Score: {score}
              </div>
            </div>

            {/* Question Card Content */}
            <div className="p-6 md:p-8 space-y-6">
              {isDemo && currentIdx === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <span className="text-base">💡</span>
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Offline Calibration Mode</p>
                    <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                      This is an offline study quiz. To unlock unlimited real-time generation on any book chapter, set your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-950 dark:text-amber-100">GEMINI_API_KEY</code> under the settings secrets panel.
                    </p>
                  </div>
                </div>
              )}
              <h4 className="text-lg font-bold text-slate-905 dark:text-white leading-relaxed font-display">
                {currentQ.question}
              </h4>

              {/* Choices List */}
              <div className="space-y-3" id="quiz-options-list">
                {currentQ.options.map((option, index) => {
                  const prefix = ["A", "B", "C", "D"][index];
                  
                  // Style modifiers based on state
                  let btnStyle = "border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800/60";
                  let badgeStyle = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                  
                  if (selectedAnswer === option) {
                    btnStyle = "bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-800 dark:text-sky-305";
                    badgeStyle = "bg-sky-500 text-white";
                  }

                  if (hasSubmitted) {
                    if (option === currentQ.correctAnswer) {
                      btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 pointer-events-none";
                      badgeStyle = "bg-emerald-500 text-white";
                    } else if (selectedAnswer === option) {
                      btnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-450 text-rose-800 dark:text-rose-300 pointer-events-none";
                      badgeStyle = "bg-rose-500 text-white";
                    } else {
                      btnStyle = "border-slate-100 dark:border-slate-850 opacity-40 pointer-events-none text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleChoiceClick(option)}
                      disabled={hasSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className={`w-8 h-8 rounded-xl font-display font-bold text-xs flex items-center justify-center flex-shrink-0 ${badgeStyle}`}>
                        {prefix}
                      </span>
                      <span className="text-sm font-semibold font-sans">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback box */}
              {hasSubmitted && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-350 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-201 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedAnswer === currentQ.correctAnswer ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" /> Excellent Job! Correct!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="w-5 h-5" /> Nice try, but not quite correct.
                      </span>
                    )}
                  </div>
                  {currentQ.explanation && (
                    <p className="text-xs text-slate-500 dark:text-slate-350 font-sans leading-relaxed">
                      💡 <strong>Teacher explanation:</strong> {currentQ.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Control Panels */}
            <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              {!hasSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-5 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-yellow-500 hover:bg-yellow-600 border-b-2 border-yellow-700 disabled:opacity-40 select-none cursor-pointer"
                >
                  Confirm Choice
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-sky-500 hover:bg-sky-600 border-b-2 border-sky-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {currentIdx + 1 === questions.length ? "Finish Quiz & View Badge" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
