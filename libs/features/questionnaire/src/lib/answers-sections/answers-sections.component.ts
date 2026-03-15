/* eslint-disable @nx/enforce-module-boundaries */
import { AccordionModule } from 'primeng/accordion';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap } from 'rxjs';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { InstanceService } from '../services/instance.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from "primeng/radiobutton";
import { SkeletonModule } from "primeng/skeleton";
interface ISection {
  secsionName: string;
  questions: {
    questionName: string;
    answerText: string;
    quesitionTypeID: number;
    answerOptions: {
      name: string;
      questionnaireAnswerOptionID: number | string;
    }[];
    answersArray?: number[];
  }[];
}
@Component({
  selector: 'lib-answers-sections',
  imports: [CommonModule, AccordionModule, CheckboxModule, FormsModule, RadioButtonModule, SkeletonModule],
  templateUrl: './answers-sections.component.html',
  styleUrl: './answers-sections.component.scss',
})
export class AnswersSectionsComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private translate: TranslateService,
    private _SharedService: SharedService,
    private InstanceService: InstanceService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    const instanceId =
      this._activatedRoute.snapshot.parent?.paramMap.get('instanceId');
    if (!instanceId) return;
    this.instanceId = instanceId
    this.getDataById(+instanceId);
    this.getAnswers(+instanceId);
  }
  activeIndices: number[] = [0];
  cards: { title: string; value: number | string; total?: number }[] = [];
  sections: ISection[] = [];

  // ─────────────────────────────
  // Breadcrumb Setup
  // ─────────────────────────────
  dataResolver: any;
  dataBreadCrumb: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  riskTitle: any;
  data: any;
  instanceId: any;
  idValue: any;
  newBreadCrumb: any;
  initialBreadCrumb() {
    this._activatedRoute.data.subscribe((res) => {
      if (res['breadCrumbData']) {
        this.dataResolver = res['resolvedHandler'];

        this.newBreadCrumb = [...res['breadCrumbData']];
        this.getData(res['url_entity_id']);
      } else {
        this.dataBreadCrumb = [
          {
            name: this.translate.instant(this.containerKey),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.translate.instant('INSTANCES.INSTANCES_LIST'),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.data?.name,
            routerLink: `/gfw-portal/questionnaire/instance/${this.instanceId}/overview`,
          },
          {
            name: this.translate.instant('QUESTION_ANSWER.ANSWERS'),
          },
        ];
        this.layout.breadCrumbLinks.next(this.dataBreadCrumb);
      }
    });
  }
  getData(url: any) {
    const paramEntityPath = this.dataResolver?.routerEntity;
    const routerLink = paramEntityPath?.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );
    const paramListPath = this.dataResolver?.routerList;
    const routerList = paramListPath?.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );

    const paramViewItem = this.dataResolver?.paramViewItem;
    const routerViewItem = paramViewItem?.replace(
      '${id}',
      +this.dataResolver?.entityId
    );
    this._SharedService
      .getEntityByUrl(url + this.dataResolver?.entityId)
      .subscribe((res: any) => {
        this.riskTitle = res?.data?.riskTitle;
        this.newBreadCrumb.splice(2, 0, {
          name: this.riskTitle || res?.data?.legalName,
          routerLink: routerLink,
        });
        this.newBreadCrumb.splice(3, 0, {
          name: 'Questionnaire',
          routerLink: routerList,
        });
        if (this.instanceId) {
          this.newBreadCrumb.splice(4, 0, {
            name: this.data?.name,
            routerLink: `${routerViewItem}/${this.instanceId}/overview`,
          });
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
  }
  getDataById(id: number) {
    this.InstanceService.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.initialBreadCrumb();
    });
  }

  loadingAnswers: boolean = false;
  getAnswers(id: number) {
    this.loadingAnswers = true;
    this.InstanceService.getInstanceAnswers(id)
      .pipe(finalize(() => (this.loadingAnswers = false)))
      .subscribe({
        next: (res) => {
          console.log(res, 'got instance answers');
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'secsions' in res.data
          ) {
            const sections = res.data.secsions as ISection[];
            sections.map((section: ISection) => {
              section.questions.map((question) => {
                const isMultipleOptionsType = this.multiTypes.includes(
                  question.quesitionTypeID
                );
                const isSingleOptionType = this.singleTypes.includes(
                  question.quesitionTypeID
                );

                if (isSingleOptionType) {
                  switch (question.quesitionTypeID) {
                    case 1:
                      {
                        question.answerOptions = [
                          { name: '1', questionnaireAnswerOptionID: '1' },
                          { name: '2', questionnaireAnswerOptionID: '2' },
                          { name: '3', questionnaireAnswerOptionID: '3' },
                          { name: '4', questionnaireAnswerOptionID: '4' },
                          { name: '5', questionnaireAnswerOptionID: '5' },
                        ];
                      }
                      break;
                    case 2: {
                      question.answerOptions = [
                        { name: 'Yes', questionnaireAnswerOptionID: '1' },
                        { name: 'No', questionnaireAnswerOptionID: '2' },
                      ];
                    }
                  }
                }

                if (!isMultipleOptionsType || !question.answerText) return;
                question.answersArray = question.answerText
                  .split(',')
                  .map((value) => Number(value.trim()))
                  .filter((value) => !Number.isNaN(value));
              });
            });
            this.sections = sections
            console.log(this.sections,'this.sections');
            
          }
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'analysis' in res.data
          ) {
            this.setAnalysis(res.data.analysis);
          }
        },
      });
  }

  setAnalysis(data: any) {
    this.cards = [
      {
        title: this.translate.instant('QUESTIONNAIRE.ANSWERED_SECTIONS'),
        value: data?.answerdSections,
        total: data?.totalSections,
      },

      {
        title: this.translate.instant('QUESTIONNAIRE.ANSWERED_QUESTIONS'),
        value: data?.answeredQuestions,
        total: data?.totalQuestions,
      },
      {
        title: this.translate.instant('QUESTIONNAIRE.OVERALL_SCORE'),
        value: `${(data?.answeredQuestions / data?.totalQuestions) * 100}%`,
      },
    ];
  }

  singleTypes: number[] = [1, 2];
  multiTypes: number[] = [4, 7];
}
