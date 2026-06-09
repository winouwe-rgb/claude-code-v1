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
  playCount: 1,
  carryOverSeeds: {},
  unlockedTitles: ['recorder', 'navigator'], // テスト用：両称号デフォルトON
  debugMode: true, // テスト用：デフォルトON
  stats: {
    intelligence:      5,
    stamina:           5,
    popularity:        5,
    depth:             5,
    luck:              5,
    condition:         5,
    trust:             7,
    friendDistance:    5,
    friendAnxiety:     3,
    friendIndependence:3,
  },
  seeds: {},
  flags: ['崩壊の記憶'],
  clearedEndings: [],
  log:   [],
  ch2: {
    capital: 3,
    network: 3,
    risk: 1,
    stage: 1,
    friendPath: null,
  },
};

function hasTitle(id) {
  return state.unlockedTitles.includes(id);
}

function formatEffectHint(effects) {
  if (!effects) return '';
  const parts = [];
  const statMap = { intelligence:'知力', stamina:'体力', popularity:'人気', depth:'深み', luck:'運', condition:'調子', trust:'信頼', friendDistance:'距離', friendAnxiety:'不安', friendIndependence:'自立' };
  Object.entries(effects).forEach(([k, v]) => {
    if (k === 'seeds') {
      Object.entries(v).forEach(([sk, sv]) => parts.push(`🌱${SEED_DISPLAY[sk]||sk}+${sv}`));
    } else if (k === 'flags') {
      // フラグは表示しない
    } else if (statMap[k]) {
      parts.push(`${statMap[k]}${v > 0 ? '+' : ''}${v}`);
    }
  });
  return parts.join(' ');
}

function replaceName(text) {
  if (!text) return text;
  return text
    .replace(/\{player\}/g, state.playerName)
    .replace(/\{friend\}/g, state.friendName)
    .replace(/\{friendPronoun\}/g, state.friendPronoun);
}

function getConditionIcon() {
  const c = state.stats.condition || 0;
  if (c <= 2)  return '😴';
  if (c <= 4)  return '😔';
  if (c <= 6)  return '😐';
  if (c <= 9)  return '🙂';
  return '✨';
}

// ── Chapter 2 ────────────────────────────────────────────────

function applyC2Effects(effects) {
  if (!effects) return;
  if (effects.capital  !== undefined) state.ch2.capital  = Math.max(0, state.ch2.capital  + effects.capital);
  if (effects.network  !== undefined) state.ch2.network  = Math.max(0, state.ch2.network  + effects.network);
  if (effects.risk     !== undefined) state.ch2.risk     = Math.max(0, state.ch2.risk     + effects.risk);
}

function getC2ResourceLabel() {
  return `資金${state.ch2.capital} 組織力${state.ch2.network} 世評リスク${state.ch2.risk}`;
}

function determineFriendPath() {
  // 1章の種からワタの進路を決定
  const two   = state.seeds.twoPersonWorld     || 0;
  const group = state.seeds.groupParticipation || 0;
  const sci   = state.seeds.scienceTechnology  || 0;
  const prop  = state.seeds.prophecy           || 0;

  if (prop >= 2)   return 'prophet';    // 予言者・思想系
  if (sci >= 2)    return 'scientist';  // 科学・技術系
  if (two >= 3)    return 'hermit';     // 閉じたコミュニティ
  if (group >= 2)  return 'organizer';  // 集団・組織系
  return 'drifter';                     // 漂流・定まらない
}

function renderChapter2Event(eventId) {
  state.currentEventId = eventId;

  if (eventId === 'deep_current') {
    renderEvent('deep_current');
    return;
  }

  const event = CH2_EVENTS[eventId];
  if (!event) return;

  if (event.type === 'c2branch') {
    resolveC2Branch(event);
    return;
  }

  document.getElementById('background-area').className = `bg-${event.background || 'school-hallway'}`;
  document.getElementById('month-label').textContent  = event.month || '';
  document.getElementById('event-title').textContent  = event.title || '';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  // リソース表示
  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;

  let displayText = replaceName(event.text) || '';
  if (event.showResources) {
    displayText += `\n\n［ ${getC2ResourceLabel()} ］`;
  }
  textEl.textContent = displayText;
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  if (!event.choices) {
    const btn = makeBtn('続ける', 'choice-btn continue-btn');
    btn.addEventListener('click', () => {
      if (event.effects) applyC2Effects(event.effects);
      renderChapter2Event(event.next);
    });
    choicesArea.appendChild(btn);
  } else {
    event.choices.forEach((choice, i) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;';

      const btn = makeBtn(replaceName(choice.text), 'choice-btn fade-in');
      btn.style.animationDelay = `${i * 0.08}s`;
      btn.style.flex = '1';
      btn.addEventListener('click', () => {
        if (choice.effects) applyC2Effects(choice.effects);
        if (choice.also)    applyEffects(choice.also);
        addLog(`[2章] ${choice.text}`);
        renderChapter2Event(choice.next);
      });
      wrapper.appendChild(btn);

      if (state.debugMode && hasTitle('recorder') && choice.effects) {
        const hint = document.createElement('span');
        hint.className = 'debug-effect-hint';
        const parts = [];
        if (choice.effects.capital  !== undefined) parts.push(`資金${choice.effects.capital > 0 ? '+' : ''}${choice.effects.capital}`);
        if (choice.effects.network  !== undefined) parts.push(`組織${choice.effects.network > 0 ? '+' : ''}${choice.effects.network}`);
        if (choice.effects.risk     !== undefined) parts.push(`リスク${choice.effects.risk > 0 ? '+' : ''}${choice.effects.risk}`);
        hint.textContent = parts.join(' ');
        wrapper.appendChild(hint);
      }

      choicesArea.appendChild(wrapper);
    });
  }
}

function resolveC2Branch(event) {
  const path = state.ch2.friendPath || determineFriendPath();
  state.ch2.friendPath = path;
  const next = event.branch[path] || event.branch.default;
  renderChapter2Event(next);
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

// ── Deep Current ────────────────────────────────────────────

const SEED_CARRY_LIMIT = 3;

function renderDeepCurrent() {
  // クリア時の種を保存
  const endSeeds = Object.fromEntries(
    Object.entries(state.seeds).filter(([, v]) => v > 0)
  );

  document.getElementById('background-area').className = 'bg-deep-current';
  document.getElementById('month-label').textContent  = '';
  document.getElementById('event-title').textContent  = '深層海流';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;
  const introText = state.playCount === 1
    ? 'ここ、知ってる気がする。\nなぜかは分からない。でも、確かに。'
    : 'またここに来た。';
  textEl.textContent = introText;
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  // タブ表示
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  renderDeepTab('review', endSeeds, choicesArea);
}

function renderDeepTab(tab, endSeeds, choicesArea) {
  choicesArea.innerHTML = '';

  // タブボタン
  const tabRow = document.createElement('div');
  tabRow.className = 'deep-tab-row';
  [['review', '振り返り'], ['seeds', '種を選ぶ'], ['settings', '設定'], ['depart', '出発']].forEach(([id, label]) => {
    const btn = makeBtn(label, `deep-tab-btn${tab === id ? ' active' : ''}`);
    btn.addEventListener('click', () => renderDeepTab(id, endSeeds, choicesArea));
    tabRow.appendChild(btn);
  });
  choicesArea.appendChild(tabRow);

  if (tab === 'review') {
    renderDeepReview(endSeeds, choicesArea);
  } else if (tab === 'seeds') {
    renderDeepSeeds(endSeeds, choicesArea);
  } else if (tab === 'settings') {
    renderDeepSettings(endSeeds, choicesArea);
  } else if (tab === 'depart') {
    renderDeepDepart(endSeeds, choicesArea);
  }
}

function renderDeepReview(endSeeds, choicesArea) {
  const section = document.createElement('div');
  section.className = 'deep-section';

  const seedKeys = Object.keys(endSeeds);
  if (seedKeys.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'この人生で種は残らなかった。';
    section.appendChild(empty);
  } else {
    const label = document.createElement('p');
    label.className = 'result-seeds-label';
    label.textContent = 'この人生で残った種：';
    section.appendChild(label);
    seedKeys.forEach(k => {
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.textContent = `🌱 ${SEED_DISPLAY[k] || k}  ×${endSeeds[k]}`;
      section.appendChild(row);
    });
  }

  const playLabel = document.createElement('p');
  playLabel.className = 'empty-note';
  playLabel.style.marginTop = '10px';
  playLabel.textContent = `${state.playCount}周目の記録`;
  section.appendChild(playLabel);

  // 厳選フラグ
  const hitFlags = Object.entries(HIGHLIGHT_FLAGS)
    .filter(([flag]) => state.flags.includes(flag));
  if (hitFlags.length > 0) {
    const flagLabel = document.createElement('p');
    flagLabel.className = 'result-seeds-label';
    flagLabel.style.marginTop = '10px';
    flagLabel.textContent = 'この人生の記憶：';
    section.appendChild(flagLabel);
    hitFlags.forEach(([, text]) => {
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.textContent = `◆ ${text}`;
      section.appendChild(row);
    });
  }

  // この人生で得た称号
  const earnedTitles = TITLES.filter(t => state.clearedEndings.includes(t.id));
  if (earnedTitles.length > 0) {
    const titleLabel = document.createElement('p');
    titleLabel.className = 'result-seeds-label';
    titleLabel.style.marginTop = '10px';
    titleLabel.textContent = 'この人生で得た称号：';
    section.appendChild(titleLabel);

    earnedTitles.forEach(t => {
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.innerHTML = `<div>【${t.name}】</div><div style="font-size:0.75rem;color:var(--text-sub);margin-top:3px;">${t.desc}</div>`;
      section.appendChild(row);
    });
  }

  // 装備中の称号（unlockedTitles）
  const SPECIAL_TITLES = {
    navigator: { name: '航海者', desc: '深い海を知る者。章ごとに深層海流へ行ける。' },
    recorder:  { name: '記録者', desc: '因果を見通す眼を持つ。（特殊称号）' },
  };
  const equipped = state.unlockedTitles.filter(id => SPECIAL_TITLES[id]);
  if (equipped.length > 0) {
    const eqLabel = document.createElement('p');
    eqLabel.className = 'result-seeds-label';
    eqLabel.style.marginTop = '10px';
    eqLabel.textContent = '装備中の称号：';
    section.appendChild(eqLabel);

    equipped.forEach(id => {
      const t = SPECIAL_TITLES[id];
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.innerHTML = `<div>【${t.name}】</div><div style="font-size:0.75rem;color:var(--text-sub);margin-top:3px;">${t.desc}</div>`;
      section.appendChild(row);
    });
  }

  choicesArea.appendChild(section);
}

function renderDeepSeeds(endSeeds, choicesArea) {
  const section = document.createElement('div');
  section.className = 'deep-section';

  const label = document.createElement('p');
  label.className = 'result-seeds-label';
  label.textContent = `次の人生に持ち出す種（最大${SEED_CARRY_LIMIT}個）：`;
  section.appendChild(label);

  const selected = new Set(Object.keys(state.carryOverSeeds));
  const seedKeys = Object.keys(endSeeds);

  if (seedKeys.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = '持ち出せる種がない。';
    section.appendChild(empty);
  } else {
    seedKeys.forEach(k => {
      const row = document.createElement('div');
      row.className = `deep-seed-row${selected.has(k) ? ' selected' : ''}`;
      row.textContent = `${selected.has(k) ? '✓ ' : '　'}🌱 ${SEED_DISPLAY[k] || k}  ×${endSeeds[k]}`;
      row.addEventListener('click', () => {
        if (selected.has(k)) {
          selected.delete(k);
          delete state.carryOverSeeds[k];
        } else if (selected.size < SEED_CARRY_LIMIT) {
          selected.add(k);
          state.carryOverSeeds[k] = endSeeds[k];
        }
        renderDeepTab('seeds', endSeeds, choicesArea);
      });
      section.appendChild(row);
    });
  }

  const countLabel = document.createElement('p');
  countLabel.className = 'empty-note';
  countLabel.style.marginTop = '8px';
  countLabel.textContent = `選択中：${selected.size} / ${SEED_CARRY_LIMIT}`;
  section.appendChild(countLabel);

  choicesArea.appendChild(section);
}

function renderDeepSettings(endSeeds, choicesArea) {
  const section = document.createElement('div');
  section.className = 'deep-section';

  const label = document.createElement('p');
  label.className = 'result-seeds-label';
  label.textContent = '名前を変更する：';
  section.appendChild(label);

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

  const btn = makeBtn('変更する', 'choice-btn continue-btn');
  btn.style.marginTop = '8px';
  btn.addEventListener('click', () => {
    const p = playerInput.value.trim();
    const f = friendInput.value.trim();
    if (p) state.playerName = p;
    if (f) state.friendName = f;
    renderDeepTab('settings', endSeeds, choicesArea);
  });

  section.appendChild(playerRow);
  section.appendChild(friendRow);
  section.appendChild(btn);
  choicesArea.appendChild(section);
}

function renderDeepDepart(endSeeds, choicesArea) {
  const section = document.createElement('div');
  section.className = 'deep-section';

  const label = document.createElement('p');
  label.className = 'result-seeds-label';
  label.textContent = '次の人生へ出発する。';
  section.appendChild(label);

  if (Object.keys(state.carryOverSeeds).length > 0) {
    const seedLabel = document.createElement('p');
    seedLabel.className = 'empty-note';
    seedLabel.textContent = '持ち出す種：';
    section.appendChild(seedLabel);
    Object.keys(state.carryOverSeeds).forEach(k => {
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.textContent = `🌱 ${SEED_DISPLAY[k] || k}`;
      section.appendChild(row);
    });
  }

  const btn = makeBtn('出発する', 'choice-btn continue-btn');
  btn.style.marginTop = '12px';
  btn.addEventListener('click', () => {
    startNewLife();
  });
  section.appendChild(btn);
  choicesArea.appendChild(section);
}

function startNewLife() {
  const carry = { ...state.carryOverSeeds };
  const count = state.playCount + 1;
  const player = state.playerName;
  const friend = state.friendName;
  const cleared = [...state.clearedEndings];

  // stateリセット
  state.playCount = count;
  state.playerName = player;
  state.friendName = friend;
  state.friendPronoun = 'ぼく';
  state.carryOverSeeds = {};
  state.stats = {
    intelligence: 5, stamina: 5, popularity: 5,
    depth: 5, luck: 5, condition: 5,
    trust: 7, friendDistance: 5,
    friendAnxiety: 3, friendIndependence: 3,
  };
  state.seeds = { ...carry };
  state.flags = ['崩壊の記憶'];
  state.clearedEndings = cleared;
  state.log = [];

  renderEvent('prologue_start');
}

// ── Name input ──────────────────────────────────────────────

function renderNameInput() {
  document.getElementById('background-area').className = 'bg-deep-current';
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

// ── Title system ────────────────────────────────────────────

const TITLES = [
  {
    id: 'bystander',
    name: '傍観者',
    desc: 'いつも少し離れたところから見ていた。',
    detail: 'stance_watchフラグ ＋ 距離6以上',
    check: () =>
      state.flags.includes('stance_watch') &&
      (state.stats.friendDistance || 0) >= 6,
    progress: () => `距離：${state.stats.friendDistance||0}/6`,
  },
  {
    id: 'accomplice',
    name: '共犯者',
    desc: '親友の不安に、一緒に乗り続けた。',
    detail: '二人の世界×3以上 ＋ 不安5以上',
    check: () =>
      (state.seeds.twoPersonWorld || 0) >= 3 &&
      (state.stats.friendAnxiety || 0) >= 5,
    progress: () => `二人の世界：${state.seeds.twoPersonWorld||0}/3　不安：${state.stats.friendAnxiety||0}/5`,
  },
  {
    id: 'translator',
    name: '翻訳者',
    desc: '親友の不安を、現実の形に変えようとした。',
    detail: '科学技術×2以上 または 集団への希望×2以上',
    check: () =>
      (state.seeds.scienceTechnology || 0) >= 2 ||
      (state.seeds.groupHope || 0) >= 2,
    progress: () => `科学：${state.seeds.scienceTechnology||0}/2　希望：${state.seeds.groupHope||0}/2`,
  },
  {
    id: 'guardian',
    name: '保護者',
    desc: '親友をずっと守ろうとしていた。',
    detail: '信頼8以上 ＋ 不安4以下',
    check: () =>
      (state.stats.trust || 0) >= 8 &&
      (state.stats.friendAnxiety || 0) <= 4,
    progress: () => `信頼：${state.stats.trust||0}/8　不安：${state.stats.friendAnxiety||0}（4以下）`,
  },
  {
    id: 'liberator',
    name: '解放者',
    desc: '親友が自分の足で立てるよう、背中を押し続けた。',
    detail: '自立6以上 ＋ 親友自立の種×2以上',
    check: () =>
      (state.stats.friendIndependence || 0) >= 6 &&
      (state.seeds.friendIndependence || 0) >= 2,
    progress: () => `自立：${state.stats.friendIndependence||0}/6　種：${state.seeds.friendIndependence||0}/2`,
  },
];

function computeTitles() {
  return TITLES.filter(t => t.check());
}

// ── Chapter 1 End ────────────────────────────────────────────

const HIGHLIGHT_FLAGS = {
  '家のことを聞いた記憶': '家のことを少し聞いた',
  '一緒に休んだ記憶':     '一緒に休んだ日があった',
  '見送った記憶':         '黙って見送った',
  '部活に戻った記憶':     '部活に戻った',
};

function renderChapter1End() {
  document.getElementById('background-area').className = 'bg-summer-sky';
  document.getElementById('month-label').textContent  = '';
  document.getElementById('event-title').textContent  = '1章の終わり';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;
  textEl.textContent = '中学三年間が終わった。\nこの人生で、何が残ったか。';
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  // 厳選フラグ
  const hitFlags = Object.entries(HIGHLIGHT_FLAGS)
    .filter(([flag]) => state.flags.includes(flag));

  if (hitFlags.length > 0) {
    const flagLabel = document.createElement('p');
    flagLabel.className = 'result-seeds-label';
    flagLabel.textContent = 'この人生の記憶：';
    choicesArea.appendChild(flagLabel);

    hitFlags.forEach(([, text]) => {
      const row = document.createElement('div');
      row.className = 'result-seed-row fade-in';
      row.textContent = `◆ ${text}`;
      choicesArea.appendChild(row);
    });
  }

  // 残った種
  const activeSeeds = Object.entries(state.seeds).filter(([, v]) => v > 0);
  if (activeSeeds.length > 0) {
    const seedLabel = document.createElement('p');
    seedLabel.className = 'result-seeds-label';
    seedLabel.style.marginTop = '10px';
    seedLabel.textContent = '育った種：';
    choicesArea.appendChild(seedLabel);

    activeSeeds.forEach(([k, v]) => {
      const row = document.createElement('div');
      row.className = 'result-seed-row fade-in';
      row.textContent = `🌱 ${SEED_DISPLAY[k] || k}  ×${v}`;
      choicesArea.appendChild(row);
    });
  }

  const btn = makeBtn('深層海流へ', 'choice-btn continue-btn');
  btn.style.marginTop = '12px';
  btn.addEventListener('click', () => {
    // 称号をstateに保存
    const earned = computeTitles();
    earned.forEach(t => {
      if (!state.clearedEndings.includes(t.id)) {
        state.clearedEndings.push(t.id);
      }
    });
    renderEvent('deep_current');
  });

  // 称号表示
  const earned = computeTitles();
  if (earned.length > 0) {
    const titleLabel = document.createElement('p');
    titleLabel.className = 'result-seeds-label';
    titleLabel.style.marginTop = '10px';
    titleLabel.textContent = 'この人生の称号：';
    choicesArea.appendChild(titleLabel);

    earned.forEach(t => {
      const row = document.createElement('div');
      row.className = 'result-seed-row fade-in';
      row.textContent = `【${t.name}】${t.desc}`;
      choicesArea.appendChild(row);
    });
  }

  choicesArea.appendChild(btn);
}

// ── Rendering ───────────────────────────────────────────────

function renderEvent(eventId) {
  state.currentEventId = eventId;

  if (eventId === 'name_input') {
    renderNameInput();
    return;
  }

  if (eventId === 'deep_current') {
    renderDeepCurrent();
    return;
  }

  if (eventId === 'chapter1_end') {
    renderChapter1End();
    return;
  }

  if (eventId === 'chapter2_start') {
    state.ch2.friendPath = determineFriendPath();
    renderChapter2Event('c2_opening');
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
  const condIcon = (event.month || '').includes('夜') ? getConditionIcon() : '';
  document.getElementById('event-title').textContent  = condIcon ? `${condIcon} ${event.title || ''}` : (event.title || '');

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
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:0;';

      const btn = makeBtn(replaceName(choice.text), 'choice-btn fade-in');
      btn.style.animationDelay = `${i * 0.08}s`;
      btn.style.flex = '1';
      btn.addEventListener('click', () => handleChoice(event, choice));
      wrapper.appendChild(btn);

      if (state.debugMode && hasTitle('recorder') && choice.effects) {
        const hint = document.createElement('span');
        hint.className = 'debug-effect-hint';
        hint.textContent = formatEffectHint(choice.effects);
        wrapper.appendChild(hint);
      }

      choicesArea.appendChild(wrapper);
    });
  }
}

function resolveBranch(event) {
  const b = event.branch;
  let result = false;

  if (b.condition === 'groupVsTwoWorld') {
    result = (state.seeds.groupParticipation || 0) > (state.seeds.twoPersonWorld || 0);
    renderEvent(result ? b.ifTrue : b.ifFalse);
    return;
  }

  if (b.condition === 'dreamPattern') {
    const noMemory = !state.flags.includes('崩壊の記憶');
    const endings  = (state.clearedEndings || []).length;
    if (noMemory)       { renderEvent(b.ifClean); return; }
    if (endings >= 4)   { renderEvent(b.ifLate);  return; }
    if (endings >= 2)   { renderEvent(b.ifMid);   return; }
    renderEvent(b.ifEarly);
    return;
  }
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
  body += '\n\n── 1章前半、ここまで。';

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

  const continueBtn = makeBtn('夏へ', 'choice-btn continue-btn');
  continueBtn.addEventListener('click', () => {
    renderEvent('august_news');
  });
  choicesArea.appendChild(continueBtn);

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

// ── Skip panel ──────────────────────────────────────────────

const SKIP_TREE = [
  { label: 'プロローグ',   id: 'prologue_start' },
  { label: '4月：部活紹介', id: 'april_mid' },
  { label: '4月：帰り道',  id: 'april_night' },
  { label: '4月：夜',      id: 'april_night_own' },
  { label: '5月：ボール',  id: 'may_ball' },
  { label: '5月：夜',      id: 'may_night' },
  { label: '6月：早退',    id: 'june_family' },
  { label: '6月：夜',      id: 'june_night' },
  { label: '7月：一回だけ', id: 'july_try' },
  { label: '7月：夏の始まり', id: 'july_end' },
  { label: '8月：ニュース', id: 'august_news' },
  { label: '8月：夢（序盤）', id: 'august_dream_early' },
  { label: '8月：夢（中盤）', id: 'august_dream_mid' },
  { label: '8月：夢（終盤）', id: 'august_dream_late' },
  { label: '8月：夢（記憶なし）', id: 'august_dream_clean' },
  { label: '8月：夜',      id: 'august_night' },
  { label: '9月',          id: 'september_start' },
  { label: '2年秋：新学期', id: 'autumn_class' },
  { label: '2年秋：夜',    id: 'autumn_night' },
  { label: '3年春：進路',  id: 'grade3_start' },
  { label: '3年春：夜',    id: 'grade3_night' },
  { label: '3年夏：図書館', id: 'summer3_study' },
  { label: '3年夏：夜',    id: 'summer3_night' },
  { label: '卒業',         id: 'graduation' },
  { label: '卒業の夜',     id: 'graduation_night' },
  { label: '1章終わり',    id: 'chapter1_end' },
  { label: '深層海流',     id: 'deep_current' },
  { label: '2章：冒頭',   id: 'chapter2_start' },
  { label: '2章：S1応答', id: 'c2_s1_player_response' },
  { label: '2章：S1終わり', id: 'c2_s1_end' },
];

function openSkipPanel() {
  const overlay = document.getElementById('panel-overlay');
  const panel   = document.createElement('div');
  panel.id = 'skip-panel';

  const header = document.createElement('div');
  header.className = 'skip-panel-header';
  const title = document.createElement('span');
  title.textContent = 'スキップ';
  title.style.cssText = 'font-size:0.85rem;color:var(--accent);font-weight:bold;';
  const closeBtn = makeBtn('✕', '');
  closeBtn.style.cssText = 'background:none;border:none;color:var(--text-sub);font-size:1.1rem;cursor:pointer;';
  closeBtn.addEventListener('click', closeSkipPanel);
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  const list = document.createElement('div');
  list.style.cssText = 'overflow-y:auto;flex:1;padding:8px 14px 20px;';
  SKIP_TREE.forEach(item => {
    const btn = makeBtn(item.label, 'choice-btn');
    btn.style.cssText = 'margin-bottom:5px;font-size:0.82rem;';
    btn.addEventListener('click', () => {
      closeSkipPanel();
      renderEvent(item.id);
    });
    list.appendChild(btn);
  });
  panel.appendChild(list);

  document.getElementById('app').appendChild(panel);
  overlay.classList.remove('hidden');
  overlay.onclick = closeSkipPanel;
}

function closeSkipPanel() {
  const panel = document.getElementById('skip-panel');
  if (panel) panel.remove();
  document.getElementById('panel-overlay').classList.add('hidden');
  document.getElementById('panel-overlay').onclick = null;
}

document.getElementById('skip-toggle').addEventListener('click', openSkipPanel);

// ── Debug panel ─────────────────────────────────────────────

function openDebugPanel() {
  if (!hasTitle('recorder')) return;

  const overlay = document.getElementById('panel-overlay');
  const panel   = document.createElement('div');
  panel.id = 'debug-panel';
  panel.style.cssText = `
    position:fixed;top:0;left:0;width:min(340px,92vw);height:100dvh;
    background:var(--panel-bg);border-right:1px solid rgba(255,255,255,0.08);
    z-index:100;display:flex;flex-direction:column;overflow-y:auto;
    padding:12px 14px 20px;
  `;

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;';
  const title = document.createElement('span');
  title.textContent = '🔍 記録者の眼';
  title.style.cssText = 'font-size:0.85rem;color:var(--accent);font-weight:bold;';
  const closeBtn = makeBtn('✕', '');
  closeBtn.style.cssText = 'background:none;border:none;color:var(--text-sub);font-size:1.1rem;cursor:pointer;';
  closeBtn.addEventListener('click', closeDebugPanel);
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // 選択肢効果表示のON/OFF
  const toggleRow = document.createElement('div');
  toggleRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:12px;';
  const toggleLabel = document.createElement('span');
  toggleLabel.style.cssText = 'font-size:0.78rem;color:var(--text-sub);';
  toggleLabel.textContent = '選択肢効果表示';
  const toggleBtn = makeBtn(state.debugMode ? 'ON' : 'OFF', 'choice-btn');
  toggleBtn.style.cssText = `padding:4px 12px;font-size:0.75rem;background:${state.debugMode ? 'var(--accent-dim)' : 'rgba(255,255,255,0.06)'};`;
  toggleBtn.addEventListener('click', () => {
    state.debugMode = !state.debugMode;
    closeDebugPanel();
    openDebugPanel();
    renderEvent(state.currentEventId);
  });
  toggleRow.appendChild(toggleLabel);
  toggleRow.appendChild(toggleBtn);
  panel.appendChild(toggleRow);

  // 称号条件
  const titleHeader = document.createElement('p');
  titleHeader.className = 'result-seeds-label';
  titleHeader.textContent = '称号の条件：';
  panel.appendChild(titleHeader);

  TITLES.forEach(t => {
    const row = document.createElement('div');
    row.className = 'result-seed-row';
    row.style.marginBottom = '5px';
    const achieved = t.check();
    row.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="opacity:${achieved ? 1 : 0.6}">${achieved ? '✓' : '　'}【${t.name}】</span>
    </div>
    <div style="font-size:0.7rem;color:var(--text-sub);margin-top:2px;">${t.detail}</div>
    <div style="font-size:0.7rem;color:var(--accent);margin-top:2px;">${t.progress()}</div>`;
    panel.appendChild(row);
  });

  // 現在のイベントのeffects
  const eventHeader = document.createElement('p');
  eventHeader.className = 'result-seeds-label';
  eventHeader.style.marginTop = '14px';
  eventHeader.textContent = '現在の選択肢効果：';
  panel.appendChild(eventHeader);

  const currentEvent = EVENTS[state.currentEventId];
  if (currentEvent && currentEvent.choices) {
    currentEvent.choices.forEach(c => {
      const row = document.createElement('div');
      row.className = 'result-seed-row';
      row.style.marginBottom = '5px';
      row.style.fontSize = '0.75rem';
      const effectText = c.effects ? formatEffectHint(c.effects) : 'なし';
      row.textContent = `「${replaceName(c.text)}」→ ${effectText || 'なし'}`;
      panel.appendChild(row);
    });
  } else {
    const empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = '選択肢なし';
    panel.appendChild(empty);
  }

  document.getElementById('app').appendChild(panel);
  overlay.classList.remove('hidden');
  overlay.onclick = closeDebugPanel;
}

function closeDebugPanel() {
  const panel = document.getElementById('debug-panel');
  if (panel) panel.remove();
  document.getElementById('panel-overlay').classList.add('hidden');
  document.getElementById('panel-overlay').onclick = null;
}

document.getElementById('debug-toggle').addEventListener('click', openDebugPanel);
document.getElementById('deep-toggle').addEventListener('click', () => renderEvent('deep_current'));

// ── Start ───────────────────────────────────────────────────

renderEvent('name_input');
