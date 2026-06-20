import { useState } from "react";
import { BrainCircuit, Loader2, RefreshCw, CheckCircle2, XCircle, ArrowRight, Award, Copy, Download, Sparkles } from "lucide-react";
import { QuizQuestion } from "../types";
import { copyToClipboard, downloadTextFile, getClassLevelStyle } from "../utils";

function getLocalQuiz(classNum: string, subject: string): any[] {
  const style = getClassLevelStyle(classNum);

  if (style.tier === "kinder") {
    return [
      {
        id: 1,
        question: "🌻 Which big, bright yellow object shines in the sky during the daytime?",
        options: ["The warm golden Sun", "The cold silver Moon", "A tiny blinking star", "A big blue raincloud"],
        correctAnswer: "The warm golden Sun",
        explanation: "The Sun is our beautiful golden star that gives us light to play outdoors all day!"
      },
      {
        id: 2,
        question: "🐶 What sound does a happy little puppy make when playing with you?",
        options: ["Woof woof!", "Meow meow!", "Quack quack!", "Moo moo!"],
        correctAnswer: "Woof woof!",
        explanation: "Puppies bark happily to show they want to play and chase balls with you!"
      },
      {
        id: 3,
        question: "🍎 What is the color of a sweet, juicy red apple?",
        options: ["Bright Red", "Ocean Blue", "Dark Purple", "Shiny Black"],
        correctAnswer: "Bright Red",
        explanation: "Apples are delicious fruits that are usually bright red, sweet, and healthy to chew!"
      },
      {
        id: 4,
        question: "🖐️ How many fingers do you have on your one hand?",
        options: ["Five fingers", "Ten fingers", "Two fingers", "Twenty fingers"],
        correctAnswer: "Five fingers",
        explanation: "Show your hand and count: 1, 2, 3, 4, 5! You have five little fingers!"
      },
      {
        id: 5,
        question: "🎨 What is a fun activity to make your homework look colorful?",
        options: ["Using crayons or colored pencils nicely", "Closing your books forever", "Spilling water on worksheets", "Throwing pencils away"],
        correctAnswer: "Using crayons or colored pencils nicely",
        explanation: "Coloring your workbook pages neat makes learning extremely fun and beautiful!"
      }
    ];
  }

  if (style.tier === "elementary") {
    return [
      {
        id: 1,
        question: `Which helper pulls iron nails and paperclips close to it automatically?`,
        options: ["A shiny magnet", "A wooden school ruler", "A plastic water bottle", "A piece of soft paper"],
        correctAnswer: "A shiny magnet",
        explanation: "Magnets possess magnetic fields that grab iron objects from short distances!"
      },
      {
        id: 2,
        question: `What primary role do green leaves play for a plant?`,
        options: ["Preparing healthy food using sunlight", "Holding the plant strong in soil", "Carrying muddy water from roots", "Attracting soil butterflies"],
        correctAnswer: "Preparing healthy food using sunlight",
        explanation: "Leaves acts as food kitchens for plants, capturing sunlight to make simple sugars!"
      },
      {
        id: 3,
        question: "Which of these is a great practice to scores good marks on routine tests?",
        options: ["Solving 5-question mini MCQs and reviewing brief definitions", "Playing computer games all night before exams", "Skipping complex school formulas", "Cramming answers without reading definitions"],
        correctAnswer: "Solving 5-question mini MCQs and reviewing brief definitions",
        explanation: "Active recall simulates the real classroom environment and builds sweet long-term memory!"
      },
      {
        id: 4,
        question: "What state of matter is the drinking water in your bottle?",
        options: ["Liquid state", "Solid ice state", "Hot steam gas state", "Plasmatic fire state"],
        correctAnswer: "Liquid state",
        explanation: "Water flows easily because its particles are loose, characterizing it as a liquid."
      },
      {
        id: 5,
        question: "Why does leaving salty water under hot sunshine leave white powder in a bowl?",
        options: ["Because the liquid water evaporates, leaving salt crystals behind", "Because the sun makes new salt particles", "Because dust settles in the bowl", "Because salt water changes to white sugar"],
        correctAnswer: "Because the liquid water evaporates, leaving salt crystals behind",
        explanation: "Solar heat evaporates the liquid water, causing the heavier salt solutes to crystallize!"
      }
    ];
  }

  if (style.tier === "middle") {
    return [
      {
        id: 1,
        question: `In Class ${classNum} ${subject}, which organelle is considered the 'Powerhouse of the Cell'?`,
        options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
        correctAnswer: "Mitochondria",
        explanation: "Mitochondria perform cellular respiration, releasing chemical ATP energy for vital functions."
      },
      {
        id: 2,
        question: `What fundamental force resists relative sliding between two physical surfaces in contact?`,
        options: ["Friction Force", "Gravitational Attraction", "Magnetic Repulsion", "Electrostatic Charge"],
        correctAnswer: "Friction Force",
        explanation: "Frictional resistance acts opposite to the direction of motion, dependent on surface roughness."
      },
      {
        id: 3,
        question: "What gas is primarily consumed by plants during standard photosynthesis cycles?",
        options: ["Carbon Dioxide", "Oxygen", "Nitrogen Gas", "Helium"],
        correctAnswer: "Carbon Dioxide",
        explanation: "Plants absorb ambient Carbon Dioxide to construct standard carbohydrate structures, releasing oxygen."
      },
      {
        id: 4,
        question: "Which term describes a substance that speeds up a chemical process without being consumed?",
        options: ["Catalyst", "Solvent", "Reactant", "Inhibitor"],
        correctAnswer: "Catalyst",
        explanation: "Catalysts reduce the thermodynamic activation barrier, increasing reaction velocities."
      },
      {
        id: 5,
        question: "What is the primary indicator of an acidic liquid on blue litmus indicators?",
        options: ["The blue litmus turns red", "The lithium changes to deep blue", "The indicator turns transparent", "The liquid starts boiling instantly"],
        correctAnswer: "The blue litmus turns red",
        explanation: "Acidic compounds contain free hydronium ions ($H^+$) which turn standard blue litmus indicators red."
      }
    ];
  }

  if (style.tier === "secondary") {
    return [
      {
        id: 1,
        question: `According to secondary CBSE Class ${classNum} standards, what is the chemical formula of rust?`,
        options: ["Fe2O3 · xH2O", "FeO", "Fe(OH)2", "Fe3O4"],
        correctAnswer: "Fe2O3 · xH2O",
        explanation: "Rusting of iron molecules represents an oxidation process forming hydrated ferric oxides."
      },
      {
        id: 2,
        question: `If an object is placed at the Focus (F) of a concave mirror, where is the final image formed?`,
        options: ["At Infinity", "At the Center of Curvature", "Between Focus and Pole", "At the Focus itself"],
        correctAnswer: "At Infinity",
        explanation: "Light rays emerging from focal points reflect parallelly, creating a highly magnified image at infinity."
      },
      {
        id: 3,
        question: "What is the mathematical formulation of Ohm's Law governing electrical circuits?",
        options: ["V = I × R", "I = V × R", "R = V × I", "P = V × I / R"],
        correctAnswer: "V = I × R",
        explanation: "Ohm's law states that electrical potential difference is directly proportional to loop current under constant temperatures."
      },
      {
        id: 4,
        question: "Which of the following organic structures contains a triple covalent bond?",
        options: ["Alkyne", "Alkane", "Alkene", "Alcohol"],
        correctAnswer: "Alkyne",
        explanation: "Alkynes represent unsaturated hydrocarbons with a triple-bonded carbon pair (formula CnH2n-2)."
      },
      {
        id: 15,
        question: "In standard genetics, what represents the classic phenotypic ratio of a Mendelian dihybrid cross?",
        options: ["9:3:3:1", "3:1", "1:2:1", "1:1:1:1"],
        correctAnswer: "9:3:3:1",
        explanation: "Independent assortment of two separate genes results in a predictable 9:3:3:1 ratio in the F2 generation physical traits."
      }
    ];
  }

  // Tier 5: Class 11-12 - Senior
  return [
    {
      id: 1,
      question: "Which of these is the correct thermodynamic statement for a spontaneous reaction at constant temperature and pressure?",
      options: ["ΔG < 0 (Negative Gibbs Free Energy)", "ΔG > 0 (Positive Gibbs Free Energy)", "ΔS_universe = 0", "ΔH = 0 (Isothermal Enthalpy)"],
      correctAnswer: "ΔG < 0 (Negative Gibbs Free Energy)",
      explanation: "For a real reaction to proceed spontaneously spontaneously, the change in net Gibbs Free Energy (ΔG = ΔH - TΔS) must be negative."
    },
    {
      id: 2,
      question: "[Assertion [A]]: Electromagnetic waves transfer both kinetic momentum and energy across vacuum spaces. \n[Reason [R]]: EM waves possess electric and magnetic field vectors oscillating perpendicularly. Identify the correct relationship:",
      options: [
        "Both [A] and [R] are true, and [R] is the correct explanation of [A]",
        "Both [A] and [R] are true, but [R] is NOT the correct explanation of [A]",
        "[A] is true but [R] is false",
        "Both [A] and [R] are completely false statements"
      ],
      correctAnswer: "Both [A] and [R] are true, and [R] is the correct explanation of [A]",
      explanation: "Since electromagnetic waves comprise real oscillating power fields, they carry radiation pressure, transporting momentum and energy."
    },
    {
      id: 3,
      question: "A uniform solid disk of mass M and radius R rolls without slipping down a 30-degree incline. What is its linear acceleration?",
      options: ["(2/3) g sin(30°)", "(1/2) g sin(30°)", "g sin(30°)", "((3/4) g sin(30°))"],
      correctAnswer: "(2/3) g sin(30°)",
      explanation: "Solid disks have a rotational inertia of I = (1/2)MR^2. Accounting for both rotational and translation kinetic blocks, linear acceleration is derived as a = (g sin θ) / (1 + I/MR^2) = (2/3) g sin θ."
    },
    {
      id: 4,
      question: "In advanced calculus physics, what is the divergence of any static magnetic field vector according to Maxwell's Equations?",
      options: ["Zero (No magnetic monopoles exist)", "Free current density (μ0 J)", "Rate of change of electric field", "Negative charge density divided by vacuum permittivity"],
      correctAnswer: "Zero (No magnetic monopoles exist)",
      explanation: "The divergence of the magnetic flux density (div B = 0) is Gauss's Law for Magnetism, meaning magnetic field loops are always continuous."
    },
    {
      id: 5,
      question: "What product is primarily synthesized when phenol molecules undergo the classical Kolbe-Schmitt reaction with CO2 under high pressure?",
      options: ["Salicylic Acid (o-hydroxybenzoic acid)", "Aspirin", "Benzoic Acid", "Picric Acid"],
      correctAnswer: "Salicylic Acid (o-hydroxybenzoic acid)",
      explanation: "Kolbe-Schmitt is a typical electrophilic carboxylation of sodium phenoxide with Carbon Dioxide, forming Salicylic acid."
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
