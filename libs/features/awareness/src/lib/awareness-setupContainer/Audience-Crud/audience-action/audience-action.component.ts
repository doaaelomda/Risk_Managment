import { TreeSelectUiComponent } from './../../../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { TreeMultiselectComponent } from './../../../../../../../shared/shared-ui/src/lib/treeMultiselect/treeMultiselect.component';
import { Component, OnInit } from '@angular/core';
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
import { finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

// Shared UI Components
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import {
  DatePackerComponent,
  RoleDropdownComponent,
  TextareaUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-audience-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    UiDropdownComponent,
    ButtonModule,
    RoleDropdownComponent,
    UserDropdownComponent,
    TreeSelectUiComponent,
  ],
  templateUrl: './audience-action.component.html',
  styleUrl: './audience-action.component.scss',
})
export class AudienceActionComponent implements OnInit {
  campaign_form!: FormGroup;
  current_update_id: any;
  isLoading = false;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  scopeTypes: any[] = [
    { label: 'All Users', id: 1 },
    { label: 'Department', id: 2 },
    { label: 'Role', id: 3 },
    { label: 'Specific Users ', id: 4 },
  ];
  orgUnits: any[] = [];
  roles: any[] = [];
  thirdParties: any[] = [];
  users: any[] = [];
  awarenessId: any;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _LayoutService: LayoutService,
     private _permissionService: PermissionSystemService
  ) {
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.awarenessId = res.get('id');
      if (this.awarenessId) {
        this._AwarenessService
          .getCampaignById(this.awarenessId)
          .subscribe((res: any) => {
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: res?.data?.name,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/overview`,
              },
              {
                name: this._TranslateService.instant('ADUIANCE.TITLE'),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance`,
              },
              {
                name: this._TranslateService.instant('ADUIANCE.ADD_NEW'),
                icon: '',
              },
            ]);
          });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.getRolesLookUp();
    this.getUsersLookUp();
    this.handleRouteParams();
  }

  initForm(data?: any) {
    let orgIds: number[] = [];
    let orValue: any[] = [];

    if (data) {
      if (Array.isArray(data.organizationalUnitID)) {
        orgIds = data.organizationalUnitID.map((org: any) => org.id);
      } else if (
        typeof data.organizationalUnitID === 'object' &&
        data.organizationalUnitID !== null
      ) {
        orgIds = [data.organizationalUnitID.id];
      } else if (typeof data.organizationalUnitID === 'number') {
        orgIds = [data.organizationalUnitID];
      }
      orValue = this.findNodesByIds(this.orgUnits, orgIds);
    }

    this.campaign_form = new FormGroup({
      awarenessCampaignID: new FormControl(this.awarenessId),
      audienceScopeTypeID: new FormControl(
        data?.audienceScopeTypeID,
        Validators.required
      ),
      organizationalUnitID: new FormControl(data ? orValue : null),
      roleID: new FormControl(data?.roleID),
      // thirdPartyID: new FormControl(data?.thirdPartyID),
      userID: new FormControl(data?.userID),
    });
  }

  loadLookups() {


    this._SharedService.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.orgUnits = this.transformNodes(res?.data);
        console.log('OrganizationalUnit', this.orgUnits);
      },
    });
  }
  transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return nodes.map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const isLeaf = !node.children || node.children.length === 0;
      return {
        key,
        id: node.id,
        label: node.label,
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }

  findNodesByIds(nodes: any[], ids: number[]): any[] {
    const result: any[] = [];

    function search(node: any) {
      if (ids.includes(node.id)) {
        result.push(node);
      }
      if (node.children) {
        node.children.forEach((child: any) => search(child));
      }
    }

    nodes.forEach((node) => search(node));
    return result;
  }

  getRolesLookUp() {
    this._SharedService.getRoleLookupData().subscribe((res) => {
      this.roles = res?.data;
    });
  }

  getUsersLookUp() {
    this._SharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.users = res?.data;
    });
  }
  handleRouteParams() {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('audienceId');
      if (id) {
        this.current_update_id = id;
        this._AwarenessService.getAduianceById(id).subscribe((res: any) => {
          this.initForm(res.data);
        });
      }
    });
  }

  emptyForm() {
    const audianceValue = this.campaign_form.get('audienceScopeTypeID')?.value;
    const orgsValue = this.campaign_form.get('organizationalUnitID')?.value;
    const roleValue = this.campaign_form.get('roleID')?.value;
    const userValue = this.campaign_form.get('userID')?.value;
    const allEmpty =
      audianceValue !== 1 && !orgsValue && !roleValue && !userValue;
    return allEmpty;
  }

  submit() {
    if (this.campaign_form.invalid || this.emptyForm()) {
      this.campaign_form.markAllAsTouched();
      return;
    }

              // ===== Permissions =====
  const hasPermission = this.current_update_id
    ? this._permissionService.can('AWARNESS' , 'AUDIENCE', 'EDIT')
    : this._permissionService.can('AWARNESS' , 'AUDIENCE', 'ADD');

  if (!hasPermission) {
    return;
  }

    this.isLoading = true;

    const awarnessValue = this.campaign_form.get('awarenessCampaignID')?.value;
    const audianceValue = this.campaign_form.get('audienceScopeTypeID')?.value;
    const orgsValue = this.campaign_form.get('organizationalUnitID')?.value;
    const roleValue = this.campaign_form.get('roleID')?.value;
    const userValue = this.campaign_form.get('userID')?.value;
    const req: any = {
      awarenessCampaignID: awarnessValue,
      audienceScopeTypeID: audianceValue,
    };
    if (orgsValue) {
      req.organizationalUnitID = orgsValue;
      req.organizationalUnitID = req.organizationalUnitID
        ? Array.isArray(req.organizationalUnitID)
          ? req.organizationalUnitID[0]?.id ?? null
          : req.organizationalUnitID.id ?? null
        : null;
    }
    if (roleValue) {
      req.roleID = roleValue;
    }
    if (userValue) {
      req.userID = userValue;
    }
    if (this.current_update_id) req.id = this.current_update_id;

    if (this.current_update_id) {
      req.awarenessCampaignAudienceID = this.current_update_id;
    }

    const request$ = this.current_update_id
      ? this._AwarenessService.updateAduiance(req)
      : this._AwarenessService.addAduiance(req);

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? this._TranslateService.instant('ADUIANCE.UPDATED_SUCCESS')
          : this._TranslateService.instant('ADUIANCE.ADDED_SUCCESS'),
      });
      this._Router.navigate([
        `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance`,
      ]);
    });
  }
}
