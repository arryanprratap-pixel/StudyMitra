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

      const parsedClassNum = parseInt(classNum, 10);
      let sInstruction = "";
      let detailInstruction = "";

      if (parsedClassNum <= 5) {
        sInstruction = "You are an affectionate elementary school teacher for Class 1 to 5. Keep vocabulary extremely simple, use cute kid-friendly metaphors, short single-sentence bullet points, and very short overall text. Do not use advanced terms. Introduce topics with high-contrast, simple, and exciting language.";
        detailInstruction = "Keep answers very easy, short, and colorful with fun examples appropriate for young child minds.";
      } else if (parsedClassNum >= 9) {
        sInstruction = "You are an excellent high school teacher / tutor for Class 9 to 12. Keep language student-friendly but highly professional, comprehensive, and detailed. Provide deep conceptual clarity, proper academic term explanations (with simple definitions), and analytical structured formats.";
        detailInstruction = "Give detailed, rich explanations with proper terminologies and neat subheadings to match CBSE/ICSE high school standards.";
      } else {
        sInstruction = "You are a friendly study buddy for middle school Class 6 to 8. Keep explanations direct, fun, clear, and educational. Emphasize real-world examples and keep sentence structures simple and direct.";
        detailInstruction = "Provide balanced middle-school explanation notes.";
      }
      
      const prompt = `Write student study notes on the topic "${topic}" for a Class ${classNum} student in the subject "${subject}". The notes length should be "${length}" (short/medium/long).
      ${detailInstruction}
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

      const parsedClass = parseInt(classNum, 10);
      let gradingInstruction = "";
      if (parsedClass <= 5) {
        gradingInstruction = "This is for elementary kids (Class 1 to 5). Questions must be very basic, easy to read, with extremely simple answers and fun topics.";
      } else if (parsedClass >= 9) {
        gradingInstruction = "This is for high school students (Class 9 to 12). Questions must be challenging, curriculum-oriented, testing conceptual depth using proper standard subjects material, with clear single-sentence explanations.";
      } else {
        gradingInstruction = "This is for middle schoolers (Class 6 to 8). Questions should be conceptual, fun, direct and test standard school lessons.";
      }

      const ai = getGeminiClient();
      const sInstruction = `You are a school teacher creating a 5-question multiple choice quiz for school students. ${gradingInstruction} Keep options clear, friendly, and completely positive.`;
      
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
      const { title, author, genre, keyPoints, classNum } = req.body;
      if (!title || !author) {
        res.status(400).json({ error: "Book Title and Author are required." });
        return;
      }

      const parsedClass = parseInt(classNum || "7", 10);
      let sInstruction = "";
      if (parsedClass <= 5) {
        sInstruction = "You are a very young reader (Class 1-5) shares a delightful, super simple book review. Use very simple, excited child words, tiny bullet points, and basic 1-5 stars. Avoid heavy analytical themes.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are an insightful high school student (Class 9-12) writing a comprehensive, analytical and neat book review. Focus on literary elements, core characters motivations, themes, and key takeaways in simple but neat structured reviews.";
      } else {
        sInstruction = "You are a friendly middle school student (Class 6-8) who loves reading and is writing a book review. Use simple, cheerful, and honest adolescent/school-level language.";
      }
      
      const prompt = `Write a creative book review for the book "${title}" by "${author}" suitable for a Class ${classNum || '7'} student.
      Genre: "${genre || 'Not specified'}".
      Key points/ideas from the reader: "${keyPoints || 'General review'}".
      Structure the output with:
      - A school-project style header with Name, Class ${classNum || '7'}, and Subject fields
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
      const { topic, subject, classNum } = req.body;
      if (!topic || !subject) {
        res.status(400).json({ error: "Project Title/Topic and Subject are required." });
        return;
      }

      const parsedClass = parseInt(classNum || "7", 10);
      let sInstruction = "";
      let helperAdvice = "";
      if (parsedClass <= 5) {
        sInstruction = "You are an encouraging primary school teacher helping Class 1 to 5 children format their scrapbooks or small charts. Suggest using glitter pins, drawings, and paper cutting in a super easy layout.";
        helperAdvice = "Keep text extremely easy and short so kids can write it down physically on chart papers by hand.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are a high school science/humanities teacher guiding Class 9 to 12 students in school lab file/project folder creation. Suggest structured, neat formatting, proper hypothesis/data representation, index formats, and research steps.";
        helperAdvice = "Give a detailed, elegant, academic and impressive format with clear headings, experiment/analysis models, and proper source references.";
      } else {
        sInstruction = "You are an encouraging middle school teacher helping Class 6-8 kids setup their science/social school project files. Keep suggestions realistic with chart sheets or physical supplies.";
        helperAdvice = "Provide a great middle-school project template.";
      }
      
      const prompt = `Generate a complete school project layout or format for the topic "${topic}" in "${subject}" for Class ${classNum || '7'} standards.
      ${helperAdvice}
      Provide simple, student-friendly content for the following sections:
      - Project Title Cover Page Layout
      - Introduction (Simple context explanation)
      - Materials / Resources Needed (Easy to get craft items, files, or safe websites)
      - Step-by-Step Method (How to prepare/make the project or write-up)
      - Learnings / Conclusion (What a student can conclude from this)
      Highlight easy ideas to make the project stand out (like drawing layout or presentation suggestions). Format neatly in markdown.`;

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
      const { schoolTime, subjects, classNum } = req.body;
      if (!schoolTime || !subjects) {
        res.status(400).json({ error: "Please enter your school hours and subjects." });
        return;
      }

      const parsedClass = parseInt(classNum || "7", 10);
      let sInstruction = "";
      let adviceLines = "";
      if (parsedClass <= 5) {
        sInstruction = "You are a kind early-year student counselor. Create a fun, colorful sensory schedule with very short, gentle study blocks (15-20 mins) combined with play, recess, coloring, storytime, early sleeping, and snack slots.";
        adviceLines = "Ensure slots are funly named (e.g., 'Drawing Break 🎨', 'Adventure Reading 📚'). No heavy study loads.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are a professional academic mentor specialized in board exam time management. Create a highly optimized, efficient, and realistic routine with systematic study blocks (40-60 mins), revision slots, hobby stress busters, and optimal screen breaks.";
        adviceLines = "Integrate active recall spaces and structured subject focus chunks. Ensure 7-8 hours sound rest.";
      } else {
        sInstruction = "You are a supportive school counselor making a daily routine timetable. Keep it highly balanced with ample play, hobbies, family, snack, and rest time, alongside focused but short study sessions.";
        adviceLines = "Include short study/homework sessions paired with healthy snack intervals and outdoor play time.";
      }
      
      const prompt = `Create a realistic daily student study and activity timetable.
      The student is in Class ${classNum || '7'} and is busy in school from: "${schoolTime}".
      Subjects they need to self-study: "${subjects}".
      ${adviceLines}
      Format the timetable as a clean Markdown table with columns: "Time Slot", "Activity/Subject", and "Friendly Tips & Goals".
      Include sections from waking up in the morning to bedtime. Ensure there are realistic study blocks for the mentioned subjects, and lots of breaks for playtime, screen, family, dinner, and perfect hours of sleep. Adding encouraging words or mental health tips at the bottom is highly recommended!`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate study timetable." });
    }
  });

  // 6. WORD MEANINGS AND VOCABULARY GENERATOR
  apiRouter.post("/generate/word-meanings", async (req: Request, res: Response) => {
    try {
      const { word, classNum } = req.body;
      if (!word) {
        res.status(400).json({ error: "Please specify a word to search meanings." });
        return;
      }

      const parsedClass = parseInt(classNum || "7", 10);
      let sInstruction = "";
      if (parsedClass <= 5) {
        sInstruction = "You are a gentle primary school dictionary guide. Use extremely basic terms, sound matching, cartoons comparisons, and very short definitions. Avoid using difficult words in your explanations.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are a helpful language mentor for high schoolers. Provide rich definitions, formal parts of speech, roots or etymologies, mature but simple high-school contextual sentences, and wide ranges of synonyms and antonyms.";
      } else {
        sInstruction = "You are a friendly middle school vocabulary coach. Give simple clear definitions, direct student example sentences, and helpful easy synonyms.";
      }

      const prompt = `Provide the meaning, school usage, and fun details for the word: "${word}" for a student in Class ${classNum || '7'}.
      Please structure the output beautifully in Markdown:
      - **Word Header**: The word itself, part of speech (e.g., noun, verb), and a simple pronunciation hint
      - **Core Meaning**: A clear and easy definition customized to Class ${classNum || '7'} level
      - **Example Sentences**: Two interesting sentences related to school, friendships, hobbies, or science
      - **Synonyms & Antonyms**: A small table or bullet list of 3 easy synonyms (same meaning words) and 3 antonyms (opposite words)
      - **Fun Memory Tip!**: A quick funny trick or rhyme to help remember the spelling or meaning of "${word}" easily!`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate word meanings." });
    }
  });

  // 7. DYNAMIC CHAPTER LEARNING
  apiRouter.post("/generate/chapter-learning", async (req: Request, res: Response) => {
    try {
      const { classNum, subject, chapter, sectionId, sectionName } = req.body;
      if (!classNum || !subject || !chapter || !sectionId) {
        res.status(400).json({ error: "Missing required parameters for Chapter-wise Learning." });
        return;
      }

      const parsedClass = parseInt(classNum, 10);
      let sInstruction = "";
      let detailGuidelines = "";

      if (parsedClass <= 5) {
        sInstruction = "You are an affectionate, gentle primary school teacher guiding children in Class 1 to 5. Keep vocabulary extremely simple, sentence lengths very short, and use cute kid-friendly metaphors or emojis. Avoid any advanced or academic-heavy definitions. Focus on tactile, fun, and picture-based style descriptions.";
        detailGuidelines = "Structure with simple points, clear big headers, and playful analogies suitable for Class 1 to 5 children. Answer very shortly.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are a highly professional high school academic mentor guiding Class 9 to 12 students. Keep terminology robust but clear, explain formulas details thoroughly, structure with professional academic headings, and adhere to ICSE/CBSE curricular high standards.";
        detailGuidelines = "Under each sub-topic, provide deep academic points, formulas derivations if valid, step-by-step logic, and detailed exam-style answers with neat subheadings.";
      } else {
        sInstruction = "You are an encouraging middle school study counselor for Class 6 to 8. Keep instructions direct, interesting, friendly, and visual. Emphasize real-world analogies, straightforward examples, and student homework context.";
        detailGuidelines = "Provide a balanced, highly structured middle-school level explanation which is direct, clean, and interactive.";
      }

      const prompt = `You are providing the chapter section: "${sectionName}" (ID: ${sectionId}) for the chapter "${chapter}" under the subject "${subject}" tailored specifically for a Class ${classNum} student.

      Please generate custom, original, structured, and informative notes in clean Markdown format. 

      ${detailGuidelines}

      Specific Section Guidelines:
      - If section is Introduction (intro): Give a catchy, warm welcoming introduction setting the scene. For young kids, start with an exciting hello!
      - If section is Summary (summary): Summarize the chapter core in easy bullets.
      - If section is Definitions (definitions): List 3-5 core definitions clearly. Keep them easy but accurate.
      - If section is Keywords (keywords): Highlight 4-6 essential high-yield words or vocabulary and explain their meaning.
      - If section is Formulas/Rules (formulas): List core formulas, rules, or grammar conventions with simple box layouts or explanations. If no math formulas exist, explain core concepts.
      - If section is Examples (examples): Show 3 clear, real-life examples of how this topic appears in our daily world or homework.
      - If section is Short Questions (short_q): Provide 4-5 neat high-frequency short school questions with correct answers matched to Class ${classNum} standard.
      - If section is Long Questions (long_q): Provide 2-3 long, conceptual questions with comprehensive answers.
      - If section is MCQ Quiz (mcq_quiz): Provide exactly 5 Multiple Choice Questions with clear options A, B, C, D and correct answers highlighted with clear 1-sentence explanations.
      - If section is Practice Questions (practice_q): Provide 4 self-assessment questions, prompts, or fill-in-the-blanks.
      - If section is Homework Help (homework_help): Provide fun homework guidelines, project-making physical activity files, or drawing hints related to this chapter.
      - If section is Exam Tips (exam_tips): Share 3-4 golden mind hacks or points on what teachers usually ask in school semester exams for this topic.

      Do not copy copyrighted book texts. Keep it strictly original, student-friendly, and highly structured with beautiful Markdown.`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate chapter-wise learning content." });
    }
  });

  // 8. UNIVERSAL ANSWER SOLVER
  apiRouter.post("/generate/universal-solve", async (req: Request, res: Response) => {
    try {
      const { question, classNum, subject } = req.body;
      if (!question) {
        res.status(400).json({ error: "Please write a school question to solve." });
        return;
      }

      const parsedClass = parseInt(classNum || "7", 10);
      let sInstruction = "";
      let answerSpecs = "";

      if (parsedClass <= 5) {
        sInstruction = "You are an affectionate primary school teacher. Use extremely simple words, short sentences, and highly direct answers. Present explanation using funny metaphors or real-life child examples. Avoid high school terminology.";
        answerSpecs = "Answer must be very friendly, short, easy to copy, and colorful with emojis. If it's math, use basic counting, drawings representation, or simple steps.";
      } else if (parsedClass >= 9) {
        sInstruction = "You are an expert high school tutor. Provide formal, highly detailed, precise, and academic exam-style answers using proper terms. Structure the response beautifully with subheadings, theories/conventions, and systematic point forms.";
        answerSpecs = "Answer must be comprehensive, curriculum-compliant, detailing equations step-by-step or giving extensive essays/letters format. Use proper analytical tone.";
      } else {
        sInstruction = "You are a supportive middle school study mentor. Keep answers highly balanced - clear, interesting, structured, and easy to memorize for school tests (for Class 6 to 8).";
        answerSpecs = "Answer should be direct, explanatory, containing a brief definition, key points, and a simple real-world example.";
      }

      const prompt = `Solve the following school query/doubt:
      Question: "${question}"
      Subject: "${subject || "General / Auto-detect"}"
      Student Class: Class ${classNum || "7"}

      ${answerSpecs}

      Core Rules:
      1. Give fully correct, original, and highly clear student-friendly answers.
      2. If the user's question is completely garbled, unclear, or too brief (e.g. just a single word with no question), ask they add more details or specify what they want to know.
      3. If the answer is unsure or multiple solutions exist, explain that politely and present a reliable educational description.
      4. Support solving math steps, explaining grammatical rules, writing drafts for letters, essays, applications, explaining science processes, and defining history/civics queries.
      5. Format neatly with Markdown. Make formulas pop out clearly.`;

      const text = await callGemini(prompt, sInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to solve question." });
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
