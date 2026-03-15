import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { TreeModule } from 'primeng/tree';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TasksService } from '../../services/tasks.service';
import { DeleteConfirmPopupComponent } from '../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-orgs-units',
  imports: [
    CommonModule,
    TreeModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    InputTextComponent,
    ReactiveFormsModule,
    TextareaUiComponent,
    SkeletonModule,
    UiDropdownComponent,
  ],
      providers: [TreeDragDropService],
  templateUrl: './orgs-units.component.html',
  styleUrl: './orgs-units.component.scss',
})
export class OrgsUnitsComponent {
  constructor(
    private _LayoutService: LayoutService,
    private _TasksService: TasksService,
    private _MessageService: MessageService,
    private SharedService: SharedService,
    public _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService,
  ) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MANAGEMENT'),
        icon: '',
        routerLink: '/gfw-portal/management/org-units',
      },
      {
        name: this._TranslateService.instant('orginazation.HEADER_Title'),
        icon: '',
      },
    ]);
    this.initOrganizationForm();
  }

  orgUnitsTree: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  actions: any[] = [];
  orgaizationData: any;
  loadingTree: boolean = false;
  loadOrgainzationData: any;
  actionDeleteVisible: boolean = false;
  loadDelted: boolean = false;
  addUnitModal: boolean = false;
  EditOrg: boolean = false;
  orgin_form!: FormGroup;
  organizationalUnitTypeID: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  isActiveArray: any = [
    { id: 1, label: 'Active', value: true },
    { id: 2, label: 'In Active', value: false },
  ];
  ngOnInit() {
    this.getTreeData();
    this.getLookups();
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
         visible: ()=> this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'VIEW')
      },
    ];
    this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {
          this.EditOrg = false;
          this.addUnitModal = true;
        },
         visible: ()=> this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'ADDSUB')
      },
      {
        label: this._TranslateService.instant('Items.EDIT_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.EditOrg = true;
          this._TasksService
            .getOrganizationById(this.selected_unit?.id)
            .subscribe((res: any) => {
              this.initOrganizationForm(res?.data);
              this.addUnitModal = true;
            });
        },
         visible: ()=> this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'EDIT')
      },
      {
        label: this._TranslateService.instant('Items.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => (this.actionDeleteVisible = true),
         visible: ()=> this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'DELETE')
      },
    ];
  }

  getTreeData() {
    this.loadingTree = true;
    this._TasksService.getOrgsUnitData().subscribe((res: any) => {
      this.orgUnitsTree = this.transformToTreeNodes(res?.data);
      const default_unit = this.orgUnitsTree[0];
      if (default_unit) {
        default_unit.expanded = true;

        this.handleNodeClickAndGetData(default_unit);
      }
      this.loadingTree = false;
    });
  }
  setAllInactive(nodes: any[]): void {
    if (!nodes) return;

    for (const node of nodes) {
      node.active = false;
      if (node.children?.length) {
        this.setAllInactive(node.children);
      }
    }
  }
  handleNodeClickAndGetData(node: any) {
    console.log(node, 'node clicked');

    this.setAllInactive(this.orgUnitsTree);

    const isSameNode = this.selectedNode && this.selectedNode.id === node.id;
    if (isSameNode) {
      this.selectedNode = null;
      node.active = false;
      const expandedParent = node.parent && node.parent.expanded;
      if (expandedParent) {
        this.handleNodeClickAndGetData(node.parent);
        this.activeAllNodeParents(node);
      }

      return;
    }

    node.active = true;
    this.selectedNode = node;

    this.activeAllNodeParents(node);

    this.getOrganizatiobById(node);
  }

  activeAllNodeParents(node: any): void {
    if (!node?.parent) return;

    node.parent.active = true;

    this.activeAllNodeParents(node.parent);
  }
  getOrganizatiobById(selectedNode?: any) {
    console.log(selectedNode?.id, 'selectedNode?.id');

    this.loadOrgainzationData = true;
    this._TasksService
      .getOrganizationById(selectedNode?.id)
      .subscribe((res: any) => {
        this.orgaizationData = res?.data;
        this.loadOrgainzationData = false;
      });
  }
  getLookups() {
    this.SharedService.lookUps([129]).subscribe((res: any) => {
      this.organizationalUnitTypeID = res?.data?.OrganizationalUnitType;
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
  handleClosedDelete(event?: boolean) {
    this.actionDeleteVisible = false;
  }

  transformToTreeNodes(data: any[]): TreeNode[] {
    return data.map((item) => ({
      key: String(item.id),
      label: item.label,
      id: item.id,
      children: item.children?.length
        ? this.transformToTreeNodes(item.children)
        : [],
      expanded: false,
    }));
  }

  findNodesByIds(nodes: any[], ids: number[]): any[] {
    const result: any[] = [];

    function search(node: any) {
      if (ids.includes(node.id)) {
        result.push(node);
      }
      if (node.children) {
        node.children.forEach((child: any) => search(child));
      }
    }

    nodes.forEach((node) => search(node));
    return result;
  }
  initOrganizationForm(data?: any) {
    this.orgin_form = new FormGroup({
      parentID: new FormControl(this.parentId),
      name: new FormControl(data ? data?.name : null, [Validators.required]),
      nameAr: new FormControl(data ? data?.nameAr : null),
      isActive: new FormControl(data ? data?.isActive : true),
      description: new FormControl(data ? data?.description : null),
      descriptionAr: new FormControl(data ? data?.descriptionAr : null),
      // createBy: new FormControl(data ? data?.createBy : null),
      // color: new FormControl(data ? data?.color : null),
      // acquisitionDate: new FormControl(
      //   data
      //     ? moment(new Date(data?.acquisitionDate)).format('MM-DD-YYYY')
      //     : null
      // ),
      organizationalUnitTypeID: new FormControl(
        data ? data?.organizationalUnitTypeID : null
      ),
    });
  }
  selected_unit: any = '';
  @ViewChild('menu') menu!: any;

  handleUnitSelect(event: any, unit: any) {
    event.stopPropagation();
    console.log(unit);
    this.menu.toggle(event);
    this.selected_unit = unit;
  }
  addSubUnit() {
    this.addUnitModal = true;
    if (this.orgin_form.invalid && !this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'ADD')) {
      this.orgin_form.markAllAsTouched();
      return;
    }

    this.loadDelted = true;
    const payloadCreate = {
      ...this.orgin_form.value,
      parentID: this.selected_unit?.id ?? null,
    };
    console.log(this.selectedNode, 'this.selectedNode?.id');

    this._TasksService.CreateOrganization(payloadCreate).subscribe({
      next: (res) => {
        this.addUnitModal = false;
        this.loadDelted = false;
        this.getTreeData();
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant(
            'Add Organization Successful123'
          ),
          detail: '',
          life: 3000,
        });
        this.orgin_form.reset();
      },
    });
    // if (!this.selectedNode) return;
    // if (!this.selectedNode.children) this.selectedNode.children = [];
    // const newId = Date.now(); // Replace with backend-generated ID in real use
    // const subUnit: TreeNode = {
    //   key: String(newId),
    //   label: `New Sub Unit ${newId}`,
    //   id: newId,
    //   children: [],
    //   expanded: true
    // };
    // this.selectedNode.children.push(subUnit);
  }

  editUnit() {
    this.addUnitModal = true;
    if (this.orgin_form.invalid && !this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'EDIT')) {
      this.orgin_form.markAllAsTouched();
      return;
    }

    this.loadDelted = true;
    const payloadCreate = {
      ...this.orgin_form.value,
      organizationalUnitID: this.selected_unit?.id,
       parentID: this.getParentId(this.selected_unit),
    };
    this._TasksService.updateOrganization(payloadCreate).subscribe({
      next: (res) => {
        this.addUnitModal = false;
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant(
            'update Organization Successful'
          ),
          detail: '',
          life: 3000,
        });
        this.getTreeData();
      },
    });
  }
  getParentId(node: any): any {
    return node?.parent?.id ?? null;
  }
  deleteOrganaization() {
    if(!this._PermissionSystemService.can('ORGINAIZATION' , 'ORGINAIZATION' , 'DELETE')) return;
    this.loadDelted = true;
    this._TasksService.deleteOrganization(+this.selected_unit?.id).subscribe({
      next: () => {
        this.getTreeData();
        this.actionDeleteVisible = false;
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Organization Unit  Deleted Successfully!',
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.loadDelted = false;
      },
    });
  }

  addNewUnit() {
    const newId = Date.now().toFixed(); // Replace with backend-generated ID in real use
    const unit: TreeNode = {
      key: String(newId),
      label: `New  Unit ${newId}`,
      id: newId,
      children: [],
      expanded: true,
    };

    this.orgUnitsTree.push(unit);
  }

  parentId: any;
  handleNodeClick(node: TreeNode) {
    this.selectedNode = node;
    this.parentId = this.orgin_form.get('parentID')?.setValue(node.id);
  }

  addNewOrgNotParent() {
    this.addUnitModal = true;
    this.selectedNode = null;
    this.parentId = null;
    this.selected_unit = null;
  }

  selected_tab_id = 1;
  tabs: any[] = [];
  toggleNode(event: any, node: any) {
    if (event) {
      event.stopPropagation();
    }

    node.expanded = !node.expanded;

    this.handleNodeClickAndGetData(node);
  }
}
