import { FileCardComponent } from './../../../../../../shared/shared-ui/src/lib/file-card/file-card.component';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';

@Component({
  selector: 'lib-view-document',
  imports: [CommonModule, SkeletonModule, TranslateModule,FileCardComponent,ViewAttachementComponent,SystemActionsComponent],
  templateUrl: './viewDocument.component.html',
  styleUrl: './viewDocument.component.scss',
})
export class ViewDocumentComponent {
  breadCrumbLinks: any;
  loadDataDocument: boolean = false;
  tabs: any[] = [];
  DocumentData: any;
  active_tab = 1;
  docId: any;
  displayModal:any
  selected_file_show:any
   currentLang = signal<string>('en');
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _riskService: RiskService,
    private _sharedService:SharedService,
    private translateServices:TranslationsService,
    public _translateS: TranslateService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.docId = res.get('Docid');
    });
      this.translateServices.selected_lan_sub.subscribe((lang ) => {this.currentLang.set(lang); console.log("currenmt Lang " , lang );
    } );
    this.getByIdDocumnet();
  }
  getByIdDocumnet() {
    this.loadDataDocument = true;
    this._riskService.getOneDoc(this.docId).subscribe((docRes: any) => {
      this.DocumentData = docRes?.data;
      this.loadDataDocument = false;
    });
  }

handleFileAction(event: any) {
  switch (event.action) {
    case 'Show':
      this._sharedService
        .getSingleAttachment(event.file)
        .subscribe({
          next: (res: any) => {
            if (res?.successOpration) {
              this.selected_file_show = res.data;
              this.displayModal = true;
            }
          },
        });
      break;

    case 'Download':
      this._sharedService.downloadAttachment(event.file).subscribe({
        next: (res: any) => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = event.file.fileTitle + '.' + event.file.fileExtension;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
      });
      break;
  }
}

handleHideView(visible: boolean) {
  this.displayModal = visible;
}

    hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }

}
