import { SafeHtmlPipe } from './../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { EditorComponent } from './../../../../../../shared/shared-ui/src/lib/editor/editor.component';
import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EsclationService } from '../../../services/esclation.service';
import { combineLatest, finalize } from 'rxjs';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { PrimengModule } from '@gfw/primeng';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-level-esclation-notification',
  imports: [
    CommonModule,
    InputTextComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    Button,
    PrimengModule,
    EditorComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './level-esclation-notification.component.html',
  styleUrl: './level-esclation-notification.component.scss',
})
export class LevelEsclationNotificationComponent {
  constructor(
    private _activatedR: ActivatedRoute,
    private _esclationS: EsclationService,
    private _router: Router,
    private _messageS: MessageService,
    private _LayoutService: LayoutService,
    private _translateS: TranslateService,
    private _SharedService:SharedService,
    public _PermissionSystemService:PermissionSystemService
  ) {

  }
  ngOnInit() {
    this.handleSteps();

  }
  getLevelById(id: any) {
    this._esclationS.getLevelById(id).subscribe((res: any) => {
      console.log(res, 'got level by id');
      const data = res?.data;
      const notifcationsData = {
        notificationMessage: data?.notificationMessage,
        notificationMessageAr: data?.notificationMessageAr,
        notificationSubject: data?.notificationSubject,
        notificationSubjectAr: data?.notificationSubjectAr,
      };
      this.initForm(notifcationsData);
    });
  }

  templateTags: any[] = [
    {
      label: '#Receiver Name',
      value: 'receiver_name',
      id: '1',
    },
    {
      label: '#Sender Name',
      value: 'sender_Name',
      id: '2',
    },
  ];

  levelId: any = '';
  handleSteps() {
    combineLatest([
      this._activatedR.paramMap,
      this._activatedR.parent?.paramMap || [],
    ]).subscribe(([childParams, parentParams]) => {
      const id = parentParams?.get('id');
      if(id){
        this._esclationS.getEsclationById(+id).subscribe({
          next:(res)=> {
            this.getAttributes(res.data.dataEntityTypeID)
          }
        })
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
          name: this._translateS.instant('ESCLATION.ESCLATION_NOTFICATION'),
          icon: '',
          routerLink: '',
        },
      ]);
      const levelId = childParams?.get('levelId');
      this.levelId = levelId;
      this.getLevelById(levelId);
      this._esclationS.activeStep.next(5);
      this._esclationS.updateStep(3, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-target/${levelId}`,
          ]);
        },
      });
      this._esclationS.updateStep(2, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-criteria/${levelId}`,
          ]);
        },
      });
    });
  }
  notficationForm!: FormGroup;
  initForm(data?: any) {
    this.notficationForm = new FormGroup({
      notificationSubject: new FormControl(data?.notificationSubject),
      notificationSubjectAr: new FormControl(data?.notificationSubjectAr),
      template_tags: new FormControl(data?.template_tags),
      notificationMessage: new FormControl(data?.notificationMessage),
      notificationMessageAr: new FormControl(data?.notificationMessageAr),
    });
  }

  handleCancel() {}
  isSavingNotfications: boolean = false;
  saveNotfication() {
    if(!this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONNOTIFICATION' , 'EDIT'))return
    this.isSavingNotfications = true;
    this._esclationS
      .saveNotfication(this.notficationForm.value, this.levelId)
      .pipe(finalize(() => (this.isSavingNotfications = false)))
      .subscribe({
        next: (res) => {
          this.isSavingNotfications = false;
          console.log(res, 'saved');
          this._messageS.add({
            severity: 'success',
            summary: 'success',
            detail: 'Notifcations updated successfully',
          });
        },
        error: (err) => {
          this.isSavingNotfications = false;
        },
      });
  }

  currentControlEffect!: AbstractControl | null;

  handleVaraibleControl(control: AbstractControl) {
    if(!this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONNOTIFICATION' , 'EDIT'))return
    console.log(control, 'control');

    this.currentControlEffect = control;
    this.show_varaible = true;
  }
  show_varaible: boolean = false;

  setVariableInput(varaible: any) {
    console.log(varaible, 'varaible');

    if (!varaible.notificationTagName) return;
    if (this.currentControlEffect && !varaible.isSelected) {
      const currentValue = this.currentControlEffect.value || '';
      this.currentControlEffect.setValue(
        currentValue + ' ' + `{{${varaible.notificationTagName}}}`
      );
      varaible.isSelected = true;
    }
  }

  getAttributes(dataEntityTypeId: number) {
    this._SharedService.getDataEntityAttributesNew(dataEntityTypeId).subscribe((res: any) => {
      this.varaibles_list = res?.data.map((item: any) => {
        return {
          ...item,
          isSelected: false,
        };
      });
    });
  }
  varaibles_list: any[] = [];
  resetVaraibleList() {
    this.varaibles_list = this.varaibles_list.map((item: any) => {
      return {
        ...item,
        isSelected: false,
      };
    });
  }
}
