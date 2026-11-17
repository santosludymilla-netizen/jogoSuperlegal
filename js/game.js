const MARGIN = 14;

export const RARITIES = {
  comum: { label: 'COMUM' },
  rara: { label: 'RARA' },
  mitica: { label: 'MÍTICA' },
};

export const TOOLS = {
  knife: {
    name: 'FACA',
    rarity: 'comum',
    damage: 8,
    cooldown: 0.22,
    swing: 0.15,
    range: 34,
    closeRange: 18,
    arc: 1.35,
    knock: 75,
    width: 1,
    style: 'melee',
  },
  axe: {
    name: 'MACHADO',
    rarity: 'comum',
    damage: 10,
    cooldown: 0.5,
    swing: 0.26,
    range: 44,
    closeRange: 22,
    arc: 1.95,
    knock: 160,
    width: 2,
    style: 'melee',
  },
  bat: {
    name: 'TACO DE BEISEBOL',
    rarity: 'comum',
    damage: 13,
    cooldown: 0.44,
    swing: 0.24,
    range: 41,
    closeRange: 21,
    arc: 1.85,
    knock: 165,
    width: 2,
    style: 'melee',
  },
  machete: {
    name: 'FACÃO',
    rarity: 'comum',
    damage: 14,
    cooldown: 0.3,
    swing: 0.18,
    range: 38,
    closeRange: 19,
    arc: 1.5,
    knock: 95,
    width: 2,
    style: 'melee',
  },
  spear: {
    name: 'LANÇA ENVENENADA',
    rarity: 'rara',
    damage: 22,
    cooldown: 0.4,
    swing: 0.2,
    range: 52,
    closeRange: 18,
    arc: 0.8,
    knock: 85,
    width: 1,
    maxTargets: 2,
    style: 'melee',
    unlockDay: 3,
    chance: (bestDay) => Math.min(0.75, 0.25 + (bestDay - 3) * 0.03),
  },
  gun: {
    name: 'ARMA',
    rarity: 'rara',
    damage: 34,
    cooldown: 0.72,
    swing: 0.1,
    range: 135,
    closeRange: 12,
    arc: 0.22,
    knock: 50,
    width: 1,
    maxTargets: 1,
    style: 'shot',
    unlockDay: 12,
    chance: (bestDay) => Math.min(0.6, 0.15 + (bestDay - 12) * 0.025),
  },
  flamethrower: {
    name: 'LANÇA-CHAMAS',
    rarity: 'mitica',
    damage: 26,
    cooldown: 0.18,
    swing: 0.15,
    range: 56,
    closeRange: 16,
    arc: 1.25,
    knock: 14,
    width: 3,
    style: 'flame',
    unlockDay: 12,
    chance: (bestDay) => {
      if (bestDay < 30) return Math.min(0.25, 0.05 + (bestDay - 12) * 0.01);
      return Math.min(0.7, 0.3 + (bestDay - 30) * 0.02);
    },
  },

  katana: {
    name: 'KATANA',
    rarity: 'rara',
    damage: 28,
    cooldown: 0.24,
    swing: 0.14,
    range: 42,
    closeRange: 20,
    arc: 1.75,
    knock: 105,
    width: 2,
    style: 'melee',
  },
  minigun: {
    name: 'MINIGUN',
    rarity: 'mitica',
    damage: 20,
    cooldown: 0.07,
    swing: 0.05,
    range: 110,
    closeRange: 10,
    arc: 0.18,
    knock: 14,
    width: 1,
    maxTargets: 1,
    style: 'shot',
    moveMult: 0.75,
    drawback: 'MUITO PESADA: -25% VELOCIDADE',
  },
  plasma: {
    name: 'CANHÃO DE PLASMA',
    rarity: 'mitica',
    damage: 85,
    cooldown: 0.85,
    swing: 0.1,
    range: 150,
    closeRange: 12,
    arc: 0.24,
    knock: 75,
    width: 1,
    maxTargets: 1,
    style: 'shot',
    drawback: 'RECARGA LENTA',
    chestOnly: true,
  },

  // Ferramentas que só saem do baú dourado.
  // Todas são mais fortes, mas carregam uma desvantagem.
  chainsaw: {
    name: 'MOTOSSERRA',
    rarity: 'rara',
    damage: 34,
    cooldown: 0.24,
    swing: 0.16,
    range: 46,
    closeRange: 18,
    arc: 1.15,
    knock: 50,
    width: 2,
    style: 'melee',
    moveMult: 0.82,
    drawback: 'PESADA: -18% VELOCIDADE',
    offerOnly: true,
  },
  crossbow: {
    name: 'BESTA',
    rarity: 'rara',
    damage: 46,
    cooldown: 0.85,
    swing: 0.11,
    range: 125,
    closeRange: 12,
    arc: 0.24,
    knock: 65,
    width: 1,
    maxTargets: 1,
    style: 'shot',
    drawback: 'RECARGA LENTA',
    offerOnly: true,
  },
  scythe: {
    name: 'FOICE',
    rarity: 'mitica',
    damage: 44,
    cooldown: 0.6,
    swing: 0.28,
    range: 50,
    closeRange: 20,
    arc: 2.65,
    knock: 130,
    width: 3,
    maxTargets: 3,
    style: 'melee',
    moveMult: 0.9,
    drawback: 'LENTA E PESADA: -10% VELOCIDADE',
    offerOnly: true,
  },
  smg: {
    name: 'SUBMETRALHADORA',
    rarity: 'rara',
    damage: 16,
    cooldown: 0.11,
    swing: 0.07,
    range: 95,
    closeRange: 10,
    arc: 0.18,
    knock: 22,
    width: 1,
    maxTargets: 1,
    style: 'shot',
    drawback: 'TIRO FRACO POR DISPARO',
    offerOnly: true,
  },
  hammer: {
    name: 'MARRA',
    rarity: 'mitica',
    damage: 62,
    cooldown: 0.9,
    swing: 0.34,
    range: 44,
    closeRange: 22,
    arc: 2.05,
    knock: 230,
    width: 3,
    moveMult: 0.8,
    drawback: 'MUITO PESADA: -20% VELOCIDADE',
    offerOnly: true,
  },
};

// Ferramentas que o baú dourado pode entregar (só raras e míticas).
export const CHEST_POOL = Object.keys(TOOLS).filter((id) => TOOLS[id].rarity !== 'comum');

export const CHARACTERS = {
  survivor: {
    name: 'SOBREVIVENTE',
    perk: 'EQUILIBRADO: SEM BÔNUS',
    starterTool: 'knife',
    hp: 0,
    speed: 1,
    damage: 1,
    resist: 0,
    coins: 1,
    palette: { h: '#cfd8bf', d: '#2b3c2e', j: '#1e4a26', p: '#ff2e88', k: '#050505' },
  },
  runner: {
    name: 'CORREDOR',
    perk: '+15% DE VELOCIDADE',
    starterTool: 'machete',
    hp: 0,
    speed: 1.15,
    damage: 1,
    resist: 0,
    coins: 1,
    palette: { h: '#cfd8bf', d: '#123c3c', j: '#1c4a4a', p: '#39ff14', k: '#050505' },
  },
  medic: {
    name: 'MÉDICO',
    perk: '+40 VIDA E +1 RESISTÊNCIA',
    starterTool: 'bat',
    hp: 40,
    speed: 1,
    damage: 1,
    resist: 1,
    coins: 1,
    palette: { h: '#f0e6d2', d: '#8f8f86', j: '#d8d8d0', p: '#ff2e88', k: '#050505' },
  },
  brute: {
    name: 'BRUTAMONTES',
    perk: '+20 VIDA E +12% DANO, MAS -5% VELOCIDADE',
    starterTool: 'axe',
    hp: 20,
    speed: 0.95,
    damage: 1.12,
    resist: 0,
    coins: 1,
    palette: { h: '#c9a17a', d: '#2b1a12', j: '#4a1e1e', p: '#ff2e88', k: '#050505' },
  },
  thief: {
    name: 'LADRÃO',
    perk: '+50% MOEDAS, MAS -10 VIDA E -5% DANO',
    starterTool: 'spear',
    hp: -10,
    speed: 1.05,
    damage: 0.95,
    resist: 0,
    coins: 1.5,
    palette: { h: '#cfd8bf', d: '#1a1030', j: '#2a1e4a', p: '#ffb000', k: '#050505' },
  },
  tank: {
    name: 'TANQUE',
    perk: '+3 RESISTÊNCIA, MAS -10% VELOCIDADE',
    starterTool: 'katana',
    hp: 0,
    speed: 0.9,
    damage: 1,
    resist: 3,
    coins: 1,
    palette: { h: '#cfd8bf', d: '#4a4a44', j: '#2f3b34', p: '#ff2e88', k: '#050505' },
  },
  celina: {
    name: 'CELINA',
    perk: 'MORENA DE SARDINHAS: +20% MOEDAS',
    starterTool: 'knife',
    hp: 0,
    speed: 1.05,
    damage: 1,
    resist: 0,
    coins: 1.2,
    palette: { h: '#a9713f', d: '#241109', j: '#7a1f3d', p: '#ffd166', k: '#050505' },
    // Sardinhas (freckles) desenhadas por cima do rosto, em pixels do sprite.
    details: [
      { x: 2, y: 4, c: '#6d3f1e' },
      { x: 3, y: 4, c: '#6d3f1e' },
      { x: 6, y: 4, c: '#6d3f1e' },
      { x: 7, y: 4, c: '#6d3f1e' },
    ],
  },
  gilsane: {
    name: 'GILSANE',
    perk: 'CABELO RUIVO: +10% VELOCIDADE E +5% DANO',
    starterTool: 'machete',
    hp: 0,
    speed: 1.1,
    damage: 1.05,
    resist: 0,
    coins: 1,
    palette: { h: '#f0d3bd', d: '#b3341f', j: '#2a4a6b', p: '#ffd166', k: '#050505' },
  },
};

export const TOOL_ORDER = [
  'knife',
  'axe',
  'bat',
  'machete',
  'katana',
  'spear',
  'gun',
  'flamethrower',
  'minigun',
  'plasma',
];

// Ferramentas iniciais compráveis na loja, na ordem exibida.
export const SHOP_TOOL_ORDER = ['axe', 'bat', 'machete', 'katana', 'minigun'];

export function getToolChance(toolId, bestDay) {
  const tool = TOOLS[toolId];
  if (!tool) return 0;
  if (bestDay < (tool.unlockDay || 1)) return 0;
  return tool.chance ? tool.chance(bestDay) : 1;
}

const BASE_DAMAGE_PER_NIGHT = 4;
const RESISTANCE_PER_NIGHT = 1;
const BOSS_EVERY = 10;

// Cada dia tem 10 segundos de luz: tempo de se curar e pegar o baú.
const DAY_SECONDS = 10;
const CHEST_EVERY = 2;

const BASE_ZOMBIE_HP = 30;
const BASE_ZOMBIE_DAMAGE = 10;
const BASE_PLAYER_HP = 100;

// Dificuldade cresce todo dia: vida, dano, velocidade e quantidade.
const ZOMBIE_HP_PER_DAY = 0.08;
const ZOMBIE_DAMAGE_PER_DAY = 0.05;
const ZOMBIE_SPEED_PER_DAY = 0.02;

const PLAYER_SPRITE = [
  '...dddd...',
  '..dddddd..',
  '..dhhhhd..',
  '..hkhhkh..',
  '..hhhhhh..',
  '...dddd...',
  '..pjjjjp..',
  '.jjjjjjjj.',
  'h.jjjjjj.h',
  'h.jjjjjj.h',
  '..jjjjjj..',
  '...jjjj...',
  '...j..j...',
  '...j..j...',
  '...j..j...',
  '..jj..jj..',
  '.jjj..jjj.',
];

// Duas poses de passada: uma perna avanca e o corpo sobe 1 pixel.
const PLAYER_WALK_SPRITES = [
  [
    '...dddd...',
    '..dddddd..',
    '..dhhhhd..',
    '..hkhhkh..',
    '..hhhhhh..',
    '...dddd...',
    '..pjjjjp..',
    '.jjjjjjjj.',
    'h.jjjjjj..',
    '..jjjjjj.h',
    '..jjjjjj..',
    '...jjjj...',
    '..jj..j...',
    '..jj..j...',
    '..jj..j...',
    '.jjj..jj..',
    'jjj....jj.',
  ],
  [
    '...dddd...',
    '..dddddd..',
    '..dhhhhd..',
    '..hkhhkh..',
    '..hhhhhh..',
    '...dddd...',
    '..pjjjjp..',
    '.jjjjjjjj.',
    '..jjjjjj.h',
    'h.jjjjjj..',
    '..jjjjjj..',
    '...jjjj...',
    '...j..jj..',
    '...j..jj..',
    '...j..jj..',
    '..jj..jjj.',
    '.jj....jjj',
  ],
];

const ZOMBIE_SPRITES = [
  [
    '...####...',
    '..######..',
    '..#e##e#..',
    '..#.##.#..',
    '..#b##b#..',
    '..######..',
    '...####...',
    '##.####.##',
    '#..####..#',
    '...####...',
    '..x####x..',
    '..######..',
    '..b####b..',
    '...####...',
    '...#..#...',
    '...#..#...',
    '..#....#..',
    '.##....##.',
  ],
  [
    '...####...',
    '..######..',
    '..#e##e#..',
    '..#.##.#..',
    '..#b##b#..',
    '..######..',
    '...####...',
    '##.####.##',
    '#..#..#..#',
    '...####...',
    '..x#.#.x..',
    '..######..',
    '..b#..#b..',
    '...####...',
    '...#..#...',
    '...#..#...',
    '..#....#..',
    '.##....##.',
  ],
  [
    '...####...',
    '..######..',
    '..#e##e#..',
    '..#b##b#..',
    '..######..',
    '...####...',
    '##.####.##',
    '#..####..#',
    '...####...',
    '..x####x..',
    '..######..',
    '...####...',
    '..b####b..',
    '...####...',
    '...#..#...',
    '...#..#...',
    '..#.#..#..',
    '.##....##.',
  ],
];

function angleDiff(a, b) {
  let diff = a - b;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ---------- biomas: progressão contínua de cenário (sem cortes, estilo Mercs) ----------
// O jogador avança continuamente de um bioma para o próximo: o terreno, a
// iluminação, a decoração, as partículas e a paleta dos inimigos se misturam
// gradualmente durante a travessia, com um marco visual marcando a fronteira.
const BIOME_SECONDS = 45; // ~3 a 4 dias por bioma
const BIOME_FADE_SECONDS = 6; // duração da mistura visual entre biomas

const BIOMES = [
  {
    id: 'forest',
    name: 'FLORESTA',
    sky: ['#071009', '#050c07', '#030704'],
    glow: ['rgba(57, 255, 20, 0.13)', 'rgba(255, 46, 136, 0.04)'],
    blotch: ['#0a120a', '#0c0a06'],
    tuft: '#0f1e0f',
    speck: ['#1a201a', '#121712'],
    ground: ['#0c1a0e', '#122412', '#1a3a1a'],
    groundKind: 'tufts',
    border: 'trees',
    borderColor: '#0a1a0e',
    borderRim: '#24521f',
    fog: ['57, 255, 20', '255, 46, 136'],
    ambient: ['#39ff14', '#ff2e88'],
    zombieSkin: ['#1b2e1b', '#23361f'],
    zombieEye: ['#6bff4a', '#ff5aa8'],
    zombieBlood: ['#4a070d', '#3a050a'],
    speed: 1,
    hp: 1,
    scroll: 7,
    landmark: null,
    sound: 'forest',
  },
  {
    id: 'road',
    name: 'ESTRADA',
    sky: ['#0c0c10', '#08080c', '#050508'],
    glow: ['rgba(154, 163, 143, 0.10)', 'rgba(255, 46, 136, 0.04)'],
    blotch: ['#0d0d12', '#101014'],
    tuft: '#16161c',
    speck: ['#23232b', '#1a1a20'],
    ground: ['#8f8f86', '#6b6b62'],
    groundKind: 'lanes',
    border: 'fence',
    borderColor: '#2a2a30',
    borderRim: '#5a5a62',
    fog: ['154, 163, 143', '255, 46, 136'],
    ambient: ['#9aa38f', '#d8d8d0'],
    zombieSkin: ['#3a3f3a', '#4a4438'],
    zombieEye: ['#ffd166', '#6bff4a'],
    zombieBlood: ['#4a070d', '#2a2a30'],
    speed: 1.05,
    hp: 1.02,
    scroll: 16,
    landmark: 'bridge',
    sound: 'road',
  },
  {
    id: 'city',
    name: 'CIDADE ABANDONADA',
    sky: ['#0b0d14', '#07080d', '#04050a'],
    glow: ['rgba(255, 176, 0, 0.10)', 'rgba(255, 46, 136, 0.05)'],
    blotch: ['#0d0f16', '#10121a'],
    tuft: '#1a1d26',
    speck: ['#2a2d36', '#1a1c24'],
    ground: ['#1a1d26', '#12141c', '#5a2b2b'],
    groundKind: 'rubble',
    border: 'ruins',
    borderColor: '#14161d',
    borderRim: '#3a3f4e',
    fog: ['255, 176, 0', '255, 46, 136'],
    ambient: ['#ffb000', '#ff5a3c'],
    zombieSkin: ['#3d4048', '#4a4438'],
    zombieEye: ['#ff5aa8', '#ffd166'],
    zombieBlood: ['#4a070d', '#2a1420'],
    speed: 1.1,
    hp: 1.08,
    scroll: 10,
    landmark: 'arch',
    sound: 'city',
  },
  {
    id: 'core',
    name: 'NÚCLEO DA INFECÇÃO',
    sky: ['#140608', '#0a0305', '#060203'],
    glow: ['rgba(255, 46, 136, 0.16)', 'rgba(139, 0, 0, 0.10)'],
    blotch: ['#160809', '#1a0a0e'],
    tuft: '#2a0810',
    speck: ['#3a0d14', '#240a10'],
    ground: ['#2a0810', '#5a1030', '#ff2e88'],
    groundKind: 'cracks',
    border: 'spikes',
    borderColor: '#1c0609',
    borderRim: '#8b0000',
    fog: ['255, 46, 136', '139, 0, 0'],
    ambient: ['#ff2e88', '#ffb000'],
    zombieSkin: ['#4a1420', '#3a0d14'],
    zombieEye: ['#ff2e88', '#ffb000'],
    zombieBlood: ['#8b0000', '#4a070d'],
    speed: 1.16,
    hp: 1.18,
    scroll: 12,
    landmark: 'portal',
    sound: 'core',
  },
];

// Mistura o bioma atual com o próximo para escolher a aparência de um inimigo.
function biomeAt(game) {
  const floor = Math.min(BIOMES.length - 1, Math.floor(game.biomePos));
  const next = Math.min(BIOMES.length - 1, floor + 1);
  const fade = easeOutCubic(game.biomeFade);
  const useNext = game.biomeFade > 0 && Math.random() < fade;
  return BIOMES[useNext ? next : floor];
}

function drawSprite(g, rows, left, top, palette, flip, flash, scale = 1) {
  const width = rows[0].length;

  for (let row = 0; row < rows.length; row += 1) {
    const line = rows[row];
    for (let col = 0; col < line.length; col += 1) {
      const cell = line[col];
      if (cell === '.') continue;

      const x = left + (flip ? width - 1 - col : col) * scale;
      g.fillStyle = flash ? '#ffffff' : palette[cell] || '#ffffff';
      g.fillRect(x, top + row * scale, scale, scale);
    }
  }
}

export class Game {
  constructor(canvas, ctx, callbacks) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cb = callbacks;

    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false };

    // Analógicos de toque: main.js escreve aqui; o update lê junto do teclado.
    this.moveStick = { x: 0, y: 0, active: false };
    this.aimStick = { x: 0, y: 0, active: false };

    this.active = false;

    this.W = 0;
    this.H = 0;
    this.time = 0;

    this.bindInput();
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
      this.ensureAudio();
      const key = event.key.toLowerCase();
      this.keys.add(key);

      if (this.active && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault();
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key.toLowerCase());
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouse.down = false;
      this.moveStick.active = false;
      this.aimStick.active = false;
    });

    this.canvas.addEventListener('mousemove', (event) => this.updateMouse(event));

    this.canvas.addEventListener('mousedown', (event) => {
      this.ensureAudio();
      if (!this.active) return;
      event.preventDefault();
      this.updateMouse(event);
      this.mouse.down = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });

    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    this.canvas.addEventListener('pointerdown', () => this.ensureAudio(), { passive: true });
  }

  updateMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * this.W;
    this.mouse.y = ((event.clientY - rect.top) / rect.height) * this.H;
  }

  // Puxa a mira para o zumbi mais próximo se ele estiver quase na direção apontada.
  assistAim(angle) {
    const player = this.player;
    if (!player) return angle;

    let best = null;
    let bestDistance = Infinity;

    for (const zombie of this.zombies) {
      if (zombie.dead) continue;

      const toX = zombie.x - player.x;
      const toY = zombie.y - player.y;
      const distance = Math.hypot(toX, toY);
      if (distance > 140 || distance >= bestDistance) continue;

      const zombieAngle = Math.atan2(toY, toX);
      const diff = Math.abs(
        Math.atan2(Math.sin(zombieAngle - angle), Math.cos(zombieAngle - angle))
      );
      if (diff > 0.5) continue;

      best = zombie;
      bestDistance = distance;
    }

    if (!best) return angle;
    return Math.atan2(best.y - player.y, best.x - player.x);
  }

  resize(W, H) {
    this.W = W;
    this.H = H;
    this.buildBackground();
    if (this.active) {
      this.decals = document.createElement('canvas');
      this.decals.width = W;
      this.decals.height = H;
      this.decalCtx = this.decals.getContext('2d');
      this.player.x = Math.min(Math.max(this.player.x, MARGIN), W - MARGIN);
      this.player.y = Math.min(Math.max(this.player.y, MARGIN), H - MARGIN);
    }
  }

  start(toolId, options = {}) {
    const { bonusDamage = 0, characterId = 'survivor' } = options;

    this.toolId = TOOLS[toolId] ? toolId : 'knife';
    this.tool = TOOLS[this.toolId];
    this.bonusDamage = bonusDamage;

    this.characterId = CHARACTERS[characterId] ? characterId : 'survivor';
    this.character = CHARACTERS[this.characterId];

    this.maxHp = Math.max(40, BASE_PLAYER_HP + this.character.hp);
    this.hp = this.maxHp;

    this.day = 1;
    this.recalcStats();

    this.killed = 0;
    this.total = 0;
    this.spawned = 0;
    this.spawnTimer = 0;
    this.killStreak = 0;
    this.coinProgress = 0;
    this.coinsEarned = 0;

    this.offers = null;
    this.offerOpen = false;
    this.boss = null;
    this.bossSpawned = false;
    this.bossNight = false;
    this.shocks = [];
    this.chest = null;
    this.pendingChest = null;
    this.phase = 'day';
    this.dayTimer = DAY_SECONDS;

    this.zombies = [];
    this.particles = [];
    this.swings = [];

    this.player = {
      x: this.W / 2,
      y: this.H * 0.6,
      radius: 5,
      attackCd: 0,
      hurtCd: 0,
      moving: false,
      walkPhase: 0,
    };

    this.decals = document.createElement('canvas');
    this.decals.width = this.W;
    this.decals.height = this.H;
    this.decalCtx = this.decals.getContext('2d');

    this.time = 0;
    this.shake = 0;
    this.tip = '';
    this.tipUntil = 0;

    // Progressão contínua de cenário: posição no eixo dos biomas, mistura
    // visual durante a travessia, rolagem do terreno e marco de fronteira.
    this.biomePos = 0;
    this.biomeFade = 0;
    this.bgFrom = null;
    this.bgNext = null;
    this.decor = [];
    this.decorNext = null;
    this.scrollY = 0;
    this.landmark = null;
    this.fireflies = [];

    this.buildBackground();
    this.refreshAmbient();

    this.active = true;
    this.mouse.down = false;

    this.beginDay();
    this.setTip('TUTORIAL: WASD MOVER  -  MOUSE ATACAR', 5);
  }

  recalcStats() {
    const char = this.character;
    const toolDamage = Math.round(this.tool.damage * char.damage) + this.bonusDamage;

    this.damage = toolDamage + BASE_DAMAGE_PER_NIGHT * (this.day - 1);
    this.resistance = char.resist + RESISTANCE_PER_NIGHT * (this.day - 1);
  }

  equipTool(toolId) {
    if (!TOOLS[toolId]) return;
    this.toolId = toolId;
    this.tool = TOOLS[toolId];
    this.recalcStats();
  }

  coinGain(amount) {
    const total = amount * this.character.coins;
    this.coinProgress += total;

    let earned = 0;
    while (this.coinProgress >= 1) {
      this.coinProgress -= 1;
      earned += 1;
    }

    if (earned > 0) {
      this.coinsEarned += earned;
      this.cb.onCoins(earned);
    }
  }

  setTip(text, seconds) {
    this.tip = text;
    this.tipUntil = this.time + seconds;
  }

  // ---------- som original de travessia de bioma (WebAudio, sem assets) ----------

  ensureAudio() {
    try {
      if (!this.audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.audio = new AC();
      }
      if (this.audio.state === 'suspended') this.audio.resume();
    } catch {
      this.audio = null;
    }
  }

  // Varredura de frequência diferente para cada bioma; toca só quando o
  // navegador já liberou o áudio (após um gesto do jogador).
  playBiomeSound(kind) {
    try {
      this.ensureAudio();
      if (!this.audio || this.audio.state !== 'running') return;

      const t0 = this.audio.currentTime;
      const osc = this.audio.createOscillator();
      const gain = this.audio.createGain();

      const presets = {
        forest: ['triangle', 220, 330],
        road: ['sawtooth', 90, 60],
        city: ['triangle', 140, 90],
        core: ['square', 160, 420],
      };
      const [type, from, to] = presets[kind] || presets.forest;

      osc.type = type;
      osc.frequency.setValueAtTime(from, t0);
      osc.frequency.exponentialRampToValueAtTime(to, t0 + 0.7);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);

      osc.connect(gain);
      gain.connect(this.audio.destination);
      osc.start(t0);
      osc.stop(t0 + 1);
    } catch {
      /* áudio indisponível: segue sem som */
    }
  }

  // Dia: 10 segundos de luz, vida regenerando e o baú dourado no chão.
  beginDay() {
    this.phase = 'day';
    this.dayTimer = DAY_SECONDS;
    this.killed = 0;
    this.spawned = 0;
    this.spawnTimer = 0;
    this.bossSpawned = false;
    this.boss = null;
    this.bossNight = this.day % BOSS_EVERY === 0;
    this.total = 2 * this.day - 1 + (this.bossNight ? 1 : 0);
    this.zombies = [];
    this.chest = null;
    this.pendingChest = null;

    // A cada 2 dias (dia 3, 5, 7...) nasce um baú dourado no chão.
    if (this.day >= 3 && this.day % CHEST_EVERY === 1) {
      this.chest = {
        x: this.W * (0.18 + Math.random() * 0.64),
        y: this.H * (0.22 + Math.random() * 0.56),
        t: 0,
        taken: false,
      };
      this.setTip('BAÚ DOURADO NO CHÃO  -  PISE NELE PARA ABRIR', 4);
    } else if (this.day === 1) {
      this.setTip(`DIA 1  -  WASD ANDA  -  MOUSE MIRA  -  SEGURE O CLIQUE PARA ATACAR`, 5);
    } else {
      this.setTip(`DIA ${this.day}  -  ${DAY_SECONDS}s DE LUZ PARA SE CURAR`, 3);
    }
  }

  startNight() {
    this.phase = 'night';
    this.dayTimer = 0;
    this.killed = 0;
    this.spawned = 0;
    this.spawnTimer = 0.6;
    this.bossSpawned = false;
    this.boss = null;
    this.bossNight = this.day % BOSS_EVERY === 0;
    this.total = 2 * this.day - 1 + (this.bossNight ? 1 : 0);

    if (this.bossNight) {
      this.setTip(`NOITE DO CHEFE  -  DIA ${this.day}`, 3.2);
    } else if (this.day === 1) {
      this.setTip(`NOITE 1  -  MATE O ZUMBI PARA VIRAR O DIA`, 3.2);
    } else {
      this.setTip(`NOITE ${this.day}  -  ${this.total} ZUMBIS`, 2.6);
    }
  }

  // Recompensa em moedas: o servidor já creditou na conta, então só avisamos.
  applyChestReward(reward = {}) {
    if (reward.coins > 0) {
      this.setTip(`BAÚ VAZIO  -  +$${reward.coins} NA CONTA`, 3.5);
      return;
    }

    this.setTip('BAÚ VAZIO.', 2.4);
  }

  // Troca a ferramenta atual pela que veio do baú.
  equipChestTool() {
    if (!this.pendingChest) return null;

    const toolId = this.pendingChest.toolId;
    this.pendingChest = null;
    this.equipTool(toolId);
    this.setTip(`TROCOU PARA ${TOOLS[toolId].name}`, 4);
    return toolId;
  }

  // Mantém a ferramenta atual e guarda a nova no inventário.
  keepChestTool() {
    if (!this.pendingChest) return null;

    const toolId = this.pendingChest.toolId;
    this.pendingChest = null;
    this.setTip(`MANTEVE ${this.tool.name}  -  ${TOOLS[toolId].name} FICOU NO INVENTÁRIO`, 5);
    return toolId;
  }

  randomChestTool() {
    const options = CHEST_POOL.filter((id) => id !== this.toolId);
    return options[Math.floor(Math.random() * options.length)];
  }

  // Pisa no baú: o servidor decide a recompensa; sem resposta, sorteia local.
  // A ferramenta só é equipada quando o jogador escolhe trocar.
  openGroundChest() {
    if (!this.chest || this.chest.taken) return;

    this.chest.taken = true;
    this.chest = null;

    const day = this.day;
    const result = this.cb.onChestOpen ? this.cb.onChestOpen(day) : null;

    const finish = (reward) => {
      if (!this.active) return;

      const resolved =
        reward && (reward.toolId || reward.coins > 0)
          ? reward
          : { toolId: this.randomChestTool(), coins: 0 };

      const toolId = resolved.toolId && TOOLS[resolved.toolId] ? resolved.toolId : null;
      if (!toolId) {
        this.applyChestReward(resolved);
        return;
      }

      this.pendingChest = { toolId, currentToolId: this.toolId };
      this.setTip(
        `BAÚ: ${TOOLS[toolId].name}  -  ESCOLHA TROCAR OU CONTINUAR`,
        8
      );

      if (this.cb.onChestReward) {
        this.cb.onChestReward({
          toolId,
          currentToolId: this.toolId,
          coins: resolved.coins || 0,
        });
      }
    };

    if (result && typeof result.then === 'function') {
      result.then(finish).catch(() => finish(null));
    } else {
      finish(result);
    }
  }

  spawnPoint() {
    const side = Math.floor(Math.random() * 4);

    if (side === 0) return { x: Math.random() * this.W, y: -12 };
    if (side === 1) return { x: this.W + 12, y: Math.random() * this.H };
    if (side === 2) return { x: Math.random() * this.W, y: this.H + 12 };
    return { x: -12, y: Math.random() * this.H };
  }

  spawnZombie() {
    const { x, y } = this.spawnPoint();

    // Aparência e vigor do zumbi seguem o bioma em que a partida está.
    const biome = biomeAt(this);
    const speedMult = Math.min(1.8, 1 + ZOMBIE_SPEED_PER_DAY * (this.day - 1)) * biome.speed;
    const hpMult = this.zombieHpMult() * biome.hp;
    const sprite = ZOMBIE_SPRITES[Math.floor(Math.random() * ZOMBIE_SPRITES.length)];

    this.zombies.push({
      x,
      y,
      sprite,
      skin: biome.zombieSkin[Math.floor(Math.random() * biome.zombieSkin.length)],
      hp: BASE_ZOMBIE_HP * hpMult,
      maxHp: BASE_ZOMBIE_HP * hpMult,
      damage: BASE_ZOMBIE_DAMAGE * this.zombieDamageMult(),
      speed: (17 + Math.random() * 8) * speedMult,
      radius: 5,
      eye: biome.zombieEye[Math.floor(Math.random() * biome.zombieEye.length)],
      blood: biome.zombieBlood[Math.floor(Math.random() * biome.zombieBlood.length)],
      flash: 0,
      attackCd: 0.5,
      phase: Math.random() * Math.PI * 2,
      kx: 0,
      ky: 0,
    });

    this.spawned += 1;
  }

  zombieHpMult() {
    return 1 + ZOMBIE_HP_PER_DAY * (this.day - 1);
  }

  zombieDamageMult() {
    return 1 + ZOMBIE_DAMAGE_PER_DAY * (this.day - 1);
  }

  // O chefe escala junto com o poder do jogador: vida proporcional ao DPS
  // (dano / recarga) e dano proporcional ao dano por golpe.
  spawnBoss() {
    const { x, y } = this.spawnPoint();
    const dps = this.damage / Math.max(0.12, this.tool.cooldown);
    const secondsToKill = 5 + this.day * 0.6;
    const hp = Math.round(Math.max(90, Math.min(20000, dps * secondsToKill)));
    const damage = Math.max(8, Math.round(this.damage * 0.4 + this.day));
    // Resistência cresce junto com o dano do jogador: o chefe absorve parte
    // de cada golpe, então armas mais fortes não o derretem instantaneamente.
    const resist = Math.max(2, Math.round(this.damage * 0.35));

    this.boss = {
      x,
      y,
      sprite: ZOMBIE_SPRITES[0],
      hp,
      maxHp: hp,
      damage,
      resist,
      speed: 11 + Math.min(11, this.day * 0.35),
      radius: 9,
      scale: 2,
      boss: true,
      name: `CHEFE DO DIA ${this.day}`,
      eye: '#ff2e88',
      blood: '#4a070d',
      flash: 0,
      attackCd: 1.2,
      slamCd: 3.5,
      phase: Math.random() * Math.PI * 2,
      kx: 0,
      ky: 0,
    };

    this.zombies.push(this.boss);
    this.bossSpawned = true;
    this.shake = 6;
    this.setTip(`CHEFE: ${this.boss.name}`, 4);
  }

  tryAttack(aim) {
    const player = this.player;
    if (player.attackCd > 0) return;

    player.attackCd = this.tool.cooldown;

    const sweep = this.tool.arc;
    const dir = Math.cos(aim) >= 0 ? 1 : -1;
    const from = aim - (sweep / 2) * dir;
    const to = aim + (sweep / 2) * dir;

    this.swings.push({
      angle: aim,
      from,
      to,
      dir,
      t: 0,
      dur: this.tool.swing,
      width: this.tool.width,
      range: this.tool.range,
      style: this.tool.style || 'melee',
    });

    const candidates = [];

    for (const zombie of this.zombies) {
      const dx = zombie.x - player.x;
      const dy = zombie.y - player.y;
      const distance = Math.hypot(dx, dy);
      const angleTo = Math.atan2(dy, dx);

      // Golpe em arco na direcao da mira + acerto garantido em quem esta colado.
      const inArc =
        distance <= this.tool.range + zombie.radius &&
        Math.abs(angleDiff(angleTo, aim)) <= sweep / 2;
      const inClose = distance <= this.tool.closeRange + zombie.radius;

      if (!inArc && !inClose) continue;

      candidates.push({ zombie, distance, angleTo, inArc });
    }

    candidates.sort((a, b) => a.distance - b.distance);
    const maxTargets = this.tool.maxTargets || candidates.length;

    for (const candidate of candidates.slice(0, maxTargets)) {
      this.damageZombie(
        candidate.zombie,
        this.damage,
        candidate.inArc ? aim : candidate.angleTo
      );
    }

    if (candidates.length > 0) this.shake = 2;

    if (this.tool.style === 'flame') {
      const colors = ['#ffb000', '#ff5a00', '#ff2e88'];
      for (let i = 0; i < 12; i += 1) {
        const spread = (Math.random() - 0.5) * sweep;
        const speed = 38 + Math.random() * 95;
        this.particles.push({
          x: player.x + Math.cos(aim) * 6,
          y: player.y - 8 + Math.sin(aim) * 6,
          vx: Math.cos(aim + spread) * speed,
          vy: Math.sin(aim + spread) * speed,
          life: 0.22 + Math.random() * 0.3,
          maxLife: 0.52,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() < 0.55 ? 2 : 1,
        });
      }
    } else if (this.tool.style === 'shot') {
      for (let i = 0; i < 5; i += 1) {
        this.particles.push({
          x: player.x + Math.cos(aim) * 8,
          y: player.y - 8 + Math.sin(aim) * 8,
          vx: Math.cos(aim) * (55 + Math.random() * 70),
          vy: Math.sin(aim) * (55 + Math.random() * 70),
          life: 0.12 + Math.random() * 0.14,
          maxLife: 0.26,
          color: Math.random() < 0.5 ? '#ffe066' : '#ffffff',
          size: 1,
        });
      }
    }
  }

  damageZombie(zombie, amount, aim) {
    // Chefes absorvem parte do golpe (resistência proporcional à sua força),
    // mas nunca ficam imunes: sempre entra pelo menos 1 de dano.
    const dealt = Math.max(1, Math.round(amount - (zombie.resist || 0)));
    zombie.hp -= dealt;
    zombie.flash = 0.09;

    const knock = zombie.boss ? this.tool.knock * 0.2 : this.tool.knock;
    zombie.kx += Math.cos(aim) * knock;
    zombie.ky += Math.sin(aim) * knock;

    const hitColors =
      this.tool.style === 'flame'
        ? ['#ffb000', '#ff5a00', '#ff2e88', '#8b0000']
        : ['#8b0000', '#ff2e88'];

    for (let i = 0; i < 5; i += 1) {
      this.particles.push({
        x: zombie.x,
        y: zombie.y - 9,
        vx: Math.cos(aim + (Math.random() - 0.5)) * (30 + Math.random() * 50),
        vy: Math.sin(aim + (Math.random() - 0.5)) * (30 + Math.random() * 50),
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        color: hitColors[Math.floor(Math.random() * hitColors.length)],
        size: Math.random() < 0.4 ? 2 : 1,
      });
    }

    if (zombie.hp <= 0) this.killZombie(zombie);
  }

  killZombie(zombie) {
    const index = this.zombies.indexOf(zombie);
    if (index === -1) return;
    this.zombies.splice(index, 1);

    this.killed += 1;

    const g = this.decalCtx;
    for (let i = 0; i < 7; i += 1) {
      const size = 1 + Math.floor(Math.random() * 3);
      g.globalAlpha = 0.35 + Math.random() * 0.4;
      g.fillStyle = Math.random() < 0.6 ? '#4a070d' : '#2a0305';
      g.fillRect(
        Math.round(zombie.x + (Math.random() - 0.5) * 16),
        Math.round(zombie.y + (Math.random() - 0.5) * 8),
        size,
        size
      );
    }
    g.globalAlpha = 1;

    for (let i = 0; i < 10; i += 1) {
      this.particles.push({
        x: zombie.x,
        y: zombie.y - 9,
        vx: (Math.random() - 0.5) * 110,
        vy: (Math.random() - 0.5) * 110,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        color: Math.random() < 0.7 ? '#8b0000' : '#ff2e88',
        size: Math.random() < 0.5 ? 2 : 1,
      });
    }

    this.killStreak += 1;
    this.coinGain(0.5);

    if (zombie.boss) {
      this.boss = null;
      this.shake = 10;
      const bonus = 15 + this.day * 2;
      this.coinsEarned += Math.round(bonus * this.character.coins);
      this.cb.onCoins(Math.round(bonus * this.character.coins));
      this.setTip(`CHEFE DERROTADO  +$${Math.round(bonus * this.character.coins)}`, 4);
    }

    if (this.killed >= this.total) this.completeNight();
  }

  completeNight() {
    this.day += 1;
    this.recalcStats();
    this.cb.onBestDay(this.day);

    const nightCoins = Math.round(5 * this.character.coins);
    this.coinsEarned += nightCoins;
    this.cb.onCoins(nightCoins);
    this.cb.onNightEnd(this.day);

    this.beginDay();

    // Sem baú, o aviso do dia mostra o que a noite rendeu.
    if (!this.chest) {
      this.setTip(
        `DIA ${this.day}  +$${nightCoins}  +${BASE_DAMAGE_PER_NIGHT} DANO  +${RESISTANCE_PER_NIGHT} RES  -  ${DAY_SECONDS}s DE CURA`,
        3.4
      );
    }
  }

  hurt(amount) {
    if (this.player.hurtCd > 0 || !this.active) return;

    this.hp -= Math.max(1, Math.round(amount - this.resistance));
    this.player.hurtCd = 0.4;
    this.shake = 5;
    this.cb.onHurt();
  }

  gameOver() {
    this.active = false;
    this.mouse.down = false;
    this.cb.onGameOver({ day: this.day, coins: this.coinsEarned });
  }

  // Renderiza o fundo de um bioma: céu, luz, manchas, tufo e borda temática.
  renderBiomeCanvas(biome) {
    const { W, H } = this;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');

    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, biome.sky[0]);
    base.addColorStop(0.5, biome.sky[1]);
    base.addColorStop(1, biome.sky[2]);
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);

    const light = g.createRadialGradient(
      W / 2,
      H * 0.55,
      8,
      W / 2,
      H * 0.55,
      Math.max(W, H) * 0.55
    );
    light.addColorStop(0, biome.glow[0]);
    light.addColorStop(0.55, biome.glow[1]);
    light.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = light;
    g.fillRect(0, 0, W, H);

    for (let i = 0; i < 26; i += 1) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const rx = 3 + Math.random() * 9;
      const ry = 1 + Math.random() * 3;

      g.globalAlpha = 0.28;
      g.fillStyle = biome.blotch[i % biome.blotch.length];
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;

    g.fillStyle = biome.tuft;
    for (let i = 0; i < Math.round((W * H) / 700); i += 1) {
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      const height = 1 + Math.floor(Math.random() * 2);
      g.fillRect(x, y, 1, height);
    }

    for (let i = 0; i < 16; i += 1) {
      g.fillStyle = biome.speck[i % biome.speck.length];
      g.fillRect(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 2, 1);
    }

    const drawCanopy = (x, y, radius, color, rim) => {
      g.globalAlpha = 0.6;
      g.fillStyle = '#000000';
      g.beginPath();
      g.arc(x + 3, y + 4, radius, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;

      g.fillStyle = color;
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.arc(x - radius * 0.4, y - radius * 0.3, radius * 0.6, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.arc(x + radius * 0.45, y - radius * 0.15, radius * 0.55, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = rim;
      g.globalAlpha = 0.4;
      g.beginPath();
      g.arc(x - radius * 0.2, y - radius * 0.25, radius * 0.42, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    };

    const borderTrees = (side) => {
      const step = 24;

      if (side === 0 || side === 2) {
        for (let x = -10; x < W + step; x += step * (0.7 + Math.random() * 0.5)) {
          const y = side === 0 ? -2 + Math.random() * 8 : H + 2 - Math.random() * 8;
          drawCanopy(x, y, 10 + Math.random() * 9, biome.borderColor, biome.borderRim);
        }
      } else {
        for (let y = -10; y < H + step; y += step * (0.7 + Math.random() * 0.5)) {
          const x = side === 1 ? W + 2 - Math.random() * 8 : -2 + Math.random() * 8;
          drawCanopy(x, y, 10 + Math.random() * 9, biome.borderColor, biome.borderRim);
        }
      }
    };

    const borderFence = (side) => {
      const step = 18;
      g.fillStyle = biome.borderColor;
      if (side === 0 || side === 2) {
        const y = side === 0 ? 4 : H - 6;
        for (let x = 0; x < W; x += step) g.fillRect(x, y, 3, 8);
        g.fillRect(0, y + 3, W, 1);
      } else {
        const x = side === 1 ? W - 6 : 4;
        for (let y = 0; y < H; y += step) g.fillRect(x, y, 8, 3);
        g.fillRect(x + 3, 0, 1, H);
      }
    };

    const borderRuins = (side) => {
      g.fillStyle = biome.borderColor;
      if (side === 0 || side === 2) {
        const y = side === 0 ? 0 : H - 26 - Math.random() * 10;
        for (let x = 0; x < W; x += 30 + Math.random() * 26) {
          const h = 18 + Math.random() * 16;
          g.fillRect(x, side === 0 ? 0 : H - h, 16 + Math.random() * 10, h);
          g.fillStyle = biome.borderRim;
          g.fillRect(x + 3, side === 0 ? 2 : H - h + 2, 2, 2);
          g.fillStyle = biome.borderColor;
        }
        g.fillRect(0, side === 0 ? 10 : H - 12, W, 2);
      } else {
        for (let y = 0; y < H; y += 34 + Math.random() * 24) {
          const h = 20 + Math.random() * 14;
          g.fillRect(side === 1 ? W - h : 0, y, h, 14 + Math.random() * 8);
        }
      }
    };

    const borderSpikes = (side) => {
      g.fillStyle = biome.borderColor;
      const step = 16;
      if (side === 0 || side === 2) {
        const base = side === 0 ? 0 : H;
        for (let x = -4; x < W + step; x += step) {
          const h = 8 + Math.random() * 14;
          const dir = side === 0 ? 1 : -1;
          g.beginPath();
          g.moveTo(x, base);
          g.lineTo(x + 4, base + dir * h);
          g.lineTo(x + 8, base);
          g.fill();
          g.fillStyle = biome.borderRim;
          g.fillRect(x + 3, base + dir * (h - 3), 2, 3);
          g.fillStyle = biome.borderColor;
        }
      } else {
        const base = side === 1 ? W : 0;
        for (let y = -4; y < H + step; y += step) {
          const h = 8 + Math.random() * 14;
          const dir = side === 1 ? -1 : 1;
          g.beginPath();
          g.moveTo(base, y);
          g.lineTo(base + dir * h, y + 4);
          g.lineTo(base, y + 8);
          g.fill();
        }
      }
    };

    if (biome.border === 'trees') {
      borderTrees(0);
      borderTrees(2);
      borderTrees(1);
      borderTrees(3);
    } else if (biome.border === 'fence') {
      borderFence(0);
      borderFence(2);
      borderFence(1);
      borderFence(3);
    } else if (biome.border === 'ruins') {
      borderRuins(0);
      borderRuins(2);
      borderRuins(1);
      borderRuins(3);
    } else {
      borderSpikes(0);
      borderSpikes(2);
      borderSpikes(1);
      borderSpikes(3);
    }

    // Decoração interna de cada bioma.
    if (biome.groundKind === 'tufts') {
      for (let i = 0; i < 7; i += 1) {
        const x = MARGIN + 20 + Math.random() * (W - 2 * MARGIN - 40);
        const y = MARGIN + 20 + Math.random() * (H - 2 * MARGIN - 40);

        if (Math.hypot(x - W / 2, y - H / 2) < 55) continue;

        g.fillStyle = '#121a12';
        g.fillRect(Math.round(x) - 3, Math.round(y) - 5, 6, 3);
        g.globalAlpha = 0.35;
        g.fillStyle = '#000000';
        g.beginPath();
        g.arc(x + 2, y + 1, 5, 0, Math.PI * 2);
        g.fill();
        g.globalAlpha = 1;
      }

      for (let i = 0; i < 9; i += 1) {
        const x = MARGIN + Math.random() * (W - MARGIN * 2);
        const y = MARGIN + Math.random() * (H - MARGIN * 2);

        if (Math.hypot(x - W / 2, y - H / 2) < 45) continue;

        drawCanopy(x, y, 3 + Math.random() * 4, '#08140a', biome.borderRim);
      }
    } else if (biome.groundKind === 'lanes') {
      // Faixas da estrada: fileiras de tinta desbotada.
      g.fillStyle = '#5a5a52';
      for (const laneX of [W * 0.3, W * 0.7]) {
        for (let y = 6; y < H; y += 22) {
          g.fillRect(Math.round(laneX + Math.random() * 2), y, 2, 10);
        }
      }
      for (let i = 0; i < 6; i += 1) {
        const x = MARGIN + Math.random() * (W - MARGIN * 2);
        const y = MARGIN + Math.random() * (H - MARGIN * 2);
        g.fillStyle = '#23232b';
        g.fillRect(Math.round(x), Math.round(y), 5 + Math.random() * 6, 3);
      }
    } else if (biome.groundKind === 'rubble') {
      // Escombros e destroços de cidade abandonada.
      for (let i = 0; i < 8; i += 1) {
        const x = MARGIN + Math.random() * (W - MARGIN * 2 - 14);
        const y = MARGIN + Math.random() * (H - MARGIN * 2 - 14);
        g.fillStyle = '#1a1c24';
        g.fillRect(Math.round(x), Math.round(y), 10 + Math.random() * 8, 6 + Math.random() * 5);
        g.fillStyle = biome.borderRim;
        g.fillRect(Math.round(x) + 2, Math.round(y) + 2, 2, 2);
        g.fillRect(Math.round(x) + 6, Math.round(y) + 4, 2, 2);
      }
      for (let i = 0; i < 5; i += 1) {
        const x = MARGIN + Math.random() * (W - MARGIN * 2);
        const y = MARGIN + Math.random() * (H - MARGIN * 2);
        g.fillStyle = '#5a2b2b';
        g.fillRect(Math.round(x), Math.round(y), 3, 2);
      }
    } else {
      // Núcleo: veias de infecção brilhando no chão.
      for (let i = 0; i < 9; i += 1) {
        const x = MARGIN + Math.random() * (W - MARGIN * 2);
        const y = MARGIN + Math.random() * (H - MARGIN * 2);
        g.fillStyle = '#3a0d14';
        g.fillRect(Math.round(x), Math.round(y), 4 + Math.random() * 6, 2);
        g.fillStyle = biome.borderRim;
        g.globalAlpha = 0.5;
        g.fillRect(Math.round(x) + 1, Math.round(y), 1, 1);
        g.globalAlpha = 1;
      }
    }

    return canvas;
  }

  // Itens de terreno que rolam continuamente, dando a sensação de avanço.
  makeDecor(biome) {
    const { W, H } = this;
    const items = [];
    const area = (W * H) / 2400;

    if (biome.groundKind === 'tufts') {
      for (let i = 0; i < area; i += 1) {
        items.push({
          x: Math.random() * W,
          y: Math.random() * H,
          w: 1,
          h: 1 + Math.floor(Math.random() * 2),
          c: biome.ground[i % biome.ground.length],
        });
      }
      for (let i = 0; i < 6; i += 1) {
        items.push({ x: Math.random() * W, y: Math.random() * H, w: 1, h: 1, c: '#ffb000' });
      }
    } else if (biome.groundKind === 'lanes') {
      for (const laneX of [W * 0.3, W * 0.7]) {
        for (let y = 0; y < H + 24; y += 16) {
          items.push({ x: laneX, y, w: 2, h: 7, c: biome.ground[0] });
        }
      }
      for (let i = 0; i < area * 0.6; i += 1) {
        items.push({
          x: Math.random() * W,
          y: Math.random() * H,
          w: 2,
          h: 1,
          c: biome.ground[1],
        });
      }
    } else if (biome.groundKind === 'rubble') {
      for (let i = 0; i < area; i += 1) {
        items.push({
          x: Math.random() * W,
          y: Math.random() * H,
          w: 2 + Math.floor(Math.random() * 3),
          h: 1 + Math.floor(Math.random() * 2),
          c: biome.ground[i % biome.ground.length],
        });
      }
    } else {
      for (let i = 0; i < area; i += 1) {
        items.push({
          x: Math.random() * W,
          y: Math.random() * H,
          w: 1 + Math.floor(Math.random() * 3),
          h: 1,
          c: biome.ground[i % biome.ground.length],
        });
      }
    }

    return items;
  }

  // Partículas ambientais de cada bioma (vagalumes, poeira, brasas, esporos).
  refreshAmbient() {
    const floor = Math.min(BIOMES.length - 1, Math.floor(this.biomePos));
    const biome = BIOMES[floor];

    this.fireflies = Array.from(
      { length: Math.round((this.W * this.H) / 2600) + 8 },
      () => ({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        phase: Math.random() * Math.PI * 2,
        tint: biome.ambient[Math.floor(Math.random() * biome.ambient.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 10,
      })
    );
  }

  buildBackground() {
    const floor = Math.min(BIOMES.length - 1, Math.floor(this.biomePos || 0));
    this.bg = this.renderBiomeCanvas(BIOMES[floor]);
    this.decor = this.makeDecor(BIOMES[floor]);
    this.decorNext = null;
    this.bgNext = null;
    this.bgFrom = null;
    this.biomeFade = 0;
  }

  // Avança a posição no eixo dos biomas e conduz a travessia entre eles.
  updateBiome(dt) {
    const prevFloor = Math.min(BIOMES.length - 1, Math.floor(this.biomePos));

    this.scrollY += dt * (BIOMES[prevFloor].scroll + (this.biomeFade > 0 ? 10 : 0));

    if (this.landmark) {
      this.landmark.t += dt;
      if (this.landmark.t >= this.landmark.dur) this.landmark = null;
    }

    if (this.biomeFade > 0) {
      this.biomeFade = Math.min(1, this.biomeFade + dt / BIOME_FADE_SECONDS);
      if (this.biomeFade >= 1) {
        this.bg = this.bgNext;
        this.bgFrom = null;
        this.bgNext = null;
        this.decor = this.decorNext;
        this.decorNext = null;
        this.biomeFade = 0;
      }
    }

    if (this.biomePos >= BIOMES.length - 1) return;

    this.biomePos = Math.min(BIOMES.length - 1, this.biomePos + dt / BIOME_SECONDS);

    const floor = Math.floor(this.biomePos);
    if (floor !== prevFloor) {
      this.biomeFade = 0.0001;
      this.bgFrom = this.bg;
      this.bgNext = this.renderBiomeCanvas(BIOMES[floor]);
      this.decorNext = this.makeDecor(BIOMES[floor]);
      this.refreshAmbient();
      this.landmark = { t: 0, dur: 3.4, kind: BIOMES[floor].landmark };
      if (BIOMES[floor].landmark) {
        this.setTip(`ENTRANDO NA ${BIOMES[floor].name}`, 3.2);
      }
      this.playBiomeSound(BIOMES[floor].sound);
    }
  }


  particlesUpdate(dt) {
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life -= dt;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  update(dt) {
    if (!this.active) return;

    this.time += dt;
    this.updateBiome(dt);

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 45);
    if (this.tipUntil > 0 && this.time > this.tipUntil) {
      this.tip = '';
      this.tipUntil = 0;
    }

    const player = this.player;
    let dx = 0;
    let dy = 0;

    if (this.keys.has('a') || this.keys.has('arrowleft')) dx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) dx += 1;
    if (this.keys.has('w') || this.keys.has('arrowup')) dy -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) dy += 1;

    if (this.moveStick.active) {
      dx += this.moveStick.x;
      dy += this.moveStick.y;
    }

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      dx /= length;
      dy /= length;

      const speedMult = this.character.speed * (this.tool.moveMult || 1);
      player.x += dx * 92 * speedMult * dt;
      player.y += dy * 92 * speedMult * dt;
      player.x = Math.min(Math.max(player.x, MARGIN), this.W - MARGIN);
      player.y = Math.min(Math.max(player.y, MARGIN), this.H - MARGIN);

      player.moving = true;
      player.walkPhase += dt * 7;
    } else {
      player.moving = false;
    }

    player.attackCd = Math.max(0, player.attackCd - dt);
    player.hurtCd = Math.max(0, player.hurtCd - dt);

    const aimAmount = Math.hypot(this.aimStick.x, this.aimStick.y);
    const stickAiming = this.aimStick.active && aimAmount > 0.2;
    let aim;

    if (stickAiming) {
      // Auto-mira leve: encaixa no zumbi mais próximo dentro do cone do analógico.
      aim = this.assistAim(Math.atan2(this.aimStick.y, this.aimStick.x));
    } else {
      aim = Math.atan2(this.mouse.y - player.y, this.mouse.x - player.x);
    }

    this.aim = aim;

    if (this.mouse.down || stickAiming) this.tryAttack(aim);

    for (const swing of this.swings) swing.t += dt;
    this.swings = this.swings.filter((swing) => swing.t < swing.dur);

    const maxAlive = Math.min(4 + this.day, 12);
    const normalTotal = this.total - (this.bossNight ? 1 : 0);

    if (this.phase === 'day') {
      this.dayTimer = Math.max(0, this.dayTimer - dt);

      // Durante o dia a vida se recupera sozinha.
      if (this.hp > 0 && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + (this.maxHp / DAY_SECONDS) * dt);
      }

      if (this.chest) {
        this.chest.t += dt;
        const reach = player.radius + 14;
        if (Math.hypot(player.x - this.chest.x, player.y - this.chest.y) <= reach) {
          this.openGroundChest();
        }
      }

      if (this.dayTimer <= 0) this.startNight();
    }

    if (this.phase === 'night' && this.spawned < normalTotal && this.zombies.length < maxAlive) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnZombie();
        this.spawnTimer = Math.max(0.4, 1.25 - this.day * 0.04);
      }
    } else if (this.phase === 'night' && this.bossNight && !this.bossSpawned) {
      this.spawnBoss();
    }

    for (const zombie of this.zombies) {
      zombie.flash = Math.max(0, zombie.flash - dt);
      zombie.attackCd = Math.max(0, zombie.attackCd - dt);

      const toX = player.x - zombie.x;
      const toY = player.y - zombie.y;
      const distance = Math.hypot(toX, toY) || 1;
      const wobble = Math.sin(this.time * 2 + zombie.phase) * 0.16;
      const angle = Math.atan2(toY, toX) + wobble;

      zombie.x += (Math.cos(angle) * zombie.speed + zombie.kx) * dt;
      zombie.y += (Math.sin(angle) * zombie.speed + zombie.ky) * dt;

      zombie.kx -= zombie.kx * Math.min(1, dt * 7);
      zombie.ky -= zombie.ky * Math.min(1, dt * 7);

      if (distance < zombie.radius + player.radius + 3 && zombie.attackCd <= 0) {
        zombie.attackCd = 1;
        this.hurt(zombie.damage);
      }

      if (zombie.boss) {
        zombie.slamCd -= dt;

        if (zombie.slamCd <= 0) {
          zombie.slamCd = 4.5;

          if (distance < 52) {
            this.hurt(zombie.damage * 0.9);
          }

          this.shocks.push({ x: zombie.x, y: zombie.y, t: 0, radius: 6 });
          this.shake = 7;

          for (let i = 0; i < 14; i += 1) {
            const burst = (Math.PI * 2 * i) / 14;
            this.particles.push({
              x: zombie.x,
              y: zombie.y - 6,
              vx: Math.cos(burst) * (55 + Math.random() * 45),
              vy: Math.sin(burst) * (55 + Math.random() * 45),
              life: 0.35,
              maxLife: 0.35,
              color: i % 2 === 0 ? '#ff2e88' : '#8b0000',
              size: 2,
            });
          }
        }
      }
    }

    for (const shock of this.shocks) {
      shock.t += dt;
      shock.radius = 6 + shock.t * 120;
    }
    this.shocks = this.shocks.filter((shock) => shock.t < 0.55);

    for (let i = 0; i < this.zombies.length; i += 1) {
      for (let j = i + 1; j < this.zombies.length; j += 1) {
        const a = this.zombies[i];
        const b = this.zombies[j];
        const distX = b.x - a.x;
        const distY = b.y - a.y;
        const dist = Math.hypot(distX, distY);

        if (dist > 0 && dist < 9) {
          const push = (9 - dist) / 2;
          const nx = distX / dist;
          const ny = distY / dist;
          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;
        }
      }
    }

    this.particlesUpdate(dt);

    if (this.hp <= 0 && this.active) {
      this.gameOver();
      return;
    }

    if (this.active) {
      this.cb.onHud({
        day: this.day,
        killed: this.killed,
        total: this.total,
        hp: Math.max(0, this.hp),
        maxHp: this.maxHp,
        damage: this.damage,
        resistance: this.resistance,
        tip: this.tip,
        phase: this.phase,
        biome: BIOMES[Math.min(BIOMES.length - 1, Math.floor(this.biomePos))].name,
        dayLeft: this.phase === 'day' ? this.dayTimer : 0,
        chest: Boolean(this.chest),
        boss: this.boss
          ? { name: this.boss.name, hp: Math.max(0, this.boss.hp), maxHp: this.boss.maxHp }
          : null,
        bossNight: this.bossNight,
      });
    }
  }

  drawZombie(zombie) {
    const { ctx } = this;
    const scale = zombie.scale || 1;
    const left = Math.round(zombie.x - 5 * scale);
    const top = Math.round(zombie.y - 18 * scale);
    const flip = zombie.x > this.player.x;
    const bob = Math.sin(this.time * 2.2 + zombie.phase) > 0 ? scale : 0;

    if (zombie.boss) {
      ctx.globalAlpha = 0.32 + 0.18 * Math.sin(this.time * 4);
      ctx.fillStyle = '#ff2e88';
      ctx.beginPath();
      ctx.arc(zombie.x, zombie.y - 8, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000000';
    ctx.fillRect(left + 1, Math.round(zombie.y) - 1, 8 * scale, 2);
    ctx.globalAlpha = 1;

    const palette = {
      '#': zombie.boss ? '#3a0d14' : zombie.skin || '#1b2e1b',
      b: zombie.blood,
      x: '#9aa38f',
      e: zombie.eye,
    };

    drawSprite(ctx, zombie.sprite, left, top + bob, palette, flip, zombie.flash > 0, scale);

    if (zombie.boss) {
      // Coroa de chefe.
      const crownX = Math.round(zombie.x - 5);
      const crownY = top - 5;
      ctx.fillStyle = '#ffb000';
      ctx.fillRect(crownX, crownY, 10, 3);
      ctx.fillRect(crownX, crownY - 3, 2, 3);
      ctx.fillRect(crownX + 4, crownY - 4, 2, 4);
      ctx.fillRect(crownX + 8, crownY - 3, 2, 3);
    }

    if (zombie.hp < zombie.maxHp) {
      const barWidth = zombie.boss ? 26 : 12;
      const barLeft = zombie.boss ? Math.round(zombie.x - barWidth / 2) : left - 1;
      const ratio = Math.max(0, zombie.hp / zombie.maxHp);
      ctx.fillStyle = '#1a0808';
      ctx.fillRect(barLeft, top - 5, barWidth, 2);
      ctx.fillStyle = zombie.boss ? '#ffb000' : '#ff2e88';
      ctx.fillRect(barLeft, top - 5, Math.max(1, Math.round(barWidth * ratio)), 2);
    }
  }

  drawPlayer() {
    const { ctx } = this;
    const player = this.player;
    const moving = player.moving;
    const frame = moving ? Math.floor(player.walkPhase) % 2 : 0;
    const sprite = moving ? PLAYER_WALK_SPRITES[frame] : PLAYER_SPRITE;
    const bob = moving && frame === 1 ? 1 : 0;
    const left = Math.round(player.x - 5);
    const top = Math.round(player.y - 17 - bob);
    const flip = this.mouse.x < player.x;

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000000';
    ctx.fillRect(left + 1, Math.round(player.y) - 1, 8, 2);
    ctx.globalAlpha = 1;

    drawSprite(ctx, sprite, left, top, this.character.palette, flip, false);
    this.drawCharacterDetails(left, top, flip);
    this.drawTool();
  }

  // Sardinhas e outros detalhes do personagem, desenhados sobre o sprite.
  drawCharacterDetails(left, top, flip) {
    const details = this.character.details;
    if (!details || details.length === 0) return;

    const { ctx } = this;
    const width = PLAYER_SPRITE[0].length;

    for (const dot of details) {
      const x = left + (flip ? width - 1 - dot.x : dot.x);
      ctx.fillStyle = dot.c;
      ctx.fillRect(x, top + dot.y, 1, 1);
    }
  }

  drawTool() {
    const { ctx } = this;
    const player = this.player;
    const aim = this.aim || 0;
    const swing = this.swings.length > 0 ? this.swings[this.swings.length - 1] : null;

    let angle = aim;
    if (swing) {
      const progress = Math.min(1, swing.t / swing.dur);
      angle = swing.from + (swing.to - swing.from) * easeOutCubic(progress);
    }

    const armSway = player.moving
      ? Math.sin(player.walkPhase * Math.PI) * 0.8
      : Math.sin(this.time * 2) * 0.35;

    const handX = Math.round(player.x + Math.cos(aim) * 3.2);
    const handY = Math.round(player.y - 9 + Math.sin(aim) * 1.6 + armSway);

    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(angle);

    switch (this.toolId) {
      case 'axe':
        this.drawAxe();
        break;
      case 'bat':
        this.drawBat();
        break;
      case 'machete':
        this.drawMachete();
        break;
      case 'spear':
        this.drawSpear();
        break;
      case 'gun':
        this.drawGun();
        break;
      case 'flamethrower':
        this.drawFlamethrower();
        break;
      case 'chainsaw':
        this.drawChainsaw();
        break;
      case 'crossbow':
        this.drawCrossbow();
        break;
      case 'scythe':
        this.drawScythe();
        break;
      case 'smg':
        this.drawSmg();
        break;
      case 'hammer':
        this.drawHammer();
        break;
      case 'katana':
        this.drawKatana();
        break;
      case 'minigun':
        this.drawMinigun();
        break;
      case 'plasma':
        this.drawPlasma();
        break;
      default:
        this.drawKnife();
    }

    ctx.restore();
  }

  drawKnife() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -2, 11, 4);

    ctx.fillStyle = '#6b3a1f';
    ctx.fillRect(-3, -1, 3, 2);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(0, -2, 1, 4);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(1, -1, 5, 2);

    ctx.fillStyle = '#f3f3e8';
    ctx.fillRect(2, -2, 3, 1);
    ctx.fillRect(2, 1, 3, 1);

    ctx.fillStyle = '#9aa38f';
    ctx.fillRect(6, 0, 2, 1);
  }

  drawAxe() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -2, 15, 4);
    ctx.fillRect(5, -6, 7, 12);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-3, -1, 12, 2);
    ctx.fillStyle = '#4a2a10';
    ctx.fillRect(-3, 1, 12, 1);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(5, -3, 2, 6);
    ctx.fillRect(7, -5, 3, 4);
    ctx.fillRect(7, 1, 3, 4);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(8, -5, 1, 4);
    ctx.fillRect(9, -4, 1, 8);
    ctx.fillRect(8, 1, 1, 4);
  }

  drawBat() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -3, 16, 6);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-3, -1, 11, 2);
    ctx.fillStyle = '#a06a34';
    ctx.fillRect(3, -2, 6, 4);
    ctx.fillStyle = '#c78a4a';
    ctx.fillRect(6, -2, 3, 1);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(0, -1, 1, 2);
    ctx.fillRect(2, -1, 1, 2);
  }

  drawMachete() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -3, 14, 6);

    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(-3, -1, 4, 2);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(1, -2, 1, 4);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(2, -1, 7, 2);
    ctx.fillStyle = '#f3f3e8';
    ctx.fillRect(3, -2, 5, 1);
    ctx.fillStyle = '#9aa38f';
    ctx.fillRect(8, 0, 2, 1);
  }

  drawSpear() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-5, -2, 20, 4);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-4, -1, 13, 2);
    ctx.fillStyle = '#4a2a10';
    ctx.fillRect(-4, 1, 13, 1);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(8, -2, 1, 4);

    ctx.fillStyle = '#39ff14';
    ctx.fillRect(9, -1, 3, 2);
    ctx.fillRect(11, -2, 2, 1);
    ctx.fillRect(11, 1, 2, 1);

    ctx.fillStyle = '#b6ff9a';
    ctx.fillRect(10, -1, 2, 1);
    ctx.fillRect(10, 2, 1, 1);
  }

  drawGun() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -4, 15, 8);

    ctx.fillStyle = '#2f3b34';
    ctx.fillRect(-3, -2, 8, 4);
    ctx.fillStyle = '#1e4a26';
    ctx.fillRect(-3, 1, 3, 4);
    ctx.fillRect(0, 1, 2, 3);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(4, -1, 6, 2);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(5, -1, 2, 1);
  }

  drawFlamethrower() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -4, 16, 8);

    ctx.fillStyle = '#4a4a44';
    ctx.fillRect(-3, -2, 9, 4);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(-3, -2, 2, 4);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(5, -1, 6, 2);
    ctx.fillStyle = '#ffb000';
    ctx.fillRect(10, -2, 2, 4);
    ctx.fillStyle = '#ff5a00';
    ctx.fillRect(11, -1, 1, 2);
  }

  drawChainsaw() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -4, 16, 8);

    ctx.fillStyle = '#c9302c';
    ctx.fillRect(-3, -2, 8, 4);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(-3, -2, 2, 4);

    ctx.fillStyle = '#9aa38f';
    ctx.fillRect(5, -2, 8, 4);
    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(6, -2, 1, 4);
    ctx.fillRect(8, -2, 1, 4);
    ctx.fillRect(10, -2, 1, 4);
    ctx.fillRect(12, -2, 1, 4);
    ctx.fillStyle = '#ffb000';
    ctx.fillRect(5, -3, 2, 1);
  }

  drawCrossbow() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -2, 15, 4);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-3, -1, 13, 2);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(4, -5, 1, 10);
    ctx.fillRect(5, -4, 1, 2);
    ctx.fillRect(5, 2, 1, 2);
    ctx.fillRect(6, -1, 6, 2);

    ctx.fillStyle = '#39ff14';
    ctx.fillRect(11, -1, 2, 2);
  }

  drawScythe() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-6, -2, 18, 4);
    ctx.fillRect(7, -10, 6, 10);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-5, -1, 13, 2);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(7, -9, 4, 2);
    ctx.fillRect(9, -7, 3, 2);
    ctx.fillRect(10, -5, 2, 2);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(8, -8, 1, 2);
    ctx.fillRect(9, -6, 1, 2);
  }

  drawSmg() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-3, -4, 13, 8);

    ctx.fillStyle = '#2f3b34';
    ctx.fillRect(-2, -2, 6, 3);
    ctx.fillStyle = '#1e4a26';
    ctx.fillRect(-2, 1, 2, 3);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(4, -1, 5, 2);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(2, -2, 2, 1);
  }

  drawHammer() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -2, 16, 4);
    ctx.fillRect(9, -7, 5, 14);

    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(-3, -1, 12, 2);
    ctx.fillStyle = '#4a2a10';
    ctx.fillRect(-3, 1, 12, 1);

    ctx.fillStyle = '#9aa38f';
    ctx.fillRect(9, -6, 4, 12);
    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(10, -6, 2, 12);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(12, -3, 1, 6);
  }

  drawChest() {
    if (!this.chest) return;

    const { ctx } = this;
    const { x, y } = this.chest;
    const pulse = 0.5 + 0.5 * Math.sin(this.chest.t * 5);

    const glow = ctx.createRadialGradient(x, y - 4, 2, x, y - 4, 26 + pulse * 8);
    glow.addColorStop(0, `rgba(255, 176, 0, ${0.28 + pulse * 0.16})`);
    glow.addColorStop(1, 'rgba(255, 176, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 36, y - 40, 72, 72);

    const left = Math.round(x) - 7;
    const top = Math.round(y) - 10;

    ctx.fillStyle = '#050505';
    ctx.fillRect(left - 1, top + 1, 16, 12);

    ctx.fillStyle = '#8a5a00';
    ctx.fillRect(left, top + 3, 14, 8);

    ctx.fillStyle = '#ffb000';
    ctx.fillRect(left, top + 3, 14, 2);
    ctx.fillRect(left, top + 7, 1, 4);
    ctx.fillRect(left + 13, top + 7, 1, 4);

    ctx.fillStyle = '#ffd970';
    ctx.fillRect(left + 1, top + 4, 12, 1);
    ctx.fillRect(left + 6, top + 3, 2, 9);

    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(left + 6, top + 6, 2, 2);

    // Brilho piscando em volta do baú.
    ctx.globalAlpha = 0.35 + pulse * 0.45;
    ctx.fillStyle = '#ffe066';
    const sparkles = [
      [left - 3, top - 2],
      [left + 15, top + 1],
      [left + 4, top + 13],
      [left + 11, top - 5],
    ];
    sparkles.forEach(([sx, sy], index) => {
      if (Math.sin(this.chest.t * 4 + index) > 0.2) ctx.fillRect(sx, sy, 1, 1);
    });
    ctx.globalAlpha = 1;
  }

  drawKatana() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-5, -2, 18, 4);

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-4, -1, 4, 2);

    ctx.fillStyle = '#ffb000';
    ctx.fillRect(0, -3, 2, 6);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(2, -1, 10, 2);
    ctx.fillStyle = '#f7f7ee';
    ctx.fillRect(2, -1, 9, 1);
    ctx.fillStyle = '#9aa38f';
    ctx.fillRect(11, -1, 1, 1);

    ctx.fillStyle = '#ffb000';
    ctx.fillRect(9, 0, 1, 1);
  }

  drawMinigun() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -5, 18, 10);

    ctx.fillStyle = '#2f3b34';
    ctx.fillRect(-3, -2, 9, 5);
    ctx.fillStyle = '#1e4a26';
    ctx.fillRect(-3, 3, 4, 3);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(6, -3, 7, 2);
    ctx.fillRect(6, -1, 7, 1);
    ctx.fillRect(6, 1, 7, 2);

    ctx.fillStyle = '#ffb000';
    ctx.fillRect(5, -4, 2, 1);
    ctx.fillRect(5, 3, 2, 1);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(-1, -3, 2, 1);
  }

  drawPlasma() {
    const { ctx } = this;

    ctx.fillStyle = '#050505';
    ctx.fillRect(-4, -5, 20, 10);

    ctx.fillStyle = '#2a1e4a';
    ctx.fillRect(-3, -3, 10, 6);
    ctx.fillStyle = '#1a1030';
    ctx.fillRect(-3, 2, 5, 3);

    ctx.fillStyle = '#39ff14';
    ctx.fillRect(1, -2, 4, 4);
    ctx.fillStyle = '#b6ff9a';
    ctx.fillRect(2, -1, 2, 2);

    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(7, -2, 7, 4);
    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(7, -2, 1, 4);
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(13, -1, 2, 2);
    ctx.fillStyle = '#b6ff9a';
    ctx.fillRect(14, 0, 1, 1);
  }

  drawSwings() {
    const { ctx } = this;
    const player = this.player;
    const cx = player.x;
    const cy = player.y - 8;

    for (const swing of this.swings) {
      const progress = Math.min(1, swing.t / swing.dur);
      const eased = easeOutCubic(progress);
      const alpha = Math.sin(progress * Math.PI) * 0.8;

      if (swing.style === 'shot') {
        const endX = cx + Math.cos(swing.angle) * swing.range;
        const endY = cy + Math.sin(swing.angle) * swing.range;

        ctx.globalAlpha = alpha * 0.4;
        ctx.strokeStyle = '#ffb000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#fff3b0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
          Math.round(cx + Math.cos(swing.angle) * 5) - 1,
          Math.round(cy + Math.sin(swing.angle) * 5) - 1,
          3,
          3
        );
        continue;
      }

      if (swing.style === 'flame') {
        const radius = swing.range * (0.55 + 0.45 * eased);
        const outerArc = swing.arc / 2;

        ctx.globalAlpha = alpha * 0.22;
        ctx.fillStyle = '#ff5a00';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, swing.angle - outerArc, swing.angle + outerArc);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = alpha * 0.32;
        ctx.fillStyle = '#ffb000';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius * 0.62, swing.angle - outerArc * 0.55, swing.angle + outerArc * 0.55);
        ctx.closePath();
        ctx.fill();
        continue;
      }

      const start = Math.min(swing.from, swing.from + (swing.to - swing.from) * eased);
      const end = Math.max(swing.from, swing.from + (swing.to - swing.from) * eased);
      const radius = swing.range * 0.82;

      ctx.globalAlpha = alpha * 0.35;
      ctx.strokeStyle = this.tool.rarity === 'mitica' ? '#ffb000' : '#39ff14';
      ctx.lineWidth = swing.width + 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, start, end);
      ctx.stroke();

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#d8d8d0';
      ctx.lineWidth = swing.width;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, start, end);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        Math.round(cx + Math.cos(end) * radius),
        Math.round(cy + Math.sin(end) * radius),
        1,
        1
      );
    }

    ctx.globalAlpha = 1;
  }

  drawParticles() {
    const { ctx } = this;

    for (const particle of this.particles) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size);
    }

    ctx.globalAlpha = 1;
  }

  drawFireflies() {
    const { ctx } = this;
    if (!this.fireflies) return;

    for (const firefly of this.fireflies) {
      const driftX = firefly.vx * this.time;
      const driftY = firefly.vy * this.time;
      const x = (((firefly.x + driftX) % this.W) + this.W) % this.W;
      const y = (((firefly.y + driftY) % this.H) + this.H) % this.H;
      const px = x + Math.sin(this.time * 0.6 + firefly.phase) * 7;
      const py = y + Math.cos(this.time * 0.45 + firefly.phase) * 5;

      ctx.globalAlpha = 0.18 + 0.4 * Math.abs(Math.sin(this.time * 1.1 + firefly.phase));
      ctx.fillStyle = firefly.tint;
      ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
    }

    ctx.globalAlpha = 1;
  }

  drawGroundDecor(alpha, items) {
    if (!items || items.length === 0 || alpha <= 0) return;
    const { ctx, W, H } = this;
    const PH = H + 24;

    ctx.globalAlpha = alpha;
    for (const item of items) {
      let y = (item.y + this.scrollY) % PH;
      if (y < 0) y += PH;
      y -= 12;

      ctx.fillStyle = item.c;
      if (item.e) {
        ctx.beginPath();
        ctx.ellipse(item.x, y, item.w, item.h, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(Math.round(item.x), Math.round(y), item.w, item.h);
      }
    }
    ctx.globalAlpha = 1;
  }

  // Marco da fronteira entre biomas: atravessa a tela durante a travessia.
  drawLandmark() {
    if (!this.landmark) return;
    const { ctx, W, H } = this;
    const { t, dur, kind } = this.landmark;
    if (!kind) return;

    const p = Math.min(1, t / dur);
    const ease = easeOutCubic(p);
    const alpha = p < 0.22 ? p / 0.22 : p > 0.78 ? (1 - p) / 0.22 : 1;
    const bandH = 54;
    const y = -bandH - 8 + ease * (H + 2 * bandH + 16);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (kind === 'bridge') {
      // Ponte de madeira da estrada: tábuas e corrimãos.
      ctx.fillStyle = '#4a3524';
      for (let x = 0; x < W; x += 9) {
        ctx.fillRect(x, y + 6, 8, bandH - 12);
      }
      ctx.fillStyle = '#6b4a2f';
      ctx.fillRect(0, y + 8, W, 2);
      ctx.fillRect(0, y + bandH - 10, W, 2);
      for (let x = 6; x < W; x += 36) {
        ctx.fillRect(x, y + 2, 2, bandH - 4);
      }
    } else if (kind === 'arch') {
      // Arco de ruínas da cidade abandonada.
      ctx.fillStyle = '#2a2d36';
      ctx.fillRect(W * 0.18, y - 26, 12, bandH + 52);
      ctx.fillRect(W * 0.82 - 12, y - 26, 12, bandH + 52);
      ctx.fillRect(W * 0.18, y - 30, W * 0.64, 10);
      ctx.fillStyle = '#4a4f5e';
      ctx.fillRect(W * 0.18 + 2, y - 28, 3, 3);
      ctx.fillRect(W * 0.5, y - 28, 3, 3);
      ctx.fillRect(W * 0.82 - 5, y - 28, 3, 3);
      ctx.fillStyle = '#14161d';
      ctx.fillRect(W * 0.3, y + bandH - 6, 8, 6);
      ctx.fillRect(W * 0.66, y + bandH - 8, 10, 8);
    } else if (kind === 'portal') {
      // Portal do núcleo da infecção.
      const cx = W / 2;
      const cy = y + bandH / 2;
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = '#ff2e88';
      ctx.beginPath();
      ctx.arc(cx, cy, 46 + Math.sin(t * 6) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#ff2e88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffb000';
      ctx.fillRect(cx - 1, cy - 1, 2, 2);
    }

    ctx.restore();
  }

  drawFog() {
    const { ctx, W, H } = this;
    const floor = Math.min(BIOMES.length - 1, Math.floor(this.biomePos));
    const next = Math.min(BIOMES.length - 1, floor + 1);
    const fade = easeOutCubic(this.biomeFade);

    const layers = [
      [BIOMES[floor], 1 - fade],
      [BIOMES[next], fade],
    ];

    for (const [biome, alpha] of layers) {
      if (alpha <= 0) continue;

      for (let i = 0; i < 2; i += 1) {
        const cx = (((this.time * (0.01 + i * 0.008) + i * 0.5) % 1.4) - 0.2) * W;
        const cy = H * 0.6 + Math.sin(this.time * 0.4 + i) * 12;
        const radius = Math.max(W, H) * 0.35;
        const tint = i === 1 ? biome.fog[1] : biome.fog[0];

        const fog = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        fog.addColorStop(0, `rgba(${tint}, 0.05)`);
        fog.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, W, H);
      }
    }

    ctx.globalAlpha = 1;
  }

  drawShocks() {
    const { ctx } = this;

    for (const shock of this.shocks) {
      const alpha = Math.max(0, 1 - shock.t / 0.55);

      ctx.globalAlpha = alpha * 0.75;
      ctx.strokeStyle = '#ff2e88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(shock.x, shock.y - 4, shock.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = alpha * 0.4;
      ctx.strokeStyle = '#ffb000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(shock.x, shock.y - 4, shock.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  drawCrosshair() {
    const { ctx } = this;
    const x = Math.round(this.mouse.x);
    const y = Math.round(this.mouse.y);

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(x - 3, y, 2, 1);
    ctx.fillRect(x + 2, y, 2, 1);
    ctx.fillRect(x, y - 3, 1, 2);
    ctx.fillRect(x, y + 2, 1, 2);

    ctx.fillStyle = '#ff2e88';
    ctx.fillRect(x, y, 1, 1);
    ctx.globalAlpha = 1;
  }

  draw() {
    const { ctx, W, H } = this;
    if (!this.bg) return;

    ctx.clearRect(0, 0, W, H);

    ctx.save();
    if (this.shake > 0) {
      ctx.translate(
        (Math.random() * 2 - 1) * this.shake,
        (Math.random() * 2 - 1) * this.shake
      );
    }

    ctx.drawImage(this.bg, 0, 0);

    // Travessia de bioma: o fundo antigo e o novo se misturam sem corte.
    const fade = easeOutCubic(this.biomeFade);
    if (this.bgNext && fade > 0) {
      ctx.globalAlpha = fade;
      ctx.drawImage(this.bgNext, 0, 0);
      ctx.globalAlpha = 1;
    }

    // Terreno rolando continuamente (sensação de avanço, como em Mercs).
    this.drawGroundDecor(1 - fade, this.decor);
    if (this.decorNext) this.drawGroundDecor(fade, this.decorNext);

    // Marco da fronteira: ponte, arco ou portal atravessando a tela.
    this.drawLandmark();

    if (this.decals) ctx.drawImage(this.decals, 0, 0);

    this.drawChest();

    const zombies = [...this.zombies].sort((a, b) => a.y - b.y);
    for (const zombie of zombies) this.drawZombie(zombie);

    this.drawSwings();
    this.drawPlayer();
    this.drawParticles();
    this.drawShocks();
    this.drawFireflies();

    ctx.restore();

    this.drawFog();

    if (this.active) this.drawCrosshair();
  }
}
