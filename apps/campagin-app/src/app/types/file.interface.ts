export interface IFile {
  createdBy: number;
  createdDate: string;
  fileUsageID: number;
  fileID: number;
  fileTitle: string;
  fileUrl: string;
  fileSize: number;
  uploadDateTime: string | null;
  fileExtension: string;
  dataClassificationName: string;
  fileUsageTypeName: string;
  isVisibleInSearch: boolean;
  fileTypeName: string;
  fileGroupTypeID: number;
  username: string | null;
  roleName: string | null;
  updatedBy: number | null;
  updatedDate: string | null;
}
