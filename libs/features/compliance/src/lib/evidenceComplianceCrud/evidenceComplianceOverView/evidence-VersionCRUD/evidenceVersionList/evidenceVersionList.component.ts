import { ContainerContentComponent } from './../../../../../../../covernance/src/lib/overviewDocument/versions/overviewVersion/containerContent/containerContent.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';

/* Shared UI & Services */
import { DeleteConfirmPopupComponent, NewAttachListComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { PdfPreviewComponent } from 'libs/shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
import { DocsPreviewComponent } from 'libs/shared/shared-ui/src/lib/docs-preview/docs-preview.component';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { EmptyStateFilesComponent } from 'libs/shared/shared-ui/src/lib/empty-state-files/empty-state-files.component';
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";
import { SharedFileViewerComponent } from "libs/shared/shared-ui/src/lib/shared-file-viewer/shared-file-viewer.component";

@Component({
  selector: 'lib-evidence-version-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    NewTableComponent,
    PdfPreviewComponent,
    DocsPreviewComponent,
    EmptyStateFilesComponent,
    SystemActionsComponent,
    SharedFileViewerComponent
],
  templateUrl: './evidenceVersionList.component.html',
  styleUrl: './evidenceVersionList.component.scss',
})
export class EvidenceVersionListComponent implements OnInit, OnDestroy {
  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  // Table & Pagination
  loadingTable = true;
  dataTable: any[] = [];
  paginationObj = { perPage: 10, currentPage: 1, totalItems: 0, totalPages: 1 };
  current_filters: any[] = [];
  sort_data: any;
  loadingState:boolean=false
  attachments:any
  // Selected Row & Actions
  current_row_selected: any;
  actionDeleteVisible = false;
  loadDeleted = false;
  env: any;
  // Breadcrumb & IDs
  evidenceId: any;
  current_evidence_payload:any
  // Menu items for table actions
  items: any[] = [];

  // Modal View
  showViewModal = false;
  singleTaskData: any;

  // Route column control
  columnControl: any = { type: 'modal', data: '' };

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ComplianceService: ComplianceAssessmntService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.initializeEvidenceId();
    this.initializeActionItems();
    this.env = enviroment.DOMAIN_URI;
    this.columnControl.data = `/gfw-portal/compliance/evidenceType/${this.evidenceId}/add-EvidenceVersion`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Initialize evidenceId from route and update breadcrumb
  private initializeEvidenceId() {
    const routeSub = this._ActivatedRoute?.parent?.paramMap.subscribe((params) => {
      this.evidenceId = params.get('id');

      if (this.evidenceId) {
        this._ComplianceService.getEvidenceComplianceById(this.evidenceId).subscribe((res: any) => {
          const evidenceName = res?.data?.name || '-';
          this._LayoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'),
              icon: '',
              routerLink: '/gfw-portal/compliance/evidenceType',
            },
            { name: evidenceName, icon: '', routerLink: `/gfw-portal/compliance/evidenceType/${this.evidenceId}` },
            {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_VERSION_LIST'),
              icon: '',

            },
          ]);
        });
      }
    });

    this.subscriptions.add(routeSub);
  }

  // Initialize action items for table row menu
  private initializeActionItems() {
    this.items = [
      {
        label: this._TranslateService.instant('EVIDENCE_VERSION.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.openViewModal(),
          visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCEVERSION' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('EVIDENCE_VERSION.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
          visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCEVERSION' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('EVIDENCE_VERSION.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/compliance/evidenceType/${this.evidenceId}/update-EvidenceVersion`,
            this.current_row_selected,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCEVERSION' , 'EDIT')

      },
    ];
  }

  // Set selected row from table
  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

    // Handle data table refresh
  handleDataTable(payload: any = null) {
    this.current_evidence_payload = payload;
    this.getDataTable(payload);
  }


  handleModal(event:any){
    this.current_row_selected = event?.evidenceTypeVersionID;
    this.openViewModal()
  }

  // Get data table from API
  getDataTable(payload: any) {
    this.loadingTable = true;
    this.dataTable = [];
    const sub = this._ComplianceService
      .getEvidenceVersionSearch(payload,+this.evidenceId)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });

    this.subscriptions.add(sub);
  }

  // Show/Hide Delete Modal
  handleShowDelete(visible: boolean) {
    this.actionDeleteVisible = visible;
  }

  handleClosedDelete(_: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  // Delete selected evidence version
  deleteEvidenceVersion() {
     if(!this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCEVERSION' , 'DELETE')) return;

    if (!this.current_row_selected) return;
    this.loadDeleted = true;

    this._ComplianceService
      .deleteEvidenceVersion(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('EVIDENCE_VERSION.DELETE_SUCCESS'),
        });

        this.handleDataTable(this.current_evidence_payload);
        this.handleClosedDelete(false);
      });
  }

  // Open modal to view evidence version details

  loadingView:boolean = false;
  openViewModal() {
    if (!this.current_row_selected) return;

    this.loadingView = true
    this.showViewModal = true;
    this.getAttachments()
    this._ComplianceService.getEvidenceVersionById(this.current_row_selected).pipe(finalize(()=> this.loadingView = false)).subscribe((res: any) => {
      this.singleTaskData = res?.data;

    });
  }

  onModalClose() {
    this.showViewModal = false;
  }

   getAttachments() {
      this.loadingState = true;
        this._SharedService.getNewAttachment(64, +this.current_row_selected, 64).subscribe({
          next: (res: any) => {
            this.attachments = res?.data[0];
            this.loadingState = false;
            console.log(this.env + this.attachments?.fileUrl?.substring(1));
          },
        });
      }

}
