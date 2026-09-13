// 二ツ星 (難易度 2)。出典: docs/question/s2_01〜s2_20
import type { Question } from "../types";

export const s2Questions: Question[] = [
  {
    "id": "s2_01",
    "type": "order",
    "difficulty": 2,
    "question": "287 期ハンター試験の試験官を、担当した試験の順に並べてください。",
    "items": [
      "サトツ",
      "メンチ",
      "リッポー",
      "ネテロ"
    ],
    "explanation": "一次サトツ、二次メンチ (とブハラ)、三次リッポー、最終ネテロ。"
  },
  {
    "id": "s2_02",
    "type": "choice",
    "difficulty": 2,
    "question": "幻影旅団ノブナガの念系統はどれですか。",
    "choices": [
      "強化系",
      "変化系",
      "操作系",
      "具現化系"
    ],
    "answer": 0,
    "explanation": "居合の使い手で強化系。"
  },
  {
    "id": "s2_03",
    "type": "multi",
    "difficulty": 2,
    "kind": "仕分け",
    "question": "次の人物を「ゾルディック家の家族」と「家族ではない」に仕分けてください。",
    "options": [
      "シルバ",
      "ゼノ",
      "キキョウ",
      "カルト",
      "ゴトー",
      "ヒソカ"
    ],
    "answers": [
      0,
      1,
      2,
      3
    ],
    "bins": [
      "ゾルディック家の家族",
      "家族ではない"
    ],
    "explanation": "ゴトーはゾルディック家の執事。"
  },
  {
    "id": "s2_04",
    "type": "choice",
    "difficulty": 2,
    "question": "ヨークシン編でクラピカが対峙し、殺害した旅団員は誰ですか。",
    "choices": [
      "ウボォーギン",
      "パクノダ",
      "フランクリン",
      "ノブナガ"
    ],
    "answer": 0,
    "explanation": "パクノダはクラピカの制約に従ったことで死亡したが、殺害したのはウボォーギン。"
  },
  {
    "id": "s2_05",
    "type": "order",
    "difficulty": 2,
    "question": "次の編を、物語の順に並べてください。",
    "items": [
      "ハンター試験編",
      "ゾルディック家編",
      "天空闘技場編",
      "ヨークシンシティ編",
      "グリードアイランド編",
      "キメラ＝アント編"
    ],
    "explanation": ""
  },
  {
    "id": "s2_06",
    "type": "tf",
    "difficulty": 2,
    "question": "ネオン＝ノストラードの念能力「天使の自動筆記」は占いの能力である。",
    "answer": true,
    "explanation": "対象の未来を詩の形で書き出す。"
  },
  {
    "id": "s2_07",
    "type": "choice",
    "difficulty": 2,
    "question": "グリードアイランドでゴンたちと同盟を組んだ、ゴリラの念獣を使う男は誰ですか。",
    "choices": [
      "ゴレイヌ",
      "ツェズゲラ",
      "ゲンスルー",
      "ヒソカ"
    ],
    "answer": 0,
    "explanation": "白のゴリラと黒のゴリラを使う。"
  },
  {
    "id": "s2_08",
    "type": "choice",
    "difficulty": 2,
    "question": "グリードアイランドの「爆弾魔 (ボマー)」の正体は誰ですか。",
    "choices": [
      "ゲンスルー",
      "サブ",
      "バラ",
      "ツェズゲラ"
    ],
    "answer": 0,
    "explanation": "サブとバラはゲンスルーの仲間。"
  },
  {
    "id": "s2_09",
    "type": "tf",
    "difficulty": 2,
    "question": "キメラ＝アントの王直属護衛軍は 3 人である。",
    "answer": true,
    "explanation": "ネフェルピトー、シャウアプフ、モントゥトゥユピー。"
  },
  {
    "id": "s2_10",
    "type": "choice",
    "difficulty": 2,
    "question": "ネフェルピトーの念能力はどれですか。",
    "choices": [
      "玩具修理者 (ドクターブライス)",
      "紫煙機兵隊 (ディープパープル)",
      "天上不知唯我独損 (ハコワレ)",
      "神の不在証明 (パーフェクトプラン)"
    ],
    "answer": 0,
    "explanation": "紫煙機兵隊はモラウ、ハコワレはナックル、神の不在証明はメレオロン。"
  },
  {
    "id": "s2_11",
    "type": "tf",
    "difficulty": 2,
    "question": "会長選挙編の開始時点で、パリストンはハンター協会の副会長だった。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": "s2_12",
    "type": "choice",
    "difficulty": 2,
    "question": "カイトの念能力の名前はどれですか。",
    "choices": [
      "気狂いピエロ (クレイジースロット)",
      "百式観音",
      "盗賊の極意 (スキルハンター)",
      "絶対時間 (エンペラータイム)"
    ],
    "answer": 0,
    "explanation": "出た数字に応じた武器を具現化する。"
  },
  {
    "id": "s2_13",
    "type": "multi",
    "difficulty": 2,
    "kind": "仕分け",
    "question": "次の人物を、287 期ハンター試験に「合格した」と「合格していない」に仕分けてください。",
    "options": [
      "ゴン",
      "クラピカ",
      "レオリオ",
      "ヒソカ",
      "キルア",
      "トンパ"
    ],
    "answers": [
      0,
      1,
      2,
      3
    ],
    "bins": [
      "合格した",
      "合格していない"
    ],
    "explanation": "キルアは最終試験でボドロを殺害し失格。トンパは四次試験で脱落。"
  },
  {
    "id": "s2_14",
    "type": "order",
    "difficulty": 2,
    "question": "グリードアイランド編の出来事を、起きた順に並べてください。",
    "items": [
      "ビスケと出会う",
      "レイザーとドッジボールで戦う",
      "ゲンスルーを倒す",
      "カイトと再会する"
    ],
    "explanation": ""
  },
  {
    "id": "s2_15",
    "type": "choice",
    "difficulty": 2,
    "question": "ナックルの念能力はどれですか。",
    "choices": [
      "天上不知唯我独損 (ハコワレ)",
      "神の不在証明 (パーフェクトプラン)",
      "謝債発行機 (レンタルポッド)",
      "卵男 (ミサイルマン)"
    ],
    "answer": 0,
    "explanation": "神の不在証明はメレオロン、謝債発行機はレオル、卵男はウェルフィン。"
  },
  {
    "id": "s2_16",
    "type": "tf",
    "difficulty": 2,
    "question": "モラウは煙を操る念能力を使う。",
    "answer": true,
    "explanation": "紫煙機兵隊 (ディープパープル) など。"
  },
  {
    "id": "s2_17",
    "type": "choice",
    "difficulty": 2,
    "question": "ネテロの念能力の名前はどれですか。",
    "choices": [
      "百式観音",
      "千手観音",
      "不動明王",
      "阿修羅"
    ],
    "answer": 0,
    "explanation": "感謝の正拳突きの果てに得た能力。"
  },
  {
    "id": "s2_18",
    "type": "tf",
    "difficulty": 2,
    "question": "メルエムは軍儀でコムギに一度も勝てなかった。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": "s2_19",
    "type": "choice",
    "difficulty": 2,
    "question": "第 13 代会長選挙で当選したのは誰ですか。",
    "choices": [
      "パリストン",
      "チードル",
      "ジン",
      "レオリオ"
    ],
    "answer": 0,
    "explanation": "パリストンは当選直後に辞任し、チードルが会長になった。"
  },
  {
    "id": "s2_20",
    "type": "choice",
    "difficulty": 2,
    "question": "カキン帝国が暗黒大陸へ向けて出航させた船の名前はどれですか。",
    "choices": [
      "ブラックホエール号",
      "ホワイトホエール号",
      "ノアの箱舟号",
      "カキン号"
    ],
    "answer": 0,
    "explanation": "B・W 号とも呼ばれる。"
  },
];
