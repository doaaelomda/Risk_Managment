import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, of, Subscription, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import {
  DatePackerComponent,
  TextareaUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { ComplianceAssessmntService } from '../../../services/compliance-assessmnt.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-evideance-complianec-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    TextareaUiComponent,
    UserDropdownComponent,
    TreeSelectUiComponent,
  ],
  templateUrl: './evideanceComplianecAction.component.html',
  styleUrl: './evideanceComplianecAction.component.scss',
})
export class EvideanceComplianecActionComponent implements OnInit, OnDestroy {
  // Form & Loading
  form!: FormGroup;
  isLoading = false;
  current_update_id: any;

  // Validation messages
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  // Lookup data
  statuses: any[] = [];
  roles: any[] = [];
  users: any[] = [];
  Asseignroles: any[] = [];
  approvalRequiredOptions = [
    { id: true, label: 'Yes' },
    { id: false, label: 'No' },
  ];
  organizationalUnits: any[]=[];

  // Breadcrumb
  breadCrumb: any[] = [];

  // Manage subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ComplianceAssessmntService: ComplianceAssessmntService,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _riskService: RiskService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    // Load lookups & initialize form
    this.loadLookups();
    this.getRolesLookUp();
    this.initialForm();
    this.handleRouteParams();
    this.handleBreadCrumbs();
  }

  // Load breadcrumbs
  handleBreadCrumbs() {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/evidenceType',
      },
      {
        name: this._TranslateService.instant(
          'EVIDENCE_COMPLIANCE.ADD_NEW_EVIDENCE_COMPLIANCE'
        ),
        icon: '',
        routerLink: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  // Load lookup data (status, users, organizational units)

  loadLookups() {
    // Evidence Type Status & Organizational Units
    const lookupSub = this._SharedService
      .lookUps([192])
      .subscribe((res: any) => {
        const data = res?.data;
        this.statuses = data?.EvidenceTypeStatusType ?? [];
      });
    this.subscriptions.add(lookupSub);

    // Users & verification users
    const userSub = this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => {
        const users = res?.data ?? [];
        this.users = JSON.parse(JSON.stringify(users));
      });
    this.subscriptions.add(userSub);
  }

  // Load roles
  getRolesLookUp() {
    const roleSub = this._SharedService
      .getRoleLookupData()
      .subscribe((res: any) => {
        this.roles = res?.data ?? [];
        this.Asseignroles = JSON.parse(JSON.stringify(this.roles));
      });
    this.subscriptions.add(roleSub);
  }
  // Handle route params to load record for update{
  handleRouteParams(): void {
    const routeSub = this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params: any) => {
          const id = params.get('id');

          // إذا وجد id، جلب البيانات
          if (id) {
            this.current_update_id = id;
            return this._ComplianceAssessmntService.getEvidenceComplianceById(
              id
            );
          }

          // إذا لم يوجد id، لا نفعل شيئًا
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.initialForm(res.data);
          if (this.breadCrumb && this.breadCrumb.length > 0) {
            this.breadCrumb[this.breadCrumb.length - 1].name = res?.data?.name;
          }
        }
      });

    this.subscriptions.add(routeSub);
  }
  // Transform organizational units into tree nodes
  transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return (nodes || [])
      .filter((node) => node)
      .map((node, index) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`;
        return {
          key,
          id: node.id,
          label: node.label || 'N/A',
          children: node.children
            ? this.transformNodes(node.children, key)
            : [],
        };
      });
  }
  // Find nodes by array of ids
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
  // Initialize evidence form
  initialForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      description: new FormControl(data?.description),
      taskTitle: new FormControl(data?.taskTitle),
      taskDescription: new FormControl(data?.taskDescription),
      evidenceDescription: new FormControl(data?.evidenceDescription),
      nextUpdateDate: new FormControl(
        data?.nextUpdateDate
          ? moment(data?.nextUpdateDate).format('MM-DD-YYYY')
          : null
      ),
      evidenceTypeStatusTypeID: new FormControl(
        data?.evidenceTypeStatusTypeID,
        Validators.required
      ),
      organizationalUnitID: new FormControl(null, Validators.required),
      assigneeRoleID: new FormControl(
        data?.assigneeRoleID,
        Validators.required
      ),
      assigneeUserID: new FormControl(
        data?.assigneeUserID,
        Validators.required
      ),
      approvalRequired: new FormControl(
        data?.approvalRequired,
        Validators.required
      ),
      verificationRoleID: new FormControl(data?.verificationRoleID),
      attachment: new FormControl(data?.attachment),
    });
    if (data?.organizationalUnitID) {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationalUnits = Array.isArray(res?.data) ? res.data : [];

          const selectedNode = this.findNodeById(
            this.organizationalUnits,
            data.organizationalUnitID
          );

          this.form.get('organizationalUnitID')?.setValue(selectedNode);
        },
      });
    } else {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationalUnits = Array.isArray(res?.data) ? res.data : [];
        },
      });
    }
  }
  // Submit form for add/update
  submit() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = { ...this.form.value };
    let orgUnits = formValue.organizationalUnitID;

    if (!Array.isArray(orgUnits)) orgUnits = orgUnits ? [orgUnits] : [];

    formValue.organizationalUnitID =
      orgUnits.length > 0 ? orgUnits[0].id ?? orgUnits[0] : null;

    const req = {
      ...formValue,
      nextUpdateDate: moment(
        this.form.get('nextUpdateDate')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
    };

    if (this.current_update_id) req.evidenceTypeID = this.current_update_id;

    const request$ = this.current_update_id
      ? this._ComplianceAssessmntService.updateEvidenceCompliance(req)
      : this._ComplianceAssessmntService.addEvidenceCompliance(req);

    const submitSub = request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_update_id
            ? this._TranslateService.instant(
                'EVIDENCE_COMPLIANCE.UPDATED_SUCCESS'
              )
            : this._TranslateService.instant(
                'EVIDENCE_COMPLIANCE.ADDED_SUCCESS'
              ),
        });
        this._Router.navigate(['/gfw-portal/compliance/evidenceType']);
      });

    this.subscriptions.add(submitSub);
  }
  // Cleanup subscriptions
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
