/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { switchMap } from 'rxjs';
import { RiskService } from '../../../services/risk.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-risk-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './risk-comments.component.html',
  styleUrl: './risk-comments.component.scss',
})
export class RiskCommentsComponent {
  riskId: any;
  riskChildId: any;
  constructor(
    private _RiskService: RiskService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,

    private _TranslateService:TranslateService
  ) {
     this._ActivatedRoute.parent?.paramMap
    .pipe(
      switchMap((params) => {
        this.riskId = Number(params.get('riskID'));
        return this._RiskService.getOneRisk(this.riskId);
      })
    )
    .subscribe((res) => {
      this.riskTitle = res.data?.riskTitle;

   this._LayoutService.breadCrumbLinks.next([
  {
    name: '',
    icon: 'fi fi-rs-home',
    routerLink: '/'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
        {
          name: this.riskTitle || '---',
          icon: '',
          routerLink:`/gfw-portal/risks-management/risk/${this.riskId}/overview`
        },
        {
          name: 'Risk Comments',
          icon: '',
        },
      ]);
      this._LayoutService.breadCrumbAction.next(null);
    });
  }
  items: any[] = [
    {
      label: 'Delete comment',
      icon: 'fi fi-rr-trash',
      command: () => {},
    },
    {
      label: 'Update comment',
      icon: 'fi fi-rr-pencil',
      command: () => {},
    },
  ];

  riskTitle: string = '-';
  deleteComment(message: any) {
    this._SharedService
      .deleteComment(message.commentID, this.riskId)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }

  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._SharedService
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
}
