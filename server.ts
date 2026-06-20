import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return !!(apiKey && apiKey !== "MY_GEMINI_API_KEY");
}

function cleanAndParseJson(text: string): any {
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[a-zA-Z]*\n?/, "");
    cleanText = cleanText.replace(/\n?```$/, "");
  }
  return JSON.parse(cleanText.trim());
}

// ============================================================================
// MOCK GENERATION ENGINE (Resilient Offline Demo Fallback)
// ============================================================================
const MockGenerators = {
  getNotes: (topic: string, classNum: string, subject: string, length: string): string => {
    return `# 📚 Study Notes: ${topic}\n*Class ${classNum} • Subject: ${subject} • Offline Demo Mode*\n\n## ✨ Quick & Easy Introduction\nHey there classmate! Let's explore the exciting world of **${topic}**. This is one of the most interesting topics in **${subject}** for Class ${classNum} students, and understanding it will make you a superstar in your classroom!\n\nBasically, **${topic}** refers to the key ideas and patterns that help us make sense of how things work around us. We are going to break it down simply so it's super easy to memorize.\n\n## 🧠 Key Things to Remember\nHere is a simple summary of what you need to know:\n- **Core Concept**: ${topic} is central to studying ${subject}.\n- **Definition**: It involves understanding the fundamental laws, rules, or elements that define how things interact in our physical and social environments.\n- **Why it matters**: Without learning ${topic}, we wouldn't be able to explain daily school experiments or write perfect creative answers!\n- **Did you know?**: Studying this helps scientists, historians, and authors create incredible new lessons and notebooks every day.\n\n## 💡 Fun Fact / Daily Life Example!\n> **Real-World Connection**: Think of ${topic} as a giant puzzle. Once you put the main pieces together, you get to see a beautiful big picture that explains how the world around us functions.\n\n## ✏️ Check Your Understanding!\n**Question**: What is the most important takeaway about ${topic} in Class ${classNum}?\n**Answer**: The key takeaway is learning how its core concepts apply directly to solving practical homework problems and understanding our daily surroundings!`;
  },

  getQuiz: (classNum: string, subject: string): any[] => {
    return [
      {
        id: 1,
        question: `Which of the following best represents a core topic in Class ${classNum} ${subject}?`,
        options: [
          "The absolute fundamental concept",
          "An unrelated secondary theory",
          "A random guesswork option",
          "None of the options"
        ],
        correctAnswer: "The absolute fundamental concept",
        explanation: `At Class ${classNum} level in ${subject}, focusing on the absolute fundamentals helps build strong academic foundations.`
      },
      {
        id: 2,
        question: "Why do we study homework topics step-by-step?",
        options: [
          "To make learning enjoyable and clear",
          "To memorize things blindly",
          "Because it's a school rule",
          "To complete tasks as fast as possible"
        ],
        correctAnswer: "To make learning enjoyable and clear",
        explanation: "Step-by-step logic allows the human brain to form robust neural connections and fully absorb the lessons."
      },
      {
        id: 3,
        question: `What is the most effective way to revise ${subject}?`,
        options: [
          "Active recall and summarized notes",
          "Reading the same page 50 times",
          "Skipping difficult questions",
          "Waiting until the final exam morning"
        ],
        correctAnswer: "Active recall and summarized notes",
        explanation: "Using summarized key points stimulates memory retrieval and leads to much better exam performance."
      },
      {
        id: 4,
        question: "Which habit helps students master difficult science, maths, and grammar doubts?",
        options: [
          "Asking questions and practicing exercises",
          "Ignoring the mistakes",
          "Copying solutions without understanding",
          "Postponing studies to weekends only"
        ],
        correctAnswer: "Asking questions and practicing exercises",
        explanation: "Engaging actively with the questions clears common doubts and boosts master level competency."
      },
      {
        id: 5,
        question: "How does our digital AI School Assistant help you learn?",
        options: [
          "By breaking down chapters and answering doubts simply",
          "By doing your exams for you",
          "By deleting your syllabus",
          "By hiding the study planner"
        ],
        correctAnswer: "By breaking down chapters and answering doubts simply",
        explanation: "AI helpers act as supportive, grade-personalized mentors that simplify complex book chapters and help you solve doubts anytime."
      }
    ];
  },

  getBookReview: (title: string, author: string, genre: string, keyPoints: string, classNum: string): string => {
    return `# 📖 School Book Review: "${title}"\n*Reviewed for Class ${classNum} • Genre: ${genre} • Written by ${author || "Anonymous"} • Offline Demo Mode*\n\n## 📝 What the Book is About\n"${title}" is a fascinating book that takes readers on an unforgettable journey. The plot revolves around key themes like discovery, growth, and solving challenges. The author, ${author || "Anonymous"}, does a fantastic job of keeping the story exciting from the very first page to the end.\n\n## 🌟 My Favorite Character / Part\nMy favorite aspect of the book is the core message of finding courage in difficult times. The characters feel very real, and the key ideas shared—such as **${keyPoints || "friendship and perseverance"}**—really make this story stand out.\n\n## 💡 What I Learned from This Book\n- Working together with friends always makes solving hard puzzles easier.\n- It's important to trust your instincts and keep learning from your errors.\n- Reading not only teaches us new words but expands how we imagine our future!\n\n## ⭐ My Rating & Recommendation\n**My Rating**: ⭐⭐⭐⭐⭐ (5 / 5 Stars)\n**Recommendation**: This is a must-read book for anyone in Class ${classNum} who loves an engaging storyline with great life lessons!`;
  },

  getProjectFormat: (topic: string, subject: string, classNum: string): string => {
    return `# 🎨 Creative School Project Guide: ${topic}\n*Subject: ${subject} • Tailored for Class ${classNum} • Offline Demo Mode*\n\n## 📁 Part 1: Project Cover Page Layout\n- **School Name**: [Your School Name here]\n- **Project Title**: Exploring the Science & Lessons of ${topic}\n- **Submitted By**: [Your Name], Class ${classNum}\n- **Subject**: ${subject}\n- **Date**: [Current Date]\n\n## 📝 Part 2: Introduction & Objective\nThe goal of this school project is to investigate and explain the importance of **${topic}** in our curriculum. We want to understand how it functions, look at real-world examples, and learn how it impacts our lives.\n\n## 🛠️ Part 3: Materials & Craft Items Needed\n1. White chart paper, standard colored files, or scrapbook sheets.\n2. Sketch pens, pencil rulers, and safety scissors.\n3. Reference books, science textbooks, or teacher-approved educational websites.\n4. Printouts/drawings of diagrams showing ${topic} cycles or representations.\n\n## 👣 Part 4: Step-by-Step Method\n- **Step 1**: Write down the cover details neatly. Use a border design with leaf or geometric patterns!\n- **Step 2**: Draft the introduction page explaining what ${topic} is in simple words.\n- **Step 3**: Draw or paste 2 neat diagrams or sketch models (e.g., flowchart describing different parts of this science/grammar rule).\n- **Step 4**: Interview a family member or search online for 2 ways we see this in our daily surroundings, and detail your findings in bullet points.\n- **Step 5**: Write a short summary of what you learned.\n\n## 🎓 Part 5: Learnings & Conclusion\nCompleting this project showed us that **${topic}** is not just an abstract chapter in our textbook, but a highly practical concept in ${subject} that influences our environment. Having clean, organized steps is the key to presenting an amazing project!`;
  },

  getTimetable: (schoolTime: string, subjects: string, classNum: string): string => {
    return `# 🗓️ Personalized Daily Study Timetable\n*Tailored for Class ${classNum} • School Hours: ${schoolTime} • Offline Demo Mode*\n\nHere is a balanced daily timetable designed to help you study **${subjects}** while keeping plenty of time for rest, hobbies, and family!\n\n| Time Slot | Activity/Subject | Friendly Tips & Goals |\n| :--- | :--- | :--- |\n| **07:00 AM - 08:00 AM** | Wake Up & School Prep ☀️ | Drink a warm glass of water, stretch, and eat a healthy breakfast! |\n| **08:00 AM - 02:00 PM** | school Hours (${schoolTime}) 🏫 | Listen to your teachers, take active notes, and have fun with your classmates. |\n| **02:00 PM - 03:00 PM** | Return Home & Lunch Break 🍽️ | Wash up, eat a nutritious lunch, and rest your eyes after school. |\n| **03:00 PM - 04:00 PM** | Fun Playtime / Hobby Time 🎨 | Go outdoors, cycle, play games, or draw to refresh your mind! |\n| **04:00 PM - 05:00 PM** | **Homework Blocks & Study Session 1** 📚 | Focus on **${subjects.split(',')[0] || 'your principal subject'}**. Tackle home tasks first! |\n| **05:00 PM - 05:30 PM** | Snack & Refreshment Break 🥛 | Grab a healthy fruit snack, drink juice or milk, and take a quick stretch. |\n| **05:30 PM - 06:30 PM** | **Self-Study Block: Session 2** 🧠 | Dive into **${subjects.split(',')[1] || 'revision & writing practice'}**. Read ahead! |\n| **06:30 PM - 07:30 PM** | Interactive Quiz / Word Practice 🎮 | Try 5 practice questions or search for 3 new word definitions. |\n| **07:30 PM - 08:30 PM** | Family & Screen Time 📺 | Relax with parents, play with siblings, or watch an educational video. |\n| **08:30 PM - 09:15 PM** | Delicious Dinner Time 🍲 | Enjoy a calm family dinner and prepare your school bag for tomorrow. |\n| **09:15 PM - 09:30 PM** | Pack Bags & Brush Teeth 🦷 | Check your homework planner, put books in your bag, and brush your teeth. |\n| **09:30 PM - 07:00 AM** | Sweet Dreams Sleep Time 😴 | Switch off lights. Get a full, deep sleep to keep your brain glowing! |\n\n---\n### 💡 Study Counselor Golden Advice:\n> "Dear student, consistency is your superpower. Study in short focal periods (e.g., 25-30 mins using a timer), and try to reward yourself after every complete study block. You've got this!"`;
  },

  getWordMeanings: (word: string, classNum: string): string => {
    return `# 📖 Personal Dictionary: "${word}"\n*Class standard: Class ${classNum} • Offline Demo Mode*\n\n## 🔍 Word Header\n- **Word**: **${word}**\n- **Part of Speech**: Noun / Verb (depending on context)\n- **Pronunciation**: *${word.toLowerCase().split('').join('-')}*\n\n## 💡 Core Meaning\nIn Class ${classNum} lessons, **${word}** means something that is highly significant, useful, and worth noting carefully. It represents an action or a description that describes how elements work or join together in our vocabulary.\n\n## ✍️ Example Sentences\n1. *The school teacher explained that understanding **${word}** would help us write beautiful essays.*\n2. *During our daily science lab session, we discovered a perfect application of **${word}** in action!*\n\n## 📋 Synonyms & Antonyms\n| Category | Synonyms (Same meaning) | Antonyms (Opposites) |\n| :--- | :--- | :--- |\n| **1** | Essential / Relevant | Unrelated |\n| **2** | Clear / Definitive | Confusing |\n| **3** | Dynamic / Active | Static / Passive |\n\n## ✨ Fun Memory Tip!\nTo remember how to spell and use **${word}** easily:\n> *Create a short rhyme in your notebooks like: "${word} is neat, writing it is an ultimate academic treat!"*`;
  },

  getChapterLearning: (classNum: string, subject: string, chapter: string, sectionId: string, sectionName: string): string => {
    return `# 🎓 Chapter Learning: ${sectionName}\n*Tailored for Class ${classNum} • Chapter: ${chapter} • Subject: ${subject} • Offline Demo Mode*\n\n## 📌 Section Focus: ${sectionName}\nWelcome to your focused study review for **${chapter}**! Today, we are mastering the specific concept of **${sectionName}** at a Class ${classNum} standard.\n\n### 💡 Core Notes & Explanation\nIn **${subject}**, this topic plays an essential role. Let's break it down into easy, bite-sized components:\n- **Concept Breakdown**: Every system has rules, and similarly, **${sectionName}** describes how different parts interact within the scope of "${chapter}".\n- **Main Principle**: When studying this, the key is to observe the pattern, write down definitions clearly, and see how they are tested in school exams.\n- **Grade Guidance**: For Class ${classNum}, your teacher will expect you to know the fundamental vocabulary terms, give real examples, and solve the practice problems step by step.\n\n### ❓ Short Q&A\n- **Q**: What is the primary purpose of ${sectionName}?\n- **A**: The primary purpose is to help us analyze, classify, and understand the core structures of "${chapter}" in a systematic academic way.\n\n### ⭐ Gold Exam Hack!\n> **Exam Tip**: When writing answers about this in your upcoming mid-term papers, always draw a small flowchart or write your answer in 3 numbered bullet points. Teachers love clean layouts and reward extra marks for structured answers!`;
  },

  getUniversalSolve: (question: string, classNum: string, subject: string): string => {
    const questionLower = question.toLowerCase();
    let customAnswerSnippet = "";

    if (questionLower.includes("photosynthesis")) {
      customAnswerSnippet = `## 🧬 Detailed Step-by-Step Explanation of Photosynthesis\n**Photosynthesis** is the magical process by which green plants make their own food using sunlight!\n\n### 🌿 The 3 Main Ingredients:\n1. **Light Energy**: Captured from the Sun by green pigments called **Chlorophyll**.\n2. **Carbon Dioxide ($CO_2$)**: Absorbed from the air through microscopic pores in the leaves called **Stomata**.\n3. **Water ($H_2O$)**: Absorbed by the plant's roots from the soil.\n\n### 🧪 The Simple Equation:\n$$\\text{Carbon Dioxide} + \\text{Water} \\xrightarrow{\\text{Sunlight}} \\text{Glucose (Food)} + \\text{Oxygen}$$\n\n### 🎨 Visual Diagram Steps:\n- **Step 1**: Sunlight falls on leaf surface.\n- **Step 2**: Chlorophyll acts like a solar panel.\n- **Step 3**: Plants release **Oxygen** into the atmosphere for us to breathe!`;
    } else if (questionLower.includes("divide") || questionLower.includes("math") || questionLower.includes("solve") || /\d+/.test(question)) {
      customAnswerSnippet = `## 🧮 Step-by-Step Maths Solution Board\nLet's solve your mathematics doubt step-by-step with clean logical working!\n\n### 📝 Given Query / Equation:\n> "${question}"\n\n### 👣 Guided Working Steps:\n1. **Analyze the terms**: Break down the numbers or operators in your problem.\n2. **Apply the Rule**: We follow the standard grade-appropriate rules (e.g., BODMAS / PEMDAS order of operations).\n3. **Calculation Steps**:\n   - Write out the values carefully in columns.\n   - Perform the core operation (division, factorization, or equation derivation).\n   - Double-check the remainder or the variable balances.\n\n### 🎯 Final Solved Answer:\n- **Result**: [Calculated successfully matched to Class ${classNum} standard]\n- **Verification**: If we substitute our results back, the left side of our school equation matches the right side perfectly!`;
    } else if (questionLower.includes("write") || questionLower.includes("letter") || questionLower.includes("essay")) {
      customAnswerSnippet = `## 📚 Formal Drafting Assistant: School Application / Essay\nHere is a highly professional, ready-to-use template formatted perfectly for your Class ${classNum} homework!\n\n### ✉️ Formal Letter Layout:\n\`\`\`\nTo,\nThe Principal,\n[Your School Name],\n[City / Location]\n\nSubject: Application for Leave of Absence\n\nRespected Sir / Madam,\n\nWith utmost respect, I am writing to inform you that I, [Your Name], a student of Class ${classNum}, Section [A], am unable to attend school starting tomorrow due to [unavoidable sickness / family medical emergency]. My family doctor has advised complete bed rest for at least three days.\n\nTherefore, I kindly request you to grant me leave of absence for 3 days from [Start Date] to [End Date]. I will ensure all pending classroom notebooks and assignments are fully caught up once I resume.\n\nThanking you.\n\nYours obediently,\n[Your Name]\nClass ${classNum}\n\`\`\`\n\n### 💡 Writing Improvement Tip:\n> Use strong verbs and polite greetings. Always check your spelling before turning in your notebooks!`;
    } else {
      customAnswerSnippet = `## 🧠 Concept Breakdown & Comprehensive Answer\nLet's resolve your homework doubt in a systematic, easy-to-understand way!\n\n### 📝 Your Question:\n> "${question}"\n\n### 💡 Core Explanation:\n- **Part A**: First, we look at why this happens. In ${subject}, this represents a key event or definition that is governed by specific natural laws or human events.\n- **Part B**: When we examine it closer, we see that it has various parts, which work sequentially.\n- **Part C**: The main result of this concept is that it helps us predict outcomes and forms the base of your Class ${classNum} curriculum chapters.\n\n### 📌 Summary Bullet Points:\n- **Definition**: Important terms are fully defined to help you secure great exam scores.\n- **Why it occurs**: Driven by direct factors that are standard in your school textbook references.\n- **Daily Example**: We observe similar patterns when doing experiments or writing creative paragraphs!`;
    }

    return `# 🤯 Solved Homework Doubt!\n*Classroom Focus: Class ${classNum} • Topic: ${subject} • Offline Demo Mode*\n\n${customAnswerSnippet}\n\n---\n### 💡 Doubt Solver Tip:\n> "Did you understand this explanation? You can write down these main bullets in your workbook! Try saving this answer to your Saved Hub at the top right so you never lose it!"`;
  }
};

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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getNotes(topic, classNum, subject, length || "medium");
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini call failed, using mock study notes instead:", geminiError);
        const text = MockGenerators.getNotes(topic, classNum, subject, length || "medium");
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const quiz = MockGenerators.getQuiz(classNum, subject);
        res.json({ quiz, isDemo: true });
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

      try {
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
        const quizQuestions = cleanAndParseJson(jsonStr);
        res.json({ quiz: quizQuestions, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Quiz call failed, using mock quiz instead:", geminiError);
        const quiz = MockGenerators.getQuiz(classNum, subject);
        res.json({ quiz, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getBookReview(title, author, genre, keyPoints, classNum);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Review call failed, using mock review instead:", geminiError);
        const text = MockGenerators.getBookReview(title, author, genre, keyPoints, classNum);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getProjectFormat(topic, subject, classNum);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Project call failed, using mock project layout instead:", geminiError);
        const text = MockGenerators.getProjectFormat(topic, subject, classNum);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getTimetable(schoolTime, subjects, classNum);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Timetable call failed, using mock schedule instead:", geminiError);
        const text = MockGenerators.getTimetable(schoolTime, subjects, classNum);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getWordMeanings(word, classNum);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Vocab call failed, using mock word list instead:", geminiError);
        const text = MockGenerators.getWordMeanings(word, classNum);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getChapterLearning(classNum, subject, chapter, sectionId, sectionName);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Chapter call failed, using mock chapnotes instead:", geminiError);
        const text = MockGenerators.getChapterLearning(classNum, subject, chapter, sectionId, sectionName);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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

      if (!isGeminiConfigured()) {
        const text = MockGenerators.getUniversalSolve(question, classNum, subject);
        res.json({ text, isDemo: true });
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

      try {
        const text = await callGemini(prompt, sInstruction);
        res.json({ text, isDemo: false });
      } catch (geminiError: any) {
        console.warn("Gemini Solve call failed, using offline solver fallback instead:", geminiError);
        const text = MockGenerators.getUniversalSolve(question, classNum, subject);
        res.json({ text, isDemo: true, warning: geminiError.message });
      }
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
