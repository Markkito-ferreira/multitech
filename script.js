// Garante que o GSAP e o plugin ScrollTrigger estejam registrados
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {

    // --- Função de Utilitário para Configurar o Ticker Text ---
    const setupSeamlessTicker = (wrapperId, direction, duration) => {
        const wrapper = document.getElementById(wrapperId);
        const span = wrapper ? wrapper.querySelector('span') : null;

        if (!span) {
            console.warn(`Ticker span not found for wrapper ID: ${wrapperId}`);
            return;
        }

        const originalContent = span.innerHTML;
        span.innerHTML = originalContent + originalContent; 

        let contentWidth;

        const startTickerAnimation = () => {
            contentWidth = span.getBoundingClientRect().width / 2;

            if (contentWidth > 0) {
                gsap.to(span, {
                    x: direction === 'left' ? -contentWidth : contentWidth,
                    ease: "none",
                    duration: duration,
                    repeat: -1,
                    modifiers: {
                        x: x => parseFloat(x) % contentWidth
                    }
                });
            } else {
                setTimeout(startTickerAnimation, 50); 
            }
        };

        setTimeout(startTickerAnimation, 100); 
    };

    // --- Chamadas para as Animações dos Tickers ---
    setupSeamlessTicker('topTicker', 'left', 35);
    setupSeamlessTicker('midTicker', 'right', 40);


    // --- Inicialização do Carrossel Bootstrap & Animações das Legendas (GSAP) ---
    const heroCarouselElement = document.getElementById('heroCarousel');
    if (heroCarouselElement) {
        const heroCarousel = new bootstrap.Carousel(heroCarouselElement, {
            interval: 6000,
            pause: "hover"
        });

        const animateCaption = (captionElement) => {
            const children = captionElement.querySelectorAll('h1, h2, p, a.btn');
            gsap.fromTo(children,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15 }
            );
        };

        const initialCaption = heroCarouselElement.querySelector('.carousel-item.active .carousel-caption');
        if (initialCaption) {
            animateCaption(initialCaption);
        }

        heroCarouselElement.addEventListener('slid.bs.carousel', function (event) {
            const currentCaption = event.relatedTarget.querySelector('.carousel-caption');
            animateCaption(currentCaption);
        });
    }

    // --- Seção de Rolagem Horizontal (GSAP ScrollTrigger e Navegação) ---
    // REMOVIDA TODA A LÓGICA DE ROLAGEM HORIZONTAL DO GSAP E BOTÕES DE NAVEGAÇÃO.
    // A rolagem será controlada puramente pelo CSS via `overflow-x: scroll;`
    // e os cards se ajustarão.
    // Os botões de navegação no HTML devem ter `display: none;` no CSS.
    // A navegação por teclado para esta seção também não é mais necessária.

    // --- Parallax Effect em Imagens (GSAP ScrollTrigger) ---
    document.querySelectorAll("[data-gsap-parallax]").forEach(img => {
        gsap.to(img, {
            y: () => {
                return window.innerWidth > 991 ? parseFloat(img.dataset.gsapParallax) * 200 : 0;
            },
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // --- Animações Gerais de Fade-In e Deslize para Cima ---
    gsap.utils.toArray('.feature-section h2, .feature-section p.lead, .service-list li, .card-apple-like, .btn-lg.rounded-pill').forEach(element => {
        gsap.from(element, {
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    // --- Animação Opcional: Fade-In dos Ícones Sociais no Rodapé ---
    gsap.from(".social-icon", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "footer",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

});