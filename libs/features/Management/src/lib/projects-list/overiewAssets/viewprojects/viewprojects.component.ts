import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TasksService } from 'libs/features/Management/src/services/tasks.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TranslateModule } from '@ngx-translate/core';
// import { projectsService } from '../../../services/projects.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-projects',
  imports: [CommonModule,SkeletonModule,TranslateModule,SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './viewprojects.component.html',
  styleUrl: './viewprojects.component.scss',
})
export class ViewprojectsComponent {
  entries: OverviewEntry[] = [
  { key: 'projectManagerRoleUserName', label: 'PROJECT.MANAGER_NAME', type: 'text' },
  { key: 'projectManagerRoleName', label: 'PROJECT.MANAGER_ROLE', type: 'text' },
  { key: 'projectManagerRolePosition', label: 'PROJECT.MANAGER_POSITION', type: 'text' },
  { key: 'startDate', label: 'PROJECT.START_DATE', type: 'date' },
  { key: 'endDate', label: 'PROJECT.END_DATE', type: 'date' },
  { key: 'budget', label: 'PROJECT.BUDGET', type: 'number' },
  { key: 'projectStatusTypeName', label: 'PROJECT.STATUS', type: 'badge' },
  { key: 'projectPriorityLevelTypeName', label: 'PROJECT.PRIORITY', type: 'text' },
  { key: 'progressPercentage', label: 'PROJECT.PROGRESS', type: 'number' },
];
  breadCrumbLinks: any;
  loadDataProjects: boolean = false;
  tabs: any[] = [];
  ProjectData: any;
  active_tab = 1;
  projectId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private TasksService: TasksService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.projectId = res.get('id');
    });
    this.getByIdProjects();
  }
  getByIdProjects() {
    this.loadDataProjects = true;
    this.TasksService.getProjectById(this.projectId).subscribe((res: any) => {
      this.ProjectData = res?.data;
      this.loadDataProjects = false;
    });
  }
}
