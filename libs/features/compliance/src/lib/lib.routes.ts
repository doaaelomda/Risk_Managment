// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const complianceRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../../dashboard/src/lib/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    data: {
      id: 6,
    },
  },

  {
    path: 'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent: () =>
      import(
        '../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component'
      ).then((c) => c.LookupUiComponent),
    data: {
      groupID: 5,
      listURL: 'compliance/complianceDocuments',
                 permissions: {
        module: 'COMPLIANCE',
        feature: 'MASTERDATA',
        action: 'VIEW',
      },
    },
      canActivate: [PermissionGuard],
  },
  {
    path: 'assessments',
    loadComponent:() => import('./compliance/compliance.component').then(c=>c.ComplianceComponent),
    children: [
      { path: '', loadComponent:() => import('./assessments-list/assessments-list.component').then(c=>c.AssessmentsListComponent)  },
      {
        path:'details',
        loadComponent:() => import('./assessments-details/assessments-details.component').then(c=>c.AssessmentsDetailsComponent)
      },

      { path: 'add', loadComponent:() => import('./modify-assessment/modify-assessment.component').then(c=>c.ModifyAssessmentComponent) },
      { path: 'update/:id', loadComponent:() => import('./modify-assessment/modify-assessment.component').then(c=>c.ModifyAssessmentComponent) },
      {
        path: 'view/:id',
        loadComponent:()=>import('./view-assessment/view-assessment.component').then(c=>c.ViewAssessmentComponent),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', loadComponent:()=> import('./assessment-overview/assessment-overview.component').then(c=>c.AssessmentOverviewComponent) },
          { path: 'scope', loadComponent:()=> import('./assessment-scope/asssessment-scope.component').then(c=>c.AsssessmentScopeComponent) },
          { path: 'business', loadComponent:()=> import('./assessment-business/assessment-business.component').then(c=>c.AssessmentBusinessComponent) },
          { path: 'control',   loadComponent: () =>
            import('./new-ongoing-assessment-container/new-ongoing-assessment-container.component').then(
              (c) => c.NewOngoingAssessmentContainerComponent
            ),
          data:{
            mode:'readonly'
          }},
          { path: 'requirement', loadComponent:()=> import('./assessment-requirement/assessment-requirement.component').then(c=>c.AssessmentRequirementComponent) },
          { path: 'comments', loadComponent:()=> import('./assessment-comments/assessment-comments.component').then(c=>c.AssessmentCommentsComponent) },
          { path: 'attachments', loadComponent:()=> import('./assessment-attachments/assessment-attachments.component').then(c=>c.AssessmentAttachmentsComponent) },
          { path: 'evidence-Task', loadComponent:()=> import('./assessment-evidence/assessment-evidence.component').then(c=>c.AssessmentEvidenceComponent) },
          { path: 'Findings', loadComponent:()=> import('./Findings/FindingsAssessment.component').then(c=>c.FindingsAssessmentComponent) },
          {
            path: 'CorrectiveAction',
            loadComponent:()=> import('./CorrectiveAssessmnet/CorrectiveAssessment.component').then(c=>c.CorrectiveAssessmentComponent),
          },
               {
          path:'evidences',
          loadComponent:() => import('./pending-assessment-view-container/AssessmentEvidences/AssessmentEvidences.component').then(c=>c.AssessmentEvidencesComponent)
        },
        ],
      },
    ],
  },
  {
    path: 'pending-assessments',
    loadComponent: () =>
      import(
        './pending-assessment-list/pending-assessment-list.component'
      ).then((c) => c.PendingAssessmentListComponent),
  },
  {
    path: 'pending-assessments/:id',
    loadComponent: () =>
      import(
        './pending-assessment-view-container/pending-assessment-view-container.component'
      ).then((c) => c.PendingAssessmentViewContainerComponent),
      children: [
        {
          path: '',
          redirectTo: 'overview',
          pathMatch: 'full',
        },
        {
          path: 'overview',
          loadComponent: () =>
            import('./assessment-overview/assessment-overview.component').then(
              (c) => c.AssessmentOverviewComponent
            ),
        },
        {
          path: 'controls',
          loadComponent: () =>
            import('./new-ongoing-assessment-container/new-ongoing-assessment-container.component').then(
              (c) => c.NewOngoingAssessmentContainerComponent
            ),
          children: [

            {
              path: 'overview',
              loadComponent: () =>
                import('./new-ongoing-assessment-container/new-ongoing-asssessment-overview/new-ongoing-assessment-overview.component').then(c=>c.NewOngoingAssessmentOverviewComponent)
            },
            // {
            //   path: 'Evidences',
            //   loadComponent: () =>
            //     import(
            //       './pending-assesment-view-container/pending-assessment-view-outlet/PendingAssessmentEvidannce/PendingAssessmentEvidannce.component'
            //     ).then((c) => c.PendingAssessmentEvidannceComponent),
            // },
            // {
            //   path: 'evidence-task',
            //   loadComponent: () =>
            //     import('./new-ongoing-assessment-container/new-ongoing-assessment-evidence-task/new-ongoing-assessment-evidence-task.component').then(c=>c.NewOngoingAssessmentEvidenceTaskComponent)
            // },
            // {
            //   path: 'finding',
            //   loadComponent: () =>
            //     import('./new-ongoing-assessment-container/new-ongoing-assessment-finding/new-ongoing-assessment-finding.component').then(c=>c.NewOngoingAssessmentFindingComponent)
            // },
            // {
            //   path: 'Assessment',
            //   loadComponent: () =>
            //     import('./pending-assessment/pending-assessment.component').then(
            //       (c) => c.PendingAssessmentComponent
            //     ),
            // },
            // {
            //   path: 'corrective-action',
            //   loadComponent: () =>
            //     import('./new-ongoing-assessment-container/new-ongoing-assessment-corrective-action/new-ongoing-assessment-corrective-action.component').then(c=>c.NewOngoingAssessmentCorrectiveActionComponent)
            // },
            // {
            //   path: 'RequirementControl',
            //   loadComponent: () =>
            //     import('./assessment-requirement/assessment-requirement.component').then(
            //       (c) => c.AssessmentRequirementComponent
            //     ),
            // },
            // {
            //   path: 'comments',
            //   loadComponent: () =>
            //     import('./new-ongoing-assessment-container/new-ongoing-assessment-comments/new-ongoing-assessments-comments.component').then(c=>c.NewOngoingAssessmentsCommentsComponent)
            // },
            // {
            //   path:'procedure',
            //   loadComponent:() => import('./pending-assesment-view-container/pending-assessment-view-outlet/pending-assessment-procedure/pending-assessment-procedure.component').then(c=>c.PendingAssessmentProcedureComponent)
            // }
          ],
        },
        {
          path:'evidence',
          loadComponent:() => import('./pending-assessment-view-container/ongoing-assessment-evidence/ongoing-assessment-evidence.component').then(c=>c.OngoingAssessmentEvidenceComponent)
        },
             {
          path:'findings',
          loadComponent:() => import('./pending-assessment-view-container/ongoing-asssessment-findings/ongoing-assessment-findings.component').then(c=>c.OngoingAssessmentFindingsComponent)
        },
             {
          path:'corrective-action',
          loadComponent:() => import('./pending-assessment-view-container/ongoing-assessment-corrective-action/ongoing-assessment-corrective-action.component').then(c=>c.OngoingAssessmentCorrectiveActionComponent)
        },
      ],
  },

  {
    path: 'complianceDocuments',
    loadComponent: () =>
      import('./complianceDocument/complianceDocumnet.component').then(
        (c) => c.ComplianceDocumnetComponent
      ),
  },
  {
    path: ':regularId/addcomplianceDocuments',
    loadComponent: () =>
      import(
        './complianceDocument/AddComplianceDocument/AddDocument.component'
      ).then((m) => m.AddDocumentComponent),
  },

  {
    path: 'KCI',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import(
        '../../../indicators/src/lib/indicators-list/indicators-list.component'
      ).then((m) => m.IndicatorsListComponent),
    data: {
      indicatorTypeID: 3,
      routing: 'KCI',
      permissions: { module: 'COMPLIANCE', feature: "KEYCOMPLIANCEINDICATORS",action:'VIEW' }
    },
  },
  {
    path: ':regularId/updatecomplianceDocuments/:id',
    loadComponent: () =>
      import(
        './complianceDocument/AddComplianceDocument/AddDocument.component'
      ).then((m) => m.AddDocumentComponent),
  },
  {
    path: ':regularId/overViewDocument/:id',
    loadComponent: () =>
      import(
        './complianceDocument/OverViewComplianceDocument/OverViewComplianceDocument.component'
      ).then((m) => m.OverViewComplianceDocumentComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/viewComplianceDocument/viewComplianceDocument.component'
          ).then((m) => m.ViewComplianceDocumentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/commentCompliamnceDocument/commentComplianceDocument.component'
          ).then((m) => m.CommentComplianceDocumentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/attachmentCompliamnceDocument/attachmentComplianceDocument.component'
          ).then((m) => m.AttachmentComplianceDocumentComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import(
            './complianceDocument/complianceDocumentContent/complianceDocumentContent.component'
          ).then((c) => c.ComplianceDocumentContentComponent),
      },
    ],
  },
  {
    path: 'evidenceType',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceList/evideanceComplianecList.component'
      ).then((m) => m.EvideanceComplianecListComponent),
  },

  {
    path: 'add-EvidenceType',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceAction/evideanceComplianecAction.component'
      ).then((m) => m.EvideanceComplianecActionComponent),
  },

  {
    path: 'update-EvidenceType/:id',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceAction/evideanceComplianecAction.component'
      ).then((m) => m.EvideanceComplianecActionComponent),
  },

  {
    path: 'evidenceType/:id',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceOverView/evideanceComplianecOverview.component'
      ).then((m) => m.EvideanceComplianecOverviewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './evidenceComplianceCrud/evidenceComplianceOverView/viewEvidanceCompliance/viewEvidanceCompliance.component'
          ).then((m) => m.ViewEvidanceComplianceComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './evidenceComplianceCrud/evidenceComplianceOverView/evidanceComplianceComments/evidanceComplianceComments.component'
          ).then((m) => m.EvidenceComplianceCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './evidenceComplianceCrud/evidenceComplianceOverView/evidanceComplianceAttachment/evidanceComplianceAttachment.component'
          ).then((m) => m.EvidanceComplianceAttachmentComponent),
      },
      {
        path: 'evidence-Version',
        loadComponent: () =>
          import(
            './evidenceComplianceCrud/evidenceComplianceOverView/evidence-VersionCRUD/evidenceVersionList/evidenceVersionList.component'
          ).then((m) => m.EvidenceVersionListComponent),
      },
      {
        path: 'evidence-Control',
        loadComponent: () =>
          import(
            './evidenceComplianceCrud/evidenceComplianceOverView/evidence-ControlCrud/evidenceControlList/evidenceControlList.component'
          ).then((m) => m.EvidenceControlListComponent),
      },
    ],
  },

  {
    path: 'evidenceType/:id/add-EvidenceVersion',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceOverView/evidence-VersionCRUD/evidenceVersionAction/evidenceVersionAction.component'
      ).then((m) => m.EvidenceVersionActionComponent),
  },
  {
    path: 'evidenceType/:id/update-EvidenceVersion/:evidenceVersionId',
    loadComponent: () =>
      import(
        './evidenceComplianceCrud/evidenceComplianceOverView/evidence-VersionCRUD/evidenceVersionAction/evidenceVersionAction.component'
      ).then((m) => m.EvidenceVersionActionComponent),
  },

  {
    path: 'competent_authorities',
    loadComponent: () =>
      import(
        './competent_authorities-list/competent_authorities-list.component'
      ).then((c) => c.CompetentAuthoritiesListComponent),
  },
  {
    path: 'competent_authorities/:id',
    loadComponent: () =>
      import(
        './new_authorities-doc-list/new_authorities-doc-list.component'
      ).then((c) => c.NewAuthoritiesDocListComponent),
  },

  // Router Document Compliance
  {
    path: 'addcomplianceDocuments',
    loadComponent: () =>
      import(
        './complianceDocument/AddComplianceDocument/AddDocument.component'
      ).then((m) => m.AddDocumentComponent),
  },

  {
    path: 'updatecomplianceDocuments/:id',
    loadComponent: () =>
      import(
        './complianceDocument/AddComplianceDocument/AddDocument.component'
      ).then((m) => m.AddDocumentComponent),
  },

  {
    path: 'overViewDocument/:id',
    loadComponent: () =>
      import(
        './complianceDocument/OverViewComplianceDocument/OverViewComplianceDocument.component'
      ).then((m) => m.OverViewComplianceDocumentComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/viewComplianceDocument/viewComplianceDocument.component'
          ).then((m) => m.ViewComplianceDocumentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/commentCompliamnceDocument/commentComplianceDocument.component'
          ).then((m) => m.CommentComplianceDocumentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './complianceDocument/OverViewComplianceDocument/attachmentCompliamnceDocument/attachmentComplianceDocument.component'
          ).then((m) => m.AttachmentComplianceDocumentComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import(
            './complianceDocument/complianceDocumentContent/complianceDocumentContent.component'
          ).then((c) => c.ComplianceDocumentContentComponent),
      },
    ],
  },
 {
    path: 'overViewDocument/:controlId/content/:id',
    loadComponent: () => import('./complianceDocument/overview-control/continar-overview-control/continar-overview-control.component')
      .then(m => m.ContinarOverviewControlComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./complianceDocument/overview-control/overview-control/overview-control.component')
          .then(m => m.OverviewControlComponent)
      },
      {
        path:'linked-evidances',
        loadComponent: () => import('./complianceDocument/overview-control/linked-evidance/linked-evidance.component')
          .then(m => m.LinkedEvidanceComponent)
      },
      {
        path: 'RequirementControl',
        loadComponent: () => import('./complianceDocument/overview-control/requirment-control/requirment-control.component')
          .then(m => m.RequirmentControlComponent)
      }
    ]
  },
  {
    path: 'overViewDocument/:controlId/content/:govControlID/RequirementControl/:id',
    loadComponent: () => import('./complianceDocument/overview-control/requirment/Overview-container-Requirment/Overview-container-Requirment.component')
      .then(m => m.OverviewContainerRequirmentComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./complianceDocument/overview-control/requirment/view-Requirment/view-Requirment.component')
          .then(m => m.ViewRequirmentComponent)
      },
      {
        path: 'comments',
        loadComponent: () => import('./complianceDocument/overview-control/requirment/comment-Requirment/comment-Requirment.component')
          .then(m => m.CommentRequirmentComponent)
      },
      {
        path: 'attachments',
        loadComponent: () => import('./complianceDocument/overview-control/requirment/attachment-Requirment/attachmnet-Requirment.component')
          .then(m => m.AttachmnetRequirmentComponent)
      }
    ]
  }
];
