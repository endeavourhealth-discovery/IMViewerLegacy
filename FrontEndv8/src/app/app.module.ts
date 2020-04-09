import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {RecordModelLibraryComponent} from './record-model-library/record-model-library/record-model-library.component';
import {RecordModelModule} from './record-model-library/record-model.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { AppRoot } from './app-root';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    RecordModelModule,

    RouterModule.forRoot([
        {path: '', redirectTo: '/recordModel', pathMatch: 'full'},
        {path: 'recordModel', component: RecordModelLibraryComponent},
        {path: 'recordModel/:id', component: RecordModelLibraryComponent},
      ],
      {useHash: true})
  ],
  providers: [],
  declarations: [AppRoot],
  bootstrap: [AppRoot],
})
export class AppModule { }
