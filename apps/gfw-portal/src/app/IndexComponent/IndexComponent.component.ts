import { TranslationsService } from './../core/services/translate.service';
/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { LayoutService } from '../core/services/layout.service';
import { IdleService } from '../core/services/idle.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-index-component',
  standalone: false,
  templateUrl: './IndexComponent.component.html',
  styleUrl: './IndexComponent.component.scss',
  animations: [
    trigger('overlay', [
      state('show', style({
        position: 'fixed',
        left: '0',
        display: 'block'
      })),
      state('hide', style({
        position: 'fixed',
        // left: '-100%'
      })),
      transition('show <=> hide', [
        style({})
        , animate('{{transitionParams}}'),
        transition('void => *', animate(0))
      ])
    ])
  ]
})
export class IndexComponentComponent implements OnInit  {
  constructor(private _Router:Router,private _IdleService:IdleService,private _TranslationsService:TranslationsService,private _LayoutService:LayoutService) {
    this._LayoutService.sidebarState.subscribe((res: boolean) => {
      this.sideBarState.set(res)
    })
    this._LayoutService.overlayStatus.subscribe((res: boolean) => {
      this.isOverLay.set(res)
    })



    this._LayoutService.showGlobalLoader.subscribe((res:boolean)=>{
      this.isShowGlobalLoader.set(res)
    })



    this._TranslationsService.selected_lan_sub.subscribe((res:string)=>{
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res === 'ar' ? this.isAr.set(true) : this.isAr.set(false)
    })
  }



  isShowGlobalLoader = signal<boolean>(false)
  isOverLay = signal<boolean>(false)

  ngOnInit(): void {
    this._IdleService.idleState$.subscribe((res)=>{
           if (res) {
            console.log('User is now idle.');
            localStorage.clear()
            this._Router.navigate(['/auth'])
          } else {
            console.log('User is active again.');
          }
    })


    if (window.innerWidth > 640 && window.innerWidth < 960) {
      this._LayoutService.sidebarState.next(false)
    } else {
      this._LayoutService.sidebarState.next(true)
    }
  }
  isAr = signal(false)

  sideBarState= signal(false)


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const windowWidth = event.target.innerWidth
    if (windowWidth < 960 && !this.isOverLay()) {
      this._LayoutService.sidebarState.next(false)
    }

    if (windowWidth > 960) {
      this._LayoutService.sidebarState.next(true)
    }

    if (windowWidth >= 640) {
      this._LayoutService.overlayStatus.next(false)
    }


  }



  handleCloseOverlay(){
    this._LayoutService.overlayStatus.next(false)
  }

}
