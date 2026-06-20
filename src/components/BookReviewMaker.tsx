import { useState } from "react";
import { Bookmark, Sparkles, Loader2, Copy, Download, Check, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile } from "../utils";
import { SavedWorkItem } from "../types";

interface BookReviewMakerProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

function getLocalBookReview(title: string, author: string, genre: string, keyPoints: string, classNum: string): string {
  const cleanTitle = title.trim() || "The Great Adventure";
  const cleanAuthor = author.trim() || "Anonymous School Teacher";
  const cleanPoints = keyPoints.trim() || "Perseverance, daily kindness, and regular reading habits.";
  
  return `# 📖 School Book Review: "${cleanTitle}"
*Reviewed for Class ${classNum} • Genre: ${genre} • Author: ${cleanAuthor} • Local Calibration Mode*

## 📝 Plot & What Book is About:
The fascinating book **"${cleanTitle}"** written by ${cleanAuthor} is a captivating story set in a world filled with exciting learnings and dynamic characters. The major themes address growing up, solving daily problems, and finding unique answers when times are difficult.

## 🌟 My Favorite Aspects:
Our favorite parts of the book are the interactive character arcs and how the lessons translate to daily life. The primary takeaways celebrate:
- **${cleanPoints}**

The narrative is structured with extremely direct and friendly chapters that keep students of Class ${classNum} thoroughly engaged from start to tail!

## 🎓 My Learnings & Moral of the Story:
1. Working together with school friends always resolves difficult workspace trials.
2. We must never feel afraid of initial errors, but rather use them as guideposts.
3. Reading standard books expands our creativity and makes our answers look neat!

## ⭐ My Rating & Recommendation:
- **School Rating**: ⭐⭐⭐⭐⭐ (5 / 5 Stars)
- **Recommendation**: This represented a truly helpful book for any Class ${classNum} reference workbook.`;
}

export default function BookReviewMaker({ onSaveWork }: BookReviewMakerProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [keyPoints, setKeyPoints] = useState("");
  const [classNum, setClassNum] = useState("6");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Please fill in both Book Title and Author.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    setCopied(false);
    setSaved(false);

    try {
      const response = await fetch("/api/generate/book-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre, keyPoints, classNum }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to make review. Please try again.");
      }

      const data = await response.json();
      setResult(data.text);
      setIsDemo(!!data.isDemo);
    } catch (err: any) {
      console.warn("Book review API failed. Utilizing offline generator:", err);
      const generated = getLocalBookReview(title, author, genre, keyPoints, classNum);
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
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanFilename = `book-review-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${dateStr}.txt`;
    downloadTextFile(cleanFilename, result);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveWork({
      type: "Book Review",
      title: `Book Review: ${title} by ${author} (Class ${classNum})`,
      content: result,
      metadata: { title, author, genre, keyPoints, classNum },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const quickBooks = [
    { title: "Alice in Wonderland", author: "Lewis Carroll", genre: "Fantasy", keyPoints: "A girl named Alice falls into a magical world with a white rabbit." },
    { title: "Treasure Island", author: "Robert Louis Stevenson", genre: "Adventure", keyPoints: "Jim Hawkins finds a map leading to pirate Captain Flint's treasures." },
    { title: "The Secret Garden", author: "Frances Hodgson Burnett", genre: "Classics", keyPoints: "Mary finds a closed hidden garden and learns about nature and happiness." }
  ];

  return (
    <div className="space-y-8" id="book-review-maker">
      {/* Short Intro block */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-rose-150 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-650 dark:bg-rose-950 dark:text-rose-455">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-955 dark:text-white font-display">
              Book Review Maker 📚
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Write professional and creative layouts of book reviews for your language and literature submissions. Enter the details and outline below!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-rose-150 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-md text-slate-905 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3" id="review-header">
            Book Information 📖
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="book-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5 font-display">
                Book Title
              </label>
              <input
                type="text"
                id="book-title-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-rose-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white leading-normal"
                placeholder="e.g., Treasure Island, Charlotte's Web"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="book-author-input" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                Author Name
              </label>
              <input
                type="text"
                id="book-author-input"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-rose-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white leading-normal"
                placeholder="e.g., Lewis Carroll, Roald Dahl"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

             <div>
              <label htmlFor="book-genre-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-355 mb-1.5 font-display">
                Genre / Type
              </label>
              <select
                id="book-genre-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-rose-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="Fiction">Fiction Stories</option>
                <option value="Adventure">Adventure & Exploration</option>
                <option value="Fantasy">Magic & Fantasy</option>
                <option value="Mystery">Mystery / Solve Clues</option>
                <option value="Classics">Classic Books</option>
                <option value="Biography">Real Life / Biography</option>
                <option value="Science Non-fiction">Science Non-fiction</option>
              </select>
            </div>

            <div>
              <label htmlFor="book-class-select" className="block text-xs font-semibold text-slate-705 dark:text-slate-355 mb-1.5 font-display">
                Your Class
              </label>
              <select
                id="book-class-select"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-705 focus:border-rose-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
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
              <label htmlFor="book-points-input" className="block text-xs font-semibold text-slate-705 dark:text-slate-350 mb-1.5 font-display">
                My summary thoughts or parts I liked:
              </label>
              <textarea
                id="book-points-input"
                rows={3}
                placeholder="Write any brief points like characters, lessons, or why you liked the book..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-rose-400 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white placeholder:text-slate-400 resize-none"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-display font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-rose-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing Review...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Create Book Review!
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestion Card */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-2.5 font-display uppercase">
              📚 Quick Load Demo:
            </span>
            <div className="space-y-1.5 flex flex-col">
              {quickBooks.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setTitle(item.title);
                    setAuthor(item.author);
                    setGenre(item.genre);
                    setKeyPoints(item.keyPoints);
                  }}
                  className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-medium truncate"
                >
                  {item.title} ({item.genre})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output panel */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-220 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="review-error">
              <span>⚠️</span>
              <div>
                <strong>Error Creating Review:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-rose-150 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            {/* Output header actions */}
            <div className="bg-slate-50 dark:bg-slate-855 px-6 py-4 border-b-2 border-slate-100 dark:border-slate-805 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-705 dark:text-slate-200 font-display">
                Generated Student Book Review 📄
              </h4>
              
              {result && (
                <div className="flex items-center gap-2" id="review-action-panel">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Review!</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-755 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-955 dark:hover:bg-rose-900 border border-rose-220 dark:border-rose-800 text-xs font-semibold text-rose-705 dark:text-rose-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Saved Book Review!</span>
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

            {/* Generated display field */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-rose-150">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-yellow-550 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 font-display">
                      Flipping Pages... 📖
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our literary peer is writing down their notes, plotting favorite characters, and drafting an easy to present Class review!
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="review-rendered-content">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350">
                          This book review was formatted in offline-calibration mode because live AI secrets are not active. To unleash fully custom, real-time reviews on any novel or biography in seconds, set your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-amber-950 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-xl font-bold font-display text-rose-650 dark:text-rose-400 mt-2 mb-4 border-b border-rose-100 dark:border-slate-800 pb-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-md font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 mt-4 mb-2" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-705 dark:text-slate-300 leading-relaxed font-sans" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5" {...props} />,
                      li: ({ ...props }) => <li className="text-slate-600 dark:text-slate-350" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-slate-900 dark:text-white bg-rose-50 dark:bg-rose-950/20 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-rose-400 bg-rose-50/50 dark:bg-rose-950/15 pl-4 py-2 italic my-4 rounded-r-xl" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-705 dark:text-slate-300 font-display">
                      Review File is blank!
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Input book title details and click "Create Book Review!" to produce study reviews for any class instantly.
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
