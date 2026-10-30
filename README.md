# INFECTED

Jogo de sobrevivência de zumbis em 2D pixel art que roda no navegador, feito com Node.js.
Estética dark e macabra com contraste entre **verde neon** e **rosa neon**.

> Este README é o registro vivo do planejamento: toda ideia ou etapa nova é adicionada aqui.

**Status atual:** login com banco de dados, menu, floresta, dias de 30 segundos com cura, noites de combate, arsenal com raridades, baú dourado a cada 2 dias, chefe a cada 10 dias, loja de ferramentas, poções e skins com ferramenta inicial, inventário completo e conquistas.

---

## Como rodar

Requer **Node.js 22.5 ou mais novo** (o banco usa `node:sqlite`, nativo do Node).

```bash
npm install
npm start
```

Abre em [http://localhost:3000](http://localhost:3000).

Para desenvolvimento com recarga automática do servidor:

```bash
npm run dev
```

O banco é criado sozinho em `data/jogo.db` na primeira execução.

### Controles

| Ação | Comando |
|---|---|
| Mover | `W` `A` `S` `D` ou setas |
| Atacar | segurar o botão esquerdo do mouse (mira no cursor) |
| Avançar tutorial | `PRÓXIMO` / `Enter` / `Espaço` |
| Voltar / fechar | `ESC` nos menus |

---

## Conta e login

- É obrigatório **entrar ou criar conta** antes de jogar.
- **Nome:** 3 a 16 caracteres, apenas letras, números e `_`. É **único** (não diferencia maiúsculas de minúsculas).
- **Senha:** 8 a 64 caracteres, apenas letras/números, com **pelo menos 1 número**.
- A senha é guardada com **scrypt + salt**; o servidor nunca vê a senha em texto puro.
- A sessão fica em um token `Bearer` válido por **30 dias**, guardado no `localStorage`.
- **Todo o progresso fica no servidor** (SQLite): moedas, melhor dia, poções, ferramentas compradas, personagens, personagem equipado, inventário e conquistas. O servidor é a fonte da verdade dos valores.

---

## Regras do jogo

### Tutorial do primeiro dia

- Na **primeira partida**, antes do dia 1 começar, abre um **tutorial em 6 passos**: mover, mirar/atacar, os 30 s de dia com cura, a noite, o baú dourado e o progresso (loja/inventário).
- O tutorial **pausa o jogo** (o relógio do dia não corre) e pode ser avançado com **PRÓXIMO**, `Enter`, `Espaço` ou pulado com **PULAR TUTORIAL** / `ESC`.
- Depois de concluído (ou pulado) ele não abre sozinho de novo; o botão **COMO JOGAR** no menu abre o tutorial a qualquer momento.
- Durante o dia 1, avisos curtos no HUD reforçam os controles e a meta da primeira noite.

### Dia, noite, dificuldade e chefes

- O jogo é dividido em **dias**. A partida sempre começa no **dia 1**.
- Cada dia começa com **30 segundos de luz**: os zumbis somem e a vida do jogador **se regenera sozinha** (100% da vida ao longo dos 30 s).
- Quando o dia termina, começa a **noite**: os zumbis nascem e a noite só acaba quando todos morrem.
- O **dia 1 é o tutorial** e tem **1 zumbi**.
- A cada novo dia entram **+2 zumbis**: dia 1 = 1, dia 2 = 3, dia 3 = 5...
- A dificuldade cresce **todo dia**:
  - vida: `30 × (1 + 0,08 × (dia − 1))` → **+8% por dia**
  - dano: `10 × (1 + 0,05 × (dia − 1))` → **+5% por dia**
  - velocidade: `+2% por dia` (até +80%)
  - quantidade: +2 zumbis por noite
- **Chefe a cada 10 dias** (dias 10, 20, 30...). A noite do chefe tem os zumbis normais + 1 chefe.
  - A vida do chefe é proporcional ao **DPS do jogador** (`dano ÷ recarga`), mirando em uma luta de alguns segundos.
  - O dano do chefe é proporcional ao **dano por golpe** do jogador.
  - O chefe bate forte e, a cada ~3,5 s, dá uma **pancada no chão** com onda de choque.
  - A barra de vida do chefe aparece no topo da tela; derrotá-lo dá um bônus de moedas (`15 + 2 × dia`).

### Moedas

- **1 moeda a cada 2 zumbis mortos** (a contagem continua entre noites).
- **5 moedas por noite sobrevivida** (multiplicado pelo bônus do personagem).
- **Bônus do chefe:** `15 + 2 × dia`, também multiplicado pelo personagem.
- As moedas ficam salvas no banco e aparecem no **canto superior direito do menu** e no HUD.

### Ferramentas

Escolhidas no início de cada partida. Cada ferramenta tem **dano próprio**, recarga e alcance. As mais poderosas são classificadas como **RARA** e **MÍTICA**:

| Ferramenta | Raridade | Dano base | Recarga | Observação |
|---|---|---|---|---|
| Faca | COMUM | 5 | 0,30 s | rápida, alcance curto (vem de graça) |
| Machado | COMUM | 5 | 0,62 s | arco amplo, maior alcance |
| Taco de beisebol | COMUM | 8 | 0,55 s | arco amplo e bom knockback |
| Facão | COMUM | 9 | 0,38 s | rápido e equilibrado |
| Katana | RARA | 18 | 0,30 s | rápida, ampla e forte (loja) |
| Lança envenenada | RARA | 15 | 0,50 s | golpe preciso e longo, acerta até 2 zumbis |
| Arma | RARA | 30 | 0,90 s | tiro cerrado, acerta 1 alvo por disparo |
| Motosserra | RARA | 26 | 0,34 s | -18% de velocidade |
| Besta | RARA | 34 | 1,15 s | recarga lenta |
| Submetralhadora | RARA | 12 | 0,14 s | dano baixo por tiro, cadência alta |
| Minigun | MÍTICA | 16 | 0,09 s | cadência altíssima, -25% de velocidade (loja) |
| Canhão de plasma | MÍTICA | 60 | 1,05 s | recarga lenta, exclusivo do baú dourado |
| Lança-chamas | MÍTICA | 20 | 0,24 s | cone de fogo que atinge todos na área |
| Foice | MÍTICA | 30 | 0,80 s | -10% de velocidade |
| Marra | MÍTICA | 44 | 1,20 s | -20% de velocidade |

**Disponibilidade:** faca sempre disponível; machado, taco, facão, katana e minigun liberam quando **comprados na loja**; ferramentas ganhas no **baú dourado** também ficam disponíveis. As raras/míticas "de sorte" entram de acordo com o seu **melhor dia**:

| Ferramenta | Aparece a partir do | Chance |
|---|---|---|
| Lança envenenada | dia 3 | 25% no dia 3, +3% por dia (máx. 75%) |
| Arma | dia 12 | 15% no dia 12, +2,5% por dia (máx. 60%) |
| Lança-chamas | dia 12 | 5% no dia 12, subindo até ~22% antes do dia 30; 30% no dia 30 e +2% por dia (máx. 70%) |

O sorteio acontece ao abrir a escolha de ferramenta. As cartas mostram raridade, dano real e o motivo de estarem bloqueadas (dia mínimo, sorte que não saiu ou “compre na loja”).

### Baú dourado (a cada 2 dias)

- Ao **amanhecer dos dias 3, 5, 7, 9, 11...** nasce um **baú dourado no chão** da arena.
- Basta **pisar no baú** durante os 30 segundos de luz para abrir.
- A recompensa é sorteada **no servidor**, que registra o dia aberto em `player_chests`: **uma recompensa por jogador por dia de baú** (evita farmar entrando e saindo da partida).
- O baú entrega uma ferramenta **RARA ou MÍTICA** que você ainda não possui. Se você já tiver todas, o baú vira **+$25**.
- A ferramenta ganha vai direto para o inventário e fica disponível na escolha do início da próxima partida.

### Progressão por noite

- A cada noite sobrevivida o jogador ganha **+4 de dano** com a ferramenta e **+1 de resistência**.
- A resistência reduz o dano recebido em valor fixo, mas cada golpe sempre causa **pelo menos 1** de dano.
- O HUD mostra os valores atuais de **DANO** e **RES**, além da **FASE** (dia com contagem regressiva ou noite).

### Inventário e conquistas

O botão **▤ INVENTÁRIO** fica no **canto superior esquerdo do menu** e abre um painel com duas seções:

- **Itens:** todas as ferramentas compradas ou ganhas, todas as skins compradas e as poções (com quantidade).
- **Conquistas:** progresso de cada conquista, com barra e estado (bloqueada/desbloqueada).

Conquistas disponíveis:

- **Dia 10, 20, 30... até 100** — sobreviva até cada marco de 10 dias.
- **10, 50, 100, 250, 500, 1000 e 2500 zumbis mortos** (total acumulado da conta).

Ao desbloquear uma conquista, um aviso dourado aparece no topo da tela.

### Loja

O botão **$ LOJA** no menu abre a loja, dividida em três seções:

**Ferramentas** (compra única, liberam a ferramenta para escolher no começo da partida):

| Ferramenta | Raridade | Preço |
|---|---|---|
| Machado | COMUM | $30 |
| Taco de beisebol | COMUM | $45 |
| Facão | COMUM | $55 |
| Katana | RARA | $90 |
| Minigun | MÍTICA | $160 |

**Personagens (skins)** — cada um tem uma vantagem (e às vezes uma desvantagem) e **vem com uma ferramenta inicial**:

| Personagem | Preço | Vantagem | Ferramenta inicial |
|---|---|---|---|
| Sobrevivente | grátis | equilibrado, sem bônus | Faca |
| Corredor | $120 | +15% de velocidade | Facão |
| Médico | $150 | +40 de vida e +1 de resistência | Taco |
| Brutamontes | $180 | +20 de vida e +12% de dano, mas -5% de velocidade | Machado |
| Ladrão | $200 | +50% de moedas, mas -10 de vida e -5% de dano | Lança |
| Tanque | $220 | +3 de resistência, mas -10% de velocidade | Katana |

Cada personagem tem também sua própria paleta de cores no sprite. O personagem equipado muda vida máxima, velocidade, dano, resistência e ganho de moedas na partida. Dá para trocar de personagem a qualquer momento na loja. Ao comprar uma skin, a ferramenta inicial dela é **adicionada ao inventário** (se você ainda não tiver).

**Melhoria** — **Poção de Ferramenta**: soma **+5 de dano em todas as ferramentas**. Uma poção é liberada a cada **10 dias sobrevividos** (melhor dia): dia 10 libera a 1ª, dia 20 a 2ª, e assim por diante. Preço: **$10** cada.

### Progresso salvo

O banco SQLite (`data/jogo.db`) guarda: conta, moedas, melhor dia, mortes, partidas, ferramentas, personagens, poções, **inventário** (`player_items`), **conquistas** (`player_achievements`) e **baús abertos** (`player_chests`). Ao entrar em qualquer navegador, o progresso vem do servidor.

---

## Stack

- **Node.js + Express 5** — API e servidor de arquivos estáticos
- **`node:sqlite`** — banco de dados local, sem dependência externa
- **HTML + CSS + JavaScript puro** — sem framework e sem etapa de build
- **Canvas 2D** — cenário e partida em resolução interna baixa, escalada com `image-rendering: pixelated`
- **DOM/CSS** — menus, HUD, loja, escolha de ferramenta, inventário e conquistas
- **Fonte Press Start 2P** — self-hosted em `public/assets/fonts`

---

## Estrutura

```
infected/
├── server.js                 # Express + rotas da API + estáticos
├── db.js                     # SQLite: contas, sessões, compras, inventário, conquistas, baús
├── package.json
├── README.md
├── data/
│   └── jogo.db               # criado automaticamente
└── public/
    ├── index.html            # login, menu, HUD, inventário, loja, escolha, game over
    ├── css/style.css         # tema neon/macabro, HUD, loja, inventário e painéis
    ├── js/
    │   ├── main.js           # loop principal, estados, login, loja, inventário e HUD
    │   ├── scene.js          # floresta animada do menu
    │   ├── game.js           # partida: player, zumbis, chefe, dia/noite, baú e combate
    │   └── save.js           # cliente da API e estado local do jogador
    └── assets/
        └── fonts/            # Press Start 2P (woff2)
```

### API

| Rota | Método | Função |
|---|---|---|
| `/api/auth/register` | POST | cria conta (nome único) e devolve token |
| `/api/auth/login` | POST | entra e devolve token |
| `/api/auth/logout` | POST | invalida a sessão atual |
| `/api/state` | GET | jogador + catálogo da loja + inventário + conquistas |
| `/api/inventory` | GET | inventário e conquistas atualizados |
| `/api/run/report` | POST | soma moedas, mortes, partidas e melhor dia; libera conquistas |
| `/api/chest/open` | POST | abre o baú do dia (recompensa sorteada no servidor) |
| `/api/shop/tool` | POST | compra ferramenta |
| `/api/shop/potion` | POST | compra poção liberada pelo melhor dia |
| `/api/shop/character` | POST | compra personagem e recebe a ferramenta inicial |
| `/api/character/select` | POST | equipa personagem comprado |

Todas as rotas, menos cadastro/login, exigem `Authorization: Bearer <token>`.

Para depurar no console do navegador, abra com `?debug=1` para expor `window.__jogo` (jogo, save e loja).

---

## Identidade visual

| Uso | Cor |
|---|---|
| Fundo | `#050505` |
| Verde neon | `#39ff14` |
| Rosa neon | `#ff2e88` |
| Sangue | `#8b0000` |
| Osso / texto secundário | `#d8d8d0` |
| Ouro (chefe, baú, conquistas) | `#ffb000` |

- **Menu:** floresta de pinheiros em silhueta, lua de sangue, névoa, brasas, sangue escorrendo, título com glow e flicker, zumbis humanos macabros (olhos verdes ou rosas) andando ao fundo.
- **Partida:** clareira na floresta vista de cima, copas escuras nas bordas, vaga-lumes, sangue no chão e zumbis humanos com ossos e sangue à mostra.
- **Botões:** **JOGAR** verde neon retangular; **$ LOJA** menor, rosa, com símbolo de dinheiro.
- **Chefe:** sprite em dobro com coroa dourada, aura rosa pulsante, barra de vida própria e onda de choque.
- **Baú dourado:** caixa dourada pulsante com brilho no chão da arena; um aviso no HUD indica quando ele está disponível.
- **Inventário:** painel em grade com ícones das ferramentas/skins, barras de conquistas e aviso dourado de conquista desbloqueada.
- **Personagens:** cada skin troca as cores do sprite (jaqueta, pele e detalhe).

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
- [x] HUD: dia, zumbis da noite, dano, resistência, vida e moedas
- [x] Tutorial no dia 1 com 1 zumbi

### Parte 3 — Combate e progressão ✅

- [x] Ataque com mira no mouse, arco de golpe e knockback
- [x] Sangue no chão, partículas e tremor de tela
- [x] +2 zumbis por dia e dificuldade crescente por noite
- [x] 1 moeda a cada 2 mortes e +5 por noite sobrevivida
- [x] Escolha de ferramenta no início (faca ou machado, 5 de dano)
- [x] Tela de game over com dia alcançado e moedas ganhas

### Parte 4 — Loja ✅

- [x] Loja aberta pelo botão **$ LOJA**
- [x] Poção de ferramenta (+5 de dano) liberada a cada 10 dias
- [x] Compra com moedas e efeito permanente
- [x] Save do progresso

### Parte 5 — Polimento ✅

- [x] Animação de caminhada do personagem (pernas, braços e balanço do corpo)
- [x] Ferramenta desenhada na mão, com animação de golpe em arco
- [x] Golpe atinge também zumbis colados ao redor do jogador, mesmo fora da mira
- [x] Arsenal expandido: taco, facão, lança envenenada, arma e lança-chamas
- [x] Raridades (comum/rara/mítica) com sorte de aparição por melhor dia
- [x] Dano por ferramenta +4 de dano e +1 de resistência a cada noite

### Parte 6 — Conta, loja e chefes ✅

- [x] Login/cadastro com nome único e senha validada
- [x] Banco SQLite (`data/jogo.db`) com sessões de 30 dias
- [x] Progresso e compras validados no servidor
- [x] Compra de ferramentas (machado, taco, facão, katana e minigun)
- [x] Chefe a cada 10 dias, com vida/dano proporcionais ao jogador
- [x] Dificuldade diária (+8% vida, +5% dano, +2% velocidade)
- [x] Personagens (skins) compráveis com vantagens, paleta própria e ferramenta inicial
- [x] Equipar/trocar personagem na loja
- [x] Botão de sair da conta

### Parte 7 — INFECTED ✅

- [x] Nome do jogo alterado para **INFECTED**
- [x] Dias de **30 segundos** com **regeneração de vida**
- [x] **Baú dourado** no chão a cada 2 dias (dias 3, 5, 7...)
- [x] Recompensa do baú sorteada no servidor, uma por dia por conta
- [x] Ferramentas **RARAS** e **MÍTICAS** (katana, minigun, canhão de plasma)
- [x] Skins com ferramenta inicial e vantagens
- [x] **Inventário** no canto superior esquerdo do menu
- [x] **Tutorial do primeiro dia** em 6 passos + botão **COMO JOGAR** no menu
- [x] **Conquistas** por dias sobrevividos e zumbis mortos
- [x] Senha com **8 a 64 caracteres** e pelo menos 1 número
- [ ] Áudio (golpes, dano, ambiente) via WebAudio
- [ ] Pause durante a partida
- [ ] Balanceamento fino das noites e dos chefes
- [ ] Mais personagens e ferramentas de baú

---

## Decisões técnicas

- Canvas com resolução interna de 1/4 da tela: pixels grandes e nítidos em qualquer monitor.
- Cenário do menu desenhado por código com PRNG de semente fixa.
- Partida em canvas separado por estado (`auth`, `menu`, `tool`, `playing`, `inventory`, `shop`, `gameover`), com um único `requestAnimationFrame`.
- Zumbis e jogador desenhados por sprites de texto (pixel a pixel) — fáceis de editar.
- O jogador alterna duas poses de passada; a ferramenta escolhida é desenhada em pixel art, girada a partir da mão e acompanha a animação do golpe.
- Cada golpe tem dois alcances: o arco na direção do mouse e um raio curto ao redor do jogador para acertar zumbis colados.
- A arma é um tiro cerrado (traço de bala + faísca) que atinge no máximo 1 alvo; o lança-chamas desenha um cone de fogo e atinge todos os zumbis nele.
- Fundo da arena e manchas de sangue ficam em canvas offscreen para não redesenhar a floresta a cada frame.
- Dano e resistência escalam por noite (+4 de dano e +1 de resistência); o dano base vem da ferramenta, o personagem multiplica e a “poção” da loja soma +5 em todas.
- O chefe usa o mesmo sistema de zumbis (com `boss: true`), o que dá perseguição, knockback reduzido e barra de vida de graça; a escala vem do DPS atual do jogador.
- O ciclo dia/noite é uma `phase` no cliente: 30 s de dia com spawn desligado e cura, depois noite com a horda. O baú existe só no dia e chama `POST /api/chest/open`.
- Inventário (`player_items`), conquistas (`player_achievements`) e baús (`player_chests`) são tabelas normalizadas; `player_tools`/`player_characters`/poções são espelhados para o inventário na migração.
- As conquistas são recalculadas no servidor a cada relato de partida (`syncAchievements`), nunca no cliente.
- O servidor nunca confia no cliente para saldo nem para a recompensa do baú: o relato de partida soma moedas com teto por envio, cada compra é validada e debitada em transação e a ferramenta do baú é sorteada no servidor.
