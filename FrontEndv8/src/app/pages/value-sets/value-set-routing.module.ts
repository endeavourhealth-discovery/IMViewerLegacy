import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ValueSetLibraryComponent} from './value-set-library/value-set-library.component';

const routes: Routes = [
  {
    path: '',
    component: ValueSetLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValueSetRoutingModule { }
