import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { InstanceService } from '../services/instance.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-instance-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent,SkeletonModule,TranslateModule],
  templateUrl: './instance-view.component.html',
  styleUrl: './instance-view.component.scss',
})
export class InstanceViewComponent {
  dataResolver: any;
  finalLinks: any;
  loadingData: boolean = false;
  data!: any;
  instanceId: string = '';
  tabs: any[] = [];
  Data: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _instanceS: InstanceService,
    private _translateS: TranslateService,
    private LayoutService: LayoutService,
    private _SharedService: SharedService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.featureName = permissions?.feature
    this.moduleName = permissions?.module
    this.sectionsName = permissions?.sections
    this.answersName = permissions?.answers

  }
  featureName!:string;
  moduleName!:string;
  sectionsName!:string;
  answersName!:string;
  ngOnInit() {
    this.handleTabs();
    this.getInstanceId();
    this.getRiskData();
  }
  getInstanceId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.instanceId = res.get('instanceId');
      if (!this.instanceId) return;
      this.getInstanceById(this.instanceId);
    });
  }
  getInstanceById(id: string) {
    this.loadingData = true;
    this._instanceS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
    });
  }
  handleTabs() {
    this.tabs = [
      {
        id: 2,
        name: this._translateS.instant('QUESTION_ANSWER.ANSWERS'),
        icon: 'fi fi-rr-comment-question',
        router: 'answers',
        visible: ()=> this._PermissionSystemService.can(this.moduleName, this.answersName, 'VIEW')

      },
      {
        id: 3,
        name: this._translateS.instant('TEMPLATES.SECTIONS_LIST'),
        icon: 'fi fi-rr-comment',
        router: 'sections',
                visible: ()=> this._PermissionSystemService.can(this.moduleName, this.sectionsName, 'VIEW')

      },
    ];
  }

  getRiskData() {
    this._activatedRoute.data.subscribe((res) => {
      if (res['resolvedHandler']?.entityId) {
        this.dataResolver = res['resolvedHandler'];

            this._SharedService
      .getEntityByUrl(res['url_entity_id'] + this.dataResolver?.entityId)
          .subscribe((res: any) => {
            this.Data = res?.data;
          });
      }
    });
  }
}
