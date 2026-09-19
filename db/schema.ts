import {
  pgTable, serial, varchar, text, integer, boolean, timestamp,
  jsonb, doublePrecision, uuid, date, pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============ ENUMS ============
export const userRoleEnum = pgEnum('user_role', [
  'student', 'teacher', 'institution_admin', 'content_admin', 'super_admin', 'api_customer', 'sponsor'
]);
export const examCategoryEnum = pgEnum('exam_category', [
  'national', 'university_entrance', 'international', 'professional'
]);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard', 'challenging']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'short_answer', 'essay', 'true_false']);
export const sessionTypeEnum = pgEnum('session_type', [
  'topic_practice', 'subject_practice', 'mock_exam', 'weak_topic', 'high_yield',
  'timed_practice', 'random_practice', 'ai_tutor'
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'cancelled', 'expired', 'past_due', 'trialing', 'free'
]);
export const paymentProviderEnum = pgEnum('payment_provider', ['paystack', 'stripe', 'flutterwave', 'manual']);

// ============ USERS & AUTH ============
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 100 }),
  avatar: text('avatar'),
  role: userRoleEnum('role').default('student').notNull(),
  bio: text('bio'),
  institutionId: uuid('institution_id'),
  onboardingComplete: boolean('onboarding_complete').default(false),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userSettings = pgTable('user_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  emailNotifications: boolean('email_notifications').default(true),
  pushNotifications: boolean('push_notifications').default(true),
  studyReminders: boolean('study_reminders').default(true),
  dailyGoalMinutes: integer('daily_goal_minutes').default(45),
  reducedMotion: boolean('reduced_motion').default(false),
  highContrast: boolean('high_contrast').default(false),
  tutorDefaultStyle: varchar('tutor_default_style', { length: 50 }).default('socratic'),
  theme: varchar('theme', { length: 20 }).default('cream'),
});

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  examCountdown: boolean('exam_countdown').default(true),
  streakMilestones: boolean('streak_milestones').default(true),
  performanceUpdates: boolean('performance_updates').default(true),
  newQuestions: boolean('new_questions').default(true),
  institutionAnnouncements: boolean('institution_announcements').default(true),
  subscriptionAlerts: boolean('subscription_alerts').default(true),
});

// ============ LEARNING PROFILE ============
export const learningProfiles = pgTable('learning_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  examId: uuid('exam_id'),
  examDate: date('exam_date'),
  targetScore: doublePrecision('target_score'),
  dailyStudyMinutes: integer('daily_study_minutes').default(45),
  strongSubjects: jsonb('strong_subjects').default('[]'),
  weakSubjects: jsonb('weak_subjects').default('[]'),
  strugglingTopics: jsonb('struggling_topics').default('[]'),
  learningStyle: varchar('learning_style', { length: 50 }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  totalStudyMinutes: integer('total_study_minutes').default(0),
  totalQuestionsAnswered: integer('total_questions_answered').default(0),
  averageAccuracy: doublePrecision('average_accuracy').default(0),
  readinessScore: doublePrecision('readiness_score').default(0),
  lastActiveDate: date('last_active_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ EXAMS CATALOG ============
export const exams = pgTable('exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 30 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  shortName: varchar('short_name', { length: 50 }),
  category: examCategoryEnum('category').notNull(),
  description: text('description'),
  longDescription: text('long_description'),
  icon: text('icon'),
  color: varchar('color', { length: 20 }).default('#b8a4e8'),
  totalQuestions: integer('total_questions').default(0),
  durationMinutes: integer('duration_minutes'),
  passingScore: doublePrecision('passing_score'),
  isPublished: boolean('is_published').default(true),
  order: integer('order').default(0),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const examPackages = pgTable('exam_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  tier: varchar('tier', { length: 30 }).notNull(),
  price: doublePrecision('price').default(0),
  currency: varchar('currency', { length: 3 }).default('NGN'),
  billingPeriod: varchar('billing_period', { length: 20 }),
  features: jsonb('features').default('[]'),
  limits: jsonb('limits').default('{}'),
  isPopular: boolean('is_popular').default(false),
  isActive: boolean('is_active').default(true),
});

// ============ SUBJECTS / TOPICS / SUBTOPICS ============
export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 30 }),
  description: text('description'),
  icon: text('icon'),
  color: varchar('color', { length: 20 }),
  order: integer('order').default(0),
  topicCount: integer('topic_count').default(0),
  questionCount: integer('question_count').default(0),
  weight: doublePrecision('weight').default(1),
});

export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  order: integer('order').default(0),
  examWeight: doublePrecision('exam_weight').default(0.5),
  questionCount: integer('question_count').default(0),
  avgDifficulty: doublePrecision('avg_difficulty').default(0.5),
  recurrencePattern: text('recurrence_pattern'),
  prerequisites: jsonb('prerequisites').default('[]'),
});

export const subtopics = pgTable('subtopics', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  order: integer('order').default(0),
  description: text('description'),
  examWeight: doublePrecision('exam_weight').default(0.5),
});

// ============ QUESTIONS ============
export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  examId: uuid('exam_id').references(() => exams.id).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id).notNull(),
  topicId: uuid('topic_id').references(() => topics.id),
  subtopicId: uuid('subtopic_id').references(() => subtopics.id),
  year: integer('year'),
  type: questionTypeEnum('type').default('multiple_choice').notNull(),
  difficulty: difficultyEnum('difficulty').default('medium').notNull(),
  questionText: text('question_text').notNull(),
  questionImage: text('question_image'),
  options: jsonb('options').default('[]'),
  correctAnswer: varchar('correct_answer', { length: 100 }).notNull(),
  explanation: text('explanation'),
  distractors: jsonb('distractors').default('[]'),
  tags: jsonb('tags').default('[]'),
  similarQuestionIds: jsonb('similar_question_ids').default('[]'),
  source: varchar('source', { length: 100 }),
  isVerified: boolean('is_verified').default(false),
  usageCount: integer('usage_count').default(0),
  accuracyRate: doublePrecision('accuracy_rate'),
  timesAsked: integer('times_asked').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ STUDENT ENROLLMENT ============
export const studentExams = pgTable('student_exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('free'),
  startedAt: timestamp('started_at').defaultNow(),
  examDate: date('exam_date'),
  targetScore: doublePrecision('target_score'),
  readinessScore: doublePrecision('readiness_score').default(0),
  packageId: uuid('package_id'),
});

export const studentSubjects = pgTable('student_subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  confidence: integer('confidence').default(2),
  masteryScore: doublePrecision('mastery_score').default(0),
  questionsAnswered: integer('questions_answered').default(0),
  accuracy: doublePrecision('accuracy').default(0),
  timeSpentMinutes: integer('time_spent_minutes').default(0),
  isActive: boolean('is_active').default(true),
});

export const studentTopicPerformance = pgTable('student_topic_performance', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'cascade' }).notNull(),
  questionsAnswered: integer('questions_answered').default(0),
  correct: integer('correct').default(0),
  accuracy: doublePrecision('accuracy').default(0),
  masteryLevel: varchar('mastery_level', { length: 20 }).default('learning'),
  lastPracticed: timestamp('last_practiced'),
  priorityScore: doublePrecision('priority_score').default(0),
});

// ============ PRACTICE SESSIONS ============
export const practiceSessions = pgTable('practice_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sessionType: sessionTypeEnum('session_type').notNull(),
  examId: uuid('exam_id').references(() => exams.id),
  subjectId: uuid('subject_id').references(() => subjects.id),
  topicId: uuid('topic_id').references(() => topics.id),
  totalQuestions: integer('total_questions').default(0),
  correctCount: integer('correct_count').default(0),
  incorrectCount: integer('incorrect_count').default(0),
  skippedCount: integer('skipped_count').default(0),
  score: doublePrecision('score').default(0),
  accuracy: doublePrecision('accuracy').default(0),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  isTimed: boolean('is_timed').default(false),
  timeLimitSeconds: integer('time_limit_seconds'),
  isCompleted: boolean('is_completed').default(false),
  recommendations: jsonb('recommendations').default('[]'),
  metadata: jsonb('metadata').default('{}'),
});

export const practiceResponses = pgTable('practice_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => practiceSessions.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  selectedAnswer: varchar('selected_answer', { length: 255 }),
  isCorrect: boolean('is_correct').default(false),
  isSkipped: boolean('is_skipped').default(false),
  isMarkedForReview: boolean('is_marked_for_review').default(false),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  hintRequested: boolean('hint_requested').default(false),
  hintLevel: integer('hint_level').default(0),
  aiInteractions: integer('ai_interactions').default(0),
  answeredAt: timestamp('answered_at').defaultNow(),
});

// ============ MOCK EXAMS ============
export const mockExams = pgTable('mock_exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id).notNull(),
  title: varchar('title', { length: 200 }),
  totalQuestions: integer('total_questions').default(0),
  durationMinutes: integer('duration_minutes').notNull(),
  score: doublePrecision('score').default(0),
  percentage: doublePrecision('percentage').default(0),
  accuracy: doublePrecision('accuracy').default(0),
  correctCount: integer('correct_count').default(0),
  incorrectCount: integer('incorrect_count').default(0),
  unansweredCount: integer('unanswered_count').default(0),
  timeUsedSeconds: integer('time_used_seconds').default(0),
  subjectBreakdown: jsonb('subject_breakdown').default('[]'),
  topicBreakdown: jsonb('topic_breakdown').default('[]'),
  weakAreas: jsonb('weak_areas').default('[]'),
  recommendedNextSteps: jsonb('recommended_next_steps').default('[]'),
  startedAt: timestamp('started_at').defaultNow(),
  submittedAt: timestamp('submitted_at'),
  isCompleted: boolean('is_completed').default(false),
  isSimulated: boolean('is_simulated').default(false),
});

export const mockExamQuestions = pgTable('mock_exam_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  mockExamId: uuid('mock_exam_id').references(() => mockExams.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  questionNumber: integer('question_number').notNull(),
  selectedAnswer: varchar('selected_answer', { length: 255 }),
  isCorrect: boolean('is_correct'),
  isMarkedForReview: boolean('is_marked_for_review').default(false),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  orderIndex: integer('order_index').default(0),
});

// ============ AI TUTOR ============
export const tutorConversations = pgTable('tutor_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id),
  subjectId: uuid('subject_id').references(() => subjects.id),
  topicId: uuid('topic_id').references(() => topics.id),
  questionId: uuid('question_id').references(() => questions.id),
  title: varchar('title', { length: 300 }),
  difficulty: difficultyEnum('difficulty').default('medium'),
  mode: varchar('mode', { length: 30 }).default('socratic'),
  currentHintLevel: integer('current_hint_level').default(0),
  startedAt: timestamp('started_at').defaultNow(),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  isPinned: boolean('is_pinned').default(false),
  messageCount: integer('message_count').default(0),
  conceptMastered: boolean('concept_mastered').default(false),
});

export const tutorMessages = pgTable('tutor_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => tutorConversations.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  contentFormat: varchar('content_format', { length: 20 }).default('text'),
  type: varchar('type', { length: 30 }).default('message'),
  hintLevel: integer('hint_level'),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ STUDY PLANS ============
export const studyPlans = pgTable('study_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id).notNull(),
  name: varchar('name', { length: 200 }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  totalWeeks: integer('total_weeks'),
  dailyMinutes: integer('daily_minutes').default(45),
  isAdaptive: boolean('is_adaptive').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studyPlanItems = pgTable('study_plan_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  planId: uuid('plan_id').references(() => studyPlans.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  dayOfWeek: varchar('day_of_week', { length: 10 }),
  order: integer('order').default(0),
  topicId: uuid('topic_id').references(() => topics.id),
  subjectId: uuid('subject_id').references(() => subjects.id),
  activityType: varchar('activity_type', { length: 50 }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes').default(30),
  priority: varchar('priority', { length: 20 }).default('medium'),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  score: doublePrecision('score'),
  reason: text('reason'),
});

// ============ SAVED CONTENT ============
export const savedItems = pgTable('saved_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  itemType: varchar('item_type', { length: 30 }).notNull(),
  itemId: uuid('item_id').notNull(),
  note: text('note'),
  collectionName: varchar('collection_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  note: text('note'),
  folderName: varchar('folder_name', { length: 100 }).default('All Bookmarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ NOTIFICATIONS ============
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ SUBSCRIPTIONS & PAYMENTS ============
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id),
  packageId: uuid('package_id').references(() => examPackages.id),
  planCode: varchar('plan_code', { length: 100 }),
  provider: paymentProviderEnum('provider').default('paystack'),
  providerSubscriptionId: varchar('provider_subscription_id', { length: 255 }),
  status: subscriptionStatusEnum('status').default('free').notNull(),
  amount: doublePrecision('amount').default(0),
  currency: varchar('currency', { length: 3 }).default('NGN'),
  startsAt: timestamp('starts_at').defaultNow(),
  endsAt: timestamp('ends_at'),
  cancelledAt: timestamp('cancelled_at'),
  renewsAt: timestamp('renews_at'),
  features: jsonb('features').default('{}'),
  limits: jsonb('limits').default('{}'),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  provider: paymentProviderEnum('provider').notNull(),
  providerReference: varchar('provider_reference', { length: 255 }),
  amount: doublePrecision('amount').notNull(),
  currency: varchar('currency', { length: 3 }).default('NGN'),
  status: varchar('status', { length: 30 }).notNull(),
  description: text('description'),
  metadata: jsonb('metadata').default('{}'),
  paidAt: timestamp('paid_at'),
  failedAt: timestamp('failed_at'),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ INSTITUTIONS ============
export const institutions = pgTable('institutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 30 }),
  address: text('address'),
  logo: text('logo'),
  primaryColor: varchar('primary_color', { length: 20 }).default('#b8a4e8'),
  domain: varchar('domain', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id),
});

export const cohorts = pgTable('cohorts', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').references(() => institutions.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  examId: uuid('exam_id').references(() => exams.id),
  description: text('description'),
  teacherId: uuid('teacher_id').references(() => users.id),
  startDate: date('start_date'),
  endDate: date('end_date'),
  seatsAllocated: integer('seats_allocated').default(30),
  seatsUsed: integer('seats_used').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cohortMembers = pgTable('cohort_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortId: uuid('cohort_id').references(() => cohorts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 20 }).default('student'),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const institutionLicenses = pgTable('institution_licenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').references(() => institutions.id, { onDelete: 'cascade' }).notNull(),
  plan: varchar('plan', { length: 50 }).notNull(),
  totalSeats: integer('total_seats').default(0),
  usedSeats: integer('used_seats').default(0),
  startsAt: timestamp('starts_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  status: varchar('status', { length: 30 }).default('active'),
});

// ============ SPONSORS / NGO ============
export const sponsors = pgTable('sponsors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  organizationName: varchar('organization_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }),
  totalSeatsFunded: integer('total_seats_funded').default(0),
  totalAmountFunded: doublePrecision('total_amount_funded').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsoredSeats = pgTable('sponsored_seats', {
  id: uuid('id').defaultRandom().primaryKey(),
  sponsorId: uuid('sponsor_id').references(() => sponsors.id),
  sponsorType: varchar('sponsor_type', { length: 30 }).default('ngo'),
  userId: uuid('user_id').references(() => users.id),
  institutionId: uuid('institution_id').references(() => institutions.id),
  cohortId: uuid('cohort_id').references(() => cohorts.id),
  examId: uuid('exam_id').references(() => exams.id),
  grantedAt: timestamp('granted_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  status: varchar('status', { length: 20 }).default('active'),
});

// ============ API / DEVELOPER PORTAL ============
export const apiCustomers = pgTable('api_customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  companyName: varchar('company_name', { length: 255 }),
  website: text('website'),
  plan: varchar('plan', { length: 30 }).default('free'),
  rateLimitPerMinute: integer('rate_limit_per_minute').default(60),
  totalRequests: integer('total_requests').default(0),
  billingEmail: varchar('billing_email', { length: 255 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => apiCustomers.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 20 }),
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const apiUsageLogs = pgTable('api_usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => apiCustomers.id),
  keyId: uuid('key_id').references(() => apiKeys.id),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  statusCode: integer('status_code'),
  responseTimeMs: integer('response_time_ms'),
  requestCount: integer('request_count').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ AFFILIATE RESOURCES ============
export const affiliateResources = pgTable('affiliate_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  description: text('description'),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id),
  topicId: uuid('topic_id').references(() => topics.id),
  url: text('url').notNull(),
  imageUrl: text('image_url'),
  price: doublePrecision('price'),
  currency: varchar('currency', { length: 3 }),
  commissionRate: doublePrecision('commission_rate').default(0),
  isRecommended: boolean('is_recommended').default(true),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  isActive: boolean('is_active').default(true),
});

// ============ WHITE-LABEL CONFIGS ============
export const whiteLabelConfigs = pgTable('white_label_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: varchar('owner_type', { length: 30 }).notNull(),
  brandName: varchar('brand_name', { length: 100 }).default('Idrak AI'),
  logo: text('logo'),
  primaryColor: varchar('primary_color', { length: 20 }).default('#ff6b4a'),
  secondaryColor: varchar('secondary_color', { length: 20 }).default('#b8a4e8'),
  customDomain: varchar('custom_domain', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  customCopy: jsonb('custom_copy').default('{}'),
  enabledExams: jsonb('enabled_exams').default('[]'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ CAREER PATHS (future) ============
export const careerPaths = pgTable('career_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  duration: varchar('duration', { length: 50 }),
  difficulty: difficultyEnum('difficulty').default('medium'),
  skills: jsonb('skills').default('[]'),
  isPublished: boolean('is_published').default(false),
});

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  notifications: many(notifications),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  subjects: many(subjects),
  packages: many(examPackages),
}));

export const subjectsRelations = relations(subjects, ({ many, one }) => ({
  exam: one(exams, { fields: [subjects.examId], references: [exams.id] }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ many, one }) => ({
  subject: one(subjects, { fields: [topics.subjectId], references: [subjects.id] }),
  subtopics: many(subtopics),
}));
