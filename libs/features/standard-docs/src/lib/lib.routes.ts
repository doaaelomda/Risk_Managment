
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';
export const standardDocsRoutes: Route[] = [
  { path: '', redirectTo: 'standard-docs', pathMatch: 'full' },

  {
    path: 'standard-docs',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('../lib/standard-docs/standard-docs.component').then(
            (c) => c.StandardDocsComponent
          ),
      },
      {
        path: 'action',
        loadComponent: () =>
          import('../lib/save-standard-doc/save-standard-doc.component').then(
            (c) => c.SaveStandardDocComponent
          ),
      },
      {
        path: 'action/:id',
        loadComponent: () =>
          import('../lib/save-standard-doc/save-standard-doc.component').then(
            (c) => c.SaveStandardDocComponent
          ),
      },
    ],
  },

  {
    path: 'standard-docs/:id',
    loadComponent: () =>
      import('../lib/view-standard-doc/view-standard-doc.component').then(
        (c) => c.ViewStandardDocComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './view-standard-doc/overview-standard-doc/overview-standard-doc.component'
          ).then((c) => c.OverviewStandardDocComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './view-standard-doc/attachments-standard-doc/attachments-standard-doc.component'
          ).then((c) => c.AttachmentsStandardDocComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './view-standard-doc/comments-standards-doc/comments-standards-doc.component'
          ).then((c) => c.CommentsStandardsDocComponent),
      },
      {
        path: 'controls',
        loadComponent: () =>
          import(
            './view-standard-doc/controls-standard-doc/controls-standard-doc.component'
          ).then((c) => c.ControlsStandardDocComponent),
      },
    ],
  },

  {
    path: 'standard-docs/:document_id/controls/:id',
    loadComponent: () =>
      import(
        './view-standard-doc/controls-standard-doc/view-standard-controls/view-standard-controls.component'
      ).then((c) => c.ViewStandardControlsComponent),
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
            './view-standard-doc/controls-standard-doc/view-standard-controls/overview-standard-controls/overview-standard-controls.component'
          ).then((c) => c.OverviewStandardControlsComponent),
      },
      {
        path: 'requirements',
        loadComponent: () =>
          import(
            './view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/requirements-standard-controls.component'
          ).then((c) => c.RequirementsStandardControlsComponent),
      },
      {
        path:'linked-evidence',
        loadComponent:()=>import('./view-standard-doc/controls-standard-doc/view-standard-controls/linked-evidence-standard-controls/linked-evidence-standard-controls.component').then(c=>c.LinkedEvidenceStandardControlsComponent)
      }
    ],
  },
  {
    path: 'standard-docs/:document_id/controls/:control_id/requirements/:id',
    loadComponent: () =>
      import(
        './view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/view-requirement-standard-control/view-requirement-standard-control.component'
      ).then((c) => c.ViewRequirementStandardControlComponent),

    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/view-requirement-standard-control/overview-requirement-standard-control/overview-requirement-standard-control.component'
          ).then((c) => c.OverviewRequirementStandardControlComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/view-requirement-standard-control/comments-requirement-standard-control/comments-requirement-standard-control.component'
          ).then((c) => c.CommentsRequirementStandardControlComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/view-requirement-standard-control/attachments-requirement-standard-control/attachments-requirement-standard-control.component'
          ).then((c) => c.AttachmentsRequirementStandardControlComponent),
      },
    ],
  },
  // system-documents
  {
    path: 'system-documents',
    loadComponent: () =>
      import('./system-documents/system-documents.component').then(
        (m) => m.SystemDocumentsComponent
      ),
  },
  // evidenceLibrary
  {
    path: 'evidence-library',
    loadComponent: () =>
      import('./evidenceLibrary/evidenceLibrary.component').then(
        (m) => m.EvidenceLibraryComponent
      ),
    data: {
      permissions: {
        module: 'LIBRARY',
        feature: 'EVIDENCELIBRARY',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add-evidence-library',
    loadComponent: () =>
      import(
        './evidence-library-action/evidence-library-action.component'
      ).then((m) => m.EvidenceLibraryActionComponent),
    data: {
      permissions: {
        module: 'LIBRARY',
        feature: 'EVIDENCELIBRARY',
        action: 'ADD',
      },
    },
    canActivate: [PermissionGuard],
  },

  {
    path: 'update-evidence-library/:id',
    loadComponent: () =>
      import(
        './evidence-library-action/evidence-library-action.component'
      ).then((m) => m.EvidenceLibraryActionComponent),
    data: {
      permissions: {
        module: 'LIBRARY',
        feature: 'EVIDENCELIBRARY',
        action: 'EDIT',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'evidence-library/:id',
    loadComponent: () =>
      import('./overview-evidence/overview-evidence.component').then(
        (m) => m.OverviewEvidenceComponent
      ),
    data: {
      permissions: {
        module: 'LIBRARY',
        feature: 'EVIDENCELIBRARY',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./view-evidence/view-evidence.component').then(
            (m) => m.ViewEvidenceComponent
          ),
        data: {
          permissions: {
            module: 'LIBRARY',
            feature: 'EVIDENCELIBRARY',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
];
