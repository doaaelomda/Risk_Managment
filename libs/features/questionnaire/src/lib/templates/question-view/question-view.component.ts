import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InstanceQuestionsService } from '../../services/instance-questions.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-question-view',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    RouterOutlet,
    SharedTabsComponent
],
  templateUrl: './question-view.component.html',
  styleUrl: './question-view.component.scss',
})
export class TemplateQuestionViewComponent {
  dataResolver: any;
  instanceId!: string;
  dataBreadCrumb: any;
  riskTitle: any;
  idValue: any;
  newBreadCrumb: any[] = [];
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  moduleName!:string;
  featureName!:string;
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _questionsS: InstanceQuestionsService,
    private layout: LayoutService,
    private _SharedService: SharedService
  ) {

    const permissions = this._activatedRoute.snapshot.data['permissions']
this.moduleName = permissions?.module
this.featureName = permissions?.feature
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
            name: this.data?.questionnaireQuestionText,
            routerLink: `/gfw-portal/questionnaire/instance//${this.data?.questionnaireInstanceID}/sections/${this.sectionId}/questions`,
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
        this.newBreadCrumb.splice(4, 0, {
          name: this.data?.questionnaireQuestionText,
          routerLink: routerViewItem + this.instanceId,
        });
        this.newBreadCrumb.splice(5, 0, {
          name: this.data?.questionnaireInstanceSectionName,
        });
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
    // /gfw-portal/risks-management/risk/1/questionnaire/instance/32/sections/54/questions
  }
  ngOnInit() {
    this.getQuestionId();
  }
  sectionId: string = '';
  questionId: string = '';
  riskId: any;
  getQuestionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      ;
      this.instanceId = res.get('instanceId');
      this.sectionId = res.get('sectionId');
      this.questionId = res.get('questionId');
      this.riskId = res.get('riskID');
      this.getQuestionById(this.questionId);
    });
  }

  loadingData: boolean = false;
  data!: any;

  getQuestionById(id: string) {
    this.loadingData = true;
    this._questionsS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      if (this.data) {
        this.initialBreadCrumb();
        console.log(template_data, 'tdata');
      }
    });
  }
  tabs: any[] = [];

}
