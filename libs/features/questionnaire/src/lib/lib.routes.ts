import { Route } from '@angular/router';
export const questionnaireRoutes: Route[] = [
  { path: '', redirectTo: 'questions-list', pathMatch: 'full' },
  {
    path: 'questions-list',
    loadComponent: () =>
      import('./questionList/questionList.component').then(
        (c) => c.QuestionListComponent
      ),
  },
  {
    path: 'addQuestion',
    loadComponent: () =>
      import('./questionAction/questionAction.component').then(
        (c) => c.QuestionActionComponent
      ),
  },
  {
    path: 'updateQuestion/:id',
    loadComponent: () =>
      import('./questionAction/questionAction.component').then(
        (c) => c.QuestionActionComponent
      ),
  },
  {
    path: 'ViewQuestion/:id',
    loadComponent:()=> import('./questionOverview/questionOverview.component').then(c=>c.QuestionOverviewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./questionOverview/questionView/questionView.component').then(
            (m) => m.QuestionViewComponent
          ),
      },
      {
        path: 'question-answer',
        loadComponent: () =>
          import(
            './questionOverview/questionAnswer/questionAnswer.component'
          ).then((m) => m.QuestionAnswerComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './questionOverview/questionComment/questionComment.component'
          ).then((m) => m.QuestionCommentComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './questionOverview/questionAttachmnet/questionAttachment.component'
          ).then((m) => m.QuestionAttachmentComponent),
      },
      {
        path: 'QuestionnaireAnswer',
        loadComponent: () =>
          import(
            './questionOverview/QuestionnaireAnswerOption/QuestionnaireAnswerOption.component'
          ).then((m) => m.QuestionnaireAnswerOptionComponent),
      },
    ],
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./templates/templates.component').then(
        (c) => c.TemplatesComponent
      ),
  },
  {
    path: 'templates/add',
    loadComponent: () =>
      import('./templates/add-template/add-template.component').then(
        (c) => c.AddTemplateComponent
      ),
  },
  {
    path: 'templates/update/:templateId',
    loadComponent: () =>
      import('./templates/add-template/add-template.component').then(
        (c) => c.AddTemplateComponent
      ),
  },
  {
    path: 'templates/:templateId',
    loadComponent:() => import('./templates/template-view/template-view.component').then(c=>c.TemplateViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:() => import('./templates/template-overview/template-overview.component').then(c=>c.TemplateOverviewComponent) },
      { path: 'sections', loadComponent:() => import('./templates/template-sections/template-sections.component').then(c=>c.TemplateSectionsComponent)},
    ],
  },
  {
    path: 'templates/:templateId/sections/add',
    loadComponent:() => import('./templates/add-section/add-section.component').then(c=>c.AddSectionComponent),
  },
  {
    path: 'templates/:templateId/sections/update/:sectionId',
    loadComponent:() => import('./templates/add-section/add-section.component').then(c=>c.AddSectionComponent),
  },
  {
    path: 'templates/:templateId/sections/:sectionId',
    loadComponent:()=> import('./templates/section-view/section-view.component').then(c=>c.SectionViewComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:()=> import('./templates/section-overview/section-overview.component').then(c=>c.SectionOverviewComponent) },
      { path: 'questions', loadComponent:() => import('./templates/section-questions/section-questions.component').then(c=>c.SectionQuestionsComponent ) },
    ],
  },

  {
    path: 'templates/:templateId/sections/:sectionId/template-questions/add',
    loadComponent:()=>import('./templates/add-question/add-question.component').then(c=>c.AddQuestionComponent),
  },
  {
    path: 'templates/:templateId/sections/:sectionId/template-questions/update/:questionId',
    loadComponent:()=>import('./templates/add-question/add-question.component').then(c=>c.AddQuestionComponent),
  },

  {
    path: 'templates/:templateId/sections/:sectionId/template-questions/:questionId',
    loadComponent:()=> import('./templates/question-view/question-view.component').then(c=> c.TemplateQuestionViewComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'TEMPLATESSECTIONSQUESTIONS',
        action: 'VIEW',
      },
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:()=> import('./templates/question-overview/question-overview.component').then(c=>c.TemplateQuestionOverviewComponent) },
    ],
  },

  {
    path: 'instance',
    loadComponent:()=> import('./instance-list/instance-list.component').then(c=> c.InstanceListComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCE',
        action: 'VIEW',
      },
    },
  },
  {
    path: 'instance/add',
    loadComponent:()=> import('./modify-instance/modify-instance.component').then(c=>c.ModifyInstanceComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCE',
        action: 'ADD',
      },
    },
  },
  {
    path: 'instance/update/:instanceId',
    loadComponent:()=> import('./modify-instance/modify-instance.component').then(c=>c.ModifyInstanceComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCE',
        action: 'EDIT',
      },
    },
  },

  {
    path: 'instance/:instanceId',
    loadComponent:()=> import('./instance-view/instance-view.component').then(c=>c.InstanceViewComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCE',
        action: 'VIEW',
        sections: 'INSTANCESECTIONS',
        answers: 'INSTANCEANSWERS',
      },
    },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      { path: 'overview', loadComponent:()=> import('./instance-overview/instance-overview.component').then(c=>c.InstanceOverviewComponent)},
      {
        path: 'sections',
        loadComponent:()=> import('./instancte-sections/instancte-sections.component').then(c=>c.InstancteSectionsComponent),
        data: {
          permissions: {
            module: 'QUESTIONNAIRES',
            feature: 'INSTANCESECTIONS',
            action: 'VIEW',
          },
        },
      },
      {
        path: 'answers',
        loadComponent:()=> import('./answers-sections/answers-sections.component').then(c=>c.AnswersSectionsComponent),
        data: {
          permissions: {
            module: 'QUESTIONNAIRES',
            feature: 'INSTANCEANSWERS',
            action: 'VIEW',
          },
        },
      },
    ],
  },
  {
    path: 'instance/:instanceId/sections/add',
    loadComponent:()=> import('./modify-instance-section/modify-instance-section.component').then(c=>c.ModifyInstanceSectionComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCESECTIONS',
        action: 'ADD',
      },
    },
  },
  {
    path: 'instance/:instanceId/sections/update/:sectionId',
    loadComponent:()=> import('./modify-instance-section/modify-instance-section.component').then(c=>c.ModifyInstanceSectionComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCESECTIONS',
        action: 'EDIT',
      },
    },
  },
  {
    path: 'instance/:instanceId/sections/:sectionId',
    loadComponent:()=> import('./instance-section-view/instance-section-view.component').then(c=> c.InstanceSectionViewComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCESECTIONS',
        action: 'VIEW',
        questions: 'INSTANCESECTIONSQUESTIONS',
      },
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:()=> import('./instance-section-overview/instance-section-overview.component').then(c=>c.InstanceSectionOverviewComponent)},
      {
        path: 'questions',
        loadComponent:()=> import('./instance-questions/instance-questions.component').then(c=>c.InstanceQuestionsComponent),
        data: {
          permissions: {
            module: 'QUESTIONNAIRES',
            feature: 'INSTANCESECTIONSQUESTIONS',
            action: 'VIEW',
          },
        },
      },
    ],
  },
  {
    path: 'instance/:instanceId/sections/:sectionId/questions/add',
    loadComponent:()=> import('./add-instance-questions/add-instance-questions.component').then(c=>c.AddInstanceQuestionsComponent),
    data: {
      permissions: {
        module: 'QUESTIONNAIRES',
        feature: 'INSTANCESECTIONSQUESTIONS',
        action: 'ADD',
      },
    },
  },
  {
    path: 'instance/:instanceId/sections/:sectionId/questions/:questionId',
    loadComponent:()=> import('./view-instance-question/view-instance-question.component').then(c=>c.ViewInstanceQuestionComponent),
    data: {
      module: 'QUESTIONNAIRES',
      feature: 'INSTANCESECTIONSQUESTIONS',
      action: 'VIEW',
    },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:()=> import('./instance-question-overview/instance-question-overview.component').then(c=>c.InstanceQuestionOverviewComponent) },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './InstanceQuestionComments/InstanceQuestionComments.component'
          ).then((m) => m.InstanceQuestionCommentsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './InstanceQuestionOAttachments/InstanceQuestionOAttachments.component'
          ).then((m) => m.InstanceQuestionOAttachmentsComponent),
      },
    ],
  },
  {
    path: ':id/addQuestionAnswer',
    loadComponent: () =>
      import(
        './questionOverview/QuestionAnswer-Crud/addQuestionAnswer/addQuestionAnswer.component'
      ).then((m) => m.AddQuestionAnswerComponent),
  },
  {
    path: ':id/updateQuestionAnswer/:answerId',
    loadComponent: () =>
      import(
        './questionOverview/QuestionAnswer-Crud/addQuestionAnswer/addQuestionAnswer.component'
      ).then((m) => m.AddQuestionAnswerComponent),
  },

  {
    path: ':id/view/:answerId',
    loadComponent:()=> import('./questionOverview/QuestionAnswer-Crud/overview-questionAnswer/overview-questionAnswer.component').then(c=>c.OverviewQuestionAnswerComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent:()=> import('./questionOverview/QuestionAnswer-Crud/view-questionAnswer/view-questionAnswer.component').then(c=>c.ViewQuestionAnswerComponent)  },
      { path: 'comments', loadComponent:()=> import('./questionOverview/QuestionAnswer-Crud/comment-questionAnswer/comment-questionAnswer.component').then(c=>c.CommentQuestionAnswerComponent) },
      { path: 'attachments', loadComponent:()=> import('./questionOverview/QuestionAnswer-Crud/attachment-questionAnswer/attachment-questionAnswer.component').then(c=>c.AttachmentQuestionAnswerComponent) },
    ],
  },

  {
    path: 'my-questionnaires',
    loadComponent: () =>
      import('./my-questionnaires/my-questionnaires.component').then(
        (c) => c.MyQuestionnairesComponent
      ),
  },

  {
    path: 'my-questionnaires/:id',
    loadComponent: () =>
      import(
        './my-questionnaires/questionnaire-main/questionnaire-main.component'
      ).then((c) => c.QuestionnaireMainComponent),
  },
];
