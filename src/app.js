import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';

declare var particlesJS: any;
declare var google: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    loggedIn = false;
    userName = '';

    ngOnInit(): void {
        // nothing to do here for now
    }

    ngAfterViewInit(): void {
        this.initParticles();
        this.initGoogleSignIn();
    }

    initParticles(): void {
        particlesJS('particles', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 600 } },
                color: { value: ['#ff6b35', '#ff4e00', '#ff8c00'] },
                shape: {
                    type: 'star',
                    polygon: { nb_sides: 5 },
                    stroke: { width: 0, color: '#000000' }
                },
                opacity: {
                    value: 0.8,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.4 }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: { enable: true, speed: 4, size_min: 0.6 }
                },
                line_linked: {
                    enable: true,
                    distance: 180,
                    color: '#ff6b35',
                    opacity: 0.4,
                    width: 1.5
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: { enable: true, rotateX: 1000, rotateY: 2000 }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
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
            client_id: environment.googleClientId,
            callback: (response: any) => this.handleCredentialResponse(response)
        });
        google.accounts.id.renderButton(
            document.querySelector('.google-login-btn'),
            { theme: 'filled_blue', size: 'large', locale: 'pt_BR' }
        );
    }

    handleCredentialResponse(response: any): void {
        const data: any = jwt_decode(response.credential);
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