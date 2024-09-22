import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FileItemComponent } from './components/file-item/file-item.component';
import { FilesDashboardComponent } from './components/files-dashboard/files-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';


@NgModule({
  declarations: [
    FilesDashboardComponent,
    FileItemComponent
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    SharedModule,
    NgxFileDropModule
  ]
})
export class FilesModule { }
