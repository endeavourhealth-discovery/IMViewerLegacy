import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { EditConceptComponent } from './edit-concept.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    MonacoEditorModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [EditConceptComponent],
  exports: [EditConceptComponent],
  entryComponents: [EditConceptComponent],
})
export class EditConceptComponentModule {}
