// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TasksService } from '../../../services/tasks.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-over-view-initiatives',
  imports: [CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule, SharedTabsComponent],
  templateUrl: './overViewInitiatives.component.html',
  styleUrl: './overViewInitiatives.component.scss',
})
export class OverViewInitiativesComponent {
  breadCrumbLinks: any;
  loadDataInitiative: boolean = false;
  tabs: any[] = [];
  InitiativeData: any;
  active_tab = 1;
  InitiativeId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _InitiativeService: TasksService
  ) {
      this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Management'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Initiative'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },

         {
        name: this._TranslateService.instant('INITIATIVE.VIEW_INITIATIVE'),
        icon: '',
      },
    ]);
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment',
        router: 'comments',
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-paperclip',
        router: 'attachments',
      },
    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.InitiativeId = res.get('id');
    });
    this.getByIdInitiatives();
  }
  getByIdInitiatives() {
    this.loadDataInitiative = true;
    this._InitiativeService.getInitiativeById(this.InitiativeId).subscribe((res: any) => {
      this.InitiativeData = res?.data;
      this.loadDataInitiative = false;
    });
  }
}
