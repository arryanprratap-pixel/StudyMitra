import { useState } from "react";
import { Save, FolderOpen, Trash2, Copy, Download, Check, Eye, EyeOff, FileText, BookOpen, Bookmark, CalendarRange, BookA } from "lucide-react";
import { SavedWorkItem } from "../types";
import { copyToClipboard, downloadTextFile, formatDate } from "../utils";
import ReactMarkdown from "react-markdown";

interface SavedWorkProps {
  savedItems: SavedWorkItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedWork({ savedItems, onRemoveItem, onClearAll }: SavedWorkProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIcon = (type: SavedWorkItem["type"]) => {
    switch (type) {
      case "Note":
        return <BookOpen className="w-5 h-5 text-sky-500" />;
      case "Book Review":
        return <Bookmark className="w-5 h-5 text-rose-500" />;
      case "Project Format":
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case "Timetable":
        return <CalendarRange className="w-5 h-5 text-violet-500" />;
      case "Word Meanings":
        return <BookA className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownload = (item: SavedWorkItem) => {
    const cleanFilename = `${item.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${item.title.toLowerCase().substring(0, 20).replace(/[^a-z0-9]+/g, "-")}.txt`;
    downloadTextFile(cleanFilename, item.content);
  };

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6" id="saved-work-hub">
      {/* Intro box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-yellow-105 text-slate-800 dark:bg-yellow-950 dark:text-yellow-400">
            <Save className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white font-display">
              Saved Work Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review, copy, or download previous study notes, review files, timetables, and project templates saved locally in this browser.
            </p>
          </div>
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-800"
          >
            <Trash2 className="w-4 h-4" /> Clear All Saved
          </button>
        )}
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-905 rounded-3xl p-12 border border-slate-150 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-850 rounded-2xl flex items-center justify-center text-3xl mx-auto border-2 border-dashed border-slate-205 dark:border-slate-800">
            📂
          </div>
          <div>
            <h4 className="font-bold text-slate-750 dark:text-slate-252 font-display">
              No Work Saved Yet!
            </h4>
            <p className="text-xs text-slate-405 max-w-sm mx-auto mt-1 leading-normal">
              Any study notes, project outlines, reviews, or schedules you generate can be bookmarked inside their respective page tool by clicking the "Save Hub" button, saving it to this board!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <input
              type="text"
              placeholder="Search saved titles..."
              className="w-full sm:w-72 px-4 py-2 text-xs rounded-xl border-2 border-slate-200 dark:border-slate-705 focus:border-yellow-400 outline-none dark:bg-slate-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5" id="saved-filter-pills">
              {[
                { id: "all", label: "All Items" },
                { id: "Note", label: "Notes" },
                { id: "Book Review", label: "Reviews" },
                { id: "Project Format", label: "Projects" },
                { id: "Timetable", label: "Routines" },
                { id: "Word Meanings", label: "Vocab" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setTypeFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    typeFilter === pill.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-505 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Items List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-855">
              No saved items match your criteria.
            </div>
          ) : (
            <div className="space-y-4" id="saved-items-grid">
              {filteredItems.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all p-5 shadow-sm hover:shadow ${
                      isExpanded
                        ? "border-yellow-300 dark:border-slate-700"
                        : "border-slate-105 dark:border-slate-800/80 hover:border-slate-203 dark:hover:border-slate-705"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl relative top-0.5 flex-shrink-0">
                          {getIcon(item.type)}
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-405 font-display flex items-center gap-1.5">
                            {item.type} • {formatDate(item.timestamp)}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Header controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-101 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-505 dark:text-slate-300 transition-colors cursor-pointer"
                          title={isExpanded ? "Collapse View" : "Expand View & Read"}
                        >
                          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleCopy(item.id, item.content)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-101 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-505 dark:text-slate-300 transition-colors cursor-pointer"
                          title="Copy Full Content"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDownload(item)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-101 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-505 dark:text-slate-300 transition-colors cursor-pointer"
                          title="Download Text Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-405 hover:text-rose-600 dark:text-slate-300 transition-all cursor-pointer"
                          title="Delete from saved history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Preview Area */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 overflow-y-auto max-h-[350px] prose dark:prose-invert max-w-none prose-xs prose-slate">
                          <ReactMarkdown
                            components={{
                              h1: ({ ...props }) => <h1 className="text-lg font-bold font-display text-sky-600 dark:text-sky-400 border-b border-sky-100 dark:border-slate-800 pb-1.5 mt-2 mb-3" {...props} />,
                              h2: ({ ...props }) => <h2 className="text-sm font-bold font-display text-slate-900 dark:text-white mt-4 mb-2 flex items-center gap-1" {...props} />,
                              p: ({ ...props }) => <p className="mb-3 text-slate-705 dark:text-slate-300 leading-relaxed font-sans text-xs" {...props} />,
                              ul: ({ ...props }) => <ul className="list-disc pl-4 mb-3 space-y-1 text-xs" {...props} />,
                              li: ({ ...props }) => <li className="text-slate-655 dark:text-slate-350 text-xs" {...props} />,
                              table: ({ ...props }) => (
                                <div className="overflow-x-auto my-4 border border-slate-202 dark:border-slate-800 rounded-xl">
                                  <table className="min-w-full divide-y divide-slate-250 dark:divide-slate-855 text-xs" {...props} />
                                </div>
                              ),
                              th: ({ ...props }) => <th className="px-3 py-2 text-left text-[11px] font-bold font-display text-slate-600 dark:text-slate-350 uppercase" {...props} />,
                              td: ({ ...props }) => <td className="px-3 py-2 text-xs text-slate-708 dark:text-slate-300 border-b border-slate-100 dark:border-slate-855" {...props} />,
                              strong: ({ ...props }) => <strong className="font-bold text-slate-900 dark:text-white bg-slate-100/60 dark:bg-slate-800 px-1 rounded" {...props} />,
                              blockquote: ({ ...props }) => <blockquote className="border-l-3 border-yellow-400 bg-yellow-50/30 pl-3 py-1.5 italic my-3 text-xs" {...props} />,
                            }}
                          >
                            {item.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
