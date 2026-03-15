import { Question } from "./questions.interface";


export interface Section {
  id: number;
  title: string;
  questions: Question[];
}
