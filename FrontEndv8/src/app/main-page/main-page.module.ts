import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainPageComponent} from './main-page.component';
import {MatCardModule} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {ComponentsModule} from '../components/components.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MainPageRoutingModule} from './main-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexModule,
    MatRippleModule,
    MatTooltipModule,
    MatButtonModule,
    RouterModule,
    ComponentsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MainPageRoutingModule
  ],
  declarations: [
    MainPageComponent
  ]
})
export class MainPageModule { }
