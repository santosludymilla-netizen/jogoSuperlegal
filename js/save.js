const TOKEN_KEY = 'jogoSuperlegal.token';

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
  tools: ['knife'],
  characters: ['survivor'],
  character: 'survivor',
};

export const shop = {
  potionPrice: 10,
  tools: [],
  characters: [],
};

let token = null;

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
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
      tools: data.player.tools,
      characters: data.player.characters,
      character: data.player.character,
    });
  }

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
    tools: ['knife'],
    characters: ['survivor'],
    character: 'survivor',
  });
}

export async function fetchState() {
  const data = await request('/api/state');
  applyState(data);
  return data;
}

export async function reportRun({ day, coins, kills, runs = 0 }) {
  const data = await request('/api/run/report', {
    method: 'POST',
    body: { day, coins, kills, runs },
  });
  applyState(data);
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

export function toolBonus(potions) {
  return potions * 5;
}
