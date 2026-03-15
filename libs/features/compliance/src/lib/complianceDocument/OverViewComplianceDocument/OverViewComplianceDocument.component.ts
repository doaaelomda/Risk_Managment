import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import {  of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ComplianceService } from '../../../compliance/compliance.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-over-view-compliance-document',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SkeletonModule,
    SharedTabsComponent,
  ],
  templateUrl: './OverViewComplianceDocument.component.html',
  styleUrls: ['./OverViewComplianceDocument.component.scss'],
})
export class OverViewComplianceDocumentComponent implements OnInit,OnDestroy {
  tabs = [
    { id: 4, name: 'TABS.CONTENT', router: 'content', icon: 'fi fi-rr-script',
      visible: ()=> this._PermissionSystemService.can('COMPLIANCE', 'COMPLIANCEDOCUMENTCONTENT', 'VIEW')

     },
  ];
  id!: any;
  regularId!: string | null;
  data: any=null;
  // Observable for data
  private subscription: Subscription = new Subscription();
  loading = true;

  constructor(
    private translateService: TranslateService,
    private complianceService: ComplianceService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.regularId = this.route.snapshot.paramMap.get('regularId');

    if (this.id) this.loadData();
  }

  /** Load document data as Observable */
  private loadData(): void {
    this.loading = true;

    const sub = this.complianceService.getDocumentCompliance(this.id || this.regularId).pipe(
      map(res => res?.data),
      catchError(err => {
        console.error('Error loading document:', err);
        return of(null);
      })
    ).subscribe(data => {
      this.data = data;
      this.loading = false;
    });

    this.subscription.add(sub); // Add to subscription list
  }

  // Clean up subscriptions
   ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
