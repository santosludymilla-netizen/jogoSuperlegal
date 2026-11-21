const MARGIN = 14;

const TOOLS = {
  knife: { name: 'FACA', cooldown: 0.3, range: 32, arc: 1.3, knock: 70, width: 1 },
  axe: { name: 'MACHADO', cooldown: 0.62, range: 42, arc: 1.9, knock: 150, width: 2 },
};

const BASE_ZOMBIE_HP = 30;
const BASE_ZOMBIE_DAMAGE = 10;
const BASE_PLAYER_HP = 100;

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

const PLAYER_PALETTE = {
  h: '#cfd8bf',
  d: '#2b3c2e',
  j: '#1e4a26',
  p: '#ff2e88',
  k: '#050505',
};

function angleDiff(a, b) {
  let diff = a - b;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function drawSprite(g, rows, left, top, palette, flip, flash) {
  for (let row = 0; row < rows.length; row += 1) {
    const line = rows[row];
    for (let col = 0; col < line.length; col += 1) {
      const cell = line[col];
      if (cell === '.') continue;

      const x = left + (flip ? line.length - 1 - col : col);
      g.fillStyle = flash ? '#ffffff' : palette[cell] || '#ffffff';
      g.fillRect(x, top + row, 1, 1);
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
    this.active = false;

    this.W = 0;
    this.H = 0;
    this.time = 0;

    this.bindInput();
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
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
    });

    this.canvas.addEventListener('mousemove', (event) => this.updateMouse(event));

    this.canvas.addEventListener('mousedown', (event) => {
      if (!this.active) return;
      event.preventDefault();
      this.updateMouse(event);
      this.mouse.down = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });

    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  updateMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * this.W;
    this.mouse.y = ((event.clientY - rect.top) / rect.height) * this.H;
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

  start(toolId, bonusDamage) {
    this.tool = TOOLS[toolId] || TOOLS.knife;
    this.damage = 5 + bonusDamage;

    this.maxHp = BASE_PLAYER_HP;
    this.hp = BASE_PLAYER_HP;

    this.day = 1;
    this.killed = 0;
    this.total = 0;
    this.spawned = 0;
    this.spawnTimer = 0;
    this.killStreak = 0;
    this.coinsEarned = 0;

    this.zombies = [];
    this.particles = [];
    this.swings = [];

    this.player = {
      x: this.W / 2,
      y: this.H * 0.6,
      radius: 5,
      attackCd: 0,
      hurtCd: 0,
    };

    this.decals = document.createElement('canvas');
    this.decals.width = this.W;
    this.decals.height = this.H;
    this.decalCtx = this.decals.getContext('2d');

    this.time = 0;
    this.shake = 0;
    this.tip = '';
    this.tipUntil = 0;

    this.fireflies = Array.from(
      { length: Math.round((this.W * this.H) / 2600) + 8 },
      () => ({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random() < 0.65 ? '#39ff14' : '#ff2e88',
      })
    );

    this.active = true;
    this.mouse.down = false;

    this.startNight();
    this.setTip('TUTORIAL: WASD MOVER  -  MOUSE ATACAR', 5);
  }

  setTip(text, seconds) {
    this.tip = text;
    this.tipUntil = this.time + seconds;
  }

  startNight() {
    this.killed = 0;
    this.spawned = 0;
    this.spawnTimer = 0.6;
    this.total = 2 * this.day - 1;
  }

  spawnZombie() {
    const side = Math.floor(Math.random() * 4);
    let x;
    let y;

    if (side === 0) {
      x = Math.random() * this.W;
      y = -12;
    } else if (side === 1) {
      x = this.W + 12;
      y = Math.random() * this.H;
    } else if (side === 2) {
      x = Math.random() * this.W;
      y = this.H + 12;
    } else {
      x = -12;
      y = Math.random() * this.H;
    }

    const multiplier = 1 + 0.01 * (this.day - 1);
    const sprite = ZOMBIE_SPRITES[Math.floor(Math.random() * ZOMBIE_SPRITES.length)];

    this.zombies.push({
      x,
      y,
      sprite,
      hp: BASE_ZOMBIE_HP * multiplier,
      maxHp: BASE_ZOMBIE_HP * multiplier,
      damage: BASE_ZOMBIE_DAMAGE * multiplier,
      speed: 17 + Math.random() * 8,
      radius: 5,
      eye: Math.random() < 0.72 ? '#6bff4a' : '#ff5aa8',
      blood: Math.random() < 0.5 ? '#4a070d' : '#3a050a',
      flash: 0,
      attackCd: 0.5,
      phase: Math.random() * Math.PI * 2,
      kx: 0,
      ky: 0,
    });

    this.spawned += 1;
  }

  tryAttack(aim) {
    const player = this.player;
    if (player.attackCd > 0) return;

    player.attackCd = this.tool.cooldown;

    this.swings.push({
      angle: aim,
      t: 0,
      dur: 0.2,
      width: this.tool.width,
      range: this.tool.range,
    });

    let hit = false;

    for (const zombie of [...this.zombies]) {
      const dx = zombie.x - player.x;
      const dy = zombie.y - player.y;
      const distance = Math.hypot(dx, dy);

      if (distance > this.tool.range + zombie.radius) continue;
      if (Math.abs(angleDiff(Math.atan2(dy, dx), aim)) > this.tool.arc / 2) continue;

      this.damageZombie(zombie, this.damage, aim);
      hit = true;
    }

    if (hit) this.shake = 2;
  }

  damageZombie(zombie, amount, aim) {
    zombie.hp -= amount;
    zombie.flash = 0.09;
    zombie.kx += Math.cos(aim) * this.tool.knock;
    zombie.ky += Math.sin(aim) * this.tool.knock;

    for (let i = 0; i < 5; i += 1) {
      this.particles.push({
        x: zombie.x,
        y: zombie.y - 9,
        vx: Math.cos(aim + (Math.random() - 0.5)) * (30 + Math.random() * 50),
        vy: Math.sin(aim + (Math.random() - 0.5)) * (30 + Math.random() * 50),
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        color: Math.random() < 0.5 ? '#8b0000' : '#ff2e88',
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
    if (this.killStreak % 2 === 0) {
      this.coinsEarned += 1;
      this.cb.onCoins(1);
    }

    if (this.killed >= this.total) this.completeNight();
  }

  completeNight() {
    this.day += 1;
    this.cb.onBestDay(this.day);
    this.cb.onCoins(5);
    this.coinsEarned += 5;

    this.startNight();
    this.setTip(`NOITE SOBREVIDA  +$5  -  DIA ${this.day}`, 3.2);
  }

  hurt(amount) {
    if (this.player.hurtCd > 0 || !this.active) return;

    this.hp -= amount;
    this.player.hurtCd = 0.4;
    this.shake = 5;
    this.cb.onHurt();
  }

  gameOver() {
    this.active = false;
    this.mouse.down = false;
    this.cb.onGameOver({ day: this.day, coins: this.coinsEarned });
  }

  buildBackground() {
    const { W, H } = this;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');

    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, '#071009');
    base.addColorStop(0.5, '#050c07');
    base.addColorStop(1, '#030704');
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
    light.addColorStop(0, 'rgba(57, 255, 20, 0.13)');
    light.addColorStop(0.55, 'rgba(255, 46, 136, 0.04)');
    light.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = light;
    g.fillRect(0, 0, W, H);

    for (let i = 0; i < 26; i += 1) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const rx = 3 + Math.random() * 9;
      const ry = 1 + Math.random() * 3;

      g.globalAlpha = 0.28;
      g.fillStyle = Math.random() < 0.5 ? '#0a120a' : '#0c0a06';
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;

    g.fillStyle = '#0f1e0f';
    for (let i = 0; i < Math.round((W * H) / 700); i += 1) {
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      const height = 1 + Math.floor(Math.random() * 2);
      g.fillRect(x, y, 1, height);
    }

    for (let i = 0; i < 16; i += 1) {
      g.fillStyle = Math.random() < 0.5 ? '#1a201a' : '#121712';
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
          drawCanopy(x, y, 10 + Math.random() * 9, '#0a1a0e', '#24521f');
        }
      } else {
        for (let y = -10; y < H + step; y += step * (0.7 + Math.random() * 0.5)) {
          const x = side === 1 ? W + 2 - Math.random() * 8 : -2 + Math.random() * 8;
          drawCanopy(x, y, 10 + Math.random() * 9, '#0a1a0e', '#24521f');
        }
      }
    };

    borderTrees(0);
    borderTrees(2);
    borderTrees(1);
    borderTrees(3);

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

      drawCanopy(x, y, 3 + Math.random() * 4, '#08140a', '#1a3a1a');
    }

    this.bg = canvas;
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

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      dx /= length;
      dy /= length;

      player.x += dx * 92 * dt;
      player.y += dy * 92 * dt;
      player.x = Math.min(Math.max(player.x, MARGIN), this.W - MARGIN);
      player.y = Math.min(Math.max(player.y, MARGIN), this.H - MARGIN);
    }

    player.attackCd = Math.max(0, player.attackCd - dt);
    player.hurtCd = Math.max(0, player.hurtCd - dt);

    const aim = Math.atan2(this.mouse.y - player.y, this.mouse.x - player.x);
    this.aim = aim;

    if (this.mouse.down) this.tryAttack(aim);

    for (const swing of this.swings) swing.t += dt;
    this.swings = this.swings.filter((swing) => swing.t < swing.dur);

    if (this.spawned < this.total && this.zombies.length < Math.min(4 + this.day, 10)) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnZombie();
        this.spawnTimer = Math.max(0.45, 1.3 - this.day * 0.04);
      }
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
    }

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
        tip: this.tip,
      });
    }
  }

  drawZombie(zombie) {
    const { ctx } = this;
    const left = Math.round(zombie.x - 5);
    const top = Math.round(zombie.y - 18);
    const flip = zombie.x > this.player.x;
    const bob = Math.sin(this.time * 2.2 + zombie.phase) > 0 ? 1 : 0;

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000000';
    ctx.fillRect(left + 1, Math.round(zombie.y) - 1, 8, 2);
    ctx.globalAlpha = 1;

    const palette = {
      '#': '#1b2e1b',
      b: zombie.blood,
      x: '#9aa38f',
      e: zombie.eye,
    };

    drawSprite(ctx, zombie.sprite, left, top + bob, palette, flip, zombie.flash > 0);

    if (zombie.hp < zombie.maxHp) {
      const barWidth = 12;
      const ratio = Math.max(0, zombie.hp / zombie.maxHp);
      ctx.fillStyle = '#1a0808';
      ctx.fillRect(left - 1, top - 5, barWidth, 2);
      ctx.fillStyle = '#ff2e88';
      ctx.fillRect(left - 1, top - 5, Math.max(1, Math.round(barWidth * ratio)), 2);
    }
  }

  drawPlayer() {
    const { ctx } = this;
    const player = this.player;
    const left = Math.round(player.x - 5);
    const top = Math.round(player.y - 17);
    const flip = this.mouse.x < player.x;

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000000';
    ctx.fillRect(left + 1, Math.round(player.y) - 1, 8, 2);
    ctx.globalAlpha = 1;

    drawSprite(ctx, PLAYER_SPRITE, left, top, PLAYER_PALETTE, flip, false);

    const handX = player.x;
    const handY = player.y - 9;

    ctx.strokeStyle = '#cfd8bf';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(handX + Math.cos(this.aim) * 7, handY + Math.sin(this.aim) * 7);
    ctx.stroke();
  }

  drawSwings() {
    const { ctx } = this;
    const player = this.player;

    for (const swing of this.swings) {
      const progress = swing.t / swing.dur;
      const alpha = (1 - progress) * 0.8;
      const sweep = this.tool.arc;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#d8d8d0';
      ctx.lineWidth = swing.width;
      ctx.beginPath();
      ctx.arc(
        player.x,
        player.y - 8,
        swing.range * 0.8,
        swing.angle - sweep / 2,
        swing.angle + sweep / 2
      );
      ctx.stroke();
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
      const x = firefly.x + Math.sin(this.time * 0.6 + firefly.phase) * 7;
      const y = firefly.y + Math.cos(this.time * 0.45 + firefly.phase) * 5;

      ctx.globalAlpha = 0.18 + 0.4 * Math.abs(Math.sin(this.time * 1.1 + firefly.phase));
      ctx.fillStyle = firefly.tint;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }

    ctx.globalAlpha = 1;
  }

  drawFog() {
    const { ctx, W, H } = this;

    for (let i = 0; i < 2; i += 1) {
      const cx = (((this.time * (0.01 + i * 0.008) + i * 0.5) % 1.4) - 0.2) * W;
      const cy = H * 0.6 + Math.sin(this.time * 0.4 + i) * 12;
      const radius = Math.max(W, H) * 0.35;
      const tint = i === 1 ? '255, 46, 136' : '57, 255, 20';

      const fog = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      fog.addColorStop(0, `rgba(${tint}, 0.05)`);
      fog.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);
    }
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
    if (this.decals) ctx.drawImage(this.decals, 0, 0);

    const zombies = [...this.zombies].sort((a, b) => a.y - b.y);
    for (const zombie of zombies) this.drawZombie(zombie);

    this.drawPlayer();
    this.drawSwings();
    this.drawParticles();
    this.drawFireflies();

    ctx.restore();

    this.drawFog();

    if (this.active) this.drawCrosshair();
  }
}
