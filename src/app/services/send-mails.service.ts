import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendMailsService {

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string) {
    const emailData = { to, subject, text };
    return this.http.post<any>('http://localhost:3000/send-email', emailData);
  }
}
