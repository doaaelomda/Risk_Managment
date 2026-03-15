// eslint-disable-next-line @nx/enforce-module-boundaries
import { AttachUiComponent, UserDropdownComponent } from '@gfw/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { RiskService } from '../../services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TextareaUiComponent } from '@gfw/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CurrencyInputComponent } from '@gfw/shared-ui';
import { AccordionModule } from 'primeng/accordion';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DatePackerComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { MethodologyImpactsService } from '../../services/methodology-impacts.service';
import { MethodologyLikehoodsService } from '../../services/methodology-likehoods.service';

@Component({
  selector: 'lib-risk-mitigation-action',
  imports: [UserDropdownComponent,ButtonModule,DatePackerComponent,CommonModule,TextareaUiComponent,AccordionModule,UiDropdownComponent,CurrencyInputComponent ,SkeletonModule, InputTextComponent, TranslateModule, ReactiveFormsModule, FormsModule],
  templateUrl: './risk-mitigation-action.component.html',
  styleUrl: './risk-mitigation-action.component.scss',
})
export class RiskMitigationActionComponent implements OnInit {
  nameSubRisk:any
  RiskMitigationID:any
  RiskExistenceStatusType:any[]=[]
  showWF:boolean = true
  constructor(private _SharedService:SharedService,private _messageService:MessageService,
    private _router :Router,private _TranslateService: TranslateService, private _LayoutService: LayoutService,
     private _RiskService: RiskService, private _ActivatedRoute: ActivatedRoute,public _PermissionSystemService:PermissionSystemService, private methodologyImpactService:MethodologyImpactsService,
    private methodologyLikelihoodsService:MethodologyLikehoodsService) {
      this.showWF = this._PermissionSystemService.showWF()
   this.initMainInfoForm();
   this.initAttachmentForm();
   this.initTargetForm();
   this.initResposbilityForm();
   this.initTimeLinesForm();
    this.loadUser()
    this._LayoutService.breadCrumbAction.next(null);
    this._LayoutService.breadCrumbTitle.next(
      this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
    );
       this.getLookUpListsData()
    this.loadRoles()
    this.loading_data = true;
    this.RiskMitigationID = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    this.riskId = Number(this._ActivatedRoute.snapshot.paramMap.get('riskID'));

 this._ActivatedRoute.paramMap
  .pipe(
    tap(params => this.current_risk_id = params?.get('riskID')),
    switchMap(params => {
      const mitigationId = params.get('id');
      if (mitigationId) {
        return this._RiskService.getOneRiskMitagation(Number(mitigationId)).pipe(
          tap((res: any) => {
            this.nameSubRisk = res.data.name;
            this.initMainInfoForm(res.data);
            this.initTargetForm(res.data);
            this.initResposbilityForm(res.data);
            this.initTimeLinesForm(res.data);
            
          })
        );
      } else {
        return this._RiskService.getOneRisk(this.current_risk_id);
      }
    })
  )
  .subscribe(() => {
    this.loading_data = false;
    this._RiskService.getOneRisk(this.current_risk_id)
      .subscribe((risk: any) => {
        this.current_risk_data = risk?.data
        this.getImpactsAndLikelihood(risk?.data?.riskMethodologyID)
      });
      
  });

this._LayoutService.breadCrumbLinks.next([
  {
    name: '',
    icon: 'fi fi-rs-home',
    routerLink: '/'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
  {
    name: this._TranslateService.instant('MIGITATION.MIGITATION_PLANS'),
    icon: '',
    routerLink: `/gfw-portal/risks-management/risk/${this.current_risk_id}/mitigation-plans`
  },
  {
    name: this._TranslateService.instant('MIGITATION.ADD_PALN'),
    icon: ''
  },
]);





this._LayoutService.breadCrumbAction.next(null);

  }
    ngOnInit() {
  this.resposibility_form.get('assessedByUserID')?.valueChanges.subscribe(selectedId => {
    this.onManagerTeamChange(selectedId)
  });
}


    getLookUpListsData() {
    this._RiskService.getRiskActionLookupData([18,19,20,21,3]).subscribe({
      next: (res: any) => {
              // this.work_flows = res?.data?.WorkFlow
              this.work_flows = res?.data?.WorkFlow
      // this.impactArray = res?.data?.TargetRiskImpact
      this.resaponse_types=res?.data?.RiskResponseType
      // this.likehoodarray = res?.data?.TargetRiskLikelihood
      this.RiskExistenceStatusType=res?.data?.RiskMitigationPlanStatusType
      }})
    }
  riskId:any;
  validationsCode: validations[] = [
    {
      key: 'required',
      message: 'Plan Code Is Requirednn',
    },
  ];

  validationsTitle: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.PLAN_REQUIRED',
    },
  ];


   validationsSummary: validations[] = [
    {
      key: 'required',
      message: ' Plan Description Is Required',
    },
  ];
   validationsResponseType: validations[] = [
    {
      key: 'required',
      message: ' Plan Response Type Is Required',
    },
  ];
   validationBudget: validations[] = [
    {
      key: 'required',
      message: ' Plan Budget  Is Required',
    },
  ];
    validationsAttachmentTitle: validations[] = [
    {
      key: 'required',
      message: 'Attachment Title is required',
    },
  ];

  validationsAttachmentType: validations[] = [
    {
      key: 'required',
      message: 'Attachment Type is required',
    },
  ];


  current_risk_id: any;

  current_risk_data: any=null;
  loading_data: boolean = false;


  form_main_info !: FormGroup;


  initMainInfoForm(data?: any) {
    this.form_main_info = new FormGroup({
      // planCode: new FormControl(data?.code),
      name: new FormControl(data?.name, [Validators.required]),
      description: new FormControl(data?.description?data?.description:null),
      wfid: new FormControl(data?.wfid ? data?.wfid:null),
      riskResponseTypeID: new FormControl(data?.riskResponseTypeID ? data?.riskResponseTypeID : null
      , [Validators.required]),
      budget: new FormControl(data?.budget),
      // riskMitigationPlanStatusTypeID : new FormControl(data?.riskMitigationPlanStatusID ? data?.riskMitigationPlanStatusID : null ),
    })
  }

    validationsWF: validations[] = [
    {
      key: 'required',
      message: 'Plan Work Flow Is Required',
    },
  ];


  work_flows:any[]=[

  ];
  resaponse_types:any[]=[

  ];




    selectedAttachmens: { title: string; type: any; file: File }[] = [];
  attachment_form!: FormGroup;

  removeAttach(i?: number) {
    if (i !== undefined) {
      this.selectedAttachmens.splice(i, 1);
    } else {
      this.selectedAttachmens.pop();
    }
  }
  initAttachmentForm(data?: any) {
    this.attachment_form = new FormGroup({
      title: new FormControl(null),
      type: new FormControl(null),
    });
  }
  attachment_types: any[] = [
    {
      id: 1,
      label: 'Type 1',
    },
    {
      id: 2,
      label: 'Type 2',
    },
    {
      id: 3,
      label: 'Type 3',
    },
  ];
  handleSelectedAttachment(file: File) {
    const attachmentData = {
      title: this.attachment_form.get('title')?.value,
      type: this.attachment_form.get('type')?.value,
      file: file,
    };
    this.selectedAttachmens.push(attachmentData);
    this.attachment_form.reset();
    console.log('Selected file from risk comp:', this.selectedAttachmens);
  }



  target_form!:FormGroup;
  initTargetForm(data?:any) {
    this.target_form = new FormGroup({
      targetRiskImpactID: new FormControl(data?.targetRiskImpactID),
      targetRiskLikelihoodID: new FormControl(data?.targetRiskLikelihoodID),
      justificationTargetedRiskImpact: new FormControl(data?.justificationTargetRiskImpact),
      justificationTargetedRiskLikelihood: new FormControl(data?.justificationTargetRiskLikelihood),
    })
  }



    showErrorResponsbility: boolean = false;
    resposibility_form!: FormGroup;

      initResposbilityForm(data?: any) {
    this.resposibility_form = new FormGroup({
      managerRoleID: new FormControl(data ? data?.managerRoleID : null),
      managerUserID: new FormControl(data ? data?.managerUserID : null),
      // reviewedByUserID: new FormControl(data ? data?.reviewedByUserID : null),
      // approvedByUserID: new FormControl(data ? data?.approvedByUserID : null),
    });
  }



impactArray:any
likehoodarray:any
mangers:any
reviewer=[
  {id:1,label:'rev1'},
  {id:2,label:'rev2'},
  {id:3,label:'rev3'}
]
reviwer:any[]=[]
assessed:any[]=[]
 loadRoles() {
    this._RiskService.getRoles().subscribe((res:any) => {
      // this.mangers = res;
      this.reviwer =res?.data
      this.assessed=JSON.parse(JSON.stringify(res?.data))
    });
  }
    loadUser() {
    this._SharedService.getUserLookupData().subscribe((res:any)=>{
      this.users = res?.data;
      this.mangers = JSON.parse(JSON.stringify(res?.data))
    })

  }

  onManagerTeamChange(selected: any) {

  this.mangerTeamId =selected
}
mangerTeamId:any
assessorArray=[
  {id:1,label:'assessor1'},
  {id:2,label:'assessor2'},
  {id:3,label:'assessor3'}
]

users:any
    timelines_from!: FormGroup;

    initTimeLinesForm(data?: any) {
  this.timelines_from = new FormGroup({
    expectedStartDate: new FormControl(
      data?.expectedStartDate ? moment(new Date(data.expectedStartDate)).format('MM-DD-YYYY') : null
    ),
    expectedEndDate: new FormControl(
      data?.expectedEndDate ? moment(new Date(data.expectedEndDate)).format('MM-DD-YYYY') : null
    ),
    actualStartDate: new FormControl(
      data?.actualStartDate ? moment(new Date(data.actualStartDate)).format('MM-DD-YYYY') : null
    ),
    actualEndDate: new FormControl(
      data?.actualEndDate ? moment(new Date(data.actualEndDate)).format('MM-DD-YYYY') : null
    ),
    // approveDate: new FormControl(
    //   data?.approveDate ? moment(new Date(data.approveDate)).format('MM-DD-YYYY') : null
    // ),
  });
}




    isLoading:boolean = false;

    showErrorClassfication: boolean = false;
 submit() {
  const isUpdate = !!+this.RiskMitigationID;

  // ===== Permissions =====
  const hasPermission = isUpdate
    ? this._PermissionSystemService.can('RISKS', 'TREATMENT', 'EDIT')
    : this._PermissionSystemService.can('RISKS', 'TREATMENT', 'ADD');

  if (!hasPermission) {
    return;
  }

  // ===== Forms Validation =====
  const forms = [
    this.form_main_info,
    this.resposibility_form,
    this.target_form,
    this.attachment_form,
    this.timelines_from,
  ];

  const hasInvalidForm = forms.some(form => form.invalid);

  if (hasInvalidForm) {
    forms.forEach(form => form.markAllAsTouched());

    this.showErrorResponsbility = this.resposibility_form.invalid;
    this.showErrorClassfication = this.form_main_info.invalid;

    return;
  }

  // ===== Build Payload =====
  const fullPayload = {
    ...this.form_main_info.value,
    ...this.resposibility_form.value,
    ...this.attachment_form.value,
    ...this.target_form.value,
    ...this.timelines_from.value,
  };

  ['expectedStartDate', 'expectedEndDate', 'approveDate'].forEach(key => {
    if (fullPayload[key]) {
      fullPayload[key] = moment(fullPayload[key], 'MM-DD-YYYY')
        .utc(true)
        .toISOString();
    }
  });

  const payload = Object.fromEntries(
    Object.entries(fullPayload).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
  );

  payload['riskID'] = +this.riskId;

  if (isUpdate) {
    payload['riskMitigationPlanID'] = +this.RiskMitigationID;
  }

  // ===== API Call =====
  this.isLoading = true;

  const request$ = isUpdate
    ? this._RiskService.updatemitigationRisk(this.riskId, payload)
    : this._RiskService.savemitigationRisk(payload);

  request$.subscribe({
    next: () => {
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: isUpdate
          ? 'Risk Mitigation updated successfully'
          : 'Risk Mitigation saved successfully',
      });

      this._router.navigate([
        `gfw-portal/risks-management/risk/${this.current_risk_id}/mitigation-plans`,
      ]);
    },
    error: () => {
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    },
  });
}



  backList(){
    this._router.navigate([`gfw-portal/risks-management/risk/${this.current_risk_id}/mitigation-plans`]);
  }

  getImpactsAndLikelihood(id:number){
    const payload = {
      search:null,
      filters:[],
      pageNumber:1,
      pageSize:9999,
      sortField:null,
      sortDirection:1,
      riskMethodologyID:id
    }
  forkJoin({
    impacts:this.methodologyImpactService.findAll(payload),
    likelihoods:this.methodologyLikelihoodsService.findAll(payload)
  }).subscribe({
    next:({impacts,likelihoods}) => {
      this.impactArray = impacts?.data?.items
      this.likehoodarray = likelihoods?.data?.items
      console.log(impacts,'impacts');
      console.log(likelihoods,'likelihoods');
      
    }
  })

}

}
