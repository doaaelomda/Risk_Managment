import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-input-search',
  imports: [CommonModule , FormsModule , InputTextModule,TranslateModule],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss',
})
export class InputSearchComponent {
  constructor(){
    this.searchSubject.pipe(debounceTime(300)).subscribe((res:string)=>{
      this.searchTermEmiter.emit(this.searchTerm)
    })
  }
  searchTerm:string= '';

  searchTermEmiter = output<string>()


  handleEmitChange(){
    this.searchSubject.next(this.searchTerm)
  }


  private searchSubject:BehaviorSubject<string> = new BehaviorSubject<string>('')
}
