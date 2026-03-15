import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-expection-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './expection-comment.component.html',
  styleUrl: './expection-comment.component.scss',
})
export class ExpectionCommentComponent {
  generalId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _dashBoard: DashboardLayoutService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('ExceptionId');
      this.generalId = res.get('generalId');
      if (this.riskChildId) {
        this._dashBoard
          .getExceptionsById(this.riskChildId)
          .subscribe((res: any) => {
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('EXCEPTIONS.LIST_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/third-party/view/${this.generalId}/Exceptions`,
              },

              {
                name: res?.data?.name || '-',
                icon: '',
              },

              {
                name: this._TranslateService.instant('TABS.COMMENTS'),
                icon: '',
              },
            ]);
          });
      }
    });
  }
  riskId = 1;
  riskChildId: any;
}
