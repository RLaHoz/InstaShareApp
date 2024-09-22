import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileItemComponent } from './file-item.component';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

describe('FileItemComponent', () => {
  let component: FileItemComponent;
  let fixture: ComponentFixture<FileItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileItemComponent],
      imports: [SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileItemComponent);
    component = fixture.componentInstance;

    component.file = {
      name: 'test-file.zip',
      size: 2048,
      status: 'completed',
      allowDownloads: true
    };

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the file details correctly', () => {
    const fileName = fixture.debugElement.query(By.css('.file-name')).nativeElement;
    const fileSize = fixture.debugElement.query(By.css('.file-size')).nativeElement;
    const fileStatus = fixture.debugElement.query(By.css('.file-status')).nativeElement;

    expect(fileName.textContent).toContain('test-file.zip');
    expect(fileSize.textContent).toContain('2 KB');
    expect(fileStatus.textContent).toContain('COMPLETED');
  });

  it('should show the download button if `allowDownloads` is true', () => {
    const downloadButton = fixture.debugElement.query(By.css('.btn-download'));
    expect(downloadButton).toBeTruthy();
  });

  it('should not show the download button if `allowDownloads` is false', () => {
    component.file.allowDownloads = false;
    fixture.detectChanges();

    const downloadButton = fixture.debugElement.query(By.css('.btn-download'));
    expect(downloadButton).toBeNull();
  });

  it('should emit download event when download button is clicked', () => {
    spyOn(component.download, 'emit');

    const downloadButton = fixture.debugElement.query(By.css('.btn-download')).nativeElement;
    downloadButton.click();

    expect(component.download.emit).toHaveBeenCalledWith(component.file);
  });

  it('should emit delete event when delete button is clicked', () => {
    spyOn(component.delete, 'emit');

    const deleteButton = fixture.debugElement.query(By.css('.btn-delete')).nativeElement;
    deleteButton.click();

    expect(component.delete.emit).toHaveBeenCalledWith(component.file);
  });
});
