import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxFileDropEntry } from 'ngx-file-drop';
// import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { UploadedFiles } from 'src/app/models/uploadedFiles';
import { FileService } from 'src/app/services/files/file.service';

import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-files-dashboard',
  templateUrl: './files-dashboard.component.html',
  styleUrls: ['./files-dashboard.component.scss']
})
export class FilesDashboardComponent implements OnInit, OnDestroy {
  private socketSubscription!: Subscription;
  private subscriptions: Subscription = new Subscription();

  @ViewChild('fileInput') fileInput!: ElementRef;
  public files: NgxFileDropEntry[] = [];
  loading$ = this.loadingService.loading$;
  public uploadedFiles: UploadedFiles[] = [];

  constructor(
    private fileService: FileService,
    // private socket: Socket,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listenToFileStatusUpdates();
    this.getAllUserFiles();
  }

  public openFileBrowser(event: Event) {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const fileUploadSub = this.fileService.alternativeUploadFile(file).subscribe(
        (data: any) => {
          this.uploadedFiles.push({
            name: data.compressedName,
            size: file.size,
            type: file.type,
            id: data.fileId,
            allowDownloads: data.status === 'completed',
            status: data.status,
          });
        },
        (error) => {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
      );

      this.subscriptions.add(fileUploadSub);
    }
  }

  listenToFileStatusUpdates() {
    // Socket subscription for real-time file compression updates
    // this.socketSubscription = this.socket.on('fileCompressed', (data: any) => {
    //   this.updateFileToNewStatus(data.fileId, data.status, data.name);
    // });
  }

  downloadFile(file: any): void {
    const downloadSub = this.fileService.downloadFile(file.id).subscribe(
      (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'compressed-file.zip';
        link.click();
      },
      (error) => {
        console.error('Error downloading the file:', error);
      }
    );

    this.subscriptions.add(downloadSub);
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: any) => {
          this.uploadedFiles.push({
            name: file.name,
            size: file.size,
            allowDownloads: false,
            type: file.type,
            status: file.status,
          });
        });
      }
    }
  }

  public updateFileToNewStatus(fileId: string, status: string, name: string) {
    const file = this.uploadedFiles.find(f => f.id === fileId);
    if (file) {
      file.status = status;
      file.name = name;
      file.allowDownloads = true;
    }
  }

  getAllUserFiles(): void {
    const userFilesSub = this.fileService.getAllUserFiles().subscribe(
      (response) => {
        this.uploadedFiles = response;
      },
      (error) => {
        console.error('Error fetching files:', error);
      }
    );

    this.subscriptions.add(userFilesSub);
  }

  deleteFile(file: any): void {
    if (confirm('Are you sure? This cannot be undone')) {
      const { id } = file;
      const deleteFileSub = this.fileService.deleteFile(id).subscribe(
        (response: any) => {
          const pos = this.uploadedFiles.findIndex((upFile: UploadedFiles) => upFile.id === file.id);
          this.uploadedFiles.splice(pos, 1);
        },
        (error: Error) => {
          console.error('Error deleting file:', error);
        }
      );

      this.subscriptions.add(deleteFileSub);
    }
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      //this.socket.removeAllListeners('fileCompressed');
      this.socketSubscription.unsubscribe();
    }
    this.subscriptions.unsubscribe();
  }
}
