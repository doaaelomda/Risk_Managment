import { ColorDropdownComponent } from './../../../../../../shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { InputTextComponent } from './../../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { EditorModule } from 'primeng/editor';
import { TreeModule } from 'primeng/tree';
import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimengModule } from '@gfw/primeng';
import { TreeDragDropService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';
import { StandardDocsService } from '../../services/standard-docs.service';
import { TextareaUiComponent } from 'libs/shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { UiDropdownComponent } from "libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component";

@Component({
  selector: 'lib-controls-standard-doc',
  imports: [
    CommonModule,
    TranslateModule,
    TreeModule,
    MenuModule,
    PrimengModule,
    ReactiveFormsModule,
    EditorModule,
    FormsModule,
    TextareaUiComponent,
    SkeletonModule,
    InputTextComponent,
    RadioButtonModule,
    UiDropdownComponent,
    ColorDropdownComponent
  ],
  providers: [TreeDragDropService],
  templateUrl: './controls-standard-doc.component.html',
  styleUrl: './controls-standard-doc.component.scss',
})
export class ControlsStandardDocComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private _translationS: TranslationsService,
    private sharedService: SharedService,
    private _standardDocsS: StandardDocsService,
    private router: Router,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.getLookups()
    this._standardDocsS.viewingData.subscribe({
      next: (res) => {
        if (res) {
          console.log(res, 'viewing data here');

          const profileId = res.grcDocumentElementClassificationProfileID
          if (!profileId) return
          this.getElementClassificationsByProfileID(profileId)
        }
      }
    })
  }
  getElementClassificationsByProfileID(id: number) {
    this._standardDocsS.getElementClassificationsByProfileID(id).subscribe({
      next: (res: unknown) => {
        if (res && typeof res === 'object' && 'data' in res) {
          console.log(res, 'classifications here');

          this.elementOptions = res.data

        }
      }
    })
  }
  selectedNode: any = '';
  docId: any = '';
  loading: boolean = false;

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

  selectedNodeId: any;
  getDocsContent() {
    this.loading = true;
    this._activatedRoute.parent?.paramMap
      .pipe(
        filter((params) => !!params.get('id')),
        tap((params) => {
          this.docId = params.get('id');
          console.log('Route params:', this.docId);
        }),
        switchMap(() => this._standardDocsS.getControlTree(this.docId!))
      )
      .subscribe({
        next: (res) => {
          const data = res?.data;
          this.items = this.transformToTreeNodes(data);




          if (this.selectedNodeId) {
            this.restoreSelectedNode(this.items, this.selectedNodeId);
          }else{
                        this.handleNodeClick(this.items[0]);

          }
          this.loading = false;
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
    this.actions = [
      {
        label: this._TranslateService.instant('Items.ADD_SUB_ITEM'),
        icon: 'fi fi-rr-plus',
        command: () => {
          console.log(this.modifingNode, 'SELECTED NODE');
          const parentId = this.modifingNode?.id;
          this.setModifiedItem(parentId);
          this.isModifing = true;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS_CONTROLS',
            'ADD'
          ),
      },
      {
        label: this._TranslateService.instant('Items.EDIT_ITEM'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          console.log(this.modifingNode, 'SELECTED NODE');
          const parentId = this.modifingNode?.parentId;
          const itemId = this.modifingNode?.id;
          this._standardDocsS.getControlById(itemId).subscribe((res) => {
            console.log(res, 'got single item');
            const data = res?.data;
            this.setModifiedItem(parentId, data);
          });

          this.isModifing = true;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS_CONTROLS',
            'EDIT'
          ),
      },
      {
        label: this._TranslateService.instant('Items.DELETE_ITEM'),
        icon: 'fi fi-rr-trash',
        command: () => {
          console.log(this.modifingNode, 'selected node here...');

          this._standardDocsS
            .deleteControl(this.modifingNode?.id)
            .subscribe((res) => {
              console.log(res, 'deleted');
              this.messageService.add({
                severity: 'success',
                detail: 'Content successfully deleted',
              });
              this.getDocsContent();
              this.modifingNode = '';
            });
        },
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS_CONTROLS',
            'DELETE'
          ),
      },
      {
        label: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi fi-rr-apps',
        command: () => {
          if (!this.modifingNode?.id) return

          this.router.navigateByUrl(`/gfw-portal/library/standard-docs/${this.docId}/controls/${this.modifingNode?.id}`)
        },

        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS_CONTROLS',
            'VIEW'
          ),
      },
    ];

    this.setModifiedItem();
  }
  controlMaturityLevels: any[] = []
  getLookups() {
    this.sharedService.lookUps([29]).subscribe({
      next: (res: any) => {
        this.controlMaturityLevels = res?.data?.GovControlMaturityLevel
      }
    })
  }
  // getElementsList() {
  //   this.sharedService.lookUps([84]).subscribe((res) => {
  //     console.log(res, 'got elements list');
  //     const list = res?.data?.ComplianceDocumentElementType;
  //     this.elementOptions = list;
  //   });
  // }
  govControlList = [];
  getGovControlList() {
    // this._standardDocsS.getRiskActionLookupData([28]).subscribe((res) => {
    //   console.log(res, 'got govControlList');
    //   const list = res?.data?.GovControl;
    //   this.govControlList = list;
    // });
  }
  transformToTreeNodes(elements: any[]): TreeNode[] {
    if (!Array.isArray(elements)) return [];
    console.log(elements, 'elements');

    return elements.map((el) => ({
      key: String(el.id),
      id: el.id,
      parentId: el.parentID,
      name: el.name?.trim() || '',
      objective: el.objective || '',
      guides: el.guides || '',
      guidesAr: el.guidesAr || '',
      outputs: el.outputs || '',
      notes: el.notes || '',
      wieght: el.wieght || null,
      foreColor: el.foreColor || null,
      backColor: el.backColor || null,
      // Add description-like fields if you want a tooltip/preview
      description: el.objective || el.notes || '',
      grcDocumentElementClassificationID: el?.grcDocumentElementClassificationID || null,
      // Recursively transform children if any exist
      children: el.children && el.children.length
        ? this.transformToTreeNodes(el.children)
        : [],
    }));
  }

  dragContext: {
    draggedNode: any;
    targetParent: any;
    order: number;
    siblings: any[];
    canMove: boolean;
    canMerge: boolean;
  } | null = null;
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
      this.applyReorder(dragNode, siblings, index + 1)
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
      order: newOrder,
      data: siblings.map(item => item.id)
    };

    console.log("Reorder payload:", payload);
    this._standardDocsS.reOrderElement(payload).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: "Success",
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
    console.log("payload merge ", payload);
    this._standardDocsS.mergeElement(payload).subscribe(() => {
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

    console.log("dragContext", this.dragContext);


    const data = this.dragContext.siblings.map((item: any) => item?.id)

    const payload = {
      selectedItemID: draggedNode.id,
      targetParentID: this.dragContext?.targetParent?.id || null,
      order: data.findIndex((id: any) => id == draggedNode.id) + 1,
      data,
      grcDocumentElementClassificationID: draggedNode.grcDocumentElementClassificationID ?? null
    };

    console.log("payload move ", payload);

    this._standardDocsS.moveElement(payload).subscribe(() => {
      this.isShowingDragDropModal = false;
      this.dragContext = null;
      this.getDocsContent();

      this.messageService.add({
        severity: 'success',
        detail: 'Element moved successfully'
      });
    });
  }
  items: TreeNode[] = [];
  modifiedItem!: FormGroup;

  isModifing: boolean = false;
  isCreating: boolean = false;
  dialogHeaderText = '';
  elementOptions: any = [];
  deleteItem(itemId: any) {
    if (
      !this._PermissionSystemService.can(
        'LIBRARY',
        'STANDARDDOCUMENTS_CONTROLS',
        'DELETE'
      )
    )
      return;

    this._standardDocsS.deleteControl(itemId).subscribe((res) => {
      console.log(res);
      this.messageService.add({
        severity: 'success',
        detail: 'Content deleted successfully',
      });
    });
  }
  isEditing: boolean = false;
  setModifiedItem(parentId?: any, data?: any, event?: Event) {
    event?.stopPropagation();
    this.dialogHeaderText = data ? 'Update Item' : 'Add New Item';
    this.isEditing = !!data;
    console.log(this.isEditing, 'isEditing');

    this.modifiedItem = new FormGroup({
      governanceStandardID: new FormControl(+this.docId),
      parentID: new FormControl(parentId ?? data?.parentID ?? null),
      governanceStandardControlID: new FormControl(
        data?.governanceStandardControlID ?? null
      ),
      governanceStandardControlCode: new FormControl(
        data?.governanceStandardControlCode ?? '',
        Validators.required
      ),
      name: new FormControl(data?.name ?? '', Validators.required),
      nameAr: new FormControl(data?.nameAr ?? '', Validators.required),

      objective: new FormControl(data?.objective ?? ''),
      objectiveAr: new FormControl(data?.objectiveAr ?? ''),

      guides: new FormControl(data?.guides ?? ''),
      guidesAr: new FormControl(data?.guidesAr ?? ''),
      notes: new FormControl(data?.notes ?? ''),
      wieght: new FormControl(data?.wieght ?? null),
      grcDocumentElementClassificationID: new FormControl(
        data?.grcDocumentElementClassificationID ?? this.elementOptions[0]?.id
      ),
      GovControlMaturityLevelID: new FormControl(data?.govControlMaturityLevelID ?? null),
      // color: new FormControl(data?.color ?? null),
      foreColor: new FormControl(data?.foreColor ?? null,[Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)]),
      backColor: new FormControl(data?.backColor ?? null,[Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)]),

    });
  }

  addNewItem() {
    this.isCreating = true;

    this._standardDocsS
      .modifyControl(this.modifiedItem.value)
      .subscribe((res) => {
        this.isCreating = false;
        this.isModifing = false;
        this.getDocsContent();
        this.messageService.add({
          severity: 'success',
          detail: 'Content updated successfully',
        });
        // this.selectedNode = '';
        console.log(res, 'created');
      });
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
  @ViewChild('menu') menu!: Menu;

  onMenuClick(event: Event, node: any): void {
    event.stopPropagation();
    this.modifingNode = node;
    this.menu.toggle(event);
  }
  handleNodeClick(node: any, event?: Event) {
    event?.stopPropagation();
    console.log(node, 'node clicked');

    this.selectedNodeId = node?.id;

    console.log(this.selectedNode, 'this.selectedNode');

    if (node?.children?.length) {
      node.expanded = !node.expanded;
    }

    this._standardDocsS.getControlById(node.id).subscribe((res) => {
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
    this.modifiedItem
      .get('grcDocumentElementClassificationID')
      ?.setValue(option?.id);
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
}
