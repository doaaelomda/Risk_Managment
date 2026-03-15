import { OwnerUserComponent } from './../../../../../../../../shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProcessListService } from 'libs/features/BPM/src/processList/process-list.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-view-procedure',
  imports: [CommonModule, SkeletonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './viewProcedure.component.html',
  styleUrl: './viewProcedure.component.scss',
})
export class ViewProcedureComponent {
  dataProcedure: any;
  loadDataProcess: boolean = false;
  procedureId: any;
  tabs: any;
  entries: OverviewEntry[] = [
  { key: 'referenceCode', label: 'PROCEDURE.REFERENCE_CODE', type: 'text' },
    { key: 'ownerRoleName', label: 'FINDING.OWNER_ROLE', type: 'role',id:'ownerRoleID' },
  { key: 'organizationalUnitName', label: 'Control_view.Organizational_Unit', type: 'text' },
  { key: 'currentBusinessProcedure', label: 'PROCEDURE.CURRENT_BUSINESS_PROCEDURE', type: 'text' },
  { key: 'objective', label: 'PROCEDURE.OBJECTIVE', type: 'description' },
  { key: 'objectiveAr', label: 'PROCEDURE.OBJECTIVE_AR', type: 'description' },
  { key: 'scope', label: 'PROCEDURE.SCOPE', type: 'description' },
  { key: 'scopeAr', label: 'PROCEDURE.SCOPE_AR', type: 'description' },

];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private ProcessListService: ProcessListService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.procedureId = res.get('procedureId');
      if (this.procedureId) {
        this.loadDataProcess = true
        this.ProcessListService.getproceduresById(this.procedureId).subscribe(
          (res: any) => {
            this.dataProcedure = res?.data;
            this.loadDataProcess = false;
          }
        );
      }
    });
  }
}
