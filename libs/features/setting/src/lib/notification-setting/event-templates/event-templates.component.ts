import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { switchMap, tap } from 'rxjs';
import { DeleteConfirmPopupComponent, InputSearchComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-event-templates',
  imports: [
    CommonModule,
    TranslateModule,
    CardsListComponent,
    RouterLink,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    InputSearchComponent
],
  templateUrl: './event-templates.component.html',
  styleUrl: './event-templates.component.scss',
})
export class EventTemplatesComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _NotificationService: NotificationService,
    private _ActivatedRoute: ActivatedRoute,
    private _layoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
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
        name: '-',
        icon: '',
        routerLink: '/gfw-portal/setting/notification-settings/list',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
    ];
    this._layoutService.breadCrumbLinks.next(this.breadCrumb);
    this.items = [
      {
        id: 1,
        label: this._TranslateService.instant(
          'NOTIFICATION_SETTING.VIEW_MESSAGE'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          //
          this._Router.navigate([
            `/gfw-portal/setting/notification-settings/${this.current_notification}/view-template/${this.current_selected_item?.notificationTemplateID}`,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'TEMPLATE',
            'VIEW'
          ),
      },
      {
        id: 2,
        label: this._TranslateService.instant(
          'NOTIFICATION_SETTING.EDIT_MESSAGE'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          //
          this._Router.navigate([
            `/gfw-portal/setting/notification-settings/${this.current_notification}/edit-template/${this.current_selected_item?.notificationTemplateID}`,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'TEMPLATE',
            'EDIT'
          ),
      },
      {
        id: 3,
        label: this._TranslateService.instant(
          'NOTIFICATION_SETTING.DELETE_MESSAGE'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          //
          this.actionDeleteVisible = true;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'TEMPLATE',
            'DELETE'
          ),
      },
    ];
  }
handleEmitSearchTerm(event: string) {
  const searchTerm = event?.trim().toLowerCase();

  if (!searchTerm) {
    this.data_list = [...this.fixed_data_list];
    return;
  }

  this.data_list = this.fixed_data_list.filter(item => {
    const name = item.name?.toLowerCase() || '';
    const title = item.title?.toLowerCase() || '';
    return name.includes(searchTerm) || title.includes(searchTerm);
  });
}
  items: any[] = [];

  ngOnInit(): void {
    this.getTemplateList();
  }

  setSelectedItem(event: any) {
    this.current_selected_item = event;
  }
  current_selected_item: any;
  current_notification: any;

  loading_state: boolean = true;
  fixed_data_list:any[] = []
  getTemplateList() {
    this.data_list = [];
    this.fixed_data_list = []
    this.loading_state = true;
    this._ActivatedRoute.paramMap
      .pipe(
        tap((res) => {
          this.current_notification = res.get('id');
        }),
        switchMap((res) => {
          if (!this.current_notification) return [];
          return this._NotificationService.getTemplatesList(
            this.current_notification
          );
        })
      )
      .subscribe((res: any) => {
        this.breadCrumb[this.breadCrumb.length - 2].name =
          res?.data?.notificationEventGroupName;
        this.breadCrumb[this.breadCrumb.length - 1].name =
          res?.data?.notificationEventName;
        this.data_list = res?.data?.data?.map((item: any) => {
          return {
            ...item,
            title: item?.name,
            sub: res?.data?.notificationEventGroupName,
            icon: 'fi fi-rr-bell',
          };
        });
        this.loading_state = false;
        this.fixed_data_list = this.data_list
      });
  }

  breadCrumb: any[] = [];

  data_list: any[] = [];

  actionDeleteVisible: boolean = false;
  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
  }

  loadDelted: boolean = false;

  deleteMessageTemplate() {
    if(!this._PermissionSystemService.can('NOTIFICATIONS',
      'TEMPLATE' , 'DELETE')) return;
    this.loadDelted = true;
    this._NotificationService
      .deleteMessageTemplate(this.current_selected_item?.notificationTemplateID)
      .subscribe((res: any) => {
        this.loadDelted = false;
        this.current_selected_item = null;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Template Deleted Successfully!',
        });
        this.handleClosedDelete();
        this.getTemplateList();
      });
  }
}
