import { Component, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { filter, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ComplianceService } from '../../../compliance/compliance.service';
import { ComplianceAssessmntService } from '../../../services/compliance-assessmnt.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputSearchComponent } from '@gfw/shared-ui';
import { PendingAssessmentService } from '../../../services/pending_assessment.service';

@Component({
  selector: 'lib-pending-assessment-view-side',
  standalone: true,
  imports: [CommonModule, TreeModule, InputSearchComponent],
  templateUrl: './pending-assessment-view-side.component.html',
  styleUrls: ['./pending-assessment-view-side.component.scss'],
})
export class PendingAssessmentViewSideComponent {
  files: any[] = [];
  selectedFile!: TreeNode;
  nodeClicked = output<any>();
  assessmentId: any;
  defautFile: any;
  complianceDocumentID: any;
  selectedNode: any = '';
  cuurentAssessmentControls: any[] = [];
  current_complianceAssessment: any;
  complianceAssessment_emiter = output<any>()
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _complianceService: ComplianceService,
    private ComplianceAssessmntService: ComplianceAssessmntService,
    private _PendingAssessmentService: PendingAssessmentService
  ) {
    this._activatedRoute.parent?.paramMap.subscribe((params) => {
      this.ComplianceAssessmntService.getAssessmnetById(
        params.get('id')
      ).subscribe((res: any) => {
        this.current_complianceAssessment = res?.data;
        this.complianceAssessment_emiter.emit(this.current_complianceAssessment)
        this.complianceDocumentID = res?.data?.complianceDocumentID;
        const controlId =
          this._activatedRoute.snapshot.queryParamMap.get('control');
        this.activeControlId = controlId ? +controlId : null;
        if (res?.data?.complianceDocumentID) {
          this.getTreePendingAssessment();
        } else {
          this.getCurrentAssessmentsControls();
        }
      });
    });
  }
  activeControlId: any;
  findControlByGovID(files: any[], govControlID: number): any | undefined {
    for (const file of files) {
      // Check if the parent matches
      if (file.data.govControlID === govControlID) {
        return file;
      }

      // Check if any child matches (recursively)
      if (file.children?.length) {
        const found = this.findControlByGovID(file.children, govControlID);
        if (found) {
          return found;
        }
      }

      // Also check subElements if they exist
      if (file.data.subElements?.length) {
        const found = this.findControlByGovID(
          file.data.subElements.map((sub: any) => ({
            ...sub,
            children: sub.subElements || [],
            data: sub,
          })),
          govControlID
        );
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }
  getTreePendingAssessment() {
    this._activatedRoute.parent?.paramMap
      .pipe(
        filter((params) => !!params.get('id')),
        tap((params) => {
          this.assessmentId = params.get('id');
        }),
        switchMap(() =>
          this._complianceService.getTreePendingAssessment(
            this.complianceDocumentID,
            this.assessmentId
          )
        )
      )
      .subscribe({
        next: (res) => {
          const data = res?.data;
          this.files = this.transformToTreeNodes(data);
          console.log(this.files, 'this.files');
          console.log(this.activeControlId, 'this.activeControlId');
          const activeControl = this.findControlByGovID(
            this.files,
            this.activeControlId
          );

          console.log(activeControl, 'activeControl');

          this.selectedNode = activeControl ? activeControl : this.files[0];
          this.defautFile = this.handleNodeClick(this.selectedNode);
          if (this.files?.length) {
            console.log(this.selectedNode, 'this.selectedNode');
            this.handleNodeClick(this.selectedNode);
            this.onNodeSelect(this.selectedNode)
            const parent = this.files.find(file => file.data.id === this.selectedNode.data.parentID)
            if(!parent)return
            parent.expanded =true
          }
        },
        error: (err) => console.error('Error loading document content', err),
      });
  }
  
  handleNodeClick(node: TreeNode) {
    console.log(node, 'nodeclicked');

    this.selectedNode = node;
    const govControlID = node?.data?.govControlID;
    if (govControlID) {
      this._complianceService
        .getDocContentById(govControlID)
        .subscribe((res) => {
          const data = res?.data;

          this.defautFile = data;
        });
    }
  }

  transformToTreeNodes(elements: any[]): TreeNode[] {
    const transform = (els: any[]): TreeNode[] => {
      return els.map((el) => {
        let styleClass = '';
        if (el.subElements?.length) {
          styleClass = 'non-Choose';
        } else {
          styleClass = 'non-Choose';
        }

        return {
          key: String(el.id),
          name: el.name || el.elementText || 'No Label',
          data: {
            ...el,
            text: el.elementText || el.name || '-',
            showLayerIcon: !el.parentID,
          },
          styleClass,
          selectable: !!el.govControlID,
          children: el.subElements?.length ? transform(el.subElements) : [],
        };
      });
    };

    return transform(elements);
  }

  onNodeSelect(node: any) {
    if (node?.children?.length) {
      node.expanded = !node.expanded;
    }

    const removeActive = (nodes: TreeNode[]) => {
      nodes.forEach((n: any) => {
        n.styleClass = n.styleClass.replace('active-node', '').trim();
        if (n.children?.length) removeActive(n.children);
      });
    };

    removeActive(this.files);

    node.styleClass = (node.styleClass + ' active-node').trim();

    const addActiveToParents = (
      nodes: TreeNode[],
      childKey: string
    ): boolean => {
      for (const n of nodes) {
        if (n.key === childKey) return true;
        if (n.children && addActiveToParents(n.children, childKey)) {
          n.styleClass = (n.styleClass + ' active-node').trim();
          return true;
        }
      }
      return false;
    };

    addActiveToParents(this.files, node.key);

    this.nodeClicked.emit(node);

    const controlAssessmentID = node?.data?.controlAssessmentID;
    if (controlAssessmentID) {
      this._complianceService.setcontrolAssessmentID(controlAssessmentID);
    }
  }

  toggleNode(node: TreeNode, event?: Event) {
    event?.stopPropagation();
    node.expanded = !node.expanded;
  }

  getCurrentAssessmentsControls() {
    const payload = {
      dataViewId: 37,
      complianceAssessmentId:
        this.current_complianceAssessment?.complianceAssessmentID,
      pageNumber: 1,
      pageSize: 1000,
    };

    this._PendingAssessmentService
      .getAssessmentControlsByComplianceAssessmentID(payload)
      .subscribe((res: any) => {
        console.log('data controls', res?.data);
        this.cuurentAssessmentControls = res?.data?.items || [];
      });
  }

  current_selected_control: any;

  handleActiveControl(node: any) {
    this.current_selected_control = node;
    const controlAssessmentID = node?.controlAssessmentID;
    this.nodeClicked.emit(node);
    if (controlAssessmentID) {
      this._complianceService.setcontrolAssessmentID(controlAssessmentID);
    }
  }
}
