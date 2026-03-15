import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InstanceSectionsService } from '../services/instance-sections.service';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-instance-section-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './instance-section-view.component.html',
  styleUrl: './instance-section-view.component.scss',
})
export class InstanceSectionViewComponent {
  dataResolver: any;
  dataBreadCrumb: any;
  title: any;
  idValue: any;
  newBreadCrumb: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _sectionS: InstanceSectionsService,
    private layout: LayoutService,
    private _SharedService: SharedService,
    private _instanceSectionsS: InstanceSectionsService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.questionsName = permissions?.questions
    this.moduleName = permissions?.module
    this.featureName = permissions?.feature
  }
  questionsName!:string;
  moduleName!:string
  featureName!:string
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
        this.title = res?.data?.title;
        this.newBreadCrumb.splice(2, 0, {
          name: this.title || res?.data?.legalName,
          routerLink: routerLink,
        });
        this.newBreadCrumb.splice(3, 0, {
          name: 'Questionnaire',
          routerLink: routerList,
        });
        if (this.instanceId) {
          this.newBreadCrumb.splice(
            4,
            0,
            {
              name: this.data?.instanceName,
              routerLink: routerViewItem + this.instanceId ,
            },
            {
              name: this.data?.name,
            }
          );
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
  }
  ngOnInit() {
    this.handleTabs();
    this.getSectionId();
  }
  instanceId: string = '';
  sectionId: string = '';
  getSectionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.instanceId = res.get('instanceId');
      this.sectionId = res.get('sectionId');
      // this.getTemplateById(this.sectionId);
      if (!this.sectionId) return;
      this.getSectionById(this.sectionId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getSectionById(id: string) {
    this.loadingData = true;
    this._sectionS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      this.initialBreadCrumb();
      console.log(template_data, 'tdata');
    });
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      {
        id: 2,
        name: this._translateS.instant('TEMPLATES.QUESTIONS_LIST'),
        icon: 'fi fi-rr-comment',
        router: 'questions',
        visible: ()=>this._PermissionSystemService.can(this.moduleName , this.questionsName , 'VIEW')

      },
    ];
  }
}
