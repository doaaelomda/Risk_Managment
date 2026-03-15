import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceService } from '../services/instance.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap } from 'rxjs';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-instance-overview',
  imports: [
    CommonModule,
    SystemActionsComponent,
    TranslateModule,
    SharedOverviewComponent,
  ],
  templateUrl: './instance-overview.component.html',
  styleUrl: './instance-overview.component.scss',
})
export class InstanceOverviewComponent {
  dataResolver: any;
  finalLinks: any;
  dataBreadCrumb: any;
  riskTitle: any;
  idValue: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  constructor(
    private _instanceS: InstanceService,
    private _activatedRoute: ActivatedRoute,
    private _translateS: TranslateService,
    private layout: LayoutService,
    private _SharedService: SharedService
  ) {}
  ngOnInit() {
    this.getinstanceId();
  }
  instanceId: string = '';
  getinstanceId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.instanceId = res.get('instanceId');
      if (!this.instanceId) return;
      this.getInstanceById(this.instanceId);
    });
  }

  entries: OverviewEntry[] = [
    { key: 'name', label: 'TEMPLATES.NAME', type: 'text' },
    { key: 'nameAr', label: 'TEMPLATES.NAME_AR', type: 'text' },
    {
      key: 'questionnaireTemplateName',
      label: 'TEMPLATES.TEMPLATE_NAME',
      type: 'text',
    },
    { key: 'assigneeUserName', label: 'INSTANCE.ASSIGNEE_USER', type: 'text' },
    { key: 'assigneeRoleName', label: 'INSTANCE.ASSIGNEE_ROLE', type: 'text' },
    { key: 'finalScore', label: 'INSTANCE.FINAL_SCORE', type: 'text' },
    {
      key: 'questionnaireInstanceStatusName',
      label: 'INSTANCE.STATUS',
      type: 'text',
    },
    { key: 'instanceDate', label: 'INSTANCE.DATE', type: 'date' },
    { key: 'expirationDate', label: 'INSTANCE.EXPIRATION_DATE', type: 'date' },
    { key: 'description', label: 'TEMPLATES.DESCRIPTION', type: 'description' },
    {
      key: 'descriptionAr',
      label: 'TEMPLATES.DESCRIPTION_AR',
      type: 'description',
    },
  ];

  loadingData: boolean = false;
  data!: any;
  getInstanceById(id: string) {
    this.loadingData = true;
    this._instanceS.getById(id).subscribe((res) => {
      const data = res?.data;
      this.data = data;
      this.initialBreadCrumb();
      this.loadingData = false;
      console.log(data, 'tdata');
    });
  }
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
            name: this._translateS.instant(this.containerKey),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this._translateS.instant('INSTANCES.INSTANCES_LIST'),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.data?.name,
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
          });
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
