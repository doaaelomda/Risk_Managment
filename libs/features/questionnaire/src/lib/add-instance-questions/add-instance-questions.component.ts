import { Section } from './../../../../../../apps/Questionnaire/src/models/sections.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InstanceQuestionsService } from '../services/instance-questions.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { InputNumberModule } from 'primeng/inputnumber';
import { QuestionsTableUiComponent } from 'libs/shared/shared-ui/src/lib/questions-table-ui/questions-table-ui.component';
import { Button } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InstanceService } from '../services/instance.service';
import { InstanceSectionsService } from '../services/instance-sections.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-instance-questions',
  imports: [
    CommonModule,
    InputNumberModule,
    QuestionsTableUiComponent,
    Button,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './add-instance-questions.component.html',
  styleUrl: './add-instance-questions.component.scss',
})
export class AddInstanceQuestionsComponent {
  constructor(
    private _questionsS: InstanceQuestionsService,
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private _SharedService: SharedService,
    private layout: LayoutService,
    private _translateS: TranslateService,
    private _sectionS: InstanceSectionsService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.featureName = permissions?.feature
    this.moduleName = permissions?.module
  }
  featureName!:string;
  moduleName!:string;
  templateId!: string;
  dataResolver: any;
  dataBreadCrumb: any;
  riskTitle: any;
  idValue: any;
  newBreadCrumb: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  ngOnInit() {
    this.getQuestionId();
  }
  isLoadingData: boolean = false;
  search: any = '';
  handleQuestionsSelect(event: any) {
    console.log(event, 'questions from add question ts');
    this.selected_questions = event;
  }
  handleSearch(event: any) {
    this.search = event;
    this.getQuestionsList();
  }

  initialBreadCrumb() {
    this._activatedRoute.data.subscribe((res) => {
      if (res['breadCrumbData']) {
        this.dataResolver = res['resolvedHandler'];
        this.newBreadCrumb = [...res['breadCrumbData']];
        this.getData(res['url_entity_id']);
      } else {
        this.dataBreadCrumb = [
          { name: this._translateS.instant(this.containerKey) },
          {
            name: this._translateS.instant('INSTANCES.INSTANCES_LIST'),
            routerLink: '/gfw-portal/questionnaire/instance',
          },

          {
            name: this.data?.instanceName,
            routerLink: `/gfw-portal/questionnaire/instance/${this.data?.questionnaireInstanceID}/sections`,
          },

          {
            name: this.data?.name,
            routerLink: `/gfw-portal/questionnaire/instance//${this.data?.questionnaireInstanceID}/sections/${this.sectionId}/questions`,
          },
          {
            name: 'Add New Question',
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
          routerLink: routerLink,
        });
        if (this.instanceId) {
          this.newBreadCrumb.splice(
            4,
            0,
            {
              name: this.data?.instanceName,
              routerLink: routerList,
            },
            {
              name: this.data?.name,
              routerLink: routerViewItem + this.instanceId + '/sections',
            },
            {
              name: 'Add New Question',
            }
          );
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
  }
  removeQuestion(index: any) {
    this.selected_questions.splice(index, 1);
    this.selected_questions = [...this.selected_questions];
  }
  getQuestionsList(event?: any) {
    this.isLoadingData = true;
    this._questionsS
      .getQuestionsList(
        this.search,
        event?.currentPage ?? 1,
        event?.perPage ?? 10
      )
      .subscribe((res) => {
        this.isLoadingData = false;
        this.questionsList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
      });
  }
  pageginationObj: any = {};
  form!: FormGroup;
  questionsList: any[] = [];
  selected_questions: any[] = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selected_questions,
      event.previousIndex,
      event.currentIndex
    );
  }

  sectionId!: string;
  questionId!: string;
  instanceId!: string;
  riskId: any;
  getQuestionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      console.log(res, 'query');

      this.instanceId = res.get('instanceId');
      this.sectionId = res.get('sectionId');
      this.questionId = res.get('questionId');
      this.riskId = res.get('riskID');
      this.getSectionById(this.sectionId);
      if (!this.questionId) return;
      this.getQuestionById(this.questionId);
    });
  }

  data: any;

  getSectionById(id: string) {
    this._sectionS.getById(id).subscribe((res) => {
      const data = res?.data;
      this.data = data;
      this.initialBreadCrumb();
    });
  }
  getQuestionById(id: string) {
    this._questionsS.getById(id).subscribe((res) => {
      const question_data = res?.data;
    });
  }
  navigateBack() {
    const paramViewItem = this.dataResolver?.paramViewItem;
    const routerViewItem = paramViewItem?.replace(
      '${id}',
      +this.dataResolver?.entityId
    );
    this.dataResolver
      ? this._router.navigate([routerViewItem + this.instanceId + '/sections'])
      : this._router.navigate([
          `/gfw-portal/questionnaire/instance/${this.instanceId}/sections/${this.sectionId}/questions`,
        ]);
  }
  isSavingTemplate: boolean = false;
  save() {
    const canAdd = this._PermissionSystemService.can(this.moduleName , this.featureName , 'ADD')
    const canEdit = this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
    if(this.questionId && !canEdit)return
    if(!this.questionId && !canAdd)return
    if (!this.selected_questions.length) return;
    this.isSavingTemplate = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = this.selected_questions.map(
      ({ questionTypeName, questionText, ...rest }) => rest
    );
    const msg = this.questionId ? 'updated' : 'created';
    this._questionsS
      .save(
        data,
        this.instanceId,
        this.sectionId,
        this.questionId,
        this.dataResolver?.dataEntityTypeId,
        this.dataResolver?.entityId
      )
      .subscribe({
        next: (res) => {
          this.isSavingTemplate = false;
          this._messageS.add({
            severity: 'success',
            detail: `Question ${msg} successfully`,
          });
          this.navigateBack();
        },
        error: (err) => (this.isSavingTemplate = false),
      });
  }
}
