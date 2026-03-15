import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, finalize, Subscription } from 'rxjs';
import { DuadiliganseService } from '../../../services/duadiliganse.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-overview-duadiliganse',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './overview-duadiliganse.component.html',
  styleUrl: './overview-duadiliganse.component.scss',
})
export class OverviewDuadiliganseComponent {
  constructor(private service: DuadiliganseService) {}
  entries: OverviewEntry[] = [
    { key: 'typeName', label: 'DUE_DILIGENCES.TYPE', type: 'text' },
    {
      key: 'resultStatusTypeName',
      label: 'DUE_DILIGENCES.RESULT_STATUS',
      type: 'text',
    },
    { key: 'score', label: 'DUE_DILIGENCES.SCORE', type: 'number' },
    {
      key: 'reportReference',
      label: 'DUE_DILIGENCES.REPORT_REFERENCE',
      type: 'text',
    },
    {
      key: 'requestedDate',
      label: 'DUE_DILIGENCES.REQUESTED_DATE',
      type: 'date',
    },
    {
      key: 'completedDate',
      label: 'DUE_DILIGENCES.COMPLETED_DATE',
      type: 'date',
    },
    {
      key: 'responsibleRoleName',
      label: 'DUE_DILIGENCES.RESPONSIBLE_ROLE',
      type: 'text',
      id:'responsibleRoleID'
    },
    {
      key: 'responsibleUserName',
      label: 'DUE_DILIGENCES.RESPONSIBLE_USER',
      type: 'user',
      id:'responsibleUserID'
    },

    {
      key: 'conditions',
      label: 'DUE_DILIGENCES.CONDITIONS',
      type: 'description',
    },
    {
      key: 'resultSummary',
      label: 'DUE_DILIGENCES.RESULT_SUMMARY',
      type: 'description',
    },
  ];

  dataSub!: Subscription;
  data: any;
  loading: boolean = false;
  ngOnInit() {
    this.loading = true;
    this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
}
