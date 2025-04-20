export interface Question {
  id: number;
  text: string;
  options: string[];
  allowMultiple?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedOptions: { [key: number]: string | string[] };
  showResults: boolean;
} 