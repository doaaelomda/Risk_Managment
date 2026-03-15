import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import {
  DatePackerComponent,
  UserDropdownComponent,
  DropdownCheckboxComponent,
  RoleDropdownComponent,
  CurrencyInputComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { finalize, forkJoin, Observable, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-asset-action',
  imports: [
    CommonModule,
    FormsModule,
    UserDropdownComponent,
    UiDropdownComponent,
    ReactiveFormsModule,
    RouterLink,
    DatePackerComponent,
    TranslateModule,
    InputTextComponent,
    ButtonModule,
    CurrencyInputComponent,
    InputNumberComponent,
    TreeSelectUiComponent
  ],
  templateUrl: './asset-action.component.html',
  styleUrl: './asset-action.component.scss',
})
export class AssetActionComponent implements OnInit {
  assetTypes: any[] = []; //  AssetType = 77,
  assetPriorities: any[] = []; //  AssetPriority = 75,
  assetCategories: any[] = []; //   AssetCategory = 73,
  assetStatuses: any[] = []; //AssetStatusType = 76,
  userList: any[] = [];
  criticalityLevels: any[] = []; //   AssetCriticalityLevel = 74,
  ConfidentialityLevel:any[]=[]
  IntegrityLevel:any[]=[]
  AvailabilityLevel:any[]=[]
  current_update_id: any;

  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _AssetsService: AssetsService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _permissionService: PermissionSystemService
  ) {}

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name =
              this._TranslateService.instant('ASSETS.ADD_ASSET');
            return [];
          }
          this.current_update_id = id;
          return this._AssetsService.getAssetById(id);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.breadCrumb[this.breadCrumb.length - 1].name =
            res?.data?.shortName;
          this.initAssetForm(res.data);
        }
      });
  }

  breadCrumb: any[] = [];

  ngOnInit(): void {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS'),
        icon: '',
        routerLink: '/gfw-portal/assets',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
    ];
    this.initAssetForm();
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

    this.loadLookups();
    this.initAssetForm();
    this.handleRouteParams();
  }


  assetsCategories:any[]=[]
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

  transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return nodes.map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const isLeaf = !node.children || node.children.length === 0;
      return {
        key,
        id: node?.id || node?.govDocumentContentTypeID,
        label: node?.label || node?.name,
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }
  loadLookups() {
    forkJoin([
      this._SharedService.lookUps([77, 75, 73, 76, 74,247,248,249]),
      this._SharedService.getUserLookupData(),
      this._SharedService.assetsCategoriesTree()
    ]).subscribe((res: any[]) => {
      this.assetTypes = res[0]?.data?.AssetType;
      this.assetPriorities = res[0]?.data?.AssetPriority;
      this.assetCategories = res[0]?.data?.AssetCategory;
      this.assetStatuses = res[0]?.data?.AssetStatusType;
      this.userList = res[1]?.data;
      this.criticalityLevels = res[0]?.data?.AssetCriticalityLevel;
      this.ConfidentialityLevel=res[0]?.data?.ConfidentialityLevel
      this.IntegrityLevel=res[0]?.data?.IntegrityLevel
      this.AvailabilityLevel=res[0]?.data?.AvailabilityLevel
      this.assetsCategories = this.transformNodes(res[2]?.data)
    });
  }

  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  asset_form!: FormGroup;
  initAssetForm(data?: any) {
    this.asset_form = new FormGroup({
      shortName: new FormControl(data?.shortName, Validators.required),
      purpose: new FormControl(data?.purpose, Validators.required),
      assetPriorityId: new FormControl(
        data?.assetPriorityId,
        Validators.required
      ),
      assetCategoryId: new FormControl(
        null,
        Validators.required
      ),
      assetTypeId: new FormControl(data?.assetTypeId, Validators.required),
      assetStatusTypeId: new FormControl(
        data?.assetStatusTypeId,
        Validators.required
      ),
      location: new FormControl(data?.location, Validators.required),
      acquisitionDate: new FormControl(
        data?.acquisitionDate
          ? moment(new Date(data?.acquisitionDate)).format('MM-DD-YYYY')
          : null,
        Validators.required
      ),
      expiryDate: new FormControl(
        data?.expiryDate
          ? moment(new Date(data?.expiryDate)).format('MM-DD-YYYY')
          : null
      ),
      financialValue: new FormControl(data?.financialValue, [
        Validators.required,
      ]),
      responsibleUserId: new FormControl(
        data?.responsibleUserId,
        Validators.required
      ),
      assignmentDate: new FormControl(
        data?.assignmentDate
          ? moment(new Date(data?.assignmentDate)).format('MM-DD-YYYY')
          : null,
        Validators.required
      ),
      manufacturer: new FormControl(data?.manufacturer, Validators.required),
      assetCriticalityLevelId: new FormControl(data?.assetCriticalityLevelid),
      assetCriticalityOverallScore: new FormControl(
        data?.assetCriticalityOverallScore
      ),
      ip:new FormControl(data?.ip,Validators.required),
      availabilityLevelID:new FormControl(data?.availabilityLevelID,Validators.required),
      integrityLevelID:new FormControl(data?.integrityLevelID,Validators.required),
      confidentialityLevelID:new FormControl(data?.confidentialityLevelID,Validators.required),
    });


    if(data && data?.assetCategoryId){
          this._SharedService.assetsCategoriesTree().subscribe({
        next: (res: any) => {
          this.assetCategories = Array.isArray(res?.data) ? this.transformNodes(res.data) : [];

          const selectedNode = this.findNodeById(
            this.assetCategories,
            data.assetCategoryId
          );

          this.asset_form.get('assetCategoryId')?.setValue(selectedNode);
          this.asset_form.updateValueAndValidity()
        },
      });
    }
  }

  isLoading: boolean = false;

  submit() {
    // ===== Permissions =====
    const hasPermission = this.current_update_id
      ? this._permissionService.can('ASSETS', 'ASSETS', 'EDIT')
      : this._permissionService.can('ASSETS', 'ASSETS', 'ADD');

    if (!hasPermission) {
      return;
    }
    if (this.asset_form.invalid) {
      this.asset_form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const req = { ...this.asset_form.value };

    ['acquisitionDate', 'expiryDate', 'assignmentDate'].forEach((key) => {
      if (req[key]) {
        req[key] = moment(req[key]).utc(true).toISOString();
      }
    });

    req.assetCategoryId = req?.assetCategoryId?.id

    if (this.current_update_id) {
      req.assetId = this.current_update_id;
    }

    const APT$: Observable<any> = this.current_update_id
      ? this._AssetsService.updateAsset(req)
      : this._AssetsService.addAsset(req);

    APT$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? 'Asset Updated Successfully'
          : 'Asset Added Successfully ',
      });
      this._Router.navigate(['/gfw-portal/assets/list']);
    });
  }
}
