import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly API_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

  constructor(private http: HttpClient) {}

  generateDraft(subject: string, body: string, to: string, bcc: string){
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedTo = encodeURIComponent(to);
    const encodedBcc = encodeURIComponent(bcc);

    // Build the Gmail URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}&bcc=${encodedBcc}&tf=1`;
    window.open(gmailUrl, '_blank');

  }

  
  async sendEmail(subject: string, body: string, to: string, bcc?: string): Promise<void> {
    const headers = [
      `To: ${to}`,
    ];
    if (bcc) {
      headers.push(`Bcc: ${bcc}`);
    }
    headers.push('Content-Type: text/html; charset=utf-8');
    headers.push(`Subject: ${subject}`);
    headers.push(''); // Empty line separates headers from body

    const rawMessage = [
      ...headers,
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