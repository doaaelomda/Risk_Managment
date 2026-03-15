import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DeleteConfirmPopupComponent,
  PaginationComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { finalize, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { color } from 'echarts';
import { ColorDropdownComponent } from 'libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Component({
  selector: 'lib-competent-authorities-list',
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    ButtonModule,
    InputTextComponent,
    ReactiveFormsModule,
    FormsModule,
    TextareaUiComponent,
    InputNumberComponent,
    UiDropdownComponent,
    DeleteConfirmPopupComponent,
    SkeletonModule,
    PaginationComponent,
  ],
  templateUrl: './competent_authorities-list.component.html',
  styleUrl: './competent_authorities-list.component.scss',
})
export class CompetentAuthoritiesListComponent implements OnInit {
  addVisible: boolean = false;
  actionDeleteVisible: boolean = false;
  currentId: any;
  loadingBtn: boolean = false;
  CompetentAuthoritiesData: any;
  form!: FormGroup;
  govTypeIdArray: any;
  data: any;
  loadDelted: boolean = false;
  current_filters: any;
  sort_data: any;
  searchTerm: any;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  validationsEmail = [{ key: 'email', message: 'VALIDATIONS.RightEmail' }];
  validationsPhone = [{ key: 'pattern', message: 'VALIDATIONS.RightPattern' }];

  loadingTable: boolean = true;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _ComplianceAssessmntService: ComplianceAssessmntService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {}


  domain_URI:any;
  ngOnInit(): void {
    this.domain_URI = enviroment.API_URL
    this.initForm();
    this.handleBreadCrumb();
    this.ListOfCompetentAuthorities();
    this.loadLookups();
  }
  loadLookups() {
    this._SharedService.lookUps([32]).subscribe((res: any) => {
      this.govTypeIdArray = res?.data?.GovRegulatorType;
    });
  }
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      description: new FormControl(data?.description),
      nameAr: new FormControl(data?.nameAr),
      descriptionAr: new FormControl(data?.descriptionAr),
      email: new FormControl(data?.contactEmail, Validators.email),
      phone: new FormControl(data?.contactPhone),
      address: new FormControl(data?.address),
      complianceRegulatorTypeID: new FormControl(
        data?.complianceRegulatorTypeID,
        Validators.required
      ),
    });
  }
  handleBreadCrumb() {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/competent_authorities',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.COMPETENT_AUTHORITIES'),
        icon: '',
        routerLink: 'gfw-portal/compliance/competent_authorities',
      },
    ]);
    this._LayoutService.breadCrumbAction.next(null);
  }
  closeModel() {
    this.addVisible = false;
    this.form.reset();
  }
  skeletonArray:any
  ListOfCompetentAuthorities(event?: any) {
    this.loadingTable = true;
 this.skeletonArray = Array(this.pageginationObj?.perPage)
    this._ComplianceAssessmntService
      .getCompetentAuthoritieSearch(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .subscribe({
        next: (res: any) => {
          this.loadingTable = false
          this.CompetentAuthoritiesData = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
        },
        error: () => {},
      });
  }

  editCompetentAuthorities(event: any) {
    this.addVisible = true;
    this.currentId = event;
    this.getCompetentAuthorities();
  }
  getCompetentAuthorities() {
    this._ComplianceAssessmntService
      .getCompetentAuthoritieById(this.currentId)
      .subscribe((res) => {
        this.data = res?.data;
        this.initForm(res?.data);
      });
  }

  deleteCompetentAuthorities() {
    if(!this._PermissionSystemService.can('COMPLIANCE' , 'COMPETENTAUTHORITIES' , 'DELETE'))return
    this.loadDelted = true;
    this._ComplianceAssessmntService
      .deleteCompetentAuthoritie(this.currentId)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Competent Authorities Deleted Successfully',
        });
        this.ListOfCompetentAuthorities();
        this.handleClosedDelete(false);
      });
  }
  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  handleShowDelete(event: any) {
    ;

    this.actionDeleteVisible = true;
    this.currentId = event;
  }

  submit() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE', 'COMPETENTAUTHORITIES', 'ADD');
    const canEdit = this._PermissionSystemService.can('COMPLIANCE', 'COMPETENTAUTHORITIES', 'EDIT');
    if (this.currentId && !canEdit) return;
    if (!this.currentId && !canAdd) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingBtn = true;
    const req = { ...this.form.value };

    if (this.currentId) {
      req.govRegulatorID = this.currentId;
    }

    const APT$: Observable<any> = this.currentId
      ? this._ComplianceAssessmntService.updateCompetentAuthoritie(req)
      : this._ComplianceAssessmntService.addCompetentAuthoritie(req);

    APT$
      .pipe(
        finalize(() => {
          this.loadingBtn = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          const resolvedId = res?.idResult ;

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.currentId
              ? 'Competent Authorities Updated Successfully'
              : 'Competent Authorities Added Successfully',
          });

          this.addVisible = false;

          if (this.selectedFile && resolvedId) {
            this.uploadCompetentAuthorityImage(resolvedId);
          } else {
            this.ListOfCompetentAuthorities();
          }
        },
      });
  }

  private uploadCompetentAuthorityImage(entityId: any) {
    const formData = new FormData();
    formData.append('Image', this.selectedFile as File);
    formData.append('ComplianceRegulatorID', entityId);



    this._ComplianceAssessmntService.saveAuthorityImage(formData).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Authority image uploaded successfully.',
        });
        this.selectedFile = null;
        this.authority_image = 'images/image_placeholder.png';
        this.ListOfCompetentAuthorities();
      },
      error: () => {
        // Keep the list refreshed even if the upload fails
        this.ListOfCompetentAuthorities();
      },
    });
  }

  viewCompetentAuthorities(event: any) {
    this._router.navigate([
      `gfw-portal/compliance/competent_authorities/${event}`,
    ]);
  }



  authority_image:any = 'images/image_placeholder.png';

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile!: File | null;
  previewUrl: string | null = null;
  fileError: string | null = null;
  MAX_FILE_SIZE = 5 * 1024 * 1024;
  handleFileUpload() {
    this.fileInput.nativeElement.click();
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.processFile(input.files[0]);
  }

    private processFile(file: File): void {
    this.fileError = null;

    if (file.size > this.MAX_FILE_SIZE) {
      // this.fileError = this.translateService.instant('UPLOAD.MAX_SIZE_ERROR');
      this.selectedFile = null;
      this.fileInput.nativeElement.value = '';
      return;
    }

    this.selectedFile = file;

    console.log('Selected File:', file);

    if (this.previewUrl && this.previewUrl !== this.data.image) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.authority_image = URL.createObjectURL(file);
  }
}
