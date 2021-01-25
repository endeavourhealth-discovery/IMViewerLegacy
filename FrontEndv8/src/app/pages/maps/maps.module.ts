import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapsComponent} from './maps/maps.component';
import {MatCardModule} from '@angular/material/card';
import {ComponentsModule} from '../../components/components.module';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MapsRoutingModule} from './maps-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    ComponentsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexModule,
    FormsModule,
    MatProgressSpinnerModule,
    MapsRoutingModule
  ],
  declarations: [
    MapsComponent
  ]
})
export class MapsModule { }
