export function downloadTextFile(filename: string, text: string) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy using navigator.clipboard", err);
    }
  }

  // Fallback
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed", err);
    return false;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface ClassStyle {
  tier: "kinder" | "elementary" | "middle" | "secondary" | "senior";
  difficulty: string;
  answerLength: string;
  vocabularyLevel: string;
  examples: string[];
  questionPattern: string;
}

export function getClassLevelStyle(classNumber: string | number): ClassStyle {
  const num = parseInt(String(classNumber).replace(/[^0-9]/g, ""), 10) || 1;
  
  if (num <= 2) {
    return {
      tier: "kinder",
      difficulty: "Very very easy words, fun and friendly",
      answerLength: "3 to 5 short lines only",
      vocabularyLevel: "Super simple & playful vocabulary",
      examples: ["Like water splashing on a small green leaf", "Like your fluffy pet puppy wagging its tail"],
      questionPattern: "Small playful activity or draw-a-picture idea"
    };
  } else if (num <= 5) {
    return {
      tier: "elementary",
      difficulty: "Easy school explanation, child-friendly",
      answerLength: "Short bulleted points",
      vocabularyLevel: "Simple daily-life words with direct meanings",
      examples: ["Salty water in bowls left under hot sunlight", "Magnets pulling iron paperclips close"],
      questionPattern: "5 basic school questions and direct answers"
    };
  } else if (num <= 8) {
    return {
      tier: "middle",
      difficulty: "School-style revision, clear summary",
      answerLength: "Important points with definitions",
      vocabularyLevel: "Standard textbook vocabulary & terminology",
      examples: ["Plants converting solar heat via chloroplast leaf systems", "Friction resisting slide boards in playparks"],
      questionPattern: "Summary, Keywords, Short/Long QA, MCQs, & Practice Questions"
    };
  } else if (num <= 10) {
    return {
      tier: "secondary",
      difficulty: "Exam-focused concepts, simple flowcharts",
      answerLength: "Detailed, structured exam format",
      vocabularyLevel: "Board-syllabus grade definitions & key equations",
      examples: ["Reaction equations or force vector lines", "Carbon cycle diagrams showing combustion and respiration"],
      questionPattern: "Definitions, Formula Sheet, Diagrams, Short/Long Answers, MCQs, & Previous-Year Questions"
    };
  } else {
    return {
      tier: "senior",
      difficulty: "Advanced but easy college prep, neat derivations",
      answerLength: "Highly comprehensive textbook board styles",
      vocabularyLevel: "Technical syllabus terms, academic logic patterns",
      examples: ["Thermodynamic calculations under isobaric states", "Step-by-step mathematical derivation of kinematics"],
      questionPattern: "Full Concepts, Derivations, Numericals, Case Studies, Assertion-Reason, Board Exam-Style Answers, Keywords, and Revision Practice Prompts"
    };
  }
}

