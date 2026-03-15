import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// Shared UI Components
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { QuestionService } from '../../Service/question.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-question-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    InputNumberComponent,
    TreeSelectUiComponent
  ],
  templateUrl: './questionAction.component.html',
  styleUrl: './questionAction.component.scss',
})
export class QuestionActionComponent implements OnInit, OnDestroy {
  // ====================== Declaration Variables ======================
  question_form!: FormGroup;
  isLoading = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];

  // ====================== Lookup Data ======================
  questionTypes: any[] = [];
  requiredArray: any[] = [];
  breadCrumb: any[] = [];
  current_update_id: any;

  private subscription: Subscription = new Subscription();

  // ====================== Constructor ======================
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _QuestionService: QuestionService,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  // ====================== Breadcrumbs ======================
  private initBreadcrumbs(): void {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.QUESTION_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/questionnaire/questions-list',
      },
      { name: '-', icon: '' },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }

  // ====================== Lookup Data ======================
  organizationUnitOptions:any
  private loadLookups(): void {
    // ====================== handle Lookups Translation ======================
    this.requiredArray = [
      { id: true, label: this._TranslateService.instant('ATTACHMENT.YES') },
      { id: false, label: this._TranslateService.instant('ATTACHMENT.NO') },
    ];
    const sub = this._SharedService.lookUps([200,239]).subscribe((res: any) => {
      this.questionTypes = res?.data?.QuestionnaireQuestionType ?? [];
      this.categories = res?.data?.QuestionnaireQuestionCategory ?? [];
    });
    this.subscription.add(sub);

          const org = this._SharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.organizationUnitOptions = this.transformNodes(res?.data);
        },
      });

  }
    transformNodes(nodes: any[], parentKey: string = ''): any[] {
      return nodes.map((node, index) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`;
        const isLeaf = !node.children || node.children.length === 0;
        return {
          key,
          id: node.id,
          label: node.label,
          children: node.children ? this.transformNodes(node.children, key) : [],
        };
      });
    }
  // ====================== Route Params Handling ======================
  private handleRouteParams(): void {
    const sub = this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params: any) => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name =
              this._TranslateService.instant('QUESTION.ADD_QUESTION');
            return of(null);
          }
          this.current_update_id = id;
          return this._QuestionService.getQuestionById(id).pipe(
            map((res: any) => {
              if (res?.data) {
                this.breadCrumb[this.breadCrumb.length - 1].name =
                  res.data.questionText;
                return res.data;
              }
              return null;
            })
          );
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.initQuestionForm(res);
        }
      });
    this.subscription.add(sub);
  }

  // ====================== Form Initialization ======================
  private initQuestionForm(data?: any): void {
    this.question_form = new FormGroup({
      questionText: new FormControl(data?.questionText, Validators.required),
      questionTextAr: new FormControl(data?.questionTextAr),
      questionnaireQuestionTypeID: new FormControl(
        data?.questionnaireQuestionTypeID,
        Validators.required
      ),
      isRequired: new FormControl(data?.isRequired, Validators.required),
      weight: new FormControl(data?.weight),
      organizationalUnitID: new FormControl(data?.organizationalUnitID),
      questionnaireQuestionCategoryID:new FormControl(data?.categoryID)
    });
          if(data && data?.organizationalUnitID){
        this._SharedService.orgainationalUnitLookUp().subscribe((res:any)=>{

          const id = this.findNodeById(this.transformNodes(res?.data) , data?.organizationalUnitID );
          this.question_form.get('organizationalUnitID')?.setValue(id);
          this.question_form.updateValueAndValidity()
        })

      }
  }
  categories:any[] = []
  findNodeById(tree: any[], id: number): any {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  // ====================== Form Submission ======================
  submit(): void {
        const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.question_form.invalid) {
      this.question_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = { ...this.question_form.value };
    if (this.current_update_id)
      req.questionnaireQuestionID = this.current_update_id;
    console.log(req.organizationalUnitID,'req.organizationalUnitID');

      req.organizationalUnitID = Array.isArray(req.organizationalUnitID)
        ? req.organizationalUnitID[0]?.id ?? null
        : req.organizationalUnitID?.id ?? null;
    const request$ = this.current_update_id
      ? this._QuestionService.updateQuestion(req)
      : this._QuestionService.addQuestion(req);

    const sub = request$.subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_update_id
            ? this._TranslateService.instant('QUESTION.UPDATED_SUCCESS')
            : this._TranslateService.instant('QUESTION.ADDED_SUCCESS'),
        });
        this._Router.navigate(['/gfw-portal/questionnaire/questions-list']);
      },
      complete: () => (this.isLoading = false),
    });
    this.subscription.add(sub);
  }
  // ====================== Lifecycle Hooks ======================
  ngOnInit(): void {
    this.initBreadcrumbs();
    this.loadLookups();
    this.initQuestionForm();
    this.handleRouteParams();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up all subscriptions
  }
}
