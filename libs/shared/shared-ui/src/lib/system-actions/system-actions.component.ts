import { Component, input, OnInit, ChangeDetectionStrategy, effect, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { colorDashboard } from 'apps/gfw-portal/src/app/core/models/colorDashboard.interface';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'lib-system-actions',
  imports: [CommonModule, TooltipModule,ButtonModule, DialogModule, TranslateModule],
  templateUrl: './system-actions.component.html',
  styleUrl: './system-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemActionsComponent  {
  private actionColors: Record<string, string> = {
    underReview: 'SkyBlue',
    approve: 'Green',
    draft: 'DodgerBlue',
    close: 'Red',
  };
  private actionIcons: Record<string, string> = {
    send: 'fi fi-rr-paper-plane',
    'check-circle': 'fi fi-rr-check',
    'x-circle': 'fi fi-rr-cross',
    close: 'fi fi-rr-lock',
  };

  constructor(
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _ChangeDetectorRef:ChangeDetectorRef
  ) {
    this.colorsLookup = this._SharedService.colorsDashboard;

    // Use effect to react to input changes instead of ngOnInit
    effect(() => {
      this.getSystemActons();
      if(this.isWF()){
        this.getWFActions()
      }
    });
  }



  foundActionEmitter = output<boolean>()

  currentActions: any[] = [];

  currentWFActions:any[]=[]


  getWFActions(){
    this._SharedService.getWFActionsSystem(this.entityId(), this.dataEntityTypeId()).subscribe({
      next:(res:any)=>{
        this.currentWFActions = res?.data?.map((item: any) => {
            return {
              ...item,
              color:  this.actionColors[item.code] ? 'btn-'+ this.actionColors[item.code] : 'btn-Teal',
              icon: this.actionIcons[item.icon] || 'fi fi-rr-box',
              isLoading:false
            };
          });


          this._ChangeDetectorRef.markForCheck()
          if(this.currentWFActions.length == 0 && this.currentActions.length == 0 ) this.foundActionEmitter.emit(false)

      }
    })
  }

  getSystemActons() {
    this._SharedService
      .getDataEntityActions(this.dataEntityTypeId(), this.entityId())
      .subscribe({
        next: (res: any) => {
          this.currentActions = res?.data?.map((item: any) => {
            return {
              ...item,
              color: this.actionColors[item.code] ? 'btn-'+ this.actionColors[item.code] : 'btn-Purple',
              icon: this.actionIcons[item.icon] || 'fi fi-rr-box',
              isLoading:false
            };
          });
          console.log('System Actions', this.currentActions);

          this._ChangeDetectorRef.markForCheck();
          if(this.currentActions.length == 0 && !this.isWF()) this.foundActionEmitter.emit(false);
        },
      });


  }
  colorsLookup: colorDashboard[] = [];
  dataEntityTypeId = input.required<number>();
  isWF = input<boolean>(false)
  entityId = input.required<number>();

  visibleConfirm: boolean = false;
  reloadDelay: number = 3;
  selectedAction!: any;
  handleActionClick(action: any) {
    if (action.hasDeclaration) {
      this.selectedAction = action;
      this.visibleConfirm = true;
      return;
    }
    this.callBack(action);
  }
  isExecutingAction: boolean = false;
  cannotDoAnotherAction:boolean = false
  callBack(action: any) {
    if (!action.callBackAPI || this.cannotDoAnotherAction || action.isLoading || this.isExecutingAction) return;
    action.isLoading  = true
    this.isExecutingAction = true;
    let APICALLBACK: string = action.callBackAPI;
    APICALLBACK = APICALLBACK.replace('{id}', this.entityId().toString());
    APICALLBACK = APICALLBACK.replace('{actionCode}', action?.code);

    console.log('APICALL', action);
    this._SharedService
      .handleSystemActions(APICALLBACK.substring(1))
      .pipe(finalize(() => (this.isExecutingAction = false)))
      .subscribe({
        next: (res: any) => {
          this.cannotDoAnotherAction = true
          action.isLoading  = false
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Success! The page will refresh in ${this.reloadDelay} seconds.`,
          });
        },
        error:(err:any)=>{
   this.cannotDoAnotherAction = true
          action.isLoading  = false
        },
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, this.reloadDelay * 1000);
        },
      });
  }



  handleWFAction(action:any){
    //

    if ( this.cannotDoAnotherAction || action.isLoading || this.isExecutingAction) return;
    action.isLoading  = true
    this.isExecutingAction = true;

    this._SharedService.handleExcuteWFAction(this.dataEntityTypeId(), this.entityId() , action?.wfDecisionID).subscribe({
      next:(res:any)=>{
        this.cannotDoAnotherAction = true
          action.isLoading  = false
                   this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Success! The page will refresh in ${this.reloadDelay} seconds.`,
          });
      },
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, this.reloadDelay * 1000);
        }
    })

  }
}
