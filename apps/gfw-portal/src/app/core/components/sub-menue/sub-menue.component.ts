import { TranslationsService } from './../../services/translate.service';
import { Component , input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { sideBarLinks } from '../../models/sidebarLinks';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LayoutService } from '../../services/layout.service';


@Component({
  selector: 'app-sub-menue',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './sub-menue.component.html',
  styleUrl: './sub-menue.component.scss',
  animations: [
    trigger('submenue', [
      state('hidden', style({
        height: '0',
        opacity: '0',
        visibility: 'hidden' // Use visibility instead of display
      })),
      state('visible', style({
        height: '*',
        opacity: '1',
        visibility: 'visible'
      })),
      state('sideStateFalse', style({
        height: '*',
        opacity: '1',
        position: 'absolute',
        top: '0',
        left: '100%',
        backgroundColor: 'white',
        width:'250px'
      })),
      transition('visible <=> hidden', [
        animate('{{transitionParams}}') // Only animate height and opacity
      ]),
      transition('visible <=> sideStateFalse', [
        style({ position: 'absolute', top: '0', left: '100%', backgroundColor: 'white' }),
        animate('{{transitionParams}}') // Animate height and opacity
      ]),
      transition('sideStateFalse <=> hidden', [
        animate('{{transitionParams}}') // Animate height and opacity
      ])
    ])
  ]
})
export class SubMenueComponent implements OnChanges {
  constructor(private _TranslationsService:TranslationsService,private layoutService: LayoutService) {
    this.layoutService.sidebarState.subscribe((state) => {
      this.sideState = state;
    });


    this._TranslationsService.selected_lan_sub.subscribe((res:string)=>{
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res === 'ar' ? this.isAr.set(true) : this.isAr.set(false)
    })
  }
  currentItem = input<sideBarLinks>()

  sideState:boolean = true
  currentLink!: sideBarLinks;
  isAr = signal(false)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentItem']) {
      this.currentLink = changes['currentItem'].currentValue;
    }
  }
}
