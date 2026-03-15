import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EsclationService } from '../../../services/esclation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserDropdownComponent } from 'libs/shared/shared-ui/src/lib/user-dropdown/user-dropdown.component';
import { RoleDropdownComponent } from 'libs/shared/shared-ui/src/lib/role-dropdown/role-dropdown.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-level-esclation-target',
  imports: [
    CommonModule,
    TranslateModule,
    UserDropdownComponent,
    RoleDropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent,
    Button,
  ],
  templateUrl: './level-esclation-target.component.html',
  styleUrl: './level-esclation-target.component.scss',
})
export class LevelEsclationTargetComponent {
  constructor(
    private _activatedR: ActivatedRoute,
    private _esclationS: EsclationService,
    private _router: Router,
    private _sharedService: SharedService,
    private _messageS: MessageService,
    private _riskS: RiskService,
    private _translateS: TranslateService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {}
  ngOnInit() {
    this.handleSteps();
    this.initForm();
    this.getRolesLookUp();
    this.getLookUps();
    this.getUsersLookUp();

    this.selections = [
      {
        title: this._translateS.instant('ESCLATION.ROLE_BASED_ESCLATION'),
        icon: 'fi fi-rr-chart-user',
        desc: this._translateS.instant('ESCLATION.ESCLATION_ROLE_BASED_DESC'),
        id: '1',
      },
      {
        title: this._translateS.instant('ESCLATION.ORGANIZATIONAL_ESCLATION'),
        icon: 'fi fi-rr-light-emergency-on',
        desc: this._translateS.instant('ESCLATION.ESCLATION_ORG_DESC'),
        id: '2',
      },
    ];
  }
  levelId: any = '';
  getLevelById(id: any) {
    this._esclationS.getLevelById(id).subscribe((res: any) => {
      console.log(res, 'level data');

      if (res?.data?.escalationTargetTypeID) {
        this.selectedItem = `${res?.data?.escalationTargetTypeID}`;
      }
      this.initForm(res?.data);
    });
  }
  handleSteps() {
    combineLatest([
      this._activatedR.paramMap,
      this._activatedR.parent?.paramMap || [],
    ]).subscribe(([childParams, parentParams]) => {
      const id = parentParams?.get('id');
      if (id) {
        this._esclationS.getEsclationById(+id).subscribe({
          next: (res) => {
            this.getEntityTypeAttributes(res.data.dataEntityTypeID);
          },
        });
      }
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._translateS.instant('ESCALATION.BREADCRUMB'),
          icon: '',
          routerLink: '/gfw-portal/escalation',
        },
        {
          name: this._translateS.instant('ESCALATION.LIST_TITLE'),
          icon: '',
          routerLink: '/gfw-portal/esclation/list',
        },
        {
          name: this._translateS.instant('ESCLATION.ESCLATION'),
          icon: '',
          routerLink: `/gfw-portal/esclation/view/${id}/overview`,
        },
        {
          name: this._translateS.instant('ESCLATION.ESCLATION_TARGET'),
          icon: '',
          routerLink: '',
        },
      ]);
      const levelId = childParams?.get('levelId');
      this.levelId = levelId;
      this.getLevelById(levelId);
      this._esclationS.activeStep.next(4);
      this._esclationS.updateStep(2, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-criteria/${levelId}`,
          ]);
        },
      });
      this._esclationS.updateStep(4, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-notfications/${levelId}`,
          ]);
        },
      });
    });
  }
  selectedItem: any = '1';
  levels = [
    {
      label: 'Level 1',
      id: 1,
    },
    {
      label: 'Level 2',
      id: 2,
    },
    {
      label: 'Level 3',
      id: 3,
    },
    {
      label: 'Level 4',
      id: 4,
    },
    {
      label: 'Level 5',
      id: 5,
    },
    {
      label: 'Level 6',
      id: 6,
    },
    {
      label: 'Level 7',
      id: 7,
    },
  ];
  selections: any[] = [];

  targetForm!: FormGroup;
  initForm(data?: any) {
    this.targetForm = new FormGroup({
      notifyRoleID: new FormControl(data?.notifyRoleID),
      notifyUserID: new FormControl(data?.notifyUserID),
      targetOrganizationLevel: new FormControl(data?.targetOrganizationLevel),
      dataEntityTypeAttributeID: new FormControl(
        data?.dataEntityTypeAttributeID
      ),
    });
  }
  entityTypeAttributes: any[] = [];
  getEntityTypeAttributes(dataEntityTypeId: number) {
    this._esclationS.getAttributesRoles(dataEntityTypeId).subscribe((res: any) => {
      console.log(res, 'got attr');
      this.entityTypeAttributes = res?.data;
    });
  }
  checkSaveBtnValidation() {
    const roleValue = this.targetForm.get('notifyRoleID')?.value;
    const userValue = this.targetForm.get('notifyUserID')?.value;
    const levelValue = this.targetForm.get('targetOrganizationLevel')?.value;
    const attributeValue = this.targetForm.get(
      'dataEntityTypeAttributeID'
    )?.value;
    const hasNoUserAndRole = !userValue && !roleValue;
    const hasNoLevelOrAttr = !levelValue || !attributeValue;
    const shouldntSave =
      (this.selectedItem == 1 && hasNoUserAndRole) ||
      (this.selectedItem == 2 && hasNoLevelOrAttr);
    return shouldntSave;
  }
  handleSelectChange(selectionId: any) {
    if(!this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONTARGET' , 'EDIT'))return
    this.selectedItem = selectionId;
    if (selectionId == '1') {
      this.targetForm.get('targetOrganizationLevel')?.setValue(null);
      this.targetForm.get('dataEntityTypeAttributeID')?.setValue(null);
    } else {
      this.targetForm.get('notifyRoleID')?.setValue(null);
      this.targetForm.get('notifyUserID')?.setValue(null);
    }
  }
  isLoadingTarget: boolean = false;
  saveTarget() {
    this.isLoadingTarget = true;
    const data = { ...this.targetForm.value, escalationLevelID: this.levelId };
    this._esclationS.saveTargets(data, this.selectedItem).subscribe({
      next: (res) => {
        this._messageS.add({
          severity: 'success',
          detail: 'Target updated successfully',
        });
        this.isLoadingTarget = false;
      },
      error: (err) => {
        this.isLoadingTarget = false;
      },
    });
  }
  handleCancel() {}

  rolesLookUpData: any[] = [];
  usersLookUpData: any[] = [];
  getRolesLookUp() {
    this._sharedService.getRoleLookupData().subscribe((res) => {
      console.log(res, 'roles here');
      this.rolesLookUpData = res?.data;
    });
  }
  getUsersLookUp() {
    this._sharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.usersLookUpData = res?.data;
    });
  }

  getLookUps() {
    // this._riskS.getRiskActionLookupData([130]).subscribe((res) => {
    //   this.levels = res?.data?.EscalationLevel;
    // });
  }
}
