import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { ButtonModule } from 'primeng/button';
import {
  DatePackerComponent,
  TextareaUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { finalize, of, Subscription, switchMap } from 'rxjs';
import { EvidenceLibraryService } from '../services/evidence-libraray.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import * as moment from 'moment';

@Component({
  selector: 'lib-evidence-library-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    ButtonModule,
    TextareaUiComponent,
    DatePackerComponent,
    UserDropdownComponent,
    TreeSelectUiComponent,
    UiDropdownComponent,
  ],
  templateUrl: './evidence-library-action.component.html',
  styleUrl: './evidence-library-action.component.scss',
})
export class EvidenceLibraryActionComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = false;
  current_update_id: any;
  breadCrumb: any[] = [];
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  private subscriptions: Subscription = new Subscription();
  statuses: any[] = [];
  roles: any[] = [];
  users: any[] = [];
  Asseignroles: any[] = [];
  approvalRequiredOptions = [
    { id: true, label: 'Yes' },
    { id: false, label: 'No' },
  ];
  organizationalUnits: any[] = [];
  verificationusers: any[] = [];
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private EvidenceLibraryService: EvidenceLibraryService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _permissionService: PermissionSystemService,
    private _SharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.handleRouteParams();
    this.loadLookups();
    this.getRolesLookUp();
  }

  handleBreadCrumbs(itemName?: string) {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.EVIDENCE_LIBRARY_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/library/evidence-library',
      },
      {
        name: itemName
          ? itemName
          : this._TranslateService.instant(
              'HEARDE_TABLE.ADD_NEW_EVIDENCE_LIBRARY'
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
        this.verificationusers = JSON.parse(JSON.stringify(users));
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
  initialForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      description: new FormControl(data?.description),
      taskTitle: new FormControl(data?.taskTitle),
      taskDescription: new FormControl(data?.taskDescription),
      evidenceDescription: new FormControl(data?.evidenceDescription),
      // nextUpdateDate: new FormControl(
      //   data?.nextUpdateDate
      //     ? moment(data?.nextUpdateDate).format('MM-DD-YYYY')
      //     : null
      // ),
      // evidenceTypeStatusTypeID: new FormControl(
      //   data?.evidenceTypeStatusTypeID,
      //   Validators.required
      // ),
      // organizationalUnitID: new FormControl(null, Validators.required),
      // assigneeRoleID: new FormControl(data?.assigneeRoleID),
      // assigneeUserID: new FormControl(
      //   data?.assigneeUserID,
      //   Validators.required
      // ),
      approvalRequired: new FormControl(
        data?.approvalRequired,
        Validators.required
      ),
      // verificationRoleID: new FormControl(data?.verificationRoleID),
      // verificationUserID: new FormControl(data?.verificationUserID),
    });
    // if (data?.organizationalUnitID) {
    //   this._SharedService.orgainationalUnitLookUp().subscribe({
    //     next: (res: any) => {
    //       this.organizationalUnits = Array.isArray(res?.data) ? res.data : [];

    //       const selectedNode = this.findNodeById(
    //         this.organizationalUnits,
    //         data?.organizationalUnitID
    //       );

    //       this.form.get('organizationalUnitID')?.setValue(selectedNode);
    //     },
    //   });
    // } else {
    //   this._SharedService.orgainationalUnitLookUp().subscribe({
    //     next: (res: any) => {
    //       this.organizationalUnits = Array.isArray(res?.data) ? res?.data : [];
    //     },
    //   });
    // }
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
  handleRouteParams(): void {
    const routeSub = this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params: any) => {
          const id = params.get('id');
          if (id) {
            this.current_update_id = id;
            return this.EvidenceLibraryService.getEvidenceById(id);
          }
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.initialForm(res.data);
          this.handleBreadCrumbs(res.data.name);
        } else {
          this.handleBreadCrumbs();
        }
      });

    this.subscriptions.add(routeSub);
  }
  submit() {
    const canAdd = this._permissionService.can(
      'LIBRARY',
      'EVIDENCELIBRARY',
      'ADD'
    );
    const canEdit = this._permissionService.can(
      'LIBRARY',
      'EVIDENCELIBRARY',
      'EDIT'
    );
    if (this.current_update_id && !canEdit) return;
    if (!this.current_update_id && !canAdd) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = { ...this.form.value };
    // let orgUnits = formValue.organizationalUnitID;

    // if (!Array.isArray(orgUnits)) orgUnits = orgUnits ? [orgUnits] : [];

    // formValue.organizationalUnitID =
    //   orgUnits.length > 0 ? orgUnits[0].id ?? orgUnits[0] : null;

    const req = {
      ...formValue
      // nextUpdateDate: moment(
      //   this.form.get('nextUpdateDate')?.value,
      //   'MM-DD-YYYY'
      // )
      //   .utc(true)
      //   .toISOString(),
    };

    if (this.current_update_id)
      req.templateEvidenceTypeID = this.current_update_id;

    const request$ = this.current_update_id
      ? this.EvidenceLibraryService.updateEvidence(req)
      : this.EvidenceLibraryService.addEvidence(req);

    const submitSub = request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_update_id
            ? this._TranslateService.instant('EVIDENCE_LIBRARY.UPDATED_SUCCESS')
            : this._TranslateService.instant('EVIDENCE_LIBRARY.ADDED_SUCCESS'),
        });
        this._Router.navigate(['/gfw-portal/library/evidence-library']);
      });

    this.subscriptions.add(submitSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
