import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { Button } from 'primeng/button';
import { EsclationService } from '../../../services/esclation.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmPopupComponent } from 'libs/shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TagComponent } from 'libs/shared/shared-ui/src/lib/tag/tag.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SafeHtmlPipe } from '../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-esclation-levels',
  imports: [
    CommonModule,
    TranslateModule,
    CardsListComponent,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    InputTextComponent,
    Button,
    DeleteConfirmPopupComponent,
    SkeletonModule,
    TagComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './esclation-levels.component.html',
  styleUrl: './esclation-levels.component.scss',
})
export class EsclationLevelsComponent {
  constructor(
    private _esclationS: EsclationService,
    private _messageS: MessageService,
    private _activatedR: ActivatedRoute,
    private _translateS: TranslateService,
    private _router: Router,
    private _LayoutService: LayoutService,
    public _PermissionSystemService: PermissionSystemService
  ) {}
  ngOnInit() {
    this.initForm();
    this.getEscId();
    this.item_actions = [
      {
        label: this._translateS.instant('ESCLATION.VIEW_LEVEL'),
        command: () => {
          this.getLevelById(this.selectedLevel?.escalationLevelID);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ESCLATIONS',
            'ESCLATIONLEVELS',
            'VIEW'
          ),
      },
      {
        label: this._translateS.instant('ESCLATION.EDIT_LEVEL'),
        command: () => {
          this.levelId = this.selectedLevel?.escalationLevelID;
          this.addingLevel = true;
          this.initForm(this.selectedLevel);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ESCLATIONS',
            'ESCLATIONLEVELS',
            'EDIT'
          ),
      },
      {
        label: this._translateS.instant('ESCLATION.DELETE_LEVEL'),
        command: () => {
          this.deletingLevel = true;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ESCLATIONS',
            'ESCLATIONLEVELS',
            'DELETE'
          ),
      },
    ];
    this._esclationS.activeStep.next(2);
    this._esclationS.updateStep(2, {
      description: '-',
      command: () => {},
    });
    this._esclationS.updateStep(3, {
      description: '-',
      command: () => {},
    });
    this._esclationS.updateStep(4, {
      description: '-',
      command: () => {},
    });
  }
  escId: any = '';

  getEscId() {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      const id = res?.get('id');
      this.escId = id;

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
          routerLink: `/gfw-portal/esclation/view/${this.escId}/overview`,
        },
        {
          name: this._translateS.instant('ESCLATION.LEVELS'),
          icon: '',
          routerLink: '',
        },
      ]);
      this.getLevels();
      console.log(res, 'got adsad');
    });
  }
  toggleReadMore(item: any) {
    item.isDescExpanded = !item.isDescExpanded;
  }
  updateTruncatedValue(item: any) {
    const value = item?.value || '';
    const plainText = value;
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  }
  item_actions: any[] = [];
  data_list: any[] = [];
  listLength: any;
  loadingList: any;
  selectedLevel: any = '';
  setSelected(event: any) {
    console.log(event, 'got selected level');
    this.selectedLevel = event;
  }
  levelId: any = '';
  handleAddLevelClick() {
    this.addingLevel = true;
  }
  levelForm!: FormGroup;
  initForm(data?: any): void {
    this.levelForm = new FormGroup({
      name: new FormControl(data ? data?.name : null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      nameAr: new FormControl(data ? data?.nameAr : null, [
        Validators.maxLength(100),
      ]),
    });
  }
  navigateToCriteria(item: any) {
     if(!this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONCRITERIA' , 'VIEW')) return;
    const levelId = item?.escalationLevelID;
    const url = `/gfw-portal/esclation/view/${this.escId}/esclation-criteria/${levelId}`;
    console.log(url, 'url');

    this._esclationS.getLevelById(levelId).subscribe((res: any) => {
      const name = res?.data?.name;
      this.setStepsName(name);
      this._router.navigate([url]);
    });
  }
  setStepsName(name: any) {
    this._esclationS.updateStep(1, {
      description: name || '-',
    });
    this._esclationS.updateStep(2, {
      description: name || '-',
    });
    this._esclationS.updateStep(3, {
      description: name || '-',
    });
    this._esclationS.updateStep(4, {
      description: name || '-',
    });
  }
  getLevels() {
    this.loadingList = true;
    this._esclationS.getLevels(this.escId).subscribe((res: any) => {
      this.loadingList = false;
      const levels = res?.data;
      this.data_list = levels;
      console.log(res, 'got levels');
    });
  }

  addingLevel: boolean = false;
  loadingBtn: boolean = false;

  submit() {
    const canAdd = this._PermissionSystemService.can(
      'ESCLATIONS',
      'ESCLATIONLEVELS',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'ESCLATIONS',
      'ESCLATIONLEVELS',
      'EDIT'
    );
    if (this.levelId && !canEdit) return;
    if (!this.levelId && !canAdd) return;
    this.loadingBtn = true;
    let data = this.levelForm.value;
    const msg = this.levelId ? 'updated' : 'added';
    this._esclationS.saveLevel(data, this.levelId, this.escId).subscribe({
      next: (res) => {
        this.loadingBtn = false;

        this._messageS.add({
          severity: 'success',
          summary: 'Success',
          detail: `Level ${msg} successfully`,
        });
        this.getLevels();
        this.addingLevel = false;
      },
      error: (err) => {
        this.loadingBtn = false;
      },
    });
  }
  viewingLevel: boolean = false;
  viewed_data: any;
  loadingViewedData: boolean = false;
  getLevelById(id: any) {
    this.loadingViewedData = true;
    this._esclationS.getLevelById(id).subscribe((res: any) => {
      this.loadingViewedData = false;
      this.viewingLevel = true;
      const data = {
        ...res?.data,
        notificationMessage: {
          value: res?.data?.notificationMessage,
          isDescExpanded: false,
        },
      };
      this.viewed_data = data;
      console.log(this.viewed_data, 'got level by id');
    });
  }

  loadDeleted: boolean = false;
  deletingLevel: boolean = false;
  closeDeleteModal() {
    this.deletingLevel = false;
  }
  handleClosedDelete(event: any) {
    this.deletingLevel = event;
  }
  deleteLevel() {
    if (
      !this._PermissionSystemService.can(
        'ESCLATIONS',
        'ESCLATIONLEVELS',
        'DELETE'
      )
    )
      return;

    const id = this.selectedLevel?.escalationLevelID;
    if (!id) return;
    this.loadDeleted = true;
    this._esclationS.deleteLevel(id).subscribe({
      next: (res) => {
        this.loadDeleted = false;
        this._messageS.add({
          severity: 'success',
          summary: 'Success',
          detail: `Level deleted successfully`,
        });
        this.getLevels();
        this.deletingLevel = false;

        console.log(res, 'deleted');
      },
      error: (err) => {
        this.loadDeleted = false;
      },
    });
  }

  onViewModal(event?: any) {
    this.viewingLevel = true;
    this.getLevelById(
      this.selectedLevel?.escalationLevelID
        ? this.selectedLevel?.escalationLevelID
        : event?.escalationLevelID
    );
  }
}
