import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { ProcessListService } from 'libs/features/BPM/src/processList/process-list.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-procedure-action',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    TranslateModule,
    TextareaUiComponent,
    RouterLink,
    ButtonModule,
    UiDropdownComponent,
  ],
  templateUrl: './procedureAction.component.html',
  styleUrl: './procedureAction.component.scss',
})
export class ProcedureActionComponent {
  processId: any;
  isLoading: boolean = false;
  procedureForm!: FormGroup;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  assigneeRoleID: any;
  organizationalUnits: any;
  procedureId: any;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ProcessListService: ProcessListService,
    private _ActivatedRoute: ActivatedRoute,
    private _riskService: RiskService,
    private _permissionService: PermissionSystemService
  ) {
    this._ActivatedRoute?.paramMap.subscribe((res: any) => {
      this.processId = res.get('processId');
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant('PROCESS.TABLE_NAME'),
          icon: '',
          routerLink: '/gfw-portal/BPM/add-procedure',
        },
        {
          name: this.procedureId
            ? this._TranslateService.instant('PROCEDURE.Update_procedure')
            : this._TranslateService.instant('PROCEDURE.Add_procedure'),
          icon: '',
          routerLink: '/gfw-portal/BPM/add-procedure',
        },
      ]);
    });
    this._ActivatedRoute?.paramMap.subscribe((res: any) => {
      this.procedureId = res.get('procedureId');
      if (this.procedureId) {
        this.ProcessListService.getproceduresById(this.procedureId).subscribe(
          (res: any) => {
            this.initprocedureForm(res?.data);
          }
        );
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant('PROCESS.TABLE_NAME'),
            icon: '',
            routerLink: '/gfw-portal/BPM/add-procedure',
          },
          {
            name: this.procedureId
              ? this._TranslateService.instant('PROCEDURE.Update_procedure')
              : this._TranslateService.instant('PROCEDURE.Add_procedure'),
            icon: '',
            routerLink: '/gfw-portal/BPM/add-procedure',
          },
        ]);
      }
    });
    this.initprocedureForm();
    this.loadLookups();
  }

  loadLookups() {
    this._SharedService.getRoleLookupData().subscribe((res: any) => {
      this.assigneeRoleID = res?.data;
    });
    // this._riskService.orgainationalUnitLookUp().subscribe((orgs: any) => {
    //   this.organizationalUnits = this.transformNodes(orgs?.data);
    // });

    this._SharedService.lookUps([129]).subscribe((res: any) => {
      this.organizationalUnits = res?.data?.OrganizationalUnitType;
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
      if (Array.isArray(node.children) && node.children.length) {
        node.children.forEach((child: any) => search(child));
      }
    }

    if (Array.isArray(nodes) && nodes.length) {
      nodes.forEach((node) => search(node));
    }

    return result;
  }

  initprocedureForm(data?: any) {
    // const selectedOrg: any = this.findNodesByIds(this.organizationalUnits, [
    //   data?.organizationalUnitID?.id,
    // ])[0];

    this.procedureForm = new FormGroup({
      businessProcessID: new FormControl(this.processId),
      referenceCode: new FormControl(data?.referenceCode, []),
      objective: new FormControl(data?.objective),
      objectiveAr: new FormControl(data?.objectiveAr),
      scope: new FormControl(data?.scope),
      scopeAr: new FormControl(data?.scopeAr),
      ownerRoleID: new FormControl(data?.ownerRoleID),
      organizationalUnitID: new FormControl(data?.organizationalUnitID),
      currentBusinessProcedure: new FormControl(
        data?.currentBusinessProcedure,
        [Validators.required]
      ),
    });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
  submit() {
    if (
      !this._permissionService.can('BUSINESSPROCESS', 'PROCEDURE', 'ADD') ||
      !this._permissionService.can('BUSINESSPROCESS', 'PROCEDURE', 'EDIT')
    )
      return;

    if (this.procedureForm.invalid) {
      this.procedureForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.procedureForm.value,
    };

    if (this.procedureId) {
      req['businessProcedureID'] = this.procedureId;
    }

    const API$ = this.procedureId
      ? this.ProcessListService.updateprocedure(req)
      : this.ProcessListService.addNewprocedure(req);

    API$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.procedureId
          ? 'procedure Updated Successfully'
          : 'procedure Added Successfully ',
      });
      this._Router.navigate([
        `/gfw-portal/BPM/viewProcess/${this.processId}/procedure`,
      ]);
    });
  }
}
