import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { tsParticles } from "tsparticles-engine";

declare const google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-component.component.html',
  styleUrls: ['./app-component.component.css']
})
export class AppComponentComponent implements OnInit, AfterViewInit {
  loggedIn = false;
  userName = '';

  ngOnInit(): void {
      // nothing to do here for now
  }

  ngAfterViewInit(): void {
      this.initParticles();
      this.initGoogleSignIn();
  }

  async initParticles(): Promise<void> {
    await loadFull(await tsParticles.load("particles", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 600 } },
        color: { value: ['#ff6b35', '#ff4e00', '#ff8c00'] },
        shape: {
          type: "star",
          options: {
            polygon: { nb_sides: 5 },
          }
        },
        opacity: {
          value: 0.8,
          random: true,
          animation: { enable: true, speed: 1, minimumValue: 0.4 }
        },
        size: {
          value: 4,
          random: true,
          animation: { enable: true, speed: 4, minimumValue: 0.6 }
        },
        links: {
          enable: true,
          distance: 180,
          color: '#ff6b35',
          opacity: 0.4,
          width: 1.5
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
          attract: { enable: true, rotate: { x: 1000, y: 2000 } }
        }
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 200, links: { opacity: 1 } },
          push: { quantity: 4 }
        }
      },
      retina_detect: true
    }));
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
      console.log('Usuário logado:', data);
      this.loggedIn = true;
      this.userName = data.given_name;
  }

  logout(): void {
      google.accounts.id.disableAutoSelect();
      this.loggedIn = false;
      this.userName = '';
      this.initGoogleSignIn();
  }
}
