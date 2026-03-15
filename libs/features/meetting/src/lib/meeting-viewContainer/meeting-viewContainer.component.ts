import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../../services/meetings.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-meeting-view-container',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    RouterOutlet,
    SharedTabsComponent
  ],
  templateUrl: './meeting-viewContainer.component.html',
  styleUrl: './meeting-viewContainer.component.scss',
})
export class MeetingViewContainerComponent implements OnInit {
  constructor(
    private _MeetingsService: MeetingsService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  current_id_viwe: any;

  ngOnInit(): void {
    this.tabs = [
      {
        id: 2,
        name: 'MEETINGS.ATTENDANCE',
        router: 'attendance',
        icon: 'fi fi-rr-users',
        visible: ()=> this._PermissionSystemService.can('MEETING', 'MEETINGATTENDANCE', 'VIEW')
      },
      {
        id: 3,
        name: 'MEETINGS.AGENDA',
        router: 'agenda',
        icon: 'fi fi-rr-document',
        visible: ()=> this._PermissionSystemService.can('MEETING','MEETINGAGENDA', 'VIEW')
      },

      {
        id: 4,
        name: 'MEETINGS.MINUTES',
        router: 'minutes',
        icon: 'fi fi-rs-stopwatch',
        visible: ()=> this._PermissionSystemService.can('MEETING', 'MEETINGMINUTES', 'VIEW')
      },
    ];
    this.current_id_viwe = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.getMeettingData();
  }

  getMeettingData() {
    this._MeetingsService
      .getMeetingById(this.current_id_viwe)
      .subscribe((res: any) => {
        this.data = res?.data;
        this.loadData = false;
        this._MeetingsService.current_meeting_data.next(res?.data);
      });
  }
  tabs: any[] = [];
  loadData: boolean = true;
  data: any;
}
