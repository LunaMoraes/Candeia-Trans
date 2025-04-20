import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from '../services/email.service';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

declare const google: any;
declare const gapi: any;
let tokenClient: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [],
  templateUrl: './app-component.component.html',
  styleUrls: ['./app-component.component.css', '../../styles.css']
})
export class AppComponentComponent implements OnInit, AfterViewInit {
  constructor(private emailService: EmailService) {}
  CRMOption = false;
  PoliticosOption = false;
  loggedIn = false;
  selectedState: string | null = null;
  states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.initGoogleSignIn();
  }

  initGoogleSignIn(): void {
    google.accounts.id.initialize({
        client_id: environment.PUBLIC_GOOGLE_CLIENT_ID,
        // This callback receives the ID token
        callback: (response: any) => this.handleIdTokenResponse(response),
        // Scope is requested later via tokenClient, so remove it here
        // scope: 'https://www.googleapis.com/auth/gmail.send'
    });
    google.accounts.id.renderButton(
        document.querySelector('.google-login-btn'),
        { size: 'large', locale: 'pt_BR' }
    );
  }
  handleIdTokenResponse(response: any): void {
    const idTokenData: any = jwtDecode(response.credential);
    console.log('ID Token received, user:', idTokenData.given_name);

    // Initialize the token client *after* getting the ID token
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/gmail.send', // Request Gmail scope here
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          // Set the access token for gapi
          gapi.client.setToken(tokenResponse);
          console.log('Access token obtained and set for gapi.');
          this.loggedIn = true; // Set loggedIn status *after* getting the access token
          // Update UI or trigger actions if needed
        } else {
          console.error('Failed to obtain access token.');
          alert('Falha ao obter permissão para enviar emails. Tente novamente.');
          this.loggedIn = false;
          // Optionally clear gapi token if it exists
           if (gapi && gapi.client) { gapi.client.setToken(null); }
        }
      },
      error_callback: (error: any) => {
        console.error('Token client error:', error);
        alert('Erro durante a autorização do Google. Tente novamente.');
        this.loggedIn = false;
         if (gapi && gapi.client) { gapi.client.setToken(null); }
      }
    });

    // Now that tokenClient is initialized, request the access token
    this.requestAccessToken();
  }

  requestAccessToken(): void {
    if (!tokenClient) {
      console.error('Token client not initialized.');
      alert('Erro interno. Tente fazer login novamente.');
      return;
    }
    // Request the access token. Prompt might be needed if consent wasn't given
    // Use prompt: 'consent' to force consent screen if needed, '' otherwise
    tokenClient.requestAccessToken({ prompt: '' });
  }

  selectState(state: string): void {
    this.selectedState = this.selectedState === state ? null : state;
  }

  onSubmit(): void {
    if (!this.selectedState) {
      alert('Por favor selecione um estado');
      return;
    }
    
    const emailContent = {
      to: 'sovietlunox@gmail.com',
      subject: 'Novo Estado Selecionado',
      body: `Estado selecionado: ${this.selectedState}`
    };

    this.emailService.sendEmail(
      emailContent.subject,
      emailContent.body,
      emailContent.to
    ).catch(error => {
      console.error('Erro ao enviar email:', error);
      alert('Erro ao enviar o email');
    });
  }
}
