export interface NoteGenerationRequest {
  topic: string;
  classNum: string;
  subject: string;
  length: "short" | "medium" | "long";
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizRequest {
  classNum: string;
  subject: string;
}

export interface BookReviewRequest {
  title: string;
  author: string;
  genre: string;
  keyPoints: string;
}

export interface ProjectFormatRequest {
  topic: string;
  subject: string;
}

export interface TimetableRequest {
  schoolTime: string;
  subjects: string;
}

export interface WordMeaningRequest {
  word: string;
  classNum: string;
}

export interface HomeworkTask {
  id: string;
  task: string;
  subject: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface SavedWorkItem {
  id: string;
  type: "Note" | "Book Review" | "Project Format" | "Timetable" | "Word Meanings" | "Chapter Learning" | "Solved Answer" | "Study Timer Log";
  title: string;
  timestamp: string;
  content: string;
  metadata: Record<string, string>;
}
