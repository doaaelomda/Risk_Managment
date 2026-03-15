import {
  Component,
  EventEmitter,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { MessageService } from 'primeng/api';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GoveranceService } from '../../../service/goverance.service';
import { Subscription } from 'rxjs';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-controlassessment',
  imports: [
    UiDropdownComponent,
    TextareaUiComponent,
    ButtonModule,
    UiDropdownComponent,
    CommonModule,
    DialogModule,
    TranslateModule,
    FormsModule,
    SkeletonModule,
    ReactiveFormsModule,
    RadioButtonModule,
  ],
  templateUrl: './addControlassessment.component.html',
  styleUrl: './addControlassessment.component.scss',
})
export class AddControlassessmentComponent implements OnInit, OnChanges , OnDestroy {
  @Output() refreshTable = new EventEmitter<void>();
  selectedTypeId: any;
  show_prop: boolean = false;
  riskId = 1;
  loadingData: boolean = false;
  show_view = input<boolean>(false);
  hide_emitter = output<boolean>();
  mode = input<string>('add');
  updated_id = input<any>(null);
  current_tab: any;
  workflowsList: any[] = [];
  phases_list: any[] = [];
  stepsLabels: string[] = [];
  stepslabelspara: string[] = [];
  statusLabel = '';
  assessmentForm!: FormGroup;
  statusList: any[] = [];
  govControlId: any;
  statusVaildation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.STATUS' },
  ];
  constructor(
    private translate: TranslateService,
    private _messageService: MessageService,
    private _RiskService: RiskService,
    private route: ActivatedRoute,
    private GoveranceService: GoveranceService,
    private _PermissionSystemService:PermissionSystemService
  ) { }


  private sub$!:Subscription;
  ngOnInit() {
    this.initAssessmentForm();
    this.route.parent?.paramMap.subscribe((params) => {
      this.govControlId = Number(params.get('id'));
      console.log('Control ID:', this.govControlId);
    });
    this.loadLookups();
    this.sub$ = this.GoveranceService.selectedTypeId$.subscribe((id) => {
      this.selectedTypeId = id || 2;
      if (this.mode() === 'edit' && this.updated_id()) {
        switch (this.selectedTypeId) {
          case 1:
            this.GoveranceService.getImplementationControlsById(this.updated_id()).subscribe((res: any) => {

              this.initAssessmentForm(res?.data);
            })
            break;
          case 2:
            this.GoveranceService.getComplianceControlsById(this.updated_id()).subscribe((res: any) => {

              this.initAssessmentForm(res);
            })
            break;
          case 3:
            this.GoveranceService.getEffectiveControlsById(this.updated_id()).subscribe((res: any) => {
              this.initAssessmentForm(res);
            })
            break;
          case 4:
            this.GoveranceService.getMaturityControlsById(this.updated_id()).subscribe((res: any) => {
              this.initAssessmentForm(res);
            })
            break;

          default:
            break;
        }

        console.log('Edit mode with ID:', this.updated_id());
      }
    });
    // this.initAssessmentForm();
    this.loadTranslations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.show_prop = changes['show_view'].currentValue;

  }

  loadTranslations() {
    this.translate.get('STEPS.LABELS').subscribe((labels: string[]) => {
      this.stepsLabels = labels;
    });
    this.translate.get('STEPS.PARAGRAPHS').subscribe((paras: string[]) => {
      this.stepslabelspara = paras;
    });
    this.translate.get('ASSESSMENT.Status').subscribe((text) => {
      this.statusLabel = text;
    });
  }


  types_id_map = new Map<number, string>([
    [1, 'govControlImplementationStatusTypeID'],
    [2, 'controlComplianceStatusTypeID'],
    [3, 'govControlEffectivenessStatusTypeID'],
    [4, 'govControlMaturityLevelID'],
  ])

  initAssessmentForm(data?: any): void {
    this.assessmentForm = new FormGroup({
      controlComplianceStatusTypeID: new FormControl(data ? { disabled: true, value: data[this.types_id_map.get(this.selectedTypeId) || ''] } : null, [
        Validators.required,
      ]),
      findings: new FormControl(data ? data?.findings : null),
      risks: new FormControl(data ? data?.risks : null),
      recommendations: new FormControl(data ? data?.recommendations : null),
      GovControlAssessmentWorkflowStageID: new FormControl(data ? data?.govControlAssessmentWorkflowStageID : null),
      GovControlAssessmentPhaseID: new FormControl(data ? data?.govControlAssessmentPhaseTypeID : null),
    });
  }

  loadLookups() {
    this._RiskService
      .getRiskActionLookupData([65, 66, 67, 68, 69, 70 , 29])
      .subscribe((res) => {

        this.phases_list = res?.data?.GovControlAssessmentPhaseType;
        this.workflowsList = res?.data?.GovControlAssessmentWorkflowStage;

        switch (this.selectedTypeId) {
          case 1:
            this.statusList = res?.data?.ControlImplementationStatusType;
            break;
          case 2:
            this.statusList = res?.data?.ControlComplianceStatusType;
            break;
          case 3:
            this.statusList = res?.data?.ControlEffectivenessStatusType;
            break;
          case 4:
                  this.statusList = res?.data?.GovControlMaturityLevel;

            break;
        }
      });
  }
  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'ADD')
    const canEdit =this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'EDIT')

    if(this.mode() !== 'add' && !canEdit)return
    if(this.mode() === 'add' && !canAdd)return


    if (this.assessmentForm.invalid) {
      this.assessmentForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      ...this.assessmentForm.value,
      govControlID: this.govControlId,
    };

    this.loadingData = true;
    switch (this.selectedTypeId) {
      case 1:
        payload['govControlImplementationStatusTypeID'] =
          payload['controlComplianceStatusTypeID'];
        delete payload['controlComplianceStatusTypeID'];


        const API$ = this.mode() === 'add' ?
          this.GoveranceService.createImplementationControls(payload) :
          this.GoveranceService.updateImplementationControls(this.updated_id(), payload);

        API$.subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.mode() === 'add' ? 'Implementation Government Added Successfully' : 'Implementation Government Updated Successfully',
            });
            this.loadingData = false;
            this.assessmentForm.reset();
            this.hide_emitter.emit(false);
            this.refreshTable.emit();
          },
        });


        break;

      case 2:

        const complianceAPI$ = this.mode() === 'add' ?
          this.GoveranceService.createComplianceControls(payload) :
          this.GoveranceService.updateComplianceControls(this.updated_id(), payload);

        complianceAPI$.subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.mode() === 'add' ? 'Assessment Government Added Successfully' : 'Assessment Government Updated Successfully',
            });
            this.loadingData = false;
            this.assessmentForm.reset();
            this.hide_emitter.emit(false);
            this.refreshTable.emit();
          },
        });
        break;

      case 3:
        payload['govControlEffectivenessStatusTypeID'] =
          payload['controlComplianceStatusTypeID'];
        delete payload['controlComplianceStatusTypeID'];
        const effectiveAPI$ = this.mode() === 'add' ?
          this.GoveranceService.createeffectiveControls(payload) :
          this.GoveranceService.updateeffectiveControls(this.updated_id(), payload);
        effectiveAPI$.subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.mode() === 'add' ? 'Effective Government Added Successfully' : 'Effective Government Updated Successfully',
            });
            this.loadingData = false;
            this.assessmentForm.reset();
            this.hide_emitter.emit(false);
            this.refreshTable.emit();
          },
        });
        break;

      case 4:
        payload['govControlMaturityLevelID'] =
          payload['controlComplianceStatusTypeID'];
        delete payload['controlComplianceStatusTypeID'];
        const maturityAPI$ = this.mode() === 'add' ?
          this.GoveranceService.createMaturityControls(payload) :
          this.GoveranceService.updateMaturityControls(this.updated_id(), payload);
        maturityAPI$.subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.mode() === 'add' ? 'Maturity Government Added Successfully' : 'Maturity Government Updated Successfully',
            });
            this.loadingData = false;
            this.assessmentForm.reset();
            this.hide_emitter.emit(false);
            this.refreshTable.emit();
          },
        });
        break;
    }
  }



  ngOnDestroy(){
    this.sub$.unsubscribe()
  }
}
