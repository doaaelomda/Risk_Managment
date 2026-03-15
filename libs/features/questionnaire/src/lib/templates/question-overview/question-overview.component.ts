import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { QuestionsService } from '../../services/questions.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InstanceQuestionsService } from '../../services/instance-questions.service';

@Component({
  selector: 'lib-question-overview',
  imports: [CommonModule, SkeletonModule,TranslateModule],
  templateUrl: './question-overview.component.html',
  styleUrl: './question-overview.component.scss',
})
export class TemplateQuestionOverviewComponent {
  constructor(
    private _questionsS: InstanceQuestionsService,
    private _activatedRoute: ActivatedRoute
  ) {}
  templateId: string = '';
  sectionId: string = '';
  questionId: string = '';
    ngOnInit() {
    this.getTemplateId();
  }
  getTemplateId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      console.log(res,'here');

      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      this.questionId = res.get('questionId');
      if (!this.questionId) return;
      this.getTemplateById(this.questionId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getTemplateById(id: string) {
    this.loadingData = true;
    this._questionsS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      console.log(template_data, 'tdata');
    });
  }
}
