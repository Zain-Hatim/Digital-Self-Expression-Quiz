export interface Question {
  id: number;
  text: string;
  options: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "How regularly do you use social media? (Content based platforms)",
    options: [
      "a) Multiple times a day",
      "b) Daily",
      "c) Weekly",
      "d) Monthly",
      "e) Rarely or Never"
    ]
  },
  {
    id: 2,
    text: "What is your primary use?",
    options: [
      "a) Producing Content",
      "b) Consuming Content",
      "c) Both"
    ]
  }
]; 