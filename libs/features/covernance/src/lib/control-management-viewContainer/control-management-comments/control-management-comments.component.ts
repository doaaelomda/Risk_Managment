import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'lib-control-management-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './control-management-comments.component.html',
  styleUrl: './control-management-comments.component.scss',
})
export class ControlManagementCommentsComponent {
  riskChildId: any;
  riskId: any;
  riskTitle: string = '';
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _RiskService: RiskService,
    private _TranslateService: TranslateService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Control_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: '',
      },
    ]);
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((params: any) => {
          this.riskChildId = Number(params.get('id'));
        })
      )
      .subscribe();
    this._LayoutService.breadCrumbAction.next(null);
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
