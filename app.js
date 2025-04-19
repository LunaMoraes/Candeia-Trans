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

window.addEventListener('resize', () => {
  const canvas = document.querySelector('#particles canvas');
  if (canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
});

// Configuração do Google Sign-In
function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    console.log('Usuário logado:', data);
    document.querySelector('.google-login-btn').style.display = 'none';
    document.querySelector('.container').innerHTML += `
        <div class="welcome-message">
            Bem-vindo, ${data.given_name}!
            <button onclick="logout()" class="logout-btn">Sair</button>
        </div>
    `;
}

function logout() {
    google.accounts.id.disableAutoSelect();
    document.querySelector('.welcome-message').remove();
    document.querySelector('.google-login-btn').style.display = 'flex';
}

window.onload = function() {
    google.accounts.id.initialize({
        client_id: 'SEU_CLIENT_ID_AQUI',
        callback: handleCredentialResponse
    });
    
    google.accounts.id.renderButton(
        document.querySelector('.google-login-btn'),
        { theme: 'filled_blue', size: 'large', locale: 'pt_BR' }
    );
};