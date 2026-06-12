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
    next: 'deep_current'
  }
};

// ── 2章イベント ──────────────────────────────────────────────

const CH2_EVENTS = {

  // ════════════════════════════════════════════════════════════
  // 1周目専用：大学生→社会人→訓練の固定ストーリー
  // ════════════════════════════════════════════════════════════

  c2r1_opening: {
    month: '大学生編',
    title: '久しぶりの手紙',
    background: 'night-room',
    text: `{friend}から手紙が来た。\n\n「久しぶり。元気にしてる？\nこの世界、なんだか平和ボケしてるよね。\nつまらない足の引っ張り合いばかりで、\nみんな自分のこと、今のことしか考えてない。\nぼくたちは、この世界のことを考えて、\nひとつにならなきゃいけないと思うんだ」\n\nどう返していいか、分からなかった。`,
    choices: null,
    next: 'c2r1_paper_plane'
  },

  c2r1_paper_plane: {
    month: '大学生編',
    title: '',
    background: 'night-room',
    text: `書きかけの返事を、最後まで書けなかった。\n便箋を折って、紙飛行機にした。\n窓から飛ばすと、夜の中へ消えていった。\n\n（紙飛行機が落ちるまでが、ひとつの区切り）`,
    choices: null,
    next: 'c2r1_action_turn'
  },

  // ステージ1で「ワタを検索」を選んだとき
  c2r1_find_stream: {
    month: '大学生編',
    title: 'みつけた配信',
    background: 'night-room',
    text: `何気なく{friend}の名前を検索した。\n\n配信が、ひとつ見つかった。\n再生回数は、一桁だった。\n\n画面の中の{friend}は、手紙と同じことを\n誰もいない空間に向かって力説していた。\n「海の底から、声がする気がするんだ」\n\nかつての親友の姿に、胸が痛んだ。`,
    choices: null,
    next: 'c2r1_action_turn'
  },

  c2r1_s1_end: {
    month: '大学生編',
    title: '時は流れる',
    background: 'night-room',
    text: `卒論が忙しくなった。\n{friend}のことを考える余裕も、\nだんだん無くなっていった。\n\n気づけば、{player}も社会に出ていた。`,
    choices: null,
    next: 'c2r1_s2_start'
  },

  // ── ステージ2：社会人編 ──────────────────────────────────

  c2r1_s2_start: {
    month: '社会人編',
    title: '社会人になった',
    background: 'night-room',
    text: `{player}は働き始めた。\n忙しいけれど、お金は自分で稼げるようになった。\n\nその間も、{friend}は活動を続けていた。\nいつのまにか、配信の様子が変わっていた。`,
    choices: null,
    next: 'c2r1_s2_action_setup'
  },

  c2r1_s2_action_setup: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `{friend}の配信は、相変わらず誰にも届いていない。\nでも、放っておけなかった。\n\n（紙飛行機が落ちるまでが、ひとつの区切り）`,
    choices: null,
    next: 'c2r1_action_turn'
  },

  // ステージ2で「擁護コメント」を選んだとき
  c2r1_flame_war: {
    month: '社会人編',
    title: 'レスバトル',
    background: 'night-room',
    text: `{friend}の動画に、擁護のコメントを残した。\n\nすると、すぐに返信がついた。\n知らない誰かが、{player}に絡んできた。\n反論すると、さらに人が集まってきた。\n\n気づけば、{player}はボロカスに叩かれていた。\n画面を閉じても、心臓が嫌な音を立てていた。`,
    choices: null,
    next: 'c2r1_action_turn'
  },

  // ステージ2で「ボートを買ってあげる」を選んだとき
  c2r1_buy_boat: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `中古のボートを買って、{friend}に渡した。\n「使っていいよ」\n{friend}は、子どもみたいに喜んでいた。\n\nなぜそうしたのか、自分でもよく分からなかった。`,
    choices: null,
    next: 'c2r1_action_turn'
  },

  // ステージ2の締め：街頭演説を手伝うか
  c2r1_s2_speech: {
    month: '社会人編',
    title: '街頭演説',
    speaker: '{friend}',
    background: 'night-room',
    text: `{friend}から連絡が来た。\n「今度の週末、駅前で話をするんだ。\n……来なくていいよ」\n\nその「来なくていいよ」が、引っかかった。`,
    choices: [
      {
        text: '手伝いに行く',
        also: {},
        next: 'c2r1_speech_help'
      },
      {
        text: '行かない',
        also: {},
        next: 'c2r1_speech_skip'
      },
    ]
  },

  // 手伝った場合
  c2r1_speech_help: {
    month: '社会人編',
    title: '隣に立つ',
    background: 'night-room',
    text: `複雑な気持ちのまま、{friend}の隣に立った。\n誰も足を止めなかった。\nそれでも{friend}は、嬉しそうだった。\n\nだが後日、その様子が配信に映っていた。\nそして、{friend}の活動が——\n嘲笑とともに、爆発的に拡散された。`,
    choices: null,
    next: 'c2r1_help_flame'
  },

  c2r1_help_flame: {
    month: '社会人編',
    title: '炎上',
    background: 'night-room',
    text: `隣に立っていた{player}も、一緒に晒された。\n知らない人たちに、嘲笑された。\n\n{friend}への気持ちが、初めて濁った。\n「なんで、あんなことに付き合ったんだ」\n\n人目を避けて、{player}は部屋にこもった。`,
    choices: null,
    next: 'c2r1_set_helped_flag'
  },

  c2r1_set_helped_flag: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `{friend}は、その騒ぎを逆手に取った。\n集まった注目と、わずかな支援を元手に、\n名もない島と、中古のボートを手に入れた。\n\n共鳴する人も、何人か現れたらしい。\n「島に、みんなで移り住むんだ」と{friend}は言った。`,
    choices: null,
    next: 'c2r1_final_invite'
  },

  // 手伝わなかった場合
  c2r1_speech_skip: {
    month: '社会人編',
    title: '行かなかった',
    background: 'night-room',
    text: `結局、{player}は行かなかった。\n\n後日、{friend}の活動が\n嘲笑とともに拡散されているのを、画面越しに見た。\n晒される{friend}を、ただ見ていることしかできなかった。\n\n何度か連絡は来た。\nでも、どう返せばいいのか分からなかった。`,
    choices: [
      {
        text: '関わるのが怖くて、応えられない',
        next: 'c2r1_skip_withdraw'
      },
      {
        text: '説得しに行く',
        next: 'c2r1_skip_persuade'
      },
    ]
  },

  c2r1_skip_withdraw: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `関わりたくない気持ちと、\nどう接していいか分からない戸惑い。\nその間で、{player}は少しずつ消耗していった。\n\n{friend}からの連絡は、見ないようにした。`,
    choices: null,
    next: 'c2r1_set_skipped_flag'
  },

  c2r1_skip_persuade: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `{player}は{friend}に会いに行った。\nやめてほしい、現実を見てほしい、と伝えた。\n\nでも、言葉は通じなかった。\n{friend}は、{player}を見ていなかった。\nそのまま、二人は疎遠になった。\n\n後には、味気ない日々だけが残った。`,
    choices: null,
    next: 'c2r1_set_skipped_flag'
  },

  c2r1_set_skipped_flag: {
    month: '社会人編',
    title: '',
    background: 'night-room',
    text: `しばらくして、噂が聞こえてきた。\n{friend}が、島を買ったらしい。\n\nどこからそんなお金が出たのかは、分からなかった。\n共鳴する人たちと、移り住むつもりだという。`,
    choices: null,
    next: 'c2r1_final_invite'
  },

  // ── 最終ステージ：訓練への誘い ──────────────────────────

  c2r1_final_invite: {
    month: '——',
    title: 'さいごの誘い',
    speaker: '{friend}',
    background: 'night-room',
    text: `ある日、{friend}から弾んだ声で連絡が来た。\n「ねえ、島に来てよ。\nサバイバルの訓練をするんだ。\n{player}にも、ぜひ来てほしくて」\n\nこれが、引き戻せる最後のチャンスかもしれない。\nここで応じなければ、{friend}は遠くへ行ってしまう。`,
    choices: [
      {
        text: '断る',
        next: 'c2r1_cant_refuse'
      },
      {
        text: '付き合う',
        next: 'c2r1_accept'
      },
    ]
  },

  c2r1_cant_refuse: {
    month: '——',
    title: '',
    background: 'night-room',
    text: `断ろうとした。\nでも、どうしても言葉が出てこなかった。`,
    choices: [
      {
        text: '……',
        next: 'c2r1_accept'
      },
    ]
  },

  c2r1_accept: {
    month: '——',
    title: '島へ',
    background: 'rainy-evening',
    text: `{player}は、{friend}の島へ向かった。\n\n訓練のためにと、荷物はほとんど置いていった。\nナイフも、ライターも、船の中に。\n手元に残ったのは、いつものカバンだけ。\n日記と、鉛筆と、水。\n{friend}も、水筒ひとつだけだった。\n\nこれから、訓練が始まる。\nそのはずだった。`,
    choices: null,
    next: 'c2r1_to_ch3'
  },

  c2r1_to_ch3: {
    month: '',
    title: '',
    background: 'rainy-evening',
    text: `その夜のことを、{player}はうまく思い出せない。\n\n気がつけば——\n島も、船も、なかった。`,
    choices: null,
    next: 'chapter3_start'
  },

  c2_opening: {
    month: '20代・序章',
    title: '大人になった',
    background: 'school-hallway',
    text: `中学を卒業して、数年が経った。\n{player}は自分の道を歩き始めていた。\n{friend}とは、たまに連絡を取り合っていた。\nそれで十分だと思っていた。`,
    choices: null,
    next: 'c2_friend_path_branch'
  },

  c2_friend_path_branch: {
    type: 'c2branch',
    branch: {
      prophet:    'c2_s1_prophet',
      scientist:  'c2_s1_scientist',
      hermit:     'c2_s1_hermit',
      organizer:  'c2_s1_organizer',
      drifter:    'c2_s1_drifter',
      default:    'c2_s1_drifter',
    }
  },

  // ── ステージ1：ワタの暴走 ────────────────────────────────

  c2_s1_prophet: {
    month: '22歳',
    title: 'ワタからの手紙',
    background: 'night-room',
    text: `{friend}から、久しぶりに長い手紙が来た。\n「世界は終わる方向に向かっている。\nぼくにはそれが見える。\n正しい場所に、正しい人を集めなければならない」\n読み終えて、しばらく画面を見つめた。`,
    showResources: true,
    choices: null,
    next: 'c2_s1_player_response'
  },

  c2_s1_scientist: {
    month: '22歳',
    title: 'ワタからの手紙',
    background: 'night-room',
    text: `{friend}から連絡が来た。\n「海面上昇のデータを集めている。\n政府も企業も動かない。\n自分たちで動くしかない」\n添付されていたスプレッドシートには、\n膨大な数字が並んでいた。`,
    showResources: true,
    choices: null,
    next: 'c2_s1_player_response'
  },

  c2_s1_hermit: {
    month: '22歳',
    title: 'ワタからの手紙',
    background: 'night-room',
    text: `{friend}から連絡が来た。\n「信頼できる人たちと、静かに暮らせる場所を探している。\n外の世界には、もう期待していない」\n写真が添付されていた。\n山の中の、古い民家だった。`,
    showResources: true,
    choices: null,
    next: 'c2_s1_player_response'
  },

  c2_s1_organizer: {
    month: '22歳',
    title: 'ワタからの手紙',
    background: 'night-room',
    text: `{friend}から連絡が来た。\n「環境活動のグループを立ち上げた。\nまだ小さいけど、仲間が集まってきている。\n一度、話を聞きに来ない？」\n文面は明るかった。\nでも、少し急いでいるように見えた。`,
    showResources: true,
    choices: null,
    next: 'c2_s1_player_response'
  },

  c2_s1_drifter: {
    month: '22歳',
    title: 'ワタからの手紙',
    background: 'night-room',
    text: `{friend}から久しぶりに連絡が来た。\n「最近、いろいろ考えている。\nうまく言えないけど、\nこのままじゃいけない気がして」\nそれだけだった。`,
    showResources: true,
    choices: null,
    next: 'c2_s1_player_response'
  },

  // ── ステージ1：主人公の翻訳 ──────────────────────────────

  c2_s1_player_response: {
    month: '22歳',
    title: 'どう動くか',
    background: 'night-room',
    text: `{friend}の言葉を、どう受け取るか。\nそして、自分は何をするか。`,
    showResources: true,
    choices: [
      {
        text: '応援する返事を書く',
        effects: { network: 1, risk: 0 },
        also: { trust: 1 },
        next: 'c2_s1_react_support'
      },
      {
        text: '現実的な方法を提案する',
        effects: { capital: 1, risk: 1 },
        also: { intelligence: 1 },
        next: 'c2_s1_react_translate'
      },
      {
        text: '直接会いに行く',
        effects: { network: 2, risk: 0 },
        also: { trust: 2, stamina: -1 },
        next: 'c2_s1_react_visit'
      },
      {
        text: 'しばらく様子を見る',
        effects: { capital: 1, risk: 0 },
        also: { depth: 1 },
        next: 'c2_s1_react_watch'
      },
    ]
  },

  c2_s1_react_support: {
    month: '22歳',
    title: '',
    background: 'night-room',
    text: `返事を書いた。\n応援している、と。\n{friend}からすぐに返信が来た。\n「ありがとう。それだけで十分」\nその言葉が、少し重かった。`,
    choices: null,
    next: 'c2_s1_end'
  },

  c2_s1_react_translate: {
    month: '22歳',
    title: '',
    background: 'night-room',
    text: `具体的な方法をいくつか調べて送った。\n補助金の情報、NPOの立ち上げ方法。\n{friend}からの返信は短かった。\n「そういうことじゃないんだけどな」`,
    choices: null,
    next: 'c2_s1_end'
  },

  c2_s1_react_visit: {
    month: '22歳',
    title: '',
    background: 'evening-road',
    text: `直接会いに行った。\n{friend}は少し驚いた顔をして、\nそれから笑った。\n久しぶりに、本物の笑顔を見た気がした。`,
    choices: null,
    next: 'c2_s1_end'
  },

  c2_s1_react_watch: {
    month: '22歳',
    title: '',
    background: 'night-room',
    text: `返事は書かなかった。\nもう少し状況を見てから、と思った。\n数日後、{friend}からまた連絡が来た。\n「元気？」\nそれだけだった。`,
    choices: null,
    next: 'c2_s1_end'
  },

  c2_s1_end: {
    month: '22歳',
    title: 'ステージ1終わり',
    background: 'night-room',
    text: `{friend}の動きは、まだ始まったばかりだった。\n{player}も、自分の道を歩き続けた。`,
    showResources: true,
    choices: null,
    next: 'c2_chapter_end'
  },

  c2_chapter_end: {
    month: '',
    title: '',
    background: 'summer-sky',
    text: `── 2章 ステージ1、ここまで ──`,
    choices: null,
    next: 'deep_current'
  },
};

// ── 3章イベント ──────────────────────────────────────────────

const CH3_EVENTS = {

  // ── サバイバルフェーズ（1ターン＝1日） ──────────────────────

  c3_opening: {
    setPhase: 'survival',
    month: 'サバイバル',
    title: '岩礁',
    background: 'rainy-evening',
    text: `目が覚めたら、岩礁の上にいた。\n{friend}が隣にいた。\n海が広がっていた。\n\n水も食料も、ほとんどない。\nここで生き延びるしかなかった。`,
    choices: null,
    next: 'action_turn'
  },

  // ── イソラ漂着 ─────────────────────────────────────────────

  c3_isora_arrives: {
    month: 'サバイバル',
    title: '漂着者',
    speaker: null,
    background: 'rainy-evening',
    text: `小舟が流れ着いた。\n乗っていたのは、無口な中年の男だった。\n釣り竿を持っていた。\n\n男は岩礁を見回してから、ぽつりと言った。\n「貝があるな」\n「餌になる」`,
    choices: null,
    next: 'c3_isora_intro'
  },

  c3_isora_intro: {
    month: 'サバイバル',
    title: '',
    speaker: 'イソラ',
    background: 'rainy-evening',
    text: `「イソラだ。よろしくな」\nそれだけだった。\n名前以外のことは、何も言わなかった。`,
    choices: null,
    next: 'action_turn'
  },

  // ── フェーズ移行：ワタの宣言①（個人→コミュニティの長） ──

  c3_wata_declare1: {
    setPhase: 'survival',
    month: 'サバイバル・転機',
    title: 'ワタの宣言',
    speaker: '{friend}',
    background: 'night-room',
    text: `「ねえ、{player}」\n「ぼく、みんなをまとめたいんだ」\n「このままバラバラだと、きっとまた誰かが消えちゃう」\n{friend}の目は、いつになく真剣だった。`,
    showResources: true,
    choices: [
      {
        text: '「いいと思う。やってみよう」',
        effects: { trust: 1, anxiety: -1 },
        also: { seeds: { leadership: 3 } },
        next: 'c3_stability_start'
      },
      {
        text: '「焦らなくていい。まだ早い」',
        effects: { distance: 1, anxiety: 1 },
        also: { seeds: { leadership: 2 } },
        next: 'c3_stability_start'
      },
      {
        text: '「ぼくも手伝う。一緒にやろう」',
        effects: { trust: 2, distance: -1 },
        also: { seeds: { leadership: 3 } },
        next: 'c3_stability_start'
      },
    ]
  },

  // ── 安定フェーズ（1ターン＝1週間） ──────────────────────────

  c3_stability_start: {
    setPhase: 'stability',
    month: '安定',
    title: 'コミュニティ',
    background: 'school-grounds',
    text: `{friend}は、人をまとめる役割を引き受けた。\n生きるだけだった日々が、暮らしに変わっていく。\n1週間ごとに、考えることが増えてきた。`,
    showResources: true,
    choices: null,
    next: 'action_turn'
  },

  // ── フェーズ移行：ワタの宣言②（コミュニティの長→国王） ──

  c3_wata_declare2: {
    setPhase: 'stability',
    month: '安定・転機',
    title: 'ワタの宣言',
    speaker: '{friend}',
    background: 'night-room',
    text: `「{player}、ここを国にしよう」\n「ちゃんとした国。みんなが安心して暮らせる場所」\n{friend}の声は落ち着いていた。\nでもその奥に、まだあの不安が残っているのが分かった。`,
    showResources: true,
    choices: [
      {
        text: '「お前が決めたなら、ついていく」',
        effects: { trust: 2, distance: -1 },
        next: 'c3_development_start'
      },
      {
        text: '「国にする前に、確かめたいことがある」',
        effects: { anxiety: -1, margin: 1 },
        next: 'c3_development_start'
      },
      {
        text: '「本当に、それでいいのか？」',
        effects: { distance: 1, anxiety: 1 },
        next: 'c3_development_start'
      },
    ]
  },

  // ── 発展フェーズ（1ターン＝1ヶ月） ─────────────────────────
  // ※発展フェーズとカウントダウンは本来3周目から解放（骨格では仮通し）

  c3_development_start: {
    setPhase: 'development',
    month: '発展',
    title: '国のはじまり',
    background: 'summer-sky',
    text: `{friend}は、王になった。\nあの{friend}が、人々の前に立っている。\n資源は資金に変わり、外の世界とのやりとりも始まった。\n（世界崩壊まで　○年○ヶ月）`,
    showResources: true,
    choices: null,
    next: 'action_turn'
  },

  c3_dev_choice: {
    month: '発展・数ヶ月',
    title: 'どんな国にするか',
    background: 'summer-sky',
    text: `国の方向を決める時が来た。\n{friend}は{player}の意見を聞きたがっている。`,
    showResources: true,
    choices: [
      {
        text: '外の島々とつながりを広げる',
        effects: { diplomacy: 2, record: 1 },
        next: 'c3_dev_react'
      },
      {
        text: '自分たちの暮らしを深める',
        effects: { capital: 2, margin: 1 },
        next: 'c3_dev_react'
      },
      {
        text: '起きたことを記録に残していく',
        effects: { record: 2, margin: 1 },
        next: 'c3_dev_react'
      },
    ]
  },

  c3_dev_react: {
    month: '発展・数ヶ月',
    title: '',
    background: 'summer-sky',
    text: `国は、少しずつ色を持ち始めた。\nそれが何色なのかは、まだ{player}にも分からない。`,
    showResources: true,
    choices: null,
    next: 'c3_chapter_end'
  },

  c3_chapter_end: {
    month: '',
    title: '',
    background: 'summer-sky',
    text: `── 3章 骨格、ここまで ──\n\n（エンディング分岐は今後実装）`,
    choices: null,
    next: 'deep_current'
  },

  // ── 1周目固有エンド ───────────────────────────────────────

  c3_clam_depleted: {
    month: 'サバイバル',
    title: '貝が尽きた',
    speaker: null,
    background: 'rainy-evening',
    text: `岩礁の貝が、完全になくなった。\n拾えるものは何もない。\n\nイソラは黙って周りを見回してから、言った。\n「まだやれる」`,
    choices: null,
    next: 'c3_isora_ingenuity'
  },

  c3_isora_ingenuity: {
    month: 'サバイバル',
    title: 'イソラの工夫',
    speaker: null,
    background: 'rainy-evening',
    text: `イソラは廃材を拾い集め、魚の内臓を使って仕掛けを作り始めた。\n不格好だったが、それでも魚は釣れた。\nしばらくは凌げそうだった。\n\nそのとき、イソラが{player}を見た。\n「何か光るもの、持ってないか」`,
    choices: null,
    next: 'c3_item_choice_diary'
  },

  c3_item_choice_diary: {
    month: 'サバイバル',
    title: '2章の日記',
    speaker: null,
    background: 'rainy-evening',
    text: `2章の日記が、鞄の底に残っていた。\n{friend}への手紙の下書き。送れなかった言葉たち。\n\nイソラが言う。\n「破って、内臓と混ぜれば撒き餌になる」`,
    choices: [
      {
        text: '日記を破って渡す',
        effects: {},
        also: { seeds: { memoryBait: 1 } },
        next: 'c3_item_diary_yes'
      },
      {
        text: '渡さない',
        effects: {},
        next: 'c3_item_choice_keychain'
      },
    ]
  },

  c3_item_diary_yes: {
    month: 'サバイバル',
    title: '',
    speaker: null,
    background: 'rainy-evening',
    text: `ページを破った。\n文字が滲んで、読めなくなった。\nイソラは無言で受け取り、内臓と混ぜ始めた。\n\n『記憶の撒き餌』`,
    choices: null,
    next: 'c3_item_choice_keychain'
  },

  c3_item_choice_keychain: {
    month: 'サバイバル',
    title: '{friend}のキーホルダー',
    speaker: null,
    background: 'rainy-evening',
    text: `{friend}からもらったキーホルダーがあった。\nずっと持ち歩いていたものだ。\n\nイソラが言う。\n「反射板になる。疑似餌に使えるかもしれない」`,
    choices: [
      {
        text: 'キーホルダーを使わせてほしいと頼む',
        effects: {},
        next: 'c3_keychain_branch'
      },
      {
        text: '渡さない',
        effects: {},
        next: 'c3_line_breaks'
      },
    ]
  },

  // 手伝ったか否かで分岐
  c3_keychain_branch: {
    type: 'c3flag_branch',
    flag: 'helpedSpeech',
    ifTrue: 'c3_keychain_help',
    ifFalse: 'c3_keychain_skip'
  },

  // 手伝った周：ワタが快く受け入れる→餌∞
  c3_keychain_help: {
    month: 'サバイバル',
    title: '',
    speaker: '{friend}',
    background: 'rainy-evening',
    text: `{friend}は、{player}の手元を見て、軽く笑った。\n「こんなのただの物だよ。迷うことない」\n「ぼくたちの関係は、こんなことで変わらないから」\n\nキーホルダーを、疑似餌の仕掛けに組み込んだ。\n光が、海の中で揺れた。\n\nこれで、餌を気にせず釣りができる。`,
    choices: null,
    next: 'c3_set_lure_infinite'
  },

  c3_set_lure_infinite: {
    month: 'サバイバル',
    title: '',
    speaker: null,
    background: 'rainy-evening',
    text: `『光る仕掛け』\n\nしばらくは、これで魚が獲れる。`,
    choices: null,
    next: 'c3_line_breaks'
  },

  // 手伝わなかった周：ワタが拒絶し、海に投げる
  c3_keychain_skip: {
    month: 'サバイバル',
    title: '',
    speaker: '{friend}',
    background: 'rainy-evening',
    text: `キーホルダーを差し出すと、{friend}の表情が、ふっと変わった。\n「……{player}にとって、ぼくはそれくらいの存在だったんだ」\n\n{friend}はそれを奪い取ると、海に投げた。\n小さな影が、波間に消えた。\n\n疑似餌は、作れなかった。`,
    choices: null,
    next: 'c3_keychain_skip_silence'
  },

  c3_keychain_skip_silence: {
    month: 'サバイバル',
    title: '',
    speaker: null,
    background: 'rainy-evening',
    text: `二人は、何も言わなかった。\n\nイソラは、濡れた手をゆっくりと拭いて、\n糸を巻き取る手を、止めた。`,
    choices: null,
    next: 'c3_line_breaks'
  },

  c3_item_keychain_yes: {
    month: 'サバイバル',
    title: '',
    speaker: null,
    background: 'rainy-evening',
    text: `キーホルダーを外して渡した。\nイソラは仕掛けに組み込んだ。\n光が海面を揺れた。\n\n『光る仕掛け』`,
    choices: null,
    next: 'c3_line_breaks'
  },

  c3_line_breaks: {
    month: 'サバイバル',
    title: '糸が切れた',
    speaker: null,
    background: 'rainy-evening',
    text: `何度目かに、糸が切れた。\n替えの針もない。\nイソラは仕掛けを見つめてから、静かに置いた。\n\nもう、代わりになるものがなかった。`,
    choices: null,
    next: 'c3_last_talk'
  },

  c3_last_talk: {
    month: 'サバイバル',
    title: '漕ぎ出す前に',
    speaker: '{friend}',
    background: 'rainy-evening',
    text: `「大丈夫。絶対どこかに着く」\n{friend}はそう言った。\n根拠はなかった。でも、嘘をついている感じもなかった。\n\n{player}は何も言わなかった。\n覚悟、とも呼べないような何かが、静かに固まっていた。`,
    choices: null,
    next: 'c3_last_isora'
  },

  c3_last_isora: {
    month: 'サバイバル',
    title: '',
    speaker: 'イソラ',
    background: 'rainy-evening',
    text: `「一か八かだ」\nイソラは船を見た。\n「でも、これしかない」`,
    choices: null,
    next: 'c3_set_sail'
  },

  c3_set_sail: {
    month: 'サバイバル',
    title: '漕ぎ出す',
    speaker: null,
    background: 'rainy-evening',
    text: `三人で船に乗った。\n岩礁が遠ざかっていった。\n海は広かった。`,
    choices: null,
    next: 'c3_end_round1'
  },

  c3_end_round1: {
    month: '',
    title: '',
    background: 'night-room',
    text: `── 1周目、ここまで ──`,
    choices: null,
    next: 'deep_current'
  },
};
