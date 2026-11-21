const STORAGE_KEY = 'jogoSuperlegal.save';

const DEFAULTS = {
  coins: 0,
  bestDay: 1,
  potions: 0,
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const data = JSON.parse(raw);
    return {
      coins: Number.isFinite(data.coins) ? Math.max(0, Math.floor(data.coins)) : 0,
      bestDay: Number.isFinite(data.bestDay) ? Math.max(1, Math.floor(data.bestDay)) : 1,
      potions: Number.isFinite(data.potions) ? Math.max(0, Math.floor(data.potions)) : 0,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function persist(save) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    /* armazenamento indisponivel: jogo segue sem salvar */
  }
}

export function toolDamage(potions) {
  return 5 + potions * 5;
}
