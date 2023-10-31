import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
 formData:any={}
 private formUrl='https://formspree.io/f/xrgvgvvq'

  constructor(private http: HttpClient) {

  }
  submitForm() {
    this.http.post(this.formUrl, this.formData).subscribe(
      (response) => {
        console.log('Formulario enviado con éxito', response);
      },
      (error) => {
        console.error('Error al enviar el formulario', error);
      }
    )
  }
}

