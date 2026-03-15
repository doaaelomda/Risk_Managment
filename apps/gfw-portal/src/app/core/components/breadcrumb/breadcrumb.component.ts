import { SharedService } from './../../../../../../../libs/shared/shared-ui/src/services/shared.service';
import { Component, inject, signal } from '@angular/core';
import { Breadcrumb } from '../../models/breadcrumb.model';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'libs/features/auth/src/services/auth.service';
@Component({
  selector: 'app-breadcrumb',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  direction: 'rtl' | 'ltr';
  constructor(private _AuthService:AuthService,private _LayoutService:LayoutService,private _TranslateService: TranslateService,private _sharedService:SharedService){
    this._AuthService.handleLogin()
    this._LayoutService.breadCrumbLinks.subscribe((res:Breadcrumb[])=>{
      this.bread_crumb_links.set(res)
      console.log("bread res" , res);
    })
    this.direction = this._TranslateService.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._LayoutService.breadCrumbAction.subscribe((res:any)=>{
      this.action_btn.set(res)
      this.items = this.action_btn()?.items
    })
  }
  bread_crumb_links= signal<Breadcrumb[]>([]);

  items:any[]=[]

  action_btn = signal<any>(null)

  truncate(name: string): string {
  return this._sharedService.truncateWords(name, 3);
}
}
