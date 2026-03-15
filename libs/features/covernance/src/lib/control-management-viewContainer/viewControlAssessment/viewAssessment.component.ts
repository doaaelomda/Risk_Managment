import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
import { GoveranceService } from '../../../service/goverance.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';

@Component({
  selector: 'lib-view-assessment',
  imports: [CommonModule,DialogModule,SkeletonModule,TranslateModule,OwnerUserComponent],
  templateUrl: './viewAssessment.component.html',
  styleUrl: './viewAssessment.component.scss',
})
export class ViewAssessmentComponent implements OnChanges, OnInit {
  show_view = input<boolean>(false);
  Id = input<string>();
  hide_emitter = output<boolean>();

  show_prop: boolean = false;
  DataAssessment: any;

  constructor(private _riskService: RiskService,private GoveranceService:GoveranceService,private _LayoutService:LayoutService,private _TranslateService:TranslateService) {
     this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/assessments',
      },
      {
        name: this._TranslateService.instant('TABS.ASSESSMENT'),
        icon: '',
        routerLink: '/gfw-portal/compliance/assessments',
      },
        {
        name: this._TranslateService.instant('ASSESSMENT_RISK.VIEW_ASSESSMENT'),
        icon: '',
      },
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show_view']) {
      this.show_prop = changes['show_view'].currentValue;
    }
  }

  selectedTypeId:any
  ngOnInit(): void {

  this.GoveranceService.selectedTypeId$.subscribe((id) => {
  this.selectedTypeId = id;
  if (id && this.Id) {
    this.fetchAssessment(this.Id());
  }
});

  }

 loadingData = true;

fetchAssessment(id: any) {
  this.loadingData = true;

  switch (this.selectedTypeId) {
     case 1:
        this.GoveranceService.getImplementationControlsById(id).subscribe((res) => {
    this.DataAssessment = res?.data
    this.loadingData = false;
  });
    break;
    case 2:
        this.GoveranceService.getComplianceControlsById(id).subscribe((res) => {
    this.DataAssessment = res
    this.loadingData = false;
  });
      break;

       case 3:
        this.GoveranceService.getEffectiveControlsById(id).subscribe((res) => {
    this.DataAssessment = res
    this.loadingData = false;
  });
      break;

       case 4:
        this.GoveranceService.getMaturityControlsById(id).subscribe((res) => {
    this.DataAssessment = res
    this.loadingData = false;
  });
      break;
    default:
      break;
  }
}

   onHideDialog() {
    this.hide_emitter.emit(false);
  }

}
