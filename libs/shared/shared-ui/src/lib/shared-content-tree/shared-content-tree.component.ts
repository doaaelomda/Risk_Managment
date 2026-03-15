// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from "primeng/skeleton";
export interface IElement {
  id: number;
  govDocumentID: number;
  govDocumentName: string | null;
  parentContentID: number | null;
  parentContentName: string | null;
  govDocumentElementTypeID: number;
  govDocumentElementTypeName: string;
  name: string | null;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  orderNumber: number | null;
  referenceCode: string | null;
  code: string | null;
  govControlID: number | null;
  govControlName: string | null;
  subElements: IElement[];
}
@Component({
  selector: 'lib-shared-content-tree',
  imports: [CommonModule, TreeModule, MenuModule, TranslateModule, SkeletonModule],
  templateUrl: './shared-content-tree.component.html',
  styleUrl: './shared-content-tree.component.scss',
  providers: [TreeDragDropService],
})
export class SharedContentTreeComponent implements OnChanges {
  constructor() {
    //
  }
  @Input() rawData: IElement[] = [];
  @Input({required:true}) loading: boolean=false
  items: TreeNode[] = [];


  transformToTreeNodes(elements: any[] = []): TreeNode[] {
    console.log(elements, 'elements here');
    if(!elements.length) {
      return []
    }
    return elements.map((el) => ({
      key: String(el.id),
      id: el.id,
      parentId: el.parentID,
      name: el.name,
      nameAr: el.nameAr,
      description: el.description || '',
      elementTextAr: el.elementTextAr || '',
      elementText: el.elementText || '',
      referenceCode: el.referenceCode || '',
      complianceDocumentElementTypeID: el.complianceDocumentElementTypeID || null,
      children: el.subElements?.length
        ? this.transformToTreeNodes(el.subElements)
        : [],
    }));
  }

  handleDrop(event: any) {
    console.log(event, 'drop event here');
    const draggedNode = event?.dragNode;
    const updatedOrder = event?.index + 1;
    const isParent = !draggedNode?.parent;
    if (isParent) {
      const parentId = draggedNode?.id;
      console.log(parentId, updatedOrder);
    } else {
      const parentId = draggedNode?.parent?.id;
      const childId = draggedNode?.id;
      console.log(
        'parentId =>',
        parentId,
        'childId =>',
        childId,
        'updaatedOrder =>',
        updatedOrder
      );
    }
  }
  selectedNode: any = '';
  @Output() nodeSelected = new EventEmitter<any>();

  handleNodeClick(node: any) {
    if (node?.children?.length) {
      node.expanded = !node.expanded;
    }
    const previouslyActive: any = this.items.find((n: any) => n?.active);
    if (previouslyActive) previouslyActive.active = false;

    this.selectedNode = node;

    const parentId = node?.parentID;
    if (parentId) {
      const foundParent: any = this.items.find((node) => node?.id === parentId);
      if (!foundParent) return;
      foundParent.active = true;
    }

    this.nodeSelected.emit(this.selectedNode);
  }

  toggleNode(event: Event, node: TreeNode) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['rawData']) {
    const current = changes['rawData'].currentValue as IElement[];

    if (current?.length) {
      this.items = this.transformToTreeNodes(current);
    } else {
      this.items = [];
    }
  }
}
}
