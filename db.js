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
`);

// Migração suave para bancos criados antes dos personagens.
const playerColumns = db.prepare('PRAGMA table_info(players)').all().map((column) => column.name);
if (!playerColumns.includes('character_id')) {
  db.exec("ALTER TABLE players ADD COLUMN character_id TEXT NOT NULL DEFAULT 'survivor'");
}

// Ferramentas "iniciais" que podem ser compradas com moedas. As raras/miticas
// continuam aparecendo apenas por sorte na escolha do inicio da partida.
const SHOP_TOOLS = {
  axe: 30,
  bat: 45,
  machete: 55,
};

// Personagens (skins) com vantagens própria. O sobrevivente é o padrão.
const SHOP_CHARACTERS = {
  survivor: 0,
  runner: 120,
  medic: 150,
  brute: 180,
  thief: 200,
  tank: 220,
};

const POTION_PRICE = 10;
const STARTING_TOOL = 'knife';
const STARTING_CHARACTER = 'survivor';
const SESSION_DAYS = 30;

const namePattern = /^[A-Za-z0-9_]{3,16}$/;
const passwordPattern = /^(?=.*[0-9])[A-Za-z0-9]{4,8}$/;

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
    if (password.length < 4 || password.length > 8) return 'A SENHA DEVE TER DE 4 A 8 CARACTERES.';
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
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }

    return { player: this.getPlayer(playerId) };
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

  shopCatalog,
  SHOP_TOOLS,
  SHOP_CHARACTERS,
  POTION_PRICE,
};

module.exports = { store, db };
