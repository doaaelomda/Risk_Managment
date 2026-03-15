import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { Subscription } from 'rxjs';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
@Component({
  selector: 'lib-factor-level-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './factor-level-comment.component.html',
  styleUrl: './factor-level-comment.component.scss',
})
export class FactorLevelCommentComponent implements OnInit, OnDestroy {
  // Declaration Variables
  loading: boolean = false;
  id: any;
  methodolgyId: any;
  isLoaded: any;
  Data: any;
  private subscription: Subscription = new Subscription();
  factorLevelId: any;

  // Declaration Contractor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private __FactorService: FactorsService,
    private _methodologyS: MothodologyService
  ) {}

  // Set Bread Crumb
  handleBreadCrumb() {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res: any) => {
      this.id = res.get('id');
      this.factorLevelId = res.get('factorLevelId');
      this.methodolgyId = res.get('methodolgyId');
      this.isLoaded = true;
      if (this.id) {
        const sub = this.__FactorService
          .getById(this.id)
          .subscribe((res: any) => {
            this.Data = res?.data;
            this.isLoaded = false;
            this.getDataMethodology();
          });
        this.subscription.add(sub);
      }
    });
  }

  // get Data Methodolgy
  getDataMethodology() {
    this._methodologyS.getById(this.methodolgyId).subscribe((res: any) => {
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.METHODOLOGY'
          ),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: this._TranslateService.instant('METHODOLOGY.METHODOLOGYS_LIST'),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
                {
            name: res?.data?.name || '-',
            routerLink:`/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/overview`
        },

                {
          name: this._TranslateService.instant('FACTOR_LEVEL.TABLE_TITLE'),
routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/factorsLevel`,
        },

        {
          name: this.Data?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/factorsLevel/${this,this.factorLevelId}`,
        },
        {
          name: this._TranslateService.instant('TABS.COMMENTS'),
          icon: '',
        },
      ]);
    });
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleBreadCrumb();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
