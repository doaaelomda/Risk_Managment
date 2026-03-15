import { SafeHtmlPipe } from './../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
/* eslint-disable @nx/enforce-module-boundaries */
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { NotificationService } from '../../../services/notification.service';
import { switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';

@Component({
  selector: 'lib-view-template',
  imports: [CommonModule, TranslateModule,OwnerUserComponent,SafeHtmlPipe],
  templateUrl: './view-template.component.html',
  styleUrl: './view-template.component.scss',
})
export class ViewTemplateComponent implements OnInit {
  constructor(
    private _NotificationService: NotificationService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
          'NOTIFICATION_SETTING.HEADER_TITLE'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/notification-settings/list',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

    this.getData();
  }

  breadCrumb: any[] = [];
  viewed_data: any;
  loading:boolean = false
  getData() {
    this.loading = true
    this._ActivatedRoute.paramMap
      .pipe(
        tap((res: any) => {
          console.log('params', res.get('tempId'));
        }),
        switchMap((res: any) => {
          if (!res.get('tempId')) {
            return [];
          }

          return this._NotificationService.getSingleTemplate(res.get('tempId'));
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          console.log(res?.data);
           this.breadCrumb[
            this.breadCrumb.length - 3
          ].name = `${res?.data?.eventGroupName}`;
          this.breadCrumb[
            this.breadCrumb.length - 2
          ].name = `${res?.data?.notificationEventName}`;
          this.breadCrumb[
            this.breadCrumb.length - 2
          ].routerLink = `/gfw-portal/setting/notification-settings/${res?.data?.notificationEventID}/templates`;
          this.breadCrumb[
            this.breadCrumb.length - 1
          ].name = `${res?.data?.name}`;
          this.viewed_data = res?.data;
          this.loading= false
        }
      });
  }
}
