import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OntologyLibraryComponent} from './ontology-library/ontology-library.component';

const routes: Routes = [
  {
    path: '',
    component: OntologyLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OntologyRoutingModule { }
