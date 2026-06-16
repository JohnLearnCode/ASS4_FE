export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  question: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  _id: string;
  quiz?: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizWithQuestions extends Omit<Quiz, 'question'> {
  question: Question[];
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface Result {
  _id: string;
  userId: string;
  quizId: string | { _id: string; title: string; description?: string };
  answers: Answer[];
  score: number;
  createdAt: string;
  updatedAt: string;
}
