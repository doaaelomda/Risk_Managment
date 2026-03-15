import { Route } from '@angular/router';

export const awarenessRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'campaign-list',
    pathMatch: 'full',
  },
  {
    path: 'campaign-list',
    loadComponent: () =>
      import('./awareness-list/awareness-list.component').then(
        (c) => c.AwarenessListComponent
      ),
  },
  {
    path: 'add-campaign',
    loadComponent: () =>
      import('./awarness-action/awarness-action.component').then(
        (c) => c.AwarnessActionComponent
      ),
  },
  {
    path: 'update-campaign/:id',
    loadComponent: () =>
      import('./awarness-action/awarness-action.component').then(
        (c) => c.AwarnessActionComponent
      ),
  },

  {
    path: 'campaign/:id',
    loadComponent: () =>
      import('./awarness-overView/awarness-overView.component').then(
        (c) => c.AwarnessOverViewComponent
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
            './awarness-overView/awarness-view/awarness-view.component'
          ).then((c) => c.AwarnessViewComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './awarness-overView/awarness-attachment/awarness-attachment.component'
          ).then((c) => c.AwarnessAttachmentComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './awarness-overView/awarness-comment/awarness-comment.component'
          ).then((c) => c.AwarnessCommentComponent),
      },
    ],
  },
  {
    path: 'compagine-setup/:id',
    loadComponent: () =>
      import(
        './awareness-setupContainer/awareness-setupContainer.component'
      ).then((c) => c.AwarenessSetupContainerComponent),
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
            './awareness-setupContainer/awareness-overview/awareness-overview.component'
          ).then((c) => c.AwarenessOverviewComponent),
      },

      {
        path: 'aduiance',
        loadComponent: () =>
          import('./awareness-setupContainer/Audience/Audience.component').then(
            (c) => c.AudienceComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () => import('./awareness-setupContainer/campagine-messages/compagine-messages.component').then(c => c.CompagineMessagesComponent)
      },

      {
        path: 'contentFiles',
        loadComponent: () => import('./awareness-setupContainer/compagine-context-file/compagine-contextFile.component').then(c => c.CompagineContextFileComponent)
      },
      {
        path: 'Quiz',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-Awarness-list/quiz-Awarness-list.component'
          ).then((c) => c.QuizAwarnessListComponent),
      }
    ],
  },

  {
    path: 'compagine-setup/:id/Quiz/:quizId',
    loadComponent: () =>
      import(
        './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/quiz-awarness-overview.component'
      ).then((c) => c.QuizAwarnessOverviewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/questionView/questionView.component'
          ).then((m) => m.QuestionViewComponent),
      },
      {
        path: 'question-quiz',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/QuestionQuiz.component'
          ).then((m) => m.QuestionQuizComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/questionComment/questionComment.component'
          ).then((m) => m.QuestionCommentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/questionAttachmnet/questionAttachment.component'
          ).then((m) => m.QuestionAttachmentComponent),
      },
    ],
  },


  {
    path: 'compagine-setup/:id/aduiance/action',
    loadComponent: () =>
      import(
        './awareness-setupContainer/Audience-Crud/audience-action/audience-action.component'
      ).then((c) => c.AudienceActionComponent),
  },

  {
    path: 'compagine-setup/:id/aduiance/action/:audienceId',
    loadComponent: () =>
      import(
        './awareness-setupContainer/Audience-Crud/audience-action/audience-action.component'
      ).then((c) => c.AudienceActionComponent),
  },

  {
    path: 'compagine-setup/:id/aduiance/:audienceId',
    loadComponent: () =>
      import(
        './awareness-setupContainer/Audience-Crud/audience-overView/audience-overView.component'
      ).then((c) => c.AudienceOverViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './awareness-setupContainer/Audience-Crud/audience-view/audience-view.component'
          ).then((c) => c.AudienceViewComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/Audience-Crud/audience-attachment/audience-attachment.component'
          ).then((c) => c.AudienceAttachmentComponent),
      },

      {
        path: 'comments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/Audience-Crud/audience-comment/audience-comment.component'
          ).then((c) => c.AudienceCommentComponent),
      },
    ],
  },


















  {
    path: 'compagine-setup/:id/Quiz/:quizId/question-quiz/:questionId',
    loadComponent: () =>
      import(
        './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/overviewQuestionQuiz/overviewQuestionQuiz.component'
      ).then((c) => c.OverviewQuestionQuizComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/overviewQuestionQuiz/viewQuestionQuiz/viewQuestionQuiz.component'
          ).then((m) => m.ViewQuestionQuizComponent),
      },
      {
        path: 'option-question',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/overviewQuestionQuiz/optionQuestion/optionQuestion.component'
          ).then((m) => m.OptionQuestionComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/overviewQuestionQuiz/viewQuestioncomment/QuestionQuizcomment.component'
          ).then((m) => m.QuestionQuizcommentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './awareness-setupContainer/quiz-Crud/quiz-awarness-overview/QuestionQuiz/overviewQuestionQuiz/viewQuestionattachment/QuestionQuizattachment.component'
          ).then((m) => m.QuestionQuizattachmentComponent),
      },
    ],
  },
];
