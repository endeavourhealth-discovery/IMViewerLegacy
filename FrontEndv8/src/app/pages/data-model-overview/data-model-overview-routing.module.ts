import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DataModelOverviewLibraryComponent} from './data-model-overview-library/data-model-overview-library.component';

const routes: Routes = [
  {
    path: '',
    component: DataModelOverviewLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataModelOverviewRoutingModule { }
