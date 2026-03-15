import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { EditorComponent } from './../../../../../../shared/shared-ui/src/lib/editor/editor.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-compagine-messages',
  imports: [
    CommonModule,
    InputTextComponent,
    EditorComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './compagine-messages.component.html',
  styleUrl: './compagine-messages.component.scss',
})
export class CompagineMessagesComponent implements OnInit {
  campaign_form!: FormGroup;
  validationRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  compagnieId: any;
  constructor(
    private _AwarenessService: AwarenessService,
    private _MessageService: MessageService,
    private _router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.compagnieId = res.get('id');
      if (this.compagnieId) {
        this._AwarenessService
          .getCampaignById(this.compagnieId)
          .subscribe((res: any) => {
            this.initForm(res?.data);
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: res?.data.name,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.compagnieId}/overview`,
              },
              {
                name: this._TranslateService.instant(
                  'NOTIFICATION_SETTING.MESSAGES'
                ),
                icon: '',
              },
            ]);
          });
      }
    });
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm(data?: any) {
    this.campaign_form = new FormGroup({
      deliverySubject: new FormControl(
        data?.deliverySubject,
        Validators.required
      ),
      deliveryMessage: new FormControl(
        data?.deliveryMessage,
        Validators.required
      ),
    });
  }

  isLoading: boolean = false;

  submit() {
    if (
      !this._PermissionSystemService.can(
        'AWARNESS',
        'CAMPAIGNSMESSAGE',
        'VIEW'
      )
    )
      return;
    if (this.campaign_form.invalid) {
      this.campaign_form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.campaign_form.value,
      campaignId: this.compagnieId,
    };

    this._AwarenessService
      .updateMessagesCompagnie(payload)
      .subscribe((res: any) => {
        this.isLoading = false;
        this._MessageService.add({
          summary: 'success',
          severity: 'success',
          detail: 'Update Compagnie Messages',
        });
        this.campaign_form.reset();
        this._router.navigate([
          `/gfw-portal/awareness/compagine-setup/${this.compagnieId}/overview`,
        ]);
      });
  }
}
