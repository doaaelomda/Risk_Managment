export interface childrenLink{
  id?:number,
  name: string,
  nameAR:string,
  icon: string | null,
  link: string,
   visible:()=> boolean,
  expand?:boolean,
  childCount?:number,
  children?: childrenLink[]
}
