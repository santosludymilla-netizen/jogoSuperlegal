'use strict';

const path = require('node:path');
const express = require('express');
const { store } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

// ---------- limitador simples de tentativas de login ----------

const attempts = new Map();
const ATTEMPT_WINDOW = 5 * 60 * 1000;
const ATTEMPT_LIMIT = 25;

function tooManyAttempts(ip) {
  const stamp = Date.now();
  const entry = attempts.get(ip);

  if (!entry || stamp > entry.reset) {
    attempts.set(ip, { count: 1, reset: stamp + ATTEMPT_WINDOW });
    return false;
  }

  entry.count += 1;
  return entry.count > ATTEMPT_LIMIT;
}

// ---------- helpers ----------

function tokenFrom(request) {
  const header = request.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim() || null;
}

function auth(request, response, next) {
  const row = store.playerByToken(tokenFrom(request));
  if (!row) {
    response.status(401).json({ error: 'SESSÃO EXPIRADA. FAÇA LOGIN NOVAMENTE.' });
    return;
  }
  request.playerRow = row;
  next();
}

function stateOf(playerId) {
  return {
    player: store.getPlayer(playerId),
    shop: store.shopCatalog(playerId),
  };
}

function fail(response, status, message) {
  response.status(status).json({ error: message });
}

// ---------- autenticação ----------

app.post('/api/auth/register', (request, response) => {
  if (tooManyAttempts(request.ip)) {
    return fail(response, 429, 'MUITAS TENTATIVAS. ESPERE ALGUNS MINUTOS.');
  }

  const { name, password } = request.body || {};
  const nameError = store.validateName(name);
  if (nameError) return fail(response, 400, nameError);
  const passwordError = store.validatePassword(password);
  if (passwordError) return fail(response, 400, passwordError);

  if (store.findByName(name)) {
    return fail(response, 409, 'ESSE NOME JÁ EXISTE. ESCOLHA OUTRO.');
  }

  let player;
  try {
    player = store.createPlayer(name, password);
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      return fail(response, 409, 'ESSE NOME JÁ EXISTE. ESCOLHA OUTRO.');
    }
    console.error('erro ao criar jogador:', error);
    return fail(response, 500, 'ERRO AO CRIAR A CONTA.');
  }

  const token = store.createSession(player.id);
  response.status(201).json({
    token,
    player,
    shop: store.shopCatalog(player.id),
  });
});

app.post('/api/auth/login', (request, response) => {
  if (tooManyAttempts(request.ip)) {
    return fail(response, 429, 'MUITAS TENTATIVAS. ESPERE ALGUNS MINUTOS.');
  }

  const { name, password } = request.body || {};
  if (typeof name !== 'string' || typeof password !== 'string') {
    return fail(response, 400, 'INFORME NOME E SENHA.');
  }

  const player = store.authenticate(name, password);
  if (!player) return fail(response, 401, 'NOME OU SENHA INCORRETOS.');

  const token = store.createSession(player.id);
  response.json({ token, player, shop: store.shopCatalog(player.id) });
});

app.post('/api/auth/logout', auth, (request, response) => {
  store.destroySession(tokenFrom(request));
  response.json({ ok: true });
});

// ---------- estado e progresso ----------

app.get('/api/state', auth, (request, response) => {
  response.json(stateOf(request.playerRow.id));
});

app.post('/api/run/report', auth, (request, response) => {
  const { day, coins, kills, runs } = request.body || {};
  const player = store.reportRun(request.playerRow.id, { day, coins, kills, runs });
  response.json({ player, shop: store.shopCatalog(player.id) });
});

// ---------- loja ----------

app.post('/api/shop/tool', auth, (request, response) => {
  const { toolId } = request.body || {};
  const result = store.buyTool(request.playerRow.id, toolId);
  if (result.error) return fail(response, 400, result.error);
  response.json({ player: result.player, shop: store.shopCatalog(result.player.id) });
});

app.post('/api/shop/potion', auth, (request, response) => {
  const result = store.buyPotion(request.playerRow.id);
  if (result.error) return fail(response, 400, result.error);
  response.json({ player: result.player, shop: store.shopCatalog(result.player.id) });
});

app.post('/api/shop/character', auth, (request, response) => {
  const { characterId } = request.body || {};
  const result = store.buyCharacter(request.playerRow.id, characterId);
  if (result.error) return fail(response, 400, result.error);
  response.json({ player: result.player, shop: store.shopCatalog(result.player.id) });
});

app.post('/api/character/select', auth, (request, response) => {
  const { characterId } = request.body || {};
  const result = store.selectCharacter(request.playerRow.id, characterId);
  if (result.error) return fail(response, 400, result.error);
  response.json({ player: result.player, shop: store.shopCatalog(result.player.id) });
});

// ---------- arquivos estáticos ----------

app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders(response, filePath) {
      if (filePath.endsWith('.html')) {
        response.setHeader('Cache-Control', 'no-store');
      }
    },
  })
);

app.use((request, response) => {
  if (request.path.startsWith('/api/')) {
    response.status(404).json({ error: 'ROTA NÃO ENCONTRADA.' });
    return;
  }
  response.status(404).send('Not found');
});

app.use((error, request, response, next) => {
  console.error('erro no servidor:', error);
  if (response.headersSent) return next(error);
  response.status(500).json({ error: 'ERRO INTERNO DO SERVIDOR.' });
});

app.listen(PORT, () => {
  console.log(`jogoSuperlegal rodando em http://localhost:${PORT}`);
});
