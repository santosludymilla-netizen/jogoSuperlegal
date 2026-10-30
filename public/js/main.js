import {
  save,
  shop,
  hasToken,
  fetchState,
  login,
  register,
  logout,
  clearToken,
  reportRun,
  openChest,
  fetchInventory,
  buyTool,
  buyPotion,
  buyCharacter,
  selectCharacter,
  toolBonus,
} from './save.js';
import { MenuScene } from './scene.js';
import {
  Game,
  TOOLS,
  TOOL_ORDER,
  SHOP_TOOL_ORDER,
  RARITIES,
  CHARACTERS,
  getToolChance,
} from './game.js';

const PIXEL = 4;

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const menuCoins = document.getElementById('menu-coins');
const menuCoinsValue = document.getElementById('menu-coins-value');
const menuTopLeft = document.getElementById('menu-top-left');
const menuPlayer = document.getElementById('menu-player');
const menuPlayerName = document.getElementById('menu-player-name');
const menuPlayerPerk = document.getElementById('menu-player-perk');
const btnPlay = document.getElementById('btn-play');
const btnShop = document.getElementById('btn-shop');
const btnInventory = document.getElementById('btn-inventory');
const btnLogout = document.getElementById('btn-logout');

const auth = document.getElementById('auth');
const authForm = document.getElementById('auth-form');
const authName = document.getElementById('auth-name');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authSubmit = document.getElementById('auth-submit');
const authTabs = [...document.querySelectorAll('.auth-tab')];

const hud = document.getElementById('hud');
const hudDay = document.getElementById('hud-day');
const hudPhase = document.getElementById('hud-phase');
const hudZombies = document.getElementById('hud-zombies');
const hudDamage = document.getElementById('hud-damage');
const hudResist = document.getElementById('hud-resist');
const hudCoins = document.getElementById('hud-coins');
const hudTip = document.getElementById('hud-tip');
const hudChest = document.getElementById('hud-chest');
const healthFill = document.getElementById('health-fill');
const healthText = document.getElementById('health-text');
const bossBar = document.getElementById('boss-bar');
const bossName = document.getElementById('boss-name');
const bossFill = document.getElementById('boss-fill');

const toolSelect = document.getElementById('tool-select');
const toolMeta = document.getElementById('tool-meta');
const toolGrid = document.getElementById('tool-grid');

const shopPanel = document.getElementById('shop');
const shopCoinsValue = document.getElementById('shop-coins-value');
const shopItems = document.getElementById('shop-items');
const shopBack = document.getElementById('shop-back');

const inventoryPanel = document.getElementById('inventory');
const inventoryCoins = document.getElementById('inventory-coins');
const inventoryItems = document.getElementById('inventory-items');
const inventoryAchievements = document.getElementById('inventory-achievements');
const inventoryBack = document.getElementById('inventory-back');

const gameover = document.getElementById('gameover');
const gameoverInfo = document.getElementById('gameover-info');
const gameoverCoins = document.getElementById('gameover-coins');
const gameoverMenu = document.getElementById('gameover-menu');

const damageFlash = document.getElementById('damage-flash');
const blood = document.getElementById('blood');

const TOOL_ICONS = {
  knife: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <path fill="#d8d8d0" d="M4 12h2v-2h2V8h2V6h2V4h2V2h-2v2H8v2H6v2H4v2H2v2z"/>
      <rect x="2" y="12" width="4" height="2" fill="#ff2e88"/>
    </svg>
  `,
  axe: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="7" y="4" width="2" height="11" fill="#7a4b22"/>
      <path fill="#d8d8d0" d="M3 3h6v2h1v4h-1v2H3V9h2V7H3z"/>
      <path fill="#ff2e88" d="M2 4h1v4H2z"/>
    </svg>
  `,
  bat: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="7" y="2" width="2" height="11" fill="#7a4b22"/>
      <rect x="5" y="3" width="6" height="6" fill="#a06a34"/>
      <rect x="5" y="3" width="6" height="2" fill="#c78a4a"/>
      <rect x="6" y="12" width="4" height="2" fill="#ff2e88"/>
    </svg>
  `,
  machete: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="3" y="11" width="3" height="3" fill="#2b2b2b"/>
      <path fill="#d8d8d0" d="M5 11h2V9h2V7h2V5h2V3h-2v2H9v2H7v2H5z"/>
      <rect x="11" y="3" width="2" height="2" fill="#ff2e88"/>
    </svg>
  `,
  spear: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <path fill="#7a4b22" d="M2 13h3v-2h2V9h2V7h2V5h2V3h2v2h-2v2H9v2H7v2H5v2H2z"/>
      <path fill="#39ff14" d="M11 2h3v2h-2v2h-2V4h1z"/>
      <rect x="10" y="5" width="1" height="2" fill="#39ff14"/>
    </svg>
  `,
  gun: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="2" y="6" width="9" height="4" fill="#2f3b34"/>
      <rect x="8" y="5" width="6" height="2" fill="#d8d8d0"/>
      <rect x="4" y="10" width="3" height="4" fill="#1e4a26"/>
      <rect x="10" y="5" width="2" height="1" fill="#ff2e88"/>
    </svg>
  `,
  flamethrower: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="2" y="6" width="7" height="5" fill="#4a4a44"/>
      <rect x="2" y="6" width="2" height="5" fill="#ff2e88"/>
      <rect x="9" y="7" width="4" height="2" fill="#d8d8d0"/>
      <path fill="#ffb000" d="M13 3h2v2h-1v2h-1V5h-1V4h1z"/>
      <path fill="#ff5a00" d="M12 7h3v2h-3z"/>
    </svg>
  `,
  chainsaw: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="1" y="6" width="9" height="5" fill="#c9302c"/>
      <rect x="1" y="6" width="2" height="5" fill="#ff2e88"/>
      <rect x="10" y="7" width="5" height="3" fill="#9aa38f"/>
      <rect x="11" y="7" width="1" height="3" fill="#d8d8d0"/>
      <rect x="13" y="7" width="1" height="3" fill="#d8d8d0"/>
    </svg>
  `,
  crossbow: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="1" y="9" width="12" height="2" fill="#7a4b22"/>
      <rect x="6" y="3" width="1" height="10" fill="#d8d8d0"/>
      <rect x="2" y="6" width="11" height="1" fill="#d8d8d0"/>
      <rect x="12" y="6" width="3" height="2" fill="#39ff14"/>
    </svg>
  `,
  scythe: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="2" y="12" width="8" height="2" fill="#7a4b22"/>
      <path fill="#d8d8d0" d="M9 3h4v2h-2v2h-2V5H7V3z"/>
      <rect x="8" y="4" width="1" height="2" fill="#ff2e88"/>
    </svg>
  `,
  smg: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="1" y="6" width="10" height="3" fill="#2f3b34"/>
      <rect x="11" y="6" width="4" height="2" fill="#d8d8d0"/>
      <rect x="3" y="9" width="2" height="4" fill="#1e4a26"/>
      <rect x="2" y="5" width="3" height="1" fill="#ff2e88"/>
    </svg>
  `,
  hammer: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="7" y="3" width="3" height="11" fill="#7a4b22"/>
      <rect x="4" y="2" width="9" height="5" fill="#9aa38f"/>
      <rect x="5" y="3" width="2" height="3" fill="#d8d8d0"/>
    </svg>
  `,
  katana: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <path fill="#d8d8d0" d="M13 2h2v2h-2v2h-2v2H9v2H7v2H4v-2h2V8h2V6h2V4h3z"/>
      <rect x="2" y="12" width="4" height="2" fill="#1a1a1a"/>
      <rect x="5" y="9" width="3" height="3" fill="#ffb000"/>
    </svg>
  `,
  minigun: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="1" y="6" width="8" height="5" fill="#2f3b34"/>
      <rect x="2" y="10" width="3" height="4" fill="#1e4a26"/>
      <rect x="9" y="5" width="6" height="2" fill="#d8d8d0"/>
      <rect x="9" y="8" width="6" height="1" fill="#d8d8d0"/>
      <rect x="9" y="10" width="6" height="2" fill="#d8d8d0"/>
      <rect x="1" y="5" width="2" height="1" fill="#ffb000"/>
    </svg>
  `,
  plasma: `
    <svg class="tool-icon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="1" y="6" width="8" height="5" fill="#2a1e4a"/>
      <rect x="2" y="10" width="3" height="4" fill="#1a1030"/>
      <rect x="9" y="6" width="5" height="4" fill="#d8d8d0"/>
      <rect x="14" y="7" width="2" height="2" fill="#39ff14"/>
      <rect x="3" y="7" width="3" height="3" fill="#39ff14"/>
      <rect x="4" y="8" width="1" height="1" fill="#b6ff9a"/>
    </svg>
  `,
};

const CHARACTER_ICON = (id) => {
  const c = CHARACTERS[id].palette;
  return `
    <svg class="char-icon" viewBox="0 0 10 14" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="4" height="4" fill="${c.h}"/>
      <rect x="3" y="1" width="4" height="1" fill="${c.d}"/>
      <rect x="2" y="4" width="6" height="5" fill="${c.j}"/>
      <rect x="4" y="5" width="2" height="2" fill="${c.p}"/>
      <rect x="1" y="5" width="1" height="5" fill="${c.h}"/>
      <rect x="8" y="5" width="1" height="5" fill="${c.h}"/>
      <rect x="3" y="9" width="1" height="5" fill="${c.d}"/>
      <rect x="6" y="9" width="1" height="5" fill="${c.d}"/>
    </svg>
  `;
};

let W = 0;
let H = 0;
let state = 'auth';
let authMode = 'login';
let flashTimer = null;
const availableTools = new Set();

const scene = new MenuScene(canvas, ctx);

const game = new Game(canvas, ctx, {
  onCoins(amount) {
    save.coins += amount;
    runCoins += amount;
    updateCoins();
  },
  onBestDay(day) {
    if (day > save.bestDay) save.bestDay = day;
    if (day > runMaxDay) runMaxDay = day;
  },
  onNightEnd() {
    queueSync();
  },
  onChestOpen(day) {
    return openChestSafely(day);
  },
  onHud(info) {
    updateHud(info);
  },
  onHurt() {
    damageFlash.classList.add('is-hit');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => damageFlash.classList.remove('is-hit'), 130);
  },
  onGameOver(info) {
    showGameOver(info);
  },
});

// ---------- sincronização com o servidor ----------

let runCoins = 0;
let runKills = 0;
let runMaxDay = 1;
let runFinal = false;
let syncTimer = null;
let syncBusy = false;

function queueSync(final = false) {
  if (!hasToken()) return;
  if (final) runFinal = true;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(sendSync, 250);
}

async function sendSync() {
  if (!hasToken()) return;

  if (syncBusy) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sendSync, 400);
    return;
  }

  if (runCoins === 0 && runKills === 0 && !runFinal) return;

  const payload = {
    day: runMaxDay,
    coins: runCoins,
    kills: runKills,
    runs: runFinal ? 1 : 0,
  };

  runCoins = 0;
  runKills = 0;
  runFinal = false;
  syncBusy = true;

  try {
    const data = await reportRun(payload);
    updateCoins();

    if (Array.isArray(data.newAchievements) && data.newAchievements.length > 0) {
      data.newAchievements.forEach((achievement, index) => {
        setTimeout(() => showToast(`CONQUISTA: ${achievement.title}`), index * 700);
      });
    }
  } catch (error) {
    runCoins += payload.coins;
    runKills += payload.kills;
    console.warn('Falha ao salvar progresso:', error.message);
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sendSync, 3000);
  } finally {
    syncBusy = false;
  }
}

// ---------- interface ----------

const hudCache = {
  day: null,
  phase: null,
  chest: null,
  zombies: null,
  hp: null,
  damage: null,
  resistance: null,
  tip: null,
  boss: null,
};

function resize() {
  W = Math.max(1, Math.ceil(window.innerWidth / PIXEL));
  H = Math.max(1, Math.ceil(window.innerHeight / PIXEL));

  canvas.width = W;
  canvas.height = H;
  ctx.imageSmoothingEnabled = false;

  scene.resize(W, H);
  game.resize(W, H);
}

function updateCoins() {
  menuCoinsValue.textContent = save.coins;
  hudCoins.textContent = save.coins;
  shopCoinsValue.textContent = save.coins;
  inventoryCoins.textContent = save.coins;
}

function updatePlayerBadge() {
  const character = CHARACTERS[save.character] || CHARACTERS.survivor;

  menuPlayerName.textContent = save.name || 'JOGADOR';
  menuPlayerPerk.textContent = `${character.name} · ${character.perk}`;
}

function updateHud(info) {
  if (hudCache.day !== info.day) {
    hudDay.textContent = info.day;
    hudCache.day = info.day;
  }

  const phase = info.phase === 'day' ? `DIA ${Math.ceil(info.dayLeft)}s` : 'NOITE';
  if (hudCache.phase !== phase) {
    hudPhase.textContent = phase;
    hudPhase.classList.toggle('is-night', info.phase !== 'day');
    hudCache.phase = phase;
  }

  if (hudCache.chest !== info.chest) {
    hudChest.hidden = !info.chest;
    hudCache.chest = info.chest;
  }

  const zombies = `${info.killed}/${info.total}`;
  if (hudCache.zombies !== zombies) {
    hudZombies.textContent = zombies;
    hudCache.zombies = zombies;
  }

  const hp = Math.ceil(info.hp);
  if (hudCache.hp !== hp) {
    hudCache.hp = hp;
    const ratio = Math.max(0, Math.min(1, info.hp / info.maxHp));
    healthFill.style.width = `${ratio * 100}%`;
    healthFill.style.backgroundColor = ratio <= 0.3 ? '#ff2e88' : '#39ff14';
    healthText.textContent = hp;
  }

  if (hudCache.damage !== info.damage) {
    hudCache.damage = info.damage;
    hudDamage.textContent = info.damage;
  }

  if (hudCache.resistance !== info.resistance) {
    hudCache.resistance = info.resistance;
    hudResist.textContent = info.resistance;
  }

  if (!info.boss) {
    if (hudCache.boss !== null) {
      hudCache.boss = null;
      bossBar.hidden = true;
    }
  } else {
    hudCache.boss = info.boss.name;
    bossBar.hidden = false;
    bossName.textContent = info.boss.name;
    const ratio = Math.max(0, Math.min(1, info.boss.hp / info.boss.maxHp));
    bossFill.style.width = `${ratio * 100}%`;
  }

  if (hudCache.tip !== info.tip) {
    hudCache.tip = info.tip;
    hudTip.textContent = info.tip;
    hudTip.classList.toggle('is-visible', Boolean(info.tip));
  }
}

function showAuth(mode = 'login') {
  state = 'auth';
  authMode = mode;

  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  menuTopLeft.hidden = true;
  menuPlayer.hidden = true;
  blood.hidden = true;
  hud.hidden = true;
  toolSelect.hidden = true;
  inventoryPanel.hidden = true;
  shopPanel.hidden = true;
  gameover.hidden = true;
  auth.hidden = false;

  authError.textContent = '';
  syncAuthMode();
  authName.focus();
}

function syncAuthMode() {
  for (const tab of authTabs) {
    tab.classList.toggle('is-active', tab.dataset.mode === authMode);
  }
  authSubmit.textContent = authMode === 'login' ? 'ENTRAR' : 'CRIAR CONTA';
  authPassword.autocomplete = authMode === 'login' ? 'current-password' : 'new-password';
}

function showMenu() {
  state = 'menu';
  auth.hidden = true;
  menu.classList.remove('is-hidden');
  menuCoins.hidden = false;
  menuTopLeft.hidden = false;
  menuPlayer.hidden = false;
  inventoryPanel.hidden = true;
  blood.hidden = false;
  updatePlayerBadge();
}

function openToolSelect() {
  state = 'tool';
  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  menuTopLeft.hidden = true;
  menuPlayer.hidden = true;
  inventoryPanel.hidden = true;
  blood.hidden = true;
  rollToolOffers();
  renderToolSelect();
  toolSelect.hidden = false;
}

function priceOfTool(toolId) {
  const entry = shop.tools.find((item) => item.id === toolId);
  return entry ? entry.price : null;
}

function ownsTool(toolId) {
  return save.tools.includes(toolId);
}

function rollToolOffers() {
  availableTools.clear();

  for (const id of TOOL_ORDER) {
    const tool = TOOLS[id];
    const owned = ownsTool(id);

    // Ferramenta comprada/ganha no baú sempre pode ser escolhida (inclusive as de oferta).
    if (owned) {
      availableTools.add(id);
      continue;
    }

    if (tool.offerOnly) continue;

    if (tool.unlockDay) {
      const chance = getToolChance(id, save.bestDay);
      if (chance >= 1 || (chance > 0 && Math.random() < chance)) availableTools.add(id);
      continue;
    }
  }
}

function damageOf(toolId) {
  const character = CHARACTERS[save.character] || CHARACTERS.survivor;
  return Math.round(TOOLS[toolId].damage * character.damage) + toolBonus(save.potions);
}

function renderToolSelect() {
  const character = CHARACTERS[save.character] || CHARACTERS.survivor;
  toolMeta.innerHTML =
    `JOGADOR: <strong>${save.name}</strong> · ${character.name} · MELHOR DIA <strong>${save.bestDay}</strong>` +
    ` · +4 DANO POR NOITE · +5 POR POÇÃO`;

  toolGrid.innerHTML = TOOL_ORDER.map((id) => {
    const tool = TOOLS[id];
    const rarity = RARITIES[tool.rarity];
    const owned = ownsTool(id);
    const appeared = availableTools.has(id);
    const price = priceOfTool(id);
    const damage = damageOf(id);

    let status;
    if (owned) {
      status = 'SUA FERRAMENTA';
    } else if (tool.unlockDay) {
      const chance = getToolChance(id, save.bestDay);
      if (save.bestDay < tool.unlockDay) {
        status = `BLOQUEADA: DIA ${tool.unlockDay}`;
      } else if (!appeared) {
        status = `NÃO APARECEU · SORTE ${Math.round(chance * 100)}%`;
      } else {
        status = `SORTE ${Math.round(chance * 100)}%`;
      }
    } else if (!owned) {
      status = price ? `COMPRE NA LOJA · $${price}` : 'BLOQUEADA';
    } else {
      status = 'SUA FERRAMENTA';
    }

    return `
      <button
        class="tool tool--${tool.rarity} ${appeared ? '' : 'is-locked'}"
        type="button"
        data-tool="${id}"
        ${appeared ? '' : 'disabled'}
      >
        <span class="tool-rarity tool-rarity--${tool.rarity}">${rarity.label}</span>
        ${TOOL_ICONS[id]}
        <span class="tool-name">${tool.name}</span>
        <span class="tool-dmg">DANO <strong>${damage}</strong></span>
        <span class="tool-desc">${status}</span>
      </button>
    `;
  }).join('');
}

// ---------- inventário ----------

const ITEM_LABELS = {
  tool: 'FERRAMENTA',
  character: 'SKIN',
  potion: 'CONSUMÍVEL',
};

function describeItem(item) {
  if (item.kind === 'tool') {
    const tool = TOOLS[item.itemId];
    return {
      name: tool ? tool.name : item.itemId.toUpperCase(),
      meta: tool ? `DANO ${tool.damage} · ${RARITIES[tool.rarity].label}` : 'FERRAMENTA',
      icon: TOOL_ICONS[item.itemId] || '',
      rarity: tool?.rarity || 'comum',
    };
  }

  if (item.kind === 'character') {
    const character = CHARACTERS[item.itemId];
    return {
      name: character ? character.name : item.itemId.toUpperCase(),
      meta: character ? character.perk : 'SKIN',
      icon: character ? CHARACTER_ICON(item.itemId) : '',
      rarity: null,
    };
  }

  if (item.kind === 'potion') {
    return {
      name: 'POÇÃO DE FERRAMENTA',
      meta: `+${5 * item.quantity} DE DANO SOMADO`,
      icon: '<span class="item-icon-glyph">+</span>',
      rarity: null,
    };
  }

  return {
    name: item.itemId.toUpperCase(),
    meta: ITEM_LABELS[item.kind] || item.kind,
    icon: '',
    rarity: null,
  };
}

function renderInventory() {
  inventoryCoins.textContent = save.coins;

  if (!save.inventory || save.inventory.length === 0) {
    inventoryItems.innerHTML = '<p class="inventory-empty">SEU INVENTÁRIO ESTÁ VAZIO.</p>';
  } else {
    inventoryItems.innerHTML = save.inventory
      .map((item) => {
        const info = describeItem(item);
        const qty = item.quantity > 1 ? ` <span class="item-qty">x${item.quantity}</span>` : '';

        return `
          <div class="inventory-item ${info.rarity ? `inventory-item--${info.rarity}` : ''}">
            ${info.icon}
            <div class="inventory-item-body">
              <h4>${info.name}${qty}</h4>
              <p>${info.meta}</p>
            </div>
            <span class="inventory-item-kind">${ITEM_LABELS[item.kind] || item.kind.toUpperCase()}</span>
          </div>
        `;
      })
      .join('');
  }

  if (!save.achievements || save.achievements.length === 0) {
    inventoryAchievements.innerHTML =
      '<p class="inventory-empty">NENHUMA CONQUISTA AINDA. SOBREVIVA E MATE ZUMBIS.</p>';
  } else {
    inventoryAchievements.innerHTML = save.achievements
      .map((achievement) => {
        const ratio = Math.max(0, Math.min(1, achievement.current / achievement.target));

        return `
          <div class="achievement ${achievement.unlocked ? 'is-unlocked' : ''}">
            <div class="achievement-head">
              <span class="achievement-title">${achievement.title}</span>
              <span class="achievement-progress">${achievement.current}/${achievement.target}</span>
            </div>
            <p class="achievement-desc">${achievement.desc}</p>
            <div class="achievement-bar"><div style="width:${ratio * 100}%"></div></div>
            <span class="achievement-state">${achievement.unlocked ? 'DESBLOQUEADA' : 'BLOQUEADA'}</span>
          </div>
        `;
      })
      .join('');
  }
}

async function openInventory() {
  state = 'inventory';
  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  menuTopLeft.hidden = true;
  menuPlayer.hidden = true;
  blood.hidden = true;

  renderInventory();
  inventoryPanel.hidden = false;

  try {
    await fetchInventory();
    renderInventory();
  } catch (error) {
    console.warn('Falha ao carregar inventário:', error.message);
  }
}

function closeInventory() {
  inventoryPanel.hidden = true;
  showMenu();
}

// ---------- baú e conquistas ----------

async function openChestSafely(day) {
  try {
    const data = await openChest(day);
    updateCoins();
    return data.chest || null;
  } catch (error) {
    console.warn('Falha ao abrir o baú:', error.message);
    return null;
  }
}

let toastTimer = null;

function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function startRun(toolId) {
  toolSelect.hidden = true;
  blood.hidden = true;

  hudCache.day = null;
  hudCache.phase = null;
  hudCache.chest = null;
  hudCache.zombies = null;
  hudCache.hp = null;
  hudCache.damage = null;
  hudCache.resistance = null;
  hudCache.tip = null;
  hudCache.boss = null;

  hud.hidden = false;
  bossBar.hidden = true;
  state = 'playing';

  runCoins = 0;
  runKills = 0;
  runMaxDay = 1;
  runFinal = false;

  game.start(toolId, {
    bonusDamage: toolBonus(save.potions),
    characterId: save.character,
  });

  updateCoins();
}

function openShop() {
  state = 'shop';
  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  menuTopLeft.hidden = true;
  menuPlayer.hidden = true;
  blood.hidden = true;
  renderShop();
  shopPanel.hidden = false;
}

function closeShop() {
  shopPanel.hidden = true;
  showMenu();
}

function renderShop() {
  shopCoinsValue.textContent = save.coins;

  const toolCards = SHOP_TOOL_ORDER.map((id) => {
    const tool = TOOLS[id];
    const entry = shop.tools.find((item) => item.id === id);
    const owned = Boolean(entry?.owned);
    const price = entry?.price ?? 0;
    const affordable = save.coins >= price;

    return `
      <div class="shop-card ${owned ? 'is-owned' : ''}">
        <div class="shop-card-head">
          ${TOOL_ICONS[id]}
          <div>
            <h4>${tool.name}</h4>
            <p class="shop-card-sub">DANO ${damageOf(id)} · ${RARITIES[tool.rarity].label}</p>
          </div>
        </div>
        <p class="shop-card-desc">${owned ? 'JÁ É SUA.' : `LIBERA ESSA FERRAMENTA PARA ESCOLHER NO INÍCIO DA PARTIDA.`}</p>
        ${
          owned
            ? '<span class="shop-tag">COMPRADA</span>'
            : `<button class="btn btn--compact btn--buy" type="button" data-buy-tool="${id}" ${
                affordable ? '' : 'disabled'
              }>${affordable ? `COMPRAR - $${price}` : 'MOEDAS INSUFICIENTES'}</button>`
        }
      </div>
    `;
  }).join('');

  const currentCharacter = CHARACTERS[save.character] || CHARACTERS.survivor;

  const characterCards = Object.entries(CHARACTERS)
    .map(([id, character]) => {
      const entry = shop.characters.find((item) => item.id === id);
      const owned = Boolean(entry?.owned);
      const equipped = save.character === id;
      const price = entry?.price ?? 0;
      const affordable = save.coins >= price;

      let action;
      if (equipped) {
        action = '<span class="shop-tag shop-tag--active">EM USO</span>';
      } else if (owned) {
        action = `<button class="btn btn--compact btn--equip" type="button" data-equip-character="${id}">USAR</button>`;
      } else if (id === 'survivor') {
        action = '<span class="shop-tag">PADRÃO</span>';
      } else {
        action = `<button class="btn btn--compact btn--buy" type="button" data-buy-character="${id}" ${
          affordable ? '' : 'disabled'
        }>${affordable ? `COMPRAR - $${price}` : 'MOEDAS INSUFICIENTES'}</button>`;
      }

      return `
        <div class="shop-card shop-card--char ${equipped ? 'is-owned' : ''}">
          <div class="shop-card-head">
            ${CHARACTER_ICON(id)}
            <div>
              <h4>${character.name}</h4>
              <p class="shop-card-sub">${character.perk}</p>
            </div>
          </div>
          <p class="shop-card-desc">VIDA ${100 + character.hp} · DANO x${character.damage.toFixed(2)} · VEL x${character.speed.toFixed(2)} · RES ${character.resist} · MOEDAS x${character.coins}</p>
          <p class="shop-card-desc shop-card-starter">VEM COM: ${TOOLS[character.starterTool] ? TOOLS[character.starterTool].name : 'FACA'} (${RARITIES[TOOLS[character.starterTool]?.rarity || 'comum'].label})</p>
          ${action}
        </div>
      `;
    })
    .join('');

  const tiers = Math.floor(save.bestDay / 10);
  const ownedPotions = save.potions;
  const bonus = toolBonus(ownedPotions);
  const nextBonus = bonus + 5;
  const canBuyPotion = ownedPotions < tiers;
  const affordablePotion = save.coins >= shop.potionPrice;

  shopItems.innerHTML = `
    <section class="shop-section">
      <h3>FERRAMENTAS INICIAIS</h3>
      <div class="shop-grid">${toolCards}</div>
    </section>

    <section class="shop-section">
      <h3>PERSONAGENS</h3>
      <p class="shop-section-sub">PERSONAGEM ATUAL: <strong>${currentCharacter.name}</strong> — ${currentCharacter.perk}</p>
      <div class="shop-grid">${characterCards}</div>
    </section>

    <section class="shop-section">
      <h3>MELHORIA</h3>
      <div class="shop-card">
        <div class="shop-card-head">
          <div>
            <h4>POÇÃO DE FERRAMENTA</h4>
            <p class="shop-card-sub">+5 DE DANO EM TODAS AS FERRAMENTAS</p>
          </div>
        </div>
        <p class="shop-card-desc">BÔNUS ATUAL: <span class="shop-price">+${bonus}</span> · PRÓXIMO: <span class="shop-price">+${nextBonus}</span> · PREÇO: <span class="shop-price">$${shop.potionPrice}</span></p>
        <p class="shop-card-desc">${
          tiers === 0
            ? 'BLOQUEADO: SOBREVIVA ATÉ O DIA 10 PARA LIBERAR A PRIMEIRA POÇÃO.'
            : canBuyPotion
              ? `POÇÃO ${ownedPotions + 1} DE ${tiers} LIBERADA.`
              : `VOCÊ JÁ COMPROU TODAS. A PRÓXIMA ABRE NO DIA ${(ownedPotions + 1) * 10}.`
        }</p>
        ${
          canBuyPotion
            ? `<button class="btn btn--compact btn--buy" type="button" data-buy-potion ${
                affordablePotion ? '' : 'disabled'
              }>${affordablePotion ? `COMPRAR - $${shop.potionPrice}` : 'MOEDAS INSUFICIENTES'}</button>`
            : '<span class="shop-tag">BLOQUEADO</span>'
        }
      </div>
    </section>
  `;
}

function shopMessage(text, isError) {
  const note = document.createElement('p');
  note.className = `shop-note ${isError ? 'is-error' : ''}`;
  note.textContent = text;
  shopItems.prepend(note);
  setTimeout(() => note.remove(), 3200);
}

async function handleShopAction(action) {
  try {
    let starterTool = null;

    if (action.dataset.buyTool) {
      await buyTool(action.dataset.buyTool);
    } else if (action.dataset.buyCharacter) {
      const result = await buyCharacter(action.dataset.buyCharacter);
      starterTool = result?.grantedStarter || null;
    } else if (action.dataset.equipCharacter) {
      await selectCharacter(action.dataset.equipCharacter);
    } else if (action.hasAttribute('data-buy-potion')) {
      await buyPotion();
    } else {
      return;
    }

    updateCoins();
    renderShop();
    updatePlayerBadge();

    if (starterTool) {
      shopMessage(
        `SKIN COMPRADA: ${TOOLS[starterTool] ? TOOLS[starterTool].name : starterTool} ADICIONADA AO INVENTÁRIO.`,
        false
      );
    }
  } catch (error) {
    shopMessage(error.message, true);
  }
}

function showGameOver(info) {
  state = 'gameover';
  hud.hidden = true;
  bossBar.hidden = true;
  blood.hidden = true;
  game.draw();

  gameoverInfo.textContent = `VOCÊ CHEGOU AO DIA ${info.day}`;
  gameoverCoins.textContent = info.coins;
  gameover.hidden = false;
  updateCoins();
  queueSync(true);
}

// ---------- eventos ----------

btnPlay.addEventListener('click', openToolSelect);

toolGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.tool');
  if (!button || button.disabled) return;
  startRun(button.dataset.tool);
});

btnShop.addEventListener('click', openShop);
shopBack.addEventListener('click', closeShop);

btnInventory.addEventListener('click', openInventory);
inventoryBack.addEventListener('click', closeInventory);

shopItems.addEventListener('click', (event) => {
  const action = event.target.closest('button');
  if (!action || action.disabled) return;
  handleShopAction(action);
});

btnLogout.addEventListener('click', async () => {
  await logout();
  updateCoins();
  showAuth('login');
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    authMode = tab.dataset.mode;
    authError.textContent = '';
    syncAuthMode();
  });
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = authName.value.trim();
  const password = authPassword.value;

  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) {
    authError.textContent = 'NOME: 3 A 16 CARACTERES, APENAS LETRAS, NÚMEROS E _.';
    return;
  }
  if (!/^(?=.*[0-9])[A-Za-z0-9]{8,64}$/.test(password)) {
    authError.textContent = 'SENHA: 8 A 64 CARACTERES COM PELO MENOS 1 NÚMERO.';
    return;
  }

  authSubmit.disabled = true;
  authError.textContent = '';

  try {
    if (authMode === 'login') {
      await login(name, password);
    } else {
      await register(name, password);
    }

    authForm.reset();
    updateCoins();
    showMenu();
  } catch (error) {
    authError.textContent = error.message;
  } finally {
    authSubmit.disabled = false;
  }
});

gameoverMenu.addEventListener('click', () => {
  gameover.hidden = true;
  showMenu();
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  if (state === 'tool') {
    toolSelect.hidden = true;
    showMenu();
  } else if (state === 'shop') {
    closeShop();
  } else if (state === 'inventory') {
    closeInventory();
  } else if (state === 'gameover') {
    gameover.hidden = true;
    showMenu();
  }
});

window.addEventListener('resize', resize);

let lastTime = 0;

function frame(now) {
  const time = now * 0.001;
  const delta = lastTime ? Math.min(0.05, time - lastTime) : 0.016;
  lastTime = time;

  if (state === 'menu' || state === 'tool' || state === 'shop' || state === 'inventory' || state === 'auth') {
    scene.draw(time, delta);
  } else if (state === 'playing') {
    game.update(delta);
    game.draw();
  }

  requestAnimationFrame(frame);
}

async function boot() {
  resize();
  updateCoins();
  requestAnimationFrame(frame);

  if (hasToken()) {
    try {
      await fetchState();
      updateCoins();
      showMenu();
      return;
    } catch (error) {
      console.warn('Sessão inválida:', error.message);
      clearToken();
    }
  }

  showAuth('login');
}

// Gancho de depuração: expõe o estado só quando a URL tem ?debug=1.
if (new URLSearchParams(window.location.search).has('debug')) {
  window.__jogo = {
    game,
    save,
    shop,
    CHARACTERS,
    TOOLS,
    get state() {
      return state;
    },
    showMenu,
    showAuth,
    openToolSelect,
    startRun,
    openShop,
    openInventory,
    showToast,
  };
}

boot();
