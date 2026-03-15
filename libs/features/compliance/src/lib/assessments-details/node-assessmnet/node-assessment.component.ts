import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from "primeng/accordion";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-node-assessment',
  imports: [CommonModule, AccordionModule , TranslateModule],
  templateUrl: './node-assessment.component.html',
  styleUrl: './node-assessment.component.scss',
})
export class NodeAssessmentComponent {
    @Input() node: any;

      @Input() level: number = 0;

}
