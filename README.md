# INFECTED

Jogo de sobrevivência de zumbis em 2D pixel art que roda no navegador, feito com Node.js.
Estética dark e macabra com contraste entre **verde neon** e **rosa neon**.

> Este README é o registro vivo do planejamento: toda ideia ou etapa nova é adicionada aqui.

**Status atual:** jogável **no computador e no celular**, com link público no **GitHub Pages** e progresso salvo **no navegador** (modo local), além do modo servidor com SQLite. Login com banco de dados, menu, floresta, dias de **10 segundos** com cura, noites de combate, arsenal com raridades e armas mais fortes/rápidas, baú dourado a cada 2 dias com escolha de troca, chefe a cada 10 dias com resistência proporcional ao jogador, **XP/nível/títulos**, loja de ferramentas, poções e skins com ferramenta inicial, e inventário com equipar de skins/ferramentas e conquistas.

## Jogar agora

**Link público:** [https://santosludymilla-netizen.github.io/jogoSuperlegal/](https://santosludymilla-netizen.github.io/jogoSuperlegal/)

- Funciona em **computador e celular** (analógicos de toque).
- No link público, a conta e o progresso ficam salvos **no navegador do jogador** (`localStorage`): não precisa de servidor e não sincroniza entre aparelhos.
- Para jogar com progresso no servidor (SQLite, entre dispositivos), rode o projeto localmente (veja abaixo).

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

**Computador:**

| Ação | Comando |
|---|---|
| Mover | `W` `A` `S` `D` ou setas |
| Atacar | segurar o botão esquerdo do mouse (mira no cursor) |
| Avançar tutorial | `PRÓXIMO` / `Enter` / `Espaço` |
| Voltar / fechar | `ESC` nos menus |

**Celular / tablet:**

| Ação | Comando |
|---|---|
| Mover | arrastar o **analógico esquerdo** |
| Mirar e atacar | arrastar o **analógico direito** na direção dos zumbis (ataca enquanto segura) |
| Menus | tocar nos botões; o layout se adapta ao tamanho da tela |

Os analógicos só aparecem em aparelhos com toque e durante a partida. A mira tem uma ajuda leve: se um zumbi estiver quase na direção apontada, o golpe encaixa nele.

---

## Conta e login

- É obrigatório **entrar ou criar conta** antes de jogar.
- **Nome:** 3 a 16 caracteres, apenas letras, números e `_`. É **único** (não diferencia maiúsculas de minúsculas).
- **Senha:** 8 a 64 caracteres, apenas letras/números, com **pelo menos 1 número**.
- A senha é guardada com **scrypt + salt**; o servidor nunca vê a senha em texto puro.
- A sessão fica em um token `Bearer` válido por **30 dias**, guardado no `localStorage`.
- **No modo servidor, todo o progresso fica no SQLite**: moedas, melhor dia, poções, ferramentas compradas, personagens, personagem equipado, inventário e conquistas. O servidor é a fonte da verdade dos valores.
- **No link público (GitHub Pages) não existe servidor**: o jogo detecta isso sozinho e passa a salvar conta e progresso no `localStorage` do navegador, com as mesmas regras. Nesse modo, limpar os dados do site apaga a conta.

### Modos de armazenamento

| Situação | Modo | Onde fica o progresso |
|---|---|---|
| `npm start` (Express respondendo `/api/state`) | servidor | `data/jogo.db` (SQLite) |
| GitHub Pages ou qualquer hospedagem estática | local | `localStorage` do navegador |

A detecção é automática: o cliente consulta `/api/state` e verifica se a resposta é JSON. Se for JSON, usa a API; se for 404/HTML ou der erro de rede, usa o backend local (`public/js/local.js`).

---

## Regras do jogo

### Tutorial do primeiro dia

- Na **primeira partida**, antes do dia 1 começar, abre um **tutorial em 6 passos**: mover, mirar/atacar, os 10 s de dia com cura, a noite, o baú dourado com escolha de troca e o progresso (XP, níveis, loja/inventário).
- O tutorial **pausa o jogo** (o relógio do dia não corre) e pode ser avançado com **PRÓXIMO**, `Enter`, `Espaço` ou pulado com **PULAR TUTORIAL** / `ESC`.
- No celular, os dois primeiros passos ensinam os **analógicos de toque** em vez do teclado/mouse.
- Depois de concluído (ou pulado) ele não abre sozinho de novo; o botão **COMO JOGAR** no menu abre o tutorial a qualquer momento.
- Durante o dia 1, avisos curtos no HUD reforçam os controles e a meta da primeira noite.

### Dia, noite, dificuldade e chefes

- O jogo é dividido em **dias**. A partida sempre começa no **dia 1**.
- Cada dia começa com **10 segundos de luz**: os zumbis somem e a vida do jogador **se regenera sozinha** (100% da vida ao longo dos 10 s).
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
  - A **resistência** do chefe também cresce com a força do jogador (`~35% do dano atual por golpe`): armas melhores não derretem o chefe, mas cada golpe sempre causa **pelo menos 1** de dano.
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
| Faca | COMUM | 8 | 0,22 s | rápida, alcance curto (vem de graça) |
| Machado | COMUM | 10 | 0,50 s | arco amplo, maior alcance |
| Taco de beisebol | COMUM | 13 | 0,44 s | arco amplo e bom knockback |
| Facão | COMUM | 14 | 0,30 s | rápido e equilibrado |
| Katana | RARA | 28 | 0,24 s | rápida, ampla e forte (loja) |
| Lança envenenada | RARA | 22 | 0,40 s | golpe preciso e longo, acerta até 2 zumbis |
| Arma | RARA | 34 | 0,72 s | tiro preciso, acerta 1 alvo por disparo |
| Motosserra | RARA | 34 | 0,24 s | -18% de velocidade |
| Besta | RARA | 46 | 0,85 s | recarga lenta |
| Submetralhadora | RARA | 16 | 0,11 s | dano baixo por tiro, cadência alta |
| Minigun | MÍTICA | 20 | 0,07 s | cadência altíssima, -25% de velocidade (loja) |
| Canhão de plasma | MÍTICA | 85 | 0,85 s | recarga lenta, exclusivo do baú dourado |
| Lança-chamas | MÍTICA | 26 | 0,18 s | cone de fogo que atinge todos na área |
| Foice | MÍTICA | 44 | 0,60 s | -10% de velocidade, acerta até 3 |
| Marra | MÍTICA | 62 | 0,90 s | -20% de velocidade, knockback enorme |

Todas as armas ficaram **mais fortes e mais rápidas** nesta versão. O alcance curto (`closeRange`) também aumentou: golpes acertam com segurança quem está colado no jogador, mesmo fora do arco da mira.

**Disponibilidade:** faca sempre disponível; machado, taco, facão, katana e minigun liberam quando **comprados na loja**; ferramentas ganhas no **baú dourado** também ficam disponíveis. As raras/míticas "de sorte" entram de acordo com o seu **melhor dia**:

| Ferramenta | Aparece a partir do | Chance |
|---|---|---|
| Lança envenenada | dia 3 | 25% no dia 3, +3% por dia (máx. 75%) |
| Arma | dia 12 | 15% no dia 12, +2,5% por dia (máx. 60%) |
| Lança-chamas | dia 12 | 5% no dia 12, subindo até ~22% antes do dia 30; 30% no dia 30 e +2% por dia (máx. 70%) |

O sorteio acontece ao abrir a escolha de ferramenta. As cartas mostram raridade, dano real e o motivo de estarem bloqueadas (dia mínimo, sorte que não saiu ou “compre na loja”).

### Baú dourado (a cada 2 dias)

- Ao **amanhecer dos dias 3, 5, 7, 9, 11...** nasce um **baú dourado no chão** da arena.
- Basta **pisar no baú** durante os 10 segundos de luz para abrir.
- A recompensa é sorteada **no servidor**, que registra o dia aberto em `player_chests`: **uma recompensa por jogador por dia de baú** (evita farmar entrando e saindo da partida).
- O baú entrega uma ferramenta **RARA ou MÍTICA** que você ainda não possui. Se você já tiver todas, o baú vira **+$25**.
- Ao abrir, o jogo **mostra o que você ganhou** (raridade, dano e recarga) e **pausa a partida** com duas opções: **TROCAR DE FERRAMENTA** ou **CONTINUAR COM A MESMA**.
- Trocar equipa a ferramenta na hora e salva a preferência na conta (`tool_id`). Continuar mantém a ferramenta atual; a nova fica guardada no inventário.
- A ferramenta ganha também fica disponível na escolha do início da próxima partida e pode ser marcada como preferida no inventário.

### Progressão por noite

- A cada noite sobrevivida o jogador ganha **+4 de dano** com a ferramenta e **+1 de resistência**.
- A resistência reduz o dano recebido em valor fixo, mas cada golpe sempre causa **pelo menos 1** de dano.
- O HUD mostra os valores atuais de **DANO** e **RES**, além da **FASE** (dia com contagem regressiva ou noite).

### XP, níveis e títulos

- **+5 XP por noite sobrevivida** e **+1 XP por zumbi morto** (contabilizados no servidor a cada envio de progresso).
- O XP total define o **nível da conta**, que aparece no menu, na escolha de ferramenta e no inventário.
- A cada nível a exigência aumenta: `XP para o próximo nível = 15 + (nível − 1) × 10`.
  - Nível 1 → 15 XP, nível 2 → 25 XP, nível 3 → 35 XP, e assim por diante.
- **A cada 10 níveis** a conta ganha um **título**:

| Nível | Título |
|---|---|
| 1+ | SOBREVIVENTE |
| 10+ | ASSASSINO |
| 20+ | CARNICEIRO |
| 30+ | EXTERMINADOR |
| 40+ | CEIFADOR |
| 50+ | LENDA INFECTADA |

O título mais alto alcançado fica em destaque no menu e no inventário. Ao subir de nível, um aviso aparece no topo da tela.

### Inventário e conquistas

O botão **▤ INVENTÁRIO** fica no **canto superior esquerdo do menu** e abre um painel com o **nível/título**, a barra de XP, os itens e as conquistas:

- **Nível/XP:** título atual, nível, barra de progresso e quanto falta para o próximo nível.
- **Itens:** todas as ferramentas compradas ou ganhas, todas as skins compradas e as poções (com quantidade).
  - Nas **ferramentas**, o botão **USAR** define a ferramenta **preferida** da conta; nas **skins**, o botão **EQUIPAR** troca o personagem.
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

No **modo servidor**, o banco SQLite (`data/jogo.db`) guarda: conta, moedas, melhor dia, mortes, partidas, **XP** (`xp`), **ferramenta preferida** (`tool_id`), ferramentas, personagens, poções, **inventário** (`player_items`), **conquistas** (`player_achievements`) e **baús abertos** (`player_chests`). Ao entrar em qualquer navegador, o progresso vem do servidor.

No **modo local** (link público), o mesmo estado é gravado em duas chaves do `localStorage`: `infected.local.players` (contas, saldo, itens, conquistas e baús) e `infected.local.session` (quem está logado). As senhas são guardadas como hash SHA-256 com salt (quando o navegador permite `crypto.subtle`). O jogo mostra um aviso **SALVO NESTE NAVEGADOR** para deixar isso claro.

---

## Stack

- **Node.js + Express 5** — API e servidor de arquivos estáticos
- **`node:sqlite`** — banco de dados local, sem dependência externa
- **`localStorage`** — backend do modo estático (contas e progresso no navegador)
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
    │   ├── main.js           # loop principal, estados, login, loja, inventário, HUD e analógicos
    │   ├── scene.js          # floresta animada do menu
    │   ├── game.js           # partida: player, zumbis, chefe, dia/noite, baú, combate e toque
    │   ├── save.js           # detecção de modo + cliente da API / backend local
    │   └── local.js          # contas e progresso no localStorage (GitHub Pages)
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
| `/api/run/report` | POST | soma moedas, mortes, partidas, melhor dia e **XP** (+5/noite, +1/zumbi); libera conquistas e devolve o nível/título |
| `/api/chest/open` | POST | abre o baú do dia (recompensa sorteada no servidor) |
| `/api/shop/tool` | POST | compra ferramenta |
| `/api/shop/potion` | POST | compra poção liberada pelo melhor dia |
| `/api/shop/character` | POST | compra personagem e recebe a ferramenta inicial |
| `/api/character/select` | POST | equipa personagem comprado |
| `/api/tool/select` | POST | define a ferramenta preferida da conta |

Todas as rotas, menos cadastro/login, exigem `Authorization: Bearer <token>`.

No **modo local** essas mesmas rotas são atendidas em memória/`localStorage` por `public/js/local.js` (mesmos nomes, validações e mensagens), então o restante do cliente não precisa saber onde está rodando.

Para depurar no console do navegador, abra com `?debug=1` para expor `window.__jogo` (jogo, save e loja).

## Publicar no GitHub Pages

O site é publicado a partir do conteúdo de `public/` no branch `gh-pages`:

```bash
git subtree push --prefix public origin gh-pages
```

Em **Settings → Pages**, a fonte é o branch `gh-pages` na raiz (`/`). Como o Pages é estático, o jogo cai automaticamente no modo local.

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
- [x] Escolha de ferramenta no início (faca ou machado)
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
- [x] Dias de **10 segundos** com **regeneração de vida**
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
- [ ] Mais personagens e ferramentas de baú

### Parte 8 — Nível, baú com escolha e chefes resistentes ✅

- [x] Dia reduzido para **10 segundos**
- [x] Armas mais fortes e mais rápidas, com alcance curto maior
- [x] Baú mostra a recompensa e deixa **trocar de ferramenta ou continuar com a mesma**
- [x] **XP**: +5 por noite sobrevivida e +1 por zumbi morto
- [x] **Nível de conta** com exigência crescente de XP
- [x] **Títulos a cada 10 níveis** (ASSASSINO, CARNICEIRO, EXTERMINADOR, CEIFADOR, LENDA INFECTADA)
- [x] Nível/título no menu, na escolha de ferramenta e no inventário
- [x] Inventário com **EQUIPAR** skins e **USAR** ferramentas (preferência salva no servidor)
- [x] Chefe a cada 10 noites com **resistência proporcional à força do jogador**
- [x] Novas rotas `POST /api/tool/select` e XP em `POST /api/run/report`

### Parte 9 — Link público e celular ✅

- [x] **Modo local**: contas, XP, loja, baú e conquistas em `localStorage`
- [x] Detecção automática entre servidor (JSON em `/api/state`) e modo estático
- [x] Aviso de que o progresso está salvo no navegador
- [x] **Controles de toque**: analógico esquerdo para andar e direito para mirar/atacar
- [x] Auto-mira leve no analógico direito
- [x] Layout responsivo (painéis, HUD, loja, inventário e tutorial) e área segura de notch
- [x] Tutorial adaptado ao toque
- [x] Publicação no **GitHub Pages** com `public/` no branch `gh-pages`

---

## Decisões técnicas

- Canvas com resolução interna de 1/4 da tela: pixels grandes e nítidos em qualquer monitor.
- Cenário do menu desenhado por código com PRNG de semente fixa.
- Partida em canvas separado por estado (`auth`, `menu`, `tool`, `tutorial`, `playing`, `chest`, `inventory`, `shop`, `gameover`), com um único `requestAnimationFrame`. No estado `chest` o jogo é desenhado mas não atualizado.
- Zumbis e jogador desenhados por sprites de texto (pixel a pixel) — fáceis de editar.
- O jogador alterna duas poses de passada; a ferramenta escolhida é desenhada em pixel art, girada a partir da mão e acompanha a animação do golpe.
- Cada golpe tem dois alcances: o arco na direção do mouse e um raio curto ao redor do jogador para acertar zumbis colados.
- A arma é um tiro cerrado (traço de bala + faísca) que atinge no máximo 1 alvo; o lança-chamas desenha um cone de fogo e atinge todos os zumbis nele.
- Fundo da arena e manchas de sangue ficam em canvas offscreen para não redesenhar a floresta a cada frame.
- Dano e resistência escalam por noite (+4 de dano e +1 de resistência); o dano base vem da ferramenta, o personagem multiplica e a “poção” da loja soma +5 em todas.
- O chefe usa o mesmo sistema de zumbis (com `boss: true`), o que dá perseguição, knockback reduzido e barra de vida de graça; a escala vem do DPS atual do jogador e a resistência de ~35% do dano por golpe (`damageZombie` sempre aplica pelo menos 1).
- O ciclo dia/noite é uma `phase` no cliente: 10 s de dia com spawn desligado e cura, depois noite com a horda. O baú existe só no dia e chama `POST /api/chest/open`; a escolha de troca pausa o loop e usa `equipChestTool`/`keepChestTool`.
- XP e nível são calculados no servidor a partir do XP total (`levelInfo`), com `xpForNext(nível) = 15 + (nível − 1) × 10`; o cliente apenas exibe o nível, o progresso e o título devolvidos pela API.
- Inventário (`player_items`), conquistas (`player_achievements`) e baús (`player_chests`) são tabelas normalizadas; `player_tools`/`player_characters`/poções são espelhados para o inventário na migração.
- As conquistas são recalculadas no servidor a cada relato de partida (`syncAchievements`), nunca no cliente.
- O servidor nunca confia no cliente para saldo nem para a recompensa do baú: o relato de partida soma moedas com teto por envio, cada compra é validada e debitada em transação e a ferramenta do baú é sorteada no servidor.
- **Detecção de modo:** `fetch('/api/state')` é a sonda. Resposta JSON = API Node; 404/HTML/erro = modo local. Assim o mesmo `index.html` funciona no Express e no Pages sem build.
- **Backend local (`local.js`)** replica as regras do `db.js` (validações, tetos do relato, XP/níveis, conquistas, poções por faixa de 10 dias, baú por dia) e guarda tudo em `infected.local.players`. O `save.js` só troca o transporte.
- **Controles:** os analógicos escrevem vetores normalizados em `game.moveStick`/`game.aimStick`; o `update` soma com o teclado e usa o vetor direito como mira + gatilho. Eles só existem em `pointer: coarse`, com `touch-action: none`.
- **Responsivo:** media queries em 720 px e no modo paisagem baixo, `env(safe-area-inset-*)` para notch e painéis com rolagem interna.
