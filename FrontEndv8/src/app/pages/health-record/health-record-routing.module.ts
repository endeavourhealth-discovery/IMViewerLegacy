import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HealthRecordLibraryComponent} from './health-record-library/health-record-library.component';

const routes: Routes = [
  {
    path: '',
    component: HealthRecordLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRecordRoutingModule { }
