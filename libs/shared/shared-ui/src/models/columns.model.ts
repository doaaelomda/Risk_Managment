export interface DataMapItem {
  key: string;
  value: string;
}

export interface Column {
  id:number;
  filed: string;
  type: 'card' | 'iconText' | 'date' | 'progressBar' | 'currency' | 'badge' | 'multilineText' | 'attachment'|string;
  dataMap: DataMapItem[];
  isShown: boolean;
  isResizable: boolean;
  isFixed: boolean;
  label:string;
  isSortable?:boolean;
  displayName?:string;
  width?:number;
}
