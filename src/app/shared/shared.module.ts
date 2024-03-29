import { NgModule } from "@angular/core";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar'
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import {MatRadioModule} from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion'


@NgModule({
    declarations: [],
    imports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule,
      MatIconModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatSnackBarModule,
      MatSelectModule,
      MatMenuModule,
      MatTooltipModule,
      MatDividerModule,
      MatRadioModule,
      MatExpansionModule
    ],
    exports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule,
      MatIconModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatSnackBarModule,
      MatSelectModule,
      MatMenuModule,
      MatTooltipModule,
      MatDividerModule,
      MatRadioModule,
      MatExpansionModule
    ]
  })
  export class SharedModule { }