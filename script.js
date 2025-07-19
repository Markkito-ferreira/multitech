document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos os carrosséis do Bootstrap
    var carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function(carousel) {
        new bootstrap.Carousel(carousel);
    });

    // Adiciona smooth scroll para os links da navbar
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // Verifica se o href é um ID de seção (começa com #)
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                const navbarHeight = document.querySelector('.navbar').offsetHeight;

                if (targetElement) {
                    // Calcula a posição de rolagem, subtraindo a altura da navbar
                    // Adicionamos um pequeno offset extra para melhor visualização do topo da seção
                    const offsetTop = targetElement.offsetTop - navbarHeight - 10; // Ajuste de 10px

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Fecha o navbar collapsível em telas pequenas após o clique
                    const navbarCollapse = document.getElementById('navbarNav');
                    // Verifica se a navbar está visível (aberta) em telas pequenas
                    if (navbarCollapse && window.getComputedStyle(navbarCollapse).display !== 'none' && navbarCollapse.classList.contains('show')) {
                        var bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                        bsCollapse.hide();
                    }
                }
            } else {
                // Se não for um ID de seção, permite o comportamento padrão (ex: link para WhatsApp)
                window.location.href = targetId;
            }
        });
    });

    // Adiciona classes ativas à navegação ao rolar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight; // Obtém a altura da navbar uma vez

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Ajusta o ponto de ativação levando em conta a altura da navbar e um offset
            if (pageYOffset >= sectionTop - navbarHeight - 60) { // Ajuste de 60px para melhor detecção
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Certifica-se de que estamos comparando com IDs de seção
            // Adiciona a verificação para links que não são âncoras (ex: "#")
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            } else if (current === 'home' && link.getAttribute('href') === '#home') {
                link.classList.add('active'); // Garante que "Início" fique ativo no topo
            }
        });
    });
});
