import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

   constructor( private _snackBar:MatSnackBar) { }

  snackBar(message:string,backgroundColor:string) {
    const snackBarConfig:MatSnackBarConfig={
      duration:3000,
      panelClass:[...this.getBackgroundColorClasses(backgroundColor)],
      data:{backgroundColor}
  }
  this._snackBar.open(message,'',snackBarConfig)
    };
    private getBackgroundColorClasses(backgroundColor: string): string[] {
      return [`estilosSnackBar`, `background-color-${backgroundColor}`];
    }
  }


