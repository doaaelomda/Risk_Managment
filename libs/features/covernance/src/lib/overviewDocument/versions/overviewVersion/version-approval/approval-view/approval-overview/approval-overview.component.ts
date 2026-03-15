import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionApprovalService } from 'libs/features/covernance/src/service/version-approval.service';
import { filter, finalize, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-approval-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './approval-overview.component.html',
  styleUrl: './approval-overview.component.scss',
})
export class ApprovalOverviewComponent {
  constructor(private service: VersionApprovalService,private _activeRoute:ActivatedRoute) {
    this.id = this._activeRoute.parent?.snapshot.paramMap.get('id');
  }
  id:any
  entries: OverviewEntry[] = [
     {
      key:'govDocumentVersionName',
      label:'VERSIONS.VersionName',
      type:'text'
    },
    {
      key: 'assigneeUserName',
      label: 'VERSION.USER_ASSIGNEE',
      type: 'user',
      id:'assigneeUserID'
    },
    // {
    //   key: 'assigneeRoleName',
    //   label: 'VERSION.ROLE_ASSIGNEE',
    //   type: 'text',
    // },
    {
      key: 'approverUserName',
      label: 'VERSION.APPROVER_ASSIGNEE',
      type: 'user',
    },
    {
      key: 'govDocumentApprovalStatusTypeName',
      label: 'VERSION.STATUS',
      type: 'badge',
      colorKey:'govDocumentApprovalStatusTypeColor'
    },
    // {
    //   key: 'approvalRequestDate',
    //   label: 'VERSION.REQUEST_DATE',
    //   type: 'date',
    // },
    // {
    //   key: 'approvalDueDate',
    //   label: 'VERSION.DUE_DATE',
    //   type: 'date',
    // },
    {
      key: 'approvalDate',
      label: 'VERSION.APPROVAL_DATE',
      type: 'date',
    },
    {
      key: 'approvalDecisionNote',
      label: 'VERSION.DECISION_NOTE',
      type: 'description',
    },

  ];
  loading: boolean = false;
  getData() {
    this.loading = true;
    this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
      next:(res) => { this.data = res; this.loading = false },
      error:() => { this.loading = false }
    });
  }
  data!: any;
  dataSub!: Subscription;
  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
}
