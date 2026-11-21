# jogoSuperlegal

Jogo de sobrevivência de zumbis em 2D pixel art que roda no navegador, feito com Node.js.
Estética dark e macabra com contraste entre **verde neon** e **rosa neon**.

> Este README é o registro vivo do planejamento: toda ideia ou etapa nova é adicionada aqui.

**Status atual:** base, menu, floresta, sobrevivência por noites, combate, moedas e loja jogáveis.

---

## Como rodar

```bash
npm install
npm start
```

Abre em [http://localhost:3000](http://localhost:3000).

Para desenvolvimento com recarga automática do servidor:

```bash
npm run dev
```

### Controles

| Ação | Comando |
|---|---|
| Mover | `W` `A` `S` `D` ou setas |
| Atacar | segurar o botão esquerdo do mouse (mira no cursor) |
| Voltar / fechar | `ESC` nos menus |

---

## Regras do jogo

### Noites e zumbis

- O jogo é dividido em **noites (dias)**. A partida sempre começa no **dia 1**.
- O **dia 1 é o tutorial** e tem **1 zumbi**.
- A cada novo dia entram **+2 zumbis**: dia 1 = 1, dia 2 = 3, dia 3 = 5...
- A noite acaba quando todos os zumbis dela morrem.
- A cada noite, os zumbis ficam **1% mais resistentes e 1% mais fortes**:
  - vida base 30 → `30 × (1 + 0,01 × (dia − 1))`
  - dano base 10 → `10 × (1 + 0,01 × (dia − 1))`

### Moedas

- **1 moeda a cada 2 zumbis mortos** (a contagem continua entre noites).
- **5 moedas por noite sobrevivida**.
- As moedas ficam salvas e aparecem no **canto superior direito do menu**.

### Ferramentas

Escolhidas no início de cada partida. As duas causam **5 de dano** base:

| Ferramenta | Dano | Recarga | Alcance |
|---|---|---|---|
| Faca | 5 | 0,30 s | curto |
| Machado | 5 | 0,62 s | maior (golpe em arco mais amplo) |

### Loja e poções

- O botão **$ LOJA** no menu abre a loja.
- Item atual: **Poção de Ferramenta** — soma **+5 de dano** na faca e no machado.
- Uma poção é liberada a cada **10 dias sobrevividos** (melhor dia): dia 10 libera a 1ª, dia 20 a 2ª, e assim por diante.
- Preço: **$10** cada.

### Progresso salvo

`localStorage` guarda: moedas, melhor dia alcançado e quantidade de poções compradas.

---

## Stack

- **Node.js + Express 5** — servidor de arquivos estáticos
- **HTML + CSS + JavaScript puro** — sem framework e sem etapa de build
- **Canvas 2D** — cenário e partida em resolução interna baixa, escalada com `image-rendering: pixelated`
- **DOM/CSS** — menus, HUD, loja e escolha de ferramenta
- **localStorage** — moedas, melhor dia e poções
- **Fonte Press Start 2P** — self-hosted em `public/assets/fonts`

---

## Estrutura

```
jogoSuperlegal/
├── server.js                 # servidor Express
├── package.json
├── README.md
└── public/
    ├── index.html            # menu, HUD, loja, escolha de ferramenta, game over
    ├── css/style.css         # tema neon/macabro, HUD e painéis
    ├── js/
    │   ├── main.js           # loop principal, estados e telas
    │   ├── scene.js          # floresta animada do menu
    │   ├── game.js           # partida: player, zumbis, noites, combate
    │   └── save.js           # persistência em localStorage
    └── assets/
        └── fonts/            # Press Start 2P (woff2)
```

---

## Identidade visual

| Uso | Cor |
|---|---|
| Fundo | `#050505` |
| Verde neon | `#39ff14` |
| Rosa neon | `#ff2e88` |
| Sangue | `#8b0000` |
| Osso / texto secundário | `#d8d8d0` |

- **Menu:** floresta de pinheiros em silhueta, lua de sangue, névoa, brasas, sangue escorrendo, título com glow e flicker, zumbis humanos macabros (olhos verdes ou rosas) andando ao fundo.
- **Partida:** clareira na floresta vista de cima, copas escuras nas bordas, vaga-lumes, sangue no chão e zumbis humanos com ossos e sangue à mostra.
- **Botões:** **JOGAR** verde neon retangular; **$ LOJA** menor, rosa, com símbolo de dinheiro.

---

## Planejamento

### Parte 1 — Base + menu macabro ✅

- [x] `package.json` + `server.js` (Express, `npm start`)
- [x] Menu com título glow, botões e navegação
- [x] Cenário animado de floresta (lua de sangue, névoa, brasas, sangue no topo)
- [x] Zumbis redesenhados: humanos, macabros, com olhos brilhantes
- [x] Botão **JOGAR** centralizado e retangular (verde/preto)
- [x] Botão **$ LOJA** menor, rosa, com símbolo de dinheiro
- [x] Contador de moedas no canto superior direito do menu

### Parte 2 — Sobrevivência ✅

- [x] Movimento em 8 direções (WASD/setas)
- [x] Arena de floresta com limite de borda
- [x] Zumbis com perseguição, separação e ataque
- [x] Vida, dano, invencibilidade curta e morte
- [x] HUD: dia, zumbis da noite, vida e moedas
- [x] Tutorial no dia 1 com 1 zumbi

### Parte 3 — Combate e progressão ✅

- [x] Ataque com mira no mouse, arco de golpe e knockback
- [x] Sangue no chão, partículas e tremor de tela
- [x] +2 zumbis por dia e +1% de resistência/dano por noite
- [x] 1 moeda a cada 2 mortes e +5 por noite sobrevivida
- [x] Escolha de ferramenta no início (faca ou machado, 5 de dano)
- [x] Tela de game over com dia alcançado e moedas ganhas

### Parte 4 — Loja ✅

- [x] Loja aberta pelo botão **$ LOJA**
- [x] Poção de ferramenta (+5 de dano) liberada a cada 10 dias
- [x] Compra com moedas e efeito permanente
- [x] Save em `localStorage`

### Parte 5 — Polimento

- [ ] Áudio (golpes, dano, ambiente) via WebAudio
- [ ] Pause durante a partida
- [ ] Novos itens na loja (além das poções)
- [ ] Balanceamento fino das noites
- [ ] Seleção/loja de classes (ficou fora desta etapa; a loja hoje vende poções)

---

## Decisões técnicas

- Canvas com resolução interna de 1/4 da tela: pixels grandes e nítidos em qualquer monitor.
- Cenário do menu desenhado por código com PRNG de semente fixa.
- Partida em canvas separado por estado (`menu`, `tool`, `playing`, `shop`, `gameover`), com um único `requestAnimationFrame`.
- Zumbis e jogador desenhados por sprites de texto (pixel a pixel) — fáceis de editar.
- Fundo da arena e manchas de sangue ficam em canvas offscreen para não redesenhar a floresta a cada frame.
- Dano e resistência escalam por noite conforme a regra de 1%; a “poção” da loja é a melhoria de ferramenta.
