// Remove default vite css import
// import './style.css'; // Vite automatically loads it since we put it in index.html

document.addEventListener('DOMContentLoaded', () => {
  // 1. Get Guest Name from URL Parameter
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('to');
  const guestNameEl = document.getElementById('guest-name');
  
  if (guestNameParam) {
    guestNameEl.textContent = guestNameParam;
  } else {
    guestNameEl.textContent = "Tamu Undangan";
  }

  // 2. Open Invitation Logic
  const btnOpen = document.getElementById('btn-open');
  const cover = document.getElementById('cover');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');
  let isPlaying = false;

  btnOpen.addEventListener('click', () => {
    cover.classList.add('slide-up');
    mainContent.classList.remove('hidden');
    
    // Attempt to play music
    bgMusic.play().then(() => {
      isPlaying = true;
      btnMusic.classList.add('playing');
      btnMusic.innerHTML = '<i class="ph ph-speaker-high"></i>';
    }).catch(e => {
      console.log('Autoplay prevented', e);
      isPlaying = false;
      btnMusic.innerHTML = '<i class="ph ph-speaker-slash"></i>';
    });

    // Trigger initial scroll reveal when cover hides
    setTimeout(handleScrollReveal, 100);
  });

  // 3. Music Control
  btnMusic.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      btnMusic.classList.remove('playing');
      btnMusic.innerHTML = '<i class="ph ph-speaker-slash"></i>';
    } else {
      bgMusic.play();
      isPlaying = true;
      btnMusic.classList.add('playing');
      btnMusic.innerHTML = '<i class="ph ph-speaker-high"></i>';
    }
  });

  // 4. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const handleScrollReveal = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 50;

    revealElements.forEach(el => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
    
    // Active Nav Link Update
    updateActiveNav();
  };

  window.addEventListener('scroll', handleScrollReveal);

  // 5. Active Navigation
  const navLinks = document.querySelectorAll('.floating-nav a');
  const sections = document.querySelectorAll('.section');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  // 6. Countdown Timer
  // Set date: 10 May 2026
  const eventDate = new Date("April 25, 2026 09:00:00").getTime();

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      document.getElementById('timer').innerHTML = "<h4>Acara Sedang Berlangsung / Telah Selesai</h4>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
  };

  setInterval(updateTimer, 1000);
  updateTimer(); // Initial call

  // 7. RSVP Form Submission Check
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;
    const message = document.getElementById('message').value;

    const badgeClass = attendance === 'Hadir' ? 'badge-success' : 'badge-secondary';
    
    const newWish = `
      <div class="wish-item scroll-reveal visible">
        <h4>${name}</h4>
        <span class="badge ${badgeClass}">${attendance}</span>
        <p>${message}</p>
      </div>
    `;

    wishesList.insertAdjacentHTML('afterbegin', newWish);
    rsvpForm.reset();
  });

  // 8. Share WhatsApp
  const btnShare = document.getElementById('btn-share-wa');
  btnShare.addEventListener('click', () => {
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara Walimatul Safar (Haji) & Khitan kami. Detail acara dapat dilihat pada tautan berikut:\n\n${window.location.href}\n\nTerima kasih atas doa dan kehadirannya.\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  });

  // 9. Copy to Clipboard for Amplop Digital
  const btnCopies = document.querySelectorAll('.btn-copy');
  btnCopies.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId).innerText.replace(/\s+/g, ''); // Remove spaces from acc number
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> Tersalin';
        btn.style.backgroundColor = 'var(--color-primary)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--color-primary)';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = 'transparent';
          btn.style.color = 'var(--color-accent)';
          btn.style.borderColor = 'var(--color-accent)';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });

  // trigger visible for cover on load
  setTimeout(() => {
    document.querySelector('.cover-content').classList.add('visible');
  }, 100);
});
