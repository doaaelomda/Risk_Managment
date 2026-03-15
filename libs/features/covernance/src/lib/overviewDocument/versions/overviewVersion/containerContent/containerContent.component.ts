import { EditorComponent } from './../../../../../../../../shared/shared-ui/src/lib/editor/editor.component';
import { CheckboxOptionComponent } from './../../../../../../../../shared/shared-ui/src/lib/checkboxOption/checkboxOption.component';
import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AttachUiComponent, EmptyStateComponent, NewAttachListComponent } from '@gfw/shared-ui';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ContentDocumentComponent } from '../contentDocument/contentDocument.component';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { MessageService } from 'primeng/api';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { ButtonModule } from 'primeng/button';
import { GovDocumentsService } from 'libs/features/covernance/src/service/covDocument.service';
import { DocsPreviewComponent } from 'libs/shared/shared-ui/src/lib/docs-preview/docs-preview.component';
import { PdfPreviewComponent } from 'libs/shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { DocumentTypeInterface } from 'apps/gfw-portal/src/app/core/models/DocumentType.interface';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EmptyStateFilesComponent } from "libs/shared/shared-ui/src/lib/empty-state-files/empty-state-files.component";

@Component({
  selector: 'lib-container-content',
  imports: [
    CommonModule,
    TranslateModule,
    EditorComponent,
    ReactiveFormsModule,
    ContentDocumentComponent,
    AttachmentsUiComponent,
    NewAttachListComponent,
    ViewAttachementComponent,
    EditAttachmentComponent,
    ButtonModule,
    DocsPreviewComponent,
    PdfPreviewComponent,
    RadioButtonModule,
    FormsModule,
    EmptyStateComponent,
    EmptyStateFilesComponent
],
  templateUrl: './containerContent.component.html',
  styleUrl: './containerContent.component.scss',
})
export class ContainerContentComponent {
  selectedContentType: string[] = [];
  uploadFileContent: boolean = false;
  attachment_form!: FormGroup;
  editor_form!: FormGroup;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  contents_attachments: any;
  id: any;
  show_add_dailog: boolean = false;
  env: any;
  Docid: any;
  isLoading: boolean = false;
  contentIds: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _sharedServices: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _GovDocumentsService: GovDocumentsService
  ) {
    this.InitialFormAttachment();
    this.InitialFormEditor();
    effect(() => {
      const types = this._GovDocumentsService.currentContentTypes();
      this.initTypes(types);
    });

    this.env = enviroment.DOMAIN_URI;
    this.id = this._ActivatedRoute.parent?.snapshot.params['versionId'];
    this.Docid = this._ActivatedRoute.parent?.snapshot.params['Docid'];
    if (this.id) {
      this.getcontentsAttachments();
      this._GovDocumentsService.getByIdEditor(this.id).subscribe((res: any) => {
        this.InitialFormEditor(res?.data);
      });
    }
  }
  activeVisual: any;
  types: DocumentTypeInterface[] = [];

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
    this.types = types;
    if(!this.types.length)return
    this.selected_type = this.types[0].id;
  }
  selected_type!: number;
  setActiveType(type_id: number) {
    switch (type_id) {
      case 1: {
        this.selected_type = type_id;

        break;
      }

      case 2: {
        this.selected_type = type_id;

        break;
      }

      case 3: {
        this.selected_type = type_id;

        break;
      }

      default: {
        break;
      }
    }
  }

  InitialFormAttachment() {
    this.attachment_form = new FormGroup({
      File: new FormControl(null),
    });
  }

  InitialFormEditor(data?: any) {
    this.editor_form = new FormGroup({
      content: new FormControl(data, Validators.required),
    });
  }

  removeFile() {
    this.attachment_form.patchValue({
      File: null,
    });
  }
  getcontentsAttachments() {
    this.loadingState = true;
    if (this.id) {
      this._sharedServices.getNewAttachment(112, +this.id, 103).subscribe({
        next: (res: any) => {
          this.contents_attachments = res?.data;
          this.loadingState = false;
        },
      });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedServices.getNewAttachment(112, +this.id, 103)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.contents_attachments = res?.data;
            this.loadingState = false;
          },
        });
    }
  }
  removeExistingFile(file: any) {
    this.contents_attachments = this.contents_attachments.filter(
      (f: any) => f.fileID !== file.fileID
    );
  }

  uploadedFiles: any[] = [];
  onFileAdded(file: any) {
    this.uploadedFiles.push(file);
  }

  removeUploadedFile(file: any) {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
  }

  handleAdded(event: any) {
    if (event) {
      this.getcontentsAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedServices.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
            });
            this.getcontentsAttachments();
          },
        });
        break;

      case 'Download':
        this._sharedServices.downloadAttachment(event.file.fileID).subscribe({
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
        this._sharedServices
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
    this._sharedServices
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 103)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getcontentsAttachments();
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
  submit() {
    if (this.editor_form.invalid) {

      this.editor_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = { ...this.editor_form.value, govDocumentVersionId: this.id };

    this._GovDocumentsService.UpdateEditor(req).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this._TranslateService.instant('editor is added'),
      });
      this.isLoading = false;
    });
  }
}
