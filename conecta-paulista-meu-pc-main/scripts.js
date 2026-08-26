// ===== CONECTA PAULISTA - Scripts Compartilhados =====

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile principal
    var menuBtn = document.getElementById('menu-botao');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            var menu = document.getElementById('menuPrincipal');
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            if (menu) menu.classList.toggle('menu--aberto');
        });
    }

    // Acessibilidade: Menu Oculto
    var btnMenuAcs = document.getElementById('btnMenuAcessibilidade');
    var menuOculto = document.getElementById('menuAcessibilidadeOculto');
    var btnFecharAcs = document.getElementById('btnFecharMenuAcessibilidade');

    if (btnMenuAcs && menuOculto) {
        btnMenuAcs.addEventListener('click', function(e) {
            e.preventDefault();
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            menuOculto.classList.toggle('ativo');
            menuOculto.setAttribute('aria-hidden', expanded);
        });
    }

    if (btnFecharAcs && menuOculto) {
        btnFecharAcs.addEventListener('click', function(e) {
            e.preventDefault();
            if (btnMenuAcs) btnMenuAcs.setAttribute('aria-expanded', 'false');
            menuOculto.classList.remove('ativo');
            menuOculto.setAttribute('aria-hidden', 'true');
        });
    }

    // Acessibilidade: Alto Contraste
    var btnContraste = document.getElementById('btnContraste');
    if (btnContraste) {
        btnContraste.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('alto-contraste');
        });
    }

    // Acessibilidade: Tamanho de Fonte
    var fontSizeScale = 16;
    var btnAumentar = document.getElementById('btnAumentarFonte');
    var btnResetar = document.getElementById('btnResetarFonte');
    var btnDiminuir = document.getElementById('btnDiminuirFonte');

    if (btnAumentar) {
        btnAumentar.addEventListener('click', function(e) {
            e.preventDefault();
            if (fontSizeScale < 22) {
                fontSizeScale += 2;
                document.documentElement.style.fontSize = fontSizeScale + 'px';
            }
        });
    }
    if (btnResetar) {
        btnResetar.addEventListener('click', function(e) {
            e.preventDefault();
            fontSizeScale = 16;
            document.documentElement.style.fontSize = '16px';
            document.body.classList.remove('alto-contraste');
        });
    }
    if (btnDiminuir) {
        btnDiminuir.addEventListener('click', function(e) {
            e.preventDefault();
            if (fontSizeScale > 12) {
                fontSizeScale -= 2;
                document.documentElement.style.fontSize = fontSizeScale + 'px';
            }
        });
    }

    // Botão geral de acessibilidade (abre o menu oculto também ou rola para atalhos)
    var btnAcessibilidadeGeral = document.getElementById('btnAcessibilidadeGeral');
    if (btnAcessibilidadeGeral && menuOculto) {
        btnAcessibilidadeGeral.addEventListener('click', function(e) {
            e.preventDefault();
            var expanded = btnMenuAcs ? btnMenuAcs.getAttribute('aria-expanded') === 'true' : false;
            if (btnMenuAcs) btnMenuAcs.setAttribute('aria-expanded', !expanded);
            menuOculto.classList.toggle('ativo');
            menuOculto.setAttribute('aria-hidden', expanded);
        });
    }

    // Atalhos de teclado (1, 2, 3, 4)
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            var el = document.getElementById('conteudo') || document.querySelector('nav');
            if (el) el.focus();
        } else if (e.altKey && e.key === '2') {
            e.preventDefault();
            var el = document.getElementById('campoBusca') || document.querySelector('input[type="search"]');
            if (el) el.focus();
        } else if (e.altKey && e.key === '3') {
            e.preventDefault();
            var el = document.querySelector('footer');
            if (el) el.scrollIntoView({behavior: 'smooth'});
        } else if (e.altKey && e.key === '4') {
            e.preventDefault();
            var el = document.getElementById('servicos-municipais') || document.getElementById('servicos-essenciais');
            if (el) el.scrollIntoView({behavior: 'smooth'});
        }
    });
});

// Serviços Municipais - categorias expansíveis (index.html)
function alternarCategoriaServico(categoria) {
    var botoes = document.querySelectorAll('.servico-cat-btn');
    var paineis = document.querySelectorAll('.servico-painel');
    var btnClicado = document.querySelector('.servico-cat-btn[data-categoria="' + categoria + '"]');
    var painelClicado = document.getElementById('painel-' + categoria);
    if (!btnClicado || !painelClicado) return;
    var jaAberto = btnClicado.classList.contains('ativo');

    botoes.forEach(function(b) {
        b.classList.remove('ativo');
        b.setAttribute('aria-expanded', 'false');
    });
    paineis.forEach(function(p) {
        p.classList.remove('aberto');
        p.style.maxHeight = null;
    });

    if (!jaAberto) {
        btnClicado.classList.add('ativo');
        btnClicado.setAttribute('aria-expanded', 'true');
        painelClicado.classList.add('aberto');
        painelClicado.style.maxHeight = painelClicado.scrollHeight + 'px';
    }
}

// ===== MODAL DE SOLICITAÇÃO (subpáginas) =====
function gerarProtocolo() {
    var num = Math.floor(Math.random() * 900000) + 100000;
    return '2026-' + num.toString().padStart(6, '0');
}

function abrirModal(nomeServico) {
    var overlay = document.getElementById('modal-solicitacao');
    var tituloServico = document.getElementById('modal-nome-servico');
    if (tituloServico) tituloServico.textContent = 'Solicitar: ' + nomeServico;
    if (overlay) overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    var overlay = document.getElementById('modal-solicitacao');
    if (overlay) overlay.classList.remove('ativo');
    document.body.style.overflow = '';
}

function enviarSolicitacao(e) {
    e.preventDefault();
    fecharModal();
    var protocolo = gerarProtocolo();
    var protocoloEl = document.getElementById('confirm-protocolo');
    if (protocoloEl) protocoloEl.textContent = 'Protocolo nº ' + protocolo;
    var confirmOverlay = document.getElementById('modal-confirmacao');
    if (confirmOverlay) confirmOverlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharConfirmacao() {
    var confirmOverlay = document.getElementById('modal-confirmacao');
    if (confirmOverlay) confirmOverlay.classList.remove('ativo');
    document.body.style.overflow = '';
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('ativo');
        document.body.style.overflow = '';
    }
});
