import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { InstanceQuestionsService } from '../services/instance-questions.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-instance-question-overview',
  standalone: true,
  imports: [CommonModule, TranslateModule,SharedOverviewComponent],
  templateUrl: './instance-question-overview.component.html',
  styleUrl: './instance-question-overview.component.scss',
})
export class InstanceQuestionOverviewComponent {
  constructor(private _questionsS: InstanceQuestionsService) {}

  dataSub!: Subscription;
  data: any;
  loadDataAssests = true;

  entries:any = [
    {
      label: 'TEMPLATES.INSTANCE_NAME',
      key: 'questionnaireInstanceName',
    },
    {
      label: 'TEMPLATES.SECTION_NAME',
      key: 'questionnaireInstanceSectionName',
    },
    {
      label: 'TEMPLATES.QUESTION_TEXT',
      key: 'questionnaireQuestionText',
    },
    {
      label: 'TEMPLATES.WEIGHT',
      key: 'weight',
    },
    {
      label: 'TEMPLATES.DISPLAY_ORDER',
      key: 'displayOrder',
      fullWidth: true,
    },
  ];

  ngOnInit() {
    this.getQuestionData();
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
  }

  getQuestionData() {
    this.dataSub = this._questionsS.viewedData
      .pipe(filter(res => !!res))
      .subscribe(res => {
        this.data = res;
        this.loadDataAssests = false;
      });
  }
}
