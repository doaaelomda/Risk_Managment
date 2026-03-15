import { IQuestion } from "./questions.interface";


export interface ISection {
  id: number;
  title: string;
  questions: IQuestion[];
}
