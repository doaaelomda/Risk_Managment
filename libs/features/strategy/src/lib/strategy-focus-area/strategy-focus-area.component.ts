import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';
import { finalize, forkJoin, of } from 'rxjs';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { StrategyService } from 'libs/features/strategy/services/strategy.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DatePackerComponent,
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { EditorModule } from 'primeng/editor';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-strategy-focus-area',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    TranslateModule,
    Button,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    TextareaUiComponent,
    EditorModule,
    NewTableComponent,
    DatePackerComponent
],
  templateUrl: './strategy-focus-area.component.html',
  styleUrl: './strategy-focus-area.component.scss',
})
export class StrategyFocusAreaComponent {
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _StrategyService: StrategyService,
    private _Router: Router,
    private _activatedR: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
  }
  translateKey = 'FOCUS';
  dataViewId = 49;
  filter_id_input = 49;
  entityID_Name = 'strategicFocusAreaID';
  planId: any = '';
  view_entityRouter = '';
  dataEntityId = 49;
  dataTable!: any[]
  sort_data: any;
  selected_profile_column: any;
  loadingTable = false;
  loadDelete = false;
  items: any[] = [];
  profiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_row_selected: any;
  actionDeleteVisible = false;
  current_filters: any[] = [];
  pageginationObj = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
current_payload:any
handleDataTable(payload:any){
  this.current_payload = payload
  this.getData(payload)
}


  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
  ngOnInit(): void {
    this.initForm();
    this.handleBreadCrumb();
    this.handleItems();
    this.loadLookups()

  }
  getAllRouteParams(route: ActivatedRoute): { [key: string]: any } {
    let params: { [key: string]: any } = {};
    let currentRoute: ActivatedRoute | null = route.root;

    while (currentRoute) {
      params = {
        ...params,
        ...currentRoute.snapshot.params,
      };
      currentRoute = currentRoute.firstChild;
    }

    return params;
  }

  handleItems() {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      const planId = res?.get('planId');

      this.items = [
        {
          label: this._TranslateService.instant(
            'STRATEGY.VIEW_' + this.translateKey
          ),
          icon: 'fi fi-rr-eye',
          command: () => {
            //
            this._Router.navigateByUrl(
              `/gfw-portal/strategy/plan/${planId}/focus/${this.current_row_selected}`
            );
          },
          visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'VIEW')
        },
        {
          label: this._TranslateService.instant(
            'STRATEGY.UPDATE_' + this.translateKey
          ),
          icon: 'fi fi-rr-pencil',
          command: () => {
            this.getFocusById(this.current_row_selected);
          },
          visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'EDIT')
        },
        {
          label: this._TranslateService.instant(
            'STRATEGY.DELETE_' + this.translateKey
          ),
          icon: 'fi fi-rr-trash',
          command: () => {
            //
            this.actionDeleteVisible = true;
          },
          visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'DELETE')
        },
      ];
    });
  }
  getFocusById(id: any) {
    this._StrategyService.getFocusById(id).subscribe((res: any) => {
      console.log(res, 'got focus');
      this.initForm(res?.data);
      this.isAddingNew = true;
    });
  }


  setSelected(event: any) {
    console.log(event);

    this.current_row_selected = event;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  total_items_input: any = '';
  pagination:any
  getData(event?: any) {
    this.loadingTable = true;
    this._StrategyService
      .getStrategicFocusAreaSearch(
        {...event,strategicPlanId:this.planId}

      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.loadingTable = false;
          this.dataTable = res?.data?.items;
          this.total_items_input = this.dataTable?.length;
                    this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pagination);
        },
        error: (err: any) => {
          this.loadingTable = false;
        },
      });
  }

  statusList: any[] = [];
  priorityList: any[] = [];
  roleList: any[] = [];
  loadLookups() {
    forkJoin([
      this._SharedService.lookUps([122, 123]),
      this._SharedService.getRoleLookupData(),
    ]).subscribe({
      next: (res: any[]) => {
        if (res) {
          this.statusList = res[0]?.data?.StrategicGoalStatusType || [];
          this.priorityList =
            res[0]?.data?.StrategicGoalPriorityLevelType || [];

          this.roleList = res[1]?.data || [];
        }
      },
    });
  }
  focusId: any = '';
  handleBreadCrumb() {
    const { planId, focusId } = this.getAllRouteParams(this._activatedR);
    this.planId = planId;
    this.focusId = focusId;
    this.view_entityRouter =  `/gfw-portal/strategy/plan/${planId}/focus`
    // this.getData();
    this.getDataById(planId, focusId);
  }

  getDataById(planId: any, focusId: any) {
    const breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY'),
        icon: '',
        routerLink: '/gfw-portal/strategy',
      },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY_PLANS'),
        icon: '',
        routerLink: '/gfw-portal/strategy/plans',
      },
    ];

    const plan$ = planId ? this._StrategyService.getPlanById(planId) : of(null);
    const focus$ = focusId
      ? this._StrategyService.getFocusById(focusId)
      : of(null);

    forkJoin([plan$, focus$]).subscribe(([planRes, focusRes]) => {
      if (planRes) {
        const name = planRes?.data?.name;
        breadCrumb.push({
          name: name || this._TranslateService.instant('STRATEGY.PLAN'),
          icon: '',
          routerLink: `/gfw-portal/strategy/plan/${planId}/overview`,
        });
      }

      if (focusRes) {
        const name = focusRes?.data?.name;
        breadCrumb.push({
          name: name || this._TranslateService.instant('STRATEGY.FOCUS'),
          icon: '',
          routerLink: `/gfw-portal/strategy/plan/${planId}/focus/${focusId}/overview`,
        });
      }
        const index = breadCrumb?.length - 1
        const headerTitle = breadCrumb[index]?.name
        this._StrategyService.headTitle.next(headerTitle)
      this._LayoutService.breadCrumbLinks.next(breadCrumb);
    });
  }

  isAddingNew: boolean = false;
  isLoading: boolean = false;
  save(): void {
    const canAdd = this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'ADD')
    const canEdit = this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return

    if (this.tabForm.invalid) return;
    this.isLoading = true;
    const msg = this.current_row_selected ? 'updated' : 'created';

     const payload = { ...this.tabForm.value };

  ['startDate', 'endDate'].forEach((key) => {
    if (payload[key]) {
      payload[key] = moment(payload[key]).toISOString();
    }
  });
    this._StrategyService
      .saveFocus(payload, this.planId, this.current_row_selected)
      .subscribe((res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Focus ${msg} successfully`,
        });
        this.isAddingNew = false;
        this.getData(this.current_payload);
        this.tabForm.reset()
        console.log(res, 'created');
      });
  }
  getDialogHeader() {
    return (
      (this.current_row_selected ? 'STRATEGY.UPDATE_' : 'STRATEGY.ADD_NEW_') +
      this.translateKey
    );
  }


  tabForm!: FormGroup;
  initForm(data?: any) {
    this.tabForm = new FormGroup({
      name: new FormControl(data?.name || null, Validators.required),
      nameAr: new FormControl(data?.nameAr || null, Validators.required),
      description: new FormControl(data?.description || null),
      descriptionAr: new FormControl(data?.descriptionAr || null),
        startDate: new FormControl(
        data?.startDate
          ? moment(new Date(data?.startDate)).format('MM-DD-YYYY')
          : null
      ),
      endDate: new FormControl(
        data?.endDate
          ? moment(new Date(data?.endDate)).format('MM-DD-YYYY')
          : null
      ),
      ownerRoleID: new FormControl(
        data?.ownerRoleID || null,
        Validators.required
      ),
      // importanceOrder: new FormControl(data?.importanceOrder || null),
      strategicFocusAreaStatusTypeID: new FormControl(
        data?.strategicFocusAreaStatusTypeID || null
      ),
      strategicFocusAreaPriorityLevelTypeID: new FormControl(
        data?.strategicFocusAreaPriorityLevelTypeID || null
      ),
    });
  }

  isDeleteLoading: boolean = false;
  deleteItem() {
     if(!this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'DELETE')) return;

    this.isDeleteLoading = true;
    this._StrategyService
      .deleteFocus(this.current_row_selected)
      .subscribe((res) => {
        this.isDeleteLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Focus deleted successfully`,
        });

        this.actionDeleteVisible = false;
        this.getData(this.current_payload);
      });
  }
}
