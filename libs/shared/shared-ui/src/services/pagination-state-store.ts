/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { PaginationInterface } from "apps/gfw-portal/src/app/core/models/pagination";

@Injectable({
  providedIn: 'root'
})
export class PaginationStateStore {

  private paginationState = new Map<string, PaginationInterface>();




  setPaginationState(key: string, state: PaginationInterface): void {
    this.paginationState.set(key, state);
  }


  getPaginationState(key: string): PaginationInterface | undefined {
    return this.paginationState.get(key);
  }


}
