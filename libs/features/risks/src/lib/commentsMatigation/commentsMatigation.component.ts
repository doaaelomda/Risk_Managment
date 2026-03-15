import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { RiskService } from '../../services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-comments-matigation',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './commentsMatigation.component.html',
  styleUrl: './commentsMatigation.component.css',
})
export class CommentsMatigationComponent {
  riskmitigationId: any;
  riskId: any;
  riskTitle: string = '';
  name: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _LayoutService: LayoutService,
    private _TranslateService:TranslateService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.riskId = params.get('riskID');
    });
    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.riskmitigationId = params.get('id');
      console.log(this.riskmitigationId);
      this._RiskService.getOneRisk(this.riskId).subscribe((resulat) => {
        this.name = resulat?.data.riskTitle;

        this._RiskService
          .getOneRiskMitagation(this.riskmitigationId)
          .subscribe((res) => {
            this.riskTitle = res?.data.name;

            // breadcrumb لازم ييجي بعد ما تتحدث القيم
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
                name: this.name || '---',
                icon: '',
                routerLink: `/gfw-portal/risks-management/risk/${this.riskId}/overview`,
              },
              {
                name: 'Mitigation Plans',
                icon: '',
                routerLink: `/gfw-portal/risks-management/risk/${this.riskId}/mitigation-plans`,
              },
              {
                name: this.riskTitle || '--',
                icon: '',
                routerLink:`/gfw-portal/risks-management/${this.riskId}/mitigation-plans/${this.riskmitigationId}/overview`
              },
              {
                name: 'Commments',
                icon: '',
              },
            ]);
          });
      });
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
  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._SharedService
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
  deleteComment(message: any) {
    this._SharedService
      .deleteComment(message.commentID, this.riskId)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }
}
