  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import {
    FormGroup,
    FormControl,
    ReactiveFormsModule,
    Validators,
    FormsModule,
  } from '@angular/forms';
  import { TranslateModule, TranslateService } from '@ngx-translate/core';
  import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
  import { RiskService } from 'libs/features/risks/src/services/risk.service';
  import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
  import { AccordionModule } from 'primeng/accordion';
  import { TextareaUiComponent, UserDropdownComponent, RoleDropdownComponent, DatePackerComponent } from '@gfw/shared-ui';
  import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
  import { ButtonModule } from 'primeng/button';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
  import { MessageService } from 'primeng/api';
  import { MenuModule } from 'primeng/menu';
  import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
  import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
  import { finalize, Subscription } from 'rxjs';
  import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
  import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
  import { InputNumberModule } from "primeng/inputnumber";
  import { DropdownModule } from "primeng/dropdown";
  import { InputSwitchModule } from 'primeng/inputswitch';
import * as moment from 'moment';

  @Component({
    selector: 'lib-control-management-action',
    imports: [
      CommonModule,
      AccordionModule,
      TreeSelectUiComponent,
      TextareaUiComponent,
      InputTextComponent,
      ReactiveFormsModule,
      TranslateModule,
      UserDropdownComponent,
      ButtonModule,
      MenuModule,
      RouterLink,
      RoleDropdownComponent,
      UiDropdownComponent,
      InputNumberComponent,
      CheckboxModule,
      FormsModule,
      InputNumberModule,
      DropdownModule,
      InputSwitchModule,
      DatePackerComponent
  ],
    templateUrl: './control-management-action.component.html',
    styleUrl: './control-management-action.component.scss',
  })
  export class ControlManagementActionComponent implements OnInit, OnDestroy {
    // declaration Variables
    roleId: any;
    organizationUnitOptions: any;
    controlInformation!: FormGroup;
    Responsibility_Ownership!: FormGroup;
    Governance_Organization!: FormGroup;
    scopeTextForm!:FormGroup;
    documentRefrenceForm!:FormGroup;
    complianceStatusForm!:FormGroup;
    effectivinessStatusForm!:FormGroup;
    maturityForm!:FormGroup;
    implementationForm!:FormGroup;
    manger: any[] = [];
    DocumentTypeOptions = [];
    govControlTypeOptions = [];
    categories = [];
    id: any;
    saveDataLoader: boolean = false;
    DocumentNames: any[] = [];
    complianceDocuments: any[] = [];
    ControlComplianceStatusType: any[] = [];
    effectivnessStatusTypes: any[] = [];
    maturityLevelTypes: any[] = [];
    showErrorResponsbility = false;
    govRegulator: any[] = [];
    Roles: any;
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
    ) {

    }
    // Life Cycle Hooks
    ngOnInit() {
          this.loadLookups();
      this.intailizeAllFormsSections()
      this.setBreadCrumb();


    }


    intailizeAllFormsSections(data?:any){
          this.initMainInformationForm(data);
      this.initScopeForm(data);
      this.initDocumentRefrenceForm(data);
      this.initComplianceStatusForm(data);
      this.initEffectivenessStatusForm(data);
      this.initMaturityForm(data);
      this.initImplementationForm(data);
      this.initialForm(data);
      this.initCapForm(data);
    }
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
    capBehaviorTypes: any[] = [];

    loadLookups() {
      const sub = this._SharedService
        .lookUps([64,238,24,81,25,26,65,66, 30 , 235])
        .subscribe((res: any) => {
          this.DocumentTypeOptions = res?.data?.GovDocumentType || [];
          this.govControlTypeOptions = res?.data?.GovControlType || [];
          this.categories = res?.data?.GovControlCategory || [];
          this.govRegulator = res?.data?.GovRegulator || [];
          this.DocumentNames = res?.data?.GovDocument || [];
          this.complianceDocuments = res?.data?.ComplianceDocument || [];
          this.ControlComplianceStatusType = res?.data?.ControlComplianceStatusType || [];
          this.effectivnessStatusTypes = res?.data?.ControlEffectivenessStatusType || [];
          this.maturityLevelTypes = res?.data?.GovControlMaturityLevelType || [];
          this.capBehaviorTypes =
            res?.data?.ControlEffectivenessFormulaCapBehaviorType || [];
        });
      const org = this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationUnitOptions = this.transformNodes(res?.data);
        },
      });
      const user = this._SharedService
        .getUserLookupData()
        .subscribe((res: any) => {
          this.manger = JSON.parse(JSON.stringify(res?.data));
        });
      const role = this._SharedService
        .getRoleLookupData()
        .subscribe((res: any) => {
          this.Roles = res?.data;
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
        this.intailizeAllFormsSections(data);
        this._LayoutService.breadCrumbLinks.next([
          ...baseBreadCrumb,
          {
            name: data?.name || '-',
          },
        ]);

        // if (this.organizationUnitOptions?.length) {
        //   const selectedNode = this.findNodeById(this.organizationUnitOptions, [
        //     data?.organizationUnitID,
        //   ])[0];

        //   if (selectedNode) {
        //     this.Responsibility_Ownership.get('organizationalUnitID')?.setValue(
        //       selectedNode
        //     );
        //   }
        // }
      });
      this.subscription.add(gov);
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
    // initial Form Responsibility
    initMainInformationForm(data?: any) {
      this.controlInformation = new FormGroup({
        name: new FormControl(data?.name, Validators.required),
        nameAr: new FormControl(data?.nameAr),
        controlCode: new FormControl(data?.controlCode),
        referenceNumber: new FormControl(data?.referenceNumber),

        govControlTypeId: new FormControl(data?.govControlTypeID),
        govControlCategoryId: new FormControl(data?.govControlCategoryID),
        isApplicable: new FormControl(data?.isApplicable),
      });
    }


    initScopeForm(data?:any){
      this.scopeTextForm = new FormGroup({
        fullControlText: new FormControl(data?.fullControlText),
        fullControlTextAr: new FormControl(data?.fullControlText),
        objective: new FormControl(data?.objective),
        objectiveAr: new FormControl(data?.objectiveAr),
        evidenceDescription: new FormControl(data?.evidenceDescription),
        scope: new FormControl(data?.scope),
      })
    }

    initDocumentRefrenceForm(data?:any){
      this.documentRefrenceForm = new FormGroup({
        govRegulatorID: new FormControl(data?.govRegulatorID),
        govDocumentID: new FormControl(data?.govDocumentID),
        complianceDocumentID: new FormControl(data?.complianceDocumentID),
        govDocumentTypeID: new FormControl(data?.govDocumentTypeID),
        complianceNextTestDate: new FormControl(data?.complianceNextTestDate),
        complianceExpiryDate: new FormControl(data?.complianceExpiryDate),


      })
    }

    initComplianceStatusForm(data?:any){
      this.complianceStatusForm = new FormGroup({
              complianceStatusTypeID: new FormControl(data?.complianceStatusTypeID),
              complianceNextTestDate: new FormControl(data?.complianceNextTestDate ? moment(new Date(data?.complianceNextTestDate)).format('MM-DD-YYYY') : null),
              complianceExpiryDate: new FormControl(data?.complianceExpiryDate ? moment(new Date(data?.complianceExpiryDate)).format('MM-DD-YYYY') : null ),
      })
    }

    initEffectivenessStatusForm(data?:any){
      this.effectivinessStatusForm = new FormGroup({
              effectivenessStatusTypeID: new FormControl(data?.effectivenessStatusTypeID),
              effectivenessNextTestDate: new FormControl(data?.effectivenessNextTestDate ? moment(new Date(data?.effectivenessNextTestDate)).format('MM-DD-YYYY') : null),
      })
    }
    initMaturityForm(data?:any){
      this.maturityForm = new FormGroup({
              maturityLevelTypeID: new FormControl(data?.maturityLevelTypeID),
              maturityNextTestDate: new FormControl(data?.maturityNextTestDate ? moment(new Date(data?.maturityNextTestDate)).format('MM-DD-YYYY') : null),
      })
    }
    initImplementationForm(data?:any){
      this.implementationForm = new FormGroup({
              isActive: new FormControl(data?.isActive),
              implementationNextTestDate: new FormControl(data?.implementationNextTestDate ? moment(new Date(data?.implementationNextTestDate)).format('MM-DD-YYYY') : null),
              implementationGuidance: new FormControl(data?.implementationGuidance),
      })
    }

    // find node id
  findNodeById(tree: any[], id: number): any {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
    // initial Form Responsibility_Ownership
    initialForm(data?: any) {
      this.Responsibility_Ownership = new FormGroup({
        organizationalUnitID: new FormControl(data?.organizationUnitID),
        responsibleUserID: new FormControl(data?.responsibleUserID),
        responsibleRoleID: new FormControl(data?.responsibleRoleID),
      });


      if(data && data?.organizationalUnitID){
        this._SharedService.orgainationalUnitLookUp().subscribe((res:any)=>{

          const id = this.findNodeById(this.transformNodes(res?.data) , data?.organizationalUnitID );
          this.Responsibility_Ownership.get('organizationalUnitID')?.setValue(id);
          this.Responsibility_Ownership.updateValueAndValidity()
        })

      }
    }
    // save or update Control Register


    normalizeDates(obj: any): any {
  const result: any = { ...obj };

  Object.keys(result).forEach((key) => {
    if (key.toLocaleLowerCase().includes('date')) {
      result[key] = moment(result[key]).utc(true).toISOString();
    }


  });

  return result;
}


    submit() {
      if (this.controlInformation.invalid) {
        this.controlInformation.markAllAsTouched();
        return;
      }

      this.saveDataLoader = true;

      const payload: any = {
         ...this.normalizeDates(this.controlInformation.value),
    ...this.normalizeDates(this.scopeTextForm.value),
    ...this.normalizeDates(this.documentRefrenceForm.value),
    ...this.normalizeDates(this.complianceStatusForm.value),
    ...this.normalizeDates(this.effectivinessStatusForm.value),
    ...this.normalizeDates(this.maturityForm.value),
    ...this.normalizeDates(this.implementationForm.value),
    ...this.normalizeDates(this.Responsibility_Ownership.value),
    ...this.normalizeDates(this.capForm.value),
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

      const submit = request$.pipe(finalize(()=>  this.saveDataLoader = false )).subscribe(() => {
        this.saveDataLoader = false;
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

    capForm!: FormGroup;
    isApplyingCap:boolean=false
    setApplyCap(event:any){
      event.stopPropagation()
      this.capForm.get('applyCap')?.setValue(this.isApplyingCap)
    }
    initCapForm(data?: any) {
      this.capForm = new FormGroup({
        minCap: new FormControl(data ? data?.minCap:null),
        maxCap: new FormControl(data ? data?.maxCap:null),
        govControlCapBehaviorTypeID: new FormControl( data ?
          data?.govControlCapBehaviorTypeID : null
        ),
        applyCap: new FormControl(data ? data?.applyCap : false),
      });
    }





  }
