import { IAnswer } from './answers.interface';

export interface IQuestion {
  answer?: any;
  answerType: string;
  answers?: IAnswer[];
  questionId: number;
  questionText: string;
  isAnswered:boolean;
  answerText?:string;
}
