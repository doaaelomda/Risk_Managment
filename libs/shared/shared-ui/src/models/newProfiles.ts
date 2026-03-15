import { Column } from "./columns.model";

export interface newProfile {
  profileId:number;
  profileName: string;
  isDefult:boolean;
  columns:Column[];
}
