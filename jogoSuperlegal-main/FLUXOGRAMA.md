# Fluxograma do jogoSuperlegal

Diagramas do fluxo de jogo, derivados do código em `public/js/` (`main.js`, `game.js`, `save.js`).

## Visão geral (máquina de estados)

O jogo tem 5 estados controlados por `state` em `main.js`: `menu`, `tool`, `playing`, `shop` e `gameover`.

```mermaid
stateDiagram-v2
    [*] --> menu : loadSave() (localStorage)
    menu --> tool : botão JOGAR
    menu --> shop : botão $ LOJA
    tool --> menu : ESC
    tool --> playing : escolher FACA/MACHADO
    shop --> menu : VOLTAR / ESC
    playing --> gameover : hp <= 0
    playing --> playing : noite sobrevivida (dia++)
    gameover --> menu : voltar / ESC
```

## Fluxo detalhado

```mermaid
flowchart TD
    Start([Abrir o jogo]) --> Load["loadSave()<br/>localStorage: moedas, melhor dia, poções"]
    Load --> Menu["MENU (estado: menu)<br/>floresta animada + contador de moedas"]

    Menu -->|JOGAR| Tool["Escolha de ferramenta<br/>FACA ou MACHADO"]
    Menu -->|$ LOJA| Shop["LOJA (estado: shop)<br/>Poção de ferramenta: +5 de dano, $10"]

    Tool -->|escolher| Play
    Tool -->|ESC| Menu

    Shop -->|comprar, se bestDay/10 > poções e moedas >= 10| Shop
    Shop -->|VOLTAR / ESC| Menu

    Play["game.start()<br/>hp=100, dia=1, dano=5 + poções*5"] --> NightStart

    subgraph NOITE["NOITE (estado: playing)"]
        direction TD
        NightStart["Início da noite<br/>total de zumbis = 2*dia - 1"] --> Loop{"Atualização a cada frame"}
        Loop --> Move["Mover (WASD / setas)"]
        Loop --> Attack["Atacar (botão esquerdo)<br/>alcance + arco + recuo"]
        Loop --> Spawn["Spawnar zumbis até o total<br/>máx. 4+dia na tela de uma vez"]
        Loop --> Chase["Zumbis perseguem e<br/>atacam ao encostar"]
        Attack --> Dead{"Zumbi morreu?"}
        Dead -->|sim| Killed["killed++<br/>a cada 2 mortes: +1 moeda"]
        Killed --> End{"Matou todos da noite?"}
        End -->|não| Loop
        Chase --> Hurt{"Jogador levou dano?"}
        Hurt -->|"hp <= 0"| GameOver
        Hurt -->|"hp > 0"| Loop
    end

    End -->|sim| Survived["Noite sobrevivida<br/>dia++  +5 moedas<br/>+2 zumbis e 1% mais fortes"]
    Survived --> NightStart

    GameOver["GAME OVER (estado: gameover)<br/>dia alcançado + moedas ganhas"]
    GameOver -->|voltar / ESC| Menu
```

## Regras embutidas no fluxo

- **Zumbis por noite:** `total = 2 * dia - 1` (dia 1 = 1, dia 2 = 3, dia 3 = 5...).
- **Escala por noite:** vida e dano dos zumbis multiplicados por `1 + 0,01 * (dia - 1)`.
- **Moedas:** +1 a cada 2 zumbis mortos (contagem continua entre noites) e +5 por noite sobrevivida.
- **Dano do jogador:** `5 + poções * 5`, onde cada poção custa $10 e é liberada a cada 10 dias (melhor dia).
- **Persistência:** `coins`, `bestDay` e `potions` são salvos em `localStorage` a cada mudança.
