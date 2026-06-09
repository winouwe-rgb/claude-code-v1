// app.js

const STAT_COLORS = {
  intelligence:      '#74b9ff',
  stamina:           '#55efc4',
  popularity:        '#fd79a8',
  depth:             '#a29bfe',
  luck:              '#fdcb6e',
  condition:         '#00cec9',
  trust:             '#e17055',
  friendDistance:    '#81ecec',
  friendAnxiety:     '#d63031',
  friendIndependence:'#6c5ce7',
};

const STAT_LABELS = {
  intelligence:      '知力',
  stamina:           '体力',
  popularity:        '人気',
  depth:             '深み',
  luck:              '運',
  condition:         '調子',
  trust:             '信頼',
  friendDistance:    '距離',
  friendAnxiety:     '不安',
  friendIndependence:'自立',
};

const STAT_DESCRIPTIONS = {
  intelligence:      ['鈍い',     'ぼんやり',   '普通',   '鋭い',     '冴えわたる'],
  stamina:           ['ぐったり', '疲れ気味',   '普通',   '元気',     'みなぎる'],
  popularity:        ['孤立気味', '目立たない', 'そこそこ','顔が広い', '人気者'],
  depth:             ['表面的',   'うっすら',   'そこそこ','深い',     '底なし'],
  luck:              ['ついてない','まあまあ',   '普通',   'ラッキー', '絶好調'],
  condition:         ['ボロボロ', '疲弊',       'まあまあ','良好',     '絶好調'],
  trust:             ['薄い',     '普通',       'まあまあ','厚い',     '絶大'],
  friendDistance:    ['近い',     'わりと近い', '普通',   '少し遠い', '遠い'],
  friendAnxiety:     ['穏やか',   'ほんの少し', '少し不安','不安定',  '限界近い'],
  friendIndependence:['依存気味', 'やや',       '普通',   '自立的',   '一人で立てる'],
};

const SEED_DISPLAY = {
  groupParticipation: '仲間への参加',
  twoPersonWorld:     '二人きりの世界',
  groupFear:          '集団への恐れ',
  groupHope:          '集団への希望',
  scienceTechnology:  '科学と技術',
  expression:         '表現',
  prophecy:           '予言',
  clubWithdrawal:     '部活離脱',
  friendIndependence: '親友の自立',
};

// Game state
const state = {
  currentEventId: 'name_input',
  playerName: 'ミナト',
  friendName: 'ワタ',
  friendPronoun: 'ぼく',
  stats: {
    intelligence:      5,
    stamina:           5,
    popularity:        5,
    depth:             5,
    luck:              5,
    condition:         5,
    trust:             5,
    friendDistance:    5,
    friendAnxiety:     3,
    friendIndependence:3,
  },
  seeds: {},
  flags: [],
  log:   [],
};

function replaceName(text) {
  if (!text) return text;
  return text
    .replace(/\{player\}/g, state.playerName)
    .replace(/\{friend\}/g, state.friendName)
    .replace(/\{friendPronoun\}/g, state.friendPronoun);
}

// ── Night categories ────────────────────────────────────────

const NIGHT_CATEGORIES = {
  study: {
    good:     { text: '気になったことが芋づる式に繋がった。頭が冴えている。',     effects: { intelligence: 2 } },
    normal:   { text: 'そこそこ分かった。明日また続きをやろう。',               effects: { intelligence: 1 } },
    bad:      { text: '気づいたら関係ないページを読んでいた。',                 effects: { intelligence: 1, condition: -1 } },
    badBonus: { text: 'でも、なぜかあいつのことを少し考えていた。',             effects: { depth: 1 } },
  },
  train: {
    good:     { text: '気づいたら2時間経っていた。体が軽い。',                 effects: { stamina: 2 } },
    normal:   { text: 'そこそこやった。まあこんなもんか。',                     effects: { stamina: 1 } },
    bad:      { text: '途中で集中が切れた。でもやらないよりはマシ。',           effects: { stamina: 1, condition: -1 } },
    badBonus: { text: '動いている間だけ、余計なことを考えなかった。',           effects: { trust: 1 } },
  },
  think: {
    good:     { text: '何かが少し、整理された気がした。',                       effects: { depth: 2 } },
    normal:   { text: '答えは出なかった。でも考えた。',                         effects: { depth: 1 } },
    bad:      { text: '考えすぎて、余計分からなくなった。',                     effects: { depth: 1, condition: -1 } },
    badBonus: { text: 'それでも、あいつのことだけはよく分かる気がした。',       effects: { trust: 1 } },
  },
  rest: {
    good:     { text: 'よく眠れた。明日が少し軽い。',                           effects: { condition: 2 } },
    normal:   { text: 'まあまあ休めた。',                                       effects: { condition: 1 } },
    bad:      { text: '横になったけど、なかなか寝付けなかった。',               effects: { condition: 1 } },
    badBonus: { text: '天井を見ながら、いろんなことを考えた。',                 effects: { depth: 1 } },
  },
  search: {
    good:     { text: 'さりげなく聞けた。意外と周りはよく見ている。',           effects: { popularity: 2 } },
    normal:   { text: 'それとなく探った。あまり収穫はなかった。',               effects: { popularity: 1 } },
    bad:      { text: '少し空回りした気がする。',                               effects: { popularity: 1, condition: -1 } },
    badBonus: { text: 'うまくいかなかったけど、自分がどう見られているか少し分かった。', effects: { depth: 1 } },
  },
};

function rollNight(category) {
  const cond = state.stats.condition;
  let goodRate, badRate;
  if      (cond >= 9) { goodRate = 0.20; badRate = 0.05; }
  else if (cond <= 3) { goodRate = 0.05; badRate = 0.20; }
  else                { goodRate = 0.10; badRate = 0.10; }

  const r = Math.random();
  let result;
  if      (r < goodRate)           result = 'good';
  else if (r < goodRate + badRate) result = 'bad';
  else                             result = 'normal';

  const cat = NIGHT_CATEGORIES[category];
  const outcome = cat[result];
  applyEffects(outcome.effects);

  let bonusText = null;
  if (result === 'bad' && Math.random() < 0.20) {
    applyEffects(cat.badBonus.effects);
    bonusText = cat.badBonus.text;
  }

  return { result, text: outcome.text, bonusText };
}

// ── Stat helpers ────────────────────────────────────────────

function getStatDesc(name, value) {
  const descs = STAT_DESCRIPTIONS[name];
  if (!descs) return '';
  const idx = Math.min(Math.floor((value / 14) * descs.length), descs.length - 1);
  return descs[Math.max(0, idx)];
}

function applyEffects(effects) {
  if (!effects) return;

  const statKeys = Object.keys(state.stats);
  for (const key of statKeys) {
    if (effects[key] !== undefined) {
      state.stats[key] = Math.max(0, state.stats[key] + effects[key]);
    }
  }

  if (effects.seeds) {
    for (const [seed, val] of Object.entries(effects.seeds)) {
      state.seeds[seed] = (state.seeds[seed] || 0) + val;
    }
  }

  if (effects.flags) {
    for (const flag of effects.flags) {
      if (!state.flags.includes(flag)) {
        state.flags.push(flag);
      }
    }
  }
}

function computeResultSeeds() {
  const approvalFlags    = ['もう少し頑張ればと言われた', '背中を押した記憶'];
  const togetherFlags    = ['一緒に休んだ記憶', '一緒に行った記憶'];
  const independenceFlags= ['置いていかれた記憶', '見送った記憶'];

  const hasApproval     = approvalFlags.some(f => state.flags.includes(f));
  const hasTogether     = togetherFlags.some(f => state.flags.includes(f));
  const hasIndependence = independenceFlags.some(f => state.flags.includes(f));

  if (hasApproval)     state.seeds.groupHope          = (state.seeds.groupHope          || 0) + 2;
  if (hasTogether)     state.seeds.twoPersonWorld      = (state.seeds.twoPersonWorld      || 0) + 1;
  if (hasIndependence) state.seeds.friendIndependence  = (state.seeds.friendIndependence  || 0) + 2;

  return { hasApproval, hasTogether, hasIndependence };
}

// ── Name input ──────────────────────────────────────────────

function renderNameInput() {
  document.getElementById('background-area').className = 'bg-spring-day';
  document.getElementById('month-label').textContent  = '';
  document.getElementById('event-title').textContent  = '';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;
  textEl.textContent = '名前を決めてください。';
  textEl.classList.add('fade-in');

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const playerRow = document.createElement('div');
  playerRow.className = 'name-input-row';
  const playerLabel = document.createElement('label');
  playerLabel.textContent = 'あなた';
  playerLabel.className = 'name-input-label';
  const playerInput = document.createElement('input');
  playerInput.type = 'text';
  playerInput.value = state.playerName;
  playerInput.maxLength = 8;
  playerInput.className = 'name-input-field';
  playerRow.appendChild(playerLabel);
  playerRow.appendChild(playerInput);

  const friendRow = document.createElement('div');
  friendRow.className = 'name-input-row';
  const friendLabel = document.createElement('label');
  friendLabel.textContent = '親友';
  friendLabel.className = 'name-input-label';
  const friendInput = document.createElement('input');
  friendInput.type = 'text';
  friendInput.value = state.friendName;
  friendInput.maxLength = 8;
  friendInput.className = 'name-input-field';
  friendRow.appendChild(friendLabel);
  friendRow.appendChild(friendInput);

  const btn = makeBtn('決定', 'choice-btn continue-btn');
  btn.addEventListener('click', () => {
    const p = playerInput.value.trim();
    const f = friendInput.value.trim();
    if (p) state.playerName = p;
    if (f) state.friendName = f;
    renderEvent('prologue_start');
  });

  choicesArea.appendChild(playerRow);
  choicesArea.appendChild(friendRow);
  choicesArea.appendChild(btn);
}

// ── Rendering ───────────────────────────────────────────────

function renderEvent(eventId) {
  state.currentEventId = eventId;

  if (eventId === 'name_input') {
    renderNameInput();
    return;
  }

  const event = EVENTS[eventId];
  if (!event) return;

  if (event.type === 'result') {
    renderResult();
    return;
  }

  if (event.type === 'branch') {
    resolveBranch(event);
    return;
  }

  // Background
  document.getElementById('background-area').className = `bg-${event.background}`;

  // Header
  document.getElementById('month-label').textContent  = event.month;
  document.getElementById('event-title').textContent  = event.title || '';

  // Speaker
  const speakerArea = document.getElementById('speaker-area');
  const speakerName = document.getElementById('speaker-name');
  if (event.speaker) {
    speakerName.textContent = replaceName(event.speaker);
    speakerArea.style.visibility = 'visible';
  } else {
    speakerName.textContent   = '';
    speakerArea.style.visibility = 'hidden';
  }

  // Text
  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;
  textEl.textContent = replaceName(event.text) || '';
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  // Choices
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  if (!event.choices) {
    const btn = makeBtn('続ける', 'choice-btn continue-btn');
    btn.addEventListener('click', () => {
      if (event.effects) applyEffects(event.effects);
      addLog('（続ける）');
      renderEvent(event.next);
    });
    choicesArea.appendChild(btn);
  } else {
    const visibleChoices = event.choices.filter(c =>
      !c.flagRequired || state.flags.includes(c.flagRequired)
    );
    visibleChoices.forEach((choice, i) => {
      const btn = makeBtn(choice.text, 'choice-btn fade-in');
      btn.style.animationDelay = `${i * 0.08}s`;
      btn.addEventListener('click', () => handleChoice(event, choice));
      choicesArea.appendChild(btn);
    });
  }
}

function resolveBranch(event) {
  const b = event.branch;
  let result = false;

  if (b.condition === 'groupVsTwoWorld') {
    result = (state.seeds.groupParticipation || 0) > (state.seeds.twoPersonWorld || 0);
  }

  renderEvent(result ? b.ifTrue : b.ifFalse);
}

function handleChoice(event, choice) {
  addLog(`[${event.month}] ${choice.text}`);

  if (choice.effects) applyEffects(choice.effects);

  if (choice.category) {
    const { result, text, bonusText } = rollNight(choice.category);
    renderNightResult(text, bonusText, result, choice.next);
    return;
  }

  renderEvent(choice.next);
}

function renderNightResult(text, bonusText, result, nextId) {
  const resultLabels = { good: '好調', normal: '', bad: '不調' };

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;

  let fullText = text;
  if (bonusText) fullText += '\n\n' + bonusText;
  textEl.textContent = fullText;
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  if (result !== 'normal') {
    document.getElementById('event-title').textContent = resultLabels[result];
  }

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';
  const btn = makeBtn('続ける', 'choice-btn continue-btn');
  btn.addEventListener('click', () => {
    addLog('（続ける）');
    renderEvent(nextId);
  });
  choicesArea.appendChild(btn);

  updateSidePanel();
}

function renderResult() {
  const { hasApproval, hasTogether, hasIndependence } = computeResultSeeds();

  // Background / header
  document.getElementById('background-area').className = 'bg-summer-sky';
  document.getElementById('month-label').textContent   = '7月';
  document.getElementById('event-title').textContent   = '夏の始まり';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  // Build result text
  let body = '7月。夏の入り口に、何かが生まれていた。\n\n';
  if (hasApproval && hasTogether) {
    body += '親友の中に、仲間への期待と、二人でいる安心が混ざり合っていた。';
  } else if (hasApproval && hasIndependence) {
    body += '背中を押した記憶と、見送った記憶が、親友の中で静かに揺れていた。';
  } else if (hasTogether && hasIndependence) {
    body += '一緒にいた時間と、一人で踏み出した時間が、両方、残っていた。';
  } else if (hasApproval) {
    body += '背中を押された記憶が、親友の中で何かの種になっていた。';
  } else if (hasTogether) {
    body += '一緒にいた時間が、二人の間に静かに根を張っていた。';
  } else if (hasIndependence) {
    body += '一人で踏み出した記憶が、親友の中で小さく光っていた。';
  } else {
    body += '何かが始まったのか、それとも何かが終わったのか、まだ分からなかった。';
  }
  body += '\n\n── 4月〜7月、ここまで。';

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;
  textEl.textContent = body;
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  // Show seeds in choice area
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const activeSeedKeys = Object.keys(state.seeds).filter(k => state.seeds[k] > 0);
  if (activeSeedKeys.length > 0) {
    const label = document.createElement('p');
    label.className = 'result-seeds-label';
    label.textContent = '生まれた種：';
    choicesArea.appendChild(label);

    activeSeedKeys.forEach(k => {
      const row = document.createElement('div');
      row.className = 'result-seed-row fade-in';
      row.textContent = `🌱 ${SEED_DISPLAY[k] || k}  ×${state.seeds[k]}`;
      choicesArea.appendChild(row);
    });
  }

  const note = document.createElement('p');
  note.className = 'end-note';
  note.textContent = '── プロトタイプ終了 ──';
  choicesArea.appendChild(note);

  updateSidePanel();
}

function makeBtn(text, className) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = text;
  return btn;
}

function addLog(text) {
  state.log.push(text);
  if (state.log.length > 30) state.log.shift();
}

// ── Side panel ──────────────────────────────────────────────

function updateSidePanel() {
  renderStatSection('protagonist-stats', ['intelligence', 'stamina', 'popularity', 'depth', 'condition']);
  renderStatSection('friend-stats', ['trust', 'friendDistance', 'friendAnxiety', 'friendIndependence']);
  renderSeeds();
  renderFlags();
  renderLog();
}

function renderStatSection(containerId, keys) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  keys.forEach(key => {
    const val = state.stats[key] || 0;
    el.appendChild(makeStatRow(key, val));
  });
}

function makeStatRow(key, val) {
  const row = document.createElement('div');
  row.className = 'stat-row';

  const label = document.createElement('span');
  label.className = 'stat-label';
  label.textContent = STAT_LABELS[key] || key;

  const bar = document.createElement('div');
  bar.className = 'stat-bar';
  const fill = document.createElement('div');
  fill.className = 'stat-bar-fill';
  fill.style.width   = `${Math.min(100, Math.max(0, (val / 14) * 100))}%`;
  fill.style.background = STAT_COLORS[key] || '#888';
  bar.appendChild(fill);

  const desc = document.createElement('span');
  desc.className = 'stat-desc';
  desc.textContent = getStatDesc(key, val);

  row.appendChild(label);
  row.appendChild(bar);
  row.appendChild(desc);
  return row;
}

function renderSeeds() {
  const el = document.getElementById('seeds-list');
  el.innerHTML = '';
  const active = Object.entries(state.seeds).filter(([, v]) => v > 0);
  if (!active.length) {
    el.innerHTML = '<p class="empty-note">まだ種はない</p>';
    return;
  }
  active.forEach(([key, val]) => {
    const item = document.createElement('div');
    item.className = 'seed-item';
    const name = document.createElement('span');
    name.className = 'seed-name';
    name.textContent = `🌱 ${SEED_DISPLAY[key] || key}`;
    const cnt = document.createElement('span');
    cnt.className = 'seed-count';
    cnt.textContent = `×${val}`;
    item.appendChild(name);
    item.appendChild(cnt);
    el.appendChild(item);
  });
}

function renderFlags() {
  const el = document.getElementById('flags-list');
  el.innerHTML = '';
  if (!state.flags.length) {
    el.innerHTML = '<p class="empty-note">まだフラグはない</p>';
    return;
  }
  state.flags.forEach(flag => {
    const item = document.createElement('div');
    item.className = 'flag-item';
    item.textContent = flag;
    el.appendChild(item);
  });
}

function renderLog() {
  const el = document.getElementById('log-list');
  el.innerHTML = '';
  if (!state.log.length) {
    el.innerHTML = '<p class="empty-note">ログなし</p>';
    return;
  }
  [...state.log].reverse().forEach(entry => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.textContent = entry;
    el.appendChild(item);
  });
}

// ── Panel toggle ────────────────────────────────────────────

function openPanel() {
  updateSidePanel();
  document.getElementById('side-panel').classList.remove('hidden');
  document.getElementById('panel-overlay').classList.remove('hidden');
}

function closePanel() {
  document.getElementById('side-panel').classList.add('hidden');
  document.getElementById('panel-overlay').classList.add('hidden');
}

document.getElementById('panel-toggle').addEventListener('click', openPanel);
document.getElementById('panel-close').addEventListener('click', closePanel);
document.getElementById('panel-overlay').addEventListener('click', closePanel);

// ── Start ───────────────────────────────────────────────────

renderEvent('name_input');
