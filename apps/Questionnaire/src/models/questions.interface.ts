import { answer } from './answers.interface';

export interface Question {
  answer?: any;
  answerType: string;
  answers?: answer[];
  questionId: number;
  questionText: string;
  isAnswered:boolean;
  answerText?:string;
}
