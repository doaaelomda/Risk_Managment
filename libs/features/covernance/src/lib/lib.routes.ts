import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { NewAddControlAssessmnetComponent } from './control-management-viewContainer/NewDesign-Control-Mangment/new-add-control-assessmnet/new-add-control-assessmnet.component';
import { LookupUiComponent } from './../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component';
import { Route } from '@angular/router';
import { newOverviewControlAssessmnetComponent } from './control-management-viewContainer/NewDesign-Control-Mangment/new-overview-control-assessmnet/new-overview-control-assessmnet.component';
export const covernanceRoutes: Route[] = [
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  {
    path: 'Dashboard',
    loadComponent: () =>
      import('../../../dashboard/src/lib/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    data: {
      id: 3,
    },
  },
  {
    path: 'master-data',
    component: LookupUiComponent,
    data: {
      groupID: '2',
      permissions: {
        module: 'GOVERNANCE',
        feature: 'MASTERDATA',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'documents',
    loadComponent: () =>
      import(
        './covernance-documents-list/covernance-document-list.component'
      ).then((c) => c.CovernanceDocumentListComponent),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'GOVDOCUMENT',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'Document-action',
    loadComponent: () =>
      import('./addDocument/addDocument.component').then(
        (m) => m.AddDocumentComponent
      ),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'GOVDOCUMENT',
        action: 'ADD',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'Document-action/:Docid',
    loadComponent: () =>
      import('./addDocument/addDocument.component').then(
        (m) => m.AddDocumentComponent
      ),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'GOVDOCUMENT',
        action: 'EDIT',
      },
    },
    canActivate: [PermissionGuard],
  },

  {
    path: 'Document-action/viewDocument/:Docid',
    loadComponent: () =>
      import('./overviewDocument/overViewDocument.component').then(
        (m) => m.OverViewDocumentComponent
      ),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'GOVDOCUMENT',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overviewDocument/viewDocument/viewDocument.component').then(
            (m) => m.ViewDocumentComponent
          ),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'GOVDOCUMENT',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewDocument/attachmentDocument/attachmentDocument.component'
          ).then((m) => m.AttachmentDocumentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewDocument/commentDocument/commentDocument.component'
          ).then((m) => m.CommentDocumentComponent),
      },
      {
        path: 'versions',
        loadComponent: () =>
          import('./overviewDocument/versions/versions.component').then(
            (c) => c.VersionsComponent
          ),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'VERSION',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'selectors',
        loadComponent: () =>
          import('./overviewDocument/selectors/selectors.component').then(
            (c) => c.SelectorsComponent
          ),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'GOVDOCUMENTSTACKHOLDERS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: 'control-management',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'view/:id',
        loadComponent: () =>
          import(
            './control-management-viewContainer/control-management-viewContainer.component'
          ).then((c) => c.ControlManagementViewContainerComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'CONTROL',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './control-management-viewContainer/control-management-overview/control-management-overview.component'
              ).then((c) => c.ControlManagementOverviewComponent),
            data: {
              permissions: {
                module: 'GOVERNANCE',
                feature: 'CONTROL',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          //                  {
          //    path: 'overview',
          //    component:newOverviewControlAssessmnetComponent

          //  },
          {
            path: 'comments',
            loadComponent: () =>
              import(
                './control-management-viewContainer/control-management-comments/control-management-comments.component'
              ).then((c) => c.ControlManagementCommentsComponent),
          },
          {
            path: 'attachments',
            loadComponent: () =>
              import(
                './control-management-viewContainer/control-attachment/attachment-component.component'
              ).then((c) => c.AttachmentComponentComponent),
          },
          {
            path: 'Controlassessment',
            loadComponent: () =>
              import(
                './control-management-viewContainer/control-assessment-viewControl/Controlassessment.component'
              ).then((c) => c.ControlassessmentComponent),
            data: {
              permissions: {
                module: 'GOVERNANCE',
                feature: 'CONTROLASSESSMENT',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'linkedModules',
            loadComponent: () =>
              import(
                '../../../../shared/shared-ui/src/lib/shared-linkedModule/shared-linkedModule.component'
              ).then((c) => c.SharedLinkedModuleComponent),
            data: {
              groupId: 2,
            },
          },

          {
            path: 'Requirements',
            loadComponent: () =>
              import(
                './control-management-viewContainer/Requierment-Crud/Control-requirement/Control-Requirment.component'
              ).then((c) => c.ControlRequirmentComponent),
          },
        ],
      },
      {
        path: ':govControlID/Requirements/:id',
        loadComponent: () =>
          import(
            './control-management-viewContainer/Requierment-Crud/overview-control-requirment/overview-control-requirment.component'
          ).then((c) => c.OverviewControlRequirmentComponent),

        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './control-management-viewContainer/Requierment-Crud/view-control-requirment/view-control-requirment.component'
              ).then((m) => m.ViewControlRequirmentComponent),
          },
          {
            path: 'comments',
            loadComponent: () =>
              import(
                './control-management-viewContainer/Requierment-Crud/comment-control-requirment/comment-control-requirment.component'
              ).then((m) => m.CommentControlRequirmentComponent),
          },
          {
            path: 'attachments',
            loadComponent: () =>
              import(
                './control-management-viewContainer/Requierment-Crud/attachment-control-requirment/attachment-control-requirment.component'
              ).then((m) => m.AttachmentControlRequirmentComponent),
          },
        ],
      },
      {
        path: 'list',
        loadComponent: () =>
          import(
            './control-management-list/control-management-list.component'
          ).then((c) => c.ControlManagementListComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'CONTROL',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'action',
        loadComponent: () =>
          import(
            './control-management-action/control-management-action.component'
          ).then((c) => c.ControlManagementActionComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'CONTROL',
            action: 'ADD',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'addAssessment',
        loadComponent: () =>
          import(
            './control-management-viewContainer/addControlAssessment/addControlassessment.component'
          ).then((c) => c.AddControlassessmentComponent),
      },
      {
        path: 'ViewAssessment/:ControlId',
        loadComponent: () =>
          import(
            './control-management-viewContainer/viewControlAssessment/viewAssessment.component'
          ).then((c) => c.ViewAssessmentComponent),
      },
      {
        path: 'action/:id',
        loadComponent: () =>
          import(
            './control-management-action/control-management-action.component'
          ).then((c) => c.ControlManagementActionComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'CONTROL',
            action: 'EDIT',
          },
        },
        canActivate: [PermissionGuard],
      },
      // new Controls
      //   {
      //   path: 'new-add-control',
      //   component:NewAddControlAssessmnetComponent
      // },
      //  {
      //   path: 'update-control/:id',
      //   component:NewAddControlAssessmnetComponent
      // },
    ],
  },
  {
    path: 'control-management/:controlId/assessment/:type/:id',
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './control-management-viewContainer/control-assessment-overview/control-assessment-overview.component'
          ).then((c) => c.ControlAssessmentOverviewComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './control-management-viewContainer/control-assessment-comments/control-assessment-comments.component'
          ).then((c) => c.ControlAssessmentCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './control-management-viewContainer/control-assessment-attachments/control-assessment-attachments.component'
          ).then((c) => c.ControlAssessmentAttachmentsComponent),
      },
    ],
    loadComponent: () =>
      import(
        './control-management-viewContainer/control-assessment-view/control-assessment-view.component'
      ).then((c) => c.ControlAssessmentViewComponent),
  },
  {
    path: 'viewDocument/:Docid/versions/:versionId',
    loadComponent: () =>
      import(
        './overviewDocument/versions/overviewVersion/overviewVersion.component'
      ).then((m) => m.OverviewVersionComponent),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'VERSION',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/viewVersion/viewVersion.component'
          ).then((m) => m.ViewVersionComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'VERSION',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/attachmentVersion/attachmentVersion.component'
          ).then((m) => m.AttachmentVersionComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/commentVersion/commentVersion.component'
          ).then((m) => m.CommentVersionComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/containerContent/containerContent.component'
          ).then((c) => c.ContainerContentComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'VERSIONCONTENT',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'version-comments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/review-comments-asadmin/review-comments-asadmin.component'
          ).then((c) => c.ReviewCommentsAsadminComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'VERSION_REVIEWCOMMENTS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-review/version-review.component'
          ).then((c) => c.VersionReviewComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'REVIEWS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'approval',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-approval/version-approval.component'
          ).then((c) => c.VersionApprovalComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'APPROVAL',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: 'viewDocument/:Docid/versions/:versionId/approval/:id',
    loadComponent: () =>
      import(
        './overviewDocument/versions/overviewVersion/version-approval/approval-view/approval-view.component'
      ).then((c) => c.ApprovalViewComponent),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'APPROVAL',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-approval/approval-view/approval-overview/approval-overview.component'
          ).then((c) => c.ApprovalOverviewComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'APPROVAL',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-approval/approval-view/approval-comments/approval-comments.component'
          ).then((c) => c.ApprovalCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-approval/approval-view/approval-attachments/approval-attachmanets.component'
          ).then((c) => c.ApprovalAttachmanetsComponent),
      },
    ],
  },

  {
    path: 'viewDocument/:Docid/versions/:versionId/reviews/:id',
    loadComponent: () =>
      import(
        './overviewDocument/versions/overviewVersion/version-review/review-view/review-view.component'
      ).then((c) => c.ReviewViewComponent),
    data: {
      permissions: {
        module: 'GOVERNANCE',
        feature: 'REVIEWS',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-review/review-view/review-overview/review-overview.component'
          ).then((c) => c.ReviewOverviewComponent),
        data: {
          permissions: {
            module: 'GOVERNANCE',
            feature: 'REVIEWS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-review/review-view/review-comments/review-comments.component'
          ).then((c) => c.ReviewCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-review/review-view/review-attachments/review-attachments.component'
          ).then((c) => c.ReviewAttachmentsComponent),
      },
      {
        path: 'review-comments',
        loadComponent: () =>
          import(
            './overviewDocument/versions/overviewVersion/version-review/review-view/review-review-comments/review-review-comments.component'
          ).then((c) => c.ReviewReviewCommentsComponent),
      },
    ],
  },

  {
    path: 'gov-reviews/:id',
    loadComponent: () =>
      import('./gov-user-reviews/gov-user-reviews.component').then(
        (c) => c.GovUserReviewsComponent
      ),
  },
  {
    path: 'gov-approval/:id',
    loadComponent: () =>
      import('./gov-user-reviews/gov-user-reviews.component').then(
        (c) => c.GovUserReviewsComponent
      ),
  },
];
