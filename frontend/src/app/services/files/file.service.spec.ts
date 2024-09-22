import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';
import { environment } from 'src/environments/environment';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#uploadFile', () => {
    it('should upload a file', () => {
      const dummyFile = new File([''], 'test.txt', { type: 'text/plain' });
      service.uploadFile(dummyFile).subscribe(response => {
        expect(response).toEqual({ message: 'File uploaded successfully' });
      });

      const req = httpMock.expectOne(`${baseUrl}/files/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.has('file')).toBeTrue();
      req.flush({ message: 'File uploaded successfully' });
    });
  });

  describe('#downloadFile', () => {
    it('should download a file as a blob', () => {
      const fileId = '12345';
      const blob = new Blob(['file content'], { type: 'application/zip' });

      service.downloadFile(fileId).subscribe(file => {
        expect(file).toEqual(blob);
      });

      const req = httpMock.expectOne(`${baseUrl}/files/download/${fileId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(blob);
    });
  });

  describe('#deleteFile', () => {
    it('should delete a file', () => {
      const fileId = '12345';

      service.deleteFile(fileId).subscribe(response => {
        expect(response).toEqual({ message: 'File deleted successfully' });
      });

      const req = httpMock.expectOne(`${baseUrl}/files/delete/${fileId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'File deleted successfully' });
    });
  });

  describe('#getAllUserFiles', () => {
    it('should get all user files and map correctly', () => {
      const dummyFiles = [
        { _id: '123', status: 'completed', compressedName: 'file1.zip', size: 1024 },
        { _id: '456', status: 'processing', compressedName: 'file2.zip', size: 2048 }
      ];

      service.getAllUserFiles().subscribe(files => {
        expect(files.length).toBe(2);
        expect(files[0].id).toBe('123');
        expect(files[0].allowDownloads).toBeTrue();
      });

      const req = httpMock.expectOne(`${baseUrl}/files/user-files`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyFiles);
    });
  });

  describe('#getFileStatus', () => {
    it('should get file status by ID', () => {
      const fileId = '12345';
      const fileStatus = { fileId: '12345', status: 'completed', compressedName: 'file.zip', size: 1024 };

      service.getFileStatus(fileId).subscribe(status => {
        expect(status.fileId).toBe('12345');
      });

      const req = httpMock.expectOne(`${baseUrl}/files/status/${fileId}`);
      expect(req.request.method).toBe('GET');
      req.flush(fileStatus);
    });
  });

  describe('#alternativeUploadFile', () => {
    it('should upload a file and return status', () => {
      const dummyFile = new File([''], 'test.txt', { type: 'text/plain' });
      const uploadResponse = { file: { id: '12345' } };
      const statusResponse = { fileId: '12345', status: 'completed', compressedName: 'file.zip' };

      service.alternativeUploadFile(dummyFile).subscribe(status => {
        expect(status.fileId).toBe('12345');
        expect(status.status).toBe('completed');
      });

      const uploadReq = httpMock.expectOne(`${baseUrl}/files/upload`);
      expect(uploadReq.request.method).toBe('POST');
      uploadReq.flush(uploadResponse);

      const statusReq = httpMock.expectOne(`${baseUrl}/files/status/12345`);
      expect(statusReq.request.method).toBe('GET');
      statusReq.flush(statusResponse);
    });
  });
});
