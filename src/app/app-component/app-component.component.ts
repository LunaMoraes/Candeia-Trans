import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from '../services/email.service';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

declare const google: any;


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
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


  @HostListener('window:resize')
  onResize(): void {
      const canvas = document.querySelector('#particles canvas') as HTMLCanvasElement;
      if (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
      }
  }

  initGoogleSignIn(): void {
      google.accounts.id.initialize({
          client_id: environment.PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleCredentialResponse(response)
      });
      google.accounts.id.renderButton(
          document.querySelector('.google-login-btn'),
          { theme: 'filled_blue', size: 'large', locale: 'pt_BR' }
      );
  }

  handleCredentialResponse(response: any): void {
      const data: any = jwtDecode(response.credential);
      this.loggedIn = true;
      //this.userName = data.given_name;
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
