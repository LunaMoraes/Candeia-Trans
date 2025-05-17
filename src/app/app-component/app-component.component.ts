import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from '../services/email.service';
import { environment } from '../../../environments/environment';
import { listaCRM, listaPoliticos, listaSaoCarlos } from './listas';
import { emailBody } from './emailBody';
import { tsParticles } from "@tsparticles/engine";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { loadFirePreset } from "@tsparticles/preset-fire";

declare const google: any;
declare const gapi: any;
let tokenClient: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxParticlesModule],
  providers: [],
  templateUrl: './app-component.component.html',
  styleUrls: ['./app-component.component.css', '../../styles.css']
})
export class AppComponentComponent implements OnInit, AfterViewInit {
  showModal = false;
  showFormModal = false;
  openModal(): void {
    this.showModal = true;
  }
  openFormModal(): void {
    this.showFormModal = true;
  }
  closeModal(): void {
    this.showModal = false;
  }
  closeFormModal(): void {
    this.showFormModal = false;
  }
  openSaoCarlos(): void {
    let stateData: { emails?: any } = {}; // Initialize as an empty object

    stateData.emails = listaSaoCarlos;

    console.log(stateData.emails); // Log the emails for the selected state

    const emailContent = {
      to: 'cfm@portalmedico.org.br',
      bcc: stateData.emails,
      subject: 'POSICIONAMENTO CONTRA RESOLUCAO DO CFM 2427/2025',
      body: `${emailBody}`
    };

    this.emailService.generateDraft(
      emailContent.subject, 
      emailContent.body, 
      emailContent.to, 
      emailContent.bcc
    )
  }

  constructor(private emailService: EmailService, private readonly particlesService: NgParticlesService) {}
  id = "particles";
  CRMOption = false;
  PoliticosOption = false;
  loggedIn = false;
  selectedState: string | null = null;
  states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  async ngOnInit(): Promise<void> {
    await this.particlesService.init(async () => {});
    await loadFirePreset(tsParticles);
    
    await tsParticles.load({
      id: this.id,
      options: {
        preset: 'fire',
        background: {
          color: '#000000'
        }
      }
    });
  }

  ngAfterViewInit(): void {
      this.initializeGoogleClients(); 
  }

  initializeGoogleClients(): void {
    // Initialize Google OAuth2 Token Client (Access Token)
    // This client handles the authorization flow
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/gmail.send', 
      callback: (tokenResponse: any) => { 
        if (tokenResponse && tokenResponse.access_token) {
          // Implicit flow returns token directly
          // Load the GAPI client library and set the token
          gapi.load('client', () => {
            gapi.client.setToken(tokenResponse);
            console.log('Access token obtained and set for gapi. ');
            this.loggedIn = true; 
          });
        } else {
          // Handle errors or lack of token
          console.error('Failed to obtain access token.');
          alert('Falha ao obter permissão para enviar emails. Tente novamente.');
          this.loggedIn = false;
          if (gapi && gapi.client) { gapi.client.setToken(null); }
        }
      },
      error_callback: (error: any) => {
        console.error('Token client error:', error);
        // More specific error handling could be added here based on error object
        if (error.type === 'popup_closed') {
          alert('Você fechou a janela de login do Google antes de concluir.');
        } else if (error.type === 'popup_failed_to_open') {
          alert('Não foi possível abrir a janela de login do Google. Verifique se os pop-ups estão bloqueados.');
        } else {
          alert('Erro durante a autorização do Google. Tente novamente.');
        }
        this.loggedIn = false;
        if (gapi && gapi.client) { gapi.client.setToken(null); }
      }
    });
  }

  signInAndAuthorize(): void {
    if (!tokenClient) {
      console.error('Token client not initialized.');
      return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  selectState(state: string): void {
    this.selectedState = this.selectedState === state ? null : state;
  }

  onSubmit(): void {
    /* if (!this.loggedIn) {
      alert('Por favor, faça login com o Google e autorize o envio de emails primeiro.');
      return;
    } */
    if (!this.selectedState) {
      alert('Por favor selecione um estado');
      return;
    }
    if (this.CRMOption==false && this.PoliticosOption==false) {
      alert('Por favor selecione um grupo');
      return;
    }

    let stateData: { emails?: any } = {}; // Initialize as an empty object
    // Find the emails for the selected state
    if(this.CRMOption==true){
      const crmItem = listaCRM.find(item => item.state === this.selectedState);
      if (crmItem) {
        stateData.emails = crmItem.emails; // Assign emails to the object property
      }
    }
    if(this.PoliticosOption==true){
      const politicosItem = listaPoliticos.find(item => item.state === this.selectedState);
      if (politicosItem) {
        if(this.CRMOption==true){stateData.emails += ","+politicosItem.emails;}
        else{stateData.emails = politicosItem.emails;}
      }
    }

    console.log(stateData.emails); // Log the emails for the selected state

    const emailContent = {
      to: 'cfm@portalmedico.org.br',
      bcc: stateData.emails,
      subject: 'POSICIONAMENTO CONTRA RESOLUCAO DO CFM 2427/2025',
      body: `${emailBody}`
    };

    this.emailService.generateDraft(
      emailContent.subject, 
      emailContent.body, 
      emailContent.to, 
      emailContent.bcc
    )
  }
}
