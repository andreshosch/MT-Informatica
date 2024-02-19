import { Component } from '@angular/core';
import { MailsService } from 'src/app/services/mails.service';
import { MensajeService } from 'src/app/services/mensaje.service';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
 formData:any={}
 private formUrl='https://formspree.io/f/xjvqlndq'

  constructor(private _mailService:MailsService, private _mensaje:MensajeService) {

  }

  submitForm() {
    this._mailService.sendMails(this.formUrl,this.formData)
    this._mensaje.snackBar("Mensaje enviado. Pronto nos pondremos en contacto",'green')
  }
}

