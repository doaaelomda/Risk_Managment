// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { dataQuestionnaireResolver } from './../../../questionnaire/src/Service/questionnaire-data-resolver.service';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

import { enviroment } from 'apps/gfw-portal/env/dev.env';


const API_URL = enviroment.API_URL;

export const thirdPartyRoutes: Route[] = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./third-party-list/third-party-list.component').then(
        (c) => c.ThirdPartyListComponent
      ),
  },
  {
    path: 'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent: () =>
      import(
        '../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component'
      ).then((c) => c.LookupUiComponent),
    data: {
      groupID: 11,
      listURL: 'third-party/list',
                       permissions: {
        module: 'THIRDPARTY',
        feature: 'MASTERDATA',
        action: 'VIEW',
      },
    },
          canActivate: [PermissionGuard],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./third-party-action/third-party-action.component').then(
        (c) => c.ThirdPartyActionComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./third-party-action/third-party-action.component').then(
        (c) => c.ThirdPartyActionComponent
      ),
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import(
        './third-party-viewContainer/third-party-viewContainer.component'
      ).then((c) => c.ThirdPartyViewContainerComponent),
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
            './third-party-viewContainer/third-party-overview/thirdparty-overview.component'
          ).then((c) => c.ThirdpartyOverviewComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import(
            './third-party-viewContainer/third-party-contact/third-party-contact.component'
          ).then((c) => c.ThirdPartyContactComponent),
      },
      {
        path: 'contract',
        loadComponent: () =>
          import(
            './third-party-viewContainer/third-party-contract/third-party-contract.component'
          ).then((c) => c.ThirdPartyContractComponent),
      },
      {
        path: 'due-diligence',
        loadComponent: () =>
          import(
            './third-party-viewContainer/third-party-duadiliganse/third-party-duadiliganse.component'
          ).then((c) => c.ThirdPartyDuadiliganseComponent),
      },
      {
        path: 'assessment',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/general-assessment-CRUD/general-assessment-list/general-assessment-list.component'
          ).then((c) => c.GeneralAssessmentListComponent),
        data: {
          generalAssessmentTypeID: 1,
          dataEntityTypeID: 1,
        },
      },
      {
        path: 'Activity',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/Activity-CRUD/activity-list/activity-list.component'
          ).then((c) => c.ActivityListComponent),
        data: {
          generalAssessmentTypeID: 1,
          dataEntityTypeID: 40,
        },
      },

      {
        path: 'Exceptions',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/expection-CRUD/ecxpection-list/expection-list.component'
          ).then((c) => c.ExpectionListComponent),
        data: {
          grcExceptionTypeID: 0,
          dataEntityTypeID: 0,
        },
      },

      {
        path: 'questionnaire/list',
        loadComponent: () =>
          import(
            '../../../questionnaire/src/lib/instance-list/instance-list.component'
          ).then((c) => c.InstanceListComponent),
        data: {
          dataEntityTypeId: 40,
          paramName: 'id',
          paramView: '/gfw-portal/third-party/${id}/questionnaire/Instance/',
          paramAction: '/gfw-portal/third-party/${id}/questionnaire/action',
          paramList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
           permissions: { module: 'THIRDPARTIES', feature: "THIRDPARTYQUESTIONNAIRE", action: "VIEW" }
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
    ],
  },

  // questionnaire
  // add
  {
    path: ':id/questionnaire/action',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance/modify-instance.component'
      ).then((c) => c.ModifyInstanceComponent),
    data: {
      dataEntityTypeId: 40,
      paramName: 'id',
      routerEntity: '/gfw-portal/third-party/view/${id}/overview',
      routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },
        {
          name: 'Add New Instant ',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
        permissions: { module: 'THIRDPARTIES', feature: "THIRDPARTYQUESTIONNAIRE", action: "ADD" }
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },

  // update
  {
    path: ':id/questionnaire/action/:instanceId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance/modify-instance.component'
      ).then((c) => c.ModifyInstanceComponent),
    data: {
      dataEntityTypeId: 40,
      paramName: 'id',
      routerEntity: '/gfw-portal/third-party/view/${id}/overview',
      routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },
        {
          name: 'Update New Instant ',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
        permissions: { module: 'THIRDPARTIES', feature: "THIRDPARTYQUESTIONNAIRE", action: "EDIT" }
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },
  // view
  {
    path: ':id/questionnaire/Instance/:instanceId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/instance-view/instance-view.component'
      ).then((c) => c.InstanceViewComponent),
    data: {
      dataEntityTypeId: 40,
      paramName: 'id',
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
              permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRE',
        action: 'VIEW',
        sections:'THIRDPARTYQUESTIONNAIRESECTIONS',
        answers:'THIRDPARTYQUESTIONNAIREANSWERS',
      },
        // THIRDPARTIES
// THIRDPARTYQUESTIONNAIREANSWERS
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
          paramName: 'id',
          routerEntity: '/gfw-portal/third-party/view/${id}/overview',
          routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Third Parties',
              routerLink: '/gfw-portal/third-party/list',
            },
          ],
          url_entity_id:
            API_URL+'ThirdParty?ThirdPartyID=',
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
          dataEntityTypeId: 40,
          paramName: 'id',
          routerEntity: '/gfw-portal/third-party/view/${id}/overview',
          routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/third-party/${id}/questionnaire/Instance/',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Third Parties',
              routerLink: '/gfw-portal/third-party/list',
            },
            {
              name: 'Section List',
            },
          ],
          url_entity_id:
            API_URL+'ThirdParty?ThirdPartyID=',
                     permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONS',
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
          dataEntityTypeId: 40,
          paramName: 'id',
          routerEntity: '/gfw-portal/third-party/view/${id}/overview',
          routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/third-party/${id}/questionnaire/Instance/',
          breadCrumbData: [
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: 'Third Parties',
              routerLink: '/gfw-portal/third-party/list',
            },
            {
              name: 'Answer List',
            },
          ],
          url_entity_id:
            API_URL+'ThirdParty?ThirdPartyID=',
                         permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIREANSWERS',
      },
        },
        resolve: {
          resolvedHandler: dataQuestionnaireResolver,
        },
      },
    ],
  },

  {
    path: ':id/questionnaire/Instance/:instanceId/sections/add',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance-section/modify-instance-section.component'
      ).then((c) => c.ModifyInstanceSectionComponent),
    data: {
      dataEntityTypeId: 40,
      paramName: 'id',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },

        {
          name: 'Add New Section',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
                permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONS',
        action: 'ADD',

      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },

  {
    path: ':id/questionnaire/Instance/:instanceId/sections/update/:sectionId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/modify-instance-section/modify-instance-section.component'
      ).then((c) => c.ModifyInstanceSectionComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'id',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },

        {
          name: 'Update New Section',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
                     permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONS',
        action: 'EDIT',

      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },

  {
    path: ':id/questionnaire/Instance/:instanceId/sections/:sectionId',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/instance-section-view/instance-section-view.component'
      ).then((c) => c.InstanceSectionViewComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'id',
      routerEntity: '/gfw-portal/third-party/view/${id}/overview',
      routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
      paramViewItem: '/gfw-portal/third-party/${id}/questionnaire/Instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
             permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONS',
        action: 'VIEW',
        questions:'THIRDPARTYQUESTIONNAIRESECTIONQUESTIONS'
      },

    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
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
          paramName: 'id',
          routerEntity: '/gfw-portal/third-party/view/${id}/overview',
          routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
          paramViewItem:
            '/gfw-portal/third-party/${id}/questionnaire/Instance/',
                 permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONQUESTIONS',
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
    path: ':id/questionnaire/Instance/:instanceId/sections/:sectionId/questions/add',
    loadComponent: () =>
      import(
        '../../../questionnaire/src/lib/add-instance-questions/add-instance-questions.component'
      ).then((c) => c.AddInstanceQuestionsComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'id',
      routerEntity: '/gfw-portal/third-party/view/${id}/overview',
      routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
      paramViewItem: '/gfw-portal/third-party/${id}/questionnaire/Instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
           permissions: {
        module: 'THIRDPARTIES',
        feature: 'THIRDPARTYQUESTIONNAIRESECTIONQUESTIONS',
        action: 'ADD',
      },
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
  },

  {
    path: ':id/questionnaire/Instance/:instanceId/sections/:sectionId/questions/:questionId',
    loadComponent: () =>
      import(
        './../../../questionnaire/src/lib/templates/question-view/question-view.component'
      ).then((c) => c.TemplateQuestionViewComponent),
    data: {
      dataEntityTypeId: 1,
      paramName: 'id',
      routerEntity: '/gfw-portal/third-party/view/${id}/overview',
      routerList: '/gfw-portal/third-party/view/${id}/questionnaire/list',
      paramViewItem: '/gfw-portal/third-party/${id}/questionnaire/Instance/',
      breadCrumbData: [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: 'Third Parties',
          routerLink: '/gfw-portal/third-party/list',
        },
      ],
      url_entity_id:
        API_URL+'ThirdParty?ThirdPartyID=',
        data:{
          permissions:{module:'THIRDPARTIES' , feature:'THIRDPARTYQUESTIONNAIRESECTIONQUESTIONS'}
        }
    },
    resolve: {
      resolvedHandler: dataQuestionnaireResolver,
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './../../../questionnaire/src/lib/templates/question-overview/question-overview.component'
          ).then((c) => c.TemplateQuestionOverviewComponent),
      },
    ],
  },

  {
    path: 'view/:tpId/due-diligence/add',
    loadComponent: () =>
      import('./modify-duadiliganse/modify-duadiliganse.component').then(
        (c) => c.ModifyDuadiliganseComponent
      ),
  },
  {
    path: 'view/:tpId/due-diligence/update/:dueDiligenceId',
    loadComponent: () =>
      import('./modify-duadiliganse/modify-duadiliganse.component').then(
        (c) => c.ModifyDuadiliganseComponent
      ),
  },
  {
    path: 'view/:tpId/due-diligence/:dueDiligenceId',
    loadComponent: () =>
      import('./view-duadiliganse/view-duadiliganse.component').then(
        (c) => c.ViewDuadiliganseComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './view-duadiliganse/overview-duadiliganse/overview-duadiliganse.component'
          ).then((c) => c.OverviewDuadiliganseComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './view-duadiliganse/comments-duadiliganse/comments-duadiliganse.component'
          ).then((c) => c.CommentsDuadiliganseComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './view-duadiliganse/attachments-duadiliganse/attachments-duadiliganse.component'
          ).then((c) => c.AttachmentsDuadiliganseComponent),
      },
    ],
  },
  {
    path: 'contracts',
    loadComponent: () =>
      import('./contract-list/contract-list.component').then(
        (c) => c.ContractListComponent
      ),
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./contact-list/contact-list.component').then(
        (c) => c.ContactListComponent
      ),
  },
  {
    path: 'SLA',
    loadComponent: () =>
      import('./sla-list/sla-list.component').then((c) => c.SlaListComponent),
  },
  {
    path: ':thirdPartyId/contacts/:contactId',
    loadComponent: () =>
      import('./contact-view/contact-view.component').then(
        (c) => c.ContactViewComponent
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
          import(
            './contact-view/contact-overview/contact-overview.component'
          ).then((c) => c.ContactOverviewComponent),
      },
    ],
  },
  {
    path: 'contacts/:contactId',
    loadComponent: () =>
      import('./contact-view/contact-view.component').then(
        (c) => c.ContactViewComponent
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
          import(
            './contact-view/contact-overview/contact-overview.component'
          ).then((c) => c.ContactOverviewComponent),
      },
    ],
  },
  {
    path: ':thirdPartyId/contracts/:contractId',
    loadComponent: () =>
      import('./contract-view/contract-view.component').then(
        (c) => c.ContractViewComponent
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
          import(
            './contract-view/contract-overview/contract-overview.component'
          ).then((c) => c.ContractOverviewComponent),
      },
      {
        path: 'sla',
        loadComponent: () =>
          import('./contract-view/contract-sla/contract-sla.component').then(
            (c) => c.ContractSlaComponent
          ),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './contract-view/contract-comments/contract-comments.component'
          ).then((c) => c.ContractCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './contract-view/contract-attachments/contract-attachments.component'
          ).then((c) => c.ContractAttachmentsComponent),
      },
    ],
  },
  {
    path: 'contracts/:contractId',
    loadComponent: () =>
      import('./contract-view/contract-view.component').then(
        (c) => c.ContractViewComponent
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
          import(
            './contract-view/contract-overview/contract-overview.component'
          ).then((c) => c.ContractOverviewComponent),
      },
      {
        path: 'sla',
        loadComponent: () =>
          import('./contract-view/contract-sla/contract-sla.component').then(
            (c) => c.ContractSlaComponent
          ),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './contract-view/contract-comments/contract-comments.component'
          ).then((c) => c.ContractCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './contract-view/contract-attachments/contract-attachments.component'
          ).then((c) => c.ContractAttachmentsComponent),
      },
    ],
  },
  {
    path: ':thirdPartyId/sla/:slaId',
    loadComponent: () =>
      import('./sla-view/sla-view.component').then((c) => c.SlaViewComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sla-view/sla-overview/sla-overview.component').then(
            (c) => c.SlaOverviewComponent
          ),
      },
    ],
  },
  {
    path: 'sla/:slaId',
    loadComponent: () =>
      import('./sla-view/sla-view.component').then((c) => c.SlaViewComponent),

    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sla-view/sla-overview/sla-overview.component').then(
            (c) => c.SlaOverviewComponent
          ),
      },
    ],
  },

  {
    path: ':generalId/add-assessment',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/general-assessment-CRUD/general-assessment-action/general-assessment-action.component'
      ).then((c) => c.GeneralAssessmentActionComponent),
  },
  {
    path: ':generalId/update-assessment/:AssId',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/general-assessment-CRUD/general-assessment-action/general-assessment-action.component'
      ).then((c) => c.GeneralAssessmentActionComponent),
  },
  {
    path: ':generalId/overview-assessment/:AssId',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/general-assessment-CRUD/overviewAssessmnet/overviewGeneralAssessmnet.component'
      ).then((c) => c.OverviewGeneralAssessmnetComponent),
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
            '../../../dashboard/src/lib/general-assessment-CRUD/overviewAssessmnet/viewAssessmnet/viewGeneralAssessmnet.component'
          ).then((c) => c.ViewGeneralAssessmnetComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/general-assessment-CRUD/overviewAssessmnet/attachmentAssessmnet/attachmentGeneralAssessmnet.component'
          ).then((c) => c.AttachmentGeneralAssessmnetComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/general-assessment-CRUD/overviewAssessmnet/commentGeneralAssessmnet/commentGeneralAssessmnet.component'
          ).then((c) => c.CommentGeneralAssessmnetComponent),
      },
    ],
  },
  {
    path: ':generalId/add-activity',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/Activity-CRUD/activity-action/activity-action.component'
      ).then((c) => c.ActivityActionComponent),
  },
  {
    path: ':generalId/update-activity/:ActivityId',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/Activity-CRUD/activity-action/activity-action.component'
      ).then((c) => c.ActivityActionComponent),
  },
  {
    path: ':generalId/overview-activity/:ActivityId',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/Activity-CRUD/activity-viewContainer/activity-viewContainer.component'
      ).then((c) => c.ActivityViewContainerComponent),
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
            '../../../dashboard/src/lib/Activity-CRUD/activity-viewContainer/activityView/activityView.component'
          ).then((c) => c.ActivityViewComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/Activity-CRUD/activity-viewContainer/activityAttachmnet/actvityAttachment.component'
          ).then((c) => c.ActvityAttachmentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/Activity-CRUD/activity-viewContainer/activityComment/actvityComment.component'
          ).then((c) => c.ActvityCommentComponent),
      },
    ],
  },
  {
    path: 'contracts',
    loadComponent: () =>
      import('./contract-list/contract-list.component').then(
        (c) => c.ContractListComponent
      ),
  },

  {
    path: ':generalId/add-exception',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/expection-CRUD/ecxpection-action/expection-action.component'
      ).then((c) => c.ExceptionsActionComponent),
  },
  {
    path: ':generalId/update-exception/:ExceptionId',

    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/expection-CRUD/ecxpection-action/expection-action.component'
      ).then((c) => c.ExceptionsActionComponent),
  },
  {
    path: ':generalId/overview-exception/:ExceptionId',
    loadComponent: () =>
      import(
        '../../../dashboard/src/lib/expection-CRUD/ecxpection-overview/expection-overview.component'
      ).then((c) => c.ExpectionOverviewComponent),
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
            '../../../dashboard/src/lib/expection-CRUD/ecxpection-overview/expection-view/expection-view.component'
          ).then((c) => c.ExpectionViewComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/expection-CRUD/ecxpection-overview/expection-attachment/expection-attachment.component'
          ).then((c) => c.ExpectionAttachmentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            '../../../dashboard/src/lib/expection-CRUD/ecxpection-overview/expection-comment/expection-comment.component'
          ).then((c) => c.ExpectionCommentComponent),
      },
    ],
  },

  {
    path: 'KTI',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import(
        '../../../indicators/src/lib/indicators-list/indicators-list.component'
      ).then((m) => m.IndicatorsListComponent),
    data: {
      indicatorTypeID: 4,
      routing: 'KTI',
        permissions: { module: 'THIRDPARTIES', feature: "THIRDPARTYINDICATORS",action:'VIEW' }
    },
  },
];
