import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from 'libs/features/incident/src/services/incident.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
@Component({
  selector: 'lib-lesson-learn-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    SkeletonModule,
    DialogModule,
    NewTableComponent
  ],
  templateUrl: './lessonLearn-list.component.html',
  styleUrl: './lessonLearn-list.component.scss',
})
export class LessonLearnListComponent implements OnInit {
  loadDeleted: boolean = false;
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  routesParams: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  LessonLearnProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  LessonLearnId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _IncidentService: IncidentService,
    public _PermissionSystemService: PermissionSystemService
  ) {}

  ngOnInit(): void {
    const routeData = this._ActivatedRoute.snapshot.data;
    const param = this._ActivatedRoute.parent?.snapshot.params;

    this.routesParams = routeData;
    if (param) {
      this.LessonLearnId = param['id'];
    }

    this.items = [
      {
        label: this._TranslateService.instant('LessonLearn.View_LessonLearn'),
        icon: 'fi fi-rr-eye',
        command: () => {
         this.onViewLessons()
        },
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTLESSONS' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('LessonLearn.Delete_LessonLearn'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTLESSONS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('LessonLearn.Update_LessonLearn'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/incident/${this.LessonLearnId}/update-lesson`,
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTLESSONS' , 'EDIT')
      },
    ];

    this.loadLessonLearnColumns();
  }

  loadLessonLearnColumns() {
    this._SharedService.getDataEntityColumns(109).subscribe((res: any) => {
      this.defultProfile = {
        profileId: 0,
        profileName: 'Default Profile',
        isDefult: false,
        columns: res?.data?.columnDefinitions,
      };

      this.LessonLearnProfiles = res?.data?.userColumnProfiles.map(
        (profile: newProfile) => ({
          ...profile,
          columns: profile.columns.map((col: any) => ({
            ...col,
            displayName: res?.data?.columnDefinitions?.find(
              (colD: any) => colD?.id == col?.id
            )?.label,
            dataMap: res?.data?.columnDefinitions?.find(
              (colD: any) => colD?.id == col?.id
            )?.dataMap,
          })),
        })
      );

      this.selected_profile_column = res?.data?.selectedProfileID;
    });
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }


  getActivitiesData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._IncidentService
      .getLessonLearnList(
        payload,
        this.routesParams.LessonLearnTypeID,
        this.LessonLearnId,
        this.routesParams.dataEntityTypeID
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
        },
        error: () => {
          this.loadingTable = false;
        },
      });
  }

  deleteLessonLearn() {
    if(!this._PermissionSystemService.can('INCIDENT' , 'INCIDENTLESSONS' , 'DELETE')) return;
    this.loadDeleted = true;
    this._IncidentService
      .deleteLessonLearn(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.getActivitiesData(this.data_payload);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'LessonLearn Deleted Successfully',
          });
        },
        error: () => {
          this.loadDeleted = false;
        },
      });
  }

  addLessonLearn() {
    this._Router.navigate([
      `/gfw-portal/incident/${this.LessonLearnId}/add-lesson`,
    ]);
  }
showViewOptionPopup:boolean=false
loading:boolean=false
LessonsData:any
    onViewLessons(event?: any) {
    this.showViewOptionPopup = true;
    this.loading = true;
    this.LessonsData = null;
    this._IncidentService.getLessonLearnById(event?.lessonsLearnedID || this.current_row_selected)
      .subscribe((res: any) => {
        this.LessonsData = res?.data;
        this.loading = false;
      });
  }

  columnControl:any={
    type:'popup',
    data:''
  }
  data_payload:any
    handleDataTable(event: any) {
    this.data_payload = event;
    this.getActivitiesData(event);
  }
}
