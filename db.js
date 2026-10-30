'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'jogo.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    coins INTEGER NOT NULL DEFAULT 0,
    best_day INTEGER NOT NULL DEFAULT 1,
    potions INTEGER NOT NULL DEFAULT 0,
    total_kills INTEGER NOT NULL DEFAULT 0,
    runs INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS player_tools (
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL,
    acquired_at INTEGER NOT NULL,
    PRIMARY KEY (player_id, tool_id)
  );

  CREATE TABLE IF NOT EXISTS player_characters (
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL,
    acquired_at INTEGER NOT NULL,
    PRIMARY KEY (player_id, character_id)
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_player ON sessions (player_id);

  CREATE TABLE IF NOT EXISTS player_items (
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    acquired_at INTEGER NOT NULL,
    PRIMARY KEY (player_id, kind, item_id)
  );

  CREATE TABLE IF NOT EXISTS player_achievements (
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at INTEGER NOT NULL,
    PRIMARY KEY (player_id, achievement_id)
  );

  CREATE TABLE IF NOT EXISTS player_chests (
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    tool_id TEXT NOT NULL,
    opened_at INTEGER NOT NULL,
    PRIMARY KEY (player_id, day)
  );
`);

// Migração suave para bancos criados antes dos personagens.
const playerColumns = db.prepare('PRAGMA table_info(players)').all().map((column) => column.name);
if (!playerColumns.includes('character_id')) {
  db.exec("ALTER TABLE players ADD COLUMN character_id TEXT NOT NULL DEFAULT 'survivor'");
}

// Espelha no inventário o que já era do jogador antes da tabela existir.
db.exec(`
  INSERT OR IGNORE INTO player_items (player_id, kind, item_id, quantity, acquired_at)
    SELECT player_id, 'tool', tool_id, 1, acquired_at FROM player_tools;
  INSERT OR IGNORE INTO player_items (player_id, kind, item_id, quantity, acquired_at)
    SELECT player_id, 'character', character_id, 1, acquired_at FROM player_characters;
  INSERT OR IGNORE INTO player_items (player_id, kind, item_id, quantity, acquired_at)
    SELECT id, 'potion', 'tool_potion', potions, created_at FROM players WHERE potions > 0;
`);

// Ferramentas que podem ser compradas com moedas na loja.
const SHOP_TOOLS = {
  axe: 30,
  bat: 45,
  machete: 55,
  katana: 90,
  minigun: 160,
};

// Raridade de cada ferramenta (espelha o catálogo do cliente em public/js/game.js).
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

// Ferramentas que podem sair do baú dourado: só as raras e míticas.
const CHEST_POOL = Object.keys(TOOL_RARITY).filter((id) => TOOL_RARITY[id] !== 'comum');

const CHEST_COINS_REWARD = 25;

// Personagens (skins): cada um vem com uma ferramenta inicial.
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
const SESSION_DAYS = 30;

// Conquistas: uma a cada 10 dias sobrevividos e por zumbis mortos.
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

const namePattern = /^[A-Za-z0-9_]{3,16}$/;
// Senha: no mínimo 8 caracteres, apenas letras/números, com pelo menos 1 número.
const passwordPattern = /^(?=.*[0-9])[A-Za-z0-9]{8,64}$/;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function now() {
  return Date.now();
}

function toolsOf(playerId) {
  return db
    .prepare('SELECT tool_id FROM player_tools WHERE player_id = ? ORDER BY acquired_at')
    .all(playerId)
    .map((row) => row.tool_id);
}

function charactersOf(playerId) {
  return db
    .prepare('SELECT character_id FROM player_characters WHERE player_id = ? ORDER BY acquired_at')
    .all(playerId)
    .map((row) => row.character_id);
}

function inventoryOf(playerId) {
  return db
    .prepare(
      `SELECT kind, item_id AS itemId, quantity, acquired_at AS acquiredAt
         FROM player_items
        WHERE player_id = ?
        ORDER BY acquired_at, item_id`
    )
    .all(playerId);
}

// Registra (ou soma) um item no inventário do jogador.
function addItem(playerId, kind, itemId, quantity = 1) {
  db.prepare(
    `INSERT INTO player_items (player_id, kind, item_id, quantity, acquired_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (player_id, kind, item_id)
     DO UPDATE SET quantity = quantity + excluded.quantity`
  ).run(playerId, kind, itemId, quantity, now());
}

// Dá a ferramenta inicial de uma skin, se o jogador ainda não tiver.
function grantTool(playerId, toolId, stamp = now()) {
  const owned = db
    .prepare('SELECT 1 FROM player_tools WHERE player_id = ? AND tool_id = ?')
    .get(playerId, toolId);
  if (owned) return false;

  db.prepare('INSERT INTO player_tools (player_id, tool_id, acquired_at) VALUES (?, ?, ?)').run(
    playerId,
    toolId,
    stamp
  );
  addItem(playerId, 'tool', toolId);
  return true;
}

function playerTotals(playerId) {
  return db.prepare('SELECT best_day, total_kills FROM players WHERE id = ?').get(playerId);
}

function achievementsOf(playerId) {
  const totals = playerTotals(playerId) || { best_day: 1, total_kills: 0 };
  const unlocked = new Map(
    db
      .prepare('SELECT achievement_id, unlocked_at FROM player_achievements WHERE player_id = ?')
      .all(playerId)
      .map((row) => [row.achievement_id, row.unlocked_at])
  );

  return ACHIEVEMENTS.map((achievement) => {
    const current = achievement.kind === 'day' ? totals.best_day : totals.total_kills;
    return {
      id: achievement.id,
      kind: achievement.kind,
      title: achievement.title,
      desc: achievement.desc,
      target: achievement.target,
      current: Math.min(current, achievement.target),
      unlocked: unlocked.has(achievement.id),
      unlockedAt: unlocked.get(achievement.id) || null,
    };
  });
}

// Libera as conquistas que o jogador acabou de atingir e devolve as novas.
function syncAchievements(playerId) {
  const totals = playerTotals(playerId);
  if (!totals) return [];

  const unlocked = new Set(
    db
      .prepare('SELECT achievement_id FROM player_achievements WHERE player_id = ?')
      .all(playerId)
      .map((row) => row.achievement_id)
  );

  const fresh = [];
  const stamp = now();
  const insert = db.prepare(
    'INSERT OR IGNORE INTO player_achievements (player_id, achievement_id, unlocked_at) VALUES (?, ?, ?)'
  );

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    const current = achievement.kind === 'day' ? totals.best_day : totals.total_kills;
    if (current < achievement.target) continue;

    insert.run(playerId, achievement.id, stamp);
    fresh.push({ ...achievement });
  }

  return fresh;
}

function toPublicPlayer(row) {
  return {
    id: row.id,
    name: row.name,
    coins: row.coins,
    bestDay: row.best_day,
    potions: row.potions,
    totalKills: row.total_kills,
    runs: row.runs,
    tools: toolsOf(row.id),
    characters: charactersOf(row.id),
    character: row.character_id || STARTING_CHARACTER,
  };
}

function shopCatalog(playerId) {
  const owned = new Set(toolsOf(playerId));
  const ownedCharacters = new Set(charactersOf(playerId));
  const row = db.prepare('SELECT character_id FROM players WHERE id = ?').get(playerId);

  return {
    potionPrice: POTION_PRICE,
    tools: Object.entries(SHOP_TOOLS).map(([id, price]) => ({
      id,
      price,
      owned: owned.has(id),
    })),
    characters: Object.entries(SHOP_CHARACTERS).map(([id, price]) => ({
      id,
      price,
      owned: ownedCharacters.has(id),
      equipped: (row?.character_id || STARTING_CHARACTER) === id,
      starterTool: CHARACTER_STARTER[id] || STARTING_TOOL,
    })),
  };
}

const store = {
  validateName(name) {
    if (typeof name !== 'string') return 'INFORME UM NOME.';
    if (name.length < 3 || name.length > 16) return 'O NOME DEVE TER DE 3 A 16 CARACTERES.';
    if (!namePattern.test(name)) return 'USE APENAS LETRAS, NÚMEROS E _ NO NOME.';
    return null;
  },

  validatePassword(password) {
    if (typeof password !== 'string') return 'INFORME UMA SENHA.';
    if (password.length < 8 || password.length > 64) {
      return 'A SENHA DEVE TER NO MÍNIMO 8 CARACTERES.';
    }
    if (!passwordPattern.test(password)) {
      return 'A SENHA DEVE CONTER APENAS LETRAS/NÚMEROS E PELO MENOS 1 NÚMERO.';
    }
    return null;
  },

  findByName(name) {
    return db.prepare('SELECT * FROM players WHERE name_key = ?').get(name.toLowerCase());
  },

  createPlayer(name, password) {
    const { salt, hash } = hashPassword(password);
    const stamp = now();

    db.exec('BEGIN IMMEDIATE');
    try {
      const result = db
        .prepare(
          `INSERT INTO players
            (name, name_key, password_hash, password_salt, coins, best_day, potions, total_kills, runs, created_at, updated_at)
           VALUES (?, ?, ?, ?, 0, 1, 0, 0, 0, ?, ?)`
        )
        .run(name, name.toLowerCase(), hash, salt, stamp, stamp);

      const playerId = Number(result.lastInsertRowid);
      db.prepare(
        'INSERT INTO player_tools (player_id, tool_id, acquired_at) VALUES (?, ?, ?)'
      ).run(playerId, STARTING_TOOL, stamp);
      db.prepare(
        'INSERT INTO player_characters (player_id, character_id, acquired_at) VALUES (?, ?, ?)'
      ).run(playerId, STARTING_CHARACTER, stamp);
      addItem(playerId, 'tool', STARTING_TOOL);
      addItem(playerId, 'character', STARTING_CHARACTER);

      db.exec('COMMIT');
      return this.getPlayer(playerId);
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  },

  authenticate(name, password) {
    const row = this.findByName(name);
    if (!row) return null;
    if (!verifyPassword(password, row.password_salt, row.password_hash)) return null;
    return toPublicPlayer(row);
  },

  getPlayer(playerId) {
    const row = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    return row ? toPublicPlayer(row) : null;
  },

  createSession(playerId) {
    const token = crypto.randomBytes(32).toString('hex');
    const stamp = now();
    // Limpa sessões vencidas antes de criar outra, para a tabela não crescer sem limite.
    db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(stamp);
    db.prepare(
      'INSERT INTO sessions (token_hash, player_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
    ).run(hashToken(token), playerId, stamp, stamp + SESSION_DAYS * 24 * 60 * 60 * 1000);
    return token;
  },

  playerByToken(token) {
    if (!token || typeof token !== 'string') return null;
    const row = db
      .prepare(
        `SELECT p.*, s.expires_at FROM sessions s
           JOIN players p ON p.id = s.player_id
          WHERE s.token_hash = ?`
      )
      .get(hashToken(token));

    if (!row) return null;
    if (row.expires_at < now()) {
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
      return null;
    }
    return row;
  },

  destroySession(token) {
    if (!token) return;
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  },

  reportRun(playerId, { day, coins, kills, runs }) {
    const row = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    if (!row) return null;

    const safeDay = Math.max(1, Math.min(9999, Math.floor(Number(day) || 1)));
    const safeCoins = Math.max(0, Math.min(5000, Math.floor(Number(coins) || 0)));
    const safeKills = Math.max(0, Math.min(2000, Math.floor(Number(kills) || 0)));
    const safeRuns = Math.max(0, Math.min(1, Math.floor(Number(runs) || 0)));

    db.prepare(
      `UPDATE players
          SET coins = coins + ?,
              best_day = MAX(best_day, ?),
              total_kills = total_kills + ?,
              runs = runs + ?,
              updated_at = ?
        WHERE id = ?`
    ).run(safeCoins, safeDay, safeKills, safeRuns, now(), playerId);

    return this.getPlayer(playerId);
  },

  buyTool(playerId, toolId) {
    const price = SHOP_TOOLS[toolId];
    if (!price) return { error: 'FERRAMENTA INDISPONÍVEL NA LOJA.' };

    const owned = toolsOf(playerId);
    if (owned.includes(toolId)) return { error: 'VOCÊ JÁ TEM ESSA FERRAMENTA.' };

    const row = db.prepare('SELECT coins FROM players WHERE id = ?').get(playerId);
    if (!row) return { error: 'JOGADOR NÃO ENCONTRADO.' };
    if (row.coins < price) return { error: 'MOEDAS INSUFICIENTES.' };

    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('UPDATE players SET coins = coins - ?, updated_at = ? WHERE id = ?').run(
        price,
        now(),
        playerId
      );
      db.prepare(
        'INSERT INTO player_tools (player_id, tool_id, acquired_at) VALUES (?, ?, ?)'
      ).run(playerId, toolId, now());
      addItem(playerId, 'tool', toolId);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }

    return { player: this.getPlayer(playerId) };
  },

  buyPotion(playerId) {
    const row = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    if (!row) return { error: 'JOGADOR NÃO ENCONTRADO.' };

    const tiers = Math.floor(row.best_day / 10);
    if (row.potions >= tiers) {
      return { error: `POÇÕES ESGOTADAS. A PRÓXIMA ABRE NO DIA ${(row.potions + 1) * 10}.` };
    }
    if (row.coins < POTION_PRICE) return { error: 'MOEDAS INSUFICIENTES.' };

    db.prepare(
      'UPDATE players SET coins = coins - ?, potions = potions + 1, updated_at = ? WHERE id = ?'
    ).run(POTION_PRICE, now(), playerId);
    addItem(playerId, 'potion', 'tool_potion');

    return { player: this.getPlayer(playerId) };
  },

  buyCharacter(playerId, characterId) {
    const price = SHOP_CHARACTERS[characterId];
    if (price === undefined) return { error: 'PERSONAGEM INDISPONÍVEL NA LOJA.' };

    const owned = charactersOf(playerId);
    if (owned.includes(characterId)) return { error: 'VOCÊ JÁ TEM ESSE PERSONAGEM.' };

    const row = db.prepare('SELECT coins FROM players WHERE id = ?').get(playerId);
    if (!row) return { error: 'JOGADOR NÃO ENCONTRADO.' };
    if (row.coins < price) return { error: 'MOEDAS INSUFICIENTES.' };

    const starterTool = CHARACTER_STARTER[characterId] || STARTING_TOOL;
    let grantedStarter = false;

    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('UPDATE players SET coins = coins - ?, updated_at = ? WHERE id = ?').run(
        price,
        now(),
        playerId
      );
      db.prepare(
        'INSERT INTO player_characters (player_id, character_id, acquired_at) VALUES (?, ?, ?)'
      ).run(playerId, characterId, now());
      addItem(playerId, 'character', characterId);
      grantedStarter = grantTool(playerId, starterTool);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }

    return { player: this.getPlayer(playerId), starterTool, grantedStarter };
  },

  selectCharacter(playerId, characterId) {
    if (!(characterId in SHOP_CHARACTERS)) return { error: 'PERSONAGEM DESCONHECIDO.' };
    if (!charactersOf(playerId).includes(characterId)) {
      return { error: 'VOCÊ AINDA NÃO TEM ESSE PERSONAGEM.' };
    }

    db.prepare('UPDATE players SET character_id = ?, updated_at = ? WHERE id = ?').run(
      characterId,
      now(),
      playerId
    );

    return { player: this.getPlayer(playerId) };
  },

  // Abre o baú dourado do dia. O servidor escolhe a ferramenta, nunca o cliente.
  openChest(playerId, day) {
    const safeDay = Math.floor(Number(day) || 0);
    if (safeDay < 3 || safeDay % 2 !== 1) {
      return { error: 'NÃO HÁ BAÚ PARA ABRIR NESTE DIA.' };
    }

    const row = db.prepare('SELECT coins FROM players WHERE id = ?').get(playerId);
    if (!row) return { error: 'JOGADOR NÃO ENCONTRADO.' };

    // Cada dia de baú só rende uma recompensa por conta (evita farmar o baú).
    const already = db
      .prepare('SELECT tool_id FROM player_chests WHERE player_id = ? AND day = ?')
      .get(playerId, safeDay);
    if (already) {
      return { alreadyOpened: true, toolId: already.tool_id, coins: 0 };
    }

    const owned = new Set(toolsOf(playerId));
    const pool = CHEST_POOL.filter((id) => !owned.has(id));

    if (pool.length === 0) {
      const stamp = now();
      db.prepare(
        'UPDATE players SET coins = coins + ?, updated_at = ? WHERE id = ?'
      ).run(CHEST_COINS_REWARD, stamp, playerId);
      db.prepare(
        'INSERT INTO player_chests (player_id, day, tool_id, opened_at) VALUES (?, ?, ?, ?)'
      ).run(playerId, safeDay, 'coins', stamp);
      return { toolId: null, coins: CHEST_COINS_REWARD };
    }

    const toolId = pool[Math.floor(Math.random() * pool.length)];

    db.exec('BEGIN IMMEDIATE');
    try {
      grantTool(playerId, toolId);
      db.prepare(
        'INSERT INTO player_chests (player_id, day, tool_id, opened_at) VALUES (?, ?, ?, ?)'
      ).run(playerId, safeDay, toolId, now());
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }

    return { toolId, coins: 0 };
  },

  shopCatalog,
  inventoryOf,
  achievementsOf,
  syncAchievements,
  SHOP_TOOLS,
  SHOP_CHARACTERS,
  CHARACTER_STARTER,
  POTION_PRICE,
};

module.exports = { store, db };
