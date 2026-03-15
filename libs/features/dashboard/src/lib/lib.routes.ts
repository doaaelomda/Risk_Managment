/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { questionnaireRoutes } from 'libs/features/questionnaire/src/lib/lib.routes';

export const dashboardRoutes: Route[] = [
  { path: '', redirectTo: 'risks-management', pathMatch: 'full' },
  // eslint-disable-next-line @nx/enforce-module-boundaries
  {path:'risks-management' , loadChildren: () => import('@gfw/risks').then(m => m.risksRoutes) },
  {path:'governance' , loadChildren:()=> import('../../../covernance/src/index').then(m => m.covernanceRoutes)},
  {path:'setting' , loadChildren:()=>import('../../../setting/src/index').then(lib => lib.settingRoutes)},
  {path:'compliance' , loadChildren:()=>import('../../../compliance/src/index').then(lib => lib.complianceRoutes)},
  {path:'management' , loadChildren:()=>import('../../../Management/src/index').then(lib => lib.managementRoutes)},
  {path:"assets", loadChildren:()=> import('../../../Assets/src/index').then(lib => lib.assetsRoutes)},
  {path:"indicators" , loadChildren:()=> import('../../../indicators/src/index').then(lib => lib.indicatorsRoutes)},
  {path:'esclation' , loadChildren:()=> import('../../../esclation/src/index').then(lib => lib.esclationRoutes) },
  {
    path:'strategy',
    loadChildren: () => import('../../../strategy/src/index').then(m => m.strategyRoutes)
  },
  {
    path:'incident',
    loadChildren: () => import('../../../incident/src/index').then(m => m.incidentRoutes)
  },
  {
    path:'third-party',
    loadChildren:()=> import('../../../third-party/src/index').then (m => m.thirdPartyRoutes)
  },
  {
    path:"BPM",
    loadChildren:()=> import('../../../BPM/src/index').then(m=>m.bPMRoutes)
  },
  {
    path:'Threats-management',
    loadChildren:()=> import('../../../threats/src/index').then(m => m.threatsRoutes)
  },
  {
    path:'vulnerability',
    loadChildren:()=> import('../../../Vulnerability/src/index').then(m => m.vulnerabilityRoutes)
  },
  {
    path:'meetings',
    loadChildren:()=> import('../../../meetting/src/index').then(m => m.meettingRoutes)
  },
   {
    path:'questionnaire',
    loadChildren:()=> import('../../../questionnaire/src/index').then(m => m.questionnaireRoutes)
  },
  {
    path:'awareness',
    loadChildren:()=>import('../../../awareness/src/index').then(m => m.awarenessRoutes)
  },
  {path:'library',loadChildren:()=> import('../../../standard-docs/src/index').then(m => m.standardDocsRoutes)}
];
