import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailsService {

  constructor(private http: HttpClient) { }

  sendMails(url:any,formData:any,) {
    this.http.post(url, formData).subscribe(
      (response) => {
        console.log('Formulario enviado con éxito', response);
      },
      (error) => {
        console.error('Error al enviar el formulario', error);
      }
    )
  }
}
