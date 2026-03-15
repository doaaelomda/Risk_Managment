import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  DatePackerComponent,
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { finalize, Observable } from 'rxjs';
import { GovDocumentsService } from '../../../service/covDocument.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import * as moment from 'moment';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-versions',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    InputTextComponent,
    DatePackerComponent,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    NewTableComponent
],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss',
})
export class VersionsComponent implements OnInit {
  dataList: any[] = [];
  profilesList: any[] = [];
  defultprofile: any;
  action_items: any[] = [];
  contentTypeOptions = [];
  // specify option ids that should be disabled in the multi-select
  disabledContentTypeIds: any[] = [];
  current_row_selected: any;
  loadingState: boolean = false;
  loadDeleted: boolean = false;
  quickAddVisible: boolean = false;
  actionDeleteVisible: boolean = false;
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  editVersion: boolean = false;
  current_update_id:any
  data_sort: any = null;
  current_filters: any[] = [];
  loading: boolean = false;
  selected_profile_column: any;
  formVersion!: FormGroup;
  isLoading:boolean=false
  loadingBtn: boolean = false;
  Docid: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _GovDocumentsService: GovDocumentsService,
    private _MessageService: MessageService,
    private _ActiveRouter: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {

        this.initVersionForm();

    this.Docid = this._ActiveRouter.snapshot.parent?.params['Docid'];
    this.columnControl = {
      type:'route',
      data:`/gfw-portal/governance/viewDocument/${this.Docid}/versions`
    }
    this.getByIdDocumnet()


  }
  columnControl:any
DocumentData:any;
    getByIdDocumnet() {
    this._GovDocumentsService.getOneDoc(this.Docid).subscribe((docRes: any) => {
      this.DocumentData = docRes?.data;
      this.loadLookups();
    });
  }

  ngOnInit(): void {
    this.action_items = [
      {
        label: this._TranslateService.instant('VERSION_LIST.VIEW_VERSION'),
        icon: 'fi fi-rr-eye',
        command: () =>
          this._router.navigate([
            `/gfw-portal/governance/viewDocument/${this.Docid}/versions/${this.current_row_selected}`,
          ]),
          visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('VERSION_LIST.DELETE_VERSION'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
         visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('VERSION_LIST.UPDATE_VERSION'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.quickAddVisible = true;
          this.editVersion = true;
          this.getDocumentVersionById()
          // this.current_update_id = id;
        },
         visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'EDIT')
      },
    ];

  }

  getDocumentVersionById(){
    this._GovDocumentsService.getByIdVersion(this.current_row_selected).subscribe((res:any)=>{
    this._GovDocumentsService.currentContentTypes.set(res.data.govDocumentContentTypes)

      this.initVersionForm(res?.data)
      this.current_update_id = res?.data?.govDocumentVersionID;
    })
  }
  


  setSelectedContentTypeGovDoc(){
          const IdsDisabled:any[] = this.DocumentData?.govDocumentContentTypes?.map((type:any) => {return type?.govDocumentContentTypeID});
      this.formVersion.get('govDocumentVersionContentTypeIds')?.setValue(IdsDisabled)
      this.formVersion.get('govDocumentVersionContentTypeIds')?.updateValueAndValidity();
  }

    loadLookups() {
    this._sharedService.lookUps([ 228]).subscribe((res: any) => {
      const opts = res?.data?.GovDocumentContentType || [];
      const IdsDisabled:any[] = this.DocumentData?.govDocumentContentTypes?.map((type:any) => {return type?.govDocumentContentTypeID});
      console.log("opts" , opts);
      console.log("IdsDisabled" , IdsDisabled);

      this.contentTypeOptions = opts.map((o: any) => ({
        ...o,
        disabled: IdsDisabled?.includes(o?.id),
      }));

      console.log("contentTypeOptions" , this.contentTypeOptions);
      this.formVersion.get('govDocumentVersionContentTypeIds')?.setValue(IdsDisabled)
      this.formVersion.get('govDocumentVersionContentTypeIds')?.updateValueAndValidity();
      console.log("this.formVersion.get('govDocumentVersionContentTypeIds')" , this.formVersion.get('govDocumentVersionContentTypeIds')?.value);

    })}
  closeQuickAddModal() {
    this.quickAddVisible = false;
    this.formVersion.reset();
    this.current_update_id = null;
  }
  current_payload:any
  handleDataTable(payload:any){
    this.current_payload = payload
    this.getDataList(this.current_payload)
  }
  getDataList(event?: any) {
    this.loadingState = true;
    this.loading = true;
    this.dataList = [];

    this._GovDocumentsService
      .getVersionSearch(
        event,
        this.Docid
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loadingState = false;
        })
      )
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.paginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._sharedService.paginationSubject.next(this.paginationObj);
      });
  }

  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }
  deleteVersion() {
     if(!this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'DELETE')) return;
    this.loadDeleted = true;
    this._GovDocumentsService
      .deleteVersion(this.current_row_selected)
      .subscribe(() => {
        this.loadDeleted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Version deleted successfully',
        });
        this.actionDeleteVisible = false;
        this.getDataList();
      });
  }

  newVersion() {
    this.quickAddVisible = true;
    this.formVersion.reset();
    this.setSelectedContentTypeGovDoc()
  }



  initVersionForm(data?:any) {
    let ids:any[] =[]
    if(data && data?.govDocumentContentTypes){
       ids = data?.govDocumentContentTypes?.map((type:any)=> {return type?.govDocumentContentTypeID})
       let flag:boolean = false;
      let DocIDS = this.DocumentData?.govDocumentContentTypes?.map((type:any)=>{
        ids.includes(type?.govDocumentContentTypeID) ? flag = true : flag = false;
        return  type?.govDocumentContentTypeID
      })

      ids = flag ? ids : [...DocIDS , ...ids]



    }
    this.formVersion = new FormGroup({
      code: new FormControl(data?.code),
      name: new FormControl(data?.name ,Validators.required),
      govDocumentVersionContentTypeIds: new FormControl(ids),
      effectiveDateFrom: new FormControl(data?.effectiveDateFrom
          ? moment(new Date(data?.effectiveDateFrom)).format('MM-DD-YYYY')
          : null),
      effectiveDateTo: new FormControl(data?.effectiveDateTo
          ? moment(new Date(data?.effectiveDateTo)).format('MM-DD-YYYY')
          : null),
    });



  }
  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'ADD')
    const canEdit =this._PermissionSystemService.can('GOVERNANCE' , 'VERSION' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.formVersion.invalid) {
      this.formVersion.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const req = { ...this.formVersion.value , govDocumentId:this.Docid};

    ['effectiveDateTo', 'effectiveDateFrom'].forEach((key) => {
      if (req[key]) {
        req[key] = moment(req[key]).utc(true).toISOString();
      }
    });

    if (this.current_update_id) {
      req.govDocumentVersionId = this.current_update_id;
    }

    const APT$: Observable<any> = this.current_update_id
      ? this._GovDocumentsService.updateVersion(req)
      : this._GovDocumentsService.createVersionr(req);

    APT$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? 'Version Updated Successfully'
          : 'Version Added Successfully ',
      });
      this.quickAddVisible=false
      this.getDataList()
    });
  }
}
