import { childrenLink } from "./childrenLinks"

export interface sideBarLinks {
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
