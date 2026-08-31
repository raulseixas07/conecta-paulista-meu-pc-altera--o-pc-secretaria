# Implementação do menu de acessibilidade

## Arquivo correto do projeto

O arquivo JavaScript que já está referenciado pelos HTMLs é **`scripts.js`** (com `s`):

```html
<script src="./scripts.js"></script>
```

Por isso, as funções foram aplicadas em `scripts.js`; não foi criado um segundo `script.js`, pois ele não seria carregado pelo navegador. Todos os nove arquivos HTML do projeto já apontavam para esse mesmo arquivo e continuam apontando para ele.

---

## O que foi implementado

| Controle | Resultado |
|---|---|
| Hambúrguer **MENU ACESSIBILIDADE** | Abre e fecha o painel azul dos quatro atalhos. Atualiza `aria-expanded` e `aria-hidden`. |
| Ícone **Recursos de Acessibilidade** | Abre e fecha o mesmo painel do hambúrguer; os dois botões ficam sincronizados. |
| **A+** | Aumenta o texto em etapas de 10%, até 140%. |
| **A** | Restaura somente o texto para 100%. Não desativa o alto contraste. |
| **A-** | Diminui o texto em etapas de 10%, até 80%. |
| Fechar (seta para cima) | Recolhe o painel e devolve o foco ao botão que o abriu. |
| Ir para Menu — 1 | Abre a navegação principal caso ela esteja recolhida em celular e leva o foco ao primeiro link. |
| Ir para Buscador — 2 | Foca o campo de busca na página inicial. Nas páginas de serviços, abre `index.html#campoBusca`. |
| Ir para Rodapé — 3 | Rola até o rodapé e coloca nele o foco de teclado/leitor de tela. |
| Ir para o Mapa do Site — 4 | Rola até o mapa do site criado na página inicial. Nas subpáginas, abre `index.html#mapa-site`. |
| Teclado | `Alt + 1`, `Alt + 2`, `Alt + 3` e `Alt + 4` executam respectivamente os mesmos quatro atalhos. `Esc` fecha o menu aberto. |

A preferência de fonte é salva no navegador por `localStorage`. Assim, ao navegar entre a página inicial e uma página de serviço, o tamanho escolhido continua aplicado. Caso o navegador bloqueie armazenamento local, os botões continuam funcionando apenas na página atual.

---

## Funções principais adicionadas em `scripts.js`

### 1. `definirMenuAcessibilidade(aberto, acionador)`

É a função central do painel de acessibilidade. Ela adiciona/remove a classe `ativo`, atualiza `aria-hidden` no painel e `aria-expanded` nos **dois** controles que abrem o menu.

Também aplica `inert` enquanto o menu está fechado. Isso é importante: links invisíveis não entram na ordem da tecla `Tab`. Para navegadores antigos, há um fallback que aplica `tabindex="-1"` nos controles escondidos.

```js
function definirMenuAcessibilidade(aberto, acionador) {
    menuAcessibilidade.classList.toggle('ativo', aberto);
    menuAcessibilidade.setAttribute('aria-hidden', aberto ? 'false' : 'true');

    [btnMenuAcessibilidade, btnAcessibilidadeGeral].forEach(function (botao) {
        if (botao) botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
}
```

### 2. `alternarMenuAcessibilidade(evento)`

É usada no clique do hambúrguer do menu de acessibilidade e no clique do ícone de recursos. Ela descobre se o painel está aberto e envia o estado oposto para a função anterior. Dessa forma, os dois botões fazem exatamente a mesma ação.

### 3. `focarDestino(elemento)`

Executa a rolagem suave (ou sem animação quando a pessoa configurou redução de movimento no sistema) e coloca foco no destino. O foco é a diferença entre apenas “rolar a tela” e oferecer uma navegação acessível para teclado e leitor de tela.

### 4. `irParaMenuPrincipal()`, `irParaBuscador()`, `irParaRodape()` e `irParaMapaDoSite()`

São as quatro ações do painel. Cada link tem agora o atributo `data-atalho-acessibilidade`, por exemplo:

```html
<a href="#rodape" class="atalho-acessibilidade"
   data-atalho-acessibilidade="rodape">
  Ir para Rodapé <span class="badge-num" aria-hidden="true">3</span>
</a>
```

O JavaScript associa esse valor à função correta:

```js
var acoesDosAtalhos = {
    menu: irParaMenuPrincipal,
    busca: irParaBuscador,
    rodape: irParaRodape,
    'mapa-site': irParaMapaDoSite
};
```

O número visual foi marcado com `aria-hidden="true"`, porque o texto do link já descreve a ação. Isso evita que o leitor de tela fale informações redundantes.

### 5. `aplicarTamanhoDaFonte(novoNivel, anunciar)`

Controla **A+**, **A** e **A-**. Há sete níveis: 80%, 90%, 100%, 110%, 120%, 130% e 140%.

Antes de alterar qualquer coisa, a função guarda o tamanho original calculado de cada elemento textual. Depois ela sempre calcula o novo valor a partir desse tamanho original. Portanto, clicar em A+ várias vezes não cria arredondamentos acumulados nem faz o tamanho “desandar”.

```js
var NIVEIS_DE_FONTE = [0.80, 0.90, 1, 1.10, 1.20, 1.30, 1.40];

function aplicarTamanhoDaFonte(novoNivel, anunciar) {
    nivelDeFonte = Math.max(0, Math.min(NIVEIS_DE_FONTE.length - 1, novoNivel));

    elementosDeTexto.forEach(function (elemento) {
        var original = tamanhoOriginal.get(elemento);
        elemento.style.setProperty(
            'font-size',
            (original * NIVEIS_DE_FONTE[nivelDeFonte]).toFixed(2) + 'px'
        );
    });
}
```

Na posição normal (100%), os estilos de fonte temporários são removidos e o CSS original volta a controlar a tipografia. Há também uma mensagem `aria-live`, por exemplo “Tamanho do texto: 120 por cento”, para quem usa leitor de tela. Os botões A+ e A- ficam desabilitados ao chegar no limite correspondente.

### 6. Alto contraste mantido independente

O clique do contraste continua apenas alternando a classe já existente:

```js
document.body.classList.toggle('alto-contraste');
```

A alteração proposital foi retirar do botão **A** a linha que desligava o alto contraste. Restaurar fonte e contraste são preferências diferentes; agora a pessoa pode usar fonte normal com alto contraste ligado.

### 7. Menu principal responsivo

O hambúrguer do cabeçalho principal ganhou fechamento por `Esc`, fechamento ao clicar fora e fechamento após selecionar um link no layout de celular/tablet. O atalho “Ir para Menu” abre esse menu quando necessário antes de levar o foco ao primeiro item.

---

## Alterações de HTML aplicadas

As alterações foram replicadas em:

- `index.html`
- `limpeza-urbana.html`
- `arvores-areas-verdes.html`
- `iluminacao-publica.html`
- `ruas-pavimentacao.html`
- `drenagem-chuvas.html`
- `agua-esgoto-saneamento.html`
- `transito-mobilidade.html`
- `pracas-parques.html`

### Atributos ARIA no botão de recursos

O botão com o ícone de acessibilidade recebeu:

```html
aria-expanded="false" aria-controls="menuAcessibilidadeOculto"
```

Agora ele informa ao leitor de tela qual painel controla e se o painel está aberto.

### Destinos reais para os atalhos

Todos os rodapés receberam `id="rodape" tabindex="-1"`, permitindo foco programático. O atalho de buscador aponta para `index.html#campoBusca`, pois o campo só existe na página inicial. O mapa do site também aponta para a página inicial a partir das subpáginas.

### Mapa do site real

Foi criada em `index.html` a seção `#mapa-site`, com links para as áreas e páginas de serviços do portal. Assim, o botão 4 não aponta mais incorretamente para a área de serviços municipais: ele chega a um mapa de navegação de fato.

---

## Alterações de CSS aplicadas em `estilos.css`

1. Estado visual para os botões que estão com `aria-expanded="true"`.
2. Aparência de limite atingido para A+ e A- desabilitados.
3. Maior altura disponível para o menu de acessibilidade quando a fonte está aumentada.
4. `scroll-margin-top` nos destinos para que não fiquem ocultos atrás do cabeçalho fixo/sticky.
5. Estilos responsivos do novo mapa do site: quatro colunas em desktop, duas em tablet e uma no celular.

---

## Como testar

1. Abra `index.html` por um servidor local ou hospedagem.
2. Clique no hambúrguer **MENU ACESSIBILIDADE** e depois no ícone de acessibilidade: ambos devem abrir/fechar o mesmo painel.
3. Clique em **A+** repetidamente: o texto aumenta até 140%; no limite o botão fica indisponível. Repita com **A-** até 80% e use **A** para voltar a 100%.
4. Ligue o alto contraste, clique em **A** e confirme que o contraste continua ligado.
5. Teste os quatro links do painel. Abra também qualquer página de serviço e teste 2 e 4: ambos devem levar à página inicial no destino correto.
6. Navegue com `Tab`; enquanto o painel estiver fechado, seus quatro atalhos e botão de fechar não podem receber foco.
7. Com o painel aberto, pressione `Esc`; ele deve fechar e o foco deve retornar ao botão de abertura.
8. Teste `Alt + 1`, `Alt + 2`, `Alt + 3` e `Alt + 4`.
