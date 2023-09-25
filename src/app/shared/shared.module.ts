import { NgModule } from "@angular/core";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [],
    imports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule,
      MatIconModule
    ],
    exports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule,
      MatIconModule
    ]
  })
  export class SharedModule { }