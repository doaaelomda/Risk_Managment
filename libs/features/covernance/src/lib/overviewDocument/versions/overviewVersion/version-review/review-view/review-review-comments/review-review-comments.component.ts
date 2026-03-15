import { UserProfileService } from './../../../../../../../../../setting/src/services/user-profile.service';
import { SafeHtmlPipe } from 'apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { PdfPreviewComponent } from 'libs/shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { ReviewCommentsService } from 'libs/features/covernance/src/service/review_comments.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GovDocumentsService } from 'libs/features/covernance/src/service/covDocument.service';
import { EditorComponent } from 'libs/shared/shared-ui/src/lib/editor/editor.component';
import { ContentTreeComponent } from '../../../contentTree/contentTree.component';
import { MenuModule } from 'primeng/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { GovUserReviewsService } from 'libs/features/covernance/src/service/gov-user-reviews.service';
import { DocsPreviewComponent } from 'libs/shared/shared-ui/src/lib/docs-preview/docs-preview.component';
import { EmptyStateFilesComponent } from 'libs/shared/shared-ui/src/lib/empty-state-files/empty-state-files.component';
import { NoteEmptyComponent } from 'libs/shared/shared-ui/src/lib/note-empty/note-empty.component';
import { ImgSystemComponent } from "libs/shared/shared-ui/src/lib/img-system/img-system.component";
import { SharedFileViewerComponent } from "libs/shared/shared-ui/src/lib/shared-file-viewer/shared-file-viewer.component";

@Component({
  selector: 'lib-review-review-comments',
  imports: [
    DatePipe,
    SafeHtmlPipe,
    SkeletonModule,
    CommonModule,
    PdfPreviewComponent,
    OwnerUserComponent,
    ReactiveFormsModule,
    ContentTreeComponent,
    MenuModule,
    DialogModule,
    TranslateModule,
    ButtonModule,
    SystemActionsComponent,
    DocsPreviewComponent,
    EmptyStateFilesComponent,
    NoteEmptyComponent,
    ImgSystemComponent,
    SharedFileViewerComponent
],
  templateUrl: './review-review-comments.component.html',
  styleUrl: './review-review-comments.component.scss',
})
export class ReviewReviewCommentsComponent {
  constructor(
    private _ReviewCommentsService: ReviewCommentsService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _GovDocumentsService: GovDocumentsService,
    private _TranslateService: TranslateService,
    private govUserReviewsService: GovUserReviewsService,
    private userProfileService: UserProfileService
  ) {

    this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {},
      },
    ];
  }
  actions: any[] = [];
  active: 'all' | 'my' = 'my';

  content_types: any[] = [
    {
      id: 1,
      name: 'Upload File',
      img_path: '/images/icons/download1.svg',
    },
    {
      id: 2,
      name: 'Full Text',
      img_path: '/images/icons/full2.svg',
    },
    {
      id: 3,
      name: 'Structured Text',
      img_path: '/images/icons/stru3.svg',
    },
  ];

  currentReviewId: any;
  env: any;
  content_form: any;
  currentVersionId: any;
  ngOnInit() {
    this.currentReviewId =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    this.currentVersionId =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('versionId');
    this.env = enviroment.DOMAIN_URI;
    this.getAttachementFile();
    this.getReviwCommensAsAdmin();
    this._GovDocumentsService
      .getByIdEditor(this.currentVersionId)
      .subscribe((res: any) => {
        this.InitialFormEditor(res?.data);
        this.content_form = res?.data;
      });
  }

  current_file_version: any;
  getAttachementFile() {
    this._SharedService
      .getNewAttachment(87, +this.currentVersionId, 94)
      .subscribe((res: any) => {
        console.log(res);
        this.current_file_version = res?.data[0];
      });
  }

  editor_form!: FormGroup;
  InitialFormEditor(data?: any) {
    this.editor_form = new FormGroup({
      content: new FormControl(data, Validators.required),
    });
  }
  loading_notes: boolean = false;
  showViewOptionPopup: boolean = false;

  getReviwCommensAsAdmin() {
    this.loading_notes = true;
    this.govUserReviewsService
      .getComments(this.currentReviewId, this.currentVersionId)
      .pipe(finalize(() => (this.loading_notes = false)))
      .subscribe({
        next: (res: any) => {
          this.current_notes_comments = res?.data?.items;
          this.getUserData();

        },
      });
  }

  current_notes_comments: any[] = [];

  selected_type: number = 1;
  current_note: any;
  addModule(event: any) {
    this.showViewOptionPopup = true;
    this._ReviewCommentsService
      .getReviewCommentsAsAdminById(event)
      .subscribe((res: any) => {
        this.current_note = res?.data;
      });
  }

  myComments: any[] = [];
  handleCurrentUserComments(comments: any[] = []) {
    if (!this.userData) return;
    const userComments = comments.filter(
      (comment) => +comment.reviewCommentUserId === +this.userData.id
    );
    this.myComments = userComments ?? [];

    console.log('All comments: ',comments);
    console.log('My comments: ',this.myComments);
    console.log('User Data: ',this.userData);

  }
  userData: any;
  getUserData() {
    this.userProfileService.getUserData().subscribe({
      next: (res) => {
        this.userData = res;
        this.handleCurrentUserComments(this.current_notes_comments);
      },
    });
  }
}
