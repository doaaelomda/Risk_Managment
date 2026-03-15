/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimengModule } from '@gfw/primeng';
import { PaginationComponent } from '../pagination/pagination.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { LookupDefinationService } from '../../services/lookupDefination.service';
import { InputSearchComponent } from '../input-search/input-search.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../input-text/input-text.component';
import { TextareaUiComponent } from '../textarea-ui/textarea-ui.component';
import { DeleteConfirmPopupComponent } from '../delete-confirm-popup/delete-confirm-popup.component';
import { MessageService } from 'primeng/api';
import { ColorDropdownComponent } from '../color-dropdown/color-dropdown.component';
import { EditorModule } from 'primeng/editor';
import { LoaderComponent } from '../loader/loader.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-lookup-ui',
  imports: [
    CommonModule,
    AccordionModule,
    TextareaUiComponent,
    ReactiveFormsModule,
    TranslateModule,
    PrimengModule,
    PaginationComponent,
    EmptyStateComponent,
    InputSearchComponent,
    InputTextComponent,
    DeleteConfirmPopupComponent,
    ColorDropdownComponent,
    EditorModule,
    LoaderComponent,
  ],
  templateUrl: './lookup-ui.component.html',
  styleUrl: './lookup-ui.component.scss',
})
export class LookupUiComponent implements OnInit {
  constructor(
    private _LookupDefinationService: LookupDefinationService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    public _translateS: TranslateService,
    private messageService: MessageService,
    public _PermissionSystemService: PermissionSystemService
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
  moduleName:any
  breadCrumb: any;
  ngOnInit(): void {
    this.current_group_id = this._ActivatedRoute.snapshot.data['groupID'];
    this.moduleName = this._ActivatedRoute.snapshot.data['permissions'].module;
    this.getListGroupId();
    this.initLookupForm();
    this.handleItems();
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
  dataList: any;
  lists: any[] = [];
  handleAccordionChange(accordion: any, index: number, isOpen: boolean) {
    this.activeIndex = index;
    this.current_active_lookup = accordion;
    if (isOpen) {
      accordion.isExpanded = true;
      if (index === 4) return;
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
      color: new FormControl(data?.color || null),
    });
  }
  getCurrentListData() {
    this.loading = true;
    this._LookupDefinationService
      .getDefintionSearch(
        this.current_active_lookup?.id,
        this.search,
        this.currentPage,
        this.perPage
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
        visible: ()=> this._PermissionSystemService.can(this.moduleName, 'MASTERDATA' , 'VIEW')
      },
      {
        label: this._translateS.instant('LOOKUP.UPDATE_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=> this._PermissionSystemService.can(this.moduleName, 'MASTERDATA' , 'EDIT')
      },
      {
        label: this._translateS.instant('LOOKUP.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleDeleteClick(),
        visible: ()=> this._PermissionSystemService.can(this.moduleName, 'MASTERDATA' , 'DELETE')
      },
    ];
  }

  view_visible: boolean = false;
  getDefById(id: any) {
    return this._LookupDefinationService.getDefinitionById(id);
  }
  selectedLookup: any;
  handleViewClick() {
    this.selectedLookup = this.current_selected_row;
    this.view_visible = true;
  }
  handleUpdateClick() {
    this.selectedLookup = this.current_selected_row;
    this.initLookupForm(this.selectedLookup);
    this.action_visible = true;
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
    if(!this._PermissionSystemService.can(this.moduleName , 'MASTERDATA' , 'DELETE')) return;
    const id = this.current_selected_row?.id;
    if (!id) return;
    this.loadingDelete = true;

    this._LookupDefinationService
      .deleteDef(id, this.current_active_lookup?.id)
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
  getListGroupId() {
    this.isLoadingList = true;
    this._ActivatedRoute.data.subscribe((data) => {
      const groupId = data['groupID'];
      const baseURL = '/gfw-portal/';
      const listURL = data['listURL'];
      this.breadCrumb[1].routerLink = `${baseURL}${listURL}`;
      console.log('Group ID:', groupId);
      this._LookupDefinationService
        .getListLookupByGroupId(groupId)
        .subscribe((res) => {
          this.lists = res?.data?.lookups;
          this.breadCrumb[1].name = res?.data?.moduleName;
          this.isLoadingList = false;
          console.log(res, 'got lookups');
        });
    });
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }
  closeActionDialog() {
    this.action_visible = false;
    this.current_selected_row = null;
  }
  save() {

          // ===== Permissions =====
  const hasPermission = this.current_selected_row?.id
    ? this._PermissionSystemService.can(this.moduleName, 'MASTERDATA', 'EDIT')
    : this._PermissionSystemService.can(this.moduleName, 'MASTERDATA', 'ADD');

  if (!hasPermission) {
    return;
  }
    const payload = this.lookupForm.value;
    if (this.lookupForm.invalid) return;
    this.loadingActionBtn = true;
    const defId = this.current_selected_row?.id;
    const msg = this.current_selected_row?.id ? 'updated' : 'created';
    this._LookupDefinationService
      .saveDef(payload, this.current_active_lookup?.id, defId)
      .subscribe({
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
  truncateWords(text: string, first = 0, last = 3): string {
    if (!text) return '';

    const words = text.split(' ');
    if (words.length <= first + last) {
      return text;
    }

    return `${words.slice(0, first).join(' ')}${words
      .slice(-last)
      .join(' ')}`;
  }
}
