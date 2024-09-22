export interface UploadedFiles {
  name: string;
  size: number;
  type: string
  id?: string;
  allowDownloads: boolean;
  status: string;
}
