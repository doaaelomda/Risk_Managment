import { StandardDocsRequirementsService } from './../../../../../../../covernance/src/service/standard-docs-requirements.service';
import { NewTableComponent } from './../../../../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-requirements-standard-controls',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextComponent,
    InputNumberComponent,
    NewTableComponent,
  ],
  templateUrl: './requirements-standard-controls.component.html',
  styleUrl: './requirements-standard-controls.component.scss',
})
export class RequirementsStandardControlsComponent {
  visiableModalMangment: any;
  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _GovernanceService: StandardDocsRequirementsService,
    private _SharedService: SharedService,

    private _TranslateService: TranslateService,
    private _router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.govControlID =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    this.document_id =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('document_id');
    this.columnControl = {
      type: 'route',
      data: `/gfw-portal/library/standard-docs/${this.document_id}/controls/${this.govControlID}/requirements`,
    };
  }
  handleDataTable(event: any) {
    this.getControlRequirementsData(event);
  }
  columnControl: any;
  // attributes
  loadDeleted: boolean = false;
  items: any[] = [];
  govControlID: any = '';
  document_id: any = '';
  selected_profile_column: number = 0;

  showViewOptionPopup: boolean = false;
  loading: boolean = false;
  dataOption: any;
  current_filters: any[] = [];
  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible: boolean = false;
  controlRequirementData: any;
  controlRequirementProfiles: any[] = [];
  defultProfile: any;
  requirement_form!: FormGroup;
  users: any;
  Roles: any;
  organizationUnitOptions: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('ControlRequirement.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () =>
          this._router.navigate([
            `/gfw-portal/library/standard-docs/${this.document_id}/controls/${this.govControlID}/requirements/${this.current_row_selected}`,
          ]),
          visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('ControlRequirement.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
      visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS','DELETE')

      },
      {
        label: this._TranslateService.instant('ControlRequirement.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.setFormUpdate(),
      visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS','EDIT')

      },
    ];

    this.initForm();
    this.loadLookUps();
  }

  setFormUpdate() {
    this.visiableModalMangment = true;
    this._GovernanceService
      .getRequirementControlsById(this.current_row_selected)
      .subscribe((res: any) => {
        this.current_update_id =
          res?.data?.governanceStandardControlRequirementID;
        this.initForm(res?.data);
      });
  }
  loadLookUps() {
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.users = res?.data;
    });
    this._SharedService.getRoleLookupData().subscribe((res: any) => {
      this.Roles = res?.data;
    });
  }

  findNodeById(nodes: any[], id: number): any | null {
    for (let node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  initForm(data?: any) {
    this.requirement_form = new FormGroup({
      orderNumber: new FormControl(data?.orderNumber, Validators.required),
      requirementText: new FormControl(
        data?.requirementText,
        Validators.required
      ),
      requirementTextAr: new FormControl(data?.requirementTextAr),
      externalReference: new FormControl(data?.externalReference),
      // organizationalUnitID: new FormControl(null),
      // responsibleUserID: new FormControl(data?.responsibleUserID),
      // responsibleRoleID: new FormControl(data?.responsibleRoleID),
    });
    // if (data?.organizationalUnitID) {
    //   this._SharedService.orgainationalUnitLookUp().subscribe({
    //     next: (res: any) => {
    //       this.organizationUnitOptions = Array.isArray(res?.data)
    //         ? res.data
    //         : [];

    //       const selectedNode = this.findNodeById(
    //         this.organizationUnitOptions,
    //         data.organizationalUnitID
    //       );

    //       this.requirement_form
    //         .get('organizationalUnitID')
    //         ?.setValue(selectedNode);
    //     },
    //   });
    // } else {
    //   this._SharedService.orgainationalUnitLookUp().subscribe({
    //     next: (res: any) => {
    //       this.organizationUnitOptions = Array.isArray(res?.data)
    //         ? res.data
    //         : [];
    //     },
    //   });
    // }
  }
  // methods
  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  govControlRequirementID: any;

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  getControlRequirementsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._GovernanceService
      .getRequirementControls(null, 1, 10, [], +this.govControlID, event, true)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;

          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
        },
      });
  }

  deleteControlRequirement() {
     if(!this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'DELETE')) return;

    this.loadDeleted = true;
    this._GovernanceService
      .deleteRequirementControls(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Control Requirement Deleted Successfully',
        });
        this.getControlRequirementsData();
        this.handleClosedDelete(false);
      });
  }

  openModalControlMangment() {
    this.visiableModalMangment = true;
  }

  current_update_id: any;
  isLoading: boolean = false;
  submit() {
    const canAdd = this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.requirement_form.invalid) {
      this.requirement_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      ...this.requirement_form.value,
      governanceStandardControlID: +this.govControlID,
      organizationalUnitID: this.requirement_form.value.organizationalUnitID
        ? this.requirement_form.value.organizationalUnitID.id
        : null,
    };

    const payloadUpdate = {
      ...this.requirement_form.value,
      governanceStandardControlID: +this.govControlID,
      governanceStandardControlRequirementID: this.current_update_id,
      // organizationalUnitID: this.requirement_form.value.organizationalUnitID
      //   ? this.requirement_form.value.organizationalUnitID.id
      //   : null,
    };

    const request$: Observable<any> = this.current_update_id
      ? this._GovernanceService.updateRequirement(payloadUpdate)
      : this._GovernanceService.createRequirement(payload);

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          detail: this.current_update_id
            ? this._TranslateService.instant(
                'ControlRequirement.UPDATE_SUCCESS'
              )
            : this._TranslateService.instant('ControlRequirement.ADD_SUCCESS'),
        });

        this.visiableModalMangment = false;
        this.getControlRequirementsData();
        this.requirement_form.reset();
      },
    });
  }
  onModalClose() {
    this.visiableModalMangment = false;
    this.requirement_form.reset();
  }
}
