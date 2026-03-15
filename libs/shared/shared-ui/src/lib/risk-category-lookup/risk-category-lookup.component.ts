/* eslint-disable @nx/enforce-module-boundaries */
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSearchComponent } from '../input-search/input-search.component';
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { MenuModule } from 'primeng/menu';
import { SharedService } from '../../services/shared.service';
import { RiskCategoryLookupService } from '../../services/riskCategoryLookup.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { DialogModule } from 'primeng/dialog';
import { DeleteConfirmPopupComponent } from '../delete-confirm-popup/delete-confirm-popup.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { TextareaUiComponent } from '../textarea-ui/textarea-ui.component';
import { ColorDropdownComponent } from '../color-dropdown/color-dropdown.component';
import { Button } from 'primeng/button';
import { UiDropdownComponent } from "../ui-dropdown/ui-dropdown.component";
@Component({
  selector: 'lib-risk-category-lookup',
  imports: [
    CommonModule,
    InputSearchComponent,
    TranslateModule,
    TableModule,
    EmptyStateComponent,
    PaginationComponent,
    MenuModule,
    DialogModule,
    DeleteConfirmPopupComponent,
    InputTextComponent,
    TextareaUiComponent,
    ColorDropdownComponent,
    Button,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent
],
  templateUrl: './risk-category-lookup.component.html',
  styleUrl: './risk-category-lookup.component.scss',
})
export class RiskCategoryLookupComponent implements OnInit {
  constructor(
    public _translateS: TranslateService,
    private _SharedService: SharedService,
    private _RiskCategoryLookupService: RiskCategoryLookupService,

    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private messageService: MessageService
  ) {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: '',
        icon: '',
        routerLink: '',
      },
      {
        name: this._translateS.instant('BREAD_CRUMB_TITLES.MASTER_SETTINGS'),
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  breadCrumb: any;
  ngOnInit(): void {
    this.current_group_id = this._ActivatedRoute.snapshot.data['groupID'];
    this.initLookupForm();
    this.handleItems();
    this.getLookUps()
  }
methodologies:any = []
  getLookUps(){
    this._SharedService.lookUps([206]).subscribe(res => {
      console.log(res,'got looksups');
      const methodoligies = res?.data?.RiskMethodology
      this.methodologies = methodoligies
      
    })
  }
  current_selected_row: any = '';

  current_group_id: any;
  perPage: any = 10;
  currentPage: any = 1;
  handleChangePage(event: any) {
    this.perPage = event?.perPage;
    this.currentPage = event?.currentPage;
    this.getCurrentListData();
  }
  search: any = '';
  handleSearch(event: any) {
    this.search = event;
    this.getCurrentListData();
  }
  loading: boolean = false;
  current_active_lookup: any;
  dataList: any[] = [];
  lists: any[] = [];
  handleAccordionChange(accordion: any, index: number, isOpen: boolean) {
    this.activeIndex = index;
    this.current_active_lookup = accordion;
    if (isOpen) {
      accordion.isExpanded = true;
      this.getCurrentListData();
    } else {
      accordion.isExpanded = false;
    }
  }
  activeIndex: number | null = null;

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 1,
    totalPages: 1,
  };

  lookupForm!: FormGroup;

  initLookupForm(data?: any) {
    this.lookupForm = new FormGroup({
      name: new FormControl(data?.name || '', Validators.required),
      nameAr: new FormControl(data?.nameAr || '', Validators.required),
      description: new FormControl(data?.description || ''),
      descriptionAr: new FormControl(data?.descriptionAr || ''),
      color: new FormControl(data?.color ?? null),
      riskMethodologyID: new FormControl(data?.riskMethodologyID ?? null),
    });
  }
  getCurrentListData() {
    this.loading = true;
    this._RiskCategoryLookupService
      .getCategoryList(
        this.currentPage,
        this.perPage,
        this.search,

        this.current_active_lookup?.id
      )
      .subscribe((res) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });

    this.loading = false;
  }
  loadingActionBtn: boolean = false;
  action_visible: boolean = false;
  items: any[] = [];

  handleItems() {
    this.items = [
      {
        label: this._translateS.instant('LOOKUP.VIEW_ITEM'),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
      },
      {
        label: this._translateS.instant('LOOKUP.UPDATE_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
      },
      {
        label: this._translateS.instant('LOOKUP.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleDeleteClick(),
      },
    ];
  }

  view_visible: boolean = false;
  getDefById(id: any) {
    return this._RiskCategoryLookupService.getDefinitionById(id);
  }
  selectedLookup: any;
  handleViewClick() {
    const id = this.current_selected_row?.riskCategoryID
    this._RiskCategoryLookupService.getDefinitionById(id).subscribe(res => {
      console.log(res,'got data by id');
      this.selectedLookup = res?.data
    this.view_visible = true;
    })

  }
  handleUpdateClick() {
    const id = this.current_selected_row?.riskCategoryID
    this._RiskCategoryLookupService.getDefinitionById(id).subscribe(res => {
      console.log(res,'got data by id');
          this.initLookupForm(res?.data);
    this.action_visible = true;
    })

  }


  handleDeleteClick() {
    this.deleteModalVisible = true;
  }
  deleteModalVisible: boolean = false;
  closeDeleteModal() {
    this.deleteModalVisible = false;
    this.current_selected_row = null;
  }
  loadingDelete: boolean = false;
  delete() {
    const id = this.current_selected_row?.riskCategoryID;
    if (!id) return;
    this.loadingDelete = true;

    this._RiskCategoryLookupService
      .deleteDef(id)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Lookup deleted successfully',
          });
          this.loadingDelete = false;
          this.closeDeleteModal();
          this.getCurrentListData();
        },
        error: (err) => {
          this.loadingDelete = false;
        },
      });
  }
  isLoadingList: boolean = false;

  closeActionDialog() {
    this.action_visible = false;
    this.current_selected_row = null;
  }
  save() {
    const payload = this.lookupForm.value;
    if (this.lookupForm.invalid) return;
    this.loadingActionBtn = true;
    const defId = this.current_selected_row?.riskCategoryID;
    const msg = defId ? 'updated' : 'created';
    this._RiskCategoryLookupService.saveDef(payload, defId).subscribe({
      next: () => {
        this.loadingActionBtn = false;
        this.messageService.add({
          severity: 'success',
          detail: `Lookup ${msg} successfully`,
        });
        this.closeActionDialog();
        this.getCurrentListData();
      },
      error: () => (this.loadingActionBtn = false),
    });
  }
}
