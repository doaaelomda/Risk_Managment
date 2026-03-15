import { Breadcrumb } from './../../../../../../../../apps/gfw-portal/src/app/core/models/breadcrumb.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { CardModule } from 'primeng/card';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-view-compliance-document',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    SystemActionsComponent,
    CardModule,
    SharedOverviewComponent
  ],
  templateUrl: './viewComplianceDocument.component.html',
  styleUrls: ['./viewComplianceDocument.component.scss'],
})
export class ViewComplianceDocumentComponent implements OnInit,OnDestroy {
  id!: any | null;
  regularId!: any | null;
  // Observable for compliance document data

  data: any = null;
  private subscription: Subscription = new Subscription();
  // Loading state
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private complianceService: ComplianceService,
    private layoutService: LayoutService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    // Get parent route param for document ID
    this.id = this.route.parent?.snapshot.paramMap.get('id') ?? null;
    this.regularId = this.route.parent?.snapshot.paramMap.get('regularId');
    if (this.id) this.loadDocument();
  }

  // Destroy Component
    ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  /** Load document data as Observable to use async pipe */
  private loadDocument(): void {
    this.loading = true;

    const sub = this.complianceService
      .getDocumentCompliance(this.id || this.regularId)
      .pipe(
        map((res) => res?.data),
        tap((data) => this.getDefaultBreadcrumbs(data)),
        catchError((err) => {
          console.error('Error loading document:', err);
          return of(null);
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.loading = false;
      });

    this.subscription.add(sub); // Add to subscription list
  }
  // handle Breadcrumb
  private getDefaultBreadcrumbs(data: any) {
    this.layoutService.breadCrumbLinks.next([
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: this.translateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: data?.name ?? '-',
        icon: '',
        routerLink: `/gfw-portal/compliance/overViewDocument/${this.id}/overview`,
      },
    ]);
  }

  mainInfoEntries : OverviewEntry[]  = [
  {
    key: 'shortName',
    label: 'MAIN_INFO.shortName',
    type: 'text',
  },
  {
    key: 'nameAr',
    label: 'PERMISSIONS.NameArabic',
    type: 'text',
  },
  {
    key: 'name',
    label: 'PERMISSIONS.NameEnglish',
    type: 'text',
  },
  {
    key: 'description',
    label: 'RISK_ACTION.DESCRIPTION',
    type: 'description',
  },
  {
    key: 'descriptionAr',
    label: 'MAIN_INFO.DescriptionArabic',
    type: 'description',
  },
  {
    key: 'complianceDocumentStatusTypeName',
    label: 'MAIN_INFO.complianceDocument',
    type: 'badge',
    colorKey: 'complianceDocumentStatusTypeColor',
  },
  {
    key: 'complianceStateTypeName',
    label: 'MAIN_INFO.complianceStateTypeID',
    type: 'badge',
    colorKey: 'complianceStateTypeColor',
  },
  {
    key: 'version',
    label: 'MAIN_INFO.version',
    type: 'text',
  },
  {
    key: 'documentCode',
    label: 'MAIN_INFO.documentCode',
    type: 'text',
  },
  {
    key: 'languageCode',
    label: 'MAIN_INFO.languageCode',
    type: 'text',
  },
  {
    label:"MAIN_INFO.DOC_ELE_CLASSFICATION_PROFILE",
    key:"grcDocumentElementClassificationProfileName",
    type:'badge',
    colorKey:"grcDocumentElementClassificationProfileColor"
  },
  {
    key: 'nextComplianceAssessmentDate',
    label: 'MAIN_INFO.publicationDate',
    type: 'date',
  },
  {
    key: 'lastComplianceAssessmentDate',
    label: 'MAIN_INFO.endOfComplianceDate',
    type: 'date',
  },
  {
    key: 'fromEffectiveDate',
    label: 'MAIN_INFO.effectiveDate',
    type: 'date',

  },
];

    hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }

}
