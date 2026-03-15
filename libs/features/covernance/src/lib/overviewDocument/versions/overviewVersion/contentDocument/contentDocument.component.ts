import { ComplianceService } from './../../../../../../../compliance/src/compliance/compliance.service';
import { EditorModule } from 'primeng/editor';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isArray, TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { ActivatedRoute } from '@angular/router';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { filter, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SafeHtmlPipe } from 'apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { EmptyStateComponent } from '@gfw/shared-ui';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EditorComponent } from 'libs/shared/shared-ui/src/lib/editor/editor.component';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
@Component({
  selector: 'lib-content-document',
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
    EmptyStateComponent,
    RadioButtonModule,
    EditorComponent,
    CdkDragPlaceholder
],
  providers: [TreeDragDropService, EmptyStateComponent],
  templateUrl: './contentDocument.component.html',
  styleUrl: './contentDocument.component.scss',
})




export class ContentDocumentComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _complianceService: ComplianceService,
    private messageService: MessageService,
    private _translationS: TranslationsService,
    private _LayoutService: LayoutService,
    private _GoveranceService: GoveranceService
  ) {
    this._activatedRoute.parent?.paramMap.subscribe((params) => {
      console.log('params', params);
      this.currentVersionId = params.get('versionId');
    });
  }

  current_gov_doc:any;
  selectedNode: any = '';
  docId: any = '';
  currentVersionId: any;
  loading: boolean = false;
  selectedNodeId:any;

  restoreSelectedNode(nodes: any[], id: number, parent?: any): boolean {
  for (let node of nodes) {

    if (node.id === id) {

      if (parent) {
        parent.expanded = true;
      }

      this.handleNodeClick(node);

      return true;
    }

    if (node.children?.length) {
      const found = this.restoreSelectedNode(node.children, id, node);

      if (found) {
        node.expanded = true;
        return true;
      }
    }
  }

  return false;
}

  getDocsContent() {
    this.loading = true;
    this._activatedRoute.parent?.paramMap
      .pipe(
        tap((params) => {
          this.docId = params.get('Docid');
          this.currentVersionId = params.get('versionId');
        }),
        switchMap(() =>
          forkJoin([
            this._GoveranceService.getElementContent(this.currentVersionId),
            this._GoveranceService.getOneGovernanceDocument(this.docId)
          ])


        )
      )
      .subscribe({
        next: (res) => {
          const data = res[0]?.data;
          this.items = this.transformToTreeNodes(data);
                if (this.selectedNodeId) {
            this.restoreSelectedNode(this.items, this.selectedNodeId);
          }else{
                        this.handleNodeClick(this.items[0]);

          }
          this.loading = false;
          this.current_gov_doc = res[1]?.data;
          this.getElementsList();
        },
        error: (err) => {
          console.error('Error loading document content', err);
          this.loading = false;
        },
      });
  }
  currentLang = '';
  checkCurrentLang() {
    this.currentLang = this._translationS.getSelectedLanguage();
  }
  modifingNode: any;
  ngOnInit() {
    // this.getElementsList();
    this.getGovControlList();
    this.checkCurrentLang();
    this.getDocsContent();
    // this.handleBreadCrumb();
    this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {
          console.log(this.modifingNode, 'SELECTED NODE');
          const id = this.modifingNode?.id;
          this.setModifiedItem(id);
          this.isModifing = true;
        },
      },
      {
        label: this._TranslateService.instant('Items.EDIT_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          console.log(this.modifingNode, 'SELECTED NODE');
          const parentId = this.modifingNode?.parentId;
          const itemId = this.modifingNode?.id;
          this._GoveranceService.getElementById(itemId).subscribe((res) => {
            console.log(res, 'got single item');
            const data = res?.data;
            this.setModifiedItem(parentId, data);
          });

          this.isModifing = true;
        },
      },
      {
        label: this._TranslateService.instant('Items.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.deleteItem(this.modifingNode.id);
        },
      },
    ];

    this.setModifiedItem();
  }
  getElementsList() {
    this._GoveranceService.getClassficationByElementTypeId(this.current_gov_doc?.govDocumentTypeID).subscribe((res:any[])=>{
      if(res && 'data'in res)
      this.elementOptions = res.data as any[]
    })
  }
  govControlList = [];
  getGovControlList() {
    this._complianceService.getRiskActionLookupData([28]).subscribe((res) => {
      console.log(res, 'got govControlList');
      const list = res?.data?.GovControl;
      this.govControlList = list;
    });
  }
  transformToTreeNodes(elements: any[]): TreeNode[] {
    console.log(elements, 'elements here');

    return elements.map((el) => ({
      key: String(el.id),
      id: el.id,
      parentId: el.parentContentID,
      name: el.name,
      nameAr: el.nameAr,
      description: el.description || '',
      elementTextAr: el.elementTextAr || '',
      elementText: el.elementText || '',
      referenceCode: el.referenceCode || '',
      wieght: el.wieght || '',
      grcDocumentElementClassificationID: el?.grcDocumentElementClassificationID || null,
      children: el.subElements?.length
        ? this.transformToTreeNodes(el.subElements)
        : [],
    }));
  }
  // handleDrop(event: any) {
  //   const dragNode = event?.dragNode;
  //   const dropNode = event?.dropNode;
  //   const dropPoint = event?.dropPoint;
  //   console.log(this.items, 'items');
  //   if (dropPoint === 'node') {
  //     this.viewDragDropModal(dragNode, dropNode);
  //   }
  //   const foundNode = dragNode?.parent?.children?.find((node:any) => node.id === dragNode.id)
  //   const movingOut = dropPoint === 'between' && (!dragNode?.parent || !foundNode);
  //    console.log(event, 'drop event');
  //   console.log(dragNode?.parent);

  //   if (movingOut) {
  //     this.viewDragDropModal(dragNode);
  //   }


  // }

// handleDrop(event: any) {
//   const { dragNode, dropNode, dropPoint, dropIndex } = event;

//   let newParentId: number | null = null;
//   let newOrderNumber = 1;

//   // 🟢 CASE 1: drop INSIDE node
//   if (dropPoint === 'node') {
//     newParentId = dropNode.id;
//     newOrderNumber = (dropNode.children?.length || 0) + 1;

//     this.viewDragDropModal(dragNode, dropNode);
//     return;
//   }

//   // 🟡 CASE 2: drop BEFORE / AFTER
//   if (dropPoint === 'before' || dropPoint === 'after' || dropPoint === 'between') {

//     // ⭐ IMPORTANT: parent is decided ONLY from dropNode
//     const parent = dropNode.parent ?? null;

//     newParentId = parent ? parent.id : null;

//     const siblings = parent ? parent.children : this.items;
//     newOrderNumber = dropIndex + 1;

//     this.viewDragDropModal(dragNode, parent);
//     return;
//   }
// }

dragContext: {
  draggedNode: any;
  targetParent: any;
  order: number;
  siblings: any[];
    canMove: boolean;
  canMerge: boolean;
} | null = null;


// handleDrop(event: any) {
//   const { dragNode, dropNode, dropPoint, index } = event;
//   console.log("event DragDrop" , event);

//   let targetParent = null;
//   let order = 0;
//   let siblings: any[] = [];

//   const oldParent = dragNode.parent ?? null;

//   // 🟢 DROP INSIDE
//   if (dropPoint === 'node') {
//     targetParent = dropNode;
//     siblings = dropNode.children ?? [];
//     order = index + 1;
//   }

//   // 🟡 DROP BEFORE / AFTER / BETWEEN
//   if (dropPoint === 'before' || dropPoint === 'after' || dropPoint === 'between') {
//     targetParent = dropNode.parent ?? null;
//     siblings = targetParent ? targetParent.children : this.items;
//     order = index + 1;
//   }

//   const isSameParent =
//     (oldParent?.id ?? null) === (targetParent?.id ?? null);

//   // 🔁 CASE: reorder only → NO popup
//   if (isSameParent) {
//     // this.applyReorder(dragNode, siblings, order);
//     return;
//   }

//   // 🔒 store context for Move / Merge
// const isDropInside = dropPoint === 'node';
//   const parentChanged = oldParentId !== newParentId;

//   const showMerge =
//     isDropInside &&
//     parentChanged;

//   const showMove =
//     parentChanged && !showMerge;

//   this.dragContext = {
//     draggedNode: dragNode,
//     targetParent,
//     order,
//     siblings,
//     showMerge,
//     showMove
//   };

//   // show modal (Move / Merge)
//   this.viewDragDropModal(dragNode, targetParent);
// }

handleDrop(event: any) {
  const { dragNode, dropNode, dropPoint, index } = event;

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
    this.applyReorder(dragNode , siblings , index +  1 )
    return;
  }

  const isDropInside = dropPoint === 'node';
  const parentChanged = oldParentId !== newParentId;

  const canMerge =
    isDropInside ||
    (parentChanged && newParentId != null);

  const canMove =
    parentChanged

  this.dragContext = {
    draggedNode: dragNode,
    targetParent,
    order,
    siblings,
    canMerge,
    canMove
  };

  this.viewDragDropModal(dragNode, targetParent);
}


applyReorder(dragNode: any, siblings: any[], newOrder: number) {


  const payload = {
    selectedItemID: dragNode.id,
    targetParentID: dragNode.parentId ?? null,
    order: newOrder ,
    data: siblings.map(item => item.id)
  };

  console.log("Reorder payload:", payload);
  this._GoveranceService.reOrderElement(payload).subscribe((res:any)=>{
          this.messageService.add({
        severity: 'success',
        summary:"Success",
        detail: 'Element ReOrdered successfully'
      });
  })
}



  handleMergeActionElement() {
    if (!this.dragContext) return;

    const { draggedNode, targetParent } = this.dragContext;

    // ❌ Safety checks
    if (draggedNode.id === targetParent.id) return;

    const payload = {
      selectedItemID: draggedNode.id,
      targetItemID: targetParent.id
    };
    console.log("payload merge " , payload);
    this._GoveranceService.mergeElement(payload).subscribe(() => {
      this.isShowingDragDropModal = false;
      this.dragContext = null;

      this.getDocsContent();

      this.messageService.add({
        severity: 'success',
        detail: 'Elements merged successfully'
      });
    });
  }


  handleMoveActionElement() {
    if (!this.dragContext) return;

    const { draggedNode, order } = this.dragContext;

    console.log("dragContext" , this.dragContext);


    const data = this.dragContext.siblings.map((item:any) => item?.id)

    const payload = {
      selectedItemID: draggedNode.id,
      targetParentID: this.dragContext?.targetParent?.id || null,
      order: data.findIndex((id:any) => id == draggedNode.id  ) + 1,
      data,
      grcDocumentElementClassificationID: draggedNode.grcDocumentElementClassificationID
    };

    console.log("payload move " , payload);

    this._GoveranceService.moveElement(payload).subscribe(() => {
      this.isShowingDragDropModal = false;
      this.dragContext = null;
      this.getDocsContent();

      this.messageService.add({
        severity: 'success',
        detail: 'Element moved successfully'
      });
    });
  }





  isShowingDragDropModal: boolean = false;
  dragNode: any;
  dropNode:any
  viewDragDropModal(dragNode: any, dropNode?: any) {
    this.dragNode = dragNode;

    this.dropNode = dropNode
    this.isShowingDragDropModal = true;
  }
  setDragNodeElement(typeId: number) {
    this.dragNode.grcDocumentElementClassificationID = typeId;
  }

  items: TreeNode[] = [];
  modifiedItem!: FormGroup;

  isModifing: boolean = false;
  isCreating: boolean = false;
  dialogHeaderText = '';
  elementOptions: any[] = [];
  deleteItem(itemId: any) {
    this._GoveranceService.deleteElement(itemId).subscribe((res) => {
      console.log(res);
      this.messageService.add({
        severity: 'success',
        detail: 'Content deleted successfully',
      });
      this.getDocsContent();
    });
  }
  isEditing: boolean = false;
  currentItemId:any
  setModifiedItem(parentId?: any, data?: any) {
    this.dialogHeaderText = data ? 'Update Item' : 'Add New Item';
    this.isEditing = !!data;
    this.currentItemId = data?.id
    this.modifiedItem = new FormGroup({
      govDocumentID: new FormControl(this.docId),
      govDocumentVersionID: new FormControl(this.currentVersionId),
      govControlID: new FormControl(data?.govControlID),

      parentContentID: new FormControl(
        parentId ?? data?.parentContentID ?? null
      ),

      referenceCode: new FormControl(data?.referenceCode),
      wieght: new FormControl(data?.wieght),
      name: new FormControl(data?.name || '', Validators.required),
      nameAr: new FormControl(data?.nameAr || '', Validators.required),
      description: new FormControl(data?.description || ''),
      descriptiontAr: new FormControl(data?.descriptionAr || ''),
      grcDocumentElementClassificationID: new FormControl(
        data?.grcDocumentElementClassificationID || null,
        Validators.required
      ),
      orderNumber: new FormControl(
        data?.orderNumber || this?.items?.length + 1 || 1
      ),
      code: new FormControl(data?.code),
    });
  }

  addNewItem() {
    this.isCreating = true;
    const payload: any = {
      ...this.modifiedItem.value,
      id:this.currentItemId
    };

    // if(this.isEditing){
    //   payload['id'] = this.selectedNode?.id
    // }
    console.log('paload', payload);

    this._GoveranceService
      .modifyElement(payload)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe((res) => {
        this.isCreating = false;
        this.isModifing = false;
        this.getDocsContent();
        this.messageService.add({
          severity: 'success',
          detail: 'Content updated successfully',
        });
        this.selectedNode = '';
        console.log(res, 'created');
      });
  }
  breadCrumbLinks: any[] = [];
  handleBreadCrumb() {
    this.breadCrumbLinks = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
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
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.VIEW_DOCUMENTS'
        ),
        icon: '',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.CONTENT'),
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumbLinks);
  }
  actions: any[] = [];
  selectedFirstItem() {
    this.selectedNode = this.items[0];
    this.selectedNode.expanded = true;
  }
  toggleNode(event: Event, node: TreeNode) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
  handleNodeClick(node: any) {
    console.log(node, 'node clicked');

    console.log(this.selectedNode, 'this.selectedNode');

    if (node?.children?.length) {
      node.expanded = !node.expanded;
    }

        this.selectedNodeId = node?.id;
    const nodeId = node?.id;
    this._GoveranceService.getElementById(nodeId).subscribe((res) => {

      this.selectedNode = res?.data;


    });
  }
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

  setElementOption(option: any) {
    console.log(option, 'option');
    this.modifiedItem.get('grcDocumentElementClassificationID')?.setValue(option?.id);
  }
}
