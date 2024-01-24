import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SppinerService {
  public loading: boolean = true;

  showSpinner(): void {
    setTimeout(() => {
      this.loading=false
    }, 5000);
  }
  getSpinner(): boolean {
    return this.loading;
  }
  constructor() { }
  
}
