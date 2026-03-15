import { TranslationsService } from './../../services/translate.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { Router } from '@angular/router';
import { AuthService } from 'libs/features/auth/src/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PermissionSystemService } from '../../services/permission.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-header-layout',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './headerLayout.component.html',
  styleUrl: './headerLayout.component.scss',
})
export class HeaderLayoutComponent implements OnInit {
  userId: any;
  constructor(
    private _NotificationService: NotificationService,
    private authService: AuthService,
    private _TranslationsService: TranslationsService,
    public _layoutService: LayoutService,
    private _router: Router,
    private _Translate: TranslateService,
    private _messageService: MessageService,
    private _PermissionSystemService: PermissionSystemService
  ) {
    this._layoutService.breadCrumbTitle.subscribe((title) => {
      this.current_title = title;
    });

    this.userName = localStorage
      .getItem('userEmail')
      ?.split('@')[0]
      .replace('.', ' ')!;
    this.items = [
      {
        label: this.userName,
        icon: 'fi fi-rr-user',
        command: () => {
          this._router.navigate(['/gfw-portal/setting/profile']);
        },
      },
      {
        label: this._Translate.instant('SETTING.MY_TASKS'),
        icon: 'fi fi-rr-completed',
        command: () => {
          this._router.navigate(['/gfw-portal/management/tasks']);
        },
      },
      {
        label: this._Translate.instant('SETTING.LOGOUT'),
        icon: 'fi fi-rr-sign-out-alt',
        command: () => {
          localStorage.clear();
          this._router.navigate(['/auth']);
        },
      },
    ];
    this._TranslationsService.selected_lan_sub.subscribe((lan: string) => {
      this.selctedLang = lan;
    });

    this.adjustSidebarForScreen();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData?.accessToken) {
      const decoded: any = jwtDecode(userData.accessToken);
      this.userId = decoded?.userId;
    }
  }

  ngOnInit(): void {
    this.requestNotificationPermission();
    this.handleTabs();
    this.selectTab(1);

    this._NotificationService.turnOnNotification().subscribe((res: any) => {});
  }

  requestNotificationPermission() {
    this._NotificationService.startConnection();
    // Notification.requestPermission().then((permission) => {
    //   if (permission === "granted") {
    //     console.log("Notifications permission granted.");
    //     this._NotificationService.startConnection()
    //   }
    //   else if (permission === "denied") {
    //     console.log("User denied notification permission.");
    //   }
    //   else {
    //     console.log("Notification permission is default (not decided).");
    //   }
    // });
  }

  notifications_messages: any[] = [];
  loading_notification: boolean = false;
  getNotifications(filter: number = 1) {
    this.loading_notification = true;
    this.notifications_messages = [];
    this._NotificationService
      .getNotificationsMessages(1, 10, filter)
      .pipe(finalize(() => (this.loading_notification = false)))
      .subscribe({
        next: (res: any) => {
          this.notifications_messages = res?.data;
        },
      });
  }

  userName: string = '';
  selctedLang: string = 'en';
  unreadMessage: any[] = [];
  openModalNotification: any;
  notificationData: any;
  removeNotification(index: number) {
    this.filteredNotifications.splice(index, 1);
  }
  langs = [
    {
      id: 1,
      name: 'EN',
      value: 'en',
    },
    {
      id: 2,
      name: 'AR',
      value: 'ar',
    },
  ];

  handleSelectedLang() {
    this._TranslationsService.selected_lan_sub.next(this.selctedLang);
    this._TranslationsService.setLanguage(this.selctedLang);
  }

  toggleSidebar() {
    this._layoutService.sidebarState.next(
      !this._layoutService.sidebarState.getValue()
    );
  }

  toggleOverlay() {
    this._layoutService.overlayStatus.next(true);
    this._layoutService.sidebarState.next(true);
  }

  isMobile: boolean = false;
  @HostListener('window:resize')
  adjustSidebarForScreen() {
    this.isMobile = window.innerWidth < 640;
    if (this.isMobile && this._layoutService.sidebarState.getValue()) {
      this._layoutService.sidebarState.next(false);
    }
  }

  loadingRefresh: boolean = false;

  resfreshUserPermission() {
    this.loadingRefresh = true;
    this._PermissionSystemService
      .refreshUserPermissions()
      .subscribe((res: any) => {
        const userData = JSON.parse(`${localStorage.getItem('userData')}`);

        userData.permissions = res?.data;
        localStorage.setItem('userData', JSON.stringify(userData));

        this._PermissionSystemService.setPermissions(res.data);
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Permissions Refreshed Successfully',
        });
        this.loadingRefresh = false;
      });
  }

  active_tab = 1;
  items: { label: string; icon?: string; command?: () => void }[] = [];

  current_title: string = '';
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleLang() {
    this.selctedLang = this.selctedLang === 'en' ? 'ar' : 'en';
    this.handleSelectedLang();
  }

  getLangLabel(lang: string): string {
    return lang === 'en' ? 'AR' : 'EN';
  }
  tabs: any;
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this._Translate.instant('NOTIFICATION_SETTING.all'),
      },
      {
        id: 2,
        name: this._Translate.instant('NOTIFICATION_SETTING.unread'),
      },
    ];
  }
  viewAllNotification(op: OverlayPanel) {
    this._router.navigate(['/gfw-portal/setting/notification']);
    op.hide();
  }
  filteredNotifications: any[] = [];
  selectTab(id: number) {
    this.active_tab = id;
    this.notifications_messages = [];
    if (id === 1) {
      this.active_tab = 1;
      this.getNotifications(1);
    } else if (id === 2) {
      this.active_tab = 2;
      this.getNotifications(3);
    }
  }
  openNotification(not: any, op: OverlayPanel) {
    this.notificationData = not;
    this.openModalNotification = true;
    op.hide();
  }

  readNotification(notificationMessageID: any) {
    this._NotificationService
      .readNotification(notificationMessageID, 0)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Message Read Successfully',
          });
          this.active_tab = 1;
          this.getNotifications();
          this.openModalNotification = false;
        }
      });
  }
}
