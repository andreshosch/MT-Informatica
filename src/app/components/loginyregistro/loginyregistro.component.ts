import { Component } from '@angular/core';

@Component({
  selector: 'app-loginyregistro',
  templateUrl: './loginyregistro.component.html',
  styleUrls: ['./loginyregistro.component.css']
})
export class LoginyregistroComponent {

  login: boolean = true


  irALogin(){
    this.login=true
  }

  irARegistro(){
    this.login=false
  }

}
