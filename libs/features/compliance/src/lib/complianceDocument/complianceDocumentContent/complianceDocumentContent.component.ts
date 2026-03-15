import { StandardDocsService } from './../../../../../standard-docs/src/lib/services/standard-docs.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { SafeHtmlPipe } from './../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { EditorModule } from 'primeng/editor';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PrimengModule } from '@gfw/primeng';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ComplianceService } from '../../../compliance/compliance.service';
import { filter, Subscription, switchMap, tap } from 'rxjs';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { Nl2BrPipe } from 'apps/gfw-portal/src/app/core/pipes/preLine.pipe';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { TreeSelectUiComponent } from "libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component";
import { ColorDropdownComponent } from "libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component";
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";

@Component({
  selector: 'lib-compliance-document-content',
  imports: [
    CommonModule,
    TranslateModule,
    TreeModule,
    MenuModule,
    PrimengModule,
    ReactiveFormsModule,
    EditorModule,
    FormsModule,
    UiDropdownComponent,
    SkeletonModule,
    SafeHtmlPipe,
    RadioButtonModule,
    Nl2BrPipe,
    TextareaUiComponent,
    TreeSelectUiComponent,
    ColorDropdownComponent,
    InputTextComponent
],
  templateUrl: './complianceDocumentContent.component.html',
  styleUrl: './complianceDocumentContent.component.scss',
  providers: [TreeDragDropService],
})
export class ComplianceDocumentContentComponent implements OnInit, OnDestroy {
  // Declaration Variables
  selectedNode: any = '';
  docId: any = '';
  loading: boolean = false;
  currentLang = '';
  items: TreeNode[] = [];
  modifiedItem!: FormGroup;
  isModifing: boolean = false;
  isCreating: boolean = false;
  dialogHeaderText = '';
  elementOptions: any[] = [];
  isEditing: boolean = false;
  breadCrumbLinks: any[] = [];
  actions: any[] = [];
  govControlList = [];
  private subscription: Subscription = new Subscription();
  constructor(
    private _TranslateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _complianceService: ComplianceService,
    private messageService: MessageService,
    private _translationS: TranslationsService,
    private _LayoutService: LayoutService,
    private _router: Router,
    private SharedService: SharedService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.getLookups();
  }
  // get Document Content

  stopPropregation(event: PointerEvent) {
    event.stopPropagation();
  }

  getDocsContent() {
    this.loading = true;
    const sub = this._activatedRoute.parent?.paramMap
      .pipe(
        filter((params) => !!params.get('id')),
        tap((params) => {
          this.docId = params.get('id');
        }),
        switchMap(() => this._complianceService.getDocsContent(this.docId!))
      )
      .subscribe({
        next: (res) => {
          const data = res?.data || [];
          this.items = this.transformToTreeNodes(data);
          if (this.items?.length) {
            this.handleNodeClick(this.items[0]);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading document content', err);
          this.loading = false;
        },
      });
    this.subscription.add(sub);
  }
  // get Compliance Content
  getComplianceDocumnet() {
    const sub = this._complianceService
      .getDocumentCompliance(this.docId)
      .subscribe((res) => {
        console.log(res.data, 'document data');
        this.getElementClassificationsByProfileID(
          res.data.grcDocumentElementClassificationProfileID
        );
        this.getDefaultBreadcrumbs(res?.data);
      });
    this.subscription.add(sub);
  }

  // Check Language
  checkCurrentLang() {
    this.currentLang = this._translationS.getSelectedLanguage();
  }
  // get Elements List
  // getElementsList() {
  //   const sub = this._complianceService
  //     .getRiskActionLookupData([84])
  //     .subscribe((res) => {
  //       const list = res?.data?.ComplianceDocumentElementType;
  //       this.elementOptions = list;
  //     });
  //   this.subscription.add(sub);
  // }
  // handle Action List
  // overViewDocument/:id/content/:controlId
  modifingNode: any;
  handleAction() {
    this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {
          const id = this.modifingNode?.id;
          this.setModifiedItem(id);
          this.isModifing = true;
        },
        visible: this._PermissionSystemService.can(
          'COMPLIANCE',
          'COMPLIANCEDOCUMENTCONTENT',
          'ADD'
        ),
      },
      {
        label: this._TranslateService.instant('Items.EDIT_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          const parentId = this.modifingNode?.parentId;
          const itemId = this.modifingNode?.id;
          const sub = this._complianceService
            .getDocContentById(itemId)
            .subscribe((res) => {
              const data = res?.data;
              this.setModifiedItem(parentId, data);
            });
          this.subscription.add(sub);
          this.isModifing = true;
        },
        visible: this._PermissionSystemService.can(
          'COMPLIANCE',
          'COMPLIANCEDOCUMENTCONTENT',
          'EDIT'
        ),
      },
      {
        label: this._TranslateService.instant('Items.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => {
          console.log(this.modifingNode, 'this.modifingNode');

          const sub = this._complianceService
            .deleteDocContent(this.modifingNode?.id)
            .subscribe((res) => {
              this.messageService.add({
                severity: 'success',
                detail: this._TranslateService.instant(
                  'MESSAGES.ContentDeleted'
                ),
              });
              this.getDocsContent();
              this.modifingNode = '';
              this.subscription.add(sub);
            });
        },
        visible: this._PermissionSystemService.can(
          'COMPLIANCE',
          'COMPLIANCEDOCUMENTCONTENT',
          'DELETE'
        ),
      },
      {
        label: this._TranslateService.instant('Items.overview_control'),
        icon: 'fi fi-rr-apps',
        command: () => {
          this._router.navigate([
            `/gfw-portal/compliance/overViewDocument/${this.docId}/content/${this.nodeId}`,
          ]);
        },
      },
    ];
  }
  // get Gov Control List
  getGovControlList() {
    const sub = this._complianceService
      .getRiskActionLookupData([28])
      .subscribe((res) => {
        const list = res?.data?.GovControl;
        this.govControlList = list.map((item: any) => ({
          ...item,
          label: this.SharedService.truncateWords(item.label, 3),
        }));
      });

    this.subscription.add(sub);
  }

  // Transform Tree Node
  transformToTreeNodes(elements: any[]): TreeNode[] {
    console.log(elements, 'elements here');

    return elements.map((el) => ({
      key: String(el.id),
      id: el.id,
      parentId: el.parentID,
      name: el.name,
      nameAr: el.nameAr,
      wieght: el.wieght,
      description: el.description || '',
      elementTextAr: el.elementTextAr || '',
      elementText: el.elementText || '',
      referenceCode: el.referenceCode || '',
      foreColor: el.foreColor || '',
      backColor: el.backColor || '',
      grcDocumentElementClassificationID:
        el.grcDocumentElementClassificationID || null,
      children: el.subElements?.length
        ? this.transformToTreeNodes(el.subElements)
        : [],
    }));
  }

  // Delete Item
  deleteItem(itemId: any) {
    const sub = this._complianceService
      .deleteDocContent(itemId)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          detail: this._TranslateService.instant('MESSAGES.ContentDeleted'),
        });
        this.subscription.add(sub);
      });
  }
  // Edit Item
  setModifiedItem(parentId?: any, data?: any) {
    this.dialogHeaderText = data ? 'Update Item' : 'Add New Item';
    this.isEditing = !!data;
    this.modifiedItem = new FormGroup({
      complianceDocumentElementID: new FormControl(
        data?.complianceDocumentElementID
      ),
      govControlID: new FormControl(data?.govControlID),
      complianceDocumentID: new FormControl(+this.docId),
      parentID: new FormControl(parentId || null),
      referenceCode: new FormControl(
        data?.referenceCode || '',
        Validators.required
      ),
      name: new FormControl(
        data?.complianceDocumentElementName || '',
        Validators.required
      ),
      nameAr: new FormControl(
        data?.complianceDocumentElementNameAr || '',
        Validators.required
      ),
      elementText: new FormControl(
        data?.elementText || '',
        Validators.required
      ),
      elementTextAr: new FormControl(
        data?.elementTextAr || '',
        Validators.required
      ),
         objective: new FormControl(
        data?.objective || '',
        Validators.required
      ),
            objectiveAr: new FormControl(
        data?.objectiveAr || '',
        Validators.required
      ),
            guides: new FormControl(
        data?.guides || '',
        Validators.required
      ),
            guidesAr: new FormControl(
        data?.guidesAr || '',
        Validators.required
      ),
      grcDocumentElementClassificationID: new FormControl(
        data?.grcDocumentElementClassificationID || this.elementOptions[0]?.id,
        Validators.required
      ),
      orderNumber: new FormControl(
        data?.orderNumber || this?.items?.length + 1 || 1
      ),
      wieght: new FormControl(data?.wieght ?? null),
      GovControlMaturityLevelID: new FormControl(
        data?.govControlMaturityLevelID ?? null
      ),
      organizationUnitID: new FormControl(data?.organizationUnitID ?? null),
      responsableRoleID: new FormControl(data?.responsableRoleID ?? null),
      responsableUserID: new FormControl(data?.responsableUserID ?? null),
      // color: new FormControl(data?.color ?? null),
      foreColor: new FormControl(data?.foreColor ?? null,[Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)]),
      backColor: new FormControl(data?.backColor ?? null,[Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)]),
    });

    if (data && data?.organizationUnitID && this.orgUnits.length) {
      const id = this.findNodeById(
          this.transformNodes(this.orgUnits),
          data?.organizationUnitID
        );
        this.modifiedItem.get('organizationUnitID')?.setValue(id);
        this.modifiedItem.updateValueAndValidity();
    }
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

  controlMaturityLevels: any[] = [];
  orgUnits: any[] = []
  getLookups() {
    this.SharedService.orgainationalUnitLookUp().subscribe({
      next: (res:any) => {
        this.orgUnits = res?.data;
      },
    });
    
    this.SharedService.lookUps([29]).subscribe({
      next: (res: any) => {
        this.controlMaturityLevels = res?.data?.GovControlMaturityLevel;
      },
    });

    this.SharedService.getUserLookupData().subscribe({
      next:(res:any) => {
        this.users = res.data
      }
    })
    this.SharedService.getRoleLookupData().subscribe({
      next:(res:any) => {
        this.roles = res.data
      }
    })
  }
  users:any[] = []
  roles:any[] = []
  // add new item
  addNewItem() {
    this.isCreating = true;
    const formValue = this.modifiedItem.value
 formValue.organizationUnitID = Array.isArray(formValue.organizationUnitID)
        ? formValue.organizationUnitID[0]?.id ?? null
        : formValue.organizationUnitID?.id ?? null;
    const sub = this._complianceService
      .modifyDocumentContent(formValue)
      .subscribe((res) => {
        this.isCreating = false;
        this.isModifing = false;
        this.getDocsContent();
        this.messageService.add({
          severity: 'success',
          detail: this.isEditing
            ? this._TranslateService.instant('MESSAGES.ContentUpdated')
            : this._TranslateService.instant('MESSAGES.ContentCreate'),
        });
        this.selectedNode = '';
      });
    this.subscription.add(sub);
  }
  // default Selected First Item From Tree
  selectedFirstItem() {
    this.selectedNode = this.items[0];
    this.selectedNode.expanded = true;
  }
  // select Toggle Node
  toggleNode(event: Event, node: TreeNode) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
  // select Click Node
  nodeId: any;
  handleNodeClick(node: any) {
    if (node?.children?.length) {
      node.expanded = !node.expanded;
    }
    this.nodeId = node?.id;
    const sub = this._complianceService
      .getDocContentById(this.nodeId)
      .subscribe((res) => {
        const previouslyActive: any = this.items.find((n: any) => n?.active);
        if (previouslyActive) previouslyActive.active = false;
        const data = res?.data;
        this.selectedNode = data;

        const parentId = data?.parentID;
        if (parentId) {
          const foundParent: any = this.items.find(
            (node) => node?.id === parentId
          );
          if (!foundParent) return;
          foundParent.active = true;
        }
      });
    this.subscription.add(sub);
  }
  // add Sub Item To Node
  addSubItemToNode() {
    const selectedNode = this.selectedNode;
    if (!selectedNode) return;

    if (!selectedNode.children) {
      selectedNode.children = [];
    }

    const subItem: TreeNode = {
      key: `${selectedNode.key}-${selectedNode.children.length}`,
      label: `subItem ${selectedNode.key}-${selectedNode.children.length + 1}`,
      description: '',
      children: [],
    };

    selectedNode.children.push(subItem);
  }
  // handleBreadCrumb
  private getDefaultBreadcrumbs(data: any) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: data?.name ?? '-',
        icon: '',
        routerLink: `/gfw-portal/compliance/overViewDocument/${this.docId}/overview`,
      },
      {
        name: this._TranslateService.instant('NOTIFICATION_SETTING.CONTENT'),
        icon: '',
      },
    ]);
  }
  // Life Cycle Hooks
  ngOnInit() {
    // this.getElementsList();
    this.getGovControlList();
    this.checkCurrentLang();
    this.getDocsContent();
    this.getComplianceDocumnet();
    this.handleAction();
    this.setModifiedItem();
  }

  // Destroy Component
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setElementOption(option: any) {
    console.log(option, 'option');
    this.modifiedItem
      .get('grcDocumentElementClassificationID')
      ?.setValue(option?.id);
  }

  handleDrop(event: any) {
    const { dragNode, dropNode, dropPoint, index } = event;
    console.log(dragNode, 'dragNode');

    let targetParent = null;
    let order = 0;
    let siblings: any[] = [];

    const oldParentId = dragNode.parentId ?? null;

    // 🟢 DROP INSIDE
    if (dropPoint === 'node') {
      targetParent = dropNode;
      siblings = dropNode.children ?? [];
      order = index + 1;
    }

    // 🟡 DROP BEFORE / AFTER / BETWEEN
    if (['before', 'after', 'between'].includes(dropPoint)) {
      targetParent = dropNode.parent ?? null;
      siblings = targetParent ? targetParent.children : this.items;
      order = index + 1;
    }

    const newParentId = targetParent?.id ?? null;
    const isSameParent = oldParentId === newParentId;

    // 🔁 reorder only
    if (isSameParent) {
      this.applyReorder(dragNode, siblings, index + 1);
      return;
    }

    const isDropInside = dropPoint === 'node';
    const parentChanged = oldParentId !== newParentId;

    const canMerge = isDropInside || (parentChanged && newParentId != null);

    const canMove = parentChanged;

    this.dragContext = {
      draggedNode: dragNode,
      targetParent,
      order,
      siblings,
      canMerge,
      canMove,
    };

    this.viewDragDropModal(dragNode, targetParent);
  }
  dragContext: {
    draggedNode: any;
    targetParent: any;
    order: number;
    siblings: any[];
    canMove: boolean;
    canMerge: boolean;
  } | null = null;

  applyReorder(dragNode: any, siblings: any[], newOrder: number) {
    const payload = {
      selectedItemID: dragNode.id,
      targetParentID: dragNode.parentId ?? null,
      order: newOrder,
      data: siblings.map((item) => item.id),
    };

    console.log('Reorder payload:', payload);
    this._complianceService.reOrderElement(payload).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Element ReOrdered successfully',
      });
    });
  }

  handleMergeActionElement() {
    if (!this.dragContext) return;

    const { draggedNode, targetParent } = this.dragContext;

    // ❌ Safety checks
    if (draggedNode.id === targetParent.id) return;

    const payload = {
      selectedItemID: draggedNode.id,
      targetItemID: targetParent.id,
    };
    console.log('payload merge ', payload);
    this._complianceService.mergeElement(payload).subscribe(() => {
      this.isShowingDragDropModal = false;
      this.dragContext = null;

      this.getDocsContent();

      this.messageService.add({
        severity: 'success',
        detail: 'Elements merged successfully',
      });
    });
  }

  handleMoveActionElement() {
    if (!this.dragContext) return;

    const { draggedNode, order } = this.dragContext;

    console.log('dragContext', this.dragContext);

    const data = this.dragContext.siblings.map((item: any) => item?.id);

    const payload = {
      selectedItemID: draggedNode.id,
      targetParentID: this.dragContext?.targetParent?.id || null,
      order: data.findIndex((id: any) => id == draggedNode.id) + 1,
      data,
      grcDocumentElementClassificationID:
        draggedNode.grcDocumentElementClassificationID,
    };

    console.log('payload move ', payload);

    this._complianceService.moveElement(payload).subscribe(() => {
      this.isShowingDragDropModal = false;
      this.dragContext = null;
      this.getDocsContent();

      this.messageService.add({
        severity: 'success',
        detail: 'Element moved successfully',
      });
    });
  }
  isShowingDragDropModal: boolean = false;
  dragNode: any;
  dropNode: any;
  viewDragDropModal(dragNode: any, dropNode?: any) {
    this.dragNode = dragNode;

    this.dropNode = dropNode;
    this.isShowingDragDropModal = true;
  }
  setDragNodeElement(typeId: number) {
    this.dragNode.grcDocumentElementClassificationID = typeId;
  }

  getElementClassificationsByProfileID(id: number) {
    this._complianceService.getElementClassificationsByProfileID(id).subscribe({
      next: (res: unknown) => {
        if (res && typeof res === 'object' && 'data' in res) {
          console.log(res, 'classifications here');

          this.elementOptions = res.data as any[];
        }
      },
    });
  }
}
