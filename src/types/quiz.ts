export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  allowMultiple?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedOptions: { [key: number]: string | string[] };
  showResults: boolean;
} 