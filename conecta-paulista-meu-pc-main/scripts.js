// ===== CONECTA PAULISTA - Scripts compartilhados =====

// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.getElementById('menu-botao');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            var menu = document.getElementById('menuPrincipal');
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('menu--aberto');
        });
    }
});

// ===== MODAL DE SOLICITAÇÃO =====
function gerarProtocolo() {
    var num = Math.floor(Math.random() * 900000) + 100000;
    return '2026-' + num.toString().padStart(6, '0');
}

function abrirModal(nomeServico) {
    var overlay = document.getElementById('modal-solicitacao');
    var tituloServico = document.getElementById('modal-nome-servico');
    if (tituloServico) tituloServico.textContent = 'Solicitar: ' + nomeServico;
    overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    var overlay = document.getElementById('modal-solicitacao');
    overlay.classList.remove('ativo');
    document.body.style.overflow = '';
}

function enviarSolicitacao(e) {
    e.preventDefault();
    fecharModal();
    // Abrir confirmação
    var protocolo = gerarProtocolo();
    var protocoloEl = document.getElementById('confirm-protocolo');
    if (protocoloEl) protocoloEl.textContent = 'Protocolo nº ' + protocolo;
    var confirmOverlay = document.getElementById('modal-confirmacao');
    confirmOverlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharConfirmacao() {
    var confirmOverlay = document.getElementById('modal-confirmacao');
    confirmOverlay.classList.remove('ativo');
    document.body.style.overflow = '';
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('ativo');
        document.body.style.overflow = '';
    }
});
