import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent } from './../../../../../shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StandardDocsService } from '../services/standard-docs.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-save-standard-doc',
  imports: [
    CommonModule,
    TranslateModule,
    InputTextComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    InputSwitchModule,
    Button,
    RouterLink,
  ],
  templateUrl: './save-standard-doc.component.html',
  styleUrl: './save-standard-doc.component.scss',
})
export class SaveStandardDocComponent {
  constructor(
    private _standardService: StandardDocsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _message: MessageService,
    private sharedService: SharedService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  form!: FormGroup;
  standardId!: string;
  isSavingStandard = false;

  standardTypeList:any[] = [];
  GovControlMaturityLevelType:any[] = [];

  ngOnInit() {
    this.getLookUps();
    this.getStandardId();
    this.initForm();
  }
  
  getLookUps() {
    this.sharedService.lookUps([205 , 30,242]).subscribe((res) => {
      this.standardTypeList = res?.data?.GovernanceStandardType;
      this.GovControlMaturityLevelType = res?.data?.GovControlMaturityLevelType
      this.classificationProfiles = res?.data?.GRCDocumentElementClassificationProfile
    });
  }
  classificationProfiles:any[] = []
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      shortName: new FormControl(data?.shortName ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
      version: new FormControl(data?.version ?? null),
      governanceStandardTypeID: new FormControl(
        data?.governanceStandardTypeID ?? null,
        Validators.required
      ),
      govControlMaturityLevelTypeID: new FormControl(
        data?.govControlMaturityLevelTypeID ?? null
      ),
      grcDocumentElementClassificationProfileID:new FormControl(data?.grcDocumentElementClassificationProfileID ?? null)
    });
  }

  getStandardId() {
    this._route.paramMap.subscribe((res) => {
      this.standardId = res.get('id')!;
      if (this.standardId) this.getStandardById(this.standardId);
    });
  }

  getStandardById(id: string) {
    this._standardService.getById(id).subscribe((res) => {
      this.initForm(res.data);
    });
  }

  save() {
    const canAdd = this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS' , 'EDIT')
    if(this.standardId && !canEdit)return
    if(!this.standardId && !canAdd)return
    if (this.form.invalid) return;
    this.isSavingStandard = true;
    const data = this.form.value;

    this._standardService.save(data, this.standardId).subscribe({
      next: () => {
        this.isSavingStandard = false;
        const msg = this.standardId ? 'updated' : 'created';
        this._message.add({
          severity: 'success',
          detail: `Governance Standard ${msg} successfully`,
        });
        this._router.navigate(['/gfw-portal/library/standard-docs']);
      },
      error: () => (this.isSavingStandard = false),
    });
  }
}
