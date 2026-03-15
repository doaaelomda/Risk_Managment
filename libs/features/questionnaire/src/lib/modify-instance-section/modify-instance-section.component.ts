import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSectionsService } from '../services/instance-sections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { Button } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InstanceService } from '../services/instance.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-modify-instance-section',
  imports: [
    CommonModule,
    InputNumberComponent,
    InputTextComponent,
    Button,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    TextareaUiComponent,
  ],
  templateUrl: './modify-instance-section.component.html',
  styleUrl: './modify-instance-section.component.scss',
})
export class ModifyInstanceSectionComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private _instanceSectionsS: InstanceSectionsService,
    private layout: LayoutService,
    private _translateS: TranslateService,
    private _SharedService: SharedService,
    private _instanceS: InstanceService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.moduleName = permissions?.module
    this.featureName= permissions?.feature
  }
  moduleName!:string;
featureName!:string;
  templateId!: string;
  dataResolver: any;
  newBreadCrumb: any[]=[];
  riskTitle: any;
  dataBreadCrumb: any;
  idValue: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  data: any;
  ngOnInit() {
    this.getTemplateId();
    this.initForm();
  }

  initialBreadCrumb() {
    this._activatedRoute.data.subscribe((res) => {
      if (res['breadCrumbData']) {
        this.dataResolver = res['resolvedHandler'];

        this.newBreadCrumb = [...res['breadCrumbData']];
        this.getData(res['url_entity_id']);
      } else {
        this.dataBreadCrumb = [
          { name: this._translateS.instant(this.containerKey) },
          {
            name: this._translateS.instant('INSTANCES.INSTANCES_LIST'),
            routerLink: '/gfw-portal/questionnaire/instance',
          },

          {
            name: this._translateS.instant('TEMPLATES.SECTIONS_LIST'),
            routerLink: `/gfw-portal/questionnaire/instance/${this.instanceId}/sections`,
          },

          {
            name: this.sectionId
              ? this.section_data?.name
              : this._translateS.instant('TEMPLATES.ADD_NEW_SECTION')
          },
        ];
        this.layout.breadCrumbLinks.next(this.dataBreadCrumb);
      }
    });
  }
  getData(url: any) {
    this._SharedService
      .getEntityByUrl(url + this.dataResolver?.entityId)
      .subscribe((res: any) => {
        this.riskTitle = res?.data?.riskTitle;
        this.newBreadCrumb.splice(2, 0, {
          name: this.riskTitle || res?.data?.legalName || res?.data?.name,
          routerLink: `/gfw-portal/risks-management/risk/${this.dataResolver?.entityId}/overview`,
        }); this.newBreadCrumb.splice(3, 0, {
  name: 'Questionnaire',
  routerLink: `/gfw-portal/risks-management/risk/${this.dataResolver?.entityId}/questionnaire/list`,
});
        if (this.instanceId) {
          this.newBreadCrumb.splice(4, 0, {
            name: this.data?.name,
            routerLink: `/gfw-portal/risks-management/risk/${this.dataResolver?.entityId}/questionnaire/instance/${this.instanceId}/overview`,
          },
        );
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
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
      weight: new FormControl(data?.weight ?? null, Validators.required),
      displayOrder: new FormControl(
        data?.displayOrder ?? null,
        Validators.required
      ),
    });
  }
  sectionId!: string;
  instanceId!: string;
  getTemplateId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      this.instanceId = res.get('instanceId');
      this.getInstanceById(this.instanceId);
      if (!this.sectionId) return;
      this.getTemplateById(this.sectionId);
    });
  }

    getInstanceById(id: string) {
    this._instanceS.getById(id).subscribe((res) => {
      const data = res?.data;
      this.data = data;
      this.initialBreadCrumb();
    });
  }
  section_data:any
  getTemplateById(id: string) {
    this._instanceSectionsS.getById(id).subscribe((res) => {
       this.section_data = res?.data;
      this.initForm(this.section_data);
      this.initialBreadCrumb()
    });
  }
  navigateBack() {
    this.dataResolver
      ? this._router.navigate([
          `/gfw-portal/risks-management/risk/${this.dataResolver?.entityId}/questionnaire/instance/${this.instanceId}/sections`,
        ])
      : this._router.navigate([
          `/gfw-portal/questionnaire/instance/${this.instanceId}/sections`,
        ]);
  }
  isSavingTemplate: boolean = false;
  save() {
    const canAdd = this._PermissionSystemService.can(this.moduleName , this.featureName , 'ADD')
    const canEdit = this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
    if(this.sectionId && !canEdit)return
    if(!this.sectionId && !canAdd)return
    if (this.form.invalid) return;
    const data = {
      ...this.form.value,
      dataEntityId: this.dataResolver?.entityId,
      dataEntityTypeId: this.dataResolver?.dataEntityTypeId,
    };
    this.isSavingTemplate = true;

    const msg = this.sectionId ? 'updated' : 'created';
    this._instanceSectionsS
      .save(data, this.templateId, this.instanceId, this.sectionId)
      .subscribe({
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
