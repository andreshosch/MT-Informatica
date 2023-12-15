import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  year:number

ngOnInit(){
  const fechaActual = new Date();
  this.year = fechaActual.getFullYear();
}
}