/* eslint-disable @nx/enforce-module-boundaries */
import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePackerComponent } from '@gfw/shared-ui';
import { TextareaUiComponent } from '../../../../../shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import * as moment from 'moment';
import { TreeMultiselectComponent } from 'libs/shared/shared-ui/src/lib/treeMultiselect/treeMultiselect.component';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-add-document',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextComponent,
    ReactiveFormsModule,
    UiDropdownComponent,
    TextareaUiComponent,
    AccordionModule,
    TranslateModule,
    TooltipModule,
    RouterLink,
    DatePackerComponent,
    RouterLink,
    RouterLinkActive,
    TreeSelectUiComponent,
    TreeMultiselectComponent,
  ],
  templateUrl: './addDocument.component.html',
  styleUrl: './addDocument.component.css',
})
export class AddDocumentComponent implements OnInit {
  Docid: any;
  nameEnArray: any[] = [];
  validationRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  Review_form!: FormGroup;
  ReviewPeriodArray: any[] = [];
  classfications: any[] = [];
  classfication_form!: FormGroup;
  ApprovalWorkflow: any[] = [];
  showErrorClassfication: boolean = false;
  showErrorResponsbility: boolean = false;
  OrganizationalUnit: any;
  isLoading: boolean = false;
  documentTypes: any[] = [];
  ContentTypes: any[] = [];
  govDocument: any[] = [];
  roles: any[] = [];
  users: any[] = [];
  dataClassifications: any[] = [];
  form!: FormGroup;
  constructor(
    private _messageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _riskService: RiskService,
    private _router: Router,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.initDocumentForm();
    this.initRevisionForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.Docid = params.get('Docid');

      if (this.Docid) {
        this._riskService.getOneDoc(this.Docid).subscribe((docRes: any) => {
          const riskData = docRes?.data;
          this.initDocumentForm({ ...riskData });
          this.initRevisionForm(riskData);
          this._LayoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home' },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Governance'
              ),
              icon: '',
              routerLink: '/gfw-portal/governance/documents',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST'
              ),
              icon: '',
              routerLink: '/gfw-portal/governance/documents',
            },
            { name: riskData?.name, icon: '' },
          ]);
        });
      }
    });
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home' },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        icon: '',
        routerLink: '/gfw-portal/governance/documents',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/governance/documents',
      },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.ADD_NEW_DOCUMENT'),
        icon: '',
      },
    ]);

    this._LayoutService.breadCrumbAction.next(null);
  }

  ngOnInit() {
    this.getRolesLookUp();
    this.getUsersLookUp();
  }

  getUsersLookUp() {
    this._SharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.users = res?.data;
    });
  }
  getRolesLookUp() {
    this._SharedService.getRoleLookupData().subscribe((res) => {
      this.roles = res?.data;
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
    this._SharedService
      .lookUps([24, 25, 26, 27, 18, 43, 228 ])
      .subscribe((res: any) => {
        this.documentTypes = res?.data?.GovDocumentType;
        this.govDocument = res?.data?.GovDocument;
        this.ApprovalWorkflow = res?.data?.WorkFlow;
        this.ReviewPeriodArray = res?.data?.ReviewPeriod;
        this.classfications = res?.data?.DataClassification;
        this.nameEnArray = res?.data?.nameEnglish;
        this.ContentTypes = this.transformNodes(res?.data?.GovDocumentContentType) ;
      });
  }
  handleSelectedFile(event: any) {
    console.log('Selected file:', event);
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
  initDocumentForm(data?: any) {

    let govDocumentContentTypeIds:any[] = data && data.govDocumentContentTypes ? this.transformNodes(data?.govDocumentContentTypes) : []

    this.form = new FormGroup({
      govDocumentID: new FormControl(data?.govDocumentID),
      dataClassificationId: new FormControl(data?.dataClassificationID, [
        Validators.required,
      ]),
      organizationalUnitID: new FormControl(null, Validators.required),
      govDocumentTypeID: new FormControl(data?.govDocumentTypeID, [
        Validators.required,
      ]),
      wfid: new FormControl(data?.wfId),
      name: new FormControl(data?.name, [Validators.required]),
      nameAr: new FormControl(data?.nameAr, [Validators.required]),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      govDocumentContentTypeIds: new FormControl(govDocumentContentTypeIds, [
        Validators.required,
      ]),
    });
    if (data?.organizationalUnitID) {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.OrganizationalUnit = Array.isArray(res?.data) ? res.data : [];

          const selectedNode = this.findNodeById(
            this.OrganizationalUnit,
            data.organizationalUnitID
          );

          this.form.get('organizationalUnitID')?.setValue(selectedNode);
        },
      });
    } else {
      this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.OrganizationalUnit = Array.isArray(res?.data) ? res.data : [];
        },
      });
    }

    console.log(this.form.value, 'form');
  }
  initRevisionForm(data?: any) {
    this.Review_form = new FormGroup({
      revisionDate: new FormControl(
        data?.revisionDate
          ? moment(new Date(data?.revisionDate)).format('MM-DD-YYYY')
          : null
      ),
      revisionPeriod: new FormControl(data?.revisionPeriod),
    });
  }
  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'GOVDOCUMENT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('GOVERNANCE' , 'GOVDOCUMENT' , 'EDIT')
    if(this.Docid && !canEdit)return
    if(!this.Docid && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('values', this.form.value);
    const fullPayload = {
      ...this.form.value,
      ...this.Review_form.value,
      organizationalUnitID: this.form.value.organizationalUnitID
        ? this.form.value.organizationalUnitID.id
        : null,
    };

    ['revisionDate'].forEach((key) => {
      if (fullPayload[key]) {
        fullPayload[key] = moment(fullPayload[key], 'MM-DD-YYYY')
          .utc(true)
          .toISOString();
      }
    });
    fullPayload.govDocumentContentTypeIds = Array.isArray(fullPayload.govDocumentContentTypeIds)
      ? fullPayload.govDocumentContentTypeIds?.map((ou: any) => ou.id)
      : fullPayload.govDocumentContentTypeIds
      ? [fullPayload.govDocumentContentTypeIds.id]
      : null;

    let isUpdate = this.Docid;
    if (isUpdate) {
      fullPayload['id'] = this.Docid;
    }
    const payload = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    this.isLoading = true;
    const request$ = isUpdate
      ? this._riskService.updateDocument(isUpdate, payload)
      : this._riskService.saveDocument(payload);
    request$.subscribe({
      next: (res) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: isUpdate
            ? 'Doc updated successfully'
            : 'Doc saved successfully',
        });
        this.isLoading = false;
        this._router.navigate(['/gfw-portal/governance/documents']);
      },

      error: (err) => {
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
