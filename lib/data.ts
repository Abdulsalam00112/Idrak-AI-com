// Seed data for Idrak AI — used both for previews and as demo data
import type { ExamCategory, Difficulty } from './types';

export interface ExamSeed {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  description: string;
  // How this exam's "subjects" should be labeled in the UI. Some exams
  // (IELTS's four skills, ICAN/CITN's individual professional papers) don't
  // fit the Nigerian secondary-school "subjects" framing, so onboarding and
  // the dashboard read this instead of hardcoding the word "subjects".
  unitLabel: string;
  longDescription: string;
  color: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  // Upper bound of this exam's scoring scale, used to size the onboarding
  // target-score slider (JAMB is out of 400, IELTS bands go to 9, SAT to
  // 1600, WAEC/NECO/professional papers are graded as a percentage).
  maxScore: number;
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
  // CONTENT AUDIT NOTE: only 2 questions exist under this field anywhere in
  // the codebase (JAMB → Mathematics → Algebra), and they are not rendered
  // by any page or API route — this is dead, unused data. Their `year`
  // fields (2022/2023) have no citation or source attached, so their
  // provenance is UNKNOWN — do not treat them as verified past questions if
  // this field is ever wired up. Real content should go through
  // idrak_questions via db/seed/questions/ (see the content-import pipeline
  // this repo now ships), not this frontend seed file.
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
    unitLabel: 'subjects',
    description: 'Build a smarter UTME preparation plan based on your strengths, weaknesses and historical question patterns.',
    longDescription: 'The Joint Admissions and Matriculation Board Unified Tertiary Matriculation Examination is the primary entrance exam for Nigerian universities. Idrak AI analyzes over 20 years of past questions to surface the topics that matter most.',
    maxScore: 400,
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
    unitLabel: 'subjects',
    description: 'West African Senior School Certificate Examination preparation with topic-level intelligence.',
    longDescription: 'WAEC is taken by final-year secondary school students across West Africa. Idrak focuses on frequently repeated topics, marking schemes, and common student pitfalls.',
    maxScore: 100,
    color: '#b8a4e8',
    totalQuestions: 9840,
    durationMinutes: 180,
    passingScore: 45,
    subjects: [
      {
        id: 'subj-math-w', name: 'Mathematics', icon: 'calculator', color: '#ff6b4a', description: 'Core mathematics for WASSCE.',
        topics: [
          { id: 'topic-math-w-number', name: 'Number and Numeration', description: 'Number bases, fractions, decimals, approximations, indices, logarithms, and surds.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Number bases', 'Fractions, decimals, approximations', 'Indices and logarithms', 'Surds'] },
          { id: 'topic-math-w-algebra', name: 'Algebraic Processes', description: 'Simplification, factorization, linear and quadratic equations, simultaneous equations, and inequalities.', examWeight: 0.25, avgDifficulty: 0.5, subtopics: ['Linear equations and inequalities', 'Quadratic equations', 'Simultaneous equations', 'Variation'] },
          { id: 'topic-math-w-geo-trig', name: 'Geometry and Trigonometry', description: 'Plane geometry, mensuration, and trigonometric ratios.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Angles and polygons', 'Circle theorems', 'Mensuration (area, volume)', 'Trigonometric ratios and bearings'] },
          { id: 'topic-math-w-stats', name: 'Statistics and Probability', description: 'Data presentation, measures of central tendency and dispersion, and basic probability.', examWeight: 0.15, avgDifficulty: 0.45, subtopics: ['Frequency tables and charts', 'Mean, median, mode', 'Range and standard deviation', 'Probability of simple events'] },
          { id: 'topic-math-w-calculus', name: 'Introductory Calculus', description: 'Differentiation and integration of simple algebraic functions.', examWeight: 0.15, avgDifficulty: 0.6, subtopics: ['Differentiation basics', 'Applications (gradients, maxima/minima)', 'Integration basics'] },
        ],
      },
      {
        id: 'subj-eng-w', name: 'English Language', icon: 'book-open', color: '#b8a4e8', description: 'Essay, comprehension, summary, lexis.',
        topics: [
          { id: 'topic-eng-w-comprehension', name: 'Comprehension and Summary', description: 'Reading passages closely to answer inference and vocabulary-in-context questions, and condensing a passage\'s key points.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Literal and inferential comprehension', 'Vocabulary in context', 'Summary writing'] },
          { id: 'topic-eng-w-essay', name: 'Essay (Composition)', description: 'Narrative, descriptive, expository, and argumentative essay writing.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Narrative essays', 'Argumentative/persuasive essays', 'Formal and informal letters', 'Article and speech writing'] },
          { id: 'topic-eng-w-lexis', name: 'Lexis and Structure', description: 'Grammar, sentence construction, and correct word usage.', examWeight: 0.25, avgDifficulty: 0.45, subtopics: ['Tenses and concord', 'Word classes', 'Sentence structure', 'Synonyms, antonyms, idioms'] },
          { id: 'topic-eng-w-oral', name: 'Oral English', description: 'Recognizing correct pronunciation, stress, and intonation patterns.', examWeight: 0.1, avgDifficulty: 0.5, subtopics: ['Vowel and consonant sounds', 'Stress and intonation'] },
        ],
      },
      {
        id: 'subj-phy-w', name: 'Physics', icon: 'atom', color: '#4ecdc4', description: 'WASSCE Physics.',
        topics: [
          { id: 'topic-phy-w-mechanics', name: 'Mechanics', description: 'Motion, forces, work, energy, power, and simple machines.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Motion and forces', 'Work, energy, power', 'Simple machines', 'Equilibrium of forces'] },
          { id: 'topic-phy-w-heat', name: 'Heat and Thermodynamics', description: 'Temperature, thermal expansion, gas laws, and heat transfer.', examWeight: 0.2, avgDifficulty: 0.55, subtopics: ['Temperature and thermometers', 'Thermal expansion', 'Gas laws', 'Heat transfer'] },
          { id: 'topic-phy-w-waves', name: 'Waves, Optics and Sound', description: 'Wave properties, reflection and refraction of light, and sound.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Wave properties', 'Reflection and refraction', 'Lenses and optical instruments', 'Sound waves'] },
          { id: 'topic-phy-w-electricity', name: 'Electricity and Magnetism', description: 'Current electricity, circuits, electrostatics, and magnetism.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Electrostatics', 'Current, resistance, and circuits', 'Magnetic fields', 'Electromagnetic induction'] },
        ],
      },
      {
        id: 'subj-che-w', name: 'Chemistry', icon: 'flask-conical', color: '#ffd93d', description: 'WASSCE Chemistry.',
        topics: [
          { id: 'topic-che-w-structure', name: 'Atomic Structure and Bonding', description: 'Atomic structure, the periodic table, and chemical bonding.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Atomic structure', 'Periodic table trends', 'Ionic and covalent bonding'] },
          { id: 'topic-che-w-stoichiometry', name: 'Stoichiometry and the Mole Concept', description: 'Chemical formulae, equations, and quantitative relationships in reactions.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Mole concept', 'Chemical equations and balancing', 'Molar calculations'] },
          { id: 'topic-che-w-acids', name: 'Acids, Bases and Salts', description: 'Properties of acids and bases, pH, neutralization, and salt preparation.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Acid-base properties', 'pH and indicators', 'Salt preparation'] },
          { id: 'topic-che-w-organic', name: 'Organic Chemistry', description: 'Hydrocarbons, functional groups, and everyday organic compounds.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['Alkanes, alkenes, alkynes', 'Alcohols and carboxylic acids', 'Petroleum and polymers'] },
          { id: 'topic-che-w-rates', name: 'Chemical Energetics and Rates', description: 'Energy changes in reactions and factors affecting reaction rate.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Exothermic and endothermic reactions', 'Factors affecting reaction rate'] },
        ],
      },
      {
        id: 'subj-bio-w', name: 'Biology', icon: 'leaf', color: '#4ecdc4', description: 'WASSCE Biology.',
        topics: [
          { id: 'topic-bio-w-cell', name: 'Cell Biology', description: 'Cell structure, organelles, and cell division.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Cell structure and organelles', 'Mitosis and meiosis'] },
          { id: 'topic-bio-w-physiology', name: 'Human and Plant Physiology', description: 'Nutrition, respiration, transport, and reproduction in humans and plants.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Nutrition and digestion', 'Respiration and gas exchange', 'Transport systems', 'Reproduction'] },
          { id: 'topic-bio-w-genetics', name: 'Genetics and Evolution', description: 'Heredity, variation, and the theory of evolution.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['Mendelian genetics', 'Variation', 'Theories of evolution'] },
          { id: 'topic-bio-w-ecology', name: 'Ecology', description: 'Ecosystems, populations, and the relationship between organisms and their environment.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Ecosystems and food chains', 'Population dynamics', 'Conservation of natural resources'] },
          { id: 'topic-bio-w-classification', name: 'Classification and Diversity', description: 'Classifying living things and the major groups of organisms.', examWeight: 0.1, avgDifficulty: 0.4, subtopics: ['Kingdoms of life', 'Classification criteria'] },
        ],
      },
      {
        id: 'subj-eco-w', name: 'Economics', icon: 'trending-up', color: '#ff8b6f', description: 'WASSCE Economics.',
        topics: [
          { id: 'topic-eco-w-basic', name: 'Basic Economic Concepts', description: 'Scarcity, choice, opportunity cost, and the factors of production.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Scarcity and choice', 'Opportunity cost', 'Factors of production'] },
          { id: 'topic-eco-w-demand-supply', name: 'Demand, Supply and Price', description: 'Market forces, equilibrium price, and elasticity.', examWeight: 0.25, avgDifficulty: 0.5, subtopics: ['Demand and supply curves', 'Market equilibrium', 'Price elasticity'] },
          { id: 'topic-eco-w-money', name: 'Money and Banking', description: 'Functions of money, the banking system, and monetary policy.', examWeight: 0.2, avgDifficulty: 0.55, subtopics: ['Functions and types of money', 'Commercial and central banking', 'Monetary policy tools'] },
          { id: 'topic-eco-w-income', name: 'National Income and Economic Growth', description: 'Measuring national income and the determinants of economic growth and development.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['National income measurement', 'Economic growth vs development'] },
          { id: 'topic-eco-w-trade', name: 'International Trade', description: 'Reasons for trade, balance of payments, and trade policy.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Basis for international trade', 'Balance of payments', 'Tariffs and trade restrictions'] },
        ],
      },
    ],
  },
  {
    id: 'exam-neco',
    code: 'NECO',
    name: 'NECO SSCE',
    shortName: 'NECO',
    category: 'national',
    unitLabel: 'subjects',
    description: 'National Examinations Council Senior School Certificate preparation.',
    longDescription: 'NECO is a Nigerian national exam taken alongside or as an alternative to WAEC. Idrak covers its unique question patterns and focus areas.',
    maxScore: 100,
    color: '#4ecdc4',
    totalQuestions: 7200,
    durationMinutes: 180,
    passingScore: 45,
    subjects: [
      {
        id: 'subj-math-nc', name: 'Mathematics', icon: 'calculator', color: '#ff6b4a', description: 'Core mathematics for NECO SSCE.',
        topics: [
          { id: 'topic-math-nc-number', name: 'Number and Numeration', description: 'Number bases, fractions, approximations, indices, logarithms, and surds.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Number bases', 'Indices and logarithms', 'Surds', 'Ratios and proportions'] },
          { id: 'topic-math-nc-algebra', name: 'Algebraic Processes', description: 'Simplification, factorization, equations, and inequalities.', examWeight: 0.25, avgDifficulty: 0.5, subtopics: ['Linear and quadratic equations', 'Simultaneous equations', 'Inequalities', 'Variation'] },
          { id: 'topic-math-nc-geo-trig', name: 'Geometry and Trigonometry', description: 'Plane geometry, mensuration, and trigonometric ratios.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Circle theorems', 'Mensuration', 'Trigonometric ratios and bearings'] },
          { id: 'topic-math-nc-stats', name: 'Statistics and Probability', description: 'Data presentation, measures of central tendency, and probability.', examWeight: 0.15, avgDifficulty: 0.45, subtopics: ['Mean, median, mode', 'Data presentation', 'Probability of simple events'] },
          { id: 'topic-math-nc-calculus', name: 'Introductory Calculus', description: 'Differentiation and integration of simple algebraic functions.', examWeight: 0.15, avgDifficulty: 0.6, subtopics: ['Differentiation basics', 'Integration basics'] },
        ],
      },
      {
        id: 'subj-eng-nc', name: 'English Language', icon: 'book-open', color: '#b8a4e8', description: 'Essay, comprehension, summary, lexis and structure.',
        topics: [
          { id: 'topic-eng-nc-comprehension', name: 'Comprehension and Summary', description: 'Close reading for inference, vocabulary in context, and condensing key points.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Literal and inferential comprehension', 'Vocabulary in context', 'Summary writing'] },
          { id: 'topic-eng-nc-essay', name: 'Essay (Composition)', description: 'Narrative, descriptive, expository, and argumentative essay writing.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Narrative and descriptive essays', 'Argumentative essays', 'Formal and informal letters'] },
          { id: 'topic-eng-nc-lexis', name: 'Lexis and Structure', description: 'Grammar, sentence construction, and correct word usage.', examWeight: 0.25, avgDifficulty: 0.45, subtopics: ['Tenses and concord', 'Sentence structure', 'Synonyms and antonyms'] },
          { id: 'topic-eng-nc-oral', name: 'Oral English', description: 'Recognizing correct pronunciation, stress, and intonation.', examWeight: 0.1, avgDifficulty: 0.5, subtopics: ['Vowel and consonant sounds', 'Stress and intonation'] },
        ],
      },
      {
        id: 'subj-phy-nc', name: 'Physics', icon: 'atom', color: '#4ecdc4', description: 'NECO Physics.',
        topics: [
          { id: 'topic-phy-nc-mechanics', name: 'Mechanics', description: 'Motion, forces, work, energy, and power.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Motion and forces', 'Work, energy, power', 'Simple machines'] },
          { id: 'topic-phy-nc-heat', name: 'Heat and Thermodynamics', description: 'Temperature, gas laws, and heat transfer.', examWeight: 0.2, avgDifficulty: 0.55, subtopics: ['Temperature and expansion', 'Gas laws', 'Heat transfer'] },
          { id: 'topic-phy-nc-waves', name: 'Waves, Optics and Sound', description: 'Wave properties, light, and sound.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Wave properties', 'Reflection and refraction', 'Sound waves'] },
          { id: 'topic-phy-nc-electricity', name: 'Electricity and Magnetism', description: 'Circuits, electrostatics, and magnetism.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Electrostatics', 'Current and circuits', 'Magnetic fields'] },
        ],
      },
      {
        id: 'subj-che-nc', name: 'Chemistry', icon: 'flask-conical', color: '#ffd93d', description: 'NECO Chemistry.',
        topics: [
          { id: 'topic-che-nc-structure', name: 'Atomic Structure and Bonding', description: 'Atomic structure, periodic trends, and chemical bonding.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Atomic structure', 'Periodic table', 'Ionic and covalent bonding'] },
          { id: 'topic-che-nc-stoichiometry', name: 'Stoichiometry and the Mole Concept', description: 'Chemical formulae, equations, and quantitative relationships.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Mole concept', 'Balancing equations', 'Molar calculations'] },
          { id: 'topic-che-nc-acids', name: 'Acids, Bases and Salts', description: 'Properties, pH, neutralization, and salt preparation.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Acid-base properties', 'pH and indicators', 'Salt preparation'] },
          { id: 'topic-che-nc-organic', name: 'Organic Chemistry', description: 'Hydrocarbons and common functional groups.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['Alkanes, alkenes, alkynes', 'Alcohols and carboxylic acids'] },
          { id: 'topic-che-nc-rates', name: 'Chemical Energetics and Rates', description: 'Energy changes and factors affecting reaction rate.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Exothermic/endothermic reactions', 'Rate factors'] },
        ],
      },
      {
        id: 'subj-bio-nc', name: 'Biology', icon: 'leaf', color: '#4ecdc4', description: 'NECO Biology.',
        topics: [
          { id: 'topic-bio-nc-cell', name: 'Cell Biology', description: 'Cell structure, organelles, and cell division.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Cell structure', 'Mitosis and meiosis'] },
          { id: 'topic-bio-nc-physiology', name: 'Human and Plant Physiology', description: 'Nutrition, respiration, transport, and reproduction.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Nutrition and digestion', 'Respiration', 'Transport systems', 'Reproduction'] },
          { id: 'topic-bio-nc-genetics', name: 'Genetics and Evolution', description: 'Heredity, variation, and evolution.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['Mendelian genetics', 'Variation', 'Evolution theories'] },
          { id: 'topic-bio-nc-ecology', name: 'Ecology', description: 'Ecosystems and populations.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Ecosystems and food chains', 'Population dynamics', 'Conservation'] },
          { id: 'topic-bio-nc-classification', name: 'Classification and Diversity', description: 'Classifying living organisms.', examWeight: 0.1, avgDifficulty: 0.4, subtopics: ['Kingdoms of life', 'Classification criteria'] },
        ],
      },
      {
        id: 'subj-eco-nc', name: 'Economics', icon: 'trending-up', color: '#ff8b6f', description: 'NECO Economics.',
        topics: [
          { id: 'topic-eco-nc-basic', name: 'Basic Economic Concepts', description: 'Scarcity, choice, and factors of production.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Scarcity and choice', 'Opportunity cost', 'Factors of production'] },
          { id: 'topic-eco-nc-demand-supply', name: 'Demand, Supply and Price', description: 'Market forces and price determination.', examWeight: 0.25, avgDifficulty: 0.5, subtopics: ['Demand and supply', 'Market equilibrium', 'Elasticity'] },
          { id: 'topic-eco-nc-money', name: 'Money and Banking', description: 'Functions of money and the banking system.', examWeight: 0.2, avgDifficulty: 0.55, subtopics: ['Functions of money', 'Banking system', 'Monetary policy'] },
          { id: 'topic-eco-nc-income', name: 'National Income and Economic Growth', description: 'Measuring national income and growth.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['National income measurement', 'Growth vs development'] },
          { id: 'topic-eco-nc-trade', name: 'International Trade', description: 'Trade, balance of payments, and trade policy.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Basis for trade', 'Balance of payments', 'Tariffs'] },
        ],
      },
      {
        id: 'subj-gov-nc', name: 'Government', icon: 'book-open', color: '#8b6fc0', description: 'NECO Government.',
        topics: [
          { id: 'topic-gov-nc-concepts', name: 'Basic Concepts of Government', description: 'The state, sovereignty, and forms of government.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['The state and sovereignty', 'Forms of government', 'Theories of the state'] },
          { id: 'topic-gov-nc-constitution', name: 'Constitutional Development', description: 'Nigerian constitutional history and key constitutional provisions.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Pre- and post-independence constitutions', 'Federalism', 'Fundamental human rights'] },
          { id: 'topic-gov-nc-arms', name: 'Organs and Arms of Government', description: 'The executive, legislature, and judiciary, and separation of powers.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Executive', 'Legislature', 'Judiciary', 'Separation of powers'] },
          { id: 'topic-gov-nc-parties', name: 'Political Parties and Public Opinion', description: 'Party systems, pressure groups, and the electoral process.', examWeight: 0.15, avgDifficulty: 0.5, subtopics: ['Political parties', 'Pressure groups', 'Electoral systems'] },
          { id: 'topic-gov-nc-international', name: 'International Relations', description: 'Nigeria\'s foreign policy and international organizations.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Foreign policy', 'The United Nations', 'The African Union'] },
        ],
      },
    ],
  },
  {
    id: 'exam-postutme',
    code: 'POST-UTME',
    name: 'Post-UTME',
    shortName: 'Post-UTME',
    category: 'university_entrance',
    unitLabel: 'subjects',
    description: 'University-specific Post-UTME screening with institution-precise practice.',
    longDescription: 'After JAMB, Nigerian universities run their own Post-UTME screenings. Idrak includes university-specific question patterns for major institutions.',
    maxScore: 100,
    color: '#ffd93d',
    totalQuestions: 4800,
    durationMinutes: 60,
    passingScore: 50,
    subjects: [
      {
        id: 'subj-eng-pu', name: 'Use of English', icon: 'book-open', color: '#b8a4e8', description: 'Compulsory for every Post-UTME candidate regardless of course.',
        topics: [
          { id: 'topic-eng-pu-comprehension', name: 'Comprehension and Summary', description: 'Close reading, inference, and condensing passages.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Literal and inferential comprehension', 'Summary writing'] },
          { id: 'topic-eng-pu-lexis', name: 'Lexis and Structure', description: 'Grammar, sentence construction, and correct word usage.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Tenses and concord', 'Synonyms and antonyms', 'Sentence correction'] },
          { id: 'topic-eng-pu-oral', name: 'Oral English', description: 'Pronunciation, stress, and intonation patterns.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Vowel and consonant sounds', 'Stress and intonation'] },
        ],
      },
      {
        id: 'subj-math-pu', name: 'Mathematics', icon: 'calculator', color: '#ff6b4a', description: 'Required for science, engineering and management courses.',
        topics: [
          { id: 'topic-math-pu-algebra', name: 'Algebra', description: 'Equations, inequalities, and algebraic simplification.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Linear and quadratic equations', 'Simultaneous equations', 'Inequalities'] },
          { id: 'topic-math-pu-geo-trig', name: 'Geometry and Trigonometry', description: 'Plane geometry, mensuration, and trigonometric ratios.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Circle theorems', 'Mensuration', 'Trigonometric ratios'] },
          { id: 'topic-math-pu-stats', name: 'Statistics and Probability', description: 'Data presentation and basic probability.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Mean, median, mode', 'Probability of simple events'] },
          { id: 'topic-math-pu-number', name: 'Number and Numeration', description: 'Number bases, indices, logarithms, and surds.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Number bases', 'Indices and logarithms', 'Surds'] },
        ],
      },
      {
        id: 'subj-phy-pu', name: 'Physics', icon: 'atom', color: '#4ecdc4', description: 'Required for most science and engineering courses.',
        topics: [
          { id: 'topic-phy-pu-mechanics', name: 'Mechanics', description: 'Motion, forces, work, energy, and power.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Motion and forces', 'Work, energy, power'] },
          { id: 'topic-phy-pu-electricity', name: 'Electricity and Magnetism', description: 'Circuits, electrostatics, and magnetism.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Current and circuits', 'Electrostatics', 'Magnetic fields'] },
          { id: 'topic-phy-pu-waves', name: 'Waves, Optics and Modern Physics', description: 'Wave properties, light, and introductory modern physics.', examWeight: 0.4, avgDifficulty: 0.6, subtopics: ['Wave properties', 'Reflection and refraction', 'Atomic and nuclear physics basics'] },
        ],
      },
      {
        id: 'subj-che-pu', name: 'Chemistry', icon: 'flask-conical', color: '#ffd93d', description: 'Required for most science courses.',
        topics: [
          { id: 'topic-che-pu-structure', name: 'Atomic Structure and Bonding', description: 'Atomic structure, periodic trends, and bonding.', examWeight: 0.25, avgDifficulty: 0.5, subtopics: ['Atomic structure', 'Periodic table', 'Chemical bonding'] },
          { id: 'topic-che-pu-stoichiometry', name: 'Stoichiometry and the Mole Concept', description: 'Chemical equations and quantitative relationships.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Mole concept', 'Balancing equations'] },
          { id: 'topic-che-pu-organic', name: 'Organic Chemistry', description: 'Hydrocarbons and common functional groups.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Alkanes, alkenes, alkynes', 'Alcohols and carboxylic acids'] },
          { id: 'topic-che-pu-acids', name: 'Acids, Bases and Salts', description: 'Properties, pH, and neutralization.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Acid-base properties', 'pH and indicators'] },
        ],
      },
      {
        id: 'subj-bio-pu', name: 'Biology', icon: 'leaf', color: '#4ecdc4', description: 'Required for biological and medical sciences.',
        topics: [
          { id: 'topic-bio-pu-cell', name: 'Cell Biology', description: 'Cell structure and cell division.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Cell structure', 'Mitosis and meiosis'] },
          { id: 'topic-bio-pu-physiology', name: 'Human and Plant Physiology', description: 'Nutrition, respiration, transport, and reproduction.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Nutrition and digestion', 'Respiration', 'Reproduction'] },
          { id: 'topic-bio-pu-genetics', name: 'Genetics and Evolution', description: 'Heredity, variation, and evolution.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Mendelian genetics', 'Evolution theories'] },
          { id: 'topic-bio-pu-ecology', name: 'Ecology', description: 'Ecosystems and populations.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Ecosystems and food chains', 'Population dynamics'] },
        ],
      },
      {
        id: 'subj-gk-pu', name: 'General Studies / CRK-IRK', icon: 'book-open', color: '#8b6fc0', description: 'Required by some institutions in place of a fourth subject.',
        topics: [
          { id: 'topic-gk-pu-civic', name: 'Civic and General Knowledge', description: 'Nigerian government structure, civic responsibilities, and current affairs.', examWeight: 0.5, avgDifficulty: 0.4, subtopics: ['Nigerian government structure', 'Civic responsibilities'] },
          { id: 'topic-gk-pu-religious', name: 'Religious Studies (CRK/IRK)', description: 'Core texts, ethics, and history covered in Christian or Islamic Religious Knowledge.', examWeight: 0.5, avgDifficulty: 0.45, subtopics: ['Core religious texts', 'Religious history and ethics'] },
        ],
      },
    ],
  },
  {
    id: 'exam-sat',
    code: 'SAT',
    name: 'SAT',
    shortName: 'SAT',
    category: 'international',
    unitLabel: 'subjects',
    description: 'Digital SAT preparation with adaptive practice and college-board-style questions.',
    longDescription: 'The SAT is used for US and international university admissions. Idrak focuses on evidence-based reading, writing, and math with evidence-based, adaptive practice.',
    maxScore: 1600,
    color: '#ff6b4a',
    totalQuestions: 3200,
    durationMinutes: 134,
    passingScore: 1080,
    subjects: [
      {
        id: 'subj-rw-sat', name: 'Reading and Writing', icon: 'book-open', color: '#b8a4e8', description: 'Digital SAT Reading and Writing module: comprehension, grammar, and rhetoric.',
        topics: [
          { id: 'topic-rw-info-ideas', name: 'Information and Ideas', description: 'Reading closely, citing textual evidence, making inferences, and understanding quantitative information in texts and graphics.', examWeight: 0.26, avgDifficulty: 0.55, subtopics: ['Central ideas and details', 'Command of evidence (textual)', 'Command of evidence (quantitative)', 'Inferences'] },
          { id: 'topic-rw-craft-structure', name: 'Craft and Structure', description: 'Interpreting word choice, text structure, and relationships between multiple texts.', examWeight: 0.28, avgDifficulty: 0.6, subtopics: ['Words in context', 'Text structure and purpose', 'Cross-text connections'] },
          { id: 'topic-rw-expression', name: 'Expression of Ideas', description: 'Revising texts to improve rhetorical effectiveness and to accomplish a stated goal.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Rhetorical synthesis', 'Transitions'] },
          { id: 'topic-rw-conventions', name: 'Standard English Conventions', description: 'Editing text to conform to core conventions of standard written English.', examWeight: 0.26, avgDifficulty: 0.5, subtopics: ['Boundaries (punctuation)', 'Form, structure, and sense (grammar)'] },
        ],
      },
      {
        id: 'subj-math-sat', name: 'Math', icon: 'calculator', color: '#ff6b4a', description: 'Digital SAT Math module: algebra, advanced math, problem-solving and data analysis, geometry and trigonometry.',
        topics: [
          { id: 'topic-math-algebra', name: 'Algebra', description: 'Linear equations and inequalities in one and two variables, and systems of linear equations.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Linear equations (one variable)', 'Linear equations (two variables)', 'Systems of linear equations', 'Linear inequalities'] },
          { id: 'topic-math-advanced', name: 'Advanced Math', description: 'Equivalent expressions, nonlinear equations, and nonlinear functions.', examWeight: 0.35, avgDifficulty: 0.65, subtopics: ['Nonlinear functions', 'Nonlinear equations and systems', 'Equivalent expressions'] },
          { id: 'topic-math-psda', name: 'Problem-Solving and Data Analysis', description: 'Ratios, rates, proportions, percentages, one- and two-variable data, probability, and statistical inference.', examWeight: 0.15, avgDifficulty: 0.55, subtopics: ['Ratios, rates, and proportions', 'Percentages', 'One-variable data distributions', 'Two-variable data and scatterplots', 'Probability and sample statistics'] },
          { id: 'topic-math-geo-trig', name: 'Geometry and Trigonometry', description: 'Area, volume, lines, angles, triangles, circles, and right-triangle trigonometry.', examWeight: 0.15, avgDifficulty: 0.6, subtopics: ['Area and volume', 'Lines, angles, and triangles', 'Right triangles and trigonometry', 'Circles'] },
        ],
      },
    ],
  },
  {
    id: 'exam-ielts',
    code: 'IELTS',
    name: 'IELTS',
    shortName: 'IELTS',
    category: 'international',
    unitLabel: 'sections',
    description: 'Academic and General IELTS preparation across all four skills.',
    longDescription: 'IELTS measures English language proficiency for study, work, and migration. Idrak covers Listening, Reading, Writing, and Speaking with band-score-aligned feedback.',
    maxScore: 9,
    color: '#8b6fc0',
    totalQuestions: 2100,
    durationMinutes: 165,
    passingScore: 6.5,
    subjects: [
      {
        id: 'subj-listening-ielts', name: 'Listening', icon: 'book-open', color: '#8b6fc0', description: 'Four recorded sections of increasing difficulty.',
        topics: [
          { id: 'topic-listening-social', name: 'Section 1: Everyday social context', description: 'A conversation between two speakers in an everyday social context (e.g. booking, enquiry).', examWeight: 0.25, avgDifficulty: 0.35, subtopics: ['Form completion', 'Note completion', 'Numbers, dates & spelling'] },
          { id: 'topic-listening-monologue', name: 'Section 2: Everyday monologue', description: 'A monologue set in an everyday social context, e.g. a speech about local facilities.', examWeight: 0.25, avgDifficulty: 0.45, subtopics: ['Map/plan/diagram labelling', 'Multiple choice', 'Matching'] },
          { id: 'topic-listening-edu-conv', name: 'Section 3: Educational conversation', description: 'Up to four speakers in an education or training context, e.g. a tutor and students discussing an assignment.', examWeight: 0.25, avgDifficulty: 0.6, subtopics: ['Multiple choice', 'Matching', 'Sentence completion'] },
          { id: 'topic-listening-lecture', name: 'Section 4: Academic lecture', description: 'A monologue on an academic subject, e.g. a university lecture.', examWeight: 0.25, avgDifficulty: 0.72, subtopics: ['Summary completion', 'Note completion', 'Short-answer questions'] },
        ],
      },
      {
        id: 'subj-reading-ielts', name: 'Reading', icon: 'book-open', color: '#b8a4e8', description: 'Three long passages (Academic) or varied texts (General Training).',
        topics: [
          { id: 'topic-reading-tfng', name: 'True/False/Not Given & Yes/No/Not Given', description: 'Judging whether statements agree with, contradict, or aren\'t addressed by the passage.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Identifying claims', 'Distinguishing "false" from "not given"'] },
          { id: 'topic-reading-matching', name: 'Matching headings & information', description: 'Matching paragraph headings, features, or information to the correct section of the passage.', examWeight: 0.25, avgDifficulty: 0.65, subtopics: ['Matching headings', 'Matching features', 'Matching sentence endings'] },
          { id: 'topic-reading-completion', name: 'Summary, note, table & diagram completion', description: 'Completing a summary or diagram using words taken directly from the passage.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Word-limit compliance', 'Synonym recognition', 'Diagram labelling'] },
          { id: 'topic-reading-mcq', name: 'Multiple choice & short answer', description: 'Selecting the correct option(s) or providing a short answer supported by the text.', examWeight: 0.2, avgDifficulty: 0.5, subtopics: ['Single-answer MCQ', 'Multiple-answer MCQ', 'Short-answer questions'] },
        ],
      },
      {
        id: 'subj-writing-ielts', name: 'Writing', icon: 'pencil', color: '#ff6b4a', description: 'Two tasks: a data/argument description and an essay.',
        topics: [
          { id: 'topic-writing-task1-academic', name: 'Task 1 (Academic): Data description', description: 'Describing and summarizing a graph, chart, table, map, or process diagram in your own words.', examWeight: 0.33, avgDifficulty: 0.55, subtopics: ['Overview statement', 'Data selection & comparison', 'Process/map description'] },
          { id: 'topic-writing-task1-general', name: 'Task 1 (General Training): Letter writing', description: 'Writing a formal, semi-formal, or informal letter responding to a given situation.', examWeight: 0.33, avgDifficulty: 0.5, subtopics: ['Formal register', 'Requesting/complaining', 'Explaining a situation'] },
          { id: 'topic-writing-task2', name: 'Task 2: Essay', description: 'A 250-word discursive essay responding to a point of view, argument, or problem.', examWeight: 0.67, avgDifficulty: 0.68, subtopics: ['Opinion essays', 'Discussion (both views) essays', 'Problem/solution essays', 'Advantages/disadvantages essays'] },
        ],
      },
      {
        id: 'subj-speaking-ielts', name: 'Speaking', icon: 'book-open', color: '#4ecdc4', description: 'A face-to-face interview in three parts.',
        topics: [
          { id: 'topic-speaking-part1', name: 'Part 1: Introduction & interview', description: 'Short questions about familiar topics — home, work, studies, interests.', examWeight: 0.3, avgDifficulty: 0.35, subtopics: ['Personal information', 'Familiar topics (family, hobbies, hometown)'] },
          { id: 'topic-speaking-part2', name: 'Part 2: Long turn (cue card)', description: 'A 1–2 minute monologue on a given topic after 1 minute of preparation.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Cue-card structuring', 'Extending answers with detail'] },
          { id: 'topic-speaking-part3', name: 'Part 3: Discussion', description: 'A discussion of more abstract issues linked to the Part 2 topic.', examWeight: 0.4, avgDifficulty: 0.72, subtopics: ['Abstract/opinion questions', 'Justifying and comparing viewpoints'] },
        ],
      },
    ],
  },
  {
    id: 'exam-ican',
    code: 'ICAN',
    name: 'ICAN',
    shortName: 'ICAN',
    category: 'professional',
    unitLabel: 'papers',
    description: 'Institute of Chartered Accountants of Nigeria certification with reasoning-first AI Tutoring.',
    longDescription: 'ICAN is Nigeria\'s flagship professional accounting qualification. Idrak\'s professional mode emphasizes step-by-step reasoning, verification, and deep conceptual understanding — not just answers.',
    maxScore: 100,
    color: '#ff6b4a',
    totalQuestions: 3600,
    durationMinutes: 180,
    passingScore: 50,
    subjects: [
      // Foundation (per ICAN's syllabus revision effective the November 2025 diet)
      {
        id: 'subj-be-ican', name: 'Business Environment (Foundation)', icon: 'trending-up', color: '#ff8b6f', description: 'Economics, business management, ethics, corporate governance and sustainability.',
        topics: [
          { id: 'topic-be-ican-econ', name: 'Business Economics', description: 'Demand, supply, market structures, and macroeconomic indicators relevant to business decisions.', examWeight: 0.3, avgDifficulty: 0.45, subtopics: ['Demand and supply', 'Market structures', 'Inflation, unemployment, GDP'] },
          { id: 'topic-be-ican-management', name: 'Business Management', description: 'Organizational structure, functions of management, and strategic planning basics.', examWeight: 0.3, avgDifficulty: 0.45, subtopics: ['Functions of management', 'Organizational structures', 'Strategic planning'] },
          { id: 'topic-be-ican-ethics', name: 'Ethics, Governance and Sustainability', description: 'Professional ethics, corporate governance codes, and sustainability/ESG reporting basics.', examWeight: 0.4, avgDifficulty: 0.5, subtopics: ['Professional ethics codes', 'Corporate governance principles', 'Sustainability reporting'] },
        ],
      },
      {
        id: 'subj-fa-ican', name: 'Financial Accounting (Foundation)', icon: 'calculator', color: '#ff6b4a', description: 'Foundational bookkeeping, ledgers and financial statement preparation.',
        topics: [
          { id: 'topic-fa-ican-bookkeeping', name: 'Bookkeeping and Double Entry', description: 'The accounting equation, ledger accounts, and the trial balance.', examWeight: 0.3, avgDifficulty: 0.4, subtopics: ['Double-entry principles', 'Ledger accounts', 'Trial balance'] },
          { id: 'topic-fa-ican-adjustments', name: 'Accounting Adjustments', description: 'Accruals, prepayments, depreciation, and bad debts.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Accruals and prepayments', 'Depreciation methods', 'Bad and doubtful debts'] },
          { id: 'topic-fa-ican-statements', name: 'Financial Statement Preparation', description: 'Preparing statements of profit or loss and financial position for sole traders and simple entities.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['Statement of profit or loss', 'Statement of financial position', 'Bank reconciliation', 'Control accounts'] },
        ],
      },
      {
        id: 'subj-ma-ican', name: 'Management Accounting (Foundation)', icon: 'calculator', color: '#4ecdc4', description: 'Costing, budgeting and management decision-making.',
        topics: [
          { id: 'topic-ma-ican-costing', name: 'Cost Classification and Costing Methods', description: 'Cost behavior, absorption and marginal costing, and job/process costing.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Cost classification and behavior', 'Absorption vs marginal costing', 'Job and process costing'] },
          { id: 'topic-ma-ican-budgeting', name: 'Budgeting', description: 'Preparing functional budgets and the master budget.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Functional budgets', 'Master budget preparation', 'Flexible budgeting'] },
          { id: 'topic-ma-ican-decisions', name: 'Short-Term Decision Making', description: 'Break-even analysis, relevant costing, and limiting factor decisions.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Break-even analysis', 'Relevant costs', 'Limiting factor decisions'] },
        ],
      },
      {
        id: 'subj-cbl-ican', name: 'Corporate and Business Law (Foundation)', icon: 'book-open', color: '#8b6fc0', description: 'Nigerian company law, contract law and business regulation.',
        topics: [
          { id: 'topic-cbl-ican-legal-system', name: 'The Nigerian Legal System', description: 'Sources of Nigerian law and the court system.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Sources of law', 'Court structure'] },
          { id: 'topic-cbl-ican-contract', name: 'Law of Contract', description: 'Formation, terms, discharge, and remedies for breach of contract.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Formation of contract', 'Terms and misrepresentation', 'Discharge and remedies'] },
          { id: 'topic-cbl-ican-company', name: 'Company Law', description: 'Incorporation, company administration, and directors\' duties under CAMA.', examWeight: 0.45, avgDifficulty: 0.55, subtopics: ['Incorporation under CAMA', 'Company administration', 'Directors\' duties and liabilities'] },
        ],
      },
      // Skills
      {
        id: 'subj-fr-ican', name: 'Financial Reporting (Skills)', icon: 'calculator', color: '#ff6b4a', description: 'IFRS-aligned preparation and interpretation of financial statements.',
        topics: [
          { id: 'topic-fr-ican-framework', name: 'Conceptual Framework and Standards', description: 'The IFRS conceptual framework and key individual standards.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Conceptual framework', 'Revenue recognition (IFRS 15)', 'Leases (IFRS 16)'] },
          { id: 'topic-fr-ican-single-entity', name: 'Single-Entity Financial Statements', description: 'Preparing statements of profit or loss, financial position, and cash flows for a single entity.', examWeight: 0.35, avgDifficulty: 0.6, subtopics: ['Statement of cash flows', 'Non-current assets and impairment', 'Provisions and contingencies'] },
          { id: 'topic-fr-ican-groups', name: 'Group Accounts (Introductory)', description: 'Basic consolidated financial statements for a parent and one subsidiary.', examWeight: 0.4, avgDifficulty: 0.65, subtopics: ['Consolidated statement of financial position', 'Non-controlling interests', 'Goodwill on acquisition'] },
        ],
      },
      {
        id: 'subj-aas-ican', name: 'Audit and Assurance (Skills)', icon: 'book-open', color: '#4ecdc4', description: 'Audit planning, evidence, and assurance engagements.',
        topics: [
          { id: 'topic-aas-ican-framework', name: 'Regulatory and Ethical Framework', description: 'The Nigerian audit regulatory framework and ethical requirements for auditors.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Regulatory framework', 'Auditor independence and ethics'] },
          { id: 'topic-aas-ican-planning', name: 'Audit Planning and Risk Assessment', description: 'Materiality, audit risk, and planning procedures.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Materiality', 'Risk assessment', 'Audit planning procedures'] },
          { id: 'topic-aas-ican-evidence', name: 'Audit Evidence and Reporting', description: 'Gathering sufficient appropriate evidence and forming the audit opinion.', examWeight: 0.45, avgDifficulty: 0.6, subtopics: ['Audit evidence and sampling', 'Substantive and control testing', 'Audit reports and opinions'] },
        ],
      },
      {
        id: 'subj-tax-ican', name: 'Taxation (Skills)', icon: 'trending-up', color: '#ffd93d', description: 'Personal and company income tax computation and administration.',
        topics: [
          { id: 'topic-tax-ican-framework', name: 'Nigerian Tax Framework and Administration', description: 'Tax laws, administering bodies, and tax administration procedures.', examWeight: 0.2, avgDifficulty: 0.45, subtopics: ['Sources of Nigerian tax law', 'FIRS and State IRS roles', 'Tax administration and appeals'] },
          { id: 'topic-tax-ican-personal', name: 'Personal Income Tax', description: 'Computing taxable income, reliefs, and PAYE for individuals.', examWeight: 0.35, avgDifficulty: 0.55, subtopics: ['Taxable income computation', 'Reliefs and allowances', 'PAYE'] },
          { id: 'topic-tax-ican-company', name: 'Companies Income Tax', description: 'Computing assessable and taxable profits, and capital allowances.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Assessable profit computation', 'Capital allowances', 'Minimum tax'] },
          { id: 'topic-tax-ican-vat', name: 'Value Added Tax and Other Taxes', description: 'VAT computation, withholding tax, and other statutory levies.', examWeight: 0.15, avgDifficulty: 0.5, subtopics: ['VAT computation and administration', 'Withholding tax', 'Stamp duties'] },
        ],
      },
      {
        id: 'subj-pm-ican', name: 'Performance Management (Skills)', icon: 'calculator', color: '#ff8b6f', description: 'Budgeting, variance analysis and performance measurement.',
        topics: [
          { id: 'topic-pm-ican-costing', name: 'Advanced Costing Techniques', description: 'Activity-based costing and standard costing systems.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Activity-based costing', 'Standard costing'] },
          { id: 'topic-pm-ican-variance', name: 'Budgetary Control and Variance Analysis', description: 'Variance analysis for materials, labour, overheads, and sales.', examWeight: 0.4, avgDifficulty: 0.6, subtopics: ['Material and labour variances', 'Overhead variances', 'Sales variances', 'Operating statement reconciliation'] },
          { id: 'topic-pm-ican-performance', name: 'Performance Measurement', description: 'Financial and non-financial performance indicators, including balanced scorecard.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Financial performance indicators', 'Balanced scorecard', 'Divisional performance and transfer pricing'] },
        ],
      },
      {
        id: 'subj-psaf-ican', name: 'Public Sector Accounting and Finance (Skills)', icon: 'calculator', color: '#4ecdc4', description: 'Government accounting standards and public financial management.',
        topics: [
          { id: 'topic-psaf-ican-framework', name: 'Public Sector Accounting Framework', description: 'IPSAS, government accounting bases (cash vs accrual), and the Nigerian public finance framework.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Cash vs accrual basis', 'IPSAS overview', 'Fund accounting'] },
          { id: 'topic-psaf-ican-budgeting', name: 'Government Budgeting', description: 'The budget cycle, budget classification, and public expenditure control.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Budget cycle', 'Budget classification', 'Expenditure control'] },
          { id: 'topic-psaf-ican-reporting', name: 'Government Financial Reporting', description: 'Preparing and interpreting government financial statements.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Statement of consolidated revenue fund', 'Treasury single account'] },
        ],
      },
      {
        id: 'subj-mge-ican', name: 'Management, Governance and Ethics (Skills)', icon: 'book-open', color: '#8b6fc0', description: 'Corporate governance, professional ethics and strategy.',
        topics: [
          { id: 'topic-mge-ican-strategy', name: 'Strategic Analysis and Choice', description: 'Environmental analysis, strategic options, and strategy evaluation.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['SWOT and PESTEL analysis', 'Strategic options', 'Strategy evaluation'] },
          { id: 'topic-mge-ican-governance', name: 'Corporate Governance', description: 'Board structures, governance codes, and stakeholder management.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Board composition and duties', 'Nigerian governance codes', 'Stakeholder theory'] },
          { id: 'topic-mge-ican-ethics', name: 'Professional and Business Ethics', description: 'Ethical frameworks and the accountant\'s professional code of conduct.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Ethical theories', 'ICAN code of conduct', 'Ethical dilemmas in practice'] },
        ],
      },
      // Professional
      {
        id: 'subj-cr-ican', name: 'Corporate Reporting (Professional)', icon: 'calculator', color: '#ff6b4a', description: 'Advanced group and complex financial reporting.',
        topics: [
          { id: 'topic-cr-ican-groups', name: 'Complex Group Accounts', description: 'Consolidations involving subsidiaries, associates, joint arrangements, and disposals.', examWeight: 0.45, avgDifficulty: 0.7, subtopics: ['Multi-entity consolidation', 'Associates and joint ventures', 'Disposals and step acquisitions'] },
          { id: 'topic-cr-ican-standards', name: 'Advanced Financial Reporting Standards', description: 'Complex application of IFRS, including financial instruments and share-based payment.', examWeight: 0.35, avgDifficulty: 0.7, subtopics: ['Financial instruments (IFRS 9)', 'Share-based payment (IFRS 2)', 'Deferred tax'] },
          { id: 'topic-cr-ican-analysis', name: 'Interpretation and Current Issues', description: 'Analyzing financial statements and evaluating current developments in corporate reporting.', examWeight: 0.2, avgDifficulty: 0.6, subtopics: ['Ratio analysis and interpretation', 'Emerging reporting issues (sustainability, integrated reporting)'] },
        ],
      },
      {
        id: 'subj-aaa-ican', name: 'Advanced Audit and Assurance (Professional)', icon: 'book-open', color: '#4ecdc4', description: 'Complex and specialist audit and assurance scenarios.',
        topics: [
          { id: 'topic-aaa-ican-planning', name: 'Advanced Audit Planning', description: 'Group audits, risk assessment in complex environments, and audit strategy.', examWeight: 0.3, avgDifficulty: 0.65, subtopics: ['Group audit planning', 'Risk in complex/IT environments', 'Audit strategy'] },
          { id: 'topic-aaa-ican-specialist', name: 'Specialist and Assurance Engagements', description: 'Assurance on non-financial information, forensic engagements, and other assurance services.', examWeight: 0.35, avgDifficulty: 0.65, subtopics: ['Assurance on non-financial info', 'Forensic audit engagements', 'Prospective financial information'] },
          { id: 'topic-aaa-ican-reporting', name: 'Reporting and Professional Issues', description: 'Complex audit reports, quality control, and professional/ethical issues.', examWeight: 0.35, avgDifficulty: 0.65, subtopics: ['Modified audit opinions', 'Quality control (ISQM)', 'Professional and ethical issues'] },
        ],
      },
      {
        id: 'subj-sfm-ican', name: 'Strategic Financial Management (Professional)', icon: 'trending-up', color: '#ff8b6f', description: 'Corporate finance, valuation and investment decisions.',
        topics: [
          { id: 'topic-sfm-ican-investment', name: 'Investment Appraisal', description: 'NPV, IRR, and appraisal under risk and uncertainty.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['NPV and IRR', 'Risk-adjusted appraisal', 'Capital rationing'] },
          { id: 'topic-sfm-ican-financing', name: 'Financing Decisions', description: 'Cost of capital, capital structure, and sources of finance.', examWeight: 0.3, avgDifficulty: 0.65, subtopics: ['Cost of capital (WACC)', 'Capital structure theories', 'Sources of long-term finance'] },
          { id: 'topic-sfm-ican-valuation', name: 'Business Valuation and M&A', description: 'Valuation methods and mergers/acquisitions considerations.', examWeight: 0.25, avgDifficulty: 0.65, subtopics: ['Valuation methods', 'Merger and acquisition analysis'] },
          { id: 'topic-sfm-ican-risk', name: 'Risk Management', description: 'Foreign exchange, interest rate risk, and hedging techniques.', examWeight: 0.15, avgDifficulty: 0.6, subtopics: ['Foreign exchange risk', 'Interest rate risk', 'Hedging instruments'] },
        ],
      },
      {
        id: 'subj-cs-ican', name: 'Case Study (Professional)', icon: 'book-open', color: '#8b6fc0', description: 'Integrated case-based assessment of professional competence.',
        topics: [
          { id: 'topic-cs-ican-analysis', name: 'Integrated Case Analysis', description: 'Synthesizing financial, strategic, and ethical information from an unseen case scenario.', examWeight: 0.5, avgDifficulty: 0.7, subtopics: ['Identifying key issues', 'Cross-topic synthesis'] },
          { id: 'topic-cs-ican-recommendations', name: 'Professional Judgement and Recommendations', description: 'Formulating reasoned, professional-quality recommendations under time pressure.', examWeight: 0.5, avgDifficulty: 0.7, subtopics: ['Structuring recommendations', 'Balancing competing stakeholder interests'] },
        ],
      },
      {
        id: 'subj-atax-ican', name: 'Advanced Taxation (Professional)', icon: 'trending-up', color: '#ffd93d', description: 'Complex tax planning and specialist tax computations.',
        topics: [
          { id: 'topic-atax-ican-planning', name: 'Tax Planning and Ethics', description: 'Tax planning strategies within an ethical and legal framework.', examWeight: 0.3, avgDifficulty: 0.65, subtopics: ['Tax planning vs avoidance vs evasion', 'Ethical considerations in tax practice'] },
          { id: 'topic-atax-ican-corporate', name: 'Complex Corporate Tax', description: 'Group taxation, reorganizations, and petroleum/specialized industry taxation.', examWeight: 0.4, avgDifficulty: 0.7, subtopics: ['Group relief and reorganizations', 'Petroleum profits tax', 'Specialized industry taxation'] },
          { id: 'topic-atax-ican-international', name: 'International Taxation', description: 'Double taxation relief, transfer pricing, and cross-border tax issues.', examWeight: 0.3, avgDifficulty: 0.7, subtopics: ['Double taxation treaties', 'Transfer pricing rules'] },
        ],
      },
    ],
  },
  {
    id: 'exam-citn',
    code: 'CITN',
    name: 'CITN',
    shortName: 'CITN',
    category: 'professional',
    unitLabel: 'papers',
    description: 'Chartered Institute of Taxation of Nigeria preparation.',
    longDescription: 'CITN certifies tax professionals in Nigeria. Idrak provides reasoning-focused tutoring for tax law, computations, and professional ethics.',
    maxScore: 100,
    color: '#4ecdc4',
    totalQuestions: 1800,
    durationMinutes: 180,
    passingScore: 50,
    subjects: [
      {
        id: 'subj-fa-citn', name: 'Financial Accounting', icon: 'calculator', color: '#ff6b4a', description: 'Foundation-level financial accounting for tax practitioners.',
        topics: [
          { id: 'topic-fa-citn-bookkeeping', name: 'Bookkeeping and Double Entry', description: 'The accounting equation, ledgers, and the trial balance.', examWeight: 0.3, avgDifficulty: 0.4, subtopics: ['Double-entry principles', 'Ledger accounts', 'Trial balance'] },
          { id: 'topic-fa-citn-adjustments', name: 'Accounting Adjustments', description: 'Accruals, prepayments, depreciation, and bad debts.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Accruals and prepayments', 'Depreciation methods'] },
          { id: 'topic-fa-citn-statements', name: 'Financial Statement Preparation', description: 'Preparing statements of profit or loss and financial position.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['Statement of profit or loss', 'Statement of financial position', 'Bank reconciliation'] },
        ],
      },
      {
        id: 'subj-bl-citn', name: 'Business Law', icon: 'book-open', color: '#8b6fc0', description: 'Nigerian business law, contracts and the judicial system.',
        topics: [
          { id: 'topic-bl-citn-system', name: 'The Nigerian Legal System', description: 'Sources of Nigerian law and the court structure.', examWeight: 0.2, avgDifficulty: 0.4, subtopics: ['Sources of law', 'Court structure'] },
          { id: 'topic-bl-citn-contract', name: 'Law of Contract', description: 'Formation, terms, and discharge of contracts.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['Formation of contract', 'Terms and breach', 'Remedies'] },
          { id: 'topic-bl-citn-business', name: 'Business Organizations Law', description: 'Partnerships, company incorporation, and business registration.', examWeight: 0.45, avgDifficulty: 0.55, subtopics: ['Partnership law', 'Company incorporation (CAMA)', 'Business name registration'] },
        ],
      },
      {
        id: 'subj-pt-citn', name: 'Principles and Practice of Taxation', icon: 'trending-up', color: '#ffd93d', description: 'Core tax principles, personal income tax and administration.',
        topics: [
          { id: 'topic-pt-citn-principles', name: 'Principles of Taxation', description: 'Canons of taxation, tax types, and the Nigerian tax structure.', examWeight: 0.25, avgDifficulty: 0.4, subtopics: ['Canons of taxation', 'Direct vs indirect taxes', 'Nigerian tax structure'] },
          { id: 'topic-pt-citn-pit', name: 'Personal Income Tax', description: 'Computing taxable income, reliefs, and PAYE.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['Taxable income computation', 'Reliefs and allowances', 'PAYE administration'] },
          { id: 'topic-pt-citn-administration', name: 'Tax Administration', description: 'Roles of FIRS, State IRS, and the Joint Tax Board.', examWeight: 0.35, avgDifficulty: 0.5, subtopics: ['FIRS and State IRS functions', 'Joint Tax Board', 'Tax registration and filing'] },
        ],
      },
      {
        id: 'subj-cpt-citn', name: 'Companies and Petroleum Taxation', icon: 'trending-up', color: '#ff8b6f', description: 'Company income tax, petroleum profits tax and related computations.',
        topics: [
          { id: 'topic-cpt-citn-cit', name: 'Companies Income Tax', description: 'Assessable and taxable profit computation, and capital allowances.', examWeight: 0.4, avgDifficulty: 0.6, subtopics: ['Assessable profit computation', 'Capital allowances', 'Minimum tax'] },
          { id: 'topic-cpt-citn-ppt', name: 'Petroleum Profits Tax', description: 'Computing petroleum profits tax for upstream oil and gas operations.', examWeight: 0.35, avgDifficulty: 0.7, subtopics: ['PPT computation', 'Capital allowances in petroleum operations'] },
          { id: 'topic-cpt-citn-other', name: 'Other Corporate Taxes', description: 'Tertiary education tax, NITDA levy, and related statutory levies.', examWeight: 0.25, avgDifficulty: 0.55, subtopics: ['Tertiary education tax', 'Statutory levies'] },
        ],
      },
      {
        id: 'subj-tai-citn', name: 'Tax Audit and Investigation', icon: 'book-open', color: '#4ecdc4', description: 'Tax audit procedures, investigation and dispute resolution.',
        topics: [
          { id: 'topic-tai-citn-audit', name: 'Tax Audit Procedures', description: 'Planning and conducting a tax audit, and desk vs field audits.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['Audit planning', 'Desk audit vs field audit', 'Documentation review'] },
          { id: 'topic-tai-citn-investigation', name: 'Tax Investigation', description: 'Investigating suspected tax evasion and back-duty assessments.', examWeight: 0.3, avgDifficulty: 0.6, subtopics: ['Indicators of tax evasion', 'Back-duty assessment'] },
          { id: 'topic-tai-citn-dispute', name: 'Objections, Appeals and Dispute Resolution', description: 'The tax objection and appeal process, including the Tax Appeal Tribunal.', examWeight: 0.3, avgDifficulty: 0.55, subtopics: ['Notice of objection', 'Tax Appeal Tribunal process'] },
        ],
      },
      {
        id: 'subj-tma-citn', name: 'Tax Management and Administration', icon: 'book-open', color: '#4ecdc4', description: 'Tax practice management, ethics and professional standards.',
        topics: [
          { id: 'topic-tma-citn-ethics', name: 'Professional Ethics and Standards', description: 'CITN\'s code of professional conduct for tax practitioners.', examWeight: 0.3, avgDifficulty: 0.45, subtopics: ['CITN code of conduct', 'Confidentiality and integrity'] },
          { id: 'topic-tma-citn-planning', name: 'Tax Planning and Compliance', description: 'Legitimate tax planning versus avoidance and evasion, and compliance obligations.', examWeight: 0.4, avgDifficulty: 0.55, subtopics: ['Tax planning vs avoidance vs evasion', 'Compliance calendar and filing obligations'] },
          { id: 'topic-tma-citn-practice', name: 'Tax Practice Management', description: 'Running a tax practice, client management, and quality control.', examWeight: 0.3, avgDifficulty: 0.5, subtopics: ['Client engagement management', 'Quality control in practice'] },
        ],
      },
    ],
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
