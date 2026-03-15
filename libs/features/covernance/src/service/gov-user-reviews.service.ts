import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GovUserReviewsService {
  constructor(private httpClient: HttpClient) {}

  getReviewDetails(id: number): Observable<unknown> {
    return this.httpClient.get(enviroment.API_URL + `Gov/Review/${id}`);
  }
  getApprovalDetails(id: number): Observable<unknown> {
    return this.httpClient.get(enviroment.API_URL + `Gov/Approval/${id}`);
  }
  getFiles(
    dataEnityId: number,
    dataEntityTypeId: number,
    fileUsageTypeID: number
  ): Observable<unknown> {
    const payload = {
      dataEnityId,
      fileUsageTypeID,
      dataEntityTypeId,
    };
    return this.httpClient.post(enviroment.API_URL + 'File/GetFiles', payload);
  }

  getFullText(id: number): Observable<unknown> {
    return this.httpClient.get(
      enviroment.API_URL + `Gov/Version/Content/${id}`
    );
  }

  submitComment(comment: {
    govDocumentReviewID: number;
    govDocumentElementID: number;
    commentText: string;
    govDocumentReviewCommentSeverityLevelID: number;
    govDocumentReviewCommentStatusTypeID: number;
    resolvedDate: string;
  }): Observable<unknown> {
    return this.httpClient.post(
      enviroment.API_URL + 'Gov/ReviewComment',
      comment
    );
  }

  getTree(id: number): Observable<unknown> {
    return this.httpClient.get(enviroment.API_URL + `Gov/Element/tree/${id}`);
  }

  getComments(
    govDocumentReviewID: number,
    govDocumentVersionID: number
  ): Observable<unknown> {
    return this.httpClient.post(
      enviroment.API_URL + 'Gov/ReviewComment/Search',
      {
        govDocumentReviewID,
        govDocumentVersionID,
        pageNumber: 1,
        pageSize: 9999,
      }
    );
  }

  submitFeedback(
    govDocumentReviewID: number,
    overallFeedback: string
  ): Observable<unknown> {
    return this.httpClient.put(enviroment.API_URL + 'Gov/ReviewChange', {
      govDocumentReviewID,
      overallFeedback,
    });
  }

  submitApproval(approval: any): Observable<unknown> {
    console.log(approval,'approval from service');

    return this.httpClient.post(
      enviroment.API_URL + 'Gov/FinalApprove',
      approval
    );
  }
}
