/* eslint-disable @nx/enforce-module-boundaries */
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { dataQuestionnaireResolver } from './../../../questionnaire/src/Service/questionnaire-data-resolver.service';

import { Route } from '@angular/router';
const env = enviroment
export const risksRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../../dashboard/src/lib/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    data: {
      id: 2,
    },
  },
  {
    path: 'risks-list',
    loadComponent: () =>
      import('./risks/risks.component').then((m) => m.RisksComponent),
    data: {
      permissions: { module: 'RISKS', feature: "RISK", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'master-data',
    loadComponent: () =>
      import(
        '../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component'
      ).then((c) => c.LookupUiComponent),
    data: {
      groupID: 1,
      listURL: 'risks-management/risks-list',
           permissions: {
        module: 'RISKS',
        feature: 'MASTERDATA',
        action: 'VIEW',
      },
    },
     canActivate: [PermissionGuard],
  },
  {
    path: 'risk-action',
    loadComponent: () =>
      import('./risk-action/risk-action.component').then(
        (m) => m.RiskActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "RISK", action: "ADD" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk-action/:id',
    loadComponent: () =>
      import('./risk-action/risk-action.component').then(
        (m) => m.RiskActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "RISK", action: "EDIT" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID',
    loadComponent: () =>
      import('./risk-view/risk-view.component').then(
        (m) => m.RiskViewComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "RISK", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./risk-view/risk-overview/risk-overview.component').then(
            (m) => m.RiskOverviewComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "RISK", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'assessments-list',
        loadComponent: () =>
          import('./risk-assessments/risk-assessments.component').then(
            (m) => m.RiskAssessmentsComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "ASSESSMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import('./risk-view/risk-comments/risk-comments.component').then(
            (m) => m.RiskCommentsComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "RISK_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './risk-view/new-risk-attachment/new-risk-attachement.component'
          ).then((m) => m.NewRiskAttachementComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISK_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'mitigation-plans',
        loadComponent: () =>
          import('./risk-mitigation-list/risk-mitigation-list.component').then(
            (m) => m.RiskMitigationListComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "TREATMENT", action: "VIEW" }
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
          groupId: 1,
          permissions: { module: 'RISKS', feature: "RISK_LINKEDMODULE", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'impacted-assets',
        loadComponent: () =>
          import(
            '../../../../shared/shared-ui/src/lib/shared-linkedModule/shared-linkedModule.component'
          ).then((c) => c.SharedLinkedModuleComponent),
        data: {
          groupId: 3,
        },
      },
      {
        path: 'routeCause',
        loadComponent: () =>
          import(
            './../../../incident/src/lib/overviewIncident/view-investigation/RouteCause-Crud/routeCause-list/routeCause-list.component'
          ).then((c) => c.RouteCauseListComponent),
        data: {
          RouteCauseLearn: 'Risk',
          dataEntityTypeID: 1,
          permissions: { module: 'RISKS', feature: "RISK_ROORCAUSE", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },

      {
        path: 'questionnaire/list',
        loadComponent: () =>
          import(
            '../../../questionnaire/src/lib/instance-list/instance-list.component'
          ).then((c) => c.InstanceListComponent),
        data: {
          dataEntityTypeId: 1,
          paramName: 'riskID',
          paramView:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/instance',
          paramAction:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/action',
          paramList:
            '/gfw-portal/risks-management/risk${id}/questionnaire/list',
          permissions: { module: 'RISKS', feature: "RISK_QUESTIONNAIRE", action: "VIEW" }
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  // questionnaire
  {
    path: 'risk/:riskID/questionnaire/action',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance/modify-instance.component'
      ).then((c) => c.ModifyInstanceComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
      routerList: '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
        {
          name: 'Add New Instant ',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
      permissions: { module: 'RISKS', feature: "RISK_QUESTIONNAIRE", action: "ADD" }
    },
    canActivate: [PermissionGuard],
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },
  {
    path: 'risk/:riskID/questionnaire/action/:instanceId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance/modify-instance.component'
      ).then((c) => c.ModifyInstanceComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
      routerList: '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
      permissions: { module: 'RISKS', feature: "RISK_QUESTIONNAIRE", action: "EDIT" }
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
    canActivate: [PermissionGuard],
  },

  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/instance-view/instance-view.component'
      ).then((c) => c.InstanceViewComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
                   permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRE',
        action: 'VIEW',
        sections:'RISK_QUESTIONNAIRESECTIONS',
        answers:'RISK_QUESTIONNAIREANSWERS',
      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
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
            '../../../questionnaire/src/lib/instance-overview/instance-overview.component'
          ).then((c) => c.InstanceOverviewComponent),
        data: {
          dataEntityTypeId: 1,
          paramName: 'riskID',
          routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
          routerList:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
          routerViewItem:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/instance',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Risk Mangement ',
              routerLink: '/gfw-portal/risks-management/risks-list',
            },
          ],
          url_entity_id:
            env.API_URL+'Risks/id?Id=',
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
      {
        path: 'sections',
        loadComponent: () =>
          import(
            './../../../questionnaire/src/lib/instancte-sections/instancte-sections.component'
          ).then((c) => c.InstancteSectionsComponent),
        data: {
          dataEntityTypeId: 1,
          paramName: 'riskID',
          routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
          routerList:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/instance/',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Risk Mangement ',
              routerLink: '/gfw-portal/risks-management/risks-list',
            },

            {
              name: 'Section List',
            },
          ],
          url_entity_id:
            env.API_URL +'Risks/id?Id=',
                            permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONS',
        action: 'VIEW',

      },
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
      {
        path: 'answers',
        loadComponent: () =>
          import(
            '../../../questionnaire/src/lib/answers-sections/answers-sections.component'
          ).then((c) => c.AnswersSectionsComponent),
        data: {
          dataEntityTypeId: 1,
          paramName: 'riskID',
          routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
          routerList:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/instance',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Risk Mangement ',
              routerLink: '/gfw-portal/risks-management/risks-list',
            },

            {
              name: 'Answers',
            },
          ],
          url_entity_id:
            env.API_URL+'Risks/id?Id=',
             permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIREANSWERS',
        action: 'VIEW',
      },
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
    ],
  },

  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId/sections/add',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance-section/modify-instance-section.component'
      ).then((c) => c.ModifyInstanceSectionComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },

        {
          name: 'Add New Section',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
        permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONS',
        action: 'ADD',

      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },
  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId/sections/update/:sectionId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance-section/modify-instance-section.component'
      ).then((c) => c.ModifyInstanceSectionComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
        {
          name: 'Update  Section',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
           permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONS',
        action: 'EDIT',

      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },
  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId/sections/:sectionId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/instance-section-view/instance-section-view.component'
      ).then((c) => c.InstanceSectionViewComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
      routerList: '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
      paramViewItem:
        '/gfw-portal/risks-management/risk/${id}/questionnaire/instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
             permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONS',
        action: 'VIEW',
        questions:'RISK_QUESTIONNAIRESECTIONSQUESTIONS'
      },

    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview', loadComponent: () =>
          import(
            '../../../questionnaire/src/lib/instance-section-overview/instance-section-overview.component'
          ).then((c) => c.InstanceSectionOverviewComponent),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import(
            '../../../questionnaire/src/lib/instance-questions/instance-questions.component'
          ).then((c) => c.InstanceQuestionsComponent),
        data: {
          dataEntityTypeId: 1,
          paramName: 'riskID',
          routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
          routerList:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/risks-management/risk/${id}/questionnaire/instance/',
                      permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONSQUESTIONS',
        action: 'VIEW',
      },
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
    ],
  },

  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId/sections/:sectionId/questions/add',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/add-instance-questions/add-instance-questions.component'
      ).then((c) => c.AddInstanceQuestionsComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
      routerList: '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
      paramViewItem:
        '/gfw-portal/risks-management/risk/${id}/questionnaire/instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
           permissions: {
        module: 'RISKS',
        feature: 'RISK_QUESTIONNAIRESECTIONSQUESTIONS',
        action: 'ADD',
      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },

  {
    path: 'risk/:riskID/questionnaire/instance/:instanceId/sections/:sectionId/questions/:questionId',
    loadComponent: () =>
      import(
        './../../../questionnaire/src/lib/templates/question-view/question-view.component'
      ).then((c) => c.TemplateQuestionViewComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'riskID',
      routerEntity: '/gfw-portal/risks-management/risk/${id}/overview',
      routerList: '/gfw-portal/risks-management/risk/${id}/questionnaire/list',
      paramViewItem:
        '/gfw-portal/risks-management/risk/${id}/questionnaire/instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Risk Mangement ',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
      ],
      url_entity_id:
        env.API_URL+'Risks/id?Id=',
        permissions: { module: 'RISKS', feature: "RISK_QUESTIONNAIRESECTIONSQUESTIONS", action: "VIEW" }
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./../../../questionnaire/src/lib/instance-section-overview/instance-section-overview.component').then((c) => c.InstanceSectionOverviewComponent) },
    ],
  },
  {
    path: ':riskID/mitigation-plans/:id',
    loadComponent: () =>
      import(
        './risk-matigation-over-view/risk-matigation-over-view.component'
      ).then((m) => m.RiskMatigationOverViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./risk-matigation-view/risk-matigation-view.component').then(
            (m) => m.RiskMatigationViewComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "TREATMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import('./commentsMatigation/commentsMatigation.component').then(
            (m) => m.CommentsMatigationComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "TREATMENT_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'response-action',
        loadComponent: () =>
          import('./response-action/response-action.component').then(
            (m) => m.ResponseActionComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "TREATMENT_RESPONSEACTION", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './attachment-mitigation/attachment-mitigation.component'
          ).then((m) => m.AttachmentMitigationComponent),
        data: {
          permissions: { module: 'RISKS', feature: "TREATMENT_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  {
    path: 'risk/:riskID/assessment/:assID',
    loadComponent: () =>
      import('./ass-view-container/ass-view-cintainer.component').then(
        (c) => c.AssViewCintainerComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./risk-assessment-view/risk-assessment-view.component').then(
            (c) => c.RiskAssessmentViewComponent
          ),
        data: {
          permissions: { module: 'RISKS', feature: "ASSESSMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './ass-view-container/assessment-comments/ass-comments.component'
          ).then((m) => m.AssCommentsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "ASSESSMENT_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './ass-view-container/assessment-attach/ass-attach.component'
          ).then((m) => m.AssAttachComponent),
        data: {
          permissions: { module: 'RISKS', feature: "ASSESSMENT_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'control-evaluations',
        loadComponent: () => import('./ass-view-container/control-evaluations/list/list.component').then(c => c.ListComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTCONTROLEVALUATION", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      }
    ],
  },
  {
    path: 'risk/:riskID/assessment/:assID/control-evaluations/action',
    loadComponent: () => import('./ass-view-container/control-evaluations/evaluation-action/evaluation-action.component').then(c => c.EvaluationActionComponent),
    data: {
      permissions: { module: 'RISKS', feature: "RISKASSESSMENTCONTROLEVALUATION", action: "ADD" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID/assessment/:assID/control-evaluations/action/:id',
    loadComponent: () => import('./ass-view-container/control-evaluations/evaluation-action/evaluation-action.component').then(c => c.EvaluationActionComponent),
    data: {
      permissions: { module: 'RISKS', feature: "RISKASSESSMENTCONTROLEVALUATION", action: "EDIT" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID/assessment/:assID/control-evaluations/:id',
    loadComponent: () => import('./ass-view-container/control-evaluations/evaluation-view/evaluation-view.component').then(c => c.EvaluationViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview', loadComponent: () => import('./ass-view-container/control-evaluations/evaluation-view/evaluation-overview/evaluation-overview.component').then(c => c.EvaluationOverviewComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTCONTROLEVALUATION", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ]
  },
  {
    path: 'risk/:riskID/mitigation-action',
    loadComponent: () =>
      import('./risk-mitigation-action/risk-mitigation-action.component').then(
        (c) => c.RiskMitigationActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "TREATMENT", action: "ADD" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID/mitigation-action/:id',
    loadComponent: () =>
      import('./risk-mitigation-action/risk-mitigation-action.component').then(
        (c) => c.RiskMitigationActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "TREATMENT", action: "EDIT" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID/assessment-action',
    loadComponent: () =>
      import('./new-risk-assessment-action/new-risk-assessment-action.component').then(
        (c) => c.NewRiskAssessmentActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "ASSESSMENT", action: "ADD" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk/:riskID/assessment-action/:assessmentId',
    loadComponent: () =>
      import('./new-risk-assessment-action/new-risk-assessment-action.component').then(
        (c) => c.NewRiskAssessmentActionComponent
      ),
    data: {
      permissions: { module: 'RISKS', feature: "ASSESSMENT", action: "EDIT" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'risk-matrix',
    loadComponent: () =>
      import('./risk-matrix/risk-matrix.component').then(
        (m) => m.RiskMatrixComponent
      ),
  },
  {
    path: 'risk-dashboard',
    loadComponent: () =>
      import('./risk-dashboard/risk-dashboard.component').then(
        (c) => c.RiskDashboardComponent
      ),
  },
  {
    path: 'risk-frameworks',
    loadComponent: () =>
      import('./risk-frameworks/risk-frameworks.component').then(
        (c) => c.RiskFrameworksComponent
      ),
  },
  {
    path: 'KRI',
    loadComponent: () =>
      import(
        '../../../indicators/src/lib/indicators-list/indicators-list.component'
      ).then((m) => m.IndicatorsListComponent),
    data: {
      indicatorTypeID: 2,
      routing: 'KRI',
      permissions: { module: 'RISKS', feature: "RISKS_INDICATORS", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
  },
  // ==================
  {
    path: 'methodolgy',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import(
            './Methodology/methodology-list/methodology-list.component'
          ).then((c) => c.MethodologyListComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGY", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: 'methodolgy/:id',
    loadComponent: () =>
      import('./Methodology/methodology-view/methodology-view.component').then(
        (c) => c.MethodologyViewComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'formula',
        loadComponent: () =>
          import(
            './Methodology/methodology-formula/methodology-formula.component'
          ).then((c) => c.MethodologyFormulaComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULA", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },

      {
        path: 'edit-formula',
        loadComponent: () =>
          import(
            './Methodology/method-formula-action/method-formula-action.component'
          ).then((c) => c.MethodFormulaActionComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULA", action: "EDIT" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/methodology-overview/methodology-overview.component'
          ).then((c) => c.MethodologyOverviewComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGY", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './Methodology/methodology-comments/methodology-comments.component'
          ).then((c) => c.MethodologyCommentsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGY_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './Methodology/methodology-attachments/methodology-attachments.component'
          ).then((c) => c.MethodologyAttachmentsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGY_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'factors',
        loadComponent: () =>
          import(
            './Methodology/factorsCrud/factors/factors.component'
          ).then((c) => c.FactorsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'likehoods',
        loadComponent: () =>
          import(
            './Methodology/methodology-likehoods/methodology-likehoods.component'
          ).then((c) => c.MethodologyLikehoodsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYLIKEHOOD", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'impacts',
        loadComponent: () =>
          import(
            './Methodology/methodology-impacts/methodology-impacts.component'
          ).then((c) => c.MethodologyImpactsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYIMPACT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'levels',
        loadComponent: () =>
          import(
            './Methodology/methodology-level/methodology-level.component'
          ).then((c) => c.MethodologyLevelComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYLEVELS", action: "VIEW" },
              featureKey: 'METHODOLOGY',
    featureName: 'LEVEL',
    featureDisplayName: 'Level',

    serviceToken: 'methodologyLevelsService',
    baseRoute: '/gfw-portal/risks-management/methodolgy',

    dataEntityId: 89,
    entityIdField: 'riskLevelID',

    dialogHeader: {
      add: 'METHODOLOGY.ADD_NEW_LEVEL',
      update: 'METHODOLOGY.UPDATE_LEVEL'
    },

        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'assessment-levels',
        loadComponent: () =>
          import(
            './Methodology/methodology-level/methodology-level.component'
          ).then((c) => c.MethodologyLevelComponent),
            data: {
    featureKey: 'METHODOLOGY',
    featureName: 'LEVEL',
    featureDisplayName: 'Level',

    serviceToken: 'controlAssessmentLevelsService',
    baseRoute: '/gfw-portal/risks-management/methodolgy',

    dataEntityId: 89,
    entityIdField: 'riskMethodologyRiskAssessemntControlEffectivenessLevelID',

    dialogHeader: {
      add: 'METHODOLOGY.ADD_NEW_LEVEL',
      update: 'METHODOLOGY.UPDATE_LEVEL'
    },
    permissions: { module: 'RISKS', feature: "METHODOLOGYCONTROLASSESSMENTLEVELS", action: "VIEW" },
  }
      },
      {
        path: 'effectiviness-levels',
        loadComponent: () =>
          import(
            './Methodology/methodology-level/methodology-level.component'
          ).then((c) => c.MethodologyLevelComponent),
            data: {
    featureKey: 'METHODOLOGY',
    featureName: 'LEVEL',
    featureDisplayName: 'Level',

    serviceToken: 'controlEffectivnessLevelsService',
    baseRoute: '/gfw-portal/risks-management/methodolgy',

    dataEntityId: 89,
    entityIdField: 'riskMethodologyControlEffectivenessLevelID',

    dialogHeader: {
      add: 'METHODOLOGY.ADD_NEW_LEVEL',
      update: 'METHODOLOGY.UPDATE_LEVEL'
    },
    permissions: { module: 'RISKS', feature: "METHODOLOGYCONTROLEFFECTIVENESSLEVELS", action: "VIEW" },
  }
      },
      {
        path: 'appetite',
        loadComponent: () =>
          import(
            './Methodology/appetiteCrud/appetiteList/appetiteList.component'
          ).then((c) => c.AppetiteListComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYAPPETITE", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'tolerance',
        loadComponent: () =>
          import(
            './Methodology/toleranceCrud/ToleranceList/ToleranceList.component'
          ).then((c) => c.ToleranceListComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYTOLERANCE", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'effectivenessFormula',
        loadComponent: () =>
          import(
            './Methodology/effectivenessFormula/effectivenessFormula/effectivenessFormula.component'
          ).then((c) => c.EffectivenessFormulaComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  {
    path: 'methodolgy/:id/add-formula',
    loadComponent: () =>
      import(
        './Methodology/method-formula-action/method-formula-action.component'
      ).then((c) => c.MethodFormulaActionComponent),
    data: {
      permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULA", action: "ADD" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:id/update/:formula_id',
    loadComponent: () =>
      import(
        './Methodology/method-formula-action/method-formula-action.component'
      ).then((c) => c.MethodFormulaActionComponent),
    data: {
      permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULA", action: "EDIT" }
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:id/formula/:formula_id',

    loadComponent: () =>
      import(
        './Methodology/methodolgy-formula-view/methodolgy-formula-view.component'
      ).then((c) => c.MethodolgyFormulaViewComponent),

    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/methodolgy-formula-overview/methodolgy-formula-overview.component'
          ).then((c) => c.MethodolgyFormulaOverviewComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULA", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'factors',
        loadComponent: () => import('./Methodology/methodolgy-formula-view/formula-factors/formula-factors.component').then(c => c.FormulaFactorsComponent),
        data: {
          permissions: { module: 'RISKS', feature: "RISKASSESSMENTFORMULAFACTORS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      }
    ],
  },
  {
    path: 'methodolgy/:methodolgyId/levels/:id',
    loadComponent: () =>
      import(
        './Methodology/method-level-view/method-level-view.component'
      ).then((c) => c.MethodLevelViewComponent),
    data: {
      permissions: { module: 'RISKS', feature: "METHODOLOGYLEVELS", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/method-level-overview/method-level-overview.component'
          ).then((c) => c.MethodLevelOverviewComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYLEVELS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: 'methodolgy/:methodolgyId/impacts/:id',
    loadComponent: () =>
      import(
        './Methodology/method-impacts-view/method-impacts-view.component'
      ).then((c) => c.MethodImpactsViewComponent),
    data: {
      permissions: { module: 'RISKS', feature: "METHODOLOGYIMPACT", action: "VIEW" }
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/method-impacts-overview/method-impacts-overview.component'
          ).then((c) => c.MethodImpactsOverviewComponent),
        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYIMPACT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: 'methodolgy/:methodolgyId/likehoods/:id',
    loadComponent: () =>
      import(
        './Methodology/method-likehoods-view/method-likehoods-view.component'
      ).then((c) => c.MethodLikehoodsViewComponent),
           data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYLIKEHOOD", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/method-likehoods-overview/method-likehoods-overview.component'
          ).then((c) => c.MethodLikehoodsOverviewComponent),
               data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYLIKEHOOD", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
  // appetite Routing

  {
    path: 'methodolgy/:id/add-appetite',
    loadComponent: () =>
      import(
        './Methodology/appetiteCrud/appetite-action/appetite-action.component'
      ).then((c) => c.AppetiteActionComponent),
           data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYAPPETITE", action: "ADD" }
        },
        canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:id/update-appetite/:appetite_id',
    loadComponent: () =>
      import(
        './Methodology/appetiteCrud/appetite-action/appetite-action.component'
      ).then((c) => c.AppetiteActionComponent),
             data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYAPPETITE", action: "EDIT" }
        },
        canActivate: [PermissionGuard],
  },

  // tolerance Routing

  {
    path: 'methodolgy/:id/add-tolerance',
    loadComponent: () =>
      import(
        './Methodology/toleranceCrud/Tolerance-action/Tolerance-action.component'
      ).then((c) => c.ToleranceActionComponent),
              data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYTOLERANCE", action: "ADD" }
        },
        canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:id/update-tolerance/:tolerance_id',
    loadComponent: () =>
      import(
        './Methodology/toleranceCrud/Tolerance-action/Tolerance-action.component'
      ).then((c) => c.ToleranceActionComponent),
              data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYTOLERANCE", action: "EDIT" }
        },
        canActivate: [PermissionGuard],
  },

  {
    path: 'methodolgy/:methodolgyId/factors/:id',
    loadComponent: () =>
      import(
        './Methodology/factorsCrud/factor-over-view/factor-over-view.component'
      ).then((c) => c.FactorOverViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/factorsCrud/factor-view/factor-view.component'
          ).then((c) => c.FactorViewComponent),
                  data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'factorsLevel',
        loadComponent: () =>
          import(
            './Methodology/factorLevelCrud/factorLevel/factorLevel.component'
          ).then((c) => c.FactorLevelComponent),
                           data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORLEVELS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './Methodology/factorsCrud/factor-attachment/factor-attachment.component'
          ).then((c) => c.FactorAttachmentComponent),
                           data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './Methodology/factorsCrud/factor-comment/factor-comment.component'
          ).then((c) => c.FactorCommentComponent),
                                     data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  // factor Level
  {
    path: 'methodolgy/:id/addFactor',
    loadComponent: () =>
      import(
        './Methodology/factorsCrud/factor-action/factor-action.component'
      ).then((c) => c.FactorActionComponent),
                                        data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS", action: "ADD" }
        },
        canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:id/updateFactor/:factorId',
    loadComponent: () =>
      import(
        './Methodology/factorsCrud/factor-action/factor-action.component'
      ).then((c) => c.FactorActionComponent),
                                              data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORS", action: "EDIT" }
        },
        canActivate: [PermissionGuard],
  },

  // factorLevel
  {
    path: 'methodolgy/:methodolgyId/factors/:id/factorsLevel/:factorLevelId',
    loadComponent: () =>
      import(
        './Methodology/factorLevelCrud/factor-level-overview/factor-level-overview.component'
      ).then((c) => c.FactorLevelOverviewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/factorLevelCrud/factor-level-view/factor-level-view.component'
          ).then((c) => c.FactorLevelViewComponent),
                                   data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORLEVELS", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },

      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './Methodology/factorLevelCrud/factor-level-attachment/factor-level-attachment.component'
          ).then((c) => c.FactorLevelAttachmentComponent),
                                           data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORLEVELS_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './Methodology/factorLevelCrud/factor-level-comment/factor-level-comment.component'
          ).then((c) => c.FactorLevelCommentComponent),
                                   data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYFACTORLEVELS_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },



  // Effectiveness Formula
  {
    path: 'methodolgy/:id/addEffectivenessFormula',
    loadComponent: () =>
      import(
        './Methodology/effectivenessFormula/effectiveness-formula-action/effectiveness-formula-action.component'
      ).then((c) => c.EffectivenessFormulaActionComponent),
              data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA", action: "ADD" }
        },
        canActivate: [PermissionGuard],

  },
  {
    path: 'methodolgy/:id/updateEffectivenessFormula/:effectivenessId',
    loadComponent: () =>
      import(
        './Methodology/effectivenessFormula/effectiveness-formula-action/effectiveness-formula-action.component'
      ).then((c) => c.EffectivenessFormulaActionComponent),
              data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA", action: "EDIT" }
        },
        canActivate: [PermissionGuard],
  },
  {
    path: 'methodolgy/:methodolgyId/effectivenessFormula/:effectivenessId',
    loadComponent: () =>
      import(
        './Methodology/effectivenessFormula/effectiveness-formula-overview/effectiveness-formula-overview.component'
      ).then((c) => c.EffectivenessFormulaOverviewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Methodology/effectivenessFormula/effectiveness-formula-view/effectiveness-formula-view.component'
          ).then((c) => c.EffectivenessFormulaViewComponent),
                  data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './Methodology/effectivenessFormula/effectiveness-formula-attachment/effectiveness-formula-attachment.component'
          ).then((c) => c.EffectivenessFormulaAttachmentComponent),
                  data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA_ATTACHMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './Methodology/effectivenessFormula/effectiveness-formula-comment/effectiveness-formula-comment.component'
          ).then((c) => c.EffectivenessFormulaCommentComponent),
                  data: {
          permissions: { module: 'RISKS', feature: "METHODOLOGYEFFECTIVEFORMULA_COMMENT", action: "VIEW" }
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
];
