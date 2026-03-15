import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-delete-confirm-popup',
  imports: [CommonModule ,DialogModule,TranslateModule],
  templateUrl: './delete-confirm-popup.component.html',
  styleUrl: './delete-confirm-popup.component.scss',
})
export class DeleteConfirmPopupComponent implements OnChanges{
  visibleInput = input.required<boolean>();


  titleDelete = input<string>('')
  descriptionDelete = input<string>('')

visible:boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['visibleInput'].currentValue != null){
      console.log("visible" , changes['visibleInput'].currentValue);

      this.visible = changes['visibleInput'].currentValue
    }
  }


  hideEmiter = output<boolean>()


}
