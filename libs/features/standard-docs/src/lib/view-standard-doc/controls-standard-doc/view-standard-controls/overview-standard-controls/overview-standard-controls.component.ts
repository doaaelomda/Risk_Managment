import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsService } from '../../../../services/controls-service.service';
import { IControl } from '../view-standard-controls.component';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-overview-standard-controls',
  imports: [CommonModule, SharedOverviewComponent],
  templateUrl: './overview-standard-controls.component.html',
  styleUrl: './overview-standard-controls.component.scss',
})
export class OverviewStandardControlsComponent {
  constructor(private controlsService: ControlsService) {
    effect(() => {
      this.getData();
      this.loading = this.controlsService.loadingData();
    });
  }
  loading: boolean = false;
  data!: IControl;
  getData() {
    const value = this.controlsService.data();
    if (!value) return;
    this.data = value;
    console.log(this.data, 'data from overview');
  }
overviewEntries: OverviewEntry[] = [
  {
    key: 'name',
    label: 'GOVERNANCE_STANDARDS.NAME',
    type: 'text',
  },
  {
    key: 'nameAr',
    label: 'GOVERNANCE_STANDARDS.NAME_AR',
    type: 'text',
  },
  {
    key: 'shortName',
    label: 'GOVERNANCE_STANDARDS.SHORT_NAME',
    type: 'text',
  },
  {
    key: 'shortNameAr',
    label: 'GOVERNANCE_STANDARDS.SHORT_NAME_AR',
    type: 'text',
  },
  {
    key: 'governanceStandardName',
    label: 'GOVERNANCE_STANDARDS.GOVERNANCE_STANDARD_NAME',
    type: 'text',
  },
  {
    key: 'governanceStandardControlCode',
    label: 'GOVERNANCE_STANDARDS.GOVERNANCE_STANDARD_CONTROL_CODE',
    type: 'text',
  },
  {
    key: 'parentName',
    label: 'GOVERNANCE_STANDARDS.PARENT_NAME',
    type: 'text',
  },
   {
    label:"CONTENT.CLASSFICATIONS",
    key:"grcDocumentElementClassificationName",
    type:'badge',
    colorKey:"grcDocumentElementClassificationColor"
  },
  {
    key: 'objective',
    label: 'GOVERNANCE_STANDARDS.OBJECTIVE',
    type: 'description',
  },
  {
    key: 'objectiveAr',
    label: 'GOVERNANCE_STANDARDS.OBJECTIVE_AR',
    type: 'description',
  },
  {
    key: 'guides',
    label: 'GOVERNANCE_STANDARDS.GUIDES',
    type: 'description',
  },
  {
    key: 'guidesAr',
    label: 'GOVERNANCE_STANDARDS.GUIDES_AR',
    type: 'description',
  },
];

}
