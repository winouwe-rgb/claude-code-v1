// data/events.js
const EVENTS = {

  // ── プロローグ ───────────────────────────────────────────

  prologue_start: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `中学に上がる春。\n制服がまだ少し大きかった。\n\n親友とは、小学校からなんとなく一緒にいる。\n約束したわけじゃない。\n気づいたら、そこにいた。`,
    choices: null,
    next: 'prologue_q1'
  },

  prologue_q1: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `こいつといると、自分は——`,
    choices: [
      {
        text: '落ち着く',
        effects: { intelligence: 2, depth: 2, flags: ['protagonist_observer'] },
        next: 'prologue_q1_a'
      },
      {
        text: '放っておけない',
        effects: { intelligence: 2, popularity: 2, flags: ['protagonist_translator'] },
        next: 'prologue_q1_b'
      },
      {
        text: 'なんか、楽',
        effects: { stamina: 2, trust: 2, flags: ['protagonist_companion'] },
        next: 'prologue_q1_c'
      },
    ]
  },

  prologue_q1_a: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `急かされない。それが心地よかった。`,
    choices: null,
    next: 'prologue_q2'
  },

  prologue_q1_b: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `なぜかは、うまく言えない。\nただ、目が離せなかった。`,
    choices: null,
    next: 'prologue_q2'
  },

  prologue_q1_c: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `難しいことを考えなくていい。\n一緒にいるだけでよかった。`,
    choices: null,
    next: 'prologue_q2'
  },

  prologue_q2: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `親友はいつも笑っている。\nでも、その笑い方には——`,
    choices: [
      {
        text: 'ときどき、取り繕った感じがある',
        effects: { friendAnxiety: 1, flags: ['friend_lighttalk'] },
        next: 'prologue_q2_result'
      },
      {
        text: 'あまり多くを語らない感じがある',
        effects: { friendDistance: 2, flags: ['friend_quiet'] },
        next: 'prologue_q2_result'
      },
    ]
  },

  prologue_q2_result: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `気づいているのか、気づいていないのか。\n親友は今日も、こっちを見て笑った。`,
    choices: null,
    next: 'prologue_q3'
  },

  prologue_q3: {
    month: '',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `気になっても、自分は——`,
    choices: [
      {
        text: 'だいたい黙って見ている',
        effects: { depth: 1, flags: ['stance_watch'] },
        next: 'prologue_q3_result'
      },
      {
        text: 'つい何か言いたくなる',
        effects: { popularity: 1, flags: ['stance_speak'] },
        next: 'prologue_q3_result'
      },
    ]
  },

  prologue_q3_result: {
    month: '4月',
    title: '',
    speaker: null,
    background: 'spring-day',
    text: `中学生活が、もうすぐ始まる。`,
    choices: null,
    next: 'april_mid'
  },

  // ── 4月 ─────────────────────────────────────────────────

  april_mid: {
    month: '4月中旬',
    title: '部活紹介プリント',
    speaker: '親友',
    background: 'school-hallway',
    text: `放課後、部活紹介のプリントが配られた。\nバスケ部の先輩が教室の入り口から顔を出す。\n「見学だけでもいいから来てみない？」\n親友はプリントをのぞき込む。\n「バスケ、やったことないけど見るだけならありかも」`,
    choices: [
      {
        text: '一緒に見学へ行く',
        effects: { stamina: 1, trust: 2 },
        next: 'april_mid_react_a'
      },
      {
        text: 'まず他の部も見て回る',
        effects: { intelligence: 1, depth: 1 },
        next: 'april_mid_react_b'
      },
    ]
  },

  april_mid_react_a: {
    month: '4月中旬',
    title: '',
    speaker: null,
    background: 'school-hallway',
    text: `体育館に入ると、親友は少しだけ背筋を伸ばした。\nたぶん、自分でも気づいていない。`,
    choices: null,
    next: 'april_night'
  },

  april_mid_react_b: {
    month: '4月中旬',
    title: '',
    speaker: null,
    background: 'school-hallway',
    text: `親友は「そうだね」と言った。\nそれきり、プリントを鞄にしまった。`,
    choices: null,
    next: 'april_night'
  },

  april_night: {
    month: '4月',
    title: '帰り道',
    speaker: '親友',
    background: 'evening-road',
    text: `帰り道、親友はプリントを折りながら言った。\n「部活って、決めたら毎日行く感じなのかな」\n軽い口調だったけれど、返事を待っているようにも見えた。`,
    choices: [
      {
        text: 'みんなでやるのも楽しそうだと言う',
        effects: { popularity: 1, seeds: { groupParticipation: 1 } },
        next: 'april_night_react_a'
      },
      {
        text: '無理に決めなくていいと言う',
        effects: { trust: 2, seeds: { twoPersonWorld: 1 } },
        next: 'april_night_react_b'
      },
    ]
  },

  april_night_react_a: {
    month: '4月',
    title: '',
    speaker: null,
    background: 'evening-road',
    text: `親友は少し考えてから、「かもね」と言った。\n否定はしなかった。`,
    choices: null,
    next: 'april_night_own'
  },

  april_night_react_b: {
    month: '4月',
    title: '',
    speaker: null,
    background: 'evening-road',
    text: `親友は「そっか」とだけ言った。\n少し、ほっとしたように見えた。`,
    choices: null,
    next: 'april_night_own'
  },

  april_night_own: {
    month: '4月　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `帰ってから、しばらく天井を見ていた。\n今日のこと、どう受け取るか。`,
    choices: [
      {
        text: '部活について調べてみる',
        category: 'study',
        next: 'may_ball'
      },
      {
        text: '親友のこと、少し考える',
        category: 'think',
        next: 'may_ball'
      },
      {
        text: '今日は疲れたので休む',
        category: 'rest',
        next: 'may_ball'
      },
    ]
  },

  // ── 5月 ─────────────────────────────────────────────────

  may_ball: {
    month: '5月',
    title: 'ボール、全然こないんだけど',
    speaker: '親友',
    background: 'school-grounds',
    text: `バスケ部の練習は、少しずつ本格的になってきた。\n帰り道、親友がふいに言った。\n「ボール、全然こないんだけど」\n少し大げさに肩を落として、それから笑う。\n「立ってるだけなら、家で漫画読んでる方が上手くなれそうじゃない？」\n冗談みたいな言い方だった。\n本当に飽きただけのようにも見える。少し無理をしているようにも見える。`,
    choices: [
      {
        text: '「慣れたら回ってくるよ」',
        effects: { stamina: 1, friendAnxiety: 1, flags: ['もう少し頑張ればと言われた'] },
        next: 'may_ball_react_a'
      },
      {
        text: '「じゃあ別のこと探す？」',
        effects: { depth: 1, flags: ['逃げ道を示された'], seeds: { clubWithdrawal: 1 } },
        next: 'may_ball_react_b'
      },
      {
        text: '「本当はしんどい？」',
        effects: { depth: 1, trust: 1, friendAnxiety: 1, flags: ['軽い嘘に気づいた'] },
        next: 'may_ball_react_c'
      },
      {
        text: '「確かに暇そうだったな」',
        effects: { popularity: 1, flags: ['軽く流された記憶'], seeds: { twoPersonWorld: 1 } },
        next: 'may_ball_react_d'
      },
    ]
  },

  may_ball_react_a: {
    month: '5月',
    title: '',
    speaker: null,
    background: 'school-grounds',
    text: `親友は「そうかな」と言った。\n少し間があって、「まあ、そうだね」と続けた。\n納得したのか、自分を納得させたのか、分からなかった。`,
    choices: null,
    next: 'may_night'
  },

  may_ball_react_b: {
    month: '5月',
    title: '',
    speaker: null,
    background: 'school-grounds',
    text: `親友は「別のこと」という言葉を少し転がすように黙った。\n「なんかあるかな」\n探しているのか、逃げ道を確認しているのか、判断がつかなかった。`,
    choices: null,
    next: 'may_night'
  },

  may_ball_react_c: {
    month: '5月',
    title: '',
    speaker: '親友',
    background: 'school-grounds',
    text: `親友は一瞬、笑うのを止めた。\n「……しんどくはないけど」\n「ただ、なんか、思ってたのと違う感じ」\nそれだけ言って、また歩き出した。`,
    choices: null,
    next: 'may_night'
  },

  may_ball_react_d: {
    month: '5月',
    title: '',
    speaker: null,
    background: 'school-grounds',
    text: `親友は「だよね」と笑った。\nそれで話は終わった。\nたぶん、それでよかった。たぶん。`,
    choices: null,
    next: 'may_night'
  },

  may_night: {
    month: '5月　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `中学生活には少し慣れてきた。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: 'あいつがついてこれるよう自主練する',
        category: 'train',
        effects: { flags: ['自主練した'] },
        next: 'june_family'
      },
      {
        text: 'クラスであいつの様子を探る',
        category: 'search',
        next: 'june_family'
      },
      {
        text: '今日の親友のこと、考える',
        category: 'think',
        next: 'june_family'
      },
      {
        text: 'あの嘘、本当のことを考える',
        category: 'think',
        next: 'june_family'
      },
      {
        text: '何も考えないようにする',
        category: 'rest',
        next: 'june_family'
      },
    ]
  },

  // ── 6月 ─────────────────────────────────────────────────

  june_family: {
    month: '6月',
    title: '今日はちょっと家の用事',
    speaker: '親友',
    background: 'school-gate',
    text: `親友は、今日はいつもより少しだけ荷物をまとめるのが早かった。\n「ごめん。今日、ちょっと家の用事」\nそう言ってから、少し考えるように足元を見る。\n「あと、なんか足も痛い気がする。たぶん成長痛」\n言い方は軽い。嘘なら、もう少し上手につけばいいのにと思うくらいには、分かりやすかった。\nでも、本人はそれで隠せているつもりらしい。`,
    choices: [
      {
        text: '「分かった。無理すんなよ」',
        effects: { depth: 1, trust: 1, flags: ['そっとされた記憶'] },
        next: 'june_family_react_a'
      },
      {
        text: '「本当に家の用事？」',
        effects: { depth: 1, friendAnxiety: 1, flags: ['嘘を疑われた記憶'] },
        next: 'june_family_react_b'
      },
      {
        text: '「じゃあ、自分も今日は休む」',
        effects: { trust: 1, seeds: { twoPersonWorld: 1 }, flags: ['一緒に休んだ記憶'] },
        next: 'june_family_react_c'
      },
      {
        text: '「自分は部活行ってくる」',
        effects: { stamina: 1, friendIndependence: 1, flags: ['置いていかれた記憶'] },
        next: 'june_family_react_d'
      },
      {
        text: '「帰りに少し練習しない？」',
        flagRequired: '自主練した',
        effects: { trust: 1, flags: ['河川敷に誘った'] },
        next: 'june_family_react_e'
      },
    ]
  },

  june_family_react_e: {
    month: '6月',
    title: '',
    speaker: '親友',
    background: 'school-gate',
    text: `親友は少し間を置いた。\n「……練習って、バスケ？」\n「まあ、軽くでいいけど」\nそう言ってから、ちょっとだけ迷うような顔をした。`,
    choices: null,
    next: 'june_family_react_e_branch'
  },

  june_family_react_e_branch: {
    month: '6月',
    title: '',
    speaker: null,
    background: 'evening-road',
    text: null,
    choices: null,
    type: 'branch',
    branch: {
      condition: 'groupVsTwoWorld',
      ifTrue:  'june_practice_a',
      ifFalse: 'june_practice_b'
    }
  },

  june_practice_a: {
    month: '6月',
    title: '',
    speaker: null,
    background: 'school-grounds',
    text: `近くの公園で少しだけシュートを打った。\nうまくはなかった。でも、親友は最後まで付き合った。\n翌週から、親友は部活を休まなくなった。\n理由は言わなかった。`,
    effects: { stamina: 1, seeds: { groupParticipation: 2 }, flags: ['河川敷で投げた記憶', '部活に戻った記憶'] },
    choices: null,
    next: 'june_end'
  },

  june_practice_b: {
    month: '6月',
    title: '',
    speaker: '親友',
    background: 'school-grounds',
    text: `近くの公園で少しだけシュートを打った。\nしばらく無言で続けていたら、親友がふいに言った。\n「うち、ちょっとごたごたしててさ」\nそれだけだった。でも、言えたことが、何かを少し軽くしたようだった。`,
    effects: { trust: 2, depth: 1, friendAnxiety: -1, flags: ['河川敷で投げた記憶', '家のことを聞いた記憶'] },
    choices: null,
    next: 'june_end'
  },

  june_family_react_a: {
    title: '',
    speaker: null,
    background: 'school-gate',
    text: `親友は「うん」と言った。\n短かった。でも、少しだけ肩の力が抜けたように見えた。`,
    choices: null,
    next: 'june_end'
  },

  june_family_react_b: {
    month: '6月',
    title: '',
    speaker: '親友',
    background: 'school-gate',
    text: `親友は一瞬だけ目が泳いだ。\n「……家の用事だって」\n繰り返した。今度は少しだけ、声が固かった。`,
    choices: null,
    next: 'june_end'
  },

  june_family_react_c: {
    month: '6月',
    title: '',
    speaker: '親友',
    background: 'school-gate',
    text: `「え、いいの？」\n親友は少し驚いた顔をした。\nそれから、「……ありがと」と小さく言った。`,
    choices: null,
    next: 'june_end'
  },

  june_family_react_d: {
    month: '6月',
    title: '',
    speaker: null,
    background: 'school-gate',
    text: `「あ、そっか。うん、行ってきな」\n親友はそう言って、先に歩き出した。\n後ろ姿は、いつもより少し小さく見えた。`,
    choices: null,
    next: 'june_end'
  },

  june_end: {
    month: '6月終わり',
    title: '',
    speaker: null,
    background: 'rainy-evening',
    text: `その日の帰り道は、少しだけいつもと違っていた。\nバスケ部の話になると、親友は少しだけ笑うのが早くなった。\n「まあ、まだ辞めるとかじゃないけどさ」\nその言い方も、軽かった。軽すぎるくらいに。`,
    choices: null,
    next: 'june_night'
  },

  june_night: {
    month: '6月　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `雨の音が窓の外にある。\n今日のことを、どう整理するか。`,
    choices: [
      {
        text: '人が傷つく理由について、検索してみる',
        category: 'study',
        next: 'july_try'
      },
      {
        text: '何も考えず、早く寝る',
        category: 'rest',
        next: 'july_try'
      },
      {
        text: '今日のあいつの顔を、ずっと考えている',
        category: 'think',
        next: 'july_try'
      },
    ]
  },

  // ── 7月 ─────────────────────────────────────────────────

  july_try: {
    month: '7月',
    title: '一回だけ、ちゃんとやる',
    speaker: '親友',
    background: 'summer-school',
    text: `7月に入って、部活の雰囲気が少し変わった。試合が近いらしく、練習に声が増えた。\n親友は珍しく、自分から言った。\n「一回だけ、ちゃんとやってみようかな」\n理由は言わなかった。ただ、いつもより少しだけ早く家を出た日があった。`,
    choices: [
      {
        text: '一緒に行く',
        effects: { stamina: 1, trust: 1, flags: ['一緒に行った記憶'] },
        next: 'july_try_react_a'
      },
      {
        text: '背中を押す',
        effects: { depth: 1, friendAnxiety: 1, flags: ['背中を押した記憶'] },
        next: 'july_try_react_b'
      },
      {
        text: '何も言わずに見送る',
        effects: { friendIndependence: 1, flags: ['見送った記憶'] },
        next: 'july_try_react_c'
      },
    ]
  },

  july_try_react_a: {
    month: '7月',
    title: '',
    speaker: null,
    background: 'summer-school',
    text: `体育館に着くと、親友は少し照れたように「来たの」と言った。\n来て正解だったのかどうか、その日の練習が終わるまで分からなかった。`,
    choices: null,
    next: 'july_end'
  },

  july_try_react_b: {
    month: '7月',
    title: '',
    speaker: null,
    background: 'summer-school',
    text: `親友はうなずいた。\n「うん、やってみる」\n言葉は短かった。でも、少しだけ目が違った。`,
    choices: null,
    next: 'july_end'
  },

  july_try_react_c: {
    month: '7月',
    title: '',
    speaker: null,
    background: 'summer-school',
    text: `親友の背中が遠くなる。\n振り返らなかった。\nそれが、答えなのかもしれなかった。`,
    choices: null,
    next: 'july_end'
  },

  july_end: {
    month: '7月',
    title: '夏の始まり',
    speaker: null,
    background: 'summer-sky',
    text: `7月が終わる。夏休みが始まった。`,
    choices: null,
    next: 'august_news'
  },

  // ── 8月 ─────────────────────────────────────────────────

  august_news: {
    month: '8月',
    title: '',
    speaker: null,
    background: 'summer-sky',
    text: `夏休みのある日。\nテレビのニュースで、南の島が水没の危機にあると伝えていた。\nアナウンサーは淡々と読み上げて、次のニュースに移った。\nワタは、そこだけ少し長く画面を見ていた。`,
    choices: null,
    next: 'august_news_branch'
  },

  august_news_branch: {
    month: '8月',
    title: '',
    speaker: null,
    background: 'summer-sky',
    text: null,
    choices: null,
    type: 'branch',
    branch: {
      condition: 'dreamPattern',
      ifClean:  'august_dream_clean',
      ifLate:   'august_dream_late',
      ifMid:    'august_dream_mid',
      ifEarly:  'august_dream_early'
    }
  },

  august_dream_early: {
    month: '8月',
    title: '',
    speaker: '{friend}',
    background: 'night-room',
    text: `その夜、{friend}から短いメッセージが来た。\n「すごく怖い夢を見た」\n「なんの夢か、うまく言えないんだけど」\n「ただ、すごく怖かった」`,
    choices: null,
    next: 'august_night'
  },

  august_dream_mid: {
    month: '8月',
    title: '',
    speaker: '{friend}',
    background: 'night-room',
    text: `翌日、{friend}は言った。\n「昨日、夢見た」\n「たくさん死んでた。知らない人も、知ってる人も」\n少し間があって、\n「自分もすぐそこにいる感じがした」\n笑わなかった。`,
    choices: null,
    next: 'august_night'
  },

  august_dream_late: {
    month: '8月',
    title: '',
    speaker: '{friend}',
    background: 'night-room',
    text: `翌日、{friend}は言った。\n「世界、終わると思う？」\n冗談に聞こえなかった。\n「{friendPronoun}、夢で見た。全部沈んでいくやつ」\n少し間があって、\n「助けなきゃいけない気がする」`,
    choices: null,
    next: 'august_night'
  },

  august_dream_clean: {
    month: '8月',
    title: '',
    speaker: '{friend}',
    background: 'night-room',
    text: `その夜、{friend}から短いメッセージが来た。\n「あの島の人たち、どこ行くんだろうね」\nミナトは少し考えてから、返事を打った。`,
    choices: [
      {
        text: '「どこかに移れるといいね」',
        effects: { depth: 1, seeds: { groupHope: 1 } },
        next: 'august_night'
      },
      {
        text: '「誰かが助けるんじゃないかな」',
        effects: { trust: 1 },
        next: 'august_night'
      },
      {
        text: '「分からないけど、一緒に考えようか」',
        effects: { trust: 2, depth: 1, seeds: { friendIndependence: 1 } },
        next: 'august_night'
      },
    ]
  },

  august_night: {
    month: '8月　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `夏の夜は長い。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: '{friend}に返事を書く',
        category: 'think',
        next: 'september_start'
      },
      {
        text: 'ニュースの島のことを調べてみる',
        category: 'study',
        next: 'september_start'
      },
      {
        text: '今夜は休む',
        category: 'rest',
        next: 'september_start'
      },
    ]
  },

  september_start: {
    month: '9月',
    title: '夏が終わる',
    speaker: null,
    background: 'school-hallway',
    text: `夏休みが終わった。\n{friend}は、いつもと変わらない顔で登校してきた。\nあの夜のことは、何も言わなかった。`,
    choices: null,
    next: 'autumn_class'
  },

  // ── 2年秋 ───────────────────────────────────────────────

  autumn_class: {
    month: '2年・秋',
    title: '新学期',
    speaker: null,
    background: 'school-hallway',
    text: `2年生の秋。クラスが少し変わった。\n{friend}は同じクラスのままだった。\nそれが当たり前のような、少し安心したような、\n妙な感覚があった。`,
    choices: [
      {
        text: '放課後、いつも通り帰ろうと誘う',
        effects: { trust: 1, seeds: { twoPersonWorld: 1 } },
        next: 'autumn_class_react_a'
      },
      {
        text: '新しいクラスメートと話す機会を作る',
        effects: { popularity: 1, seeds: { groupParticipation: 1 } },
        next: 'autumn_class_react_b'
      },
    ]
  },

  autumn_class_react_a: {
    month: '2年・秋',
    title: '',
    speaker: null,
    background: 'evening-road',
    text: `{friend}は「いいよ」と言った。\nいつもと変わらない返事だった。\nそれが、なぜか少しほっとした。`,
    choices: null,
    next: 'autumn_night'
  },

  autumn_class_react_b: {
    month: '2年・秋',
    title: '',
    speaker: null,
    background: 'school-hallway',
    text: `{friend}は少し離れたところから、それを見ていた。\n何も言わなかった。`,
    choices: null,
    next: 'autumn_night'
  },

  autumn_night: {
    month: '2年・秋　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `新しい季節が始まった。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: '{friend}のことを調べてみる',
        category: 'study',
        next: 'grade3_start'
      },
      {
        text: '今日のことを考える',
        category: 'think',
        next: 'grade3_start'
      },
      {
        text: '今夜は休む',
        category: 'rest',
        next: 'grade3_start'
      },
    ]
  },

  // ── 3年始まり ────────────────────────────────────────────

  grade3_start: {
    month: '3年・春',
    title: '進路',
    speaker: '{friend}',
    background: 'school-hallway',
    text: `3年になった。\n廊下に進路希望調査の紙が貼り出された。\n{friend}はそれをじっと見ていた。\n「将来って、決めなきゃいけないのかな」\n独り言みたいだった。`,
    choices: [
      {
        text: '「一緒に考えようか」',
        effects: { trust: 2, depth: 1 },
        next: 'grade3_react_a'
      },
      {
        text: '「自分のことは自分で決めるしかないよ」',
        effects: { friendIndependence: 1, depth: 1 },
        next: 'grade3_react_b'
      },
    ]
  },

  grade3_react_a: {
    month: '3年・春',
    title: '',
    speaker: '{friend}',
    background: 'school-hallway',
    text: `{friend}は少し間を置いてから言った。\n「……一緒に考えてくれるの？」\n聞き返すような言い方だった。`,
    choices: null,
    next: 'grade3_night'
  },

  grade3_react_b: {
    month: '3年・春',
    title: '',
    speaker: null,
    background: 'school-hallway',
    text: `{friend}は「そうだね」と言った。\nでも、紙から目を離さなかった。`,
    choices: null,
    next: 'grade3_night'
  },

  grade3_night: {
    month: '3年・春　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `進路という言葉が、頭に残っている。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: '進路について調べてみる',
        category: 'study',
        next: 'summer3_study'
      },
      {
        text: '{friend}のことを考える',
        category: 'think',
        next: 'summer3_study'
      },
      {
        text: '今夜は休む',
        category: 'rest',
        next: 'summer3_study'
      },
    ]
  },

  // ── 3年夏休み ────────────────────────────────────────────

  summer3_study: {
    month: '3年・夏',
    title: '図書館',
    speaker: null,
    background: 'summer-school',
    text: `受験勉強の夏。\n図書館で{friend}と並んで参考書を開いていた。\n{friend}はページをめくる手が止まることが多かった。\n何を考えているのか、聞けなかった。`,
    choices: [
      {
        text: '声をかける',
        effects: { trust: 1, depth: 1 },
        next: 'summer3_react_a'
      },
      {
        text: '黙って隣にいる',
        effects: { trust: 1, seeds: { twoPersonWorld: 1 } },
        next: 'summer3_react_b'
      },
    ]
  },

  summer3_react_a: {
    month: '3年・夏',
    title: '',
    speaker: '{friend}',
    background: 'summer-school',
    text: `{friend}は少し驚いたように顔を上げた。\n「……なんでもない」\nそう言って、また参考書に目を落とした。\nでも、少しだけ姿勢が変わった。`,
    choices: null,
    next: 'summer3_night'
  },

  summer3_react_b: {
    month: '3年・夏',
    title: '',
    speaker: null,
    background: 'summer-school',
    text: `何も言わなかった。\n{friend}も何も言わなかった。\n図書館の時計だけが、静かに進んでいた。`,
    choices: null,
    next: 'summer3_night'
  },

  summer3_night: {
    month: '3年・夏　夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `図書館の帰り、まだ外が明るかった。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: '受験勉強を続ける',
        category: 'study',
        next: 'graduation'
      },
      {
        text: '体を動かして気分転換する',
        category: 'train',
        next: 'graduation'
      },
      {
        text: '今夜は休む',
        category: 'rest',
        next: 'graduation'
      },
    ]
  },

  // ── 卒業 ────────────────────────────────────────────────

  graduation: {
    month: '3年・3月',
    title: '卒業',
    speaker: null,
    background: 'spring-day',
    text: `卒業式の日。\n校庭の隅で{friend}と二人でいた。\n「中学、どうだった？」\n自分から聞いたのは初めてだった。`,
    choices: [
      {
        text: '「楽しかった」',
        effects: { depth: 1, seeds: { groupHope: 1 } },
        next: 'graduation_react_a'
      },
      {
        text: '「お前がいたから悪くなかった」',
        effects: { trust: 2, seeds: { twoPersonWorld: 2, prophecy: 1 } },
        next: 'graduation_react_b'
      },
    ]
  },

  graduation_react_a: {
    month: '3年・3月',
    title: '',
    speaker: '{friend}',
    background: 'spring-day',
    text: `{friend}は少し考えてから言った。\n「……そっか」\n「ぼくも、まあ、悪くなかったかな」\n笑い方が、少しだけ本物に見えた。`,
    choices: null,
    next: 'graduation_night'
  },

  graduation_react_b: {
    month: '3年・3月',
    title: '',
    speaker: '{friend}',
    background: 'spring-day',
    text: `{friend}は黙った。\nそれから、小さく言った。\n「……ぼくも」\nそれだけだった。`,
    choices: null,
    next: 'graduation_night'
  },

  graduation_night: {
    month: '卒業の夜',
    title: '',
    speaker: null,
    background: 'night-room',
    text: `長い一日が終わった。\n今夜、自分は何をするか。`,
    choices: [
      {
        text: '今日のことを考える',
        category: 'think',
        next: 'chapter1_end'
      },
      {
        text: '今夜は休む',
        category: 'rest',
        next: 'chapter1_end'
      },
    ]
  },

  chapter1_end: {
    month: '',
    title: '',
    speaker: null,
    background: 'summer-sky',
    text: `── 1章、ここまで ──`,
    choices: null,
    next: null
  }
};
