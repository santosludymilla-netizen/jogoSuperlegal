// Backend local: quando o jogo roda sem servidor (GitHub Pages, arquivo aberto),
// contas e progresso ficam salvos no localStorage deste navegador.
// As regras abaixo espelham o db.js do servidor.

const PLAYERS_KEY = 'infected.local.players';
const SESSION_KEY = 'infected.local.session';
const DB_VERSION = 1;

const SHOP_TOOLS = {
  axe: 30,
  bat: 45,
  machete: 55,
  katana: 90,
  minigun: 160,
};

const TOOL_RARITY = {
  knife: 'comum',
  axe: 'comum',
  bat: 'comum',
  machete: 'comum',
  katana: 'rara',
  spear: 'rara',
  gun: 'rara',
  crossbow: 'rara',
  chainsaw: 'rara',
  smg: 'rara',
  flamethrower: 'mitica',
  scythe: 'mitica',
  hammer: 'mitica',
  minigun: 'mitica',
  plasma: 'mitica',
};

const CHEST_POOL = Object.keys(TOOL_RARITY).filter((id) => TOOL_RARITY[id] !== 'comum');
const CHEST_COINS_REWARD = 25;

const SHOP_CHARACTERS = {
  survivor: 0,
  runner: 120,
  medic: 150,
  brute: 180,
  thief: 200,
  tank: 220,
};

const CHARACTER_STARTER = {
  survivor: 'knife',
  runner: 'machete',
  medic: 'bat',
  brute: 'axe',
  thief: 'spear',
  tank: 'katana',
};

const POTION_PRICE = 10;
const STARTING_TOOL = 'knife';
const STARTING_CHARACTER = 'survivor';

const DAY_STEP = 10;
const MAX_DAY_ACHIEVEMENT = 100;
const KILL_TIERS = [10, 50, 100, 250, 500, 1000, 2500];

const ACHIEVEMENTS = [
  ...Array.from({ length: MAX_DAY_ACHIEVEMENT / DAY_STEP }, (_, index) => {
    const day = (index + 1) * DAY_STEP;
    return {
      id: `day_${day}`,
      kind: 'day',
      target: day,
      title: `DIA ${day}`,
      desc: `Sobreviva até o dia ${day}.`,
    };
  }),
  ...KILL_TIERS.map((kills) => ({
    id: `kills_${kills}`,
    kind: 'kills',
    target: kills,
    title: `${kills} ZUMBIS`,
    desc: `Mate ${kills} zumbis no total.`,
  })),
];

const XP_PER_NIGHT = 5;
const XP_PER_KILL = 1;
const XP_BASE = 15;
const XP_STEP = 10;

const RANKS = [
  { level: 1, title: 'SOBREVIVENTE' },
  { level: 10, title: 'ASSASSINO' },
  { level: 20, title: 'CARNICEIRO' },
  { level: 30, title: 'EXTERMINADOR' },
  { level: 40, title: 'CEIFADOR' },
  { level: 50, title: 'LENDA INFECTADA' },
];

const namePattern = /^[A-Za-z0-9_]{3,16}$/;
const passwordPattern = /^(?=.*[0-9])[A-Za-z0-9]{8,64}$/;

// ---------- utilidades ----------

function now() {
  return Date.now();
}

function xpForNext(level) {
  return XP_BASE + (Math.max(1, level) - 1) * XP_STEP;
}

function levelInfo(xp) {
  const total = Math.max(0, Math.floor(Number(xp) || 0));
  let level = 1;
  let remaining = total;
  let need = xpForNext(level);

  while (remaining >= need && level < 100000) {
    remaining -= need;
    level += 1;
    need = xpForNext(level);
  }

  const rank = RANKS.reduce((best, entry) => (level >= entry.level ? entry : best), RANKS[0]);

  return {
    xp: total,
    level,
    xpInLevel: remaining,
    xpForNext: need,
    rank: rank.title,
  };
}

async function digest(text) {
  if (globalThis.crypto?.subtle) {
    try {
      const bytes = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    } catch {
      /* contexto inseguro: cai no hash simples abaixo */
    }
  }

  // Sem SHA-256 (ex.: arquivo aberto direto): embaralhamento determinístico.
  // Não é segurança de verdade, só evita guardar a senha em texto puro.
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv${hash.toString(16)}.${text.length}`;
}

async function hashPassword(password, salt) {
  return digest(`${salt}:${password}`);
}

function readStore() {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (!raw) return { version: DB_VERSION, players: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.players)) return { version: DB_VERSION, players: [] };
    return parsed;
  } catch {
    return { version: DB_VERSION, players: [] };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(store));
  } catch {
    throw new Error('NÃO FOI POSSÍVEL SALVAR NESTE NAVEGADOR. LIBERE O ARMAZENAMENTO.');
  }
}

function readSessionId() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? Number(raw) || null : null;
  } catch {
    return null;
  }
}

function writeSessionId(id) {
  try {
    if (id) localStorage.setItem(SESSION_KEY, String(id));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* sessão dura só até recarregar */
  }
}

function findPlayer(store, id) {
  return store.players.find((player) => player.id === id) || null;
}

function playerByName(store, name) {
  const key = String(name).toLowerCase();
  return store.players.find((player) => player.nameKey === key) || null;
}

function currentPlayer() {
  const id = readSessionId();
  if (!id) return null;
  return findPlayer(readStore(), id);
}

function savePlayer(player) {
  const store = readStore();
  const index = store.players.findIndex((entry) => entry.id === player.id);
  if (index === -1) store.players.push(player);
  else store.players[index] = player;
  writeStore(store);
}

// ---------- estado público (mesmo formato do servidor) ----------

function inventoryOf(player) {
  return [...player.items].sort(
    (a, b) => a.acquiredAt - b.acquiredAt || a.itemId.localeCompare(b.itemId)
  );
}

function achievementsOf(player) {
  return ACHIEVEMENTS.map((achievement) => {
    const current = achievement.kind === 'day' ? player.bestDay : player.totalKills;
    return {
      id: achievement.id,
      kind: achievement.kind,
      title: achievement.title,
      desc: achievement.desc,
      target: achievement.target,
      current: Math.min(current, achievement.target),
      unlocked: Boolean(player.achievements[achievement.id]),
      unlockedAt: player.achievements[achievement.id] || null,
    };
  });
}

function syncAchievements(player) {
  const fresh = [];
  const stamp = now();

  for (const achievement of ACHIEVEMENTS) {
    if (player.achievements[achievement.id]) continue;
    const current = achievement.kind === 'day' ? player.bestDay : player.totalKills;
    if (current < achievement.target) continue;
    player.achievements[achievement.id] = stamp;
    fresh.push({ ...achievement });
  }

  return fresh;
}

function toPublicPlayer(player) {
  return {
    id: player.id,
    name: player.name,
    coins: player.coins,
    bestDay: player.bestDay,
    potions: player.potions,
    totalKills: player.totalKills,
    runs: player.runs,
    xp: player.xp || 0,
    tool: player.toolId || STARTING_TOOL,
    ...levelInfo(player.xp || 0),
    tools: [...player.tools],
    characters: [...player.characters],
    character: player.characterId || STARTING_CHARACTER,
  };
}

function shopCatalog(player) {
  const ownedTools = new Set(player.tools);
  const ownedCharacters = new Set(player.characters);
  const equipped = player.characterId || STARTING_CHARACTER;

  return {
    potionPrice: POTION_PRICE,
    tools: Object.entries(SHOP_TOOLS).map(([id, price]) => ({
      id,
      price,
      owned: ownedTools.has(id),
    })),
    characters: Object.entries(SHOP_CHARACTERS).map(([id, price]) => ({
      id,
      price,
      owned: ownedCharacters.has(id),
      equipped: equipped === id,
      starterTool: CHARACTER_STARTER[id] || STARTING_TOOL,
    })),
  };
}

function stateOf(player) {
  return {
    player: toPublicPlayer(player),
    shop: shopCatalog(player),
    inventory: inventoryOf(player),
    achievements: achievementsOf(player),
  };
}

// ---------- itens ----------

function addItem(player, kind, itemId, quantity = 1) {
  const existing = player.items.find((item) => item.kind === kind && item.itemId === itemId);
  if (existing) {
    existing.quantity += quantity;
    return;
  }
  player.items.push({ kind, itemId, quantity, acquiredAt: now() });
}

function grantTool(player, toolId) {
  if (player.tools.includes(toolId)) return false;
  player.tools.push(toolId);
  addItem(player, 'tool', toolId);
  return true;
}

function requirePlayer() {
  const player = currentPlayer();
  if (!player) throw new Error('SESSÃO EXPIRADA. ENTRE NOVAMENTE.');
  return player;
}

function createEmptyPlayer(id, name, passwordHash, salt) {
  const stamp = now();
  const player = {
    id,
    name,
    nameKey: name.toLowerCase(),
    passwordHash,
    salt,
    coins: 0,
    bestDay: 1,
    potions: 0,
    totalKills: 0,
    runs: 0,
    xp: 0,
    toolId: STARTING_TOOL,
    characterId: STARTING_CHARACTER,
    tools: [],
    characters: [],
    items: [],
    achievements: {},
    chests: {},
    createdAt: stamp,
    updatedAt: stamp,
  };

  grantTool(player, STARTING_TOOL);
  player.characters.push(STARTING_CHARACTER);
  addItem(player, 'character', STARTING_CHARACTER);

  return player;
}

// ---------- validações ----------

function validateName(name) {
  if (typeof name !== 'string') return 'INFORME UM NOME.';
  if (name.length < 3 || name.length > 16) return 'O NOME DEVE TER DE 3 A 16 CARACTERES.';
  if (!namePattern.test(name)) return 'USE APENAS LETRAS, NÚMEROS E _ NO NOME.';
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string') return 'INFORME UMA SENHA.';
  if (password.length < 8 || password.length > 64) {
    return 'A SENHA DEVE TER NO MÍNIMO 8 CARACTERES.';
  }
  if (!passwordPattern.test(password)) {
    return 'A SENHA DEVE CONTER APENAS LETRAS/NÚMEROS E PELO MENOS 1 NÚMERO.';
  }
  return null;
}

// ---------- rotas ----------

async function register({ name, password } = {}) {
  const nameError = validateName(name);
  if (nameError) throw new Error(nameError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const store = readStore();
  if (playerByName(store, name)) throw new Error('ESSE NOME JÁ EXISTE. ESCOLHA OUTRO.');

  const salt = `${now().toString(36)}${Math.random().toString(36).slice(2)}`;
  const passwordHash = await hashPassword(password, salt);
  const id = store.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;

  const player = createEmptyPlayer(id, name, passwordHash, salt);
  store.players.push(player);
  writeStore(store);
  writeSessionId(id);

  return { token: `local-${id}`, ...stateOf(player) };
}

async function login({ name, password } = {}) {
  if (typeof name !== 'string' || typeof password !== 'string') {
    throw new Error('INFORME NOME E SENHA.');
  }

  const store = readStore();
  const player = playerByName(store, name);

  if (!player) throw new Error('NOME OU SENHA INCORRETOS.');
  const candidate = await hashPassword(password, player.salt);
  if (candidate !== player.passwordHash) throw new Error('NOME OU SENHA INCORRETOS.');

  writeSessionId(player.id);
  return { token: `local-${player.id}`, ...stateOf(player) };
}

function logout() {
  writeSessionId(null);
  return { ok: true };
}

function state() {
  return stateOf(requirePlayer());
}

function inventory() {
  const player = requirePlayer();
  return {
    inventory: inventoryOf(player),
    achievements: achievementsOf(player),
  };
}

function reportRun({ day, coins, kills, runs, nights } = {}) {
  const player = requirePlayer();

  const safeDay = Math.max(1, Math.min(9999, Math.floor(Number(day) || 1)));
  const safeCoins = Math.max(0, Math.min(5000, Math.floor(Number(coins) || 0)));
  const safeKills = Math.max(0, Math.min(2000, Math.floor(Number(kills) || 0)));
  const safeRuns = Math.max(0, Math.min(1, Math.floor(Number(runs) || 0)));
  const safeNights = Math.max(0, Math.min(200, Math.floor(Number(nights) || 0)));

  const xpGain = safeNights * XP_PER_NIGHT + safeKills * XP_PER_KILL;
  const before = levelInfo(player.xp || 0);

  player.coins += safeCoins;
  player.bestDay = Math.max(player.bestDay, safeDay);
  player.totalKills += safeKills;
  player.runs += safeRuns;
  player.xp = (player.xp || 0) + xpGain;
  player.updatedAt = now();

  const newAchievements = syncAchievements(player);
  savePlayer(player);

  const after = levelInfo(player.xp);

  return {
    ...stateOf(player),
    newAchievements,
    progress: {
      xpGain,
      previousLevel: before.level,
      level: after.level,
      levelUp: after.level > before.level,
      previousRank: before.rank,
      rank: after.rank,
      rankUp: after.rank !== before.rank,
    },
  };
}

function openChest({ day } = {}) {
  const player = requirePlayer();
  const safeDay = Math.floor(Number(day) || 0);

  if (safeDay < 3 || safeDay % 2 !== 1) {
    throw new Error('NÃO HÁ BAÚ PARA ABRIR NESTE DIA.');
  }

  const already = player.chests[safeDay];
  if (already) {
    return {
      ...stateOf(player),
      chest: { toolId: already, coins: 0, alreadyOpened: true },
    };
  }

  const pool = CHEST_POOL.filter((id) => !player.tools.includes(id));
  let result;

  if (pool.length === 0) {
    player.coins += CHEST_COINS_REWARD;
    player.chests[safeDay] = 'coins';
    result = { toolId: null, coins: CHEST_COINS_REWARD, alreadyOpened: false };
  } else {
    const toolId = pool[Math.floor(Math.random() * pool.length)];
    grantTool(player, toolId);
    player.chests[safeDay] = toolId;
    result = { toolId, coins: 0, alreadyOpened: false };
  }

  player.updatedAt = now();
  savePlayer(player);

  return { ...stateOf(player), chest: result };
}

function buyTool({ toolId } = {}) {
  const player = requirePlayer();
  const price = SHOP_TOOLS[toolId];

  if (!price) throw new Error('FERRAMENTA INDISPONÍVEL NA LOJA.');
  if (player.tools.includes(toolId)) throw new Error('VOCÊ JÁ TEM ESSA FERRAMENTA.');
  if (player.coins < price) throw new Error('MOEDAS INSUFICIENTES.');

  player.coins -= price;
  player.updatedAt = now();
  grantTool(player, toolId);
  savePlayer(player);

  return stateOf(player);
}

function buyPotion() {
  const player = requirePlayer();

  const tiers = Math.floor(player.bestDay / 10);
  if (player.potions >= tiers) {
    throw new Error(`POÇÕES ESGOTADAS. A PRÓXIMA ABRE NO DIA ${(player.potions + 1) * 10}.`);
  }
  if (player.coins < POTION_PRICE) throw new Error('MOEDAS INSUFICIENTES.');

  player.coins -= POTION_PRICE;
  player.potions += 1;
  player.updatedAt = now();
  addItem(player, 'potion', 'tool_potion');
  savePlayer(player);

  return stateOf(player);
}

function buyCharacter({ characterId } = {}) {
  const player = requirePlayer();
  const price = SHOP_CHARACTERS[characterId];

  if (price === undefined) throw new Error('PERSONAGEM INDISPONÍVEL NA LOJA.');
  if (player.characters.includes(characterId)) throw new Error('VOCÊ JÁ TEM ESSE PERSONAGEM.');
  if (player.coins < price) throw new Error('MOEDAS INSUFICIENTES.');

  const starterTool = CHARACTER_STARTER[characterId] || STARTING_TOOL;

  player.coins -= price;
  player.characters.push(characterId);
  addItem(player, 'character', characterId);
  const grantedStarter = grantTool(player, starterTool);
  player.updatedAt = now();
  savePlayer(player);

  return {
    ...stateOf(player),
    grantedStarter: grantedStarter ? starterTool : null,
  };
}

function selectCharacter({ characterId } = {}) {
  const player = requirePlayer();

  if (!(characterId in SHOP_CHARACTERS)) throw new Error('PERSONAGEM DESCONHECIDO.');
  if (!player.characters.includes(characterId)) {
    throw new Error('VOCÊ AINDA NÃO TEM ESSE PERSONAGEM.');
  }

  player.characterId = characterId;
  player.updatedAt = now();
  savePlayer(player);

  return stateOf(player);
}

function selectTool({ toolId } = {}) {
  const player = requirePlayer();

  if (!(toolId in TOOL_RARITY)) throw new Error('FERRAMENTA DESCONHECIDA.');
  if (!player.tools.includes(toolId)) throw new Error('VOCÊ AINDA NÃO TEM ESSA FERRAMENTA.');

  player.toolId = toolId;
  player.updatedAt = now();
  savePlayer(player);

  return stateOf(player);
}

const routes = {
  'POST /api/auth/register': register,
  'POST /api/auth/login': login,
  'POST /api/auth/logout': logout,
  'GET /api/state': state,
  'GET /api/inventory': inventory,
  'POST /api/run/report': reportRun,
  'POST /api/chest/open': openChest,
  'POST /api/shop/tool': buyTool,
  'POST /api/shop/potion': buyPotion,
  'POST /api/shop/character': buyCharacter,
  'POST /api/character/select': selectCharacter,
  'POST /api/tool/select': selectTool,
};

export async function localRequest(path, { method = 'GET', body } = {}) {
  const route = routes[`${method.toUpperCase()} ${path}`];

  if (!route) throw new Error('ROTA NÃO ENCONTRADA.');

  // Simula a rede para o resto do jogo continuar igual ao modo servidor.
  const data = await route(body || {});
  return data;
}

export function localHasSession() {
  return Boolean(readSessionId());
}

// Permite recomeçar do zero sem perder os outros perfis do navegador.
export function localReset() {
  writeSessionId(null);
}
