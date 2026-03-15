import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../env/dev.env';
import { Observable } from 'rxjs';
import { IQuizSubmission } from '../types/quizSubmission.interface';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(private httpClient: HttpClient) {}

  getUserCampaigns(): Observable<any> {
    // /api/Awareness/external/Campaigns
    return this.httpClient.get(
      enviroment.API_URL + 'Awareness/external/Campaigns'
    );
  }

  getCampaignDetails(id: number): Observable<any> {
    // /api/Awareness/external/Campaign/{id}
    return this.httpClient.get(
      enviroment.API_URL + `Awareness/external/Campaign/${id}`
    );
  }

  submitQuiz(submission: IQuizSubmission): Observable<any> {
    // /api/Awareness/external/Acknowledgement
    return this.httpClient.post(
      enviroment.API_URL + 'Awareness/external/Acknowledgement',
      submission
    );
  }

  confirmRead(campaignId: number): Observable<any> {
    // /api/Awareness/external/ConfirmReading
    return this.httpClient.post(
      enviroment.API_URL + 'Awareness/external/ConfirmReading',
      { campaignId }
    );
  }

  getQuizQuestions(campaignId: number): Observable<any> {
    // /api/Awareness/external/Campaigns/{campaignId}/Questions
    return this.httpClient.get(
      enviroment.API_URL +
        `Awareness/external/Campaigns/${campaignId}/Questions`
    );
  }

  searchFiles(
    dataEntityId: number,
    dataEntityTypeId: number,
    myFiles: boolean = false,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    //  /api/File/SearchFiles
    const payload = {
      dataEntityId,
      dataEntityTypeId,
      myFiles,
      pageNumber,
      pageSize,
    };
    return this.httpClient.post(
      enviroment.API_URL + 'File/SearchFiles',
      payload
    );
  }

  getFiles(dataEnityId: number, dataEntityTypeId: number): Observable<any> {
    const payload = {
      dataEnityId,
      fileUsageTypeID:dataEntityTypeId,
      dataEntityTypeId

    }
    return this.httpClient.post(enviroment.API_URL + 'File/GetFiles',payload);
  }
}
