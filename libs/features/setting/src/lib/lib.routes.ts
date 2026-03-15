// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const settingRoutes: Route[] = [
  { path: '', redirectTo: 'access-management', pathMatch: 'full' },
  {
    path: 'access-management',
    children: [
      {
        path: '',
        redirectTo: 'roles&permssions',
        pathMatch: 'full',
      },
      {
        path: 'master-data',
        // eslint-disable-next-line @nx/enforce-module-boundaries
        loadComponent: () =>
          import(
            '../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component'
          ).then((c) => c.LookupUiComponent),
        data: {
          groupID: 20,
          listURL: 'access-management/roles&permssions',
          permissions: { module: 'ACCESSMANAGEMNET', feature: 'MASTERDATA', action: 'VIEW' },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'roles&permssions',
        loadComponent: () =>
          import(
            './access-management/roles-permssions-list/roles-permssions-list.component'
          ).then((c) => c.RolesPermssionsListComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'ROLES',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'users',
        loadComponent: () =>
          import(
            './access-management/UsersAcessMangment/UsersAcessMangment.component'
          ).then((c) => c.UsersAcessMangmentComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'USERS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'roles&permssions/addrole',
        loadComponent: () =>
          import(
            './access-management/roles-permssions-action/roles-permssions-action.component'
          ).then((c) => c.RolesPermssionsActionComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'ROLES',
            action: 'ADD',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'roles&permssions/updaterole/:id',
        loadComponent: () =>
          import(
            './access-management/roles-permssions-action/roles-permssions-action.component'
          ).then((c) => c.RolesPermssionsActionComponent),
      },
      {
        path: 'roles&permssions/:id',
        loadComponent: () =>
          import(
            './access-management/role-view-container/role-view-container.component'
          ).then((c) => c.RoleViewContainerComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'ROLES',
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
                './access-management/role-view-container/roles-permssions-view/roles-permssions-view.component'
              ).then((c) => c.RolesPermssionsViewComponent),
            data: {
              permissions: {
                module: 'ACCESSMANAGEMNET',
                feature: 'ROLES',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'users',
            loadComponent: () =>
              import(
                './access-management/role-view-container/users-role/users-role.component'
              ).then((c) => c.UsersRoleComponent),
            data: {
              permissions: {
                module: 'ACCESSMANAGEMNET',
                feature: 'ROLESUSERS',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'permissions',
            loadComponent: () =>
              import(
                './access-management/role-view-container/permissions-view/permissions-view.component'
              ).then((c) => c.PermissionsViewComponent),
            data: {
              permissions: {
                module: 'ACCESSMANAGEMNET',
                feature: 'ROLESPERMISIION',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
        ],
      },
      {
        path: 'add-user',
        loadComponent: () =>
          import('./access-management/addUserRole/addUserRole.component').then(
            (c) => c.AddUserRoleComponent
          ),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'USERS',
            action: 'ADD',
          },
        },
        canActivate: [PermissionGuard],
      },

      {
        path: 'updateUserRole/:id',
        loadComponent: () =>
          import('./access-management/addUserRole/addUserRole.component').then(
            (c) => c.AddUserRoleComponent
          ),
      },

      {
        path: 'users/:id',
        loadComponent: () =>
          import(
            './access-management/userViewContainer/userViewContainer.component'
          ).then((c) => c.UserViewContainerComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'USERS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'Roles', pathMatch: 'full' },
          {
            path: 'Roles',
            loadComponent: () =>
              import(
                './access-management/userViewContainer/rolesUser/rolesUser.component'
              ).then((c) => c.RolesUserComponent),
            data: {
              permissions: {
                module: 'ACCESSMANAGEMNET',
                feature: 'USERSROLES',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'Permission',
            loadComponent: () =>
              import(
                './access-management/userViewContainer/PermissionUser/PermissionUser.component'
              ).then((c) => c.PermissionUserComponent),
            data: {
              permissions: {
                module: 'ACCESSMANAGEMNET',
                feature: 'USERSPERMISSION',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
        ],
      },
      {
        path: 'permssions-list',
        loadComponent: () =>
          import(
            './access-management/permssions-list/permssions-list.component'
          ).then((c) => c.PermssionsListComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'PERMISSIONS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'add-permission',
        loadComponent: () =>
          import(
            './access-management/addPermission/addPermission.component'
          ).then((c) => c.AddPermissionComponent),
        data: {
          permissions: {
            module: 'ACCESSMANAGEMNET',
            feature: 'PERMISSIONS',
            action: 'ADD',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  {
    path: 'dashboard-builder',
    children: [
      {
        path: '',
        redirectTo: 'dashboard-list',
        pathMatch: 'full',
      },
      {
        path: 'dashboard-list',
        // eslint-disable-next-line @nx/enforce-module-boundaries
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/custom-dashboard-list/custom-dashboard-list.component'
          ).then((c) => c.CustomDashboardListComponent),
                  data: {
          permissions: {
            module: 'DASHBOURD',
            feature: 'DASHBOURD',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'dashboard/:id',
        // eslint-disable-next-line @nx/enforce-module-boundaries
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/custom-dashboard-action-container/custom-dashboard-action-container.component'
          ).then((c) => c.CustomDashboardActionContainerComponent),
                        data: {
          permissions: {
            module: 'DASHBOURD',
            feature: 'DASHBOURD',
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
            // eslint-disable-next-line @nx/enforce-module-boundaries
            loadComponent: () =>
              import(
                '../../../dashboard/src/lib/custom-dashboard-action-container/dashboard-overview/dashboard-overview.component'
              ).then((c) => c.DashboardOverviewComponent),
                            data: {
          permissions: {
            module: 'DASHBOURD',
            feature: 'DASHBOURD',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
          },
          {
            path: 'desgine',
            // eslint-disable-next-line @nx/enforce-module-boundaries
            loadComponent: () =>
              import(
                '../../../dashboard/src/lib/custom-dashboard-action-container/custom-dashboard-desgine/custom-dashboard-desgine.component'
              ).then((c) => c.CustomDashboardDesgineComponent),
                            data: {
          permissions: {
            module: 'DASHBOURD',
            feature: 'DESIGN',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
          },
          {
            path: 'preview',
            // eslint-disable-next-line @nx/enforce-module-boundaries
            loadComponent: () =>
              import(
                '../../../dashboard/src/lib/custom-dashboard-action-container/custom-dashboard-preview/preview-dashboard.component'
              ).then((c) => c.PreviewDashboardComponent),
                            data: {
          permissions: {
            module: 'DASHBOURD',
            feature: 'PREVIEW',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
          },

        ],
      },
    ],
  },
  {
    path: 'workflow',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },

      {
        path: 'list',
        loadComponent: () =>
          import('../../../workfow/src/lib/workfow/workfow.component').then(
            (c) => c.WorkfowComponent
          ),
                 data: {
      permissions: { module: 'WORKFLOW', feature: "WORKFLOW", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            '../../../workfow/src/lib/workflow-view/workflow-view.component'
          ).then((c) => c.WorkflowViewComponent),
                           data: {
      permissions: { module: 'WORKFLOW', feature: "WORKFLOW", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          {
            path: 'info',
            loadComponent: () =>
              import(
                '../../../workfow/src/lib/workflow-view/workflow-info/workflow-info.component'
              ).then((c) => c.WorkflowInfoComponent),
                               data: {
      permissions: { module: 'WORKFLOW', feature: "WORKFLOW", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
          },
          {
            path: 'steps',
            loadComponent: () =>
              import(
                '../../../workfow/src/lib/workflow-view/workflow-steps/workflow-steps.component'
              ).then((c) => c.WorkflowStepsComponent),
                                             data: {
      permissions: { module: 'WORKFLOW', feature: "STEPS", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
          },
          {
            path: 'step/:id/decisions',
            loadComponent: () =>
              import(
                '../../../workfow/src/lib/workflow-view/step-decisions/step-decisions.component'
              ).then((c) => c.StepDecisionsComponent),
                                                           data: {
      permissions: { module: 'WORKFLOW', feature: "SETDECISIONS", action: "VIEW" }
    },
    canActivate: [PermissionGuard],

          },
          {
            path: 'step/:stepId/decision/:desId/actions',
            loadComponent: () =>
              import(
                '../../../workfow/src/lib/workflow-view/decision-actions/decision/actions.component'
              ).then((c) => c.ActionsComponent),
                                                                       data: {
      permissions: { module: 'WORKFLOW', feature: "DEFINEACTIONS", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
          },
        ],
      },
      {
        path: `:wfid/step/:stepId/decision/:desId/actions/add`,
        loadComponent: () =>
          import(
            '../../../workfow/src/lib/workflow-view/decision-actions/action/action.component'
          ).then((c) => c.ActionComponent),
      },
      {
        path: `:wfid/step/:stepId/decision/:desId/actions/update/:actionId`,
        loadComponent: () =>
          import(
            '../../../workfow/src/lib/workflow-view/decision-actions/action/action.component'
          ).then((c) => c.ActionComponent),
      },
    ],
  },
  {
    path: 'notification-settings',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./notification-setting/event-list/event-list.component').then(
            (c) => c.EventListComponent
          ),
        data: {
          permissions: {
            module: 'NOTIFICATIONS',
            feature: 'NOTIFICATIONS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: ':id/templates',
        loadComponent: () =>
          import(
            './notification-setting/event-templates/event-templates.component'
          ).then((c) => c.EventTemplatesComponent),
        data: {
          permissions: {
            module: 'NOTIFICATIONS',
            feature: 'TEMPLATE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: ':id/add-template',
        loadComponent: () =>
          import(
            './notification-setting/template-action/template-action.component'
          ).then((c) => c.TemplateActionComponent),
        data: {
          permissions: {
            module: 'NOTIFICATIONS',
            feature: 'TEMPLATE',
            action: 'ADD',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: ':id/edit-template/:tempId',
        loadComponent: () =>
          import(
            './notification-setting/template-action/template-action.component'
          ).then((c) => c.TemplateActionComponent),
        data: {
          permissions: {
            module: 'NOTIFICATIONS',
            feature: 'TEMPLATE',
            action: 'EDIT',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: ':id/view-template/:tempId',
        loadComponent: () =>
          import(
            './notification-setting/view-template/view-template.component'
          ).then((c) => c.ViewTemplateComponent),
        data: {
          permissions: {
            module: 'NOTIFICATIONS',
            feature: 'TEMPLATE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  {
    path: 'notification',
    loadComponent: () =>
      import(
        './notification-Container/Notification/Notification.component'
      ).then((c) => c.NotificationComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'view-Notification',
        loadComponent: () =>
          import(
            './notification-Container/viewAllNotification/viewAllNotification.component'
          ).then((c) => c.ViewAllNotificationComponent),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './notification-Container/overview-notification/overview-notifiaction.component'
          ).then((c) => c.OverviewNotifiactionComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './notification-Container/comment-notification/comment-notifiaction.component'
          ).then((c) => c.CommentNotifiactionComponent),
      },
    ],
  },
  {
    path:'profile',
    loadComponent:() => import('./access-management/user-profile/user-profile.component').then(c=>c.UserProfileComponent)
  }
];
