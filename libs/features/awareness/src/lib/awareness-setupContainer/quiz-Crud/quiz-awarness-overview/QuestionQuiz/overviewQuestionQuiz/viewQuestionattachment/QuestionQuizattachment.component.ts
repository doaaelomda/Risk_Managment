import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  AttachUiComponent,
  InputSearchComponent,
  NewAttachListComponent,
  PaginationComponent,
} from '@gfw/shared-ui';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputGroupModule } from 'primeng/inputgroup';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { forkJoin, of, switchMap, take, tap } from 'rxjs';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { QuestionService } from 'libs/features/questionnaire/src/Service/question.service';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
@Component({
  selector: 'lib-question-quizattachment',
  imports: [
      TranslateModule,
    InputTextModule,
    ViewAttachementComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    FormsModule,
    EditAttachmentComponent,
  ],
  templateUrl: './QuestionQuizattachment.component.html',
  styleUrl: './QuestionQuizattachment.component.scss',
})
export class QuestionQuizattachmentComponent implements OnInit {
  questionId: any;
  dataQuestion: any;
  id: any;
  campaignResData: any;
  controlAssessmentID: any;
  risks_attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  quizId:any
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _riskService: RiskService,
    private _sharedService: SharedService,
    private complianceService: ComplianceService,
    private _AwarenessService: AwarenessService
  ) {
    this.env = enviroment.DOMAIN_URI;
    this._ActivatedRoute?.parent?.paramMap.subscribe((params) => {
      this.questionId = params.get('questionId');
         this.quizId = params.get('quizId');
      this.id = params.get('id');
      if (this.id) {
        this.getRisksAttachments();
        this._ActivatedRoute?.parent?.paramMap
          .pipe(take(1))
          .subscribe((params) => {
            this.questionId = params.get('questionId');
            const quiz$ = this.questionId
              ? this._AwarenessService.getQuestionQuizById(this.questionId)
              : of({ data: { name: '-' } });
                 const campaign$ = this.id
        ? this._AwarenessService.getQuizById(this.id)
        : of({ data: { name: '-' } });
            forkJoin([quiz$,campaign$]).subscribe(([quizRes, campaignRes]: any) => {
              this.dataQuestion = quizRes?.data || { name: '-' };
              this.campaignResData = campaignRes?.data;
              const breadcrumbLinks = [
                { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
                {
                  name: this._TranslateService.instant('AWARENESS.TITLE'),
                  icon: '',
                  routerLink: '/gfw-portal/awareness/campaign-list',
                },
                {
                  name: this._TranslateService.instant(
                    'OPTION_QUESTION.option'
                  ),
                  icon: '',
                  routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz`,
                },
                {
                  name:
                    this._sharedService.truncateWords(
                      this.dataQuestion.questionText,
                      3
                    ) || '-',
                  icon: '',
                              routerLink:`/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz/${this.questionId}/overview`

                },
                {
                  name: this._TranslateService.instant('TABS.ATTACHMENTS'),
                  icon: '',
                },
              ];

              this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
            });
          });

        console.log(this.questionId, 'this.questionId from service');
      }
    });
  }

  env: any;

  ngOnInit(): void {
    this.getRisksAttachments();
  }


  getRisksAttachments() {
    this.loadingState = true;
    if (this.questionId) {
      this._sharedService
        .getNewAttachment(60, +this.questionId,60)
        .subscribe({
          next: (res: any) => {
            this.risks_attachments = res?.data;
            this.loadingState = false;
          },
        });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedService.getNewAttachment(60, +this.questionId,60)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.risks_attachments = res?.data;
            this.loadingState = false;
          },
        });
    }
  }

  handleAdded(event: any) {
    if (event) {
      this.getRisksAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
            });
            this.getRisksAttachments();
          },
        });
        break;

      case 'Download':
        this._sharedService.downloadAttachment(event.file.fileID).subscribe({
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

      case 'Show':
        this._sharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
        break;
      case 'Edit':
        this.edit_file_name = true;
        this.current_title_update = event.file.fileTitle;
        this.current_file_update = event.file;
        break;

      default:
        break;
    }
  }

  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle,60)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getRisksAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: () => {
          this.loadUpdate = false;
        },
      });
  }

  handleHideView(event: boolean) {
    this.displayModal = event;
  }
}
