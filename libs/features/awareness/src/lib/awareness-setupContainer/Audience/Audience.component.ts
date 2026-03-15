import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { AwarenessService } from '../../../services/awareness.service';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-audience',
  imports: [CommonModule,TranslateModule,DeleteConfirmPopupComponent,RouterLink,ButtonModule,NewTableComponent],
  templateUrl: './Audience.component.html',
  styleUrl: './Audience.component.scss',
})
export class AudienceComponent {
  // 🔹 Attributes
  routesParams: any;
  aduianceTitle: string = '';
  items: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  loadingTable = true;
  loadDelted = false;

  dataTable: any[] = [];
  awarenessId:any
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    const routeData = this._ActivatedRoute.snapshot.data;
    this.routesParams = routeData;
          this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.awarenessId = res.get('id');
      if (this.awarenessId) {
        this._AwarenessService
          .getCampaignById(this.awarenessId)
          .subscribe((res: any) => {
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              { name: res?.data?.name, icon: '',routerLink:`/gfw-portal/awareness/compagine-setup/${this.awarenessId}/overview` },
              {
                name: this._TranslateService.instant('ADUIANCE.TITLE'),
                icon: '',
              },
            ]);
          });
          this.columnControl = {
            type: 'route',
            data: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance/`,
          };
      }
    });
    this.aduianceTitle = this._TranslateService.instant('ADUIANCE.TITLE');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('ADUIANCE.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
                    this._Router.navigate([
                      `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance/${this.current_row_selected}`,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'AUDIENCE' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('ADUIANCE.AUDIENCE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance/action/${this.current_row_selected}`,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'AUDIENCE' , 'EDIT')
      },
      {
        label: this._TranslateService.instant('ADUIANCE.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'AUDIENCE' , 'DELETE')
      },
    ];

  }


  // 🔹 Pagination
  getAduianceList(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._AwarenessService
      .getAduianceList(
        event,
        +this.awarenessId
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

  // 🔹 Delete
  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  deleteAduiance() {
    if(!this._PermissionSystemService.can('AWARNESS' , 'AUDIENCE' , 'DELETE')) return;
    const aduianceId = this.current_row_selected;
    this.loadDelted = true;
    this._AwarenessService.deleteAduiance(aduianceId).subscribe({
      next: () => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          detail: this._TranslateService.instant('ADUIANCE.DELETED_SUCCESS'),
        });
        this.actionDeleteVisible = false;
        this.getAduianceList(this.data_payload);
      },
      error: () => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'error',
          detail: this._TranslateService.instant('ADUIANCE.DELETED_FAILED'),
        });



      },
    });
  }

  data_payload:any
    columnControl: any

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getAduianceList(event);
  }
}

