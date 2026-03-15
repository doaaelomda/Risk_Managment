import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";
import { NotificationService } from '../../services/notification.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-notification-toast',
  imports: [CommonModule, ToastModule],
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss',
})
export class NotificationToastComponent  {

  message:any;

  constructor(private _MessageService:MessageService,private _NotificationService:NotificationService){
    effect(()=>{
      //

      const notification = this._NotificationService.notificationSig()


      if(notification){
        console.log("Notification From Toast" , notification);
        this.message = notification;
        this._MessageService.add({key:'notification-toast'  , summary:notification?.title , detail:notification?.content})
      }

    })
  }



}
