import { TextareaUiComponent } from './../../../../../../shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { InputTextComponent } from './../../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesService } from '../../services/templates-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Button } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-template',
  imports: [
    CommonModule,
    TranslateModule,
    InputTextComponent,
    TextareaUiComponent,
    InputSwitchModule,
    ReactiveFormsModule,
    FormsModule,
    Button,
    RouterLink,
  ],
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss',
})
export class AddTemplateComponent {
  constructor(
    private _templateS: TemplatesService,
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private layout: LayoutService,
    private translate: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  templateId!: string;
  ngOnInit() {
    this.getTemplateId();
    this.initForm();
  }

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: `TEMPLATES.TEMPLATES_LIST`,
        routerLink: '/gfw-portal/questionnaire/templates',
      },
      {
        nameKey: this.templateId
          ? 'TEMPLATES.UPDATE_TEMPLATE'
          : 'TEMPLATES.ADD_NEW_TEMPLATE',
      },
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this.translate.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }

  form!: FormGroup;

  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
      isActive: new FormControl(data?.isActive ?? false),
    });
  }

  getTemplateId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.initBreadcrumb()
      if (!this.templateId) return;
      this.getTemplateById(this.templateId);
    });
  }

  getTemplateById(id: string) {
    this._templateS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      console.log(template_data, 'tdata');

      this.initForm(template_data);
    });
  }
  navigateBack() {
    this._router.navigate(['/gfw-portal/questionnaire/templates']);
  }
  isSavingTemplate: boolean = false;
  save() {
        const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'EDIT') 
    if(this.templateId && !canEdit)return
    if(!this.templateId && !canAdd)return
    if (this.form.invalid) return;
    const data = this.form.value;
    this.isSavingTemplate = true;

    const msg = this.templateId ? 'updated' : 'created';
    this._templateS.save(data, this.templateId).subscribe({
      next: (res) => {
        this.isSavingTemplate = false;
        this._messageS.add({
          severity: 'success',
          detail: `Template ${msg} successfully`,
        });
        this.navigateBack();
      },
      error: (err) => (this.isSavingTemplate = false),
    });
  }
}
