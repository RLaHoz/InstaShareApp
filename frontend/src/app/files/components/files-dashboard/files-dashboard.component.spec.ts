import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilesDashboardComponent } from './files-dashboard.component';
import { FileService } from 'src/app/services/files/file.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { SharedModule } from 'src/app/shared/shared.module';

describe('FilesDashboardComponent', () => {
  let component: FilesDashboardComponent;
  let fixture: ComponentFixture<FilesDashboardComponent>;
  let fileService: jasmine.SpyObj<FileService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const fileServiceSpy = jasmine.createSpyObj('FileService', ['getAllUserFiles', 'alternativeUploadFile', 'downloadFile', 'deleteFile']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['loading$']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    fileServiceSpy.getAllUserFiles.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ FilesDashboardComponent ],
      imports: [SharedModule, NgxFileDropModule],
      providers: [
        { provide: FileService, useValue: fileServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fileService = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should call getAllUserFiles', () => {
      const getAllUserFilesSpy = spyOn(component, 'getAllUserFiles');
      component.ngOnInit();
      expect(getAllUserFilesSpy).toHaveBeenCalled();
    });
  });

  describe('#onFileSelected', () => {
    it('should handle file selection and upload', () => {
      const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
      const event = {
        target: { files: [mockFile] }
      } as any;

      fileService.alternativeUploadFile.and.returnValue(of({ compressedName: 'example.zip', fileId: '123', status: 'completed' }));

      component.onFileSelected(event);

      expect(fileService.alternativeUploadFile).toHaveBeenCalledWith(mockFile);
      expect(component.uploadedFiles.length).toBe(1);
    });

    it('should show error message if upload fails', () => {
      const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
      const event = {
        target: { files: [mockFile] }
      } as any;

      fileService.alternativeUploadFile.and.returnValue(throwError('Error'));

      component.onFileSelected(event);

      expect(snackBar.open).toHaveBeenCalledWith('Error', 'Close', { duration: 5000 });
    });
  });

  describe('#downloadFile', () => {
    it('should handle file download', () => {
      const mockBlob = new Blob(['dummy content'], { type: 'application/zip' });
      fileService.downloadFile.and.returnValue(of(mockBlob));

      const mockFile = { id: '123' };
      component.downloadFile(mockFile);

      expect(fileService.downloadFile).toHaveBeenCalledWith('123');
    });

    it('should log an error if download fails', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      fileService.downloadFile.and.returnValue(throwError('Error'));

      const mockFile = { id: '123' };
      component.downloadFile(mockFile);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error downloading the file:', 'Error');
    });
  });

  describe('#dropped', () => {
    it('should handle dropped files and update uploadedFiles', () => {
      const mockFileEntry = {
        file: (callback: any) => callback(new File(['dummy content'], 'example.txt', { type: 'text/plain' })),
        isFile: true
      };
      const mockNgxFileDropEntry = {
        fileEntry: mockFileEntry
      } as any;

      component.dropped([mockNgxFileDropEntry]);

      expect(component.uploadedFiles.length).toBe(1);
      expect(component.uploadedFiles[0].name).toBe('example.txt');
    });
  });

  describe('#deleteFile', () => {
    it('should delete a file if user confirms', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const mockFile = { id: '123', name: 'example.zip' };

      fileService.deleteFile.and.returnValue(of({}));
      component.uploadedFiles.push(mockFile as any);

      component.deleteFile(mockFile);

      expect(fileService.deleteFile).toHaveBeenCalledWith('123');
      expect(component.uploadedFiles.length).toBe(0);
    });

    it('should not delete a file if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const mockFile = { id: '123', name: 'example.zip' };

      component.uploadedFiles.push(mockFile as any);
      component.deleteFile(mockFile);

      expect(fileService.deleteFile).not.toHaveBeenCalled();
      expect(component.uploadedFiles.length).toBe(1);
    });
  });

  describe('#getAllUserFiles', () => {
    it('should fetch all user files and update uploadedFiles', () => {
      const mockFiles = [
        { _id: '1', compressedName: 'file1.zip', status: 'completed', size: 12345 },
        { _id: '2', compressedName: 'file2.zip', status: 'completed', size: 67890 }
      ];
      fileService.getAllUserFiles.and.returnValue(of(mockFiles));

      component.getAllUserFiles();

      expect(fileService.getAllUserFiles).toHaveBeenCalled();
      expect(component.uploadedFiles.length).toBe(2);
    });
  });

  describe('#updateFiles', () => {
    it('should update the file status if file is found', () => {
      const mockFileId = '12345';
      const mockStatus = 'completed';
      const mockName = 'updated-file.zip';

      component.uploadedFiles = [
        { id: mockFileId, name: 'old-file.zip', status: 'processing', allowDownloads: false, size: 1024, type: 'zip' }
      ];

      component.updateFileToNewStatus(mockFileId, mockStatus, mockName);

      const updatedFile = component.uploadedFiles.find(f => f.id === mockFileId);
      expect(updatedFile).toBeTruthy();
      expect(updatedFile?.status).toBe(mockStatus);
      expect(updatedFile?.name).toBe(mockName);
      expect(updatedFile?.allowDownloads).toBeTrue();
    });

    it('should not update the file status if file is not found', () => {
      component.uploadedFiles = [];
      component.updateFileToNewStatus('non-existent-id', 'completed', 'new-file.zip');
      expect(component.uploadedFiles.length).toBe(0);
    });
  });

});
