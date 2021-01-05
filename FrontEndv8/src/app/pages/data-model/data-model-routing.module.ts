import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DataModelLibraryComponent} from './data-model-library/data-model-library.component';

const routes: Routes = [
  {
    path: '',
    component: DataModelLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataModelRoutingModule { }
