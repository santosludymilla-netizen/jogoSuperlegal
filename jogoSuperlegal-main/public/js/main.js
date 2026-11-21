import { loadSave, persist, toolDamage } from './save.js';
import { MenuScene } from './scene.js';
import { Game } from './game.js';

const PIXEL = 4;
const POTION_PRICE = 10;

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const menuCoins = document.getElementById('menu-coins');
const menuCoinsValue = document.getElementById('menu-coins-value');
const btnPlay = document.getElementById('btn-play');
const btnShop = document.getElementById('btn-shop');

const hud = document.getElementById('hud');
const hudDay = document.getElementById('hud-day');
const hudZombies = document.getElementById('hud-zombies');
const hudCoins = document.getElementById('hud-coins');
const hudTip = document.getElementById('hud-tip');
const healthFill = document.getElementById('health-fill');
const healthText = document.getElementById('health-text');

const toolSelect = document.getElementById('tool-select');
const shop = document.getElementById('shop');
const shopCoinsValue = document.getElementById('shop-coins-value');
const shopItems = document.getElementById('shop-items');
const shopBack = document.getElementById('shop-back');

const gameover = document.getElementById('gameover');
const gameoverInfo = document.getElementById('gameover-info');
const gameoverCoins = document.getElementById('gameover-coins');
const gameoverMenu = document.getElementById('gameover-menu');

const damageFlash = document.getElementById('damage-flash');
const blood = document.getElementById('blood');

const save = loadSave();

let W = 0;
let H = 0;
let state = 'menu';
let flashTimer = null;

const scene = new MenuScene(canvas, ctx);

const game = new Game(canvas, ctx, {
  onCoins(amount) {
    save.coins += amount;
    persist(save);
    updateCoins();
  },
  onBestDay(day) {
    if (day > save.bestDay) {
      save.bestDay = day;
      persist(save);
    }
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

const hudCache = {
  day: null,
  zombies: null,
  hp: null,
  tip: null,
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
}

function updateHud(info) {
  if (hudCache.day !== info.day) {
    hudDay.textContent = info.day;
    hudCache.day = info.day;
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

  if (hudCache.tip !== info.tip) {
    hudCache.tip = info.tip;
    hudTip.textContent = info.tip;
    hudTip.classList.toggle('is-visible', Boolean(info.tip));
  }
}

function showMenu() {
  state = 'menu';
  menu.classList.remove('is-hidden');
  menuCoins.hidden = false;
  blood.hidden = false;
}

function openToolSelect() {
  state = 'tool';
  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  blood.hidden = true;
  toolSelect.hidden = false;
}

function startRun(toolId) {
  toolSelect.hidden = true;
  blood.hidden = true;

  hudCache.day = null;
  hudCache.zombies = null;
  hudCache.hp = null;
  hudCache.tip = null;

  hud.hidden = false;
  state = 'playing';

  game.start(toolId, save.potions * 5);
  updateCoins();
}

function openShop() {
  state = 'shop';
  menu.classList.add('is-hidden');
  menuCoins.hidden = true;
  blood.hidden = true;
  renderShop();
  shop.hidden = false;
}

function closeShop() {
  shop.hidden = true;
  showMenu();
}

function renderShop() {
  shopCoinsValue.textContent = save.coins;

  const tiers = Math.floor(save.bestDay / 10);
  const owned = save.potions;
  const damage = toolDamage(owned);
  const nextDamage = damage + 5;
  const nextTierDay = (owned + 1) * 10;
  const canBuy = owned < tiers;
  const affordable = save.coins >= POTION_PRICE;

  let statusText;
  let buttonLabel;
  let enabled = false;

  if (tiers === 0) {
    statusText = 'BLOQUEADO: SOBREVIVA ATÉ O DIA 10 PARA LIBERAR A PRIMEIRA POÇÃO.';
  } else if (!canBuy) {
    statusText = `VOCÊ JÁ TEM TODAS AS POÇÕES LIBERADAS. A PRÓXIMA ABRE NO DIA ${nextTierDay}.`;
  } else {
    statusText = `POÇÃO ${owned + 1} DE ${tiers} LIBERADA.`;
    buttonLabel = affordable ? `COMPRAR - $${POTION_PRICE}` : 'MOEDAS INSUFICIENTES';
    enabled = affordable;
  }

  if (!buttonLabel) buttonLabel = canBuy ? `COMPRAR - $${POTION_PRICE}` : 'BLOQUEADO';

  shopItems.innerHTML = `
    <div class="shop-item ${canBuy && affordable ? '' : 'is-locked'}">
      <h3>POÇÃO DE FERRAMENTA</h3>
      <p>DANO ATUAL: <span class="shop-price">${damage}</span> | PRÓXIMO: <span class="shop-price">${nextDamage}</span></p>
      <p>CADA POÇÃO SOMA +5 DE DANO NA FACA E NO MACHADO.</p>
      <p>PREÇO: <span class="shop-price">$${POTION_PRICE}</span> | MELHOR DIA: ${save.bestDay}</p>
      <p>${statusText}</p>
      <button id="buy-potion" class="btn" type="button" ${enabled ? '' : 'disabled'}>${buttonLabel}</button>
    </div>
  `;

  const buyButton = document.getElementById('buy-potion');
  if (buyButton) {
    buyButton.addEventListener('click', () => {
      if (save.potions >= Math.floor(save.bestDay / 10)) return;
      if (save.coins < POTION_PRICE) return;

      save.coins -= POTION_PRICE;
      save.potions += 1;
      persist(save);
      updateCoins();
      renderShop();
    });
  }
}

function showGameOver(info) {
  state = 'gameover';
  hud.hidden = true;
  blood.hidden = true;
  game.draw();

  gameoverInfo.textContent = `VOCÊ CHEGOU AO DIA ${info.day}`;
  gameoverCoins.textContent = info.coins;
  gameover.hidden = false;
  updateCoins();
}

btnPlay.addEventListener('click', openToolSelect);

for (const button of toolSelect.querySelectorAll('.tool')) {
  button.addEventListener('click', () => startRun(button.dataset.tool));
}

btnShop.addEventListener('click', openShop);
shopBack.addEventListener('click', closeShop);

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

  if (state === 'menu' || state === 'tool' || state === 'shop') {
    scene.draw(time, delta);
  } else if (state === 'playing') {
    game.update(delta);
    game.draw();
  }

  requestAnimationFrame(frame);
}

resize();
updateCoins();
requestAnimationFrame(frame);
