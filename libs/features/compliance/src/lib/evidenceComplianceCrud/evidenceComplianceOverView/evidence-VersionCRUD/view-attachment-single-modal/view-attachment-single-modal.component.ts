import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AttachUiComponent,
  InputSearchComponent,
  PaginationComponent,
} from '@gfw/shared-ui';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-attachment-single-modal',
  imports: [
    CommonModule,
    InputSearchComponent,
    AttachUiComponent,
    PaginationComponent,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    SkeletonModule,
    FormsModule,
  ],
  templateUrl: './view-attachment-single-modal.component.html',
  styleUrl: './view-attachment-single-modal.component.scss',
})
export class ViewAttachmentSingleModalComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _riskService: RiskService,
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this.env = enviroment.DOMAIN_URI;
    this.initSelectForm();
    this.getLookupData();
    this.initAttachmentForm();
    this.getAllSearchFiles();
    this.tabs = [
      { id: 1, name: this._TranslateService.instant('TABS.ADD_NEW_FILE') },
      { id: 2, name: this._TranslateService.instant('TABS.EXIST_FILE') },
    ];
  }
  env: any;
  @Output() fileSelectedEmitter = new EventEmitter<any>();
  @Input() dataEnityId: any;
  add_type: string = 'file';

  risks_attachments: any[] = [];
  getRisksAttachments() {
    this.loadingState = true;
    if (this.dataEnityId) {
      this._sharedService
        .getNewAttachment(64, +this.dataEnityId, 64)
        .subscribe({
          next: (res: any) => {
            console.log('current Files', res);

            // this.risks_attachments = res?.data;
            this.loadingState = false;
          },
          error: (err: any) => {},
        });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap((params) =>
            this._sharedService.getNewAttachment(64, +this.dataEnityId, 64)
          )
        )
        .subscribe({
          next: (res: any) => {
            console.log('current Files', res);
            // this.risks_attachments = res?.data;
            this.loadingState = false;
            this._ActivatedRoute.parent?.paramMap;
          },
          error: (err: any) => {},
        });
    }
  }
  riskTitle: string = '';

  searchExistFilesTerm: string = '';

  handleSerachExistFiles(event: string) {
    this.searchExistFilesTerm = event;
    this.getAllSearchFiles();
  }

  handleSelectFile(file: any) {
    this.searchFiles.map((f: any) => {
      f.selected = false;
    });
    file.selected = true;
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
      // fileTypeID: selectedFile.fileTypeID,
      isVisibleInSearch: selectedFile.isVisibleInSearch,
      dataEntityTypeId: 64,
      dataEntityId: this.dataEnityId,
    };

    this._sharedService.addExistFile(req).subscribe({
      next: () => {
        this.loadingSave = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attachment Added Successfully',
        });
        this.initSelectForm();
        this.getAllSearchFiles();
        // this.added.emit(true);
        this.show_add_dailog = false;
      },
      error: () => {
        this.loadingSave = false;
      },
    });
  }

  handleValidationExist(): boolean {
    const is_selected = this.searchFiles.some((file: any) => file.selected);
    if (this.select_form.valid && is_selected) {
      return false;
    } else {
      return true;
    }
  }

  handledToggleFilter() {
    this.getAllSearchFiles();
  }

  searchFiles: any[] = [];
  loadSearchState: boolean = false;
  getAllSearchFiles(event?: any) {
    console.log('event', event);

    this.loadSearchState = true;
    const req = {
      dataEntityId: this.dataEnityId,
      dataEntityTypeId: 64,
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

  activeTab: number = 1;

  tabs: any[] = [];

  classfications: any[] = [];
  // fileTypes: any[] = [];

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

  attachment_form!: FormGroup;
  select_form!: FormGroup;

  initAttachmentForm() {
    this.attachment_form = new FormGroup({
      add_type: new FormControl('file'),
      FileTitle: new FormControl(null, Validators.required),
      DataClassificationID: new FormControl(null, Validators.required),
      // FileTypeID: new FormControl(null, Validators.required),
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

  getLookupData() {
    this._sharedService.lookUps([43, 53]).subscribe((res: any) => {
      this.classfications = res?.data?.DataClassification;
      // this.fileTypes = res?.data?.FileType;
    });
  }

  show_add_dailog: boolean = false;

  handleShowAdd(event?: any) {
    if (event) {
      this.show_add_dailog = true;
    }
  }

  fileFilter: number = 1;

  initSelectForm() {
    this.select_form = new FormGroup({
      FileTitle: new FormControl(null, Validators.required),
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

  loadingState: boolean = false;

  loadingSave: boolean = false;

  displayModal: boolean = false;

  selected_file_show: any;

  selectedFiles: any[] = [];

  handleAction() {
    if (this.activeTab !== 1) return;

    if (this.attachment_form.invalid) {
      this.attachment_form.markAllAsTouched();
      return;
    }

    this.loadingSave = true;

    const formData = new FormData();
    const formValue = this.attachment_form.value;

    if (formValue.add_type === 'file') {
      const file = this.attachment_form.get('File')?.value;
      if (file) {
        formData.append('File', file);
      }
      formData.append('FileOrLink', 'true');
    } else {
      formData.append('LinkUrl', formValue.LinkUrl || '');
      formData.append('FileOrLink', 'false');
    }
    formData.append('File', this.attachment_form.get('File')?.value);
    formData.append('FileTitle', formValue.FileTitle || '');
    // formData.append('FileTypeID', formValue.FileTypeID || '');
    formData.append(
      'DataClassificationID',
      formValue.DataClassificationID || ''
    );
    formData.append('DataEnityID', this.dataEnityId);
    formData.append('DataEnityTypeID', '64');
    formData.append('fileUsageTypeID', '64');
    formData.append('IsVisibleInSearch', formValue.IsVisibleInSearch ?? 'true');

    const payload = formValue;
    this.fileSelectedEmitter.emit(payload);
    this.selectedFiles.push(payload);

    this.loadingSave = false;
    this.initAttachmentForm();
    this.show_add_dailog = false;
    // this.getRisksAttachments();
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
            // this.getRisksAttachments();
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

  onFileSelected(file: File) {
    this.attachment_form.get('File')?.setValue(file);
  }
  loadUpdate: boolean = false;

  current_title_update: string = '';
  current_file_update: any;
  edit_file_name: boolean = false;

  handleUpdateTitle() {
    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(
        this.current_file_update.fileUsageID,
        this.current_title_update,
        64
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
          // this.getRisksAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: (err) => {
          this.loadUpdate = false;
        },
      });
  }
  getFileSize(file: any) {
    if (!file.File) return '';
    const size = file.File.size;
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    else return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }

  getFileDate(file: any) {
    return file.File?.lastModifiedDate || new Date();
  }

  emitAction(action: string, file: any) {
    if (action === 'Delete') {
      this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
    }
  }
}
