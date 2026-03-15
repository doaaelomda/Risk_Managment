import { SafeHtmlPipe } from './../../../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { Component, effect, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import {PdfPreviewComponent} from 'libs/shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { ReviewCommentsService } from 'libs/features/covernance/src/service/review_comments.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovDocumentsService } from 'libs/features/covernance/src/service/covDocument.service';
import { EditorComponent } from 'libs/shared/shared-ui/src/lib/editor/editor.component';
import { ContentTreeComponent } from '../contentTree/contentTree.component';
import { MenuModule } from 'primeng/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { EmptyStateFilesComponent } from "libs/shared/shared-ui/src/lib/empty-state-files/empty-state-files.component";
import { NoteEmptyComponent } from 'libs/shared/shared-ui/src/lib/note-empty/note-empty.component';
import { SharedFileViewerComponent } from "libs/shared/shared-ui/src/lib/shared-file-viewer/shared-file-viewer.component";
import { ImgSystemComponent } from "libs/shared/shared-ui/src/lib/img-system/img-system.component";
@Component({
  selector: 'lib-review-comments-asadmin',
  imports: [DatePipe, SafeHtmlPipe, SkeletonModule, CommonModule, PdfPreviewComponent, OwnerUserComponent, ReactiveFormsModule,
    ContentTreeComponent, MenuModule, DialogModule, TranslateModule, ButtonModule, SystemActionsComponent, NoteEmptyComponent, EmptyStateFilesComponent, SharedFileViewerComponent, ImgSystemComponent],
  templateUrl: './review-comments-asadmin.component.html',
  styleUrl: './review-comments-asadmin.component.scss',
})
export class ReviewCommentsAsadminComponent implements OnInit {

  constructor(private _ReviewCommentsService:ReviewCommentsService,private _SharedService:SharedService ,
     private _ActivatedRoute:ActivatedRoute, private _GovDocumentsService:GovDocumentsService,private _TranslateService:TranslateService){
        effect(() => {
      const types = this._GovDocumentsService.currentContentTypes();
      this.initTypes(types);
    });
         this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {
        },
      },
    ];
  }
    initTypes(currentTypes: any) {
    let types = [];
    const hasFileType = currentTypes.find(
      (type: any) => type.name === 'Upload File'
    );
    const hasFullTextType = currentTypes.find(
      (type: any) => type.name === 'Full Text'
    );
    const hasStructuredType = currentTypes.find(
      (type: any) => type.name === 'Structured Text'
    );
    if (hasFileType) {
      types.push({
        name: this._TranslateService.instant('USER_REVIEWS.FILE'),
        id: 1,
        icon: 'fi fi-rr-file-download',
      });
    }
    if (hasFullTextType) {
      types.push({
        name: this._TranslateService.instant('USER_REVIEWS.FULL_TEXT'),
        id: 2,
        icon: 'fi fi-rr-document',
      });
    }
    if (hasStructuredType) {
      types.push({
        name: this._TranslateService.instant('USER_REVIEWS.STRUCTURED_TEXT'),
        id: 3,
        image: '/images/icons/stru3.svg',
      });
    }
    this.content_types = types;
    if (!this.content_types.length) return;
    this.selected_type = this.content_types[0].id;
  }
  actions: any[] = [];

  content_types:any[]=[]

  current_version_id:any;
  env:any;
  content_form:any
  ngOnInit() {
    this.current_version_id = this._ActivatedRoute.parent?.snapshot.params['versionId'];
    this.env = enviroment.DOMAIN_URI;
    this.getAttachementFile();
    this.getReviwCommensAsAdmin()
     this._GovDocumentsService.getByIdEditor(this.current_version_id).subscribe((res:any)=>{
        this.InitialFormEditor(res?.data);
        this.content_form = res?.data
      })
  }


  current_file_version:any;
  getAttachementFile(){
    this._SharedService.getNewAttachment(87, +this.current_version_id,94).subscribe((res:any)=>{
      console.log(res);
      this.current_file_version = res?.data[0];
    })
  }

  editor_form!: FormGroup;
  InitialFormEditor(data?:any) {
    this.editor_form = new FormGroup({
      content: new FormControl(data, Validators.required),
    });
  }
  loading_notes:boolean = false;
  showViewOptionPopup:boolean=false

  getReviwCommensAsAdmin(){
    this.loading_notes = true;
    this._ReviewCommentsService.getReviewCommentsAsAdmin(100 , 1 , this.current_version_id).pipe(finalize(()=> this.loading_notes = false)).subscribe({
      next:(res:any)=>{
        this.current_notes_comments = res?.data?.items;
      }
    })
  }


  current_notes_comments:any[]=[]

  selected_type!:number
  current_note:any
  addModule(event:any){
    this.showViewOptionPopup=true
    this._ReviewCommentsService.getReviewCommentsAsAdminById(event).subscribe((res:any)=>{
      this.current_note=res?.data
    })
  }

}
