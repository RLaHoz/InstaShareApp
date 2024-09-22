import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/files/upload`, formData);
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/download/${fileId}`, { responseType: 'blob' });
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/files/delete/${fileId}`);
  }

  getAllUserFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/user-files`).pipe(
      map((filesList: any) => filesList.map((file: any) => {
        return {
            id: file._id,
           status: file.status,
           name: file.compressedName,
           size: file.size,
           allowDownloads: file.status === 'completed'
        }
      }))
    );
  }

  getFileStatus(fileId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/files/status/${fileId}`);
  }

  alternativeUploadFile(file:File){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/files/upload`, formData).pipe(
      switchMap((result: any) => {
        const id = result.file.id;
        return this.getFileStatus(id).pipe(
          map((data) => {
            return data
          })
        );
      })
    );
  }
}
