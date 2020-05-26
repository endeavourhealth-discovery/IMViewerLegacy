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

@NgModule({
  declarations: [
    MainPageComponent
  ],
    imports: [
        CommonModule,
        MatCardModule,
        FlexModule,
        MatRippleModule,
        MatTooltipModule,
        MatButtonModule,
        RouterModule,
        ComponentsModule
    ]
})
export class MainPageModule { }
