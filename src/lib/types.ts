export type ExamCategory = 'national' | 'university_entrance' | 'international' | 'professional';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'challenging';
export type QuestionType = 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
export type SessionType =
  | 'topic_practice' | 'subject_practice' | 'mock_exam' | 'weak_topic'
  | 'high_yield' | 'timed_practice' | 'random_practice' | 'ai_tutor';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing' | 'free';
export type PaymentProvider = 'paystack' | 'stripe' | 'flutterwave' | 'manual';
export type UserRole =
  | 'student' | 'teacher' | 'institution_admin' | 'content_admin'
  | 'super_admin' | 'api_customer' | 'sponsor';
export type MasteryLevel = 'strong' | 'improving' | 'priority' | 'learning';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ActivityType = 'practice' | 'mock' | 'tutor' | 'review' | 'reading' | 'mixed' | 'revision';
