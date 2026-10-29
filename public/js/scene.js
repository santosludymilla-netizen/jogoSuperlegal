const COLORS = {
  green: '#39ff14',
  pink: '#ff2e88',
  eyeGreen: '#6bff4a',
  eyePink: '#ff5aa8',
  body: '#16241a',
  blood: '#4a070d',
  bone: '#8f9a86',
};

const ZOMBIE_A = [
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
];

const ZOMBIE_B = [
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
];

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawPine(g, x, base, height, color) {
  const trunkHeight = Math.max(2, Math.round(height * 0.14));
  g.fillStyle = color;
  g.fillRect(Math.round(x) - 1, Math.round(base - trunkHeight), 2, trunkHeight);

  const top = base - height;
  for (let tier = 0; tier < 3; tier += 1) {
    const tierTop = top + height * 0.16 * tier;
    const tierHeight = height * 0.46;
    const maxWidth = height * (0.26 + tier * 0.12);

    for (let row = 0; row < tierHeight; row += 1) {
      const progress = row / tierHeight;
      const width = Math.max(1, Math.round(maxWidth * (0.22 + progress * 0.78)));
      g.fillRect(Math.round(x - width / 2), Math.round(tierTop + row), width, 1);
    }
  }
}

function drawDeadTree(g, x, base, height, color) {
  g.fillStyle = color;
  const trunkTop = base - height;
  g.fillRect(Math.round(x), Math.round(trunkTop), 2, Math.round(height));

  for (let branch = 0; branch < 4; branch += 1) {
    const startY = trunkTop + height * (0.2 + branch * 0.16);
    const dir = branch % 2 === 0 ? -1 : 1;
    const length = Math.round(height * (0.16 - branch * 0.02));

    for (let step = 0; step < length; step += 1) {
      g.fillRect(Math.round(x + dir * step), Math.round(startY - step * 0.65), 1, 1);
    }
  }
}

function drawGrave(g, x, base, kind, color) {
  g.fillStyle = color;

  if (kind === 'cross') {
    g.fillRect(Math.round(x + 2), Math.round(base - 9), 2, 9);
    g.fillRect(Math.round(x), Math.round(base - 7), 6, 2);
    return;
  }

  g.fillRect(Math.round(x), Math.round(base - 6), 6, 6);
  g.fillRect(Math.round(x + 1), Math.round(base - 7), 4, 1);
  g.fillRect(Math.round(x + 2), Math.round(base - 8), 2, 1);
}

export class MenuScene {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.W = 0;
    this.H = 0;
    this.time = 0;
  }

  resize(W, H) {
    this.W = W;
    this.H = H;
    this.build();
  }

  build() {
    const { W, H } = this;
    const random = mulberry32(20261028);

    this.horizon = Math.round(H * 0.8);

    this.sky = this.ctx.createLinearGradient(0, 0, 0, this.horizon);
    this.sky.addColorStop(0, '#020304');
    this.sky.addColorStop(0.5, '#060508');
    this.sky.addColorStop(0.84, '#100710');
    this.sky.addColorStop(1, '#1a0910');

    const starCount = Math.round((W * H) / 1100);
    this.stars = Array.from({ length: starCount }, () => ({
      x: Math.floor(random() * W),
      y: Math.floor(random() * this.horizon * 0.7),
      phase: random() * Math.PI * 2,
      tint: random() < 0.8 ? '#cfd8bf' : COLORS.green,
    }));

    this.layers = [];

    const layerSpecs = [
      { depth: 'back', spacing: 13, minH: 0.2, maxH: 0.34, color: '#0a1410', baseOffset: -1 },
      { depth: 'mid', spacing: 17, minH: 0.3, maxH: 0.46, color: '#07100b', baseOffset: 3 },
      { depth: 'front', spacing: 22, minH: 0.46, maxH: 0.64, color: '#040806', baseOffset: 11 },
    ];

    for (const spec of layerSpecs) {
      const trees = [];
      let x = -random() * spec.spacing;

      while (x < W + spec.spacing) {
        const height = Math.round(H * (spec.minH + random() * (spec.maxH - spec.minH)));
        const base = this.horizon + spec.baseOffset;
        const edgeOnly = spec.depth === 'front';
        const visible = !edgeOnly || x < W * 0.3 || x > W * 0.7;

        if (visible) {
          trees.push({ x, base, height, dead: random() < 0.12 });
        }

        x += spec.spacing * (0.55 + random() * 0.9);
      }

      this.layers.push({ ...spec, trees });
    }

    this.graves = Array.from({ length: 5 }, () => ({
      x: Math.round(W * (0.12 + random() * 0.72)),
      base: this.horizon + 2 + Math.floor(random() * 5),
      kind: random() < 0.5 ? 'cross' : 'stone',
    }));

    this.zombies = Array.from({ length: 6 }, () => {
      const tint = random() < 0.72 ? COLORS.eyeGreen : COLORS.eyePink;
      return {
        x: random() * W,
        y: this.horizon + 4 + Math.floor(random() * 11),
        dir: random() < 0.5 ? -1 : 1,
        speed: 1.1 + random() * 2.6,
        phase: random() * Math.PI * 2,
        sprite: random() < 0.5 ? ZOMBIE_A : ZOMBIE_B,
        eye: tint,
        blood: random() < 0.5 ? COLORS.blood : '#3a050a',
      };
    });

    this.embers = Array.from({ length: Math.round((W * H) / 1800) }, () => ({
      x: random() * W,
      y: random() * H,
      speed: 3 + random() * 9,
      drift: 2 + random() * 5,
      phase: random() * Math.PI * 2,
      tint: random() < 0.6 ? COLORS.green : COLORS.pink,
      alpha: 0.18 + random() * 0.5,
    }));

    this.grass = Array.from({ length: Math.round(W / 3) }, () => ({
      x: Math.floor(random() * W),
      y: this.horizon + 2 + Math.floor(random() * (H - this.horizon)),
      height: 1 + Math.floor(random() * 3),
    }));
  }

  drawZombie(zombie, time) {
    const { ctx } = this;
    const bob = Math.sin(time * 2.3 + zombie.phase);
    const step = Math.sin(time * 4 + zombie.phase) > 0 ? 1 : 0;
    const x = Math.round(zombie.x);
    const y = Math.round(zombie.y + bob);
    const flip = zombie.dir < 0;

    for (let row = 0; row < zombie.sprite.length; row += 1) {
      const line = zombie.sprite[row];

      for (let col = 0; col < line.length; col += 1) {
        const cell = line[col];
        if (cell === '.') continue;

        const px = x + (flip ? line.length - 1 - col : col);
        const py = y + row + (row > 13 && step ? 1 : 0);

        if (cell === 'e') {
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = zombie.eye;
          ctx.fillRect(px - 1, py - 1, 3, 3);
          ctx.globalAlpha = 1;
          ctx.fillRect(px, py, 1, 1);
        } else if (cell === 'b') {
          ctx.fillStyle = zombie.blood;
          ctx.fillRect(px, py, 1, 1);
        } else if (cell === 'x') {
          ctx.fillStyle = COLORS.bone;
          ctx.fillRect(px, py, 1, 1);
        } else {
          ctx.fillStyle = COLORS.body;
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }
  }

  drawFog(time) {
    const { ctx, W, H, horizon } = this;

    for (let i = 0; i < 3; i += 1) {
      const cx = (((time * (0.012 + i * 0.006) + i * 0.41) % 1.5) - 0.25) * W;
      const cy = horizon - 8 + Math.sin(time * 0.45 + i * 1.7) * 5;
      const radius = W * 0.26;
      const tint = i === 1 ? '255, 46, 136' : '57, 255, 20';

      const fog = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      fog.addColorStop(0, `rgba(${tint}, 0.07)`);
      fog.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);
    }
  }

  draw(time, dt = 0.016) {
    const { ctx, W, H, horizon } = this;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = this.sky;
    ctx.fillRect(0, 0, W, horizon);

    for (const star of this.stars) {
      ctx.globalAlpha = 0.22 + 0.4 * Math.abs(Math.sin(time * 0.9 + star.phase));
      ctx.fillStyle = star.tint;
      ctx.fillRect(star.x, star.y, 1, 1);
    }
    ctx.globalAlpha = 1;

    const moonX = Math.round(W * 0.8);
    const moonY = Math.round(H * 0.18);
    const moonR = Math.max(7, Math.round(H * 0.075));

    const halo = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 3.6);
    halo.addColorStop(0, 'rgba(255, 46, 136, 0.3)');
    halo.addColorStop(0.4, 'rgba(255, 46, 136, 0.1)');
    halo.addColorStop(1, 'rgba(255, 46, 136, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(moonX - moonR * 3.6, moonY - moonR * 3.6, moonR * 7.2, moonR * 7.2);

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fillStyle = '#6b0b1a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = '#8f1024';
    ctx.fill();

    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(moonX - moonR * 0.22, moonY - moonR * 0.18, moonR * 0.24, 0, Math.PI * 2);
    ctx.fillStyle = '#3d0510';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + moonR * 0.28, moonY + moonR * 0.22, moonR * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const haze = ctx.createLinearGradient(0, horizon - H * 0.2, 0, horizon + 4);
    haze.addColorStop(0, 'rgba(255, 46, 136, 0)');
    haze.addColorStop(0.7, 'rgba(255, 46, 136, 0.08)');
    haze.addColorStop(1, 'rgba(255, 46, 136, 0.2)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - H * 0.2, W, H * 0.2 + 4);

    for (const layer of this.layers.slice(0, 2)) {
      for (const tree of layer.trees) {
        if (tree.dead) {
          drawDeadTree(ctx, tree.x, tree.base, tree.height, layer.color);
        } else {
          drawPine(ctx, tree.x, tree.base, tree.height, layer.color);
        }
      }
    }

    for (const grave of this.graves) {
      drawGrave(ctx, grave.x, grave.base, grave.kind, '#090d09');
    }

    ctx.fillStyle = '#050705';
    ctx.fillRect(0, horizon, W, H - horizon);

    ctx.globalAlpha = 0.05;
    ctx.fillStyle = COLORS.green;
    for (let y = horizon + 3; y < H; y += 4) {
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = 1;

    for (const tuft of this.grass) {
      ctx.fillStyle = '#081008';
      ctx.fillRect(tuft.x, tuft.y - tuft.height, 1, tuft.height);
    }

    this.drawFog(time);

    for (const zombie of this.zombies) {
      zombie.x += zombie.dir * zombie.speed * dt;
      if (zombie.x > this.W + 12) zombie.x = -12;
      if (zombie.x < -12) zombie.x = this.W + 12;
      this.drawZombie(zombie, time);
    }

    const front = this.layers[2];
    for (const tree of front.trees) {
      if (tree.dead) {
        drawDeadTree(ctx, tree.x, tree.base, tree.height, front.color);
      } else {
        drawPine(ctx, tree.x, tree.base, tree.height, front.color);
      }
    }

    for (const ember of this.embers) {
      ember.y -= ember.speed * dt;
      if (ember.y < -4) {
        ember.y = H + 4;
        ember.x = Math.random() * W;
      }

      const x = ember.x + Math.sin(time * 1.4 + ember.phase) * ember.drift;
      ctx.globalAlpha = ember.alpha * (0.5 + 0.5 * Math.sin(time * 2 + ember.phase));
      ctx.fillStyle = ember.tint;
      ctx.fillRect(Math.round(x), Math.round(ember.y), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}
