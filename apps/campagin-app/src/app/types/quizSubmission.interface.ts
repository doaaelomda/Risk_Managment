interface IQuestion {
  questionId: number;
  answer: string;
}
export interface IQuizSubmission {
  campaignId: number;
  quizId: number;
  questions: IQuestion[];
}
