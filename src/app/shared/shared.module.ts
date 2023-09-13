import { NgModule } from "@angular/core";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [],
    imports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule
    ],
    exports: [
      MatFormFieldModule,
      MatInputModule,
      MatGridListModule,
      MatButtonModule
    ]
  })
  export class SharedModule { }