import { OwnerUserComponent } from './../../../../../../../shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TasksService } from 'libs/features/Management/src/services/tasks.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';

@Component({
  selector: 'lib-view-initiatives',
  imports: [CommonModule, SkeletonModule, TranslateModule, SystemActionsComponent, SharedOverviewComponent],
  templateUrl: './ViewInitiatives.component.html',
  styleUrl: './ViewInitiatives.component.scss',
})
export class ViewInitiativesComponent {
  breadCrumbLinks: any;
  loadDataInitiative: boolean = false;
  tabs: any[] = [];
  InitiativeData: any;
  active_tab = 1;
  InitiativeId: any;
  entries:OverviewEntry[] = [
  { key: 'initiativeManagerRoleName', label: 'INITIATIVE.MANAGER_ROLE', type: 'role',id:'initiativeManagerRoleID' },
  { key: 'name', label: 'INITIATIVE.NAME', type: 'text' },
  { key: 'nameAr', label: 'INITIATIVE.NAME_AR', type: 'text' },
  { key: 'startDate', label: 'PROJECT.START_DATE', type: 'date' },
  { key: 'endDate', label: 'PROJECT.END_DATE', type: 'date' },
  { key: 'budget', label: 'PROJECT.BUDGET', type: 'number' },
  { key: 'initiativeStatusTypeName', label: 'PROJECT.STATUS', type: 'badge' },
  { key: 'initiativePriorityLevelTypeName', label: 'PROJECT.PRIORITY', type: 'text' },
  { key: 'progressPercentage', label: 'PROJECT.PROGRESS', type: 'number' },
  { key: 'description', label: 'INITIATIVE.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'INITIATIVE.DESCRIPTION_AR', type: 'description' },
];
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private TasksService: TasksService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.InitiativeId = res.get('id');
    });
    this.getByIdinitiative();
  }
  getByIdinitiative() {
    this.loadDataInitiative = true;
    this.TasksService.getInitiativeById(this.InitiativeId).subscribe((res: any) => {
      this.InitiativeData = res?.data;
      this.loadDataInitiative = false;
    });
  }
}
