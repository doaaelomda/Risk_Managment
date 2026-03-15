/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { take, mergeMap, of, EMPTY } from 'rxjs';

export const dataQuestionnaireResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {

  const layoutS$ = inject(LayoutService)
  const passed_data: any = { ...route.data };
  const currentEntityId = route.parent?.paramMap.get(passed_data.paramName) || route.paramMap.get(passed_data.paramName)


  passed_data['entityId'] = currentEntityId;
  // id
  //  url
  const breadCrumbLinks = layoutS$.breadCrumbLinks.value;
  passed_data['current_breadCrumb'] = breadCrumbLinks;
  console.log("passed_data from resolver", passed_data);
  console.log(route.parent?.paramMap ,'resssssssssssssss');
  console.log(route.paramMap ,'resssssssssssssss');


// Risk Management



  return passed_data;
};
