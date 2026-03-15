import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessListService } from '../../processList/process-list.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-process-action',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    TranslateModule,
    TextareaUiComponent,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './process-action.component.html',
  styleUrl: './process-action.component.scss',
})
export class ProcessActionComponent {
  processId: any;
  isLoading: boolean = false;
  processForm!: FormGroup;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ProcessListService: ProcessListService,
    private _ActivatedRoute: ActivatedRoute,
    private _permissionService: PermissionSystemService
  ) {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.processId = res.get('processId');
      if (this.processId) {
        this.ProcessListService.getprocessById(this.processId).subscribe(
          (res: any) => {
            this.initprocessForm(res?.data);
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
            routerLink: '/gfw-portal/process/list',
          },
          {
            name: this.processId
              ? this._TranslateService.instant('PROCESS.Update_process')
              : this._TranslateService.instant('PROCESS.Add_process'),
            icon: '',
            routerLink: '/gfw-portal/process/list',
          },
        ]);
      }
    });
    this.initprocessForm();
  }

  initprocessForm(data?: any) {
    this.processForm = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
    });
  }
  submit() {
              // ===== Permissions =====
  const hasPermission = this.processId
    ? this._permissionService.can('BUSINESSPROCESS' , 'PROCESS', 'EDIT')
    : this._permissionService.can('BUSINESSPROCESS' , 'PROCESS', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.processForm.value,
    };

    if (this.processId) {
      req['businessProcessID'] = this.processId;
    }

    const API$ = this.processId
      ? this.ProcessListService.updateprocess(req)
      : this.ProcessListService.addNewprocess(req);

    API$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.processId
          ? 'process Updated Successfully'
          : 'process Added Successfully ',
      });
      this._Router.navigate(['/gfw-portal/BPM/process-list']);
    });
  }
}
