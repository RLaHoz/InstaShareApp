import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesDashboardComponent } from './components/files-dashboard/files-dashboard.component';

const routes: Routes = [
  { path: '', component: FilesDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }
