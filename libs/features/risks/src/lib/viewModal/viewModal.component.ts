import { answer } from './../../../../../../apps/Questionnaire/src/models/answers.interface';
import { TasksService } from './../../../../Management/src/services/tasks.service';
import { TagComponent } from './../../../../../shared/shared-ui/src/lib/tag/tag.component';
import {
  Component,
  Input,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import {
  AttachUiComponent,
  InputSearchComponent,
  NewAttachListComponent,
  PaginationComponent,
} from '@gfw/shared-ui';
import { SkeletonModule } from 'primeng/skeleton';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { SharedLinkedModuleComponent } from 'libs/shared/shared-ui/src/lib/shared-linkedModule/shared-linkedModule.component';
import { ImgSystemComponent } from 'libs/shared/shared-ui/src/lib/img-system/img-system.component';
@Component({
  selector: 'lib-view-modal',
  imports: [
    ProgressBarModule,
    CommonModule,
    ReactiveFormsModule,
    AttachUiComponent,
    MenuModule,
    DialogModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    CommentSectionComponent,
    TranslateModule,
    DialogModule,
    SkeletonModule,
    PaginationComponent,
    InputTextComponent,
    InputSearchComponent,
    RadioButtonModule,
    NewAttachListComponent,
    FormsModule,
    TagComponent,
    AttachmentsUiComponent,
    EditAttachmentComponent,
    ViewAttachementComponent,
    SharedLinkedModuleComponent,
    ImgSystemComponent
  ],
  templateUrl: './viewModal.component.html',
  styleUrl: './viewModal.component.css',
})
export class ViewModalComponent implements OnChanges {
  current_tab: number = 1;
  tabs: any[] = [];
  dataEntities: any[] = [];
  show_prop: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    const singleTaskDataChanges = changes['singleTaskData'];
    if (changes['show_view']) {
      this.show_prop = changes['show_view'].currentValue;

      if (singleTaskDataChanges && this.singleTaskData) {
        this.handleUsersData();
      }
    }
if (
  singleTaskDataChanges?.currentValue
) {
  console.log(singleTaskDataChanges, 'changes');
  this.getAttachments();
}
  }
  isDescExpandedSuccess: boolean = false;

  ngOnInit() {
    this.getEntityData();
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
  users: any = [];

  isDescExpanded = false;
  description = '';
  toggleReadMore() {
    this.isDescExpanded = !this.isDescExpanded;
  }
  themeMap: Record<
    string,
    { bg: string; text: string; icon: string; wrapColor: string }
  > = {
    green: {
      bg: '#D1FADF',
      text: '#027A48',
      icon: '#12B76A',
      wrapColor: '#F6FEF9',
    },
    red: {
      bg: '#FEE4E2',
      text: '#B42318',
      icon: '#B42318',
      wrapColor: '#FFFBFA',
    },
    brown: {
      bg: '#FEF0C7',
      text: '#B54708',
      icon: '#B54708',
      wrapColor: '#FFFCF5',
    },
    default: {
      bg: '',
      text: '',
      icon: '',
      wrapColor: '',
    },
  };

  getTheme(theme: string) {
    return this.themeMap[theme] || this.themeMap['default'];
  }
  @Input() authId: any = '';
  @Input() BusinessTaskTypeID: any = '';
  @Input() relatedEntityId: any = '';

  private _fileUsageTypeId: any;

  @Input() set fileUsageTypeId(value: any) {
    if (typeof value === 'function') {
      this._fileUsageTypeId = value();
    } else {
      this._fileUsageTypeId = value;
    }
  }
  get fileUsageTypeId() {
    return this._fileUsageTypeId;
  }
  getEntityData() {
    const isAssigne = this.authId == 2;
    const isValidator = this.authId == 3;
    const isOwner = this.authId == 1;
    this.handleUsersData();
    this.getBusinessTasksActions(
      this.BusinessTaskTypeID,
      this.singleTaskData?.businessTaskWFStatusTypeID,
      isOwner,
      isAssigne,
      isValidator
    );
  }

  getSingleTaskData() {
    const taskId = this.singleTaskData?.businessTaskID;
    if (!taskId) return;
    this._tasksService.getTaskById(taskId).subscribe((res: any) => {
      const data = res?.data;
      this.singleTaskData = data;

      this.getEntityData();
      console.log('got task', res?.data);
      this.getAttachments();
    });
  }

  handleUsersData() {
    this.users = [];
    this.users.push(
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.ASSIGNEE_ROLE'
        ),
        id: this.singleTaskData?.assigneeRoleID,
        name: this.singleTaskData?.assigneeRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.ASSIGNEE_USER'
        ),
        id: this.singleTaskData?.assigneeUserID,
        name: this.singleTaskData?.assigneeUserName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.VERIFICATION_ROLE'
        ),
        id: this.singleTaskData?.verificationRoleID,
        name: this.singleTaskData?.verificationRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.VERIFICATION_USER'
        ),
        id: this.singleTaskData?.verificationUserID,
        name: this.singleTaskData?.verificationUserName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.FOLLOW_UP_ROLE'
        ),
        id: this.singleTaskData?.followUpRoleID,
        name: this.singleTaskData?.followUpRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.FOLLOW_UP_USER'
        ),
        id: this.singleTaskData?.followUpUserID,
        name: this.singleTaskData?.followUpUserName,
      }
    );
  }
  actionBtns: any = [];
  getBusinessTasksActions(
    businessTaskTypeID: any,
    BusinessTaskStatusActionID: any,
    forBusinessTaskOwner: boolean,
    forAssignee: boolean,
    forValidator: boolean
  ) {
    this.actionBtns = [];
    this._tasksService
      .getBusinessTasksActions(
        businessTaskTypeID,
        BusinessTaskStatusActionID,
        forBusinessTaskOwner,
        forAssignee,
        forValidator
      )
      .subscribe((res: any) => {
        this.actionBtns = res?.data;
        console.log(this.actionBtns, 'got actions');
      });
  }

  loadingData: boolean = false;
  show_view = input<boolean>(false);

  hide_emitter = output<boolean>();
  env: any;
  constructor(
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _tasksService: TasksService
  ) {
    this.env = enviroment.DOMAIN_URI;
    this.initSelectForm();

    this.tabs_files = [
      { id: 1, name: this._TranslateService.instant('TABS.ADD_NEW_FILE') },
      { id: 2, name: this._TranslateService.instant('TABS.EXIST_FILE') },
    ];

    this.tabs = [
      { id: 1, name: this._TranslateService.instant('TABS.ADD_NEW_FILE') },
      { id: 2, name: this._TranslateService.instant('TABS.EXIST_FILE') },
    ];

    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
             {
    id:6,
    name:  this._TranslateService.instant("TABS.LINKED_MODULES"),
    router:'linkedModules',
    icon:"fi fi-rr-link-alt"
  },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-clip-file',
        router: 'attachments',
      },

      {
        id: 3,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi-rr-comment',
        router: 'comments',
      },
    ];
  }

  isAllDisabled: boolean = false;

  handleActionBtnClick(btn: any, businessTaskID: any) {
    btn.isLoading = true;
    this.isAllDisabled = true;
    this._tasksService
      .updateTask(businessTaskID, btn?.businessTaskTypeActionStatusTypeID)
      .subscribe((res) => {
        console.log('taskUpdated', res);
        this._MessageService.add({
          severity: 'success',
          detail: 'Task updated successfully',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
  }

  activeTab: number = 1;

  tabs_files: any[] = [];
  loadingSave: boolean = false;

  displayModal: boolean = false;

  selected_file_show: any;

  loadUpdate: boolean = false;

  current_title_update: string = '';
  current_file_update: any;
  edit_file_name: boolean = false;
  attachment_form!: FormGroup;
  select_form!: FormGroup;

  current_risk_id: any;

  task_attachments: any[] = [];

  show_add_dailog: boolean = false;

  loadingState: boolean = false;
  @Input() singleTaskData: any;

  handleShowAdd(event: boolean) {
    if (event) {
      this.show_add_dailog = true;
    }
  }

  searchFiles: any[] = [];
  loadSearchState: boolean = false;
  initSelectForm() {
    this.select_form = new FormGroup({
      FileTitle: new FormControl(null, Validators.required),
    });
  }

  fileTypes: any[] = [];
  deleteComment(message: any) {
    this._sharedService
      .deleteComment(message.commentID, this.riskId)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }
  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._sharedService
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
  mitigationPlan: any;

  riskId: any;

  riskTitle: string = '';

  attachments: any[] = [];

  getAttachments() {
    this.loadingState = true;
    this._sharedService
      .getNewAttachment(
        this.relatedEntityId,
        this.singleTaskData?.businessTaskID,
        this.fileUsageTypeId
      )
      .subscribe({
        next: (res: any) => {
          this.attachments = res?.data;
          this.loadingState = false;
        },
      });
  }

  handleAdded(event: any) {
    if (event) {
      this.getAttachments();
    }
    this.show_add_dailog = false;
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
            this.getAttachments();
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getAttachments();
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
