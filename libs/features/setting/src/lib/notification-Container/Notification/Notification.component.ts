// eslint-disable-next-line @nx/enforce-module-boundaries
import { NotificationService } from './../../../../../../../apps/gfw-portal/src/app/core/services/notification.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DatePackerComponent, PaginationComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'lib-notification',
  imports: [CommonModule, TranslateModule, SkeletonModule, PaginationComponent,DatePackerComponent,ReactiveFormsModule],
  templateUrl: './Notification.component.html',
  styleUrl: './Notification.component.scss',
})
export class NotificationComponent {
  tabs: any;
  breadCrumb: any;
  selectedTabId: number = 1;
  NotificationsData: any[] = [];
  loading_notification: boolean = false;
  startDate:any
   form = new FormGroup({
    startDate: new FormControl(null),
  });
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _NotificationService: NotificationService,
    private _sharedService: SharedService
  ) {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('Dashboard.BREADCRUMB.SETTING'),
        icon: '',
        routerLink: '/gfw-portal/setting',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/notification',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Notification'),
        icon: '',
        routerLink: '/gfw-portal/setting/notification',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
        icon:'fi fi-rr-shield-check'
      },
      {
        id: 2,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        icon: 'fi fi-rr-compliance-document',
      },
      {
        id: 3,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: 'fi fi-rr-compliance-document',
      },
      {
        id: 4,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Incidents'),
        icon:'fi fi-rr-light-emergency-on'
      },

       {
        id: 5,
        name: this._TranslateService.instant('STRATEGY.STRATEGY'),
        icon:'fi fi-rr-rocket-lunch'
      },
       {
        id: 6,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS'),
        icon:'fi fi-rr-database'
      },
       {
        id: 7,
        name: this._TranslateService.instant('HEARDE_TABLE.THREATS'),
        icon:'fi fi-rr-triangle-warning'
      },
       {
        id: 8,
        name: this._TranslateService.instant('PROCESS.BADGE_NAME'),
        icon:'fi fi-rr-memo-circle-check'
      },
    ];
    this.getNotifications(this.selectedTabId);
  }
  selectTab(tabId: number) {
    this.selectedTabId = tabId;
    this.getNotifications(this.selectedTabId);
  }
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  getNotifications(selectedTabId: number) {
    this.loading_notification = true;
    this._NotificationService
      .getNotificationsMessages(1, 10, selectedTabId)
      .pipe(finalize(() => (this.loading_notification = false)))
      .subscribe({
        next: (res: any) => {
          this.NotificationsData = res?.data;
          this.pageginationObj = {
            perPage: res?.data?.pageSize || 10,
            currentPage: res?.data?.pageNumber ||1,
            totalItems: res?.data?.totalCount ||this.NotificationsData.length,
            totalPages: res?.data?.totalPages ||this.NotificationsData.length,
          };
          this._sharedService.paginationSubject.next(this.pageginationObj);
        },
      });
  }
}
