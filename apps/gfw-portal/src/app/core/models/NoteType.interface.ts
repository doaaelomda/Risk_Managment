export interface INote {
  govDocumentReviewCommentID: number;
  govDocumentReviewID: number;

  govDocumentElementID: number | null;
  govDocumentElementName: string | null;
  govDocumentElementDescription: string | null;

  commentText: string;

  govDocumentReviewCommentSeverityLevelID: number;
  severityLevelName: string;
  severityLevelColor: string;

  govDocumentReviewCommentStatusTypeID: number;
  statusTypeName: string;
  statusTypeColor: string;

  reviewCommentUserId: number;
  reviewCommentUserName: string;
  reviewCommentUserImage?: string;
  reviewCommentUserPosition?: string;

  resolvedDate: string;
}
