import { EditorModule } from 'primeng/editor';
import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { RiskService } from './../../../../risks/src/services/risk.service';
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
  DatePackerComponent,
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
import { ColorDropdownComponent } from 'libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-strategy-objective',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    SharedUiComponent,
    TranslateModule,
    Button,
    DialogModule,
    InputTextComponent,
    FormsModule,
    ReactiveFormsModule,
    TextareaUiComponent,
    UiDropdownComponent,
    InputNumberComponent,
    DatePackerComponent,
    TreeSelectUiComponent,
    ColorDropdownComponent,
    EditorModule,
    NewTableComponent
],
  templateUrl: './strategy-objective.component.html',
  styleUrl: './strategy-objective.component.scss',
})
export class StrategyObjectiveComponent {
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _StrategyService: StrategyService,
    private _Router: Router,
    private _activatedR: ActivatedRoute,
    private _riskService: RiskService,
    public _PermissionSystemService:PermissionSystemService
  ) {
  }
  translateKey = 'OBJECTIVES';
  singleTranslateKey = 'OBJECTIVE';
  dataViewId = 40;
  filter_id_input = 40;
  entityID_Name = 'strategicObjectiveID';
  view_entityRouter = '';
  dataEntityId = 40;
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
  OrganizationalUnit: any = [];
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
    this.getOrgs();
    this.loadLookups();
  }
  getOrgs() {
    this._riskService.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.OrganizationalUnit = this.transformNodes(res?.data);
        console.log('OrganizationalUnit', this.OrganizationalUnit);
      },
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
    const { planId, focusId, goalId } = this.getAllRouteParams(
      this._activatedR
    );

    console.log(this.getAllRouteParams(this._activatedR), 'ddd');

    this.items = [
      {
        label: this._TranslateService.instant(
          'STRATEGY.VIEW_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          const url =
            focusId && !goalId
              ? `/focus/${focusId}/objective/${this.current_row_selected}`
              : goalId && !focusId
              ? `/goal/${goalId}/objective/${this.current_row_selected}`
              : focusId && goalId
              ? `/focus/${focusId}/goal/${goalId}/objective/${this.current_row_selected}`
              : `/objective/${this.current_row_selected}`;
          //
          this._Router.navigateByUrl(
            `/gfw-portal/strategy/plan/${planId}${url}`
          );
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'VIEW')

      },
      {
        label: this._TranslateService.instant(
          'STRATEGY.UPDATE_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.getObjectiveById(this.current_row_selected);
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'EDIT')

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
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'DELETE')

      },
    ];
  }
  getObjectiveById(id: any) {
    this._StrategyService.getObjectiveById(id).subscribe((res: any) => {
      console.log(res, 'got objective');
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
    const url =
      focusId && !goalId
        ? `/focus/${focusId}/objective`
        : goalId && !focusId
        ? `/goal/${goalId}/objective`
        : focusId && goalId
        ? `/focus/${focusId}/goal/${goalId}/objective`
        : `/objective`;
    //
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
          const url = focusId
            ? `/focus/${focusId}/goal/${goalId}/overview`
            : `/goal/${goalId}/overview`;

          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.GOAL'),
            icon: '',
            routerLink: `/gfw-portal/strategy/plan/${planId}${url}`,
          });
        }
        const index = breadCrumb?.length - 1;
        const headerTitle = breadCrumb[index]?.name;
        this._StrategyService.headTitle.next(headerTitle);
        this._LayoutService.breadCrumbLinks.next(breadCrumb);
      }
    );
  }


  setSelected(event: any) {
    console.log(event);

    this.current_row_selected = event;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  total_items_input: any = '';
  pagination: any;
  getData(event?: any) {
    this.loadingTable = true;
    this._StrategyService
      .getStrategicObjectiveSearch(
        {...event,strategicPlanId:this.planId,
strategicFocusAreaId:this.focusId,
strategicGoalId:this.goalId}


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


  findNodeById(tree: any[], id: number): any {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  tabForm!: FormGroup;
  initForm(data?: any) {
    this.tabForm = new FormGroup({
      strategicThemeID: new FormControl(
        data?.strategicThemeID ?? null,
        Validators.required
      ),
      strategicPerspectiveTypeID: new FormControl(
        data?.strategicPerspectiveTypeID ?? null,
        Validators.required
      ),
      parentObjectiveID: new FormControl(data?.parentObjectiveID ?? null),
      indicatorID: new FormControl(
        data?.indicatorID ?? null,
        Validators.required
      ),
      targetValue: new FormControl(
        data?.targetValue ?? null,
        Validators.required
      ),
      currentValue: new FormControl(
        data?.currentValue ?? null,
        Validators.required
      ),
      achievementPercentage: new FormControl(
        data?.achievementPercentage ?? null,
        Validators.required
      ),
      strategicObjectiveStatusTypeID: new FormControl(
        data?.strategicObjectiveStatusTypeID ?? null,
        Validators.required
      ),
      ownerRoleID: new FormControl(
        data?.ownerRoleID ?? null,
        Validators.required
      ),
      organizationalUnitID: new FormControl(
        data?.organizationalUnitID
          ? this.findNodeById(
              this.OrganizationalUnit,
              data.organizationalUnitID
            )
          : null,
        Validators.required
      ),
      startDate: new FormControl(
        data?.startDate ? new Date(data?.startDate) : null,
        Validators.required
      ),
      endDate: new FormControl(
        data?.endDate ? new Date(data?.endDate) : null,
        Validators.required
      ),
      strategicObjectivePriorityLevelTypeID: new FormControl(
        data?.strategicObjectivePriorityLevelTypeID ?? null,
        Validators.required
      ),
      importanceOrder: new FormControl(
        data?.importanceOrder ?? null,
        Validators.required
      ),
      color: new FormControl(data?.color ?? null, Validators.required),
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
    });
  }

  isAddingNew: boolean = false;

  isLoading: boolean = false;
  save(): void {
    const canAdd = this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'ADD')
    const canEdit = this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return

    if (this.tabForm.invalid) return;
    this.isLoading = true;
    const msg = this.current_row_selected ? 'updated' : 'created';
    const payload = {
      ...this.tabForm.value,
      organizationalUnitID: this.tabForm.get('organizationalUnitID')?.value?.id,
    };
    this._StrategyService
      .saveObjective(
        payload,
        this.planId,
        this.focusId,
        this.goalId,
        this.current_row_selected
      )
      .subscribe((res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Objective ${msg} successfully`,
        });
        this.isAddingNew = false;
        this.getData();
        this.tabForm.reset();
        console.log(res, 'created');
      });
  }
  getDialogHeader() {
    return (
      (this.current_row_selected ? 'STRATEGY.UPDATE_' : 'STRATEGY.ADD_NEW_') +
      this.singleTranslateKey
    );
  }
  statusList: any[] = [];
  priorityList: any[] = [];
  roleList: any[] = [];
  perspectives: any[] = [];
  themes: any[] = [];
  indicators: any[] = [];
  loadLookups() {
    forkJoin([
      this._SharedService.lookUps([127, 167, 124, 125, 102]),
      this._SharedService.getRoleLookupData(),
    ]).subscribe({
      next: (res: any[]) => {
        if (res) {
          this.statusList = res[0]?.data?.StrategicStatusType || [];
          this.priorityList =
            res[0]?.data?.StrategicObjectivePriorityLevelType || [];
          this.perspectives = res[0]?.data?.StrategicPerspectiveType || [];
          this.themes = res[0]?.data?.StrategicTheme || [];
          this.indicators = res[0]?.data?.Indicator || [];
          this.roleList = res[1]?.data || [];
        }
      },
    });
  }

  isDeleteLoading: boolean = false;
  deleteItem() {
     if(!this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'DELETE')) return;

    this.isDeleteLoading = true;
    this._StrategyService
      .deleteObjective(this.current_row_selected)
      .subscribe((res) => {
        this.isDeleteLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Objective deleted successfully`,
        });

        this.actionDeleteVisible = false;
        this.getData(this.current_payload);
      });
  }
}
