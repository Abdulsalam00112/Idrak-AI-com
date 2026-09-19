// Seed data for Idrak AI — used both for previews and as demo data
import type { ExamCategory, Difficulty } from './types';

export interface ExamSeed {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  description: string;
  longDescription: string;
  color: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  subjects: SubjectSeed[];
}

export interface SubjectSeed {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics: TopicSeed[];
}

export interface TopicSeed {
  id: string;
  name: string;
  description: string;
  examWeight: number;
  avgDifficulty: number;
  subtopics?: string[];
  sampleQuestions?: QuestionSeed[];
}

export interface QuestionSeed {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  year?: number;
}

export const EXAMS: ExamSeed[] = [
  {
    id: 'exam-jamb',
    code: 'JAMB',
    name: 'JAMB UTME',
    shortName: 'JAMB',
    category: 'national',
    description: 'Build a smarter UTME preparation plan based on your strengths, weaknesses and historical question patterns.',
    longDescription: 'The Joint Admissions and Matriculation Board Unified Tertiary Matriculation Examination is the primary entrance exam for Nigerian universities. Idrak AI analyzes over 20 years of past questions to surface the topics that matter most.',
    color: '#ff6b4a',
    totalQuestions: 12480,
    durationMinutes: 120,
    passingScore: 50,
    subjects: [
      {
        id: 'subj-math',
        name: 'Mathematics',
        icon: 'calculator',
        color: '#ff6b4a',
        description: 'Number and numeration, algebra, geometry, statistics, calculus.',
        topics: [
          {
            id: 'topic-algebra',
            name: 'Algebra',
            description: 'Quadratic equations, polynomials, inequalities, sequences & series.',
            examWeight: 0.88,
            avgDifficulty: 0.62,
            subtopics: ['Quadratic Equations', 'Simultaneous Equations', 'Polynomials', 'Inequalities', 'Sequences & Series'],
            sampleQuestions: [
              {
                id: 'q-alg-1',
                text: 'If x² − 5x + 6 = 0, what are the values of x?',
                options: [
                  { id: 'A', text: '2 and 3' },
                  { id: 'B', text: '1 and 6' },
                  { id: 'C', text: '−2 and −3' },
                  { id: 'D', text: '2 and −3' },
                ],
                correctAnswer: 'A',
                explanation: 'The quadratic factors as (x − 2)(x − 3) = 0, so x = 2 or x = 3. You can verify by substituting back: when x=2, 4 − 10 + 6 = 0. When x=3, 9 − 15 + 6 = 0.',
                difficulty: 'easy',
                year: 2023,
              },
              {
                id: 'q-alg-2',
                text: 'Solve: 2x + 3y = 13 and 4x − y = 5.',
                options: [
                  { id: 'A', text: 'x = 1, y = 3' },
                  { id: 'B', text: 'x = 2, y = 3' },
                  { id: 'C', text: 'x = 3, y = 2' },
                  { id: 'D', text: 'x = 2, y = 4' },
                ],
                correctAnswer: 'B',
                explanation: 'From equation 2: y = 4x − 5. Substitute into equation 1: 2x + 3(4x − 5) = 13 → 2x + 12x − 15 = 13 → 14x = 28 → x = 2. Then y = 4(2) − 5 = 3.',
                difficulty: 'medium',
                year: 2022,
              },
            ],
          },
          {
            id: 'topic-geometry',
            name: 'Geometry & Trigonometry',
            description: 'Plane geometry, circles, triangles, trigonometric ratios, bearings.',
            examWeight: 0.72,
            avgDifficulty: 0.58,
            subtopics: ['Triangles', 'Circles', 'Trigonometric Ratios', 'Bearings & Distances', 'Mensuration'],
          },
          {
            id: 'topic-statistics',
            name: 'Statistics & Probability',
            description: 'Data representation, measures of central tendency, probability, permutations.',
            examWeight: 0.65,
            avgDifficulty: 0.55,
            subtopics: ['Mean, Median, Mode', 'Standard Deviation', 'Probability', 'Permutations & Combinations'],
          },
          {
            id: 'topic-calculus',
            name: 'Calculus',
            description: 'Limits, differentiation, integration, applications.',
            examWeight: 0.58,
            avgDifficulty: 0.72,
            subtopics: ['Differentiation', 'Integration', 'Applications of Calculus'],
          },
          {
            id: 'topic-numbers',
            name: 'Number & Numeration',
            description: 'Fractions, decimals, percentages, indices, logarithms.',
            examWeight: 0.78,
            avgDifficulty: 0.42,
            subtopics: ['Fractions & Decimals', 'Percentages', 'Indices', 'Logarithms', 'Surds'],
          },
        ],
      },
      {
        id: 'subj-english',
        name: 'Use of English',
        icon: 'book-open',
        color: '#b8a4e8',
        description: 'Comprehension, lexis & structure, oral English, summary writing.',
        topics: [
          {
            id: 'topic-comprehension',
            name: 'Reading Comprehension',
            description: 'Understanding passages, inference, author intent, vocabulary in context.',
            examWeight: 0.9,
            avgDifficulty: 0.5,
            subtopics: ['Main Idea', 'Inference', 'Tone & Mood', 'Vocabulary in Context'],
          },
          {
            id: 'topic-lexis',
            name: 'Lexis & Structure',
            description: 'Synonyms, antonyms, sentence completion, idioms, register.',
            examWeight: 0.82,
            avgDifficulty: 0.48,
            subtopics: ['Synonyms', 'Antonyms', 'Idioms', 'Sentence Completion'],
          },
          {
            id: 'topic-oral',
            name: 'Oral English',
            description: 'Vowel sounds, consonant sounds, stress, intonation.',
            examWeight: 0.68,
            avgDifficulty: 0.45,
            subtopics: ['Vowel Sounds', 'Consonant Sounds', 'Word Stress', 'Emphatic Stress'],
          },
        ],
      },
      {
        id: 'subj-physics',
        name: 'Physics',
        icon: 'atom',
        color: '#4ecdc4',
        description: 'Mechanics, waves, electricity, modern physics, optics.',
        topics: [
          {
            id: 'topic-mechanics',
            name: 'Mechanics',
            description: 'Motion, forces, energy, momentum, pressure.',
            examWeight: 0.85,
            avgDifficulty: 0.6,
            subtopics: ['Linear Motion', 'Forces', 'Energy', 'Momentum', 'Pressure in Fluids'],
          },
          {
            id: 'topic-waves',
            name: 'Waves & Optics',
            description: 'Wave properties, sound, light, reflection, refraction.',
            examWeight: 0.6,
            avgDifficulty: 0.52,
            subtopics: ['Wave Properties', 'Sound Waves', 'Light Waves', 'Reflection', 'Refraction'],
          },
          {
            id: 'topic-electricity',
            name: 'Electricity & Magnetism',
            description: 'Current, voltage, resistance, circuits, electromagnetic induction.',
            examWeight: 0.78,
            avgDifficulty: 0.65,
            subtopics: ['Ohm\'s Law', 'Circuits', 'Electrical Power', 'Magnetism', 'Induction'],
          },
          {
            id: 'topic-modern',
            name: 'Modern Physics',
            description: 'Atomic structure, radioactivity, quantum theory.',
            examWeight: 0.45,
            avgDifficulty: 0.68,
            subtopics: ['Atomic Models', 'Radioactivity', 'Photoelectric Effect'],
          },
        ],
      },
      {
        id: 'subj-chemistry',
        name: 'Chemistry',
        icon: 'flask-conical',
        color: '#ffd93d',
        description: 'Physical, organic, inorganic chemistry; separations, reactions, calculations.',
        topics: [
          {
            id: 'topic-stoichiometry',
            name: 'Stoichiometry & Mole Concept',
            description: 'Mole calculations, balancing equations, empirical formulas.',
            examWeight: 0.82,
            avgDifficulty: 0.62,
            subtopics: ['Mole Concept', 'Balancing Equations', 'Empirical Formula', 'Limiting Reagents'],
          },
          {
            id: 'topic-organic',
            name: 'Organic Chemistry',
            description: 'Hydrocarbons, functional groups, reactions, nomenclature.',
            examWeight: 0.75,
            avgDifficulty: 0.68,
            subtopics: ['Alkanes', 'Alkenes', 'Alkynes', 'Alkanols', 'Alkanoic Acids'],
          },
          {
            id: 'topic-atomic',
            name: 'Atomic Structure & Bonding',
            description: 'Atomic models, electron configuration, chemical bonding.',
            examWeight: 0.7,
            avgDifficulty: 0.55,
            subtopics: ['Atomic Models', 'Electron Configuration', 'Ionic Bonding', 'Covalent Bonding'],
          },
          {
            id: 'topic-acids',
            name: 'Acids, Bases & Salts',
            description: 'pH, neutralization, titration, hydrolysis, salts.',
            examWeight: 0.62,
            avgDifficulty: 0.55,
            subtopics: ['pH Scale', 'Neutralization', 'Titration', 'Hydrolysis of Salts'],
          },
        ],
      },
      {
        id: 'subj-biology',
        name: 'Biology',
        icon: 'leaf',
        color: '#4ecdc4',
        description: 'Cell biology, genetics, ecology, human physiology, evolution.',
        topics: [
          {
            id: 'topic-cell',
            name: 'Cell Biology',
            description: 'Cell structure, organelles, cell division, transport across membranes.',
            examWeight: 0.78,
            avgDifficulty: 0.48,
            subtopics: ['Cell Structure', 'Organelles', 'Mitosis', 'Meiosis', 'Osmosis & Diffusion'],
          },
          {
            id: 'topic-genetics',
            name: 'Genetics & Evolution',
            description: 'Mendelian genetics, DNA, variation, natural selection.',
            examWeight: 0.72,
            avgDifficulty: 0.65,
            subtopics: ['Mendelian Inheritance', 'DNA Structure', 'Variation', 'Natural Selection'],
          },
          {
            id: 'topic-ecology',
            name: 'Ecology',
            description: 'Ecosystems, food chains, nutrient cycles, pollution, conservation.',
            examWeight: 0.68,
            avgDifficulty: 0.5,
            subtopics: ['Ecosystems', 'Food Webs', 'Biogeochemical Cycles', 'Pollution'],
          },
          {
            id: 'topic-physiology',
            name: 'Human Physiology',
            description: 'Digestive, respiratory, circulatory, excretory, nervous systems.',
            examWeight: 0.85,
            avgDifficulty: 0.58,
            subtopics: ['Digestive System', 'Respiratory System', 'Circulatory System', 'Nervous System'],
          },
        ],
      },
    ],
  },
  {
    id: 'exam-waec',
    code: 'WAEC',
    name: 'WAEC SSCE',
    shortName: 'WAEC',
    category: 'national',
    description: 'West African Senior School Certificate Examination preparation with topic-level intelligence.',
    longDescription: 'WAEC is taken by final-year secondary school students across West Africa. Idrak focuses on frequently repeated topics, marking schemes, and common student pitfalls.',
    color: '#b8a4e8',
    totalQuestions: 9840,
    durationMinutes: 180,
    passingScore: 45,
    subjects: [
      { id: 'subj-math-w', name: 'Mathematics', icon: 'calculator', color: '#ff6b4a', description: 'Core mathematics for WASSCE.', topics: [] },
      { id: 'subj-eng-w', name: 'English Language', icon: 'book-open', color: '#b8a4e8', description: 'Essay, comprehension, summary, lexis.', topics: [] },
      { id: 'subj-phy-w', name: 'Physics', icon: 'atom', color: '#4ecdc4', description: 'WASSCE Physics.', topics: [] },
      { id: 'subj-che-w', name: 'Chemistry', icon: 'flask-conical', color: '#ffd93d', description: 'WASSCE Chemistry.', topics: [] },
      { id: 'subj-bio-w', name: 'Biology', icon: 'leaf', color: '#4ecdc4', description: 'WASSCE Biology.', topics: [] },
      { id: 'subj-eco-w', name: 'Economics', icon: 'trending-up', color: '#ff8b6f', description: 'WASSCE Economics.', topics: [] },
    ],
  },
  {
    id: 'exam-neco',
    code: 'NECO',
    name: 'NECO SSCE',
    shortName: 'NECO',
    category: 'national',
    description: 'National Examinations Council Senior School Certificate preparation.',
    longDescription: 'NECO is a Nigerian national exam taken alongside or as an alternative to WAEC. Idrak covers its unique question patterns and focus areas.',
    color: '#4ecdc4',
    totalQuestions: 7200,
    durationMinutes: 180,
    passingScore: 45,
    subjects: [],
  },
  {
    id: 'exam-postutme',
    code: 'POST-UTME',
    name: 'Post-UTME',
    shortName: 'Post-UTME',
    category: 'university_entrance',
    description: 'University-specific Post-UTME screening with institution-precise practice.',
    longDescription: 'After JAMB, Nigerian universities run their own Post-UTME screenings. Idrak includes university-specific question patterns for major institutions.',
    color: '#ffd93d',
    totalQuestions: 4800,
    durationMinutes: 60,
    passingScore: 50,
    subjects: [],
  },
  {
    id: 'exam-sat',
    code: 'SAT',
    name: 'SAT',
    shortName: 'SAT',
    category: 'international',
    description: 'Digital SAT preparation with adaptive practice and college-board-style questions.',
    longDescription: 'The SAT is used for US and international university admissions. Idrak focuses on evidence-based reading, writing, and math with evidence-based, adaptive practice.',
    color: '#ff6b4a',
    totalQuestions: 3200,
    durationMinutes: 134,
    passingScore: 1080,
    subjects: [],
  },
  {
    id: 'exam-ielts',
    code: 'IELTS',
    name: 'IELTS',
    shortName: 'IELTS',
    category: 'international',
    description: 'Academic and General IELTS preparation across all four skills.',
    longDescription: 'IELTS measures English language proficiency for study, work, and migration. Idrak covers Listening, Reading, Writing, and Speaking with band-score-aligned feedback.',
    color: '#8b6fc0',
    totalQuestions: 2100,
    durationMinutes: 165,
    passingScore: 6.5,
    subjects: [],
  },
  {
    id: 'exam-ican',
    code: 'ICAN',
    name: 'ICAN',
    shortName: 'ICAN',
    category: 'professional',
    description: 'Institute of Chartered Accountants of Nigeria certification with reasoning-first AI Tutoring.',
    longDescription: 'ICAN is Nigeria\'s flagship professional accounting qualification. Idrak\'s professional mode emphasizes step-by-step reasoning, verification, and deep conceptual understanding — not just answers.',
    color: '#ff6b4a',
    totalQuestions: 3600,
    durationMinutes: 180,
    passingScore: 50,
    subjects: [],
  },
  {
    id: 'exam-citn',
    code: 'CITN',
    name: 'CITN',
    shortName: 'CITN',
    category: 'professional',
    description: 'Chartered Institute of Taxation of Nigeria preparation.',
    longDescription: 'CITN certifies tax professionals in Nigeria. Idrak provides reasoning-focused tutoring for tax law, computations, and professional ethics.',
    color: '#4ecdc4',
    totalQuestions: 1800,
    durationMinutes: 180,
    passingScore: 50,
    subjects: [],
  },
];

export function getExamById(id: string): ExamSeed | undefined {
  return EXAMS.find(e => e.id === id);
}

export function getExamByCode(code: string): ExamSeed | undefined {
  return EXAMS.find(e => e.code.toLowerCase() === code.toLowerCase());
}

// Demo user state
export const DEMO_USER = {
  id: 'user-demo',
  firstName: 'Amara',
  lastName: 'Okafor',
  email: 'amara@idrak.ai',
  exam: 'JAMB',
  examDate: '2026-06-15',
  targetScore: 320,
  dailyStudyMinutes: 60,
  currentStreak: 7,
  totalStudyMinutes: 4230,
  totalQuestionsAnswered: 1247,
  averageAccuracy: 74,
  readinessScore: 72,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const PERFORMANCE_SNAPSHOT = {
  overallReadiness: 72,
  accuracy: 74,
  questionsAnswered: 1247,
  studyTimeHours: 70.5,
  currentStreak: 7,
  targetScore: 320,
  estimatedScore: 278,
  daysUntilExam: 47,
};

export const TOPIC_INTELLIGENCE = [
  { topicId: 'topic-algebra', name: 'Algebra', subject: 'Mathematics', examWeight: 88, performance: 52, priority: 'critical', trend: 'improving', subtopics: 5, questionsAnswered: 48 },
  { topicId: 'topic-mechanics', name: 'Mechanics', subject: 'Physics', examWeight: 85, performance: 61, priority: 'high', trend: 'stable', subtopics: 5, questionsAnswered: 34 },
  { topicId: 'topic-physiology', name: 'Human Physiology', subject: 'Biology', examWeight: 85, performance: 48, priority: 'critical', trend: 'declining', subtopics: 4, questionsAnswered: 22 },
  { topicId: 'topic-stoichiometry', name: 'Stoichiometry', subject: 'Chemistry', examWeight: 82, performance: 56, priority: 'high', trend: 'improving', subtopics: 4, questionsAnswered: 29 },
  { topicId: 'topic-comprehension', name: 'Reading Comprehension', subject: 'English', examWeight: 90, performance: 82, priority: 'maintain', trend: 'strong', subtopics: 4, questionsAnswered: 67 },
  { topicId: 'topic-statistics', name: 'Statistics', subject: 'Mathematics', examWeight: 65, performance: 78, priority: 'maintain', trend: 'strong', subtopics: 4, questionsAnswered: 38 },
  { topicId: 'topic-lexis', name: 'Lexis & Structure', subject: 'English', examWeight: 82, performance: 71, priority: 'medium', trend: 'improving', subtopics: 4, questionsAnswered: 54 },
  { topicId: 'topic-genetics', name: 'Genetics', subject: 'Biology', examWeight: 72, performance: 58, priority: 'high', trend: 'improving', subtopics: 4, questionsAnswered: 26 },
  { topicId: 'topic-organic', name: 'Organic Chemistry', subject: 'Chemistry', examWeight: 75, performance: 44, priority: 'critical', trend: 'declining', subtopics: 5, questionsAnswered: 18 },
  { topicId: 'topic-electricity', name: 'Electricity', subject: 'Physics', examWeight: 78, performance: 55, priority: 'high', trend: 'stable', subtopics: 5, questionsAnswered: 31 },
  { topicId: 'topic-numbers', name: 'Number & Numeration', subject: 'Mathematics', examWeight: 78, performance: 81, priority: 'maintain', trend: 'strong', subtopics: 5, questionsAnswered: 52 },
  { topicId: 'topic-calculus', name: 'Calculus', subject: 'Mathematics', examWeight: 58, performance: 49, priority: 'high', trend: 'stable', subtopics: 3, questionsAnswered: 21 },
];

export const TODAY_FOCUS = {
  topicId: 'topic-algebra',
  topicName: 'Algebra — Quadratic Equations',
  subject: 'Mathematics',
  reason: 'High exam weight (88% frequency) + your performance is weak (52%). This is your highest-priority topic right now.',
  duration: 30,
  priority: 'critical' as const,
  questionsTarget: 15,
};

export const WEEKLY_PLAN = [
  { day: 'Monday', date: '', items: [
    { title: 'Algebra — Quadratic Equations', subject: 'Mathematics', duration: 30, priority: 'critical' as const, type: 'practice' },
    { title: 'Comprehension Passages', subject: 'English', duration: 20, priority: 'low' as const, type: 'reading' },
  ]},
  { day: 'Tuesday', date: '', items: [
    { title: 'Mechanics — Motion & Forces', subject: 'Physics', duration: 25, priority: 'high' as const, type: 'practice' },
    { title: 'Stoichiometry Revision', subject: 'Chemistry', duration: 25, priority: 'high' as const, type: 'revision' },
  ]},
  { day: 'Wednesday', date: '', items: [
    { title: 'Probability Practice', subject: 'Mathematics', duration: 30, priority: 'medium' as const, type: 'practice' },
  ]},
  { day: 'Thursday', date: '', items: [
    { title: 'Algebra Revision', subject: 'Mathematics', duration: 20, priority: 'high' as const, type: 'revision' },
    { title: 'Organic Chemistry', subject: 'Chemistry', duration: 30, priority: 'critical' as const, type: 'practice' },
  ]},
  { day: 'Friday', date: '', items: [
    { title: 'Mixed Practice (Math + English)', subject: 'Multiple', duration: 40, priority: 'medium' as const, type: 'mixed' },
  ]},
  { day: 'Saturday', date: '', items: [
    { title: 'Full Mock Exam', subject: 'All', duration: 120, priority: 'critical' as const, type: 'mock' },
  ]},
  { day: 'Sunday', date: '', items: [
    { title: 'Review Weak Areas', subject: 'Mixed', duration: 25, priority: 'medium' as const, type: 'review' },
  ]},
];

export const RECOMMENDED_PRACTICE = [
  { title: 'Practice 15 Algebra questions', reason: 'Critical topic — 88% exam weight, 52% accuracy', duration: 25, type: 'topic', icon: 'pencil', cta: 'Start', color: 'coral' },
  { title: 'Review Probability basics', reason: 'Upcoming in your plan, 78% accuracy', duration: 20, type: 'review', icon: 'book-open', cta: 'Review', color: 'lavender' },
  { title: 'Take a timed Math test', reason: 'Build stamina for the real exam', duration: 40, type: 'timed', icon: 'timer', cta: 'Start', color: 'yellow' },
  { title: 'Complete Physics session', reason: 'Mechanics is high-priority (85% weight)', duration: 30, type: 'topic', icon: 'atom', cta: 'Start', color: 'mint' },
];

export const RECENT_ACTIVITY = [
  { type: 'practice', title: 'Algebra Practice', subject: 'Mathematics', score: 13, total: 15, accuracy: 87, date: 'Today, 2:30 PM', duration: 22 },
  { type: 'mock', title: 'Mini Mock — English', subject: 'English', score: 38, total: 50, accuracy: 76, date: 'Yesterday', duration: 48 },
  { type: 'tutor', title: 'Understanding Genetics', subject: 'Biology', score: null, total: null, accuracy: null, date: 'Yesterday', duration: 18 },
  { type: 'practice', title: 'Organic Chemistry', subject: 'Chemistry', score: 8, total: 15, accuracy: 53, date: '2 days ago', duration: 30 },
  { type: 'practice', title: 'Electricity Problems', subject: 'Physics', score: 11, total: 15, accuracy: 73, date: '3 days ago', duration: 28 },
];

export const ACCURACY_OVER_TIME = [
  { week: 'W1', accuracy: 52, questions: 120 },
  { week: 'W2', accuracy: 58, questions: 148 },
  { week: 'W3', accuracy: 61, questions: 165 },
  { week: 'W4', accuracy: 63, questions: 192 },
  { week: 'W5', accuracy: 67, questions: 210 },
  { week: 'W6', accuracy: 70, questions: 225 },
  { week: 'W7', accuracy: 74, questions: 187 },
];

export const SUBJECT_PERFORMANCE = [
  { subject: 'Mathematics', accuracy: 68, questionsAnswered: 312, mastery: 62 },
  { subject: 'English', accuracy: 81, questionsAnswered: 287, mastery: 78 },
  { subject: 'Physics', accuracy: 62, questionsAnswered: 189, mastery: 55 },
  { subject: 'Chemistry', accuracy: 58, questionsAnswered: 178, mastery: 49 },
  { subject: 'Biology', accuracy: 71, questionsAnswered: 281, mastery: 67 },
];

// Sample tutor conversation for demo
export const SOCRATIC_HINTS = [
  { level: 1, text: "Let's start with what we know. In a quadratic equation of the form x² + bx + c = 0, we need two numbers that multiply to c and add to b. In this case, c is 6. Can you think of two numbers that multiply to 6 and add up to -5?" },
  { level: 2, text: "Good thinking. Let's list the factor pairs of 6: 1 and 6, 2 and 3. Since we need them to add to -5, both numbers must be negative. Which pair adds to -5?" },
  { level: 3, text: "The pair −2 and −3 multiplies to +6 and adds to −5. So our factors are (x − 2)(x − 3). Now — what happens when either factor equals zero?" },
  { level: 4, text: "If (x − 2)(x − 3) = 0, then either x − 2 = 0 (meaning x = 2) OR x − 3 = 0 (meaning x = 3). Let's verify by substituting x = 2 back into the original equation: 2² − 5(2) + 6 = 4 − 10 + 6 = 0. That works!" },
  { level: 5, text: "Here's the full solution:\nx² − 5x + 6 = 0 factors to (x − 2)(x − 3) = 0\nSetting each factor to zero: x − 2 = 0 ⟹ x = 2, and x − 3 = 0 ⟹ x = 3.\nSo the roots are x = 2 and x = 3. Always verify by substituting back!" },
];

export const PRICING_PACKAGES = [
  {
    id: 'pkg-free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Start learning and see if Idrak is right for you.',
    features: [
      '20 practice questions/day',
      '3 subjects per exam',
      'Basic analytics',
      '5 AI Tutor messages/day',
    ],
    cta: 'Get started free',
    popular: false,
    color: 'cream',
  },
  {
    id: 'pkg-essential',
    name: 'Essential JAMB',
    price: 7500,
    period: '/one-time',
    description: 'Full JAMB preparation with AI-powered personalization.',
    features: [
      'Unlimited JAMB questions',
      'All 4 subjects',
      'Topic Intelligence Map',
      'Personalized study plan',
      'Unlimited AI Tutor',
      'Mock exams with detailed analysis',
      'Advanced analytics',
    ],
    cta: 'Start preparing',
    popular: true,
    color: 'coral',
    badge: 'Most popular',
  },
  {
    id: 'pkg-premium',
    name: 'Premium All Exams',
    price: 15000,
    period: '/year',
    description: 'Access every exam Idrak supports, plus advanced features.',
    features: [
      'All exams (JAMB, WAEC, NECO, Post-UTME, SAT, IELTS, ICAN)',
      'Unlimited questions & mocks',
      'Full Topic Intelligence',
      'Priority AI Tutor',
      'Image question upload',
      'Printable study materials',
      'Performance reports',
      'Early access to new features',
    ],
    cta: 'Go Premium',
    popular: false,
    color: 'lavender',
  },
];

export const LANDING_STATS = [
  { value: '8+', label: 'Exam categories', color: 'coral' },
  { value: '50k+', label: 'Practice questions', color: 'lavender' },
  { value: 'AI', label: 'Personalized learning paths', color: 'yellow' },
  { value: '24/7', label: 'Socratic AI Tutor', color: 'mint' },
];

export const FEATURES = [
  {
    id: 'feat-intel',
    title: 'Topic Intelligence',
    eyebrow: 'The Idrak Map',
    description: 'We analyze years of past questions to identify which topics appear most often, which question patterns repeat, and where examiners focus. You don\'t study everything — you study what matters.',
    color: 'coral',
    icon: 'brain',
  },
  {
    id: 'feat-personal',
    title: 'Truly personalized',
    eyebrow: 'Your learning path',
    description: 'Two students preparing for the same exam get different plans. Idrak watches how you perform and reshuffles priorities so you always work on the thing that will move your score the most.',
    color: 'lavender',
    icon: 'route',
  },
  {
    id: 'feat-tutor',
    title: 'Socratic AI Tutor',
    eyebrow: 'Understand, don\'t memorize',
    description: 'Instead of giving you the answer, Idrak guides you through it with hints, questions, and worked examples. The Tutor doesn\'t do your thinking — it teaches you how to think.',
    color: 'yellow',
    icon: 'message-circle-question',
  },
  {
    id: 'feat-analytics',
    title: 'Clear analytics',
    eyebrow: 'See your progress',
    description: 'Track accuracy, readiness, study time, streak and weak topics at a glance. No more guessing whether you\'re improving — you\'ll see the evidence.',
    color: 'mint',
    icon: 'chart-bar',
  },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Tell Idrak about your exam', description: 'Choose your exam, subjects, target score and exam date. Idrak builds your baseline profile.' },
  { step: '02', title: 'Answer a few diagnostic questions', description: 'A short initial assessment reveals your strong and weak topics so the AI doesn\'t start blind.' },
  { step: '03', title: 'Get your personal Study Map', description: 'Idrak cross-references exam patterns with your performance and prioritizes topics by impact.' },
  { step: '04', title: 'Practice, review, repeat', description: 'Daily sessions, adaptive plans, detailed explanations, and a Socratic Tutor when you get stuck.' },
  { step: '05', title: 'Track your readiness', description: 'Your readiness score updates after every session. When it\'s time to sit the exam, you\'ll know you\'re ready.' },
];
