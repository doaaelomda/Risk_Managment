import { TimePackerComponent } from './../../../../../shared/shared-ui/src/lib/time-packer/time-packer.component';
import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent, UserDropdownComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MeetingsService } from '../../services/meetings.service';
import { finalize, forkJoin, switchMap } from 'rxjs';
import * as moment from 'moment';
import { InputNumberComponent } from "libs/shared/shared-ui/src/lib/input-number/input-number.component";
import { SkeletonModule } from "primeng/skeleton";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-meetings-action',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    ButtonModule,
    InputTextComponent,
    UiDropdownComponent,
    UserDropdownComponent,
    DatePackerComponent,
    TreeSelectUiComponent,
    TimePackerComponent,
    TextareaUiComponent,
    InputNumberComponent,
    SkeletonModule
],
  templateUrl: './meetings-action.component.html',
  styleUrl: './meetings-action.component.scss',
})
export class MeetingsActionComponent implements OnInit {
  meeting_form!: FormGroup;
  current_update_id: any;
  isLoading = false;

  organizerUsers: any[] = [];
  organizationalUnits: any[] = [];
  meetingStatuses: any[] = [];

  breadCrumb: any[] = [];

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _MeetingsService: MeetingsService,
    private _permissionService: PermissionSystemService
  ) {}

   findNodesByIds(nodes: any[], ids: number[]): any[] {
    const result: any[] = [];

    function search(node: any) {
      if (ids.includes(node.id)) {
        result.push(node);
      }
      if (node.children) {
        node.children.forEach((child: any) => search(child));
      }
    }

    nodes.forEach((node) => search(node));
    return result;
  }
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
        routerLink: '',
      },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);


    this.loadLookups();
    this.handleRouteParams();
  }

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name = this._TranslateService.instant('MEETINGS.ADD_MEETING');
            this.initMeetingForm();
            return [];
          }
          this.current_update_id = id;

          return this._MeetingsService.getMeetingById(id);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.initMeetingForm(res.data);
           this.breadCrumb[this.breadCrumb.length - 1].name = res?.data?.name;
        }
      });
  }

    transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return nodes.map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const isLeaf = !node.children || node.children.length === 0;
      return {
        key,
        id: node.id,
        label: node.label,
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }

  loadLookups() {
    forkJoin([
      this._SharedService.getUserLookupData(),
      this._SharedService.lookUps([140]) ,
      this._SharedService.orgainationalUnitLookUp()
    ]).subscribe((res: any[]) => {
      this.organizerUsers = res[0]?.data;
      this.organizationalUnits = this.transformNodes(res[2]?.data);
      this.meetingStatuses = res[1]?.data?.MeetingStatusType ?? [];
    });
  }

  initMeetingForm(data?: any) {
        const selectedOrg: any = this.findNodesByIds(this.organizationalUnits, [
      data?.organizationalUnitID,
    ])[0];
    this.meeting_form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      objective: new FormControl(data?.objective, Validators.required),
      description: new FormControl(data?.description, Validators.required),
      organizerUserID: new FormControl(data?.organizerUserID, Validators.required),
      organizationalUnitID: new FormControl(selectedOrg, Validators.required),
      meetingDate: new FormControl(
        data?.meetingDate ? moment(new Date(data?.meetingDate)).format('MM-DD-YYYY') : null,
        Validators.required
      ),
      startTime: new FormControl(
        data?.startTime ? moment(new Date(data?.startTime)).format('HH:mm') : null,
        Validators.required
      ),
      endTime: new FormControl(
        data?.endTime ? moment(new Date(data?.endTime)).format('HH:mm') : null,
        Validators.required
      ),
      nextMeetingDate: new FormControl(
        data?.nextMeetingDate ? moment(new Date(data?.nextMeetingDate)).format('MM-DD-YYYY') : null
      ),
      meetingStatusTypeID: new FormControl(data?.meetingStatusTypeID, Validators.required),
      location: new FormControl(data?.location),
      meetingLink: new FormControl(data?.meetingLink, [
  Validators.required,
  Validators.pattern(/^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/)
]),
      duration: new FormControl(data?.duration),
    });
  }

    validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  submit() {
              // ===== Permissions =====
  const hasPermission = this.current_update_id
    ? this._permissionService.can('MEETING', 'MEETING', 'EDIT')
    : this._permissionService.can('MEETING', 'MEETING', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.meeting_form.invalid){
      this.meeting_form.markAllAsTouched()
       return;}
    this.isLoading = true;

    const req = {
      ...this.meeting_form.value,
      meetingDate: moment(this.meeting_form.get('meetingDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
      nextMeetingDate: moment(this.meeting_form.get('nextMeetingDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
      startTime: moment(this.meeting_form.get('startTime')?.value, 'HH:mm').utc(true).toISOString(),
      endTime: moment(this.meeting_form.get('endTime')?.value, 'HH:mm').utc(true).toISOString(),
      organizationalUnitID:this.meeting_form.get('organizationalUnitID')?.value?.id
    };

    if (this.current_update_id) req.meetingId = this.current_update_id;

    const apiCall$ = this.current_update_id
      ? this._MeetingsService.updateMeeting(req)
      : this._MeetingsService.addMeeting(req);

    apiCall$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_update_id
            ? 'Meeting Updated Successfully'
            : 'Meeting Added Successfully',
        });
        this._Router.navigate(['/gfw-portal/meetings/list']);
      });
  }
}
