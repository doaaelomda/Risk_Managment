export interface IOption {
  awarenessQuizOptionID: number;
  optionText: string;
  checked: boolean;
}
export interface IQuestion {
  awarenessQuizQuestionID: number;
  questionText: string;
  type: string;
  answer?: number | string | Date | null;
  options?: IOption[];
  answered: boolean;
}
