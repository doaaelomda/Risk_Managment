import { TranslationService } from './../../../../../../../apps/campagin-app/src/app/shared/services/translation.service';
import { SharedDescriptionComponent } from './../../../../../../shared/shared-ui/src/lib/shared-description/shared-description.component';
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
import { finalize } from 'rxjs';
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
import { TasksService } from 'libs/features/Management/src/services/tasks.service';
import { ComplianceService } from '../../../compliance/compliance.service';
import { OwnerUserComponent } from "libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component";
import { ImgSystemComponent } from 'libs/shared/shared-ui/src/lib/img-system/img-system.component';
@Component({
  selector: 'lib-view-finding',
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
    OwnerUserComponent,
    SharedDescriptionComponent,
    ImgSystemComponent
],
  templateUrl: './viewFinding.component.html',
  styleUrl: './viewFinding.component.scss',
})
export class ViewFindingComponent implements OnChanges {
  current_tab: number = 1;
  tabs: any[] = [];
  dataEntities: any[] = [];
  show_prop: boolean = false;
  fileUsageTypeId = input<any>();
  @Input() FindingData: any;
  relatedEntityId = input<any>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show_view']) {
      this.show_prop = changes['show_view'].currentValue;
    }
    if (changes['FindingData'] && this.FindingData) {
      this.handleUsersData();
    }
  }
  ngOnInit() {
    this.getEntityData();
    this.getTaskAttachments();
    this.getLookupData();
  }

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
  getEntityData() {
    const isAssigne = this.authId == 2;
    const isValidator = this.authId == 3;
    const isOwner = this.authId == 1;
    this.handleUsersData();
  }
  @Input({required:true})loading:boolean =false
  getFindingData() {
    const taskId = this.FindingData?.findingID;
    if (!taskId) return;
    this.loading = true
    this.complianceService.getByIdFindings(taskId).pipe((finalize(() => this.loading = false))).subscribe((res: any) => {
      const data = res?.data;
      this.FindingData = data;
      this.getEntityData();
      console.log('got task', res?.data);
    });
  }

  handleUsersData() {
    this.users = [];
    this.users.push(
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.ASSIGNEE_ROLE'
        ),
        id: this.FindingData?.assigneeRoleID,
        img: '',
        position: '',
        name: this.FindingData?.assigneeRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.ASSIGNEE_USER'
        ),
        id: this.FindingData?.assigneeUserID,
        img: '',
        position: '',
        name: this.FindingData?.assigneeUserName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.VERIFICATION_ROLE'
        ),
        id: this.FindingData?.verificationRoleID,
        img: '',
        position: '',
        name: this.FindingData?.verificationRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.VERIFICATION_USER'
        ),
        id: this.FindingData?.verificationUserID,
        img: '',
        position: '',
        name: this.FindingData?.verificationUserName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.FOLLOW_UP_ROLE'
        ),
        id: this.FindingData?.followUpRoleID,
        img: '',
        position: '',
        name: this.FindingData?.followUpRoleName,
      },
      {
        roleTypeName: this._TranslateService.instant(
          'MODAL_VIEW.FOLLOW_UP_USER'
        ),
        id: this.FindingData?.followUpUserID,
        img: '',
        position: '',
        name: this.FindingData?.followUpUserName,
      }
    );
  }
  actionBtns: any = [];
  getFindingById() {
    const findingID = this.FindingData?.findingID;
    this.complianceService.getByIdFindings(findingID).subscribe((res: any) => {
      this.actionBtns = res?.data;
      console.log(this.actionBtns, 'got actions');
    });
  }
  loadingData: boolean = false;
  show_view = input<boolean>(false);
  hide_emitter = output<boolean>();
  env: any;
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
  currentLanguage!:string
  constructor(
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _tasksService: TasksService,
    private complianceService: ComplianceService,
    private translationService:TranslationService
  ) {
    console.log(this.translationService.getSelectedLanguage(),'this.translationService.getSelectedLanguage()');

    this.currentLanguage = this.translationService.getSelectedLanguage().trim()
    this.env = enviroment.DOMAIN_URI;
    this.initAttachmentForm();
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
        id: 2,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-clip-file',
        router: 'attachments',
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment-alt',
        router: 'comments',
      },
    ];
    if (this.FindingData) {
      this.getFindingById();
    }
  }

  handleActionBtnClick(btn: any, findingID: any) {
    btn.isLoading = true;
    this._tasksService
      .updateTask(findingID, btn?.businessTaskTypeActionStatusTypeID)
      .subscribe((res) => {
        console.log('taskUpdated', res);
        this._MessageService.add({
          severity: 'success',
          detail: 'Task updated successfully',
        });
        btn.isLoading = false;
        this.getFindingData();
      });
  }
  getLookupData() {
    this._sharedService.lookUps([43, 53]).subscribe((res: any) => {
      this.classfications = res?.data?.DataClassification;
      this.fileTypes = res?.data?.FileType;
    });
  }
  initAttachmentForm() {
    this.attachment_form = new FormGroup({
      add_type: new FormControl('file'),
      FileTitle: new FormControl(null, Validators.required),
      DataClassificationID: new FormControl(null, Validators.required),
      FileTypeID: new FormControl(null, Validators.required),
      File: new FormControl(null, Validators.required),
      LinkUrl: new FormControl(null),
      IsVisibleInSearch: new FormControl(true, Validators.required),
    });
  }

  handleToogleFileLink() {
    if (this.attachment_form.get('add_type')?.value === 'file') {
      this.attachment_form.get('File')?.setValidators(Validators.required);
      this.attachment_form.get('LinkUrl')?.clearValidators();
    } else {
      this.attachment_form.get('File')?.clearValidators();
      this.attachment_form.get('LinkUrl')?.setValidators(Validators.required);
    }
    this.attachment_form.get('File')?.updateValueAndValidity();
    this.attachment_form.get('LinkUrl')?.updateValueAndValidity();
  }

  removeFile() {
    this.attachment_form.patchValue({
      File: null,
    });
  }

  handleAction() {
    if (this.activeTab === 1) {
      if (this.attachment_form.invalid) {
        this.attachment_form.markAllAsTouched();
        return;
      }

      this.loadingSave = true;

      const formData = new FormData();

      Object.keys(this.attachment_form.value).forEach((key) => {
        if (key != 'add_type') {
          if (this.attachment_form.get('add_type')?.value == 'file') {
            if (key != 'LinkUrl') {
              formData.append(key, this.attachment_form.get(key)?.value);
            }
            formData.append('FileOrLink', 'true');
          } else {
            if (key != 'File') {
              formData.append(key, this.attachment_form.get(key)?.value);
            }
            formData.append('FileOrLink', 'false');
          }
        }
      });

      formData.append('DataEnityTypeID', '21');
      formData.append('DataEnityID', this.FindingData?.findingID);
      formData.append('fileUsageTypeID', '21');

      this._sharedService.saveAttachment(formData).subscribe({
        next: (res: any) => {
          this.loadingSave = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Added Successfully',
          });
          this.initAttachmentForm();
          this.show_add_dailog = false;
          this.getTaskAttachments();
        },
        error: (err: any) => {
          this.loadingSave = false;
        },
      });
    }
  }

  current_risk_id: any;

  task_attachments: any[] = [];

  show_add_dailog: boolean = false;

  loadingState: boolean = false;
  getTaskAttachments() {
    this.loadingState = true;
    this._sharedService
      .getNewAttachment(21, this.FindingData?.findingID, 21)
      .subscribe((res) => {
        console.log('current Files', res);
        this.task_attachments = res?.data;
        this.loadingState = false;
      });
  }
  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: (res: any) => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
            });
            this.getTaskAttachments();
          },
          error: (err: any) => {},
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
          error: (err: any) => {},
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

  allUsers: any[] = [];
  getUserName(userID: number): string {
    const user = this.allUsers.find((u) => u.id === userID);
    return user ? user.userName : '-';
  }

  handleShowAdd(event: boolean) {
    if (event) {
      this.show_add_dailog = true;
    }
  }

  fileFilter: number = 1;
  handledToggleFilter() {
    this.getAllSearchFiles();
  }

  searchFiles: any[] = [];
  loadSearchState: boolean = false;
  initSelectForm() {
    this.select_form = new FormGroup({
      FileTitle: new FormControl(null, Validators.required),
    });
  }

  handleExistFile() {
    const selectedFile = this.searchFiles.find((file: any) => file.selected);
    if (!selectedFile) {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a file',
      });
      return;
    }
    if (this.select_form.invalid) {
      this.select_form.markAllAsTouched();
      return;
    }

    this.loadingSave = true;
    const req = {
      fileId: selectedFile.fileID,
      fileTitle: this.select_form.get('FileTitle')?.value,
      dataClassificationID: selectedFile.dataClassificationID,
      fileTypeID: selectedFile.fileTypeID,
      isVisibleInSearch: selectedFile.isVisibleInSearch,
      dataEntityTypeId: 21,
      dataEntityId: this.FindingData?.findingID,
    };
    this._sharedService.addExistFile(req).subscribe({
      next: (res: any) => {
        this.loadingSave = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attachment Added Successfully',
        });
        this.initSelectForm();
        this.getTaskAttachments();
        this.getAllSearchFiles();
        this.show_add_dailog = false;
      },
      error: (err: any) => {
        this.loadingSave = false;
      },
    });
  }
  // D:\Bayantouaz\GRCOrbitPlus-FrontEnd\GFW\libs\features\compliance\src\lib\pending-assesment-view-container\viewFinding\viewFinding.component.ts
  handleValidationExist(): boolean {
    const is_selected = this.searchFiles.some((file: any) => file.selected);
    if (this.select_form.valid && is_selected) {
      return false;
    } else {
      return true;
    }
  }
  FileTitleValidations: validations[] = [
    {
      key: 'required',
      message: 'Filte Title Is Required',
    },
  ];
  ClassificationValidations: validations[] = [
    {
      key: 'required',
      message: 'Classification Is Required',
    },
  ];
  FileTypeValidations: validations[] = [
    {
      key: 'required',
      message: 'Filte Type Is Required',
    },
  ];
  classfications: any[] = [];
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
  getAllSearchFiles(event?: any) {
    console.log('event', event);

    this.loadSearchState = true;
    const req = {
      dataEntityColumId: this.current_risk_id,
      dataEntityID: this.FindingData?.dataEntityTypeID,
      myFiles: this.fileFilter == 1 ? false : false,
      fileTitle: this.searchExistFilesTerm,
      pageNumber: event?.currentPage || 1,
      pageSize: event?.perPage || 10,
    };

    this._sharedService.getSearchFiles(req).subscribe((res: any) => {
      console.log('Search Files', res);
      this.searchFiles = res?.data?.items.map((file: any) => {
        return {
          ...file,
          selected: false,
        };
      });
      this._sharedService.paginationSubject.next({
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      });
      this.loadSearchState = false;
    });
  }
  handleSerachExistFiles(event: string) {
    this.searchExistFilesTerm = event;
    this.getAllSearchFiles();
  }

  riskTitle: string = '';

  searchExistFilesTerm: string = '';

  handleSelectFile(file: any) {
    this.searchFiles.map((f: any) => {
      f.selected = false;
    });
    file.selected = true;
  }

  handleUpdateTitle() {
    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(
        this.current_file_update.fileUsageID,
        this.current_title_update,
        21
      )
      .subscribe({
        next: (res) => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getTaskAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: (err) => {
          this.loadUpdate = false;
        },
      });
  }

  fileTest = {
    fileExtension: 'pdf',
    fileTitle: 'test demo',
    fileSize: 123456,
    uploadDateTime: new Date(),
  };

  iconMap: any = {
    pdf: 'images/Gradient - Full Width Label.svg',
    docx: 'images/wordfile.png',
    doc: 'images/wordfile.png',
    link: 'images/link-03.svg',
    xlsx: 'images/excelfile.png',
    xls: 'images/excelfile.png',
    png: 'images/png_images.png',
    jpeg: 'images/png_images.png',
    svg: 'images/svgFile.png',
    gif: 'images/gif.png',
    jpg: 'images/jpg.png',
  };
  getIcon(type: string) {
    return (
      this.iconMap[type?.replace('.', '').toLowerCase()] ||
      'images/iconFile.png'
    );
  }
}
