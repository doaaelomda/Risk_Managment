import { Component, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextComponent } from '../input-text/input-text.component';
import { UiDropdownComponent } from '../ui-dropdown/ui-dropdown.component';
import { AttachUiComponent } from '../attach-ui/attach-ui.component';
import { validations } from '../../models/validation.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedService } from '../../services/shared.service';
import { InputSearchComponent } from '../input-search/input-search.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginationComponent } from '../pagination/pagination.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-attachments-ui',
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    AttachUiComponent,
    RadioButtonModule,
    InputSearchComponent,
    SkeletonModule,
    PaginationComponent,
    Button,
  ],
  templateUrl: './attachments-ui.component.html',
  styleUrl: './attachments-ui.component.scss',
})
export class AttachmentsUiComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute
  ) {}
  @Input() hasExistFile: boolean = true;
  @Input() show_add_dailog: boolean = false;
  @Input() dataEntityId: any;
  @Input() dataEntityTypeId: number = 0;
  @Input() fileUsageTypeID: string = '';

  ngOnInit() {
    this.initSelectForm();
    this.initAttachmentForm();
    this.getAllSearchFiles();
    this.getLookupData();
    this.tabs = [
      { id: 1, name: this._TranslateService.instant('TABS.ADD_NEW_FILE') },
    ];
    if (this.hasExistFile) {
      this.tabs.push({
        id: 2,
        name: this._TranslateService.instant('TABS.EXIST_FILE'),
      });
    }
  }

  cancel_action = output<boolean>();

  handleCancelClick() {
    this.initAttachmentForm();
    this.initSelectForm();
    this.added.emit(false);
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

  activeTab: number = 1;
  tabs: any[] = [];
  fileTypes: any[] = [];
  classfications: any[] = [];
  getLookupData() {
    this._sharedService.lookUps([43, 53]).subscribe((res: any) => {
      this.classfications = res?.data?.DataClassification;
      this.fileTypes = res?.data?.FileType;
    });
  }
  select_form!: FormGroup;
  initSelectForm() {
    this.select_form = new FormGroup({
      FileTitle: new FormControl(null, Validators.required),
    });
  }

  handledToggleFilter() {
    this.getAllSearchFiles();
  }

  handleSerachExistFiles(event: string) {
    this.searchExistFilesTerm = event;
    this.getAllSearchFiles();
  }

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
      this.iconMap?.[type?.replace('.', '').toLowerCase()] ||
      'images/iconFile.png'
    );
  }

  handleSelectFile(file: any) {
    this.searchFiles.map((f: any) => (f.selected = false));
    file.selected = true;
    this.select_form.get('FileTitle')?.setValue(file.fileTitle);
  }

  handleValidationExist(): boolean {
    const is_selected = this.searchFiles.some((file: any) => file.selected);
    return !(this.select_form.valid && is_selected);
  }

  loadingSave: boolean = false;

  added = output<any>();

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
      FileTitle: this.select_form.get('FileTitle')?.value,
      DataClassificationID: selectedFile.dataClassificationID,
      // fileTypeID: selectedFile.fileTypeID,
      IsVisibleInSearch: selectedFile.isVisibleInSearch,
      DataEnityTypeID: this.dataEntityTypeId,
      DataEnityID: this.dataEntityId,
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
        this.added.emit(true);
        this.show_add_dailog = false;
      },
      error: () => {
        this.loadingSave = false;
      },
    });
  }

  loadingState: boolean = false;
  risks_attachments: any;


  showDelete(file: any , event:PointerEvent) {
    event.stopPropagation()
  }

  handleAction() {
    if (this.activeTab !== 1) {
      return;
    }

    if (this.attachment_form.invalid) {
      this.attachment_form.markAllAsTouched();
      return;
    }

    this.loadingSave = true;
    const formData = new FormData();

    const addType = this.attachment_form.get('add_type')?.value;

    formData.append('FileTitle', this.attachment_form.get('FileTitle')?.value);
    formData.append(
      'DataClassificationID',
      this.attachment_form.get('DataClassificationID')?.value
    );
    formData.append(
      'IsVisibleInSearch',
      this.attachment_form.get('IsVisibleInSearch')?.value
    );

    if (addType === 'file') {
      formData.append('File', this.attachment_form.get('File')?.value);
      formData.append('FileOrLink', 'true');
    } else {
      formData.append('LinkUrl', this.attachment_form.get('LinkUrl')?.value);
      formData.append('FileOrLink', 'false');
    }

    formData.append('DataEnityTypeID', this.dataEntityTypeId.toString());
    formData.append('DataEnityID', this.dataEntityId);
    formData.append('fileUsageTypeID', this.fileUsageTypeID);

    this._sharedService.saveAttachment(formData).subscribe({
      next: () => {
        this.loadingSave = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attachment Added Successfully',
        });
        this.initAttachmentForm();
        this.added.emit(true);
        this.show_add_dailog = false;
      },
      error: () => {
        this.loadingSave = false;
      },
    });
  }

  searchFiles: any[] = [];
  loadSearchState: boolean = false;
  fileFilter: any;
  searchExistFilesTerm: any;

  getAllSearchFiles(event?: any) {
    this.loadSearchState = true;
    const req = {
      dataEntityId: this.dataEntityId,
      dataEntityTypeId: this.dataEntityTypeId,
      myFiles: this.fileFilter == 1 ? false : false,
      fileTitle: this.searchExistFilesTerm,
      pageNumber: event?.currentPage || 1,
      pageSize: event?.perPage || 10,
    };

    this._sharedService.getSearchFiles(req).subscribe((res: any) => {
      this.searchFiles = res?.data?.items.map((file: any) => ({
        ...file,
        selected: false,
      }));
      this._sharedService.paginationSubject.next({
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      });
      this.loadSearchState = false;
    });
  }

  removeFile() {
    this.attachment_form.patchValue({
      File: null,
    });
  }

  attachment_form!: FormGroup;
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
}
