import { useState, useEffect } from "react";
import { 
  BookOpen, Compass, ClipboardList, HelpCircle, FileText, 
  Award, Sparkles, Copy, Download, Check, Save, Loader2, 
  Bookmark, ArrowRight, Lightbulb, GraduationCap, ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { copyToClipboard, downloadTextFile, getClassLevelStyle } from "../utils";
import { SavedWorkItem } from "../types";

interface ChapterLearningSystemProps {
  onSaveWork: (item: Omit<SavedWorkItem, "id" | "timestamp">) => void;
}

// 12 sections mapping with matching icons and descriptive names
const sections = [
  { id: "intro", label: "Chapter Introduction", emoji: "🌅", desc: "Catchy overview and warm welcome" },
  { id: "summary", label: "Simple Summary", emoji: "📋", desc: "Core concepts in easy bullet points" },
  { id: "definitions", label: "Important Definitions", emoji: "📚", desc: "Key academic definitions" },
  { id: "keywords", label: "Keywords & High-Yield Vocab", emoji: "🔑", desc: "Essential terminology decoded" },
  { id: "formulas", label: "Formulas & Core Concepts", emoji: "⚙️", desc: "Mathematical rules & equations" },
  { id: "examples", label: "Real-Life Examples", emoji: "💡", desc: "Everyday cases and applications" },
  { id: "short_q", label: "Short Q&A", emoji: "⚡", desc: "High-frequency school questions" },
  { id: "long_q", label: "Long Detailed Q&A", emoji: "📝", desc: "In-depth explanations with theory" },
  { id: "mcq_quiz", label: "Mini MCQ Quiz", emoji: "🎯", desc: "5 interactive multiple choice questions" },
  { id: "practice_q", label: "Practice Exercises", emoji: "🏋️", desc: "Prompts & self-assessment exercises" },
  { id: "homework_help", label: "Homework & Crafts Help", emoji: "🎨", desc: "Activity files & visual project ideas" },
  { id: "exam_tips", label: "Exam Marks Maximizer", emoji: "🏆", desc: "Secret pointers & revision hacks" }
];

function getLocalChapterContent(
  classNum: string,
  subject: string,
  chapter: string,
  sectionId: string
): string {
  const finalChName = chapter || "Standard Chapter";
  const normSubject = subject || "Science";
  const style = getClassLevelStyle(classNum);

  if (style.tier === "kinder") {
    if (sectionId === "intro") {
      return `# 🌅 Welcome Kids! Lesson Overview: ${finalChName} 🎈
*Class ${classNum} • ${normSubject} • Let's Learn Together!*

Hi there! Today we are looking at the wonderful story of **${finalChName}**.
- It is filled with magical, neat ideas.
- We will learn with super-easy words and cute pictures.
- Get your favorite sketch board ready! Let's explore happily! ✨`;
    }
    if (sectionId === "summary") {
      return `# 📋 Sweet Summary: ${finalChName} Index
*Class ${classNum} • Super Easy 3-Line Summary*

Here are the sweet and short details you can practice:
- **Our Main Topic**: We are investigating **${finalChName}**!
- **Fun Activity**: ${style.examples[0]}.
- **Why we love it**: It teaches us how happy elements play together safely.`;
    }
    if (sectionId === "definitions") {
      return `# 📚 Super Easy Definitions Glossary
*Class ${classNum} • Fun Definitions*

- **The Main Chapter**: **${finalChName}** is the topic of our fun science lesson today!
- **Playful Elements**: Tiny, happy puzzle blocks that build up our lessons.
- **Friendly Teacher**: A super helpful guide who helps us draw clear letters!`;
    }
    if (sectionId === "keywords") {
      return `# 🔑 Happy Keywords List
- **Learn**: Listening happily with big smiling eyes.
- **Draw**: Creating lines and coloring with warm red, blue, and green pencils!
- **Kindness**: Helping your classmates find their lost erasers.`;
    }
    if (sectionId === "formulas") {
      return `# ⚙️ Fun Counting & Shapes Finder
Here are precious simple shapes to practice counting:
- **The Circle**: A perfectly round coin with zero corners.
- **The Triangle**: A sweet shape with $3$ shiny corners!
- **The Square**: Has $4$ straight sides. Count them: $1, 2, 3, 4$!`;
    }
    if (sectionId === "examples") {
      return `# 💡 Happy Examples: ${finalChName}
- **Example 1**: ${style.examples[0]}
- **Example 2**: ${style.examples[1]}
- **Example 3**: A shiny butterfly flying high over red garden roses.`;
    }
    if (sectionId === "mcq_quiz") {
      return `# 🎯 Simple Mini Quiz for Little Champions!
Try picking the happiest choice:

1. **What are we studying happily today?**
   - A) Cute **${finalChName}**!
   - B) Sleeping late
   - *Correct Answer: A*

2. **What color is our lovely daytime Sun?**
   - A) Warm bright yellow
   - B) Dark blue
   - *Correct Answer: A*

3. **Where do sweet flowers grow?**
   - A) In our beautiful garden soil
   - B) On standard kitchen plates
   - *Correct Answer: A*`;
    }
    if (sectionId === "practice_q" || sectionId === "homework_help" || sectionId === "exam_tips" || sectionId === "short_q" || sectionId === "long_q") {
      return `# 🎨 Playful Craft Exercise & Practice: ${finalChName}
- **Your Fun Prompt**: Grab a shiny clean page and draw a happy smiling Sun over grassy green plains!
- **Play Game**: Count how many crayons are inside your pencil box.
- **Teacher Star Tip**: Always hold your pencil neatly and write your initials with high pride! ⭐`;
    }
  }

  if (style.tier === "elementary") {
    if (sectionId === "intro") {
      return `# 🌅 Elementary Intro: ${finalChName}
*Class ${classNum} • Subject: ${normSubject} • Simple Explainer*

Welcome to your study hub for **${finalChName}**! 
Here, we decode how key variables coordinate inside Class ${classNum} **${normSubject}** lessons. Understanding this builds immediate classroom confidence!`;
    }
    if (sectionId === "summary") {
      return `# 📋 Short Point Summary: ${finalChName}
- **Core Standard**: This chapter focuses on simple processes that explain nature.
- **Main Principle**: Systems require balance, inputs, and standard catalysts.
- **Practical Application**: ${style.examples[0]}.
- **Revision Action**: Highlight key definitions in your textbook pages.`;
    }
    if (sectionId === "definitions") {
      return `# 📚 Simple Definitions Finder
1. **${finalChName}**: The direct concept representing how factors of ${normSubject} combine.
2. **Elementary Factors**: Essential natural blocks that drive daily reactions, e.g., *${style.examples[1]}*.`;
    }
    if (sectionId === "keywords") {
      return `# 🔑 Direct Vocabulary Boosters
- **Analyze**: Breaking down simple things step-by-step.
- **Sequence**: Placed in an ordered, tidy list (like $1 \\rightarrow 2 \\rightarrow 3$).
- **Observe**: Watching experiments closely to write exact notes.`;
    }
    if (sectionId === "formulas") {
      return `# ⚙️ Elementary Equations Finder
- **The Equal Balance Law**: Every reaction must balance initial inputs.
- **Formula 1**: $\\text{Output Amount} = \\text{Standard Raw Materials} \\times \\text{Rate Factor}$`;
    }
    if (sectionId === "examples") {
      return `# 💡 Easy Everyday Connections
- **In Parks**: ${style.examples[0]}.
- **In Basements**: ${style.examples[1]}.
- **In Workbooks**: Writing answers with structured numbers.`;
    }
    if (sectionId === "mcq_quiz" || sectionId === "short_q" || sectionId === "long_q" || sectionId === "practice_q" || sectionId === "homework_help" || sectionId === "exam_tips") {
      return `# 🎯 5 Basic Questions and Direct Answers Practice
1. **Q: Why does the system change state?**
   - *A: External variables like thermal changes push molecules to react.*
2. **Q: Give a brief example of standard cycles.**
   - *A: Consider: ${style.examples[0]}.*
3. **Q: What is recommended to write neat papers?**
   - *A: Always use bulleted lists and draw straight margins!*
4. **Q: Define raw factors briefly.**
   - *A: Basic, unrefined inputs before they are combined.*
5. **Q: How should a Class ${classNum} student study this?**
   - *A: Spend 5 minutes daily on definitions and answer keys!*`;
    }
  }

  if (style.tier === "middle") {
    // Return standard middle-school style guides
    if (sectionId === "intro") {
      return `# 🌅 Middle School Introduction: ${finalChName}
*Class ${classNum} • Subject: ${normSubject} • StudyMitra Engine*

Welcome to our formal syllabus review of **${finalChName}** for Grade ${classNum} pupils. This unit maps out fundamental properties, structural models, and everyday experiments. Core takeaways emphasize systematic calculations and highlighted vocabulary terms.`;
    }
    if (sectionId === "summary") {
      return `# 📋 Summary Review Sheet
* **Main Concept**: Understanding the key processes and configurations of ${finalChName}.
* **Primary Function**: It helps explain why systems, creatures, or equations interact in specific manners.
* **Academic Significance**: Learning this is essential for scoring well in upcoming exams and subsequent modules.
* **Real-World Connection**: We observe similar patterns and behaviors when executing daily laboratory experiments like *${style.examples[0]}*.`;
    }
    if (sectionId === "definitions") {
      return `# 📚 Middle-School Definitions Glossary
1. **${finalChName} Process**: The sequence of events that describe how parts integrate and operate within this chapter framework.
2. **Elementary Factors**: The basic units of ${normSubject} that build up the entire topic structure, such as *${style.examples[1]}*.
3. **Responsive Variable**: Any feature or quantity that alters its state during active classroom experiments.`;
    }
    if (sectionId === "keywords") {
      return `# 🔑 Core High-Yield Vocabulary
* **Analyze**: To break down a complex chapter topic into simpler parts to understand how they work together.
* **Classification**: Setting terms or materials into specific groups based on their properties or rules.
* **Systematic**: Working or studying in an organized, step-by-step manner.`;
    }
    if (sectionId === "formulas") {
      return `# ⚙️ Formula Sheet & Equations Finder
Here is your handy classroom cheat-sheet for Class ${classNum} equations:
* **The Golden Proportion**: The balance between inputs and outputs in ${normSubject} remains constant.
* **Formula 1**: $\\text{Balance} = \\text{Active Input} \\times \\text{Standard Efficiency Factor}$
* **Formulation 2**: $\\text{Net Output} = \\text{Initial State} + \\Delta \\text{Change Amount}$`;
    }
    if (sectionId === "examples") {
      return `# 💡 Real-Life Connections: ${finalChName}
* **Kitchen Connections**: The way ingredients, liquids, thermal heat, and timing combine to cook delicious meals perfectly.
* **Natural Cycles**: How water, rainfall, air, and plant photosynthesis operate harmoniously to support global life, like *${style.examples[0]}*.
* **Playgrounds**: ${style.examples[1]}.`;
    }
    if (sectionId === "mcq_quiz") {
      return `# 🎯 Standard MCQ Practice Assessment
1. **What is the primary core theme behind ${finalChName}?**
   - A) The main foundational building blocks
   - B) A completely unneeded auxiliary idea
   - *Correct Answer: A*

2. **Why do we partition chapter material step-by-step?**
   - A) To make definitions easy and highly clear
   - B) To run away from solving questions
   - *Correct Answer: A*

3. **Which factor is most essential in ${normSubject} experiments?**
   - A) Systematic observations and measurements
   - B) Quick guesses without calculations
   - *Correct Answer: A*`;
    }
    if (sectionId === "practice_q" || sectionId === "short_q" || sectionId === "long_q" || sectionId === "homework_help" || sectionId === "exam_tips") {
      return `# 🏋️ Practice Exercises & Prompts
1. **Short Question**: Define the main principle of ${finalChName} in your own words.
2. **Interactive Activity**: Locate two examples in your surrounding household or garden that resemble the key ideas of this chapter.
3. **Maths/Science Exercise**: Why does the efficiency factor remain constant? Calculate the expected balance if the inputs are doubled.`;
    }
  }

  if (style.tier === "secondary") {
    // Tier 4: Class 9 to 10
    if (sectionId === "intro") {
      return `# 🌅 Secondary Board Exam Intro: ${finalChName}
*Class ${classNum} • Subject: ${normSubject} • CBSE Exam Syllabus Unit*

Welcome to this extensive exam-focused guide for **${finalChName}**, which represents a critical chapter in class curriculum plans. Mastering this topic guarantees excellent marks in your high-school board finals. Let's analyze key formulas, conceptual diagrams, and previous-year exam trends!`;
    }
    if (sectionId === "summary") {
      return `# 📋 Detailed but Simple Explanations: ${finalChName}
This unit investigates the chemical or mechanical behaviors of **${finalChName}** systems:
- **Mechanics of Change**: States of equilibrium are altered when localized conditions of temperature, pressure, or concentrations shift.
- **The Core Law**: Every change is counteracted by system responses to ensure balanced energy ratios.
- **Practical Application**: ${style.examples[0]}.`;
    }
    if (sectionId === "definitions") {
      return `# 📚 Important Definitions Finder
* **Standard Variable Capacity**: The absolute ceiling representing how much energy or reactant can be dissolved safely in a solvent matrix under $1\\text{ atm}$.
* **Active Catalysis Coefficient**: The fraction expressing how effectively a catalyst speeds up rate cycles without being consumed.
* **Equilibrium Constant ($K_{eq}$)**: The ratio of product concentrations to reactant concentrations at steady thermodynamic states.`;
    }
    if (sectionId === "keywords") {
      return `# 🔑 Highly Crucial Index vocabularies
* **Stoichiometric Balance**: The quantitative relationship between reactants and products in chemical reactions.
* **Enthalpy of State**: The total heat content of a thermodynamic system.
* **Electrolysis Velocity**: The rate at which mechanical decomposition occurs under constant current fields.`;
    }
    if (sectionId === "formulas") {
      return `# ⚙️ Formula Sheet & Equations Diagram
Here are the critical quantitative tools for your board revisions:
* **The Fundamental Ratio**:
  $$PV = nRT$$
* **Rate Kinetics Formula**:
  $$\\text{Rate} = k [A]^x [B]^y$$
* **Work Equilibrium**:
  $$W = -P \\cdot \\Delta V$$

> **Workbook Tip**: Always declare standard SI units (like Joules, Pascals, or Kelvin) clearly to preserve complete board exam grades!`;
    }
    if (sectionId === "examples") {
      return `# 💡 Diagrams & Real-World Connections
* **Diagram Explanation**: The standard textbook flowchart for **${finalChName}** outlines:
  $$\\text{Reagents} \\xrightarrow[\\Delta \\text{Heat}]{\\text{Catalyst}} \\text{Transient Complex} \\rightarrow \\text{Stable Products}$$
* **Natural Examples**:
  - Carbon dioxide cycles in native forests.
  - ${style.examples[0]}
  - ${style.examples[1]}`;
    }
    if (sectionId === "mcq_quiz") {
      return `# 🎯 Board-Style MCQ Simulator
1. **What is the unit of the equilibrium constant for identical stoichiometric equations?**
   - A) It is a dimensionless ratio (unitless)
   - B) Joules per mole
   - *Correct Answer: A*

2. **How does adding a catalyst impact output yield?**
   - A) Increases reaction rate but has no impact on final yield equilibrium
   - B) Increases final yield exponentially
   - *Correct Answer: A*

3. **What does a negative Enthalpy ($\\Delta H < 0$) indicate?**
   - A) Exothermic process releasing thermal energy
   - B) Endothermic process absorbing heat
   - *Correct Answer: A*`;
    }
    if (sectionId === "practice_q" || sectionId === "short_q" || sectionId === "long_q" || sectionId === "homework_help" || sectionId === "exam_tips") {
      return `# 🏋️ Previous-Year style Board Questions & Practice Answers
* **Q1 (3 Marks - Short)**: Explain why reaction velocity increases with temperture.
  * *Answer: Rising temperature heightens average kinetic energies of particles, causing frequent collision rates that exceed activation thresholds.*
* **Q2 (5 Marks - Long)**: Formulate the full system model for ${finalChName} and compile a neat labeled diagram explanation.
  * *Answer: The system consists of reactant input manifolds, physical processing steps governed by catalyst variables, and product extraction channels. The diagram should map inputs entering from the left, peak energy levels at the center, and stable final products on the right.*
* **Q3 (2 Marks)**: Identify the limiting factor in *${style.examples[0]}*.
  * *Answer: The limiting factor is typically raw concentration ratios, which determines reaction limits.*`;
    }
  }

  // Tier 5: Class 11 to 12 - Senior
  if (sectionId === "intro") {
    return `# 🎓 Advanced Concept Intro: ${finalChName}
*Class ${classNum} • Subject: ${normSubject} • Advanced University-Prep Core*

Welcome to this rigorous academic review of **${finalChName}** tailored for Classes 11 and 12. This unit provides a complete mathematical, thermodynamic, and physical analysis, utilizing advanced equations, derivations, and step-by-step numerical solvers to prepare you for college entrance exams!`;
  }
  if (sectionId === "summary") {
    return `# 📋 Advanced Concept Summary: ${finalChName}
* Complete physical mechanism governing physical states.
* Kinetic mechanisms are characterized by the Arrhenius Activation Equation:
  $$k = A e^{-\\frac{E_a}{RT}}$$
* We observe this molecular framework in: *${style.examples[0]}*.`;
  }
  if (sectionId === "definitions") {
    return `# 📚 High-Level Academic definitions
1. **Gibbs Free Energy ($\\Delta G$)**: The thermodynamic potential used to calculate the maximum reversible work performed by thermodynamic systems under constant temperatures and pressures.
2. **Boltzmann Distribution**: The relative probability fraction of molecular systems occupying specific energy states.
3. **Arrhenius Term (A)**: The pre-exponential frequency factor representing active collision orientations.`;
  }
  if (sectionId === "keywords") {
    return `# 🔑 Highly Technical Keywords
* **Entropy Optimization**: The quantitative measure of thermodynamic disorder in closed multi-particle schemes.
* **Schrödinger Wavefunction**: The spatial probability function governing quantum energy shells.
* **Isotropic Coordinate Field**: Symmetrical spatial coordinates where material properties are uniform in all directions.`;
  }
  if (sectionId === "formulas") {
    return `# ⚙️ Derivations & Complete Formula Sheet
Let's analyze the mathematical proof of the integrated rate law:
1. **Step 1: Define First-Order Rate Equation**:
   $$-\\frac{d[A]}{dt} = k [A]$$
2. **Step 2: Separate Variables**:
   $$\\frac{d[A]}{[A]} = -k \\, dt$$
3. **Step 3: Integrate Both Sides**:
   $$\\int_{[A]_0}^{[A]_t} \\frac{d[A]}{[A]} = -k \\int_{0}^{t} dt \\implies \\ln \\frac{[A]_t}{[A]_0} = -kt$$
4. **Step 4: Express Exponentially**:
   $$[A]_t = [A]_0 e^{-kt}$$
*Conclusion*: Concentrated reactants decay as an exponential function of timer values, explaining standard kinetics.`;
  }
  if (sectionId === "examples") {
    return `# 💡 Case Studies & Step-by-Step Numericals
**Advanced Challenge Case**:
A $0.1\\text{ M}$ monoprotic buffer solution has an acid dissociation constant of $K_a = 1.8 \\times 10^{-5}$. Find the net hydronium pH.
- *Step 1*: Write the dissociation formula: $K_a = \\frac{[H^+][A^-]}{[HA]} \\approx \\frac{x^2}{0.1}$.
- *Step 2*: Solve for $x$: $x^2 = 1.8 \\times 10^{-6} \\implies x = 1.34 \\times 10^{-3}\\text{ M}$.
- *Step 3*: Compute pH: $\\text{pH} = -\\log_{10}(1.34 \\times 10^{-3}) = 2.87$!`;
  }
  if (sectionId === "mcq_quiz") {
    return `# 🎯 Advanced Entrance Exam MCQ Trainer
1. **Which parameter correctly represents free enthalpy at equilibrium states?**
   - A) $\\Delta G^{\\circ} = -RT \\ln K_{eq}$
   - B) $\\Delta G^{\\circ} = RT \\ln K_{eq}$
   - *Correct Answer: A*

2. **How does temperature affect standard transition states?**
   - A) It provides kinetic velocity to cross activation barriers but does not lower the activation energy itself
   - B) It lowers activation barriers directly
   - *Correct Answer: A*

3. **What represents an isometric thermodynamic change?**
   - A) Volumetric expansion is exactly zero ($dV = 0$)
   - B) Pressure changes are exactly zero ($dP = 0$)
   - *Correct Answer: A*`;
  }

  // practice, homework, exams
  return `# 🏆 Senior Board Prep, Revision Notes & Assertion-Reason Qs
* **Assertion [A]**: Catalysts increase chemical reaction speeds without altering enthalpy states.
* **Reason [R]**: Catalysts bypass the traditional high activation energy transition state, opening a lower energy pathway.
* **Evaluation**: *Both [A] and [R] are true, and [R] is the correct explanation of [A].*

### 🏋️ Practice Homework Prompt:
> **Question**: Formulate a complete physical derivation illustrating thermodynamics under isobaric expansion states. Explain why work is non-zero. Check your answers step-by-step!`;
}

export default function ChapterLearningSystem({ onSaveWork }: ChapterLearningSystemProps) {
  const [classNum, setClassNum] = useState<string>("7");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [customChapter, setCustomChapter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("intro");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  
  // Local cache for fetched active sections to feel lightning fast
  const [contentCache, setContentCache] = useState<Record<string, string>>({});

  // 1. subjects data according to school levels
  const getSubjectsForClass = (gradeStr: string) => {
    const grade = parseInt(gradeStr, 10);
    if (grade <= 5) {
      return ["English", "Hindi", "Maths", "EVS", "General Knowledge", "Computer", "Moral Science"];
    } else if (grade <= 8) {
      return ["English", "Hindi", "Maths", "Science", "Social Science", "Computer", "GK", "Sanskrit"];
    } else {
      return [
        "English", "Hindi", "Maths", "Physics", "Chemistry", "Biology", 
        "History", "Geography", "Civics", "Economics", "Political Science", 
        "Computer Science", "Accountancy", "Business Studies", "GK"
      ];
    }
  };

  // 2. Typical standard chapters DB
  const standardChaptersDB: Record<string, Record<string, string[]>> = {
    lower: {
      English: ["The Magic Garden", "Flying Man", "Alice in Wonderland", "Ice-Cream Man", "Robinson Crusoe", "My Shadow"],
      Maths: ["Fish Tale & Large Numbers", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Basic Division & Tables", "Smart Charts"],
      EVS: ["Super Senses", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Sunita in Space", "What if it Finishes?"],
      "General Knowledge": ["The Animal World", "Incredible India Heritage", "World Wonders & Flags", "Basic Human Body", "Famous Inventions"],
      Computer: ["Parts of a Desktop Computer", "Understanding Paintbrush Tool", "Introduction to MS Word", "Safe Browsing Habits", "Keyboard Shortcuts"],
      "Moral Science": ["Sharing is Caring", "The Power of Honesty", "Loving Pets & Nature", "Time is Precious", "Respecting Our Elders"]
    },
    middle: {
      English: ["Who Did Patrick's Homework?", "How the Dog Found a Master", "Taro's Reward", "A Different Kind of School", "The Banyan Tree"],
      Hindi: ["वह चिड़िया जो", "बचपन की यादें", "नादान दोस्त", "चाँद से थोड़ी सी गप्पें", "अक्षरों का महत्व"],
      Maths: ["Knowing Our Numbers", "Whole Numbers & Fractions", "Playing with Numbers", "Basic Geometrical Ideas", "Algebra Intro", "Data Handling"],
      Science: ["Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Light, Shadows and Reflections"],
      "Social Science": ["What, Where, How and When? (History)", "Diversity and Discrimination (Civics)", "The Earth in the Solar System (Geography)", "On the Trail of Earliest People", "What is Government?"],
      Computer: ["Generations of Computers", "Introduction to MS Excel", "Understanding HTML Coding", "E-Commerce Basics", "Computer Viruses & Security"],
      GK: ["Famous Indian Landmarks", "Space Expeditions & Satellites", "Nobel Prize Winners", "Medicinal Plants", "Major World Rivers"],
      Sanskrit: ["शब्दपरिचयः", "आकाशः पतति", "वर्णमाला परिचयः", "क्रीडास्पर्धा"]
    },
    higher: {
      English: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Road Not Taken"],
      Maths: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Quadratic Equations", "Probability & Statistics"],
      Physics: ["Motion & Speed", "Force and Laws of Motion", "Gravitation & Weight", "Work, Energy and Power", "Sound Waves", "Light Reflection & Refraction"],
      Chemistry: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "Chemical Reactions & Equations", "Carbon & its Compounds"],
      Biology: ["Cell - The Fundamental Unit of Life", "Plant and Animal Tissues", "Why Do We Fall Ill?", "Life Processes & Nutrition", "Control and Coordination", "Heredity & Evolution"],
      History: ["The French Revolution", "Socialism in Europe & Russian Revolution", "Nazism and the Rise of Hitler", "Nationalism in India", "The Making of a Global World"],
      Geography: ["India - Size and Location", "Physical Features of India", "Drainage Rivers System", "Climate and Weather", "Natural Vegetation & Wildlife"],
      Civics: ["What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights"],
      Economics: ["The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security in India"],
      "Political Science": ["Power Sharing", "Federalism in Government", "Gender, Religion and Caste", "Political Parties"],
      "Computer Science": ["Computer Networks & Protocol", "Variables & Loops in Python", "Introduction to SQL Queries", "Cyber Ethics"],
      Accountancy: ["Introduction to Accounting Principles", "Theory Base of Accounting", "Recording of Transactions - Ledger & Journal", "Bank Reconciliation Statement"],
      "Business Studies": ["Nature and Purpose of Business", "Forms of Business Organisations", "Private, Public and Global Enterprises", "Business Services"],
      GK: ["Advanced World Geopolitics", "Union Budget of India", "Environmental Conventions", "Scientific Innovations", "Cyber Laws & Cryptocurrencies"]
    }
  };

  const getChaptersForSubject = (gradeStr: string, subject: string) => {
    const grade = parseInt(gradeStr, 10);
    let category = "middle";
    if (grade <= 5) category = "lower";
    else if (grade >= 9) category = "higher";

    const catDb = standardChaptersDB[category] || {};
    return catDb[subject] || ["Chapter 1: Overview & History", "Chapter 2: Concept Core Level", "Chapter 3: Exercises & Practical File", "Chapter 4: Class Revision Chapter"];
  };

  // Reset subject and chapter when classNum changes
  useEffect(() => {
    const subs = getSubjectsForClass(classNum);
    setSelectedSubject(subs[0]);
    setContentCache({});
    setResultText("");
  }, [classNum]);

  // Reset chapter and custom text when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const chs = getChaptersForSubject(classNum, selectedSubject);
      setSelectedChapter(chs[0]);
      setCustomChapter("");
      setContentCache({});
      setResultText("");
    }
  }, [selectedSubject]);

  // Reset results and clean cache when active chapter or customChapter changes
  useEffect(() => {
    setContentCache({});
    setResultText("");
  }, [selectedChapter]);

  // Fetch learning section logic from express api
  const fetchSectionContent = async (sectionId: string, forceRefresh = false) => {
    setError("");
    let finalSubjectName = selectedSubject || "Science";
    let finalChapter = customChapter.trim() || selectedChapter;
    if (!finalChapter) {
      if (getChaptersForSubject && typeof getChaptersForSubject === "function") {
        const defaultChapters = getChaptersForSubject(classNum, finalSubjectName);
        finalChapter = defaultChapters[0] || "Foundational Chapter";
      } else {
        finalChapter = "Foundational Chapter";
      }
      setCustomChapter(finalChapter);
    }

    const cacheKey = `${classNum}-${finalSubjectName}-${finalChapter}-${sectionId}`;
    if (!forceRefresh && contentCache[cacheKey]) {
      setResultText(contentCache[cacheKey]);
      setActiveTab(sectionId);
      return;
    }

    setLoading(true);
    setResultText("");
    setActiveTab(sectionId);

    const matchName = sections.find(s => s.id === sectionId)?.label || sectionId;

    try {
      const resp = await fetch("/api/generate/chapter-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classNum,
          subject: finalSubjectName,
          chapter: finalChapter,
          sectionId,
          sectionName: matchName
        })
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load chapter section.");
      }

      const data = await resp.json();
      const generated = data.text;
      setIsDemo(!!data.isDemo);

      // Update Cache
      setContentCache(prev => ({
        ...prev,
        [cacheKey]: generated
      }));
      setResultText(generated);
      setCopied(false);
      setSaved(false);
    } catch (err: any) {
      console.warn("Express chapter learning API failed. Engaging smart local fallback generator:", err);
      const generated = getLocalChapterContent(classNum, finalSubjectName, finalChapter, sectionId);
      setContentCache(prev => ({
        ...prev,
        [cacheKey]: generated
      }));
      setResultText(generated);
      setIsDemo(true);
      setCopied(false);
      setSaved(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resultText) return;
    const ok = await copyToClipboard(resultText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!resultText) return;
    const finalCh = customChapter.trim() || selectedChapter;
    const sectionName = sections.find(s => s.id === activeTab)?.label || activeTab;
    const filename = `Class-${classNum}-${selectedSubject.toLowerCase()}-${finalCh.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activeTab}.txt`;
    downloadTextFile(filename, resultText);
  };

  const handleSave = () => {
    if (!resultText) return;
    const finalCh = customChapter.trim() || selectedChapter;
    const sectionName = sections.find(s => s.id === activeTab)?.label || activeTab;
    
    onSaveWork({
      type: "Chapter Learning",
      title: `${selectedSubject} - Ch: ${finalCh} (${sectionName})`,
      content: resultText,
      metadata: { classNum, subject: selectedSubject, chapter: finalCh, sectionId: activeTab }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentClassSubjects = getSubjectsForClass(classNum);
  const currentSubjectChapters = getChaptersForSubject(classNum, selectedSubject);
  const displayedChapter = customChapter.trim() || selectedChapter;

  return (
    <div className="space-y-8" id="smart-chapter-learning-helper">
      
      {/* Title Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-150 dark:border-slate-805 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
              Smart Chapter-wise Learning System 📖
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any class from Class 1 to 12. Instantly unlock personalized summaries, homework assistances, step-by-step math formulas, and interactive tests carefully aligned to your standard!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation & Selectors Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-emerald-100 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-md text-slate-900 dark:text-white font-display border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" /> Lesson Selectors
            </h3>

            {/* 1. Class selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-class-num" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                1. Pick Standard / Class:
              </label>
              <select
                id="smart-class-num"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => {
                  let badge = "(Primary)";
                  if (grade > 5 && grade <= 8) badge = "(Middle)";
                  else if (grade > 8) badge = "(High School/Senior)";
                  return (
                    <option key={grade} value={grade.toString()}>
                      Class {grade} {badge}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Subject selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                2. Select Subject:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
                {currentClassSubjects.map((sub) => {
                  const isSel = selectedSubject === sub;
                  return (
                    <button
                      key={sub}
                      id={`smart-sub-btn-${sub.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        isSel
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Chapter Selector */}
            <div className="space-y-1.5">
              <label htmlFor="smart-chapter" className="block text-xs font-bold text-slate-700 dark:text-slate-350 font-display">
                3. Choose Chapter:
              </label>
              <select
                id="smart-chapter"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-450 outline-none font-sans text-sm dark:bg-slate-800 dark:text-white cursor-pointer"
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setCustomChapter("");
                }}
              >
                {currentSubjectChapters.map((ch, idx) => (
                  <option key={idx} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Or key-in Custom Chapter */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-805 space-y-1.5">
              <label htmlFor="smart-custom-chapter" className="block text-[10px] font-bold text-slate-400 tracking-wider font-display uppercase">
                Or Type Custom Chapter Name:
              </label>
              <input
                type="text"
                id="smart-custom-chapter"
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                placeholder="e.g. Ancient Roman Empire, Trigonometry"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-202 dark:border-slate-700 focus:border-emerald-400 outline-none font-sans text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Stats / Lesson details card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-display">
              Standard Calibration 🧪
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-450">Active Class:</span>
                <span className="font-bold text-slate-900 dark:text-white">Class {classNum}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-450">Target Subject:</span>
                <span className="font-bold text-slate-905 dark:text-white">{selectedSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Vocabulary Level:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {parseInt(classNum, 10) <= 5 ? "Easy Primary" : parseInt(classNum, 10) <= 8 ? "Intermed Middle" : "Rich/Academic High"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Learning Deck Column */}
        <div className="lg:col-span-8 flex flex-col min-h-[580px]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-850 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-900 p-5 rounded-3xl mb-6 text-sm flex gap-3" id="smart-chapter-error">
              <span>⚠️</span>
              <div>
                <strong>Failed Loading Chapter:</strong> {error}
              </div>
            </div>
          )}

          {/* Main Workspace Board */}
          <div className="bg-white dark:bg-slate-905 rounded-3xl border-3 border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col flex-grow overflow-hidden">
            
            {/* Top Chapter Head Info Banner */}
            <div className="bg-emerald-50/55 dark:bg-emerald-950/15 px-6 py-5 border-b border-slate-101 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/40 px-2 py-1 rounded">
                  Class {classNum} • {selectedSubject}
                </span>
                <h3 className="text-md font-bold text-slate-900 dark:text-white mt-1.5 font-display flex items-center gap-1.5">
                  📁 Current Chapter: "{displayedChapter}"
                </h3>
              </div>

              {resultText && (
                <div className="flex items-center gap-2" id="chapter-learning-header-actions">
                  <button
                    onClick={handleCopy}
                    id="copy-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    id="download-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-202 dark:border-slate-700 text-xs font-semibold text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    id="save-chapter-button"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900 border border-emerald-202 dark:border-emerald-850 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px]">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Save Work</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Smart 12 tabs horizontal scrollable container */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex overflow-x-auto whitespace-nowrap p-2 scrollbar-none gap-1">
              {sections.map((sec) => {
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    id={`chapter-tab-button-${sec.id}`}
                    onClick={() => fetchSectionContent(sec.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all font-display text-xs font-semibold cursor-pointer select-none ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-emerald-650 dark:text-emerald-400 border border-slate-200 dark:border-slate-750 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-850/60 dark:hover:text-slate-200"
                    }`}
                    title={sec.desc}
                  >
                    <span>{sec.emoji}</span>
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Markdown Viewer Area */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[640px] prose dark:prose-invert max-w-none prose-sm prose-slate selection:bg-emerald-150">
              
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                    <Sparkles className="w-5 h-5 absolute top-0 right-0 text-emerald-450 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 font-display">
                      Opening Smart School Textbook... 🔍
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Our school study tutor is custom tailoring notes, definitions, example calculations, or MCQ test sheets for "{displayedChapter}"!
                    </p>
                  </div>
                </div>
              ) : resultText ? (
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed" id="chapter-learning-rendered-markdown">
                  {isDemo && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-xs text-amber-805 dark:text-amber-300 mb-6 flex items-start gap-2.5 font-sans">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-sm font-display">Demo Mode Active</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-350 text-xs">
                          This chapter breakdown is running in offline-calibration mode because live AI secrets are not active. To explore custom, real-time breakdowns of any bespoke school syllabus, configure your <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-[11px] text-amber-955 dark:text-amber-100">GEMINI_API_KEY</code> within Settings &gt; Secrets.
                        </p>
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold font-display text-emerald-650 dark:text-emerald-400 mt-2 mb-4 border-b border-emerald-100 dark:border-slate-800 pb-2 flex items-center gap-2" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-md font-bold font-display text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-sm" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-805" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-slate-50 dark:bg-slate-800" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 text-left text-xs font-bold font-display text-slate-655 dark:text-slate-350 uppercase tracking-wider border-b border-slate-200 dark:border-slate-750" {...props} />,
                      tr: ({ ...props }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 divide-x divide-slate-100 dark:divide-slate-800" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-xs font-medium text-slate-707 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-emerald-900 dark:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-955/15 pl-4 py-2 italic my-4 rounded-r-xl text-slate-600 dark:text-slate-350" {...props} />,
                    }}
                  >
                    {resultText}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 font-display">
                      Unlock Your School Chapter 🚀
                    </h5>
                    <p className="text-xs text-slate-400 max-w-sm mt-1.5 mx-auto leading-relaxed">
                      Select your class, subject, and chapter. Then click on any of the 12 textbook tabs above to load personalized study material instantly!
                    </p>
                  </div>

                  <button
                    onClick={() => fetchSectionContent("intro")}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-semibold text-xs rounded-2xl transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5 border-b-2 border-emerald-700"
                  >
                    Load Lesson Introduction <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
