import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputSearchComponent, NewAttachListComponent } from '@gfw/shared-ui';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-system-documents',
  imports: [
    CommonModule,
    TranslateModule,
    InputSearchComponent,
    UiDropdownComponent,
    ReactiveFormsModule,
    NewAttachListComponent,
    ViewAttachementComponent,
  ],
  templateUrl: './system-documents.component.html',
  styleUrl: './system-documents.component.scss',
})
export class SystemDocumentsComponent implements OnInit, OnDestroy {
  // declaration Variables
  breadCrumb: any[] = [];
  menuList: any[] = [];
  classfications: any[] = [];
  contentTypes: any[] = [];
  users: any[] = [];
  selected_file_show: any;
  loadingState: boolean = false;
  files: any[] = [];
  form = new FormGroup({
    byUser: new FormControl(null),
    dataClassificationID: new FormControl(null),
    awarenessContentTypeID: new FormControl(null),
  });
  activeTab: 'all' | 'files' | 'links' = 'all';
  currentLang  =localStorage.getItem('user-language')
  displayModal: boolean = false;
  activeMenu: any = null;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // handle bread Crumb
  setBreadCrumb() {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Library'),
        icon: '',
        routerLink: '/gfw-portal/library/system-documents',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.systemDocuments'
        ),
        icon: '',
        routerLink: '/gfw-portal/library/system-documents',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  // change Active Button
  setActive(tab: 'all' | 'files' | 'links') {
    this.activeTab = tab;
  }
  // load Looks User
  getUsersLookUp() {
    const subscriptions = this._SharedService
      .getUserLookupData()
      .subscribe((res) => {
        this.users = res?.data;
      });
    this.subscriptions.add(subscriptions);
  }
  // handle MenuItem
  getMenu() {
    this.menuList = [
      {
        name: 'Risk Management',
        nameAR: 'إدارة المخاطر',
        icon: 'fi fi-rr-shield-check',
        link: '',
        visible: true,
        expand: true,
        dataEntityTypeId: 1,
        FileUsageId: 1,
        id: 1,
        children: [
          {
            name: 'Risk Frame Work',
            nameAR: 'إطار عمل المخاطر',
            visible: true,
            dataEntityTypeId: 1,
            FileUsageId: 1,
            id: 1,
          },
          {
            name: 'Risk Mitigation Plan',
            nameAR: 'خطة تخفيف المخاطر',
            link: '/your-route/mitigation-plan',
            visible: true,
            dataEntityTypeId: 3,
            FileUsageId: 3,
            id: 1,
          },
        ],
      },
      {
        name: 'Governance',
        nameAR: 'الحوكمة',
        icon: 'fi fi-rr-bank',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 72,
        FileUsageId: 72,
        id: 1,
      },
      {
        name: 'Compliance',
        nameAR: 'الامتثال',
        icon: 'fi fi-rr-compliance-document',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 11,
        FileUsageId: 11,
        id: 1,
      },
      {
        name: 'Incidents',
        nameAR: 'الحوادث',
        icon: 'fi fi-rr-light-emergency-on',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 38,
        FileUsageId: 38,
        id: 1,
      },
      {
        name: 'Strategy',
        nameAR: 'الاستراتيجية',
        icon: 'fi fi-rr-rocket-lunch',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 16,
        FileUsageId: 16,
        id: 7,
      },
      {
        name: 'Assets',
        nameAR: 'الأصول',
        icon: 'fi fi-rr-database',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 16,
        FileUsageId: 16,
        id: 1,
      },
      {
        name: 'Threats',
        nameAR: 'التهديدات',
        icon: 'fi fi-rr-triangle-warning',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 49,
        FileUsageId: 49,
        id: 1,
      },
      {
        name: 'Process',
        nameAR: 'العمليات',
        icon: 'fi fi-rr-memo-circle-check',
        visible: true,
        expand: false,
        children: [],
        dataEntityTypeId: 46,
        FileUsageId: 46,
        id: 1,
      },
    ];
  }
  // load Lookups
  getLookups() {
    const subscriptions = this._SharedService
      .lookUps([43, 202])
      .subscribe((res: any) => {
        this.classfications = res?.data?.DataClassification;
        this.contentTypes = res?.data?.AwarenessContentType;
      });

    this.subscriptions.add(subscriptions);
  }

  // handle action Files
  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Show':
        const subscriptions =this._SharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
          this.subscriptions.add(subscriptions)
        break;
      default:
        break;
    }
  }
  // add view modal
  handleHideView(event: boolean) {
    this.displayModal = event;
  }
  // get Attachment
  getFiles(dataEntityTypeId: number, FileUsageId: number, id: number) {
    this.loadingState = true;
    const subscription=this._SharedService
      .getNewAttachment(dataEntityTypeId, id, FileUsageId)
      .subscribe({
        next: (res: any) => {
          this.files = res?.data;
          this.loadingState = false;
        },
      });
      this.subscriptions.add(subscription)
  }
  // active state Buttons
  setActiveButtons(item: any) {
  this.activeMenu = item;
  if (item.dataEntityTypeId && item.FileUsageId && item.id) {
    this.getFiles(item.dataEntityTypeId, item.FileUsageId, item.id);
  }}
  // Life Cycle Hooks
  ngOnInit(): void {
    this.setBreadCrumb();
    this.getUsersLookUp();
    this.getLookups();
    this.getMenu();
    this.getFiles(1, 1, 1);
  }
  // On Destroy
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
