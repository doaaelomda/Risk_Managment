import { UserDropdownComponent } from '@gfw/shared-ui';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component } from '@angular/core';
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
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-requirment-control',
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
    UserDropdownComponent,
    UiDropdownComponent,
    NewTableComponent,
  ],
  templateUrl: './requirment-control.component.html',
  styleUrl: './requirment-control.component.scss',
})
export class RequirmentControlComponent {
  visibleModalMangment: any;
  current_update_id: any;
  isLoading: boolean = false;
  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private RequirmentDocumentService: RequirmentDocumentService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _router: Router,
    private service: RiskService,
    private complianceService: ComplianceService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.getIDs();
  }

  // attributes
  loadDeleted: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: any = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  loadingData: boolean = false;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible: boolean = false;
  controlRequirementData: any;
  requirement_form!: FormGroup;
  users: any;
  Roles: any;
  organizationUnitOptions: any;
  Data: any;
  id: any;
  controlId: any;
  govControlRequirementID: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  columnControl: any;
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('ControlRequirement.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () =>
          this._router.navigate([
            `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.id}/RequirementControl/${this.current_row_selected}/`,
          ]),
          visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('ControlRequirement.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
               visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('ControlRequirement.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.setFormUpdate(),
               visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'EDIT')
      },
    ];
    this.initForm();
    this.loadLookUps();
    this.handleCellRouter();
  }

handleCellRouter() {
  const baseUrl =
    `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.id}/RequirementControl`;

  this.columnControl = {
    type: 'route',
    data: this.current_row_selected
      ? `${baseUrl}/${this.current_row_selected}`
      : baseUrl,
  };
}

  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }
  setFormUpdate() {
    this.visibleModalMangment = true;
    this.RequirmentDocumentService.getRequirementControlsById(
      this.current_row_selected
    ).subscribe((res: any) => {
      this.current_update_id = res?.data?.complianceDocumentElementRequirementID;
      this.initForm(res?.data);
    });
  }
  getIDs() {
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    if (this.id && this.controlId) {
      this.getData();
      this.handleBreadCrumb();
    }
  }

  getData() {
    this.loadingData = true;
    this.service.getOneGovControl(this.id).subscribe((res) => {
      this.Data = res?.data;
      this.loadingData = false;
    });
  }

  handleBreadCrumb() {
    this.complianceService
      .getDocumentCompliance(this.controlId)
      .subscribe((res) => {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
            ),
            icon: '',
            routerLink: `/gfw-portal/compliance/complianceDocuments`,
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.DOCUMENTS'
            ),
            icon: '',
            routerLink: `/gfw-portal/compliance/complianceDocuments`,
          },
          {
            name: res?.data?.name || '-',
            icon: '',
            routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/overview`,
          },
          {
            name: this._TranslateService.instant('BREAD_CRUMB_TITLES.CONTENT'),
            icon: '',
            routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`,
          },
          {
            name: this.Data?.name || '-',
            routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.id}/overview`,
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.CONTROL_REQUIREMENTS'
            ),
            icon: '',
          },
        ]);
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
      responsibleUserID: new FormControl(data?.responsibleUserID),
      responsibleRoleID: new FormControl(data?.responsibleRoleID),
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

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  getControlRequirementsData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this.RequirmentDocumentService.getRequirementControls(payload, +this.id)
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
          this.loadingTable = false;
        },
        error: () => (this.loadingTable = false),
      });
  }

  deleteControlRequirement() {
    this.loadDeleted = true;
    this.RequirmentDocumentService.deleteRequirementControls(
      this.current_row_selected
    )
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Control Requirement Deleted Successfully',
        });
        this.getControlRequirementsData(this.current_payload);
        this.handleClosedDelete(false);
      });
  }

  current_payload: any;
  openModalControlMangment() {
    this.visibleModalMangment = true;
  }

  // govControlRequirementID
  submit() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.requirement_form.invalid) {
      this.requirement_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      ...this.requirement_form.value,
      complianceDocumentElementID: +this.id,
    };

    const payloadUpdate = {
      ...this.requirement_form.value,
      complianceDocumentElementID: +this.id,
      complianceDocumentElementRequirementID: this.current_update_id,
    };

    if (this.id) {
      payloadUpdate['controlId'] = this.controlId;
    }
    const request$: Observable<any> = this.current_update_id
      ? this.RequirmentDocumentService.updateRequirement(payloadUpdate)
      : this.RequirmentDocumentService.createRequirement(payload);

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

        this.visibleModalMangment = false;
        this.getControlRequirementsData(this.current_payload);
        this.requirement_form.reset();
      },
    });
  }
  onModalClose() {
    this.visibleModalMangment = false;
    this.requirement_form.reset();
  }
  handleDataTable(payload: any) {
    this.current_payload = payload;
    this.getControlRequirementsData(payload);
  }
}
