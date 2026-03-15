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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DeleteConfirmPopupComponent,
  SharedUiComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-strategy-goals',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    SharedUiComponent,
    TranslateModule,
    Button,
    UiDropdownComponent,
    InputNumberComponent,
    TextareaUiComponent,
    InputTextComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    NewTableComponent
],
  templateUrl: './strategy-goals.component.html',
  styleUrl: './strategy-goals.component.scss',
})
export class StrategyGoalsComponent {
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
  translateKey = 'GOALS';
  singleTranslateKey = 'GOAL';
  dataViewId = 50;
  filter_id_input = 50;
  entityID_Name = 'strategicGoalID';
  view_entityRouter = '';
  dataEntityId = 50;
  dataTable!: any[];
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


    this.loadLookups();
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
    const { planId, focusId } = this.getAllRouteParams(this._activatedR);

    console.log(this.getAllRouteParams(this._activatedR), 'ddd');
    this.items = [
      {
        label: this._TranslateService.instant(
          'STRATEGY.VIEW_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          const url = focusId
            ? `/focus/${focusId}/goal/${this.current_row_selected}`
            : `/goal/${this.current_row_selected}`;
          //
          this._Router.navigateByUrl(
            `/gfw-portal/strategy/plan/${planId}${url}`
          );
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'STRATEGY.UPDATE_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.getGoalById(this.current_row_selected);
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'EDIT')
      },
      {
        label: this._TranslateService.instant(
          'STRATEGY.DELETE_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          //
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'DELETE')
      },
    ];
  }
  getGoalById(id: any) {
    this._StrategyService.getGoalById(id).subscribe((res: any) => {
      console.log(res, 'got goal');
      this.initForm(res?.data);
      this.isAddingNew = true;
    });
  }

  planId: any = '';
  focusId: any = '';
  goalId: any = '';
  handleBreadCrumb() {
    const { planId, focusId, goalId } = this.getAllRouteParams(
      this._activatedR
    );
    this.planId = planId;
    this.focusId = focusId;
    this.goalId = goalId;
    const url = focusId ? `/focus/${focusId}/goal` : `/goal`;
    this.view_entityRouter = `/gfw-portal/strategy/plan/${planId}${url}`;

    this.getDataById(planId, focusId, goalId);
  }

  getDataById(planId: any, focusId: any, goalId: any) {
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
    const goal$ = goalId ? this._StrategyService.getGoalById(goalId) : of(null);

    forkJoin([plan$, focus$, goal$]).subscribe(
      ([planRes, focusRes, goalRes]) => {
        // Push in fixed order regardless of timing
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
        if (goalRes) {
          const name = goalRes?.data?.name;
          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.GOAL'),
            icon: '',
            routerLink: '',
          });
        }
        const index = breadCrumb?.length - 1;
        const headerTitle = breadCrumb[index]?.name;
        this._StrategyService.headTitle.next(headerTitle);

        this._LayoutService.breadCrumbLinks.next(breadCrumb);
      }
    );
  }

  handleSort(event: any) {
    this.sort_data = event;
  }

  setSelected(event: any) {
    console.log(event);

    this.current_row_selected = event;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  pagination: any;
  total_items_input: any = '';
  getData(event?: any) {
    console.log( {...event,
        strategicPlanId:this.planId,
        strategicFocusAreaId:this.focusId},'test');

    this.loadingTable = true;
    this._StrategyService
      .getStrategicGoalSearch(
        {...event,
        strategicPlanId:this.planId,
        strategicFocusAreaId:this.focusId}

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



  isAddingNew: boolean = false;
  isLoading: boolean = false;
  save(): void {
    const canAdd = this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return
    if (this.tabForm.invalid) return;
    this.isLoading = true;
    const msg = this.current_row_selected ? 'updated' : 'created';

    this._StrategyService
      .saveGoal(
        this.tabForm.value,
        this.planId,
        this.focusId,
        this.current_row_selected
      )
      .subscribe((res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal ${msg} successfully`,
        });
        this.isAddingNew = false;
        this.getData(this.current_payload);
        this.tabForm.reset();
        console.log(res, 'created');
      });
  }
  getDialogHeader() {
    return (
      (this.current_row_selected ? 'STRATEGY.UPDATE_' : 'STRATEGY.ADD_NEW_') +
      this.translateKey
    );
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
  tabForm!: FormGroup;
  initForm(data?: any) {
    this.tabForm = new FormGroup({
      name: new FormControl(data?.name || null, Validators.required),
      nameAr: new FormControl(data?.nameAr || null, Validators.required),
      description: new FormControl(data?.description || null),
      descriptionAr: new FormControl(data?.descriptionAr || null),
      ownerRoleID: new FormControl(
        data?.ownerRoleID || null,
        Validators.required
      ),
      importanceOrder: new FormControl(data?.importanceOrder || null),
      strategicGoalStatusTypeID: new FormControl(
        data?.strategicGoalStatusTypeID || null
      ),
      strategicGoalPriorityLevelTypeID: new FormControl(
        data?.strategicGoalPriorityLevelTypeID || null
      ),
    });
  }

  isDeleteLoading: boolean = false;
  deleteItem() {
     if(!this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'DELETE')) return;

    this.isDeleteLoading = true;
    this._StrategyService
      .deleteGoal(this.current_row_selected)
      .subscribe((res) => {
        this.isDeleteLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Goal deleted successfully`,
        });

        this.actionDeleteVisible = false;
        this.getData();
      });
  }
}
