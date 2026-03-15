import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { CurrencyInputComponent } from '@gfw/shared-ui';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import {TasksService} from '../../services/tasks.service';
import { RoleDropdownComponent } from '@gfw/shared-ui';
import {MessageService}from 'primeng/api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-projects-action',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    InputNumberComponent,
    TextareaUiComponent,
    CurrencyInputComponent,
    TranslateModule,
    RoleDropdownComponent
  ],
  templateUrl: './projects-action.component.html',
  styleUrl: './projects-action.component.scss',
})
export class ProjectsActionComponent implements OnInit {
  constructor(private _Router:Router,private _MessageService:MessageService,private _SharedService:SharedService,
    private _LayoutService:LayoutService , private _ActivatedRoute:ActivatedRoute , private _TasksService:TasksService,
  private _permissionService: PermissionSystemService) {
  }
  projectForm!: FormGroup;
  current_updated_id:any;
  initiatives: any[] = [];
  managerRoles: any[] = [];
  statusTypes: any[] = [];
  priorityLevels: any[] = [];
  updateFlag = false;
  ngOnInit(): void {
        this.initProjectForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.pipe(
      switchMap((param)=>{
        const id = param.get('id');
        if(!id) { this.updateFlag = false; this._LayoutService.breadCrumbLinks.next(this.breadCrumb)   ;return []};

        this.updateFlag = true;
        this.current_updated_id = id;
        this._LayoutService.breadCrumbLinks.next(this.breadCrumb)   ;
        return this._TasksService.getProjectById(id)

      })
    ).subscribe((res)=>{
      if(res?.data) this.initProjectForm(res.data);
    })


  }


    breadCrumb: any[] = [
           {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/'
        },
        {
          name: 'Management',
          icon: '',
          routerLink: '/gfw-portal/management'
        },
        {
          name: 'Projects',
          icon: '',
          routerLink: '/gfw-portal/management/projects'
        },
        {
             name: this.updateFlag ? 'Update Project' : 'Add Project ',
          icon: '',
          routerLink: '/gfw-portal/management/projects'
        }
  ];

initProjectForm(data?: any) {
  this.projectForm = new FormGroup({
    name: new FormControl(data?.name || '', Validators.required),
    nameAr: new FormControl(data?.nameAr || '', Validators.required),
    description: new FormControl(data?.description || ''),
    descriptionAr: new FormControl(data?.descriptionAr || ''),
    initiativeID: new FormControl(data?.initiativeID || null, Validators.required),

    startDate: new FormControl(
      data?.startDate ? moment(new Date(data?.startDate)).format('MM-DD-YYYY') : null,
      Validators.required
    ),
    endDate: new FormControl(
      data?.endDate ? moment(new Date(data?.endDate)).format('MM-DD-YYYY') : null,
      Validators.required
    ),

    budget: new FormControl(data?.budget ?? null, [
      Validators.required,
      Validators.min(0),
    ]),

    projectManagerRoleID: new FormControl(data?.projectManagerRoleID || null, Validators.required),
    projectStatusTypeID: new FormControl(data?.projectStatusTypeID || null, Validators.required),
    projectPriorityLevelTypeID: new FormControl(data?.projectPriorityLevelTypeID || null, Validators.required),

    progressPercentage: new FormControl(
      data?.progressPercentage ?? 0,
      [Validators.required, Validators.min(0), Validators.max(100)]
    ),
  });
}


  loadLookups() {


    forkJoin([this._SharedService.lookUps([128,120,121]) , this._SharedService.getRoleLookupData()]).subscribe({
      next:(res:any[])=>{
        if(res){
          this.initiatives = res[0]?.data?.Initiative || [];
          this.statusTypes = res[0]?.data?.ProjectStatusType || [];
          this.priorityLevels = res[0]?.data?.ProjectPriorityLevelType || [];

          this.managerRoles = res[1]?.data || [];
        }
      }
    })
  }

  isLoading:boolean = false;

  submit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
              // ===== Permissions =====
  const hasPermission = this.current_updated_id
    ? this._permissionService.can('MANAGEMENT' , 'PROJECTS', 'EDIT')
    : this._permissionService.can('MANAGEMENT' , 'PROJECTS', 'ADD');

  if (!hasPermission) {
    return;
  }

    this.isLoading = true;
    const req = {
      ...this.projectForm.value ,
      startDate : moment(this.projectForm.get('startDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
      endDate : moment(this.projectForm.get('endDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
    };


    if(this.current_updated_id){
      req['projectID'] = this.current_updated_id;
    }


    const API$ = this.updateFlag ? this._TasksService.updateProject(req) : this._TasksService.addNewProject(req);


    API$.pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
      this._MessageService.add({ severity: 'success', summary: 'Success', detail: this.updateFlag ? 'Project Updated Successfully' : 'Project Added Successfully ' })
      this._Router.navigate(['/gfw-portal/management/projects'])
    })
  }
}
