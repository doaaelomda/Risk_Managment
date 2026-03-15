import { TranslationsService } from './../../services/translate.service';
import { Component, input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { sideBarLinks } from '../../models/sidebarLinks';
import { LayoutService } from '../../services/layout.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-single-item',
  templateUrl: './sidebar-single-item.component.html',
  styleUrl: './sidebar-single-item.component.scss',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone:false
})
export class SidebarSingleItemComponent implements OnChanges {
  constructor(private _router:Router,private _TranslationsService:TranslationsService,private layoutService: LayoutService) {
    this.layoutService.sidebarState.subscribe((state) => {
      this.sidebarState.set(state);
    });


    this._TranslationsService.selected_lan_sub.subscribe((res:string)=>{
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res === 'ar' ? this.isAr.set(true) : this.isAr.set(false)
    })

  }
    @ViewChild('menu') menu: any;

  menuItems: MenuItem[] = [];
  isAr = signal(false)
  currentItem = input<sideBarLinks>()
  sideBarLinks = input<sideBarLinks[]>()

  sidebarState = signal<boolean>(false);

  currentLink!: sideBarLinks;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentItem']) {
      this.currentLink = changes['currentItem'].currentValue;

    this.menuItems = (this.currentLink?.children || []).map((child: any) => ({
       label: this.isAr() ? child.nameAR : child.name,
       icon: child.icon ?? '',
      command: () => {
        if (child.link && child.link.length) {
          this._router.navigateByUrl(child.link);         }
       }
     }));

    }



  }

  handleexpanded(link:sideBarLinks) {
    this.sideBarLinks()?.forEach((item) => {
      if (item !== link) {
        item.expand = false;
      }
    });
    link.expand = !link.expand;
  }
}
