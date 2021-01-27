import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HealthRecordOverviewLibraryComponent} from './health-record-overview-library/health-record-overview-library.component';

const routes: Routes = [
  {
    path: '',
    component: HealthRecordOverviewLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRecordOverviewRoutingModule { }
