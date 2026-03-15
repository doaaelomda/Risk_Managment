import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsclationService } from '../../../services/esclation.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-esclation-view',
  imports: [CommonModule, TranslateModule,SharedOverviewComponent],
  templateUrl: './esclation-view.component.html',
  styleUrl: './esclation-view.component.scss',
})
export class EsclationViewComponent {


  constructor(
    private _esclationS: EsclationService,
    private _activatedR: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _translateS: TranslateService
  ) {
    this.breadCrumb =    [
       { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._translateS.instant('ESCALATION.BREADCRUMB'),
        icon: '',
        routerLink: '/gfw-portal/esclation',
      },
      {
        name: this._translateS.instant('ESCALATION.LIST_TITLE'),
        icon: '',
        routerLink: '/gfw-portal/esclation/list',
      },
      {
        name: this._translateS.instant('ESCLATION.ESCLATION'),
        icon: '',
      },
    ]
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  breadCrumb:any[] = []
  entries:OverviewEntry[] = [
  { key: 'name', label: 'CONTENT.NAME_AR', type: 'text' },
  { key: 'escalationTypeName', label: 'ESCLATION.ESCLATION_TYPE', type: 'badge' },
  { key: 'active', label: 'CONTENT.STATUS', type: 'badge', true_value:'Active',false_value:'Inactive', true_color:'green',false_color:'red' },
  { key: 'description', label: 'CONTENT.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'CONTENT.DESCRIPTION_AR', type: 'description' },
];
  checkActivatedRoute() {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      console.log(res, 'got id');
      const id = res?.get('id');
      this.getEsclationById(id);
    });
  }
  loading:boolean = false
  getEsclationById(id: any) {
    this.loading = true
    this._esclationS.getEsclationById(id).pipe(finalize(() => this.loading = false)).subscribe((res: any) => {
      console.log(res, 'got esc by id');
      const data = res?.data;
      this.esclation = data;
      this._esclationS.updateStep(0, {
        description: data?.name || '-',
      });
      this.breadCrumb[3].name = data?.name
      console.log(this.esclation, 'this.esclation');
      this._esclationS.currentEsclationDataEntityTypeID.set(data?.dataEntityTypeID)
    });
  }
  toggleReadMore(item: any) {
    item.isDescExpanded = !item.isDescExpanded;
  }

  esclation: any = '';
  ngOnInit() {
    this.checkActivatedRoute();
    this._esclationS.activeStep.next(1);
    this._esclationS.updateStep(2, {
      description: '-',
      command: () => {},
    });
    this._esclationS.updateStep(3, {
      description: '-',
      command: () => {},
    });
    this._esclationS.updateStep(4, {
      description: '-',
      command: () => {},
    });
  }
}
