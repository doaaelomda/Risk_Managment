import { Column } from "./columns.model";

export interface Profile {
  id:number;
  label: string;
  columns:Column[];
}
