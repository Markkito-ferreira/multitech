document.addEventListener('DOMContentLoaded', () => {
    // Registra os plugins do GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- Animações do Header (Sticky Header) ---
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar'); // Seleciona o elemento navbar
    const ticker = document.querySelector('.ticker-section'); // Seleciona o ticker
    let tickerHeight = ticker ? ticker.offsetHeight : 0; // Altura do ticker, se existir

    ScrollTrigger.create({
        trigger: "body",
        start: () => `top -${navbar.offsetHeight + tickerHeight}px`, // Gatilho após o header completo
        end: "bottom",
        onEnter: () => {
            header.classList.add('scrolled');
            navbar.classList.add('scrolled'); // Adiciona classe ao navbar também se precisar de estilo diferente
            // Se você quiser que o ticker desapareça ao rolar
            if (ticker) {
                gsap.to(ticker, { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
            }
        },
        onLeaveBack: () => {
            header.classList.remove('scrolled');
            navbar.classList.remove('scrolled');
            // Retorna o ticker
            if (ticker) {
                gsap.to(ticker, { height: tickerHeight, opacity: 1, duration: 0.3, ease: "power2.out" });
            }
        },
        // Atualiza a posição do header para ser sticky
        onUpdate: (self) => {
            if (self.progress > 0) {
                header.style.top = '0px';
            } else {
                header.style.top = '0px'; // Ou -tickerHeight se quiser que o ticker "saia da tela"
            }
        }
    });

    // --- Animações de Entrada para Seções (Fade-in e Slide-up) ---
    gsap.utils.toArray('section:not(.carousel-section)').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 80, // Vem de baixo para cima
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%", // Inicia quando 85% da seção está visível
                toggleActions: "play none none reverse", // Play on enter, reverse on leave back
                once: true, // Anima apenas uma vez ao entrar
            }
        });
    });

    // --- Efeito Parallax Horizontal em Elementos Específicos ---
    // Desabilita em telas menores que 992px para evitar desajustes em mobile
    if (window.innerWidth >= 992) {
        gsap.utils.toArray('.parallax-section [data-gsap-parallax-x]').forEach(el => {
            const xValue = parseFloat(el.dataset.gsapParallaxX || 0);
            gsap.to(el, {
                x: xValue,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom", // Começa quando o topo do elemento toca o bottom da viewport
                    end: "bottom top",   // Termina quando o bottom do elemento toca o top da viewport
                    scrub: true,         // Animação suave baseada no scroll
                }
            });
        });

        // Efeito Parallax Horizontal nos Cards de Serviço
        gsap.utils.toArray('.service-card[data-gsap-parallax-x-card]').forEach(card => {
            const xValueCard = parseFloat(card.dataset.gsapParallaxXCard || 0);
            gsap.to(card, {
                x: xValueCard,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });
        });
    }

    // --- Animações do Carrossel (Captions) ---
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        carousel.addEventListener('slide.bs.carousel', function () {
            const currentItem = this.querySelector('.carousel-item.active');
            const caption = currentItem.querySelector('.carousel-caption');

            // Resetar animações anteriores
            gsap.set(caption.children, { opacity: 0, y: 30 });

            // Animar novos elementos
            gsap.fromTo(caption.querySelector('.text-uppercase'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
            gsap.fromTo(caption.querySelector('h2'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
            gsap.fromTo(caption.querySelector('p.lead'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 });
            gsap.fromTo(caption.querySelector('.btn'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.8 });
        });

        // Disparar animação para o primeiro item quando a página carregar
        const firstCaption = carousel.querySelector('.carousel-item.active .carousel-caption');
        if (firstCaption) {
            gsap.fromTo(firstCaption.querySelector('.text-uppercase'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 });
            gsap.fromTo(firstCaption.querySelector('h2'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.0 });
            gsap.fromTo(firstCaption.querySelector('p.lead'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.2 });
            gsap.fromTo(firstCaption.querySelector('.btn'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 1.4 });
        }
    }


    // --- Agendar Atendimento (Redirecionamento WhatsApp) ---
    document.querySelectorAll('.agendar-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.target.dataset.type;
            let message = '';
            let valor = '';

            if (type === 'residencial') {
                valor = 'R$70,00';
                message = `Olá, MULTITECH FIELD! Gostaria de agendar uma visita técnica residencial em Aracaju. O valor da visita é ${valor}. Meu problema é: [Por favor, descreva o problema com o máximo de detalhes para que possamos te ajudar da melhor forma].`;
            } else if (type === 'empresarial') {
                valor = 'R$90,00';
                message = `Olá, MULTITECH FIELD! Minha empresa precisa agendar uma visita técnica em Aracaju. O valor da visita é ${valor}. Nosso problema é: [Por favor, descreva o problema com o máximo de detalhes e, se possível, informe o tipo de equipamento/serviço necessário].`;
            }

            const whatsappNumber = '5561996556538'; // Confirmar este número para Aracaju
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappLink, '_blank');
        });
    });

    // --- Smooth Scroll para links da navegação ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = header.offsetHeight; // Ajusta o offset para o tamanho do header fixo
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });

    // Atualiza o ano no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});
