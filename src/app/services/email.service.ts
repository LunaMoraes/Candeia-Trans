import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly API_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

  constructor(private http: HttpClient) {}

  async sendEmail(subject: string, body: string, to: string): Promise<void> {
    const rawMessage = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = btoa(rawMessage)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      await gapi.client.request({
        path: this.API_ENDPOINT,
        method: 'POST',
        body: {
          raw: encodedMessage
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}