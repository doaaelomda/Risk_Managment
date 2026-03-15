/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  EmptyStateComponent,
  InputSearchComponent,
  LoaderComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-event-list',
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    TranslateModule,
    InputSearchComponent,
    ButtonModule,
    MenuModule,
    LoaderComponent,
    SkeletonModule,
    EmptyStateComponent,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  ngOnInit(): void {
    //
    this.getGroupsData();
    this.items = [
      {
        label: this._TranslateService.instant(
          'NOTIFICATION_SETTING.VIEW_MESSAGE'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.viewNotfication(
            this.selected_notfication_action?.notificationEventID
          );
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'NOTIFICATIONS',
            'VIEW'
          ),
      },
    ];
  }

  viewNotfication(notficationId: number) {
    if (
      this._PermissionSystemService.can(
        'NOTIFICATIONS',
        'NOTIFICATIONS',
        'VIEW'
      )
    ) {
      this._Router.navigate([
        `/gfw-portal/setting/notification-settings/${notficationId}/templates`,
      ]);
    }
  }

  getGroupsData() {
    this._NotificationService.getEventGroups().subscribe((res: any) => {
      console.log('res group', res?.data);
      this.groups = res?.data;
      this.selected_event_group = this.groups[0];
      this.getNotificationList();
    });
  }
  currentLang = signal<string>('en');
  data_list: any[] = [];
  fixed_data_list: any[] = [];
  items: any[] = [];

  selected_notfication_action: any;
  loading_list: boolean = true;
  getNotificationList() {
    this.loading_list = true;
    this.data_list = [];
    this.fixed_data_list = [];
    this._NotificationService
      .getNotificationListSearch(
        this.selected_event_group?.notificationEventGroupID
      )
      .subscribe((res: any) => {
        console.log('res list', res);
        this.data_list = res?.data?.items?.map((item: any) => {
          return {
            ...item,
            sub:
              this._TranslateService.instant('NOTIFICATION_SETTING.STATUS') +
              ': ',
            icon: 'fi fi-rr-bank',
          };
        });
        this.fixed_data_list = this.data_list;
        this.loading_list = false;
      });
  }

  constructor(
    private _NotificationService: NotificationService,
    private _Router: Router,
    private _layoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private translateServices: TranslationsService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._layoutService.breadCrumbLinks.next([
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
          'NOTIFICATION_SETTING.HEADER_TITLE'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/notification-settings',
      },
    ]);
    this.translateServices.selected_lan_sub.subscribe((lang) => {
      this.currentLang.set(lang);
      console.log('currenmt Lang ', lang);
    });
  }

  groups: any[] = [];

  selected_event_group: any = this.groups[0];

  handleEmitSearchTerm(event: string) {
    const searchTerm = event?.trim().toLowerCase();

    if (!searchTerm) {
      this.data_list = [...this.fixed_data_list];
      return;
    }

    this.data_list = this.fixed_data_list.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const title = item.title?.toLowerCase() || '';
      return name.includes(searchTerm) || title.includes(searchTerm);
    });
  }

  handelToggleActivate(item: any) {
    const req = {
      notificationEventID: item?.notificationEventID,
      isActive: item?.isActive,
    };

    this._NotificationService.toggleEventActivate(req).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Status Updated Successfully!',
      });
    });
  }
}
