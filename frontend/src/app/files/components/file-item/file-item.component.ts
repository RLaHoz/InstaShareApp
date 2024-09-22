import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent {
  @Input() file: any;
  @Output() download = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onDownload(): void {
    this.download.emit(this.file);
  }

  onDelete(): void {
    this.delete.emit(this.file);
  }
}
