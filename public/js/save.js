const TOKEN_KEY = 'infected.token';
const LEGACY_TOKEN_KEY = 'jogoSuperlegal.token';

// Estado do jogador logado. O objeto é mutado no lugar para que as referências
// espalhadas pelo jogo continuem válidas após cada resposta do servidor.
export const save = {
  id: null,
  name: '',
  coins: 0,
  bestDay: 1,
  potions: 0,
  totalKills: 0,
  runs: 0,
  xp: 0,
  level: 1,
  xpInLevel: 0,
  xpForNext: 15,
  rank: 'SOBREVIVENTE',
  tool: 'knife',
  tools: ['knife'],
  characters: ['survivor'],
  character: 'survivor',
  inventory: [],
  achievements: [],
};

export const shop = {
  potionPrice: 10,
  tools: [],
  characters: [],
};

let token = null;

function readToken() {
  try {
    const current = localStorage.getItem(TOKEN_KEY);
    if (current) return current;

    // Quem já jogava antes do jogo virar INFECTED mantém a sessão.
    const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
    if (legacy) {
      localStorage.setItem(TOKEN_KEY, legacy);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      return legacy;
    }

    return null;
  } catch {
    return null;
  }
}

export function getToken() {
  if (token) return token;
  token = readToken();
  return token;
}

export function hasToken() {
  return Boolean(getToken());
}

export function setToken(value) {
  token = value;
  try {
    localStorage.setItem(TOKEN_KEY, value);
  } catch {
    /* armazenamento indisponível: sessão dura só até recarregar */
  }
}

export function clearToken() {
  token = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignora */
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'content-type': 'application/json' };
  const currentToken = getToken();
  if (auth && currentToken) headers.authorization = `Bearer ${currentToken}`;

  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('SEM CONEXÃO COM O SERVIDOR. VERIFIQUE SE ELE ESTÁ RODANDO.');
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || 'ERRO NO SERVIDOR. TENTE NOVAMENTE.');
  }

  return data;
}

export function applyState(data) {
  if (!data) return;

  if (data.player) {
    Object.assign(save, {
      id: data.player.id,
      name: data.player.name,
      coins: data.player.coins,
      bestDay: data.player.bestDay,
      potions: data.player.potions,
      totalKills: data.player.totalKills,
      runs: data.player.runs,
      xp: data.player.xp,
      level: data.player.level,
      xpInLevel: data.player.xpInLevel,
      xpForNext: data.player.xpForNext,
      rank: data.player.rank,
      tool: data.player.tool,
      tools: data.player.tools,
      characters: data.player.characters,
      character: data.player.character,
    });
  }

  if (Array.isArray(data.inventory)) save.inventory = data.inventory;
  if (Array.isArray(data.achievements)) save.achievements = data.achievements;

  if (data.shop) {
    Object.assign(shop, {
      potionPrice: data.shop.potionPrice,
      tools: data.shop.tools,
      characters: data.shop.characters,
    });
  }
}

export async function register(name, password) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: { name, password },
  });
  setToken(data.token);
  applyState(data);
  return data;
}

export async function login(name, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { name, password },
  });
  setToken(data.token);
  applyState(data);
  return data;
}

export async function logout() {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch {
    /* sessão local é limpa mesmo se o servidor não responder */
  }
  clearToken();
  Object.assign(save, {
    id: null,
    name: '',
    coins: 0,
    bestDay: 1,
    potions: 0,
    totalKills: 0,
    runs: 0,
    xp: 0,
    level: 1,
    xpInLevel: 0,
    xpForNext: 15,
    rank: 'SOBREVIVENTE',
    tool: 'knife',
    tools: ['knife'],
    characters: ['survivor'],
    character: 'survivor',
    inventory: [],
    achievements: [],
  });
}

export async function fetchState() {
  const data = await request('/api/state');
  applyState(data);
  return data;
}

export async function reportRun({ day, coins, kills, runs = 0, nights = 0 }) {
  const data = await request('/api/run/report', {
    method: 'POST',
    body: { day, coins, kills, runs, nights },
  });
  applyState(data);
  return data;
}

export async function openChest(day) {
  const data = await request('/api/chest/open', { method: 'POST', body: { day } });
  applyState(data);
  return data;
}

export async function fetchInventory() {
  const data = await request('/api/inventory');
  if (Array.isArray(data.inventory)) save.inventory = data.inventory;
  if (Array.isArray(data.achievements)) save.achievements = data.achievements;
  return data;
}

export async function buyTool(toolId) {
  const data = await request('/api/shop/tool', { method: 'POST', body: { toolId } });
  applyState(data);
  return data;
}

export async function buyPotion() {
  const data = await request('/api/shop/potion', { method: 'POST' });
  applyState(data);
  return data;
}

export async function buyCharacter(characterId) {
  const data = await request('/api/shop/character', { method: 'POST', body: { characterId } });
  applyState(data);
  return data;
}

export async function selectCharacter(characterId) {
  const data = await request('/api/character/select', { method: 'POST', body: { characterId } });
  applyState(data);
  return data;
}

export async function selectTool(toolId) {
  const data = await request('/api/tool/select', { method: 'POST', body: { toolId } });
  applyState(data);
  return data;
}

export function toolBonus(potions) {
  return potions * 5;
}
