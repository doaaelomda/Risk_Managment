import { ComplianceService } from './../../../../../../../compliance/src/compliance/compliance.service';
import { EditorModule } from 'primeng/editor';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PrimengModule } from '@gfw/primeng';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,

} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  switchMap, tap } from 'rxjs';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { SkeletonModule } from "primeng/skeleton";
import { EmptyStateFilesComponent } from 'libs/shared/shared-ui/src/lib/empty-state-files/empty-state-files.component';
@Component({
  selector: 'lib-content-tree',
  imports: [CommonModule,
    TranslateModule,
    TreeModule,
    MenuModule,
    PrimengModule,
    ReactiveFormsModule,
    EditorModule,
    FormsModule, SkeletonModule,EmptyStateFilesComponent],
    providers:[TreeDragDropService],
  templateUrl: './contentTree.component.html',
  styleUrl: './contentTree.component.scss',
})
export class ContentTreeComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _complianceService: ComplianceService,
    private messageService: MessageService,
    private _translationS: TranslationsService,
    private _LayoutService: LayoutService,
    private _GoveranceService:GoveranceService
  ) {}
  selectedNode: any = '';
  docId: any = '';
  version_id:any;
  loading:boolean = false
  getDocsContent() {
    this.loading = true
    this._activatedRoute.parent?.paramMap
      .pipe(
        tap((params) => {
          this.docId = params.get('Docid');
          this.version_id = params.get('versionId')
          console.log('Route params:', params);
        }),
        switchMap(() => this._GoveranceService.getElementContent(this.version_id))
      )
      .subscribe({
        next: (res) => {
          const data = res?.data;
          this.items = this.transformToTreeNodes(data);
          if (this.items?.length) {
          }
          this.loading = false

        },
        error: (err) => console.error('Error loading document content', err),
      });
  }
  currentLang = '';
  checkCurrentLang() {
    this.currentLang = this._translationS.getSelectedLanguage();
  }
  ngOnInit() {
    this.getElementsList();
    this.getGovControlList();
    this.checkCurrentLang();
    this.getDocsContent();
  }
  getElementsList() {
    this._complianceService.getRiskActionLookupData([31]).subscribe((res) => {
      console.log(res, 'got elements list');
      const list = res?.data?.GovDocumentElementType;
      this.elementOptions = list;
    });
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
  items: TreeNode[] = [];
  modifiedItem!: FormGroup;

  isModifing: boolean = false;
  isCreating: boolean = false;
  dialogHeaderText = '';
  elementOptions = [];
  isEditing: boolean = false;

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
  toggleNode(event: Event, node: TreeNode) {
    event.stopPropagation();

    node.expanded = !node.expanded;
    this.selectedNode = node;
  }
}
