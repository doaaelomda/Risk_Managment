import { IAction } from './../../../../../../apps/gfw-portal/src/app/core/models/action.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyQuestionnairesService } from '../services/my-questionnaires.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-my-questionnaires',
  imports: [CommonModule, NewTableComponent, TranslateModule],
  templateUrl: './my-questionnaires.component.html',
  styleUrl: './my-questionnaires.component.scss',
})
export class MyQuestionnairesComponent {
  constructor(
    private translateService: TranslateService,
    private myQService: MyQuestionnairesService,
    private layoutService: LayoutService,
    private router: Router,
    private sharedService:SharedService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.setActions();
    this.setBreadCrumb();
  }

  setActions() {
    this.actions = [
      {
        id: 1,
        label: this.translateService.instant(
          'MY_QUESTIONNAIRES.ANSWER_QUESTIONNAIRE'
        ),
        command: () => {
          this.router.navigateByUrl(
            `/gfw-portal/questionnaire/my-questionnaires/${this.selected_row}`
          );
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'MYQUESTIONNAIRES' , 'VIEW')

      },
    ];
  }

  loading: boolean = false;
  data: unknown[] = [];
  handleDataTable(payload: unknown) {
    this.getData(payload);
  }
paginationObj:any
  getData(payload: unknown) {
    this.loading = true;
    this.myQService
      .getMyQuestionnaires(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'items' in res.data
          )
            this.data = res.data.items as [];
                this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.paginationObj);
          console.log(res, 'got my questionnaires');
        },
      });
    console.log(payload, 'table payload here...');
  }
  actions: any[] = [];
  selected_row!: number;
  setSelected(event: number) {
    this.selected_row = event;
    console.log(event, 'Selected');
  }

  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/questionnaire/my-questionnaires',
  };

  setBreadCrumb() {
    const breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this.translateService.instant('BREAD_CRUMB_TITLES.QUESTIONNAIRE'),
        icon: '',
        routerLink: '/gfw-portal/questionnaire',
      },
      {
        name: this.translateService.instant('MY_QUESTIONNAIRES.TABLE_TITLE'),
        icon: '',
        routerLink: '',
      },
    ];
    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
