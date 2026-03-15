import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceService } from '../../compliance/compliance.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DeleteConfirmPopupComponent,
  PaginationComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'lib-new-authorities-doc-list',
  imports: [
    CommonModule,
    KnobModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    PaginationComponent,
    SkeletonModule,
  ],
  templateUrl: './new_authorities-doc-list.component.html',
  styleUrl: './new_authorities-doc-list.component.scss',
})
export class NewAuthoritiesDocListComponent {
  value: number = 70;
  current_filters: any;
  sort_data: any;
  dataDocList: any;
  loading: boolean = false;
  govDocumentContentId: any;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activeRouter: ActivatedRoute,
    private _complianceService: ComplianceService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _router: Router
  ) {
    this.govDocumentContentId = this._activeRouter.snapshot.paramMap.get('id')!;
    this.handleBreadCramb();
    this.getDocument();
  }
  handleBreadCramb() {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/competent_authorities',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.COMPETENT_AUTHORITIES'),
        icon: '',
        routerLink: '/gfw-portal/compliance/competent_authorities',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
        ),
        icon: '',
        routerLink: 'gfw-portal/compliance/complianceDocuments',
      },
    ]);
    this._LayoutService.breadCrumbAction.next(null);
  }

  loadDelted: boolean = false;
  actionDeleteVisible: any;
  current_row_selected: any;
  deleteDocument() {
    this.loadDelted = true;
    this._complianceService
      .deleteDocument(this.current_row_selected)
      .subscribe((res) => {
        this.loadDelted = false;
        this.getDocument();
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document Deleted Successfully !',
        });
      });
  }

  handleShowDelete(event: boolean) {
    console.log('delte emited', event);

    this.actionDeleteVisible = true;
  }
skeletonArray: any[] = [];

getDocument(event?: any) {
  this.loading = true;
  this.skeletonArray = Array(this.pageginationObj?.perPage || 4);

  this._complianceService.ComplianceDocumentDashBoard(
    this.sort_data,
    event?.currentPage ?? 1,
    event?.perPage ?? 10,
    this.current_filters,
    this.govDocumentContentId
  ).subscribe((res: any) => {
    this.dataDocList = res?.data?.items;
    this.pageginationObj = {
      perPage: res?.data?.pageSize,
      currentPage: res?.data?.pageNumber,
      totalItems: res?.data?.totalCount,
      totalPages: res?.data?.totalPages,
    };
    this._SharedService.paginationSubject.next(this.pageginationObj);
    this.loading = false;
  });
}

  addNewDocument() {
    this._router.navigate([
      `/gfw-portal/compliance/${this.govDocumentContentId}/addcomplianceDocuments`,
    ]);
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  quickAddVisible: boolean = false;

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
  openPoup(event?: any) {
    ;
    this.actionDeleteVisible = true;
    this.current_row_selected = event;
  }
  editDocument(event: any) {
    this.current_row_selected = event;
    this._router.navigate([
      `/gfw-portal/compliance/${this.govDocumentContentId}/updatecomplianceDocuments/`,
      this.current_row_selected,
    ]);
  }

  viewDocument(event: any) {
    this.current_row_selected = event;
    this._router.navigate([
      `/gfw-portal/compliance/${this.govDocumentContentId}/overViewDocument/`,
      this.current_row_selected,
    ]);
  }
}
