import { NewTableComponent } from './../../../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { UserDropdownComponent } from '@gfw/shared-ui';
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
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
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
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { AttachmentControlRequirmentComponent } from '../attachment-control-requirment/attachment-control-requirment.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-control-requirment',
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
    TreeSelectUiComponent,
    NewTableComponent,
    OwnerUserComponent,
    CommentSectionComponent,
    AttachmentControlRequirmentComponent
  ],
  templateUrl: './Control-Requirment.component.html',
  styleUrl: './Control-Requirment.component.scss',
})
export class ControlRequirmentComponent {
  visibleModalMangment: boolean = false;
  current_update_id: any;
  isLoading: boolean = false;
  isLoadingRequirement: boolean = false;
  showDataRequirement: boolean = false;
  dataRequirmentData: any;
  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _GovernanceService: GoveranceService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.govControlID =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    if (this.id) {
      this.columnControl = {
        type: 'route',
        data: `/gfw-portal/governance/control-management/${this.govControlID}/Requirements/`,
      };
    } else {
      this.columnControl = {
        type: 'popup',
        data: ``,
      };
    }
  }

  handleDataTable(event: any) {
    this.getControlRequirementsData(event);
  }
  columnControl: any;
  // attributes
  loadDeleted: boolean = false;
  items: any[] = [];
  govControlID: any = '';
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
  GovControlMaturityLevelType: any[] = [];
  defultProfile: any;
  requirement_form!: FormGroup;
  users: any;
  Roles: any;
  organizationUnitOptions: any;
  Data: any;
  id: any;
  controlId: any;
  govControlRequirementID: any;
  active_tab: number = 1;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('ControlRequirement.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () =>
          this.id
            ? this._router.navigate([
                `/gfw-portal/compliance/overViewDocument/${this.id}/content/${this.govControlID}/RequirementControl/${this.current_row_selected}/`,
              ])
            : this.openViewRequirementDialog(this.current_row_selected),
            visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('ControlRequirement.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('ControlRequirement.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.setFormUpdate(),
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'EDIT')
      },
    ];

    this.initForm();
    this.loadLookUps();
    this.handleTabs()
  }
  setFormUpdate() {
    this.visibleModalMangment = true;
    this._GovernanceService
      .getRequirementControlsById(this.current_row_selected)
      .subscribe((res: any) => {
        this.current_update_id = res?.data?.govControlRequirementID;
        this.initForm(res?.data);
      });
  }
  getDataControls() {
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    if (this.govControlID) {
      this._GovernanceService
        .getOneGovControl(this.govControlID)
        .subscribe((res) => {
          this.Data = res?.data;
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Governance'
              ),
              icon: '',
              routerLink: this.id
                ? `/gfw-portal/compliance/overViewDocument/${this.id}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Control_Management'
              ),
              icon: '',
              routerLink: this.id
                ? `/gfw-portal/compliance/overViewDocument/${this.id}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this.Data?.name || '-',
              icon: '',
              routerLink: this.id
                ? `/gfw-portal/compliance/overViewDocument/${this.id}/content/${this.id}/overview`
                : `/gfw-portal/governance/control-management/view/${this.id}/overview`,
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
  }
  loadLookUps() {

    this._SharedService.lookUps([29]).subscribe((res)=>{
      this.GovControlMaturityLevelType = res?.data?.GovControlMaturityLevel
    })


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
      organizationalUnitID: new FormControl(null),
      responsibleUserID: new FormControl(data?.responsibleUserID),
      responsibleRoleID: new FormControl(data?.responsibleRoleID),
      govControlMaturityLevelID: new FormControl(data?.govControlMaturityLevelID),
    });
    if (data?.organizationalUnitID) {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationUnitOptions = Array.isArray(res?.data)
            ? res.data
            : [];

          const selectedNode = this.findNodeById(
            this.organizationUnitOptions,
            data.organizationalUnitID
          );

          this.requirement_form
            .get('organizationalUnitID')
            ?.setValue(selectedNode);
        },
      });
    } else {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationUnitOptions = Array.isArray(res?.data)
            ? res.data
            : [];
        },
      });
    }
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
    if(!this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'DELETE')) return;
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
    this.visibleModalMangment = true;
  }

  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.requirement_form.invalid) {
      this.requirement_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      ...this.requirement_form.value,
      govControlID: +this.govControlID,
      organizationalUnitID: this.requirement_form.value.organizationalUnitID
        ? this.requirement_form.value.organizationalUnitID.id
        : null,
    };

    const payloadUpdate = {
      ...this.requirement_form.value,
      govControlID: +this.govControlID,
      govControlRequirementID: this.current_update_id,
      organizationalUnitID: this.requirement_form.value.organizationalUnitID
        ? this.requirement_form.value.organizationalUnitID.id
        : null,
    };

    if (this.id) {
      payloadUpdate['controlId'] = this.id;
    }
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

        this.visibleModalMangment = false;
        this.getControlRequirementsData();
        this.requirement_form.reset();
      },
    });
  }
  onModalClose() {
    this.visibleModalMangment = false;
    this.requirement_form.reset();
  }

  openViewRequirementDialog(requirementId: number): void {
    this.showDataRequirement = true;
    this.isLoadingRequirement = true;

    this._GovernanceService
      .getRequirementControlsById(this.current_row_selected)
      .subscribe({
        next: (res: any) => {
          this.dataRequirmentData = res?.data;

          this.showDataRequirement = true;
          this.isLoadingRequirement = false;
        },
        error: () => {
          this.isLoadingRequirement = false;
        },
      });
  }

tabs:any
  handleTabs(){
     this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT' , 'VIEW')
      },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment',
        router: 'comments',
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT_COMMENT' , 'COMMENT')

      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-paperclip',
        router: 'attachments',
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLREQUIRMENT_ATTACHMENT' , 'ATTACHMENT')

      },
    ];
  }
}
