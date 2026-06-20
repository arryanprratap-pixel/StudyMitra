import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is missing. Please set your Gemini API Key in the Secrets panel (Settings > Secrets).");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API router configuration
  const apiRouter = express.Router();

  // Helper to call Gemini easily
  async function callGemini(prompt: string, sInstruction: string) {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sInstruction,
        temperature: 0.6,
      },
    });
    return response.text || "";
  }

  // 1. NOTES GENERATOR
  apiRouter.post("/generate/notes", async (req: Request, res: Response) => {
    try {
      const { topic, classNum, subject, length } = req.body;
      if (!topic || !classNum || !subject) {
        res.status(400).json({ error: "Please fill in all notes fields (topic, class, subject)." });
        return;
      }

      const sInstruction = "You are a helpful study buddy for Class 6 to Class 10 students. Keep explanations extremely simple, fun, and educational. Use Class 7 or 8 level vocabulary. Emphasize real-world examples and keep sentence structures direct and clear. Avoid complex university or research-level jargon.";
      
      const prompt = `Write student study notes on the topic "${topic}" for a Class ${classNum} student in the subject "${subject}". The notes length should be "${length}" (short/medium/long).
      Structure the notes with:
      - A catchy Title suitable for Class ${classNum}
      - A "Quick & Easy Introduction" section
      - "Key Things to Remember" with simple bullet points
      - "Fun Fact/Example!" section
      - A short "Check Your Understanding!" question & answer.
      Make it engaging, clean, and styled neatly using markdown.`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate notes." });
    }
  });

  // 2. QUIZ PRACTICE (Structured JSON output)
  apiRouter.post("/generate/quiz", async (req: Request, res: Response) => {
    try {
      const { classNum, subject } = req.body;
      if (!classNum || !subject) {
        res.status(400).json({ error: "Please select both Class and Subject for the quiz." });
        return;
      }

      const ai = getGeminiClient();
      const sInstruction = "You are a school teacher creating a 5-question multiple choice quiz for Class 6 to Class 10 students. The questions, topics, language, and choices must match the selected grade precisely. Keep language completely simple and positive.";
      
      const prompt = `Create exactly 5 fun and educational multiple-choice quiz questions for a Class ${classNum} student in the subject "${subject}". Do not repeat questions. Make options clear. Provide exactly one correct answer and a very simple 1-sentence explanation of why it is correct.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: sInstruction,
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "An array of exactly 5 multiple choice questions.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING, description: "The quiz question itself." },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Four distinct answer options."
                },
                correctAnswer: { type: Type.STRING, description: "One of the options that is exactly correct." },
                explanation: { type: Type.STRING, description: "A simple 1-sentence explanation of the answer." }
              },
              required: ["id", "question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const jsonStr = (response.text || "").trim();
      const quizQuestions = JSON.parse(jsonStr);
      res.json({ quiz: quizQuestions });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate quiz." });
    }
  });

  // 3. BOOK REVIEW MAKER
  apiRouter.post("/generate/book-review", async (req: Request, res: Response) => {
    try {
      const { title, author, genre, keyPoints } = req.body;
      if (!title || !author) {
        res.status(400).json({ error: "Book Title and Author are required." });
        return;
      }

      const sInstruction = "You are a friendly student who loves reading and is writing a book review for a school class. Use simple, cheerful, and honest adolescent/school-level language. Frame the tone like a Class 7 or 8 student sharing thoughts.";
      
      const prompt = `Write a simple, creative book review for the book "${title}" by "${author}".
      Genre: "${genre || 'Not specified'}".
      Key points/ideas from the reader: "${keyPoints || 'General review'}".
      Structure the output with:
      - A school-project style header
      - "What the Book is About" (A simple plot overview, no spoilers!)
      - "My Favorite Character / Part" (Based on the book or points)
      - "What I Learned from This Book"
      - "My Rating & Recommendation" (Give stars out of 5 and a short reason)
      Format using clean markdown with easy-to-read headings, bold keywords, and lists.`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate book review." });
    }
  });

  // 4. PROJECT FORMAT MAKER
  apiRouter.post("/generate/project-format", async (req: Request, res: Response) => {
    try {
      const { topic, subject } = req.body;
      if (!topic || !subject) {
        res.status(400).json({ error: "Project Title/Topic and Subject are required." });
        return;
      }

      const sInstruction = "You are an encouraging middle school science/social teacher helping a student format and structure their school project files. Keep suggestions very realistic, easy to build with physical charting sheets, cardboard, sketch pens, and normal supplies. Vocabulary must fit Class 6-10.";
      
      const prompt = `Generate a complete school project layout or format for the topic "${topic}" in "${subject}".
      Provide simple, student-friendly content for the following sections:
      - Project Title Cover Page Layout
      - Introduction (Simple context explanation)
      - Materials / Resources Needed (Easy to get craft items or websites)
      - Step-by-Step Method (How to prepare/make the project or write-up)
      - Learnings / Conclusion (What a student can conclude from this)
      Highlight easy ideas to make the project stand out (like color tips or drawing layout suggestions). Format neatly in markdown.`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate project format." });
    }
  });

  // 5. STUDY TIMETABLE MAKER
  apiRouter.post("/generate/timetable", async (req: Request, res: Response) => {
    try {
      const { schoolTime, subjects } = req.body;
      if (!schoolTime || !subjects) {
        res.status(400).json({ error: "Please enter your school hours and subjects." });
        return;
      }

      const sInstruction = "You are a supportive school counselor making a daily routine timetable. Keep it highly balanced with ample play, hobbies, family, snack, and rest time, alongside focused but short study sessions. Vocabulary must be extremely friendly and understandable for Class 6-10 students.";
      
      const prompt = `Create a realistic daily student study and activity timetable.
      The student is busy in school from: "${schoolTime}".
      Subjects they need to self-study: "${subjects}".
      Format the timetable as a clean Markdown table with columns: "Time Slot", "Activity/Subject", and "Friendly Tips & Goals".
      Include sections from waking up in the morning to bedtime. Ensure there are short 30-40 min study periods for the mentioned subjects, and lots of breaks for playtime, screens, snacks, dinner, and a solid 8-9 hours of sleep. Adding encouraging words at the bottom is highly recommended!`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate study timetable." });
    }
  });

  app.use("/api", apiRouter);

  // Serve client assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
