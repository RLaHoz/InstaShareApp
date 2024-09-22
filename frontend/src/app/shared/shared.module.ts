import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FeatherModule } from 'angular-feather';
import { ArrowDownCircle, Share, Trash2 } from 'angular-feather/icons';

const icons = {
  ArrowDownCircle,
  Trash2,
  Share

};

const modules: any = [
  MatFormFieldModule,
  MatIconModule
];
@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    ...modules,
    FeatherModule.pick(icons)
  ],
  exports:[
    ...modules,
    NavbarComponent,
    FeatherModule
  ]
})
export class SharedModule { }
