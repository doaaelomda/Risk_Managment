import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuadiliganseService } from '../../services/duadiliganse.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent, DatePackerComponent, UserDropdownComponent } from '@gfw/shared-ui';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-modify-duadiliganse',
  imports: [
    CommonModule,
    TranslateModule,
    InputTextComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    Button,
    RouterLink,
    InputNumberComponent,
    DatePackerComponent,
    UserDropdownComponent
],
  templateUrl: './modify-duadiliganse.component.html',
  styleUrl: './modify-duadiliganse.component.scss',
})
export class ModifyDuadiliganseComponent {
  form!: FormGroup;
  dueDiligenceId!: string;

  // Dropdown options
  thirdParties: any[] = [];
  dueDiligenceTypes: any[] = [];
  resultStatuses: any[] = [];
  responsibleRoles: any[] = [];
  responsibleUsers: any[] = [];

  isSaving: boolean = false;

  constructor(
    private _service: DuadiliganseService,
    private _activatedRoute: ActivatedRoute,
    private _messageService: MessageService,
    private _router: Router,
    private _sharedS:SharedService,
    private layout:LayoutService,
    private _translateS:TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {}
  tpId:string = ''
  ngOnInit() {
    this.dueDiligenceId =
      this._activatedRoute.snapshot.paramMap.get('dueDiligenceId') || '';
      this.tpId = this._activatedRoute.snapshot.paramMap.get('tpId') || '';
    this.initForm();
    this.loadDropdowns();

    if (this.dueDiligenceId) {
      this.getById(this.dueDiligenceId);
    }
 this.initBreadcrumb()


  }


      private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.THIRD_PARTY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey,routerLink:'/gfw-portal/third-party/list' },
      { nameKey: 'BREAD_CRUMB_TITLES.THIRD_PARTY_LIST',routerLink:`/gfw-portal/third-party/view/${this.tpId}/due-diligence` },
      {nameKey:this.dueDiligenceId ? 'DUE_DILIGENCES.UPDATE_DUE_DILIGENCE' : 'DUE_DILIGENCES.ADD_NEW_DUE_DILIGENCE'}
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this._translateS.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this._translateS.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }

  initForm(data?: any) {
    this.form = new FormGroup({
      thirdPartyID: new FormControl(
        data?.thirdPartyID ?data?.thirdPartyID: this.tpId ? this.tpId : null,
        Validators.required
      ),
      thirdPartyDueDiligenceTypeID: new FormControl(
        data?.thirdPartyDueDiligenceTypeID ?? null,
        Validators.required
      ),
        name: new FormControl(
        data?.name ?? null,
        Validators.required
      ),
        nameAr: new FormControl(
        data?.nameAr ?? null,
        Validators.required
      ),
      thirdPartyDueDiligenceResultStatusTypeID: new FormControl(
        data?.thirdPartyDueDiligenceResultStatusTypeID ?? null,
        Validators.required
      ),
      requestedDate: new FormControl(
        data?.requestedDate ? new Date(data.requestedDate) : null,
        Validators.required
      ),
      completedDate: new FormControl(
        data?.completedDate ? new Date(data.completedDate) : null
      ),
      score: new FormControl(data?.score ?? null, Validators.required),
      reportReference: new FormControl(
        data?.reportReference ?? '',
        Validators.required
      ),
      conditions: new FormControl(data?.conditions ?? '', Validators.required),
      resultSummary: new FormControl(
        data?.resultSummary ?? '',
        Validators.required
      ),
      responsibleRoleID: new FormControl(
        data?.responsibleRoleID ?? null,
        Validators.required
      ),
      responsibleUserID: new FormControl(
        data?.responsibleUserID ?? null,
        Validators.required
      ),
    });
  }

  thirdPartyList: any[] = [];
  dueDiligenceTypeList: any[] = [];
  resultStatusList: any[] = [];
  roleList: any[] = [];
  userList: any[] = [];

  loadDropdowns() {
    this._sharedS.lookUps([151,162,161]).subscribe(res => {
      this.thirdPartyList = res?.data?.ThirdParty
      this.dueDiligenceTypeList = res?.data?.ThirdPartyDueDiligenceType
      this.resultStatusList = res?.data?.ThirdPartyDueDiligenceResultStatusType
    })



    this._sharedS
      .getUserLookupData()
      .subscribe((res: any) => (this.userList = res?.data));
    this._sharedS
      .getRoleLookupData()
      .subscribe((res: any) => (this.roleList = res?.data));

  }

  getById(id: string) {
    this._service.getById(id).subscribe((res: any) => {
      this.initForm(res?.data);

    });
  }

  save() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'EDIT')
    if(this.dueDiligenceId && !canEdit)return
    if(!this.dueDiligenceId && !canAdd)return
    if (this.form.invalid) return;

    this.isSaving = true;
    const data = this.form.value;

    this._service.save(data, this.dueDiligenceId).subscribe({
      next: () => {
        this.isSaving = false;
        this._messageService.add({
          severity: 'success',
          detail: this.dueDiligenceId
            ? 'Updated successfully'
            : 'Created successfully',
        });

        this._router.navigate([`/gfw-portal/third-party/view/${this.tpId}/due-diligence`]);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
