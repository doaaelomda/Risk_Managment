import {
  IElement,
  SharedContentTreeComponent,
} from './../../../../../shared/shared-ui/src/lib/shared-content-tree/shared-content-tree.component';
import { SharedFileViewerComponent } from './../../../../../shared/shared-ui/src/lib/shared-file-viewer/shared-file-viewer.component';
import { IFile } from './../../../../../../apps/gfw-portal/src/app/core/models/file.interface';
/* eslint-disable @nx/enforce-module-boundaries */
import { IAction } from './../../../../../../apps/gfw-portal/src/app/core/models/action.interface';
import { INote } from './../../../../../../apps/gfw-portal/src/app/core/models/NoteType.interface';
import { DocumentTypeInterface } from '../../../../../../apps/gfw-portal/src/app/core/models/DocumentType.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateModule,
  TranslateService,
  isArray,
} from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Button } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { GovUserReviewsService } from '../../service/gov-user-reviews.service';
import { finalize, map, Observable, tap } from 'rxjs';
import { SafeHtmlPipe } from 'apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { DialogModule } from 'primeng/dialog';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from 'libs/features/auth/src/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { Nl2BrPipe } from 'apps/gfw-portal/src/app/core/pipes/preLine.pipe';
import { ImgSystemComponent } from "libs/shared/shared-ui/src/lib/img-system/img-system.component";
interface IVersion {
  govDocumentReviewID: number;
  govDocumentVersionID: number;
  govDocumentVersionName: string;
  scope: string;
  govDocumentReviewReviewerTypeID: number;
  reviewerUserID: number;
  reviewerUserName: string;
  reviewerRoleID: null;
  reviewerRoleName: null;
  reviewStartDate: string;
  reviewDueDate: string;
  govDocumentReviewStatusTypeID: number;
  reviewStatusTypeName: string;
  reviewCompletionDate: string;
  overallFeedback: string;
}
@Component({
  selector: 'lib-gov-user-reviews',
  imports: [
    CommonModule,
    TranslateModule,
    CheckboxModule,
    FormsModule,
    RadioButtonModule,
    SelectButtonModule,
    OverlayPanelModule,
    Button,
    SharedFileViewerComponent,
    SharedContentTreeComponent,
    SafeHtmlPipe,
    DialogModule,
    UiDropdownComponent,
    DatePackerComponent,
    TextareaUiComponent,
    ReactiveFormsModule,
    SkeletonModule,
    InputTextModule,
    Nl2BrPipe,
    ImgSystemComponent
],
  templateUrl: './gov-user-reviews.component.html',
  styleUrl: './gov-user-reviews.component.scss',
})
export class GovUserReviewsComponent {
  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private govUserReviewsService: GovUserReviewsService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private _Router:Router
  ) {
    this.userId = +this.authService.current_login_user_data.value.userId;
    this.initActions();
    this.initTypes();
    this.initNotesOptions();
  }
  userId!: number;
  isApproval: boolean = false;
  reviewId!:number
  ngOnInit() {
    this.isApproval = this.route.snapshot.url[0].path === 'gov-approval';

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.reviewId = +id
    this.getReviewDetails(+id);
    this.getLookUps();
  }

  initTypes() {
    this.types = [
      {
        name: this.translateService.instant('USER_REVIEWS.FILE'),
        id: 1,
        icon: 'fi fi-rr-file-download',
      },
      {
        name: this.translateService.instant('USER_REVIEWS.FULL_TEXT'),
        id: 2,
        icon: 'fi fi-rr-document',
      },
      {
        name: this.translateService.instant('USER_REVIEWS.STRUCTURED_TEXT'),
        id: 3,
        image: '/images/icons/stru3.svg',
      },
    ];
  }

  initNotesOptions() {
    this.notesOptions = [
      {
        label: this.translateService.instant('USER_REVIEWS.ALL_NOTES'),
        value: 1,
      },
      {
        label: this.translateService.instant('USER_REVIEWS.MY_NOTES'),
        value: 2,
      },
    ];
  }
  selectedNote!: INote;
  initActions() {
    this.actions = [
      {
        label: this.translateService.instant('USER_REVIEWS.UPDATE_NOTE'),
        id: 1,
        command: () => {
          console.log(this.selectedNote, 'updating...');
        },
      },
      {
        label: this.translateService.instant('USER_REVIEWS.DELETE_NOTE'),
        id: 2,
        command: () => {
          console.log(this.selectedNote, 'deleting...');
        },
      },
    ];
  }
  selected_type!: number;
  types: DocumentTypeInterface[] = [];
  notesOptions: { label: string; value: number }[] = [];
  viewedNotes: number = 1;
  notes: INote[] = [];

  myNotes: INote[] = [];

  actions: IAction[] = [];

  deleteControl(controlId: number, note: INote) {
    console.log('deleted control: ', controlId);
    console.log('from note: ', note);
  }
  sendingNoteMessage: boolean = false;
  noteMsg!: string;

  sendNoteMessage() {
    if (!this.noteMsg) return;
    // this.sendingNoteMessage = true
    console.log('sending: ', this.noteMsg);
  }

  fullText!: string;

  files!: IFile[];

  structuredText!: IElement[];
  currentSelectedNode!: IElement | null;
  onNodeSelected(node: IElement) {
    this.currentSelectedNode = node;
    console.log(node, 'selected node here');
  }
  data!: any;
  loading: boolean = false;
  getReviewDetails(id: number) {
    this.loading = true;
    // this.govUserReviewsService
    //   .getReviewDetails(id)
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe({
    //     next: (res) => {
    //       if (res && typeof res === 'object' && 'data' in res) {
    //         this.data = res.data as IVersion;
    //       }
    //       this.setActiveType(1);
    //       this.getComments();
    //       console.log(res, ' got review details ');
    //     },
    //   });


    const API$ = this.isApproval ? this.govUserReviewsService.getApprovalDetails(id) : this.govUserReviewsService.getReviewDetails(id);

    API$.pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res) => {
        if (res && typeof res === 'object' && 'data' in res) {
          this.data = res.data as IVersion;
        }
        this.setActiveType(1);
        this.getComments();
        console.log(res, ' got details ');
      },
    });

  }
  getFiles(): Observable<IFile[]> {
    return this.govUserReviewsService
      .getFiles(this.data.govDocumentVersionID, 87, 94)
      .pipe(
        tap((res: any) => {
          if (res && typeof res === 'object' && 'data' in res) {
            this.files = res.data as IFile[];
          }
          console.log(res, 'got files');
        })
      );
  }

  loadingText: boolean = false;
  getFullText(): Observable<string> {
    this.loadingText = true;
    return this.govUserReviewsService
      .getFullText(this.data.govDocumentVersionID)
      .pipe(
        finalize(() => (this.loadingText = false)),
        tap((res: any) => {
          if (res && typeof res === 'object' && 'data' in res) {
            this.fullText = res.data as string;
          }
          console.log(res, 'got full text');
        }),
        map((res) =>
          res && typeof res === 'object' && 'data' in res
            ? (res.data as string)
            : ''
        )
      );
  }

  loadingTree: boolean = false;
  getTree(): Observable<IElement[]> {
    this.loadingTree = true;
    return this.govUserReviewsService
      .getTree(this.data.govDocumentVersionID)
      .pipe(
        finalize(() => (this.loadingTree = false)),
        tap((res: any) => {
          if (res && typeof res === 'object' && 'data' in res) {
            this.structuredText = res.data as IElement[];
          }
        }),
        map((res) =>
          res && typeof res === 'object' && 'data' in res
            ? (res.data as IElement[])
            : []
        )
      );
  }

  setActiveType(type_id: number) {
    if (!this.data) return;
    this.currentSelectedNode = null;
    switch (type_id) {
      case 1: {
        this.selected_type = type_id;
        if (this.files) return;
        this.getFiles().subscribe();
        break;
      }

      case 2: {
        this.selected_type = type_id;
        if (this.fullText) return;
        this.getFullText().subscribe();
        break;
      }

      case 3: {
        this.selected_type = type_id;
        if (this.structuredText) return;
        this.getTree().subscribe();
        break;
      }

      default: {
        break;
      }
    }
  }

  addingComment: boolean = false;
  addComment() {
    this.addingComment = true;
    this.initCommentForm();
  }
  commentForm!: FormGroup;
  initCommentForm() {
    if (!this.data) return;
    this.commentForm = new FormGroup({
      govDocumentReviewID: new FormControl(this.data.govDocumentReviewID),
      govDocumentElementID: new FormControl(
        this?.currentSelectedNode?.id ?? null
      ),
      commentText: new FormControl(null),
      govDocumentReviewCommentSeverityLevelID: new FormControl(null),
      // govDocumentReviewCommentStatusTypeID: new FormControl(null),
    });
  }
  submittingComment: boolean = false;
  submitComment() {
    if (this.commentForm.invalid) return;
    this.submittingComment = true;
    const comment = this.commentForm.value;
    this.govUserReviewsService
      .submitComment(comment)
      .pipe(finalize(() => (this.submittingComment = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Comment added successfully..',
          });
          this.addingComment = false;
          this.commentForm.reset();
          this.getComments();

          console.log(' comment submitted');
        },
      });
  }

  severities!: unknown[];
  statuses!: unknown[];
  getLookUps() {
    this.sharedService.lookUps([213, 212]).subscribe({
      next: (res) => {
        console.log(res, ' got lookups...');
        this.severities = res.data.GovDocumentReviewCommentSeverityLevel;
        this.statuses = res.data.GovDocumentReviewCommentStatusType;
      },
    });
  }

  getComments() {
    this.govUserReviewsService
      .getComments(
        this.data.govDocumentReviewID,
        this.data.govDocumentVersionID
      )
      .subscribe({
        next: (res) => {
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'items' in res.data
          ) {
            const notes = res.data.items as INote[];
            const sortedNotes = notes.sort(
              (a: INote, b: INote) =>
                new Date(b.resolvedDate).getTime() -
                new Date(a.resolvedDate).getTime()
            );
            this.notes = sortedNotes;
            this.myNotes = sortedNotes.filter(
              (note) => note.reviewCommentUserId === this.userId
            );
          }
          console.log(res, 'got comments');
        },
      });
  }

  sendingReview: boolean = false;

  feedback!: string;
  sendReview() {
    if (this.isApproval) return;
    this.sendingReview = true;
  }
  submittingReview: boolean = false;
  submitReview() {
    if (!this.feedback || this.isApproval) return;
    this.submittingReview = true;
    this.govUserReviewsService
      .submitFeedback(this.data.govDocumentReviewID, this.feedback)
      .pipe(finalize(() => (this.submittingReview = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Review sent successfully...',
          });
          this.sendingReview = false;
          this._Router.navigate(['/gfw-portal/management/tasks'])
        },
      });
  }

  sendingApproval: boolean = false;

  options: { id: number; name: string; icon:string }[] = [
    {
      id: 2,
      name: 'Approved',
      icon:'fi fi-rr-checkbox'
    },
    {
      id: 3,
      name: 'Rejected',
      icon:'fi fi-rr-vote-nay'
    },
  ];
  submittingApproval: boolean = false;
  sendApproval() {
    if (!this.isApproval) return;
    this.sendingApproval = true;
  }
  approvalForm: FormGroup = new FormGroup({
    notes: new FormControl(null, Validators.required),
    statusTypeID: new FormControl(2),
  });
  submitApproval() {
    if (this.approvalForm.invalid || !this.isApproval) return;
        this.submittingApproval = true;
    this.govUserReviewsService
      .submitApproval({...this.approvalForm.value,approvalID:this.reviewId})
      .pipe(finalize(() => (this.submittingApproval = false)))
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Approval sent successfully...',
          });
          this.sendingApproval = false;
        },
      });
  }

  setStatusType(type:number){
    this.approvalForm.get('statusTypeID')?.setValue(type)
  }
}
