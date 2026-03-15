import { Component, input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'lib-empty-state-dashbourd',
  imports: [CommonModule ,LoaderComponent,TranslateModule],
  templateUrl: './empty-state-dashbourd.component.html',
  styleUrl: './empty-state-dashbourd.component.scss',
})
export class EmptyStateDashbourdComponent {
  loading = input.required<boolean>()

  loadingState = false

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['loading']){
      this.loadingState = changes['loading']?.currentValue;
      console.log("loadingState empty state" , this.loadingState);

    }
  }

}
