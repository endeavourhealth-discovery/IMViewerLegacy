import { NgModule } from '@angular/core';
import {RouteGuard} from './route-guard';

@NgModule({
  providers: [
    RouteGuard
  ],
})
export class SecurityModule { }
