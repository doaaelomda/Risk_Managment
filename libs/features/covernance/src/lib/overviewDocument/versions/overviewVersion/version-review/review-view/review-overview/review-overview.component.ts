import { OverviewEntry, SharedOverviewComponent } from './../../../../../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionReviewsService } from 'libs/features/covernance/src/service/version-reviews.service';
import { filter, finalize, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';

@Component({
  selector: 'lib-review-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './review-overview.component.html',
  styleUrl: './review-overview.component.scss',
})
export class ReviewOverviewComponent {
  id:any
  constructor(private service: VersionReviewsService,private _activeRoute:ActivatedRoute) {
    this.id = this._activeRoute.parent?.snapshot.paramMap.get('id');
  }
  overviewEntries:OverviewEntry[] = [
    {
      key: 'govDocumentVersionName',
      label: 'LOOKUP.NAME',
      type: 'text',
    },
    {
      key: 'govDocumentReviewReviewerTypeID',
      label: 'VERSION.REVIEWER_TYPE',
      type: 'text',
    },
    {
      key: 'reviewerUserName',
      label: 'VERSION.USER_REVIEWER',
      type: 'user',
      id:'reviewerUserID'
    },
    {
      key: 'reviewerRoleName',
      label: 'VERSION.ROLE_REVIEWER',
      type: 'text',
    },
    {
      key: 'scope',
      label: 'ASSESSMENT_RISK.SCOPE_DESC',
      type: 'text',
    },
    {
      key: 'govDocumentReviewStatusTypeName',
      label: 'VERSION.STATUS',
      type: 'badge',
      colorKey:'govDocumentReviewStatusTypeColor'
    },
    {
      key: 'reviewStartDate',
      label: 'VERSION.START_DATE',
      type: 'date',
    },
    {
      key: 'reviewDueDate',
      label: 'VERSION.DUE_DATE',
      type: 'date',
    },
    {
      key: 'reviewCompletionDate',
      label: 'VERSION.COMPLETION_DATE',
      type: 'date',
    },
    {
      key: 'overallFeedback',
      label: 'VERSION.FEEDBACK',
      type: 'description',
    }
  ];
  loading:boolean = false
  getData() {
    this.loading = true
this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
  next: (res) => {
    this.data = res;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
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
