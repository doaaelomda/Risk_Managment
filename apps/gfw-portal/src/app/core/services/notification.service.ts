/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { AuthService } from 'libs/features/auth/src/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  public notificationSig = signal<any>(null);

  constructor(private _HttpClient: HttpClient , private _AuthService:AuthService) {
    //
  }

  public startConnection(): void {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(enviroment.DOMAIN_URI+`hubs/notifications`, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        withCredentials: false,
        accessTokenFactory:()=> JSON.parse(`${localStorage.getItem('userData')}`)?.accessToken
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Error)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        // console.log('Hub Connection started');
        this.listenToNotifications();
      })
      .catch((err) => {
        // console.log('Error connecting to Hub', err);
      });
  }

  private listenToNotifications(): void {
    this.hubConnection.on('ReceiveNotification', (data: any) => {
      // console.log('Notification Received:', data);

      this.notificationSig.set(data);
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      // console.log('Hub Connection stopped');
    }
  }

  getNotificationsMessages(
    pageNumber: number,
    pageSize: number,
    filter: number = 1
  ): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Notifications/NotificationMessage`,
      { pageNumber, pageSize, filter }
    );
  }

  turnOnNotification(): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + `Notifications/SendNotificatoinInstanceMessage`,
      null
    );
  }

  readNotification(
    notificationMessageID: number,
    userId: number
  ): Observable<any> {
    const data = {
      notificationMessageID,
      userId,
    };

    return this._HttpClient.put(
      enviroment.API_URL + `Notifications/read`,
      data
    );
  }
  getEventById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Notifications/NotificationEvent/${id}`
    );
  }
}
