import { SharedDescriptionComponent } from './../../../../../../shared/shared-ui/src/lib/shared-description/shared-description.component';
import { OwnerUserComponent } from './../../../../../../shared/shared-ui/src/lib/ownerUser/ownerUser.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from "primeng/skeleton";
import { TranslateModule } from '@ngx-translate/core';
import { MeetingsService } from '../../../services/meetings.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'lib-meeting-overview',
  imports: [CommonModule, SkeletonModule , TranslateModule,OwnerUserComponent,SharedDescriptionComponent],
  templateUrl: './meeting-overview.component.html',
  styleUrl: './meeting-overview.component.scss',
})
export class MeetingOverviewComponent implements OnInit , OnDestroy{
  isLoadingData:boolean = true;
  viewedData:any;
  breadCrumb:any[] = [];
  constructor(private _TranslateService:TranslateService,private _MeetingsService:MeetingsService , private _LayoutService:LayoutService){}
// entries: OverviewEntry[] = [
//   { key: 'name', label: 'MEETINGS.NAME', type: 'text' },
//   { key: 'objective', label: 'MEETINGS.OBJECTIVE', type: 'text' },
//   { key: 'organizerUserName', label: 'MEETINGS.ORGANIZER', type: 'user' },
//   { key: 'organizerDepartment', label: 'MEETINGS.DEPARTMENT', type: 'text' },
//   { key: 'meetingDate', label: 'MEETINGS.DATE', type: 'date' },
//   { key: 'nextMeetingDate', label: 'MEETINGS.NEXT_DATE', type: 'date' },
//   { key: 'startTime', label: 'MEETINGS.START_TIME', type: 'date' },
//   { key: 'endTime', label: 'MEETINGS.END_TIME', type: 'date' },
//   { key: 'meetingStatusTypeName', label: 'MEETINGS.STATUS', type: 'badge' },
//   { key: 'location', label: 'MEETINGS.LOCATION', type: 'text' },
//   { key: 'meetingLink', label: 'MEETINGS.LINK', type: 'text' }
// ];

  meetingDataSub$!:Subscription;
  ngOnInit(): void {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MEETINGS'),
        icon: '',
        routerLink: '/gfw-portal/meetings',
      },
      {
        name: '-',
        icon: '',
      },
    ]
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb)
    this.meetingDataSub$ = this._MeetingsService.current_meeting_data.subscribe((res:any)=>{
      this.isLoadingData = false;
      this.viewedData = res;
      this.breadCrumb[2].name = this.viewedData?.name;
      this.breadCrumb[2].routerLink = `/gfw-portal/meetings/view/${this.viewedData?.meetingID}/overview`

    })
  }


  ngOnDestroy(): void {
    this.meetingDataSub$.unsubscribe()
  }

}
