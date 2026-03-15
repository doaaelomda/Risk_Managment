import { Route } from '@angular/router';

export const incidentRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./incident-list/incident-list.component').then(
        (c) => c.IncidentListComponent
      ),
  },
  {
    path: 'add-incident',
    loadComponent: () =>
      import('./incident-action/incident-action.component').then(
        (c) => c.IncidentActionComponent
      ),
  },
  {
    path: 'add-incident/:id',
    loadComponent: () =>
      import('./incident-action/incident-action.component').then(
        (c) => c.IncidentActionComponent
      ),
  },

  {
    path: 'viewincident/:id',
    loadComponent: () =>
      import('./overviewIncident/overviewIncident.component').then(
        (c) => c.OverviewIncidentComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overviewIncident/viewIncident/viewIncident.component').then(
            (m) => m.ViewIncidentComponent
          ),
      },
      {
        path: 'action',
        loadComponent: () =>
          import(
            './overviewIncident/inciden-action/incident-action.component'
          ).then((c) => c.IncidentActionComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewIncident/commentIncident/commentIncident.component'
          ).then((m) => m.CommentIncidentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewIncident/attachmentIncident/attachmentIncident.component'
          ).then((m) => m.AttachmentIncidentComponent),
      },

      {
        path: 'investigations',
        loadComponent: () =>
          import(
            './overviewIncident/incident-investigation/incident-investingation.component'
          ).then((c) => c.IncidentInvestingationComponent),
      },
      {
        path: 'lesson-Learning',
        loadComponent: () =>
          import(
            './overviewIncident/lessonLearn-Crud/lessonLearn-list/lessonLearn-list.component'
          ).then((c) => c.LessonLearnListComponent),
        data: {
          generalAssessmentTypeID: 1,
          dataEntityTypeID: 92,
        },
      },
      {
        path: 'closure',
        loadComponent: () =>
          import(
            './overviewIncident/incident-closure/incident-closure.component'
          ).then((c) => c.IncidentClosureComponent),
      },
    ],
  },

  {
    path: ':incidentId/closure/add',
    loadComponent: () =>
      import(
        './overviewIncident/incident-closure/save-incident-closure/save-incident-closure.component'
      ).then((c) => c.SaveIncidentClosureComponent),
  },

  {
    path: ':incidentId/closure/update/:id',
    loadComponent: () =>
      import(
        './overviewIncident/incident-closure/save-incident-closure/save-incident-closure.component'
      ).then((c) => c.SaveIncidentClosureComponent),
  },

  {
    path: ':incidentId/closure/:id',
    loadComponent: () =>
      import(
        './overviewIncident/incident-closure/view-incident-closure/view-incident-closure.component'
      ).then((c) => c.ViewIncidentClosureComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './overviewIncident/incident-closure/view-incident-closure/overview-incident-closure/overview-incident-closure.component'
          ).then((c) => c.OverviewIncidentClosureComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewIncident/incident-closure/view-incident-closure/comments-incident-closure/comments-incident-closure.component'
          ).then((c) => c.CommentsIncidentClosureComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewIncident/incident-closure/view-incident-closure/attachments-incident-closure/attachments-incident-closure.component'
          ).then((c) => c.AttachmentsIncidentClosureComponent),
      },
    ],
  },

  {
    path: ':incidentId/investigations/add',
    loadComponent: () =>
      import(
        './overviewIncident/save-investigation/save-investigation.component'
      ).then((c) => c.SaveInvestigationComponent),
  },
  {
    path: ':incidentId/investigations/update/:investigationId',
    loadComponent: () =>
      import(
        './overviewIncident/save-investigation/save-investigation.component'
      ).then((c) => c.SaveInvestigationComponent),
  },
  {
    path: ':incidentId/investigations/:investigationId',
    loadComponent: () =>
      import(
        './overviewIncident/view-investigation/view-investigation.component'
      ).then((c) => c.ViewInvestigationComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './overviewIncident/view-investigation/overview-invest/overview-invest.component'
          ).then((c) => c.OverviewInvestComponent),
      },
      {
        path: 'routeCause',
        loadComponent: () =>
          import(
            './overviewIncident/view-investigation/RouteCause-Crud/routeCause-list/routeCause-list.component'
          ).then((c) => c.RouteCauseListComponent),
        data: {
          RouteCauseLearn: 'Incident',
          dataEntityTypeID: 91,
        },
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewIncident/view-investigation/comments-invest/comments-invest.component'
          ).then((c) => c.CommentsInvestComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewIncident/view-investigation/attachments-invest/attachments-invest.component'
          ).then((c) => c.AttachmentsInvestComponent),
      },
    ],
  },

  {
    path: ':generalId/add-lesson',
    loadComponent: () =>
      import(
        './overviewIncident/lessonLearn-Crud/lessonLearn-action/lessonLearn-action.component'
      ).then((c) => c.LessonLearnActionComponent),
  },
  {
    path: ':generalId/update-lesson/:lessonId',
    loadComponent: () =>
      import(
        './overviewIncident/lessonLearn-Crud/lessonLearn-action/lessonLearn-action.component'
      ).then((c) => c.LessonLearnActionComponent),
  },

  {
    path: ':generalId/add-routeCause',
    loadComponent: () =>
      import(
        './overviewIncident/view-investigation/RouteCause-Crud/routeCause-action/routeCause-action.component'
      ).then((c) => c.RouteCauseActionComponent),
    data: {
      dataEntityTypeID: 91,
    },
  },
  {
    path: ':generalId/update-routeCause/:routeCauseId',
    loadComponent: () =>
      import(
        './overviewIncident/view-investigation/RouteCause-Crud/routeCause-action/routeCause-action.component'
      ).then((c) => c.RouteCauseActionComponent),
    data: {
      dataEntityTypeID: 91,
    },
  },
];
