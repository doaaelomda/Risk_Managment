import { AssetsService } from './../../../../../../../Assets/src/services/assets.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

@Component({
  selector: 'lib-comment-version',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentVersion.component.html',
  styleUrl: './commentVersion.component.scss',
})
export class CommentVersionComponent {
  breadCrumb: any[] = [];
  riskId = 1;
  riskChildId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
  ) {
    this.initData();
  }

  private initData(): void {

    this.riskChildId = this._ActivatedRoute.parent?.snapshot.params['versionId'];
  }
}
