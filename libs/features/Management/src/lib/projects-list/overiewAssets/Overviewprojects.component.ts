import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'lib-overview-projects',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent,
  ],
  templateUrl: './Overviewprojects.component.html',
  styleUrl: './Overviewprojects.component.scss',
})
export class OverviewprojectsComponent {
  breadCrumbLinks: any;
  loadDataProject: boolean = false;
  tabs: any[] = [];
  projectsData: any;
  projectId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private TasksService: TasksService
  ) {
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
      this.projectId = res.get('id');
    });
    this.getData();
  }
  getData() {
    this.loadDataProject = true;
    this.TasksService.getProjectById(this.projectId).subscribe((res: any) => {
      this.projectsData = res?.data;
      this.loadDataProject = false;
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MANAGEMENT'),
          icon: '',
          routerLink: '/gfw-portal/management/projects',
        },
        {
          name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Projects'),
          icon: '',
          routerLink: '/gfw-portal/management/projects',
        },
        {
          name: this.projectsData?.name,
          icon: '',
          routerLink: `/gfw-portal/management/project/${this.projectId}/overview`,
        },
      ]);
    });
  }
}
