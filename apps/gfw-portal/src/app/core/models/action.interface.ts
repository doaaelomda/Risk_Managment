export interface IAction {
  id: number;
  label: string;
  command: () => void;
    icon?:string
}
