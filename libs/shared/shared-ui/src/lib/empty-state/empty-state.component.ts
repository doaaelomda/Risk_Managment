import { Component, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-empty-state',
  imports: [CommonModule, LoaderComponent,TranslateModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent implements OnChanges {

  loading = input.required<boolean>()

  loadingState = false

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['loading']){
      this.loadingState = changes['loading']?.currentValue;
      console.log("loadingState empty state" , this.loadingState);

    }
  }


}
