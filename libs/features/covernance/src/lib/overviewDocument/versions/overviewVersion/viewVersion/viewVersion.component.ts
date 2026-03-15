import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { GovDocumentsService } from 'libs/features/covernance/src/service/covDocument.service';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';

@Component({
  selector: 'lib-view-version',
  imports: [CommonModule,SkeletonModule, TranslateModule,SystemActionsComponent],
  templateUrl: './viewVersion.component.html',
  styleUrl: './viewVersion.component.scss',
})
export class ViewVersionComponent {
  breadCrumbLinks: any;
  loadDataDocument: boolean = false;
  tabs: any[] = [];
  versionData: any;
  active_tab = 1;
  docId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _GovDocumentsService: GovDocumentsService
  ) {
    this.docId=this._ActivatedRoute.parent?.snapshot.params['versionId'];
    this.getByIdDocumnet();
  }
  getByIdDocumnet() {
    this.loadDataDocument = true;
    this._GovDocumentsService.getByIdVersion(this.docId).subscribe((docRes: any) => {
      this._GovDocumentsService.currentContentTypes.set(docRes.data.govDocumentContentTypes)


      this.versionData = docRes?.data;
      this.loadDataDocument = false;
    });
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }

}
