import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SectionsService } from '../../services/sections.service';
import { Button } from "primeng/button";
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberComponent } from "libs/shared/shared-ui/src/lib/input-number/input-number.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-section',
  imports: [CommonModule, Button, InputTextComponent, ReactiveFormsModule, FormsModule, TranslateModule, RouterLink, InputNumberComponent],
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.scss',
})
export class AddSectionComponent {
  constructor(
    private _sectionService: SectionsService,
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  templateId!: string;
  ngOnInit() {
    this.getTemplateId();
    this.initForm();
  }

  form!: FormGroup;

  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      weight:new FormControl(data?.weight ?? null, Validators.required),
      displayOrder:new FormControl(data?.displayOrder ?? null, Validators.required)
    });
  }
  sectionId!:string
  getTemplateId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      if(!this.sectionId) return
      this.getTemplateById(this.sectionId);
    });
  }

  getTemplateById(id: string) {
    this._sectionService.getById(id).subscribe((res) => {
      const section_data = res?.data;
      console.log(section_data, 'sdata');

      this.initForm(section_data);
    });
  }
  navigateBack() {
    this._router.navigate([`/gfw-portal/questionnaire/templates/${this.templateId}/sections`]);
  }
  isSavingTemplate: boolean = false;
  save() {
    
    const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'EDIT') 
    if(this.sectionId && !canEdit)return
    if(!this.sectionId && !canAdd)return
    if (this.form.invalid) return;
    const data = this.form.value;
    this.isSavingTemplate = true;

    const msg = this.sectionId ? 'updated' : 'created';
    this._sectionService.save(data, this.templateId,this.sectionId).subscribe({
      next: (res) => {
        this.isSavingTemplate = false;
        this._messageS.add({
          severity: 'success',
          detail: `Section ${msg} successfully`,
        });
        this.navigateBack();
      },
      error: (err) => (this.isSavingTemplate = false),
    });
  }
}
