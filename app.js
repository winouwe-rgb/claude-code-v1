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
  leadership:         'リーダーの種',
  memoryBait:         '記憶の撒き餌',
  lurebait:           '光る仕掛け',
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
    // 1周目専用
    money: 0,            // 稼いだお金（行動の選択肢を広げる）
    knowledge: 0,        // 勉強で得た知識（選択肢を広げる）
    actionsLeft: 3,      // 紙飛行機ターンの残り行動回数
    helpedSpeech: false, // 街頭演説を手伝ったか（3章キーホルダー連動の太い線）
    boughtBoat: false,   // ミナトがボートを買ってあげたか（軽い色付け）
    r1stage: 1,          // 1周目2章のステージ（1/2/final）
  },
  ch3: {
    phase: 'survival',
    // 1周目サバイバル専用リソース
    food: 0,             // 食料（その日採れた貝＝その日の消費）
    water: 1,            // 水（初期1、ボトル数で上限が変わる）
    waterMax: 2,         // 水の上限（ボトル数で変わる：2人→2、3人→4）
    bottles: 1,          // 空のボトル数（水を貯める容器）
    safety: 2,           // 安全（洞窟の状態、板切れで上がる）
    clams: 0,            // 貝の在庫（餌として使う数）
    clamMax: 10,         // 貝の上限（採取限界。下がっていく）
    bait: 0,             // 餌の総数（貝＋内臓）
    hasRod: false,       // 釣竿があるか
    isoraArrived: false, // イソラが漂着したか
    driftwood: 0,        // 漂着した板切れの数
    // 2周目以降共通リソース
    wataMood: 5,
    distance: 5,
    trust: 5,
    anxiety: 4,
    resource: 0,
    drive: 0,
    margin: 0,
    capital: 0,
    diplomacy: 0,
    record: 0,
    crew: [],
    turnCount: 0,
    devTurns: 0,
    assignment: {},
  },
};

// ── クルー定義 ────────────────────────────────────────────────
// ステータスはランク制（S>A>B>C>D）。RANK_VALで数値化。
const RANK_VAL = { S: 5, A: 4, B: 3, C: 2, D: 1 };

// 全クルーのマスターデータ
const CREW_MASTER = {
  minato: {
    name: '{player}', body: 'C', tech: 'B', wisdom: 'B', charm: 'B',
    special: null, desc: 'あなた自身。',
  },
  angler: {
    name: '釣りの人', body: 'B', tech: 'C', wisdom: 'C', charm: 'B',
    special: 'food', desc: '海から食料を獲るのが得意。',
  },
  survivalist: {
    name: 'サバイバルの達人', body: 'A', tech: 'B', wisdom: 'C', charm: 'B',
    special: 'survival', desc: '食料・水・住居を一人で確保できる。',
  },
  diver: {
    name: '潜りの人', body: 'A', tech: 'C', wisdom: 'C', charm: 'C',
    special: 'dive', desc: '海中から物を拾ってくる。',
  },
};

// 周回・状況に応じて初期クルーを構築
function buildInitialCrew() {
  const crew = ['minato', 'angler'];
  if (state.playCount >= 2) crew.push('survivalist');
  if (state.playCount >= 2) crew.push('diver'); // 1周目はダイバー不要
  return crew;
}

function crewStat(crewId, stat) {
  const c = CREW_MASTER[crewId];
  if (!c) return 0;
  return RANK_VAL[c[stat]] || 0;
}

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

  if (eventId === 'chapter3_start') {
    renderEvent('chapter3_start');
    return;
  }

  if (eventId === 'c2r1_action_turn') {
    renderC2R1ActionTurn();
    return;
  }

  // 街頭演説を手伝ったフラグ（3章キーホルダー連動の太い線）
  if (eventId === 'c2r1_speech_help') {
    state.ch2.helpedSpeech = true;
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

// ── 1周目 2章の行動ターン（紙飛行機ターン） ────────────────────
// ステージごとに行動の選択肢が変わる。お金・知識で選択肢が増える。
// 行動するたびに actionsLeft が減り、0になると次のイベントへ。

const C2R1_ACTIONS = {
  // ステージ1：大学生編
  1: [
    { id: 'play',   label: '遊ぶ',   desc: '気晴らしに出かける。', effects: { money: -1 }, result: '友人と遊んで気が紛れた。' },
    { id: 'study',  label: '勉強する', desc: '将来のために学ぶ。', effects: { knowledge: 1 }, result: '少しだけ知識が増えた。' },
    { id: 'parttime', label: 'バイトする', desc: 'お金を稼ぐ。', effects: { money: 2 }, result: 'バイト代が入った。' },
    { id: 'search', label: 'ワタを検索する', desc: 'ふと気になって調べる。', once: true,
      effects: {}, result: '', special: 'find_stream' },
  ],
  // ステージ2：社会人編
  2: [
    { id: 'work',   label: '仕事する', desc: 'お金を稼ぐ。', effects: { money: 3 }, result: '給料が入った。' },
    { id: 'comment', label: '動画に擁護コメントを残す', desc: 'ワタを庇いたくなる。', effects: {}, result: '', special: 'flame_war' },
    { id: 'study2', label: '情報を集める', desc: '世界の状況を調べる。', effects: { knowledge: 1 }, result: '知識が増えた。' },
    { id: 'buyboat', label: 'ボートを買ってあげる', desc: 'お金がいる。', cost: 10, once: true,
      effects: {}, result: '', special: 'buy_boat' },
  ],
};

function getC2R1StageLabel() {
  if (state.ch2.r1stage === 1) return '大学生編';
  if (state.ch2.r1stage === 2) return '社会人編';
  return '';
}

function renderC2R1ActionTurn() {
  const c = state.ch2;
  const stage = c.r1stage;

  document.getElementById('background-area').className = 'bg-night-room';
  document.getElementById('month-label').textContent = `${getC2R1StageLabel()}・残り${c.actionsLeft}回`;
  document.getElementById('event-title').textContent = 'どう過ごす';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  textEl.textContent = `紙飛行機が落ちるまでの間、何をするか。\n\n［ お金${c.money}　知識${c.knowledge} ］`;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const actions = C2R1_ACTIONS[stage] || [];
  actions.forEach(action => {
    // 一度きりの行動が使用済みなら出さない
    if (action.once && c[`used_${action.id}`]) return;
    // コストが足りないなら無効表示
    const tooExpensive = action.cost && c.money < action.cost;

    const btn = document.createElement('button');
    btn.style.cssText = `width:100%;padding:9px 12px;margin-bottom:5px;background:${tooExpensive ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)'};border:1px solid rgba(255,255,255,${tooExpensive ? '0.08' : '0.2'});border-radius:7px;color:${tooExpensive ? 'rgba(255,255,255,0.3)' : 'var(--text-main)'};font-size:0.85rem;font-family:inherit;text-align:left;cursor:${tooExpensive ? 'default' : 'pointer'};`;
    const costLabel = action.cost ? `（お金${action.cost}必要）` : '';
    btn.innerHTML = `${action.label}${costLabel}<span style="font-size:0.72rem;color:var(--text-sub);display:block;margin-top:2px;">${action.desc}</span>`;

    if (!tooExpensive) {
      btn.addEventListener('click', () => executeC2R1Action(action));
    }
    choicesArea.appendChild(btn);
  });
}

function executeC2R1Action(action) {
  const c = state.ch2;

  // 特殊イベントは専用処理へ
  if (action.special === 'find_stream') {
    c.used_search = true;
    renderChapter2Event('c2r1_find_stream');
    return;
  }
  if (action.special === 'flame_war') {
    renderChapter2Event('c2r1_flame_war');
    c.actionsLeft--;
    return;
  }
  if (action.special === 'buy_boat') {
    c.used_buyboat = true;
    c.money -= action.cost;
    c.boughtBoat = true;
    renderChapter2Event('c2r1_buy_boat');
    return;
  }

  // 通常行動：効果を適用
  if (action.effects) {
    Object.entries(action.effects).forEach(([k, v]) => {
      c[k] = Math.max(0, (c[k] || 0) + v);
    });
  }
  if (action.once) c[`used_${action.id}`] = true;

  c.actionsLeft--;

  // 結果を一瞬見せてから次へ
  renderC2R1ActionResult(action.result);
}

function renderC2R1ActionResult(resultText) {
  const c = state.ch2;
  document.getElementById('background-area').className = 'bg-night-room';
  document.getElementById('month-label').textContent = `${getC2R1StageLabel()}・残り${c.actionsLeft}回`;
  document.getElementById('event-title').textContent = '';
  document.getElementById('speaker-area').style.visibility = 'hidden';
  document.getElementById('event-text').textContent = `${resultText}\n\n［ お金${c.money}　知識${c.knowledge} ］`;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const btn = makeBtn('続ける', 'choice-btn continue-btn');
  btn.addEventListener('click', () => {
    if (c.actionsLeft <= 0) {
      // 行動回数が尽きたらステージの締めイベントへ
      if (c.r1stage === 1) {
        renderChapter2Event('c2r1_s1_end');
      } else if (c.r1stage === 2) {
        renderChapter2Event('c2r1_s2_speech');
      }
    } else {
      renderC2R1ActionTurn();
    }
  });
  choicesArea.appendChild(btn);
}

// ── Chapter 3 ────────────────────────────────────────────────

function applyC3Effects(effects) {
  if (!effects) return;
  const c = state.ch3;
  const keys = ['wataMood','distance','food','water','safety','trust','anxiety','resource','drive','margin','capital','diplomacy','record'];
  keys.forEach(k => {
    if (effects[k] !== undefined) c[k] = Math.max(0, c[k] + effects[k]);
  });
}

function getC3ResourceLabel() {
  const c = state.ch3;
  if (c.phase === 'survival') {
    return `食料${c.food} 水${c.water} 安全${c.safety} 信頼${c.trust} 不安${c.anxiety} 貝${c.clams}`;
  }
  if (c.phase === 'stability') {
    return `食料${c.food} 水${c.water} 安全${c.safety} 信頼${c.trust} 不安${c.anxiety}\n資源${c.resource} 実行力${c.drive} 余白${c.margin}`;
  }
  return `資金${c.capital} 外交${c.diplomacy} 記録${c.record} 余白${c.margin} 不安${c.anxiety}`;
}

function getC3PhaseLabel() {
  const c = state.ch3;
  if (c.phase === 'survival')     return 'サバイバル';
  if (c.phase === 'stability')    return '安定';
  return '発展';
}

function renderChapter3Event(eventId) {
  state.currentEventId = eventId;

  if (eventId === 'deep_current') {
    renderEvent('deep_current');
    return;
  }

  if (eventId === 'action_turn') {
    if (state.playCount === 1) {
      renderR1ActionTurn();
    } else {
      renderActionTurn();
    }
    return;
  }

  // イソラ帰還時に貝を餌に変換＋イソラの空ボトルを1本追加
  if (eventId === 'c3_isora_arrives') {
    state.ch3.bait = (state.ch3.bait || 0) + (state.ch3.clams || 0);
    state.ch3.clams = 0;
    state.ch3.bottles = (state.ch3.bottles || 0) + 1;
    state.ch3.waterMax = Math.min(4, state.ch3.bottles * 2);
  }

  // 疑似餌で餌が無限になる
  if (eventId === 'c3_set_lure_infinite') {
    state.ch3.baitInfinite = true;
  }

  const event = CH3_EVENTS[eventId];
  if (!event) return;

  // フラグ分岐（2章の選択が3章に効く）
  if (event.type === 'c3flag_branch') {
    const flagVal = state.ch2[event.flag];
    renderChapter3Event(flagVal ? event.ifTrue : event.ifFalse);
    return;
  }

  if (event.type === 'c3branch') {
    resolveC3Branch(event);
    return;
  }

  // フェーズ移行
  if (event.setPhase) {
    state.ch3.phase = event.setPhase;
  }

  document.getElementById('background-area').className = `bg-${event.background || 'rainy-evening'}`;
  document.getElementById('month-label').textContent  = event.month || getC3PhaseLabel();
  document.getElementById('event-title').textContent  = event.title || '';

  const speakerArea = document.getElementById('speaker-area');
  const speakerName = document.getElementById('speaker-name');
  if (event.speaker) {
    speakerName.textContent = replaceName(event.speaker);
    speakerArea.style.visibility = 'visible';
  } else {
    speakerArea.style.visibility = 'hidden';
  }

  const textEl = document.getElementById('event-text');
  textEl.classList.remove('fade-in');
  void textEl.offsetWidth;

  let displayText = replaceName(event.text) || '';
  if (event.showResources) {
    displayText += `\n\n［ ${getC3ResourceLabel()} ］`;
  }
  textEl.textContent = displayText;
  textEl.classList.add('fade-in');
  document.getElementById('text-area').scrollTop = 0;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  if (!event.choices) {
    const btn = makeBtn('続ける', 'choice-btn continue-btn');
    btn.addEventListener('click', () => {
      if (event.effects) applyC3Effects(event.effects);
      renderChapter3Event(event.next);
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
        if (choice.effects) applyC3Effects(choice.effects);
        if (choice.also)    applyEffects(choice.also);
        addLog(`[3章] ${choice.text}`);
        renderChapter3Event(choice.next);
      });
      wrapper.appendChild(btn);

      if (state.debugMode && hasTitle('recorder') && choice.effects) {
        const hint = document.createElement('span');
        hint.className = 'debug-effect-hint';
        hint.textContent = formatC3EffectHint(choice.effects);
        wrapper.appendChild(hint);
      }

      choicesArea.appendChild(wrapper);
    });
  }
}

function formatC3EffectHint(effects) {
  if (!effects) return '';
  const labelMap = { wataMood:'調子', distance:'距離', food:'食料', water:'水', safety:'安全', trust:'信頼', anxiety:'不安', resource:'資源', drive:'実行力', margin:'余白', capital:'資金', diplomacy:'外交', record:'記録' };
  const parts = [];
  Object.entries(effects).forEach(([k, v]) => {
    if (labelMap[k]) parts.push(`${labelMap[k]}${v > 0 ? '+' : ''}${v}`);
  });
  return parts.join(' ');
}

function resolveC3Branch(event) {
  const path = state.ch2.friendPath || determineFriendPath();
  const next = event.branch[path] || event.branch.default;
  renderChapter3Event(next);
}

// ── Chapter 3 行動ターン ──────────────────────────────────────
// 問題ボックスにクルーを配置して実行。成果はクルーのステータスで変動。

// フェーズごとの問題ボックス定義（2周目以降）
const C3_PROBLEMS = {
  survival: [
    { id: 'water',  label: '水を集める',     stat: 'body',   effects: { water: 1 },
      desc: '雨水・露を集める。' },
    { id: 'clam',   label: '貝を採取する',   stat: 'body',   effects: { clams: 2 },
      desc: '岩礁の貝を拾う。採り続けると枯渇する。', requireClams: false },
    { id: 'fish',   label: '貝を餌に釣りをする', stat: 'body', effects: { food: 2 },
      desc: '貝を消費して魚を釣る。貝がないと実行できない。', requireClams: true },
    { id: 'safety', label: '安全な場所を整える', stat: 'tech', effects: { safety: 1 },
      desc: '波や風から身を守る場所を作る。' },
    { id: 'care',   label: 'ワタに寄り添う',  stat: 'charm', effects: { trust: 1, anxiety: -1, distance: -1 },
      desc: '不安が高まるワタの話を聞く。' },
  ],
  stability: [
    { id: 'build',  label: '住居・倉庫を作る', stat: 'tech',  effects: { resource: 1, margin: 1 } },
    { id: 'supply', label: '食料と水を安定させる', stat: 'body', effects: { food: 1, water: 1 } },
    { id: 'order',  label: '決まりごとを整える', stat: 'wisdom', effects: { drive: 1, trust: 1 } },
    { id: 'care',   label: 'ワタに寄り添う',   stat: 'charm',  effects: { trust: 1, anxiety: -1 } },
  ],
  development: [
    { id: 'trade',  label: '外の島とつながる', stat: 'charm',  effects: { diplomacy: 1 } },
    { id: 'fund',   label: '暮らしを富ませる', stat: 'tech',   effects: { capital: 1 } },
    { id: 'record', label: '記録を残す',       stat: 'wisdom', effects: { record: 1, margin: 1 } },
    { id: 'care',   label: 'ワタに寄り添う',   stat: 'charm',  effects: { trust: 1, anxiety: -1 } },
  ],
};

// ── 1周目専用行動ターン ──────────────────────────────────────

function getR1ResourceLabel() {
  const c = state.ch3;
  let baitLabel = '';
  if (c.isoraArrived) {
    baitLabel = c.baitInfinite ? ' 餌∞' : ` 餌${c.bait}`;
  }
  return `食料${c.food} 水${c.water}/${c.waterMax} 安全${c.safety}${baitLabel}`;
}

function renderR1ActionTurn() {
  const c = state.ch3;
  if (!c.assignment) c.assignment = {};

  // ワタを貝採取に固定
  if (!c.assignment['clam_r1']) c.assignment['clam_r1'] = [];
  if (!c.assignment['clam_r1'].includes('wata')) {
    c.assignment['clam_r1'].push('wata');
  }

  document.getElementById('background-area').className = 'bg-rainy-evening';
  document.getElementById('month-label').textContent = `サバイバル・${c.turnCount + 1}日目`;
  document.getElementById('event-title').textContent = '今日どうする';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  textEl.textContent = `今日の行動を決める。\n\n［ ${getR1ResourceLabel()} ］${c.driftwood > 0 ? `　板切れ${c.driftwood}枚` : ''}`;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  // ミナトの行動
  const minatoLabel = document.createElement('p');
  minatoLabel.className = 'result-seeds-label';
  minatoLabel.textContent = `${replaceName('{player}')}の行動：`;
  choicesArea.appendChild(minatoLabel);

  const minatoActions = [
    { id: 'water_search', label: '水を探す',       desc: '水源を探す。岩礁では見つからない。' },
    { id: 'drift_search', label: '漂着物を探す',   desc: '板切れや空のボトルが見つかるかも。' },
    { id: 'safety_work',  label: '安全な場所を整える', desc: '洞窟の窪みを整える。板切れがあると効果的。' },
  ];

  // イソラが来てから餌の準備ができる
  if (c.isoraArrived && !c.baitInfinite) {
    minatoActions.push({ id: 'bait_prep', label: '餌の準備をする', desc: 'イソラの釣りを手伝う。' });
  }

  minatoActions.forEach(action => {
    const selected = c.assignment['minato'] === action.id;
    const btn = document.createElement('button');
    btn.style.cssText = `width:100%;padding:8px 12px;margin-bottom:4px;background:${selected ? 'var(--accent-dim)' : 'rgba(255,255,255,0.07)'};border:1px solid ${selected ? 'rgba(232,168,124,0.5)' : 'rgba(255,255,255,0.2)'};border-radius:7px;color:${selected ? 'var(--accent)' : 'var(--text-main)'};font-size:0.82rem;font-family:inherit;text-align:left;cursor:pointer;`;
    btn.innerHTML = `${action.label}<span style="font-size:0.7rem;color:var(--text-sub);display:block;margin-top:2px;">${action.desc}</span>`;
    btn.addEventListener('click', () => {
      c.assignment['minato'] = action.id;
      renderR1ActionTurn();
    });
    choicesArea.appendChild(btn);
  });

  // ワタの行動（固定・赤）
  const wataLabel = document.createElement('p');
  wataLabel.className = 'result-seeds-label';
  wataLabel.style.marginTop = '8px';
  wataLabel.textContent = `${replaceName('{friend}')}の行動：`;
  choicesArea.appendChild(wataLabel);

  const wataBox = document.createElement('div');
  wataBox.style.cssText = 'padding:8px 12px;background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.3);border-radius:7px;margin-bottom:6px;';
  const clamStatus = c.clamMax <= 0 ? '（貝が尽きた）' : `（残り約${c.clamMax}個）`;
  wataBox.innerHTML = `<span style="font-size:0.82rem;color:#ff8080;">貝を採取する ${clamStatus}</span>`;
  choicesArea.appendChild(wataBox);

  // イソラの行動（帰還後のみ表示）
  if (c.isoraArrived) {
    const isoraLabel = document.createElement('p');
    isoraLabel.className = 'result-seeds-label';
    isoraLabel.textContent = 'イソラの行動：';
    choicesArea.appendChild(isoraLabel);

    const isoraBox = document.createElement('div');
    isoraBox.style.cssText = 'padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:7px;margin-bottom:8px;';
    const canFish = c.baitInfinite || c.bait > 0;
    isoraBox.innerHTML = `<span style="font-size:0.82rem;color:var(--text-main);">${canFish ? '釣りをする' : '釣りができない（餌がない）'}</span>`;
    choicesArea.appendChild(isoraBox);
  }

  const execBtn = makeBtn('この行動で1日進める', 'choice-btn continue-btn');
  execBtn.addEventListener('click', executeR1ActionTurn);
  choicesArea.appendChild(execBtn);
}

function executeR1ActionTurn() {
  const c = state.ch3;
  const resultLines = [];
  const eventLines = [];

  // ── ワタの行動：貝を採取（食料またはイソラ後は餌に） ──
  if (c.clamMax > 0) {
    const clamGain = Math.floor(Math.random() * 3) + 1;
    const actual = Math.min(clamGain, c.clamMax);
    c.clamMax = Math.max(0, c.clamMax - actual);
    if (!c.isoraArrived) {
      c.food += actual;
      resultLines.push(`${replaceName('{friend}')}が貝を${actual}個採って食べた（残り約${c.clamMax}個）`);
    } else {
      c.bait += actual;
      resultLines.push(`${replaceName('{friend}')}が貝を${actual}個採って餌にした（残り約${c.clamMax}個）`);
    }
  } else {
    resultLines.push(`${replaceName('{friend}')}が探したが、貝はもうなかった`);
  }

  // ── ミナトの行動 ──
  const minatoAction = c.assignment['minato'];
  if (minatoAction === 'water_search') {
    resultLines.push(`${replaceName('{player}')}が水を探したが、岩礁では見つからなかった`);
  } else if (minatoAction === 'drift_search') {
    const r = Math.random();
    if (r < 0.30) {
      c.driftwood++;
      resultLines.push(`${replaceName('{player}')}が板切れを見つけた（板切れ：${c.driftwood}枚）`);
    } else if (r < 0.45) {
      c.bottles++;
      c.waterMax = Math.min(4, c.bottles * 2);
      resultLines.push(`${replaceName('{player}')}が空のボトルを見つけた（ボトル${c.bottles}本・水上限${c.waterMax}）`);
    } else {
      const msgs = ['何も流れ着いていなかった', '船の影も見えなかった', '波の音だけが続いていた'];
      resultLines.push(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  } else if (minatoAction === 'safety_work') {
    if (c.driftwood > 0) {
      c.driftwood--;
      c.safety = Math.min(5, c.safety + 2);
      resultLines.push(`${replaceName('{player}')}が板切れで洞窟を整えた（安全+2）`);
    } else {
      c.safety = Math.min(5, c.safety + 1);
      resultLines.push(`${replaceName('{player}')}が洞窟を整えた（安全+1）`);
    }
  } else if (minatoAction === 'bait_prep') {
    resultLines.push(`${replaceName('{player}')}がイソラの釣りを手伝った`);
  }

  // ── イソラの行動：釣り（戻っていれば） ──
  if (c.isoraArrived) {
    const canFish = c.baitInfinite || c.bait > 0;
    if (canFish) {
      if (!c.baitInfinite) c.bait = Math.max(0, c.bait - 1);
      const caught = Math.random() < 0.55;
      if (caught) {
        const fishAmount = Math.floor(Math.random() * 2) + 1;
        c.food += fishAmount;
        resultLines.push(`イソラが魚を${fishAmount}匹釣った`);
      } else {
        resultLines.push(`イソラが釣りをしたが、今日は釣れなかった`);
      }
    } else {
      resultLines.push(`イソラが釣りをしようとしたが、餌がなかった`);
    }
  }

  // ── 消費 ──
  const people = c.isoraArrived ? 3 : 2;
  c.food = Math.max(0, c.food - people);
  const prevWater = c.water;
  c.water = Math.max(0, c.water - (people === 2 ? 1 : 2));
  if (c.water === 0 && prevWater > 0) {
    eventLines.push('水が尽きた。空のボトルが残った。');
  }

  // ── 雨判定（1周目は水枯渇エンドがないよう救済） ──
  // 水残1：40% / 水0（初日）：70% / 赤0（水0で1日経過）：100%
  let rainChance = 0.20;
  if (c.water === 1) {
    rainChance = 0.40;
  } else if (c.water === 0 && c.waterDanger === 0) {
    rainChance = 0.70;
  } else if (c.water === 0 && c.waterDanger >= 1) {
    rainChance = 1.0; // 赤0：必ず雨
  }

  if (Math.random() < rainChance && c.waterMax - c.water > 0) {
    const waterGain = Math.min(2, c.waterMax - c.water);
    c.water += waterGain;
    eventLines.push(`雨が降った。ボトルに水を貯めた（水+${waterGain}）`);
    c.waterDanger = 0;
  } else {
    // 雨が降らなかった→水0なら危険度を進める
    if (c.water <= 0) c.waterDanger = (c.waterDanger || 0) + 1;
  }

  c.turnCount++;
  c.assignment = { 'clam_r1': ['wata'] };

  // ── イソラ帰還チェック（3〜5ターン目） ──
  if (!c.isoraArrived && c.turnCount >= 3 && Math.random() < 0.5) {
    c.isoraArrived = true;
    // 貝→餌の変換・空ボトル追加・waterMax更新は c3_isora_arrives イベントで実行
    renderR1Result(resultLines, eventLines, 'isora_arrival');
    return;
  }

  // ── ラストイベントチェック ──
  // 貝が尽きてイソラがいて餌もない→ラスト
  if (c.isoraArrived && c.clamMax <= 0 && c.bait <= 0 && !c.baitInfinite) {
    renderR1Result(resultLines, eventLines, 'need_ingenuity');
    return;
  }

  renderR1Result(resultLines, eventLines);
}

function renderR1Result(lines, eventLines, specialEvent) {
  const c = state.ch3;
  document.getElementById('background-area').className = 'bg-rainy-evening';
  document.getElementById('month-label').textContent = `サバイバル・${c.turnCount}日目`;
  document.getElementById('event-title').textContent = '結果';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  let body = lines.join('\n');
  if (eventLines.length) body += '\n\n' + eventLines.join('\n');

  const warns = [];
  if (c.water <= 0) warns.push('⚠️ 水がない');
  if (c.food <= 0)  warns.push('⚠️ 食料がない');
  if (c.isoraArrived && c.bait <= 0 && !c.baitInfinite) warns.push('⚠️ 餌がない');
  if (warns.length) body += '\n\n' + warns.join('　');

  body += `\n\n［ ${getR1ResourceLabel()} ］`;
  if (c.driftwood > 0) body += `　板切れ${c.driftwood}枚`;

  document.getElementById('event-text').textContent = body;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const btn = makeBtn('続ける', 'choice-btn continue-btn');
  btn.addEventListener('click', () => {
    if (specialEvent === 'isora_arrival') {
      renderChapter3Event('c3_isora_arrives');
    } else if (specialEvent === 'need_ingenuity') {
      renderChapter3Event('c3_isora_ingenuity');
    } else {
      renderR1ActionTurn();
    }
  });
  choicesArea.appendChild(btn);
}

// フェーズ移行の条件判定
function checkPhaseAdvance() {
  const c = state.ch3;
  if (c.phase === 'survival') {
    // ワタへの信頼が一定値でコミュニティの長へ
    return c.trust >= 8;
  }
  if (c.phase === 'stability') {
    // leadershipの種が花（9以上）＋基本リソース充足
    const leadershipFlower = (state.seeds.leadership || 0) >= 9;
    const basics = c.food >= 5 && c.water >= 5 && c.safety >= 5 && c.trust >= 8;
    return leadershipFlower && basics;
  }
  return false; // 発展フェーズの先はエンディング（未実装）
}

// 配置をリセット
function resetAssignment() {
  state.ch3.assignment = {};
  // サバイバルフェーズはワタを貝採取に固定で戻す
  if (state.ch3.phase === 'survival') {
    state.ch3.assignment['clam'] = ['wata'];
  }
}

// 行動ターン画面を描画
function renderActionTurn() {
  const c = state.ch3;
  if (!c.assignment) c.assignment = {};

  // ワタをサバイバルの「貝を採取」に固定配置
  if (c.phase === 'survival') {
    if (!c.assignment['clam']) c.assignment['clam'] = [];
    if (!c.assignment['clam'].includes('wata')) {
      c.assignment['clam'].push('wata');
    }
  }

  document.getElementById('background-area').className = 'bg-rainy-evening';
  document.getElementById('month-label').textContent = `${getC3PhaseLabel()}・ターン${c.turnCount + 1}`;
  document.getElementById('event-title').textContent = '行動を決める';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  const textEl = document.getElementById('event-text');
  const clamInfo = c.phase === 'survival' ? `　貝の在庫：${c.clams}（上限${c.clamMax}）` : '';
  textEl.textContent = `取り組む問題に、人を割り当てよう。\n\n［ ${getC3ResourceLabel()} ］${clamInfo}`;

  const problems = C3_PROBLEMS[c.phase] || [];
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  // どのクルーがどのボックスに配置されているか
  const assignedTo = {}; // crewId → probId
  Object.entries(c.assignment).forEach(([probId, arr]) => {
    arr.forEach(id => { assignedTo[id] = probId; });
  });

  // 全クルーリスト（ワタ含む）
  const allCrew = ['wata', ...(c.crew || [])];

  problems.forEach(prob => {
    const clamLocked = prob.requireClams && c.clams <= 0;
    const clamDepleted = prob.id === 'clam' && c.clamMax <= 0;
    const probLocked = clamLocked || clamDepleted;

    const box = document.createElement('div');
    box.style.cssText = `background:rgba(255,255,255,${probLocked ? '0.02' : '0.05'});border:1px solid rgba(255,255,255,${probLocked ? '0.07' : '0.15'});border-radius:8px;padding:8px 10px;margin-bottom:6px;`;

    // ボックスのタイトル
    const head = document.createElement('div');
    head.style.cssText = 'font-size:0.82rem;color:var(--text-main);margin-bottom:3px;';
    head.textContent = prob.label;
    if (probLocked) head.textContent += clamLocked ? '　※貝がない' : '　※貝が枯渇した';
    box.appendChild(head);

    if (prob.desc) {
      const desc = document.createElement('div');
      desc.style.cssText = 'font-size:0.7rem;color:var(--text-sub);margin-bottom:6px;';
      desc.textContent = prob.desc;
      box.appendChild(desc);
    }

    // 全員のチップを表示
    const chipRow = document.createElement('div');
    chipRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;';

    allCrew.forEach(cid => {
      const isWata = cid === 'wata';
      const name = isWata ? replaceName('{friend}') : replaceName(CREW_MASTER[cid]?.name || cid);
      const myProb = assignedTo[cid]; // このクルーが配置されているボックスID
      const isHere = myProb === prob.id; // このボックスに配置済み
      const isElsewhere = myProb && myProb !== prob.id; // 別のボックスに配置済み

      const chip = document.createElement(isWata || isElsewhere || probLocked ? 'span' : 'button');
      chip.textContent = name;

      let chipStyle = 'font-size:0.78rem;padding:5px 10px;border-radius:6px;font-family:inherit;';
      if (isWata) {
        // ワタ：配置されているボックスは赤、それ以外はグレー
        if (isHere) {
          chipStyle += 'background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.5);color:#ff8080;cursor:default;';
        } else {
          chipStyle += 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.2);cursor:default;';
        }
      } else if (isHere) {
        // このボックスにオン：オレンジ
        chipStyle += 'background:var(--accent-dim);border:1px solid rgba(232,168,124,0.5);color:var(--accent);cursor:pointer;';
      } else if (isElsewhere) {
        // 別のボックスにいる：グレー
        chipStyle += 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.25);cursor:default;';
      } else {
        // 未配置：白
        chipStyle += 'background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.25);color:var(--text-main);cursor:pointer;';
      }
      chip.style.cssText = chipStyle;

      // タップ処理（ワタ・別ボックス・ロック中は無効）
      if (!isWata && !isElsewhere && !probLocked) {
        chip.addEventListener('click', () => {
          if (isHere) {
            // オフ
            c.assignment[prob.id] = (c.assignment[prob.id] || []).filter(x => x !== cid);
          } else {
            // オン
            if (!c.assignment[prob.id]) c.assignment[prob.id] = [];
            c.assignment[prob.id].push(cid);
          }
          renderActionTurn();
        });
      }

      chipRow.appendChild(chip);
    });

    box.appendChild(chipRow);
    choicesArea.appendChild(box);
  });

  const execBtn = makeBtn('この配置で実行する', 'choice-btn continue-btn');
  execBtn.style.marginTop = '8px';
  execBtn.addEventListener('click', executeActionTurn);
  choicesArea.appendChild(execBtn);
}

// 配置を実行して成果を反映
function executeActionTurn() {
  const c = state.ch3;
  const problems = C3_PROBLEMS[c.phase] || [];
  const resultLines = [];
  const eventLines = [];

  // ── 行動の成果 ──────────────────────────────────────────
  problems.forEach(prob => {
    const assigned = c.assignment[prob.id] || [];
    if (!assigned.length) return;

    // 貝が必要なのに在庫0なら実行不可
    if (prob.requireClams && c.clams <= 0) return;
    // 採取が枯渇上限に達したら実行不可
    if (prob.id === 'clam' && c.clamMax <= 0) return;

    let power = 0;
    assigned.forEach(id => {
      if (id === 'wata') power += 2;
      else power += crewStat(id, prob.stat);
    });

    const r = Math.random();
    let mult = 1;
    let tone = '';
    if (r < 0.10)      { mult = 1.5; tone = 'good'; }
    else if (r > 0.90) { mult = 0.5; tone = 'bad'; }

    const scaled = Math.max(1, Math.round((power / 2) * mult));
    const toneText = tone === 'good' ? '（うまくいった）' : tone === 'bad' ? '（空回りした）' : '';

    // 貝採取：在庫増加・上限を下げる（枯渇に向かう）
    if (prob.id === 'clam') {
      const gain = Math.max(0, Math.min(scaled * 2, c.clamMax - c.clams + 2));
      c.clams = Math.min(c.clamMax, c.clams + gain);
      c.clamMax = Math.max(0, c.clamMax - 1);
      resultLines.push(`貝を採取した（在庫${c.clams}、残り上限${c.clamMax}）${toneText}`);
      return;
    }

    // 釣り：貝を消費して食料を得る
    if (prob.id === 'fish') {
      const clamCost = Math.min(2, c.clams);
      c.clams = Math.max(0, c.clams - clamCost);
      applyC3Effects({ food: scaled * 2 });
      resultLines.push(`釣りをした（貝${clamCost}個消費→食料+${scaled * 2}）${toneText}`);
      return;
    }

    const eff = {};
    Object.entries(prob.effects).forEach(([k, v]) => { eff[k] = v * scaled; });
    applyC3Effects(eff);

    assigned.forEach(id => {
      if (id === 'wata') return;
      const sp = CREW_MASTER[id]?.special;
      if (sp === 'dive')     applyC3Effects({ resource: 1 });
      if (sp === 'survival') applyC3Effects({ food: 1, water: 1, safety: 1 });
      if (sp === 'food')     applyC3Effects({ food: 1 });
    });

    const names = assigned.filter(id => id !== 'wata').map(id => replaceName(CREW_MASTER[id]?.name || id)).join('・');
    const wataStr = assigned.includes('wata') ? replaceName('{friend}') + (names ? '・' : '') : '';
    resultLines.push(`${prob.label}：${wataStr}${names}${toneText}`);
  });

  // ── 人数に応じた消費 ────────────────────────────────────
  const crewCount = (c.crew || []).length + 1; // クルー＋ワタ
  const foodConsume = Math.ceil(crewCount * 0.5);
  const waterConsume = Math.ceil(crewCount * 0.5);
  applyC3Effects({ food: -foodConsume, water: -waterConsume });

  // ── ランダムイベント（ターンごとに起きる出来事） ──────────────
  const randomEvents = getRandomTurnEvent(c.phase, c.turnCount);
  randomEvents.forEach(ev => {
    applyC3Effects(ev.effects || {});
    eventLines.push(ev.text);
  });

  // ── 安定フェーズ：leadershipの種を育てる ──────────────────
  if (c.phase === 'stability' && c.trust >= 6) {
    state.seeds.leadership = (state.seeds.leadership || 0) + 2;
  }

  c.turnCount++;
  if (c.phase === 'development') c.devTurns++;
  resetAssignment();

  renderActionResult(resultLines, eventLines);
}

// ターンごとのランダムイベント定義
function getRandomTurnEvent(phase, turn) {
  const events = [];

  if (phase === 'survival') {
    const r = Math.random();
    if (r < 0.25) {
      // 1周目と2周目以降で雨の確率を変える
      const rainChance = state.playCount === 1 ? 0.30 : 0.50;
      if (Math.random() < rainChance) {
        events.push({ text: '雨が降った。水を集めた。', effects: { water: 2 } });
      } else if (r < 0.10) {
        events.push({ text: '波が荒れた。安全な場所が削られた。', effects: { safety: -1 } });
      } else {
        events.push({ text: '流れ着いたものを拾った。', effects: { resource: 1 } });
      }
    }
  }

  if (phase === 'stability') {
    const r = Math.random();
    if (r < 0.15) {
      events.push({ text: '仲間の間でもめごとがあった。', effects: { trust: -1 } });
    } else if (r < 0.25) {
      events.push({ text: '外から人が流れ着いた。', effects: { drive: 1 } });
    }
  }

  if (phase === 'development') {
    const r = Math.random();
    if (r < 0.15) {
      events.push({ text: '遠くから船影が見えた。', effects: { diplomacy: 1 } });
    } else if (r < 0.25) {
      events.push({ text: '記録をつけていた人が倒れた。', effects: { record: -1, anxiety: 1 } });
    }
  }

  return events;
}

// 行動結果を表示
function renderActionResult(lines, eventLines) {
  const c = state.ch3;
  document.getElementById('background-area').className = 'bg-school-grounds';
  document.getElementById('month-label').textContent = `${getC3PhaseLabel()}・ターン${c.turnCount}`;
  document.getElementById('event-title').textContent = '結果';
  document.getElementById('speaker-area').style.visibility = 'hidden';

  // 行動結果
  let body = lines.length ? lines.join('\n') : '今回は誰も動かなかった。';

  // ターンの出来事
  if (eventLines && eventLines.length) {
    body += '\n\n── 今ターンの出来事 ──\n' + eventLines.join('\n');
  }

  // リソース表示（警告付き）
  const warns = [];
  if (c.food <= 1)  warns.push('食料が残りわずか');
  if (c.water <= 1) warns.push('水が残りわずか');
  if (c.safety <= 1) warns.push('安全な場所がなくなりつつある');
  const warnText = warns.length ? '\n⚠️ ' + warns.join('　') : '';

  body += `\n\n［ ${getC3ResourceLabel()} ］${warnText}`;

  document.getElementById('event-text').textContent = body;

  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';

  const btn = makeBtn('続ける', 'choice-btn continue-btn');
  btn.addEventListener('click', () => {
    if (c.phase === 'development') {
      if (c.devTurns >= 3) {
        renderChapter3Event('c3_dev_choice');
      } else {
        renderActionTurn();
      }
    } else if (checkPhaseAdvance()) {
      if (c.phase === 'survival') {
        renderChapter3Event('c3_wata_declare1');
      } else if (c.phase === 'stability') {
        renderChapter3Event('c3_wata_declare2');
      }
    } else {
      renderActionTurn();
    }
  });
  choicesArea.appendChild(btn);
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
    if (state.playCount === 1) {
      // 1周目専用：大学生→社会人→訓練の固定ストーリー
      state.ch2.money = 0;
      state.ch2.knowledge = 0;
      state.ch2.actionsLeft = 3;
      state.ch2.helpedSpeech = false;
      state.ch2.boughtBoat = false;
      state.ch2.r1stage = 1;
      renderChapter2Event('c2r1_opening');
      return;
    }
    state.ch2.friendPath = determineFriendPath();
    renderChapter2Event('c2_opening');
    return;
  }

  if (eventId === 'chapter3_start') {
    state.ch3.phase = 'survival';
    state.ch3.crew = buildInitialCrew();
    state.ch3.turnCount = 0;
    state.ch3.assignment = {};
    if (state.playCount === 1) {
      // 1周目専用初期値：最初はミナトとワタの二人だけ
      state.ch3.food = 0;
      state.ch3.water = 2;
      state.ch3.waterMax = 2;
      state.ch3.bottles = 2;
      state.ch3.safety = 2;
      state.ch3.clams = 0;
      state.ch3.clamMax = 10;
      state.ch3.bait = 0;
      state.ch3.hasRod = false;
      state.ch3.isoraArrived = false;
      state.ch3.driftwood = 0;
      state.ch3.waterDanger = 0;
      state.ch3.baitInfinite = false;
      state.ch3.crew = ['minato']; // 最初はミナトだけ（ワタは別管理）
    }
    renderChapter3Event('c3_opening');
    return;
  }

  // 2章・3章の個別イベントへの直接ジャンプ（スキップ用）
  if (typeof CH2_EVENTS !== 'undefined' && CH2_EVENTS[eventId]) {
    if (!state.ch2.friendPath) state.ch2.friendPath = determineFriendPath();
    if (eventId.startsWith('c2r1_')) {
      if (state.ch2.actionsLeft === undefined) state.ch2.actionsLeft = 3;
      if (state.ch2.money === undefined) state.ch2.money = 0;
      if (state.ch2.knowledge === undefined) state.ch2.knowledge = 0;
      if (eventId === 'c2r1_s2_start' || eventId === 'c2r1_s2_speech') state.ch2.r1stage = 2;
    }
    renderChapter2Event(eventId);
    return;
  }
  if (typeof CH3_EVENTS !== 'undefined' && CH3_EVENTS[eventId]) {
    if (!state.ch3.crew || state.ch3.crew.length === 0) {
      state.ch3.crew = (state.playCount === 1) ? ['minato'] : buildInitialCrew();
    }
    renderChapter3Event(eventId);
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
  { label: '1章：中学生編', children: [
    { label: 'プロローグ',        id: 'prologue_start' },
    { label: '4月：部活紹介',     id: 'april_mid' },
    { label: '4月：帰り道',       id: 'april_night' },
    { label: '4月：夜',           id: 'april_night_own' },
    { label: '5月：ボール',       id: 'may_ball' },
    { label: '5月：夜',           id: 'may_night' },
    { label: '6月：早退',         id: 'june_family' },
    { label: '6月：夜',           id: 'june_night' },
    { label: '7月：一回だけ',     id: 'july_try' },
    { label: '7月：夏の始まり',   id: 'july_end' },
    { label: '8月：ニュース',     id: 'august_news' },
    { label: '8月：夢（序盤）',   id: 'august_dream_early' },
    { label: '8月：夢（中盤）',   id: 'august_dream_mid' },
    { label: '8月：夢（終盤）',   id: 'august_dream_late' },
    { label: '8月：夢（記憶なし）', id: 'august_dream_clean' },
    { label: '8月：夜',           id: 'august_night' },
    { label: '9月',               id: 'september_start' },
    { label: '2年秋：新学期',     id: 'autumn_class' },
    { label: '2年秋：夜',         id: 'autumn_night' },
    { label: '3年春：進路',       id: 'grade3_start' },
    { label: '3年春：夜',         id: 'grade3_night' },
    { label: '3年夏：図書館',     id: 'summer3_study' },
    { label: '3年夏：夜',         id: 'summer3_night' },
    { label: '卒業',              id: 'graduation' },
    { label: '卒業の夜',          id: 'graduation_night' },
    { label: '1章終わり',         id: 'chapter1_end' },
  ]},
  { label: '2章：成人期', children: [
    { label: '冒頭(2周目〜)', id: 'chapter2_start' },
    { label: '1周目：大学生編', id: 'c2r1_opening' },
    { label: '1周目：配信発見', id: 'c2r1_find_stream' },
    { label: '1周目：社会人編', id: 'c2r1_s2_start' },
    { label: '1周目：街頭演説', id: 'c2r1_s2_speech' },
    { label: '1周目：最終・誘い', id: 'c2r1_final_invite' },
    { label: '2周目〜S1応答', id: 'c2_s1_player_response' },
    { label: '2周目〜S1終わり', id: 'c2_s1_end' },
  ]},
  { label: '3章：島国家編', children: [
    { label: '冒頭',           id: 'chapter3_start' },
    { label: 'イソラ漂着',     id: 'c3_isora_arrives' },
    { label: '宣言①',         id: 'c3_wata_declare1' },
    { label: '安定フェーズ',   id: 'c3_stability_start' },
    { label: '宣言②',         id: 'c3_wata_declare2' },
    { label: '発展フェーズ',   id: 'c3_development_start' },
    { label: '1周目：貝枯渇',  id: 'c3_clam_depleted' },
    { label: '1周目：糸が切れた', id: 'c3_line_breaks' },
    { label: '1周目：漕ぎ出す', id: 'c3_set_sail' },
  ]},
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
    if (item.id && !item.children) {
      // 単独アイテム（深層海流など）
      const btn = makeBtn(item.label, 'choice-btn');
      btn.style.cssText = 'margin-bottom:5px;font-size:0.82rem;';
      btn.addEventListener('click', () => { closeSkipPanel(); renderEvent(item.id); });
      list.appendChild(btn);
    } else if (item.children) {
      // 折りたたみグループ
      const group = document.createElement('div');
      group.style.marginBottom = '5px';

      const groupBtn = document.createElement('button');
      groupBtn.textContent = `▶ ${item.label}`;
      groupBtn.style.cssText = `width:100%;padding:8px 12px;background:rgba(232,168,124,0.12);border:1px solid rgba(232,168,124,0.3);border-radius:7px;color:var(--accent);font-size:0.82rem;font-family:inherit;text-align:left;cursor:pointer;`;

      const children = document.createElement('div');
      children.style.cssText = 'display:none;padding:4px 0 2px 10px;';

      item.children.forEach(child => {
        const btn = makeBtn(child.label, 'choice-btn');
        btn.style.cssText = 'margin-bottom:4px;font-size:0.78rem;opacity:0.9;';
        btn.addEventListener('click', () => { closeSkipPanel(); renderEvent(child.id); });
        children.appendChild(btn);
      });

      groupBtn.addEventListener('click', () => {
        const isOpen = children.style.display !== 'none';
        children.style.display = isOpen ? 'none' : 'block';
        groupBtn.textContent = `${isOpen ? '▶' : '▼'} ${item.label}`;
      });

      group.appendChild(groupBtn);
      group.appendChild(children);
      list.appendChild(group);
    }
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
