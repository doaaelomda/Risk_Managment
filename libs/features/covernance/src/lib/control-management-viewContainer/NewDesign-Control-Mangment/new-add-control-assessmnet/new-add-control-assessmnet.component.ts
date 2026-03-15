import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AccordionModule } from 'primeng/accordion';
import {
  RoleDropdownComponent,
  TextareaUiComponent,
  UserDropdownComponent,
  DatePackerComponent,
} from '@gfw/shared-ui';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { Subscription } from 'rxjs';
import { InputSwitchModule } from 'primeng/inputswitch';
@Component({
  selector: 'lib-new-add-control-assessmnet',
  imports: [
    CommonModule,
    AccordionModule,
    TreeSelectUiComponent,
    TextareaUiComponent,
    InputTextComponent,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    RouterLink,
    UiDropdownComponent,
    InputSwitchModule,
    RoleDropdownComponent,
    UserDropdownComponent,
    DatePackerComponent,
  ],
  templateUrl: './new-add-control-assessmnet.component.html',
  styleUrl: './new-add-control-assessmnet.component.scss',
})
export class NewAddControlAssessmnetComponent implements OnInit, OnDestroy {
  // declaration Variables
  organizationUnitOptions: any;
  form!: FormGroup;
  active_tab = 1;
  ClassificationForm!: FormGroup;
  ResponsibilityForm!: FormGroup;
  StatusForm!: FormGroup;
  CategoryType = [];
  id: any;
  tabs: any[] = [];
  users: any[] = [];
  roles: any[] = [];
  isLoader: boolean = false;
  govRegulator: any[] = [];
  DocumentNames: any[] = [];
  DocumentTypeOptions: any[] = [];
  validationsTitle: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.TITLE',
    },
  ];
  private subscription: Subscription = new Subscription();

  // declaration Contractor
  constructor(
    private service: RiskService,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private route: ActivatedRoute,
    private _router: Router,
    private _MessageService: MessageService
  ) {}

  // load Lookups
  loadLookups() {
    const sub = this._SharedService
      .lookUps([25, 24, 26])
      .subscribe((res: any) => {
        this.CategoryType = res?.data?.GovCategoryType;
        this.DocumentTypeOptions = res?.data?.GovDocumentType;
        this.govRegulator = res?.data?.GovRegulator;
        this.DocumentNames = res?.data?.GovDocument;
      });
    const org = this._SharedService.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.organizationUnitOptions = res?.data;
      },
    });
    const user = this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => {
        this.users = JSON.parse(JSON.stringify(res?.data));
      });
    const role = this._SharedService
      .getRoleLookupData()
      .subscribe((res: any) => {
        this.roles = res?.data;
      });
    this.subscription.add(sub);
    this.subscription.add(org);
    this.subscription.add(user);
    this.subscription.add(role);
  }
  // handle Breadcrumb
  setBreadCrumb() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    const baseBreadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Control_Management'
        ),
        routerLink: '/gfw-portal/governance/control-management/list',
      },
    ];
    if (!this.id) {
      this._LayoutService.breadCrumbLinks.next([
        ...baseBreadCrumb,
        {
          name: this._TranslateService.instant('SETTING.ADD_NEW_CONTROL'),
        },
      ]);
      return;
    }
    const gov = this.service.getOneGovControl(this.id).subscribe((res) => {
      const data = res?.data;
      this.initForm(data);
      this.initialClassificationForm(data);
      this.initialResponsibilityForm(data);
      this.initialStatusForm(data);
      this._LayoutService.breadCrumbLinks.next([
        ...baseBreadCrumb,
        {
          name: data?.name || '-',
        },
      ]);

      if (this.organizationUnitOptions?.length) {
        const selectedNode = this.findNodesByIds(this.organizationUnitOptions, [
          data?.organizationUnitID,
        ])[0];

        if (selectedNode) {
          this.ClassificationForm.get('organizationalUnitID')?.setValue(
            selectedNode
          );
        }
      }
    });
    this.subscription.add(gov);
  }

  // initial Form Responsibility
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      controlCode: new FormControl(data?.controlCode),
      referenceNumber: new FormControl(data?.referenceNumber),
      objective: new FormControl(data?.objective),
      evidenceDescription: new FormControl(data?.evidenceDescription),
      scope: new FormControl(data?.scope),
      fullControlText: new FormControl(data?.fullControlText),
      isFullControlText: new FormControl(data?.isFullControlText ?? false),
      isObjective: new FormControl(data?.isObjective ?? false),
      isEvidenceDescription: new FormControl(
        data?.isEvidenceDescription ?? false
      ),
    });
  }
  // initial Form ClassificationForm
  initialClassificationForm(data?: any) {
    this.ClassificationForm = new FormGroup({
      organizationalUnitID: new FormControl(data?.organizationUnitID),
      govRegulatorID: new FormControl(data?.govRegulatorID),
      categoryId: new FormControl(data?.categoryId),
      govDocumentID: new FormControl(data?.govDocumentID),
      govDocumentTypeID: new FormControl(data?.govDocumentTypeID),
    });
  }

  // initial Form ClassificationForm
  initialResponsibilityForm(data?: any) {
    this.ResponsibilityForm = new FormGroup({
      responsibleUserID: new FormControl(data?.responsibleUserID),
      responsibleRoleID: new FormControl(data?.responsibleRoleID),
    });
  }
  // initial Status Form
  initialStatusForm(data?: any) {
    this.StatusForm = new FormGroup({
      EffectivenessReptation: new FormControl(data?.EffectivenessReptation),
      EffectivenessNextTest: new FormControl(data?.EffectivenessNextTest),
      ComplianceNextTest: new FormControl(data?.ComplianceNextTest),
      ComplianceReptation: new FormControl(data?.ComplianceReptation),
      ComplianceNote: new FormControl(data?.ComplianceNote),
      MaturityReptation: new FormControl(data?.MaturityReptation),
      MaturityNextTest: new FormControl(data?.MaturityNextTest),
      ImplementationNextTest: new FormControl(data?.ImplementationNextTest),
      ImplementationReptation: new FormControl(data?.ImplementationReptation),
    });
  }
  // transform Node
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
  // find node id
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
  // save or update Control Register
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoader = true;

    const payload: any = {
      ...this.form.value,
      ...this.ClassificationForm.value,
      ...this.ResponsibilityForm.value,
      ...this.StatusForm.value,
    };

    payload.organizationalUnitID = Array.isArray(payload.organizationalUnitID)
      ? payload.organizationalUnitID[0]?.id ?? null
      : payload.organizationalUnitID?.id ?? null;

    Object.keys(payload).forEach(
      (k) => payload[k] == null && delete payload[k]
    );

    const request$ = this.id
      ? this.service.updateControlGov(this.id, {
          ...payload,
          govControlID: this.id,
        })
      : this.service.createControlGov(payload);

    const submit = request$.subscribe(() => {
      this.isLoader = false;
      this._MessageService.add({
        severity: 'success',
        summary: this._TranslateService.instant(
          this.id ? 'MESSAGES.UPDATE_SUCCESS' : 'MESSAGES.CREATE_SUCCESS'
        ),
        detail: this._TranslateService.instant(
          this.id
            ? 'MESSAGES.CONTROL_UPDATED_SUCCESS'
            : 'MESSAGES.CONTROL_CREATED_SUCCESS'
        ),
      });
      this._router.navigate(['/gfw-portal/governance/control-management/list']);
    });
    this.subscription.add(submit);
  }

  // status Tabs
  selectTab(id: number) {
    this.active_tab = id;
  }
  // handleTabs
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('pending_assessment.Compliance'),
      },
      {
        id: 2,
        name: this._TranslateService.instant(
          'pending_assessment.Effectiveness'
        ),
      },
      {
        id: 3,
        name: this._TranslateService.instant(
          'pending_assessment.Implementation'
        ),
      },
      {
        id: 4,
        name: this._TranslateService.instant(
          'pending_assessment.Maturity_Level'
        ),
      },
    ];
  }
  // Life Cycle Hooks
  ngOnInit() {
    this.loadLookups();
    this.setBreadCrumb();
    this.handleTabs();
    this.initForm();
    this.initialClassificationForm();
    this.initialResponsibilityForm();
    this.initialStatusForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
