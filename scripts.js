// =========================================================
// CONECTA PAULISTA — scripts compartilhados
// =========================================================

(function () {
    'use strict';

    var CHAVE_TAMANHO_FONTE = 'conecta-paulista:tamanho-fonte';
    var NIVEIS_DE_FONTE = [0.80, 0.90, 1, 1.10, 1.20, 1.30, 1.40];
    var NIVEL_PADRAO = 2; // 100%

    /**
     * Lê a preferência sem interromper o site quando o navegador bloqueia
     * localStorage (por exemplo, ao abrir um arquivo local em modo restrito).
     */
    function lerNivelDeFonte() {
        try {
            var nivelSalvo = Number(window.localStorage.getItem(CHAVE_TAMANHO_FONTE));
            if (Number.isInteger(nivelSalvo) && nivelSalvo >= 0 && nivelSalvo < NIVEIS_DE_FONTE.length) {
                return nivelSalvo;
            }
        } catch (erro) {
            // A página continua funcional mesmo sem armazenamento local.
        }
        return NIVEL_PADRAO;
    }

    function salvarNivelDeFonte(nivel) {
        try {
            window.localStorage.setItem(CHAVE_TAMANHO_FONTE, String(nivel));
        } catch (erro) {
            // Não é necessário exibir erro ao visitante se o navegador bloquear o armazenamento.
        }
    }

    function animacaoReduzida() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Faz a rolagem e leva o foco para o destino. O foco permite que leitores
     * de tela anunciem a região para a qual o atalho levou a pessoa.
     */
    function focarDestino(elemento) {
        if (!elemento) return;

        if (!elemento.hasAttribute('tabindex')) {
            elemento.setAttribute('tabindex', '-1');
        }

        elemento.scrollIntoView({
            behavior: animacaoReduzida() ? 'auto' : 'smooth',
            block: 'start'
        });

        try {
            elemento.focus({ preventScroll: true });
        } catch (erro) {
            elemento.focus();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // =========================================================
        // MENU PRINCIPAL (hambúrguer do cabeçalho)
        // =========================================================
        var menuPrincipalBotao = document.getElementById('menu-botao');
        var menuPrincipal = document.getElementById('menuPrincipal');

        function definirMenuPrincipal(aberto) {
            if (!menuPrincipal) return;
            menuPrincipal.classList.toggle('menu--aberto', aberto);
            if (menuPrincipalBotao) {
                menuPrincipalBotao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            }
        }

        if (menuPrincipalBotao && menuPrincipal) {
            menuPrincipalBotao.addEventListener('click', function () {
                var estaAberto = menuPrincipalBotao.getAttribute('aria-expanded') === 'true';
                definirMenuPrincipal(!estaAberto);
            });

            // Em telas pequenas, fecha o menu após a escolha de um link.
            menuPrincipal.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (window.matchMedia('(max-width: 1024px)').matches) {
                        definirMenuPrincipal(false);
                    }
                });
            });
        }

        // =========================================================
        // MENU DE ACESSIBILIDADE
        // Os dois botões (hambúrguer e ícone de acessibilidade) abrem
        // exatamente o mesmo painel e mantêm os atributos ARIA sincronizados.
        // =========================================================
        var barraAcessibilidade = document.getElementById('barraAcessibilidade');
        var btnMenuAcessibilidade = document.getElementById('btnMenuAcessibilidade');
        var btnAcessibilidadeGeral = document.getElementById('btnAcessibilidadeGeral');
        var menuAcessibilidade = document.getElementById('menuAcessibilidadeOculto');
        var btnFecharAcessibilidade = document.getElementById('btnFecharMenuAcessibilidade');
        var ultimoAcionadorAcessibilidade = null;

        function definirMenuAcessibilidade(aberto, acionador) {
            if (!menuAcessibilidade) return;

            menuAcessibilidade.classList.toggle('ativo', aberto);
            menuAcessibilidade.setAttribute('aria-hidden', aberto ? 'false' : 'true');

            // "inert" retira links e botões ocultos da ordem de tabulação.
            // O fallback cobre navegadores que ainda não suportam essa propriedade.
            if ('inert' in menuAcessibilidade) {
                menuAcessibilidade.inert = !aberto;
            } else {
                menuAcessibilidade.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function (item) {
                    if (!aberto) {
                        if (!item.hasAttribute('data-tabindex-original')) {
                            item.setAttribute('data-tabindex-original', item.getAttribute('tabindex') || '');
                        }
                        item.setAttribute('tabindex', '-1');
                    } else {
                        var tabindexOriginal = item.getAttribute('data-tabindex-original');
                        if (tabindexOriginal === '') item.removeAttribute('tabindex');
                        else if (tabindexOriginal !== null) item.setAttribute('tabindex', tabindexOriginal);
                    }
                });
            }

            [btnMenuAcessibilidade, btnAcessibilidadeGeral].forEach(function (botao) {
                if (botao) botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            });

            if (aberto && acionador) {
                ultimoAcionadorAcessibilidade = acionador;
            }
        }

        function alternarMenuAcessibilidade(evento) {
            evento.preventDefault();
            if (!menuAcessibilidade) return;
            var aberto = menuAcessibilidade.classList.contains('ativo');
            definirMenuAcessibilidade(!aberto, evento.currentTarget);
        }

        if (btnMenuAcessibilidade && menuAcessibilidade) {
            btnMenuAcessibilidade.addEventListener('click', alternarMenuAcessibilidade);
        }

        if (btnAcessibilidadeGeral && menuAcessibilidade) {
            btnAcessibilidadeGeral.addEventListener('click', alternarMenuAcessibilidade);
        }

        if (btnFecharAcessibilidade && menuAcessibilidade) {
            btnFecharAcessibilidade.addEventListener('click', function (evento) {
                evento.preventDefault();
                definirMenuAcessibilidade(false);
                (ultimoAcionadorAcessibilidade || btnMenuAcessibilidade || btnAcessibilidadeGeral).focus();
            });
        }

        // Garante que os controles internos não recebam Tab enquanto o painel
        // estiver recolhido já no primeiro carregamento da página.
        if (menuAcessibilidade) definirMenuAcessibilidade(false);

        function irParaMenuPrincipal() {
            if (!menuPrincipal) return;

            // Se a navegação estiver escondida pelo layout móvel, abre-a antes
            // de posicionar o foco no primeiro link visível.
            if (window.getComputedStyle(menuPrincipal).display === 'none') {
                definirMenuPrincipal(true);
            }

            var primeiroLink = menuPrincipal.querySelector('a');
            window.requestAnimationFrame(function () {
                focarDestino(primeiroLink || menuPrincipal);
            });
        }

        function irParaBuscador() {
            var campoBusca = document.getElementById('campoBusca');

            // O buscador existe somente na página inicial. Nas páginas de
            // serviço, o atalho leva corretamente à busca da página inicial.
            if (!campoBusca) {
                window.location.href = 'index.html#campoBusca';
                return;
            }
            focarDestino(campoBusca);
        }

        function irParaRodape() {
            focarDestino(document.getElementById('rodape') || document.querySelector('footer'));
        }

        function irParaMapaDoSite() {
            var mapaDoSite = document.getElementById('mapa-site');

            // O mapa está na página inicial. Mantém a mesma ação em todas as
            // páginas do projeto, inclusive nas páginas de categorias.
            if (!mapaDoSite) {
                window.location.href = 'index.html#mapa-site';
                return;
            }
            focarDestino(mapaDoSite);
        }

        var acoesDosAtalhos = {
            menu: irParaMenuPrincipal,
            busca: irParaBuscador,
            rodape: irParaRodape,
            'mapa-site': irParaMapaDoSite
        };

        if (menuAcessibilidade) {
            menuAcessibilidade.querySelectorAll('[data-atalho-acessibilidade]').forEach(function (atalho) {
                atalho.addEventListener('click', function (evento) {
                    var acao = acoesDosAtalhos[atalho.getAttribute('data-atalho-acessibilidade')];
                    if (!acao) return;

                    evento.preventDefault();
                    definirMenuAcessibilidade(false);
                    acao();
                });
            });
        }

        // Fecha os menus com Esc. É particularmente importante para quem usa
        // teclado, pois devolve o foco ao botão que abriu o painel.
        document.addEventListener('keydown', function (evento) {
            if (evento.key !== 'Escape') return;

            if (menuAcessibilidade && menuAcessibilidade.classList.contains('ativo')) {
                evento.preventDefault();
                definirMenuAcessibilidade(false);
                (ultimoAcionadorAcessibilidade || btnMenuAcessibilidade || btnAcessibilidadeGeral).focus();
                return;
            }

            if (menuPrincipal && menuPrincipal.classList.contains('menu--aberto')) {
                evento.preventDefault();
                definirMenuPrincipal(false);
                if (menuPrincipalBotao) menuPrincipalBotao.focus();
            }
        });

        // Fechar ao clicar fora impede que o painel fique sobre o conteúdo após
        // a pessoa continuar a navegação com o mouse ou toque.
        document.addEventListener('click', function (evento) {
            if (menuAcessibilidade && menuAcessibilidade.classList.contains('ativo') &&
                barraAcessibilidade && !barraAcessibilidade.contains(evento.target)) {
                definirMenuAcessibilidade(false);
            }

            if (menuPrincipal && menuPrincipal.classList.contains('menu--aberto') &&
                !menuPrincipal.contains(evento.target) &&
                (!menuPrincipalBotao || !menuPrincipalBotao.contains(evento.target))) {
                definirMenuPrincipal(false);
            }
        });

        // Atalhos convencionais de teclado: Alt + 1, 2, 3 e 4.
        // Os mesmos destinos podem ser acionados pelos links visíveis do painel.
        document.addEventListener('keydown', function (evento) {
            if (!evento.altKey || evento.ctrlKey || evento.metaKey) return;

            var acao = {
                '1': irParaMenuPrincipal,
                '2': irParaBuscador,
                '3': irParaRodape,
                '4': irParaMapaDoSite
            }[evento.key];

            if (acao) {
                evento.preventDefault();
                acao();
            }
        });

        // Ao chegar na página inicial por um dos atalhos que vem de uma
        // subpágina, transforma a âncora em foco real para leitores de tela.
        function tratarHashDeAcessibilidade() {
            if (window.location.hash === '#campoBusca') {
                var campoBusca = document.getElementById('campoBusca');
                if (campoBusca) focarDestino(campoBusca);
            }
            if (window.location.hash === '#mapa-site') {
                var mapaDoSite = document.getElementById('mapa-site');
                if (mapaDoSite) focarDestino(mapaDoSite);
            }
        }

        window.addEventListener('hashchange', tratarHashDeAcessibilidade);
        tratarHashDeAcessibilidade();

        // =========================================================
        // TAMANHO DA FONTE — A+, A e A-
        // =========================================================
        var btnAumentarFonte = document.getElementById('btnAumentarFonte');
        var btnResetarFonte = document.getElementById('btnResetarFonte');
        var btnDiminuirFonte = document.getElementById('btnDiminuirFonte');
        var nivelDeFonte = lerNivelDeFonte();
        var tamanhoOriginal = new WeakMap();
        var estiloInlineOriginal = new WeakMap();
        var seletorDeTexto = [
            'body', 'button', 'input', 'textarea', 'select', 'option', 'label',
            'a', 'p', 'span', 'li', 'dt', 'dd', 'td', 'th', 'caption', 'legend',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'small', 'strong', 'em', 'b', 'i',
            '[role="button"]'
        ].join(', ');
        var elementosDeTexto = Array.prototype.slice.call(document.querySelectorAll(seletorDeTexto));

        function registrarTamanhosOriginais() {
            elementosDeTexto.forEach(function (elemento) {
                if (!tamanhoOriginal.has(elemento)) {
                    tamanhoOriginal.set(elemento, parseFloat(window.getComputedStyle(elemento).fontSize));
                    estiloInlineOriginal.set(elemento, {
                        valor: elemento.style.getPropertyValue('font-size'),
                        prioridade: elemento.style.getPropertyPriority('font-size')
                    });
                }
            });
        }

        function anunciarTamanhoDaFonte() {
            var aviso = document.getElementById('avisoTamanhoFonte');
            if (!aviso) {
                aviso = document.createElement('div');
                aviso.id = 'avisoTamanhoFonte';
                aviso.className = 'visualmente-oculto';
                aviso.setAttribute('aria-live', 'polite');
                aviso.setAttribute('aria-atomic', 'true');
                document.body.appendChild(aviso);
            }
            aviso.textContent = 'Tamanho do texto: ' + Math.round(NIVEIS_DE_FONTE[nivelDeFonte] * 100) + ' por cento.';
        }

        function atualizarBotoesDeFonte() {
            var porcentagem = Math.round(NIVEIS_DE_FONTE[nivelDeFonte] * 100);

            if (btnAumentarFonte) {
                btnAumentarFonte.disabled = nivelDeFonte === NIVEIS_DE_FONTE.length - 1;
                btnAumentarFonte.setAttribute('aria-label', 'Aumentar fonte. Tamanho atual: ' + porcentagem + ' por cento');
            }
            if (btnDiminuirFonte) {
                btnDiminuirFonte.disabled = nivelDeFonte === 0;
                btnDiminuirFonte.setAttribute('aria-label', 'Diminuir fonte. Tamanho atual: ' + porcentagem + ' por cento');
            }
            if (btnResetarFonte) {
                btnResetarFonte.setAttribute('aria-pressed', nivelDeFonte === NIVEL_PADRAO ? 'true' : 'false');
                btnResetarFonte.setAttribute('aria-label', 'Restaurar tamanho normal da fonte. Tamanho atual: ' + porcentagem + ' por cento');
            }
        }

        /**
         * Aplica cada escala a partir do tamanho original registrado. Portanto,
         * A+ e A- nunca acumulam arredondamentos nem alteram o alto contraste.
         */
        function aplicarTamanhoDaFonte(novoNivel, anunciar) {
            nivelDeFonte = Math.max(0, Math.min(NIVEIS_DE_FONTE.length - 1, novoNivel));
            registrarTamanhosOriginais();

            elementosDeTexto.forEach(function (elemento) {
                var original = tamanhoOriginal.get(elemento);
                if (!Number.isFinite(original)) return;

                if (nivelDeFonte === NIVEL_PADRAO) {
                    var inlineOriginal = estiloInlineOriginal.get(elemento);
                    if (inlineOriginal && inlineOriginal.valor) {
                        elemento.style.setProperty('font-size', inlineOriginal.valor, inlineOriginal.prioridade);
                    } else {
                        elemento.style.removeProperty('font-size');
                    }
                } else {
                    elemento.style.setProperty('font-size', (original * NIVEIS_DE_FONTE[nivelDeFonte]).toFixed(2) + 'px');
                }
            });

            document.documentElement.setAttribute('data-tamanho-fonte', String(Math.round(NIVEIS_DE_FONTE[nivelDeFonte] * 100)));
            salvarNivelDeFonte(nivelDeFonte);
            atualizarBotoesDeFonte();
            if (anunciar) anunciarTamanhoDaFonte();
        }

        if (btnAumentarFonte) {
            btnAumentarFonte.addEventListener('click', function (evento) {
                evento.preventDefault();
                aplicarTamanhoDaFonte(nivelDeFonte + 1, true);
            });
        }

        if (btnResetarFonte) {
            btnResetarFonte.addEventListener('click', function (evento) {
                evento.preventDefault();
                aplicarTamanhoDaFonte(NIVEL_PADRAO, true);
            });
        }

        if (btnDiminuirFonte) {
            btnDiminuirFonte.addEventListener('click', function (evento) {
                evento.preventDefault();
                aplicarTamanhoDaFonte(nivelDeFonte - 1, true);
            });
        }

        // Reaplica a escolha feita em outra página do portal.
        aplicarTamanhoDaFonte(nivelDeFonte, false);

        // =========================================================
        // ALTO CONTRASTE
        // Mantido separado do botão A (fonte normal), para que restaurar a
        // fonte não desligue um recurso de contraste já escolhido pela pessoa.
        // =========================================================
        var btnContraste = document.getElementById('btnContraste');
        if (btnContraste) {
            btnContraste.addEventListener('click', function (evento) {
                evento.preventDefault();
                document.body.classList.toggle('alto-contraste');
            });
        }
    });
}());

// =========================================================
// Serviços Municipais — categorias expansíveis (index.html)
// =========================================================
function alternarCategoriaServico(categoria) {
    var botoes = document.querySelectorAll('.servico-cat-btn');
    var paineis = document.querySelectorAll('.servico-painel');
    var btnClicado = document.querySelector('.servico-cat-btn[data-categoria="' + categoria + '"]');
    var painelClicado = document.getElementById('painel-' + categoria);
    if (!btnClicado || !painelClicado) return;

    var jaAberto = btnClicado.classList.contains('ativo');

    botoes.forEach(function (botao) {
        botao.classList.remove('ativo');
        botao.setAttribute('aria-expanded', 'false');
    });

    paineis.forEach(function (painel) {
        painel.classList.remove('aberto');
        painel.style.maxHeight = null;
    });

    if (!jaAberto) {
        btnClicado.classList.add('ativo');
        btnClicado.setAttribute('aria-expanded', 'true');
        painelClicado.classList.add('aberto');
        painelClicado.style.maxHeight = painelClicado.scrollHeight + 'px';
    }
}

// =========================================================
// Modal de solicitação (subpáginas)
// =========================================================
function gerarProtocolo() {
    var numero = Math.floor(Math.random() * 900000) + 100000;
    return '2026-' + numero.toString().padStart(6, '0');
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

function enviarSolicitacao(evento) {
    evento.preventDefault();
    fecharModal();

    var protocolo = gerarProtocolo();
    var protocoloEl = document.getElementById('confirm-protocolo');
    if (protocoloEl) protocoloEl.textContent = 'Protocolo nº ' + protocolo;

    var confirmacao = document.getElementById('modal-confirmacao');
    if (confirmacao) confirmacao.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharConfirmacao() {
    var confirmacao = document.getElementById('modal-confirmacao');
    if (confirmacao) confirmacao.classList.remove('ativo');
    document.body.style.overflow = '';
}

document.addEventListener('click', function (evento) {
    if (evento.target.classList && evento.target.classList.contains('modal-overlay')) {
        evento.target.classList.remove('ativo');
        document.body.style.overflow = '';
    }
});
