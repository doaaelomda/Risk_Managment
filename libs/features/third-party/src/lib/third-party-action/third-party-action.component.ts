import { InputNumberComponent } from './../../../../../shared/shared-ui/src/lib/input-number/input-number.component';
import { InputUrlComponent } from './../../../../../shared/shared-ui/src/lib/input-url/input-url.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, forkJoin, switchMap, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

// Shared UI components
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ButtonModule } from 'primeng/button';

// Your service (you’ll need to create it)
import { ThirdPartyService } from '../../services/third-party.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { TextareaUiComponent } from "@gfw/shared-ui";

@Component({
  selector: 'lib-third-party-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    InputUrlComponent,
    InputNumberComponent,
    TextareaUiComponent
],
  templateUrl: './third-party-action.component.html',
  styleUrl: './third-party-action.component.scss',
})
export class ThirdPartyActionComponent implements OnInit {
  thirdPartyForm!: FormGroup;
  current_update_id: any;
  isLoading = false;

  countries: any[] = [];
  statusTypes: any[] = [];

  breadCrumb: any[] = [];

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _ThirdPartyService: ThirdPartyService,
    private _MessageService: MessageService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THIRD_PARTY'),
        icon: '',
        routerLink: '/gfw-portal/third-party',
      },
      { name: '-', icon: '', routerLink: '' },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

    this.initForm();
    this.loadLookups();
    this.handleRouteParams();
  }

  private initForm(data?: any): void {
    this.thirdPartyForm = new FormGroup({
      // legalName: new FormControl(data?.legalName, Validators.required),
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description, ),
      descriptionAr: new FormControl(data?.descriptionAr, ),
      notes: new FormControl(data?.notes, ),
      postalCode: new FormControl(data?.postalCode, ),
      stateProvince: new FormControl(data?.stateProvince, ),
      thirdPartyCriticalityLevelTypeID: new FormControl(data?.thirdPartyCriticalityLevelTypeID, ),
      thirdPartyCategoryTypeID: new FormControl(data?.thirdPartyCategoryTypeID, ),
      // 
      registrationNumber: new FormControl(data?.registrationNumber, ),
      primaryEmail: new FormControl(data?.primaryEmail, [Validators.required,Validators.email]),
      primaryPhone: new FormControl(data?.primaryPhone, ),
      website: new FormControl(data?.website),
      addressLine1: new FormControl(data?.addressLine1, ),
      city: new FormControl(data?.city, ),
      thirdPartyStatusTypeID: new FormControl(data?.statusTypeId, ),
      countryID: new FormControl(data?.countryId, ),
    });
  }

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name = this._TranslateService.instant('THIRD_PARTY.ADD_NEW_THIRD_PARTY');
            return [];
          }
          this.current_update_id = id;
          this.breadCrumb[this.breadCrumb.length - 1].name = this._TranslateService.instant('THIRD_PARTY.UPDATE_THIRD_PARTY');
          return this._ThirdPartyService.getThirdPartyById(id);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) this.initForm(res.data);
      });
  }
ThirdPartyCriticalityLevelType:any[] = []
ThirdPartyCategoryType:any[] = []
  private loadLookups(): void {
    forkJoin([
      this._SharedService.lookUps([166,169,154,159]),
    ]).subscribe((res: any[]) => {
      this.statusTypes = res[0]?.data?.ThirdPartyStatusType ?? [];
      this.countries = res[0]?.data?.Country ?? [];
      this.ThirdPartyCriticalityLevelType = res[0]?.data?.ThirdPartyCriticalityLevelType ?? []
      this.ThirdPartyCategoryType = res[0]?.data?.ThirdPartyCategoryType ?? []
    });
  }

  submit(): void {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.thirdPartyForm.invalid) return;
    this.isLoading = true;
    const registrationNumber = this.thirdPartyForm.get('registrationNumber')
    const primaryPhone = this.thirdPartyForm.get('primaryPhone')
    const postalCode = this.thirdPartyForm.get('postalCode')
    registrationNumber?.setValue(`${registrationNumber?.value}`)
    primaryPhone?.setValue(`${primaryPhone?.value}`)
    postalCode?.setValue(`${postalCode?.value}`)
    const req = { ...this.thirdPartyForm.value };
    if (this.current_update_id) req.thirdPartyId = this.current_update_id;

    const API$: Observable<any> = this.current_update_id
      ? this._ThirdPartyService.updateThirdParty(req)
      : this._ThirdPartyService.addThirdParty(req);

    API$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? 'Third Party Updated Successfully'
          : 'Third Party Added Successfully',
      });
      this._Router.navigate(['/gfw-portal/third-party/list']);
    });
  }
}
