import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from './../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StandardDocsService } from '../../services/standard-docs.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-overview-standard-doc',
  imports: [CommonModule, TranslateModule,SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './overview-standard-doc.component.html',
  styleUrl: './overview-standard-doc.component.scss',
})
export class OverviewStandardDocComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _standardDocsS: StandardDocsService
  ) {
    this._activatedRoute?.parent?.paramMap.subscribe((res) => {
      this.governanceStandardID = res.get('id');
    });
  }

  entries: OverviewEntry[] = [
  { key: 'name', label: 'LOOKUP.NAME', type: 'text' },
  { key: 'nameAr', label: 'LOOKUP.NAME_AR', type: 'text' },
  { key: 'shortName', label: 'GOVERNANCE_STANDARDS.SHORT_NAME', type: 'text' },
  { key: 'version', label: 'GOVERNANCE_STANDARDS.VERSION', type: 'text' },
  { key: 'governanceStandardTypeName', label: 'GOVERNANCE_STANDARDS.TYPE', type: 'text' },
     {
    label:"MAIN_INFO.DOC_ELE_CLASSFICATION_PROFILE",
    key:"grcDocumentElementClassificationProfileName",
    type:'badge',
    colorKey:"grcDocumentElementClassificationProfileColor"
  },
  { key: 'description', label: 'LOOKUP.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'LOOKUP.DESCRIPTION_AR', type: 'description' },
];

  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();

  }
  dataSub!: Subscription;
  getData() {
    this.loadingData = true;
    this.dataSub = this._standardDocsS.viewingData.subscribe((res) => {
      this.loadingData = false;
      this.data = res;
    });
  }

  loadingData: boolean = false;
  data!: any;
  governanceStandardID:any
}
