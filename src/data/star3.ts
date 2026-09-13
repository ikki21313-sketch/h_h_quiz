// 三ツ星 (難易度 3)。出典: docs/question/s3_01〜s3_20
import type { Question } from "../types";

export const s3Questions: Question[] = [
  {
    "id": "s3_01",
    "type": "choice",
    "difficulty": 3,
    "question": "ナックルの「天上不知唯我独損 (ハコワレ)」の利息は、10 秒ごとに何 % ですか。",
    "choices": [
      "5%",
      "10%",
      "20%",
      "50%"
    ],
    "answer": 1,
    "explanation": "10 秒ごとに 10% の複利。"
  },
  {
    "id": "s3_02",
    "type": "choice",
    "difficulty": 3,
    "question": "グリードアイランドの指定ポケットカードは全部で何枚ですか。",
    "choices": [
      "50 枚",
      "99 枚",
      "100 枚",
      "200 枚"
    ],
    "answer": 2,
    "explanation": "No.000〜099 の 100 枚。"
  },
  {
    "id": "s3_03",
    "type": "tf",
    "difficulty": 3,
    "question": "グリードアイランドのバインダーのフリーポケットは 45 枚である。",
    "answer": true,
    "explanation": "指定ポケット 100 枚とフリーポケット 45 枚。"
  },
  {
    "id": "s3_04",
    "type": "choice",
    "difficulty": 3,
    "question": "天空闘技場は何階建てですか。",
    "choices": [
      "200 階",
      "220 階",
      "251 階",
      "300 階"
    ],
    "answer": 2,
    "explanation": "最上階の 251 階でバトルオリンピアが開かれる。"
  },
  {
    "id": "s3_05",
    "type": "choice",
    "difficulty": 3,
    "question": "ゾルディック家の「試しの門」の 1 の扉は、片側何トンですか。",
    "choices": [
      "1 トン",
      "2 トン",
      "4 トン",
      "8 トン"
    ],
    "answer": 1,
    "explanation": "片側 2 トン、両側で 4 トン。扉が増えるごとに倍になる。"
  },
  {
    "id": "s3_06",
    "type": "fill",
    "difficulty": 3,
    "kind": "マッチング",
    "question": "幻影旅団の団員番号に対応する団員を選んでください。候補には余りがあります。",
    "pool": [
      "クロロ",
      "ノブナガ",
      "マチ",
      "シズク",
      "ウボォーギン",
      "フェイタン",
      "パクノダ"
    ],
    "rows": [
      {
        "label": "0 番",
        "answer": "クロロ"
      },
      {
        "label": "1 番",
        "answer": "ノブナガ"
      },
      {
        "label": "3 番",
        "answer": "マチ"
      },
      {
        "label": "8 番",
        "answer": "シズク"
      },
      {
        "label": "11 番",
        "answer": "ウボォーギン"
      }
    ],
    "explanation": "フェイタンは 2 番、パクノダは 9 番。"
  },
  {
    "id": "s3_07",
    "type": "order",
    "difficulty": 3,
    "question": "287 期ハンター試験の内容を、行われた順に並べてください。",
    "items": [
      "長距離走 (ヌメーレ湿原)",
      "料理 (ビスカ森林公園)",
      "トリックタワー",
      "ゼビル島でのプレート争奪",
      "最終試験のトーナメント"
    ],
    "explanation": ""
  },
  {
    "id": "s3_08",
    "type": "choice",
    "difficulty": 3,
    "question": "287 期ハンター試験の最終試験でキルアが殺した受験者は誰ですか。",
    "choices": [
      "ボドロ",
      "ポックル",
      "ハンゾー",
      "ギタラクル"
    ],
    "answer": 0,
    "explanation": "イルミに操られた状態でボドロを殺害し、失格となった。"
  },
  {
    "id": "s3_09",
    "type": "choice",
    "difficulty": 3,
    "question": "287 期ハンター試験でのキルアの受験番号は何番ですか。",
    "choices": [
      "44",
      "99",
      "301",
      "405"
    ],
    "answer": 1,
    "explanation": "44 はヒソカ、301 はギタラクル (イルミ)、405 はゴン。"
  },
  {
    "id": "s3_10",
    "type": "tf",
    "difficulty": 3,
    "question": "287 期ハンター試験でのヒソカの受験番号は 44 番である。",
    "answer": true,
    "explanation": ""
  },
  {
    "id": "s3_11",
    "type": "multi",
    "difficulty": 3,
    "kind": "仕分け",
    "question": "次のキメラ＝アントを「王直属護衛軍」と「師団長」に仕分けてください。",
    "options": [
      "ネフェルピトー",
      "シャウアプフ",
      "モントゥトゥユピー",
      "コルト",
      "ザザン",
      "レオル",
      "ヂートゥ"
    ],
    "answers": [
      0,
      1,
      2
    ],
    "bins": [
      "王直属護衛軍",
      "師団長"
    ],
    "explanation": ""
  },
  {
    "id": "s3_12",
    "type": "fill",
    "difficulty": 3,
    "kind": "マッチング",
    "question": "念の六性系統と、その系統に属する人物を対応させてください。",
    "pool": [
      "ゴン",
      "キルア",
      "クラピカ",
      "レオリオ",
      "シャルナーク",
      "クロロ"
    ],
    "rows": [
      {
        "label": "強化系",
        "answer": "ゴン"
      },
      {
        "label": "変化系",
        "answer": "キルア"
      },
      {
        "label": "具現化系",
        "answer": "クラピカ"
      },
      {
        "label": "放出系",
        "answer": "レオリオ"
      },
      {
        "label": "操作系",
        "answer": "シャルナーク"
      },
      {
        "label": "特質系",
        "answer": "クロロ"
      }
    ],
    "explanation": "クラピカは緋の眼の状態では特質系になる。"
  },
  {
    "id": "s3_13",
    "type": "choice",
    "difficulty": 3,
    "question": "第 13 代会長選挙では、投票率が何 % 未満だと投票が無効になりますか。",
    "choices": [
      "50%",
      "80%",
      "95%",
      "100%"
    ],
    "answer": 2,
    "explanation": "ネテロの遺言による選挙規則の一つ。"
  },
  {
    "id": "s3_14",
    "type": "choice",
    "difficulty": 3,
    "question": "念の応用技「流」の説明として正しいものはどれですか。",
    "choices": [
      "体の部位ごとに纏うオーラの量を移動させる",
      "目にオーラを集中させて隠されたものを見る",
      "練で増やしたオーラを纏の状態で維持する",
      "オーラを広げて周囲の状況を感知する"
    ],
    "answer": 0,
    "explanation": "目に集中は「凝」、維持は「堅」、周囲の感知は「円」。"
  },
  {
    "id": "s3_15",
    "type": "choice",
    "difficulty": 3,
    "question": "ネテロがメルエムとの戦いで使った爆弾の名前はどれですか。",
    "choices": [
      "貧者の薔薇 (ミニチュアローズ)",
      "富者の薔薇",
      "黒い薔薇",
      "王の薔薇"
    ],
    "answer": 0,
    "explanation": "ネテロの体に仕込まれていた小型爆弾。"
  },
  {
    "id": "s3_16",
    "type": "choice",
    "difficulty": 3,
    "question": "暗黒大陸編で王位継承戦に参加するカキン帝国の王子は何人ですか。",
    "choices": [
      "8 人",
      "12 人",
      "14 人",
      "16 人"
    ],
    "answer": 2,
    "explanation": "第 1 王子ベンジャミンから第 14 王子ワブルまで。"
  },
  {
    "id": "s3_17",
    "type": "fill",
    "difficulty": 3,
    "kind": "マッチング",
    "question": "暗黒大陸の五大厄災について、災いの内容と名前を対応させてください。",
    "pool": [
      "ガス生命体アイ",
      "兵器ブリオン",
      "双尾の蛇ヘルベル",
      "不死の病ゾバエ病",
      "人飼いの獣パプ"
    ],
    "rows": [
      { "label": "欲望の共依存", "answer": "ガス生命体アイ" },
      { "label": "謎の古代遺跡を守る正体不明の球体", "answer": "兵器ブリオン" },
      { "label": "殺意を伝染させる魔物", "answer": "双尾の蛇ヘルベル" },
      { "label": "希望を騙る底なしの絶望", "answer": "不死の病ゾバエ病" },
      { "label": "快楽と命の等価交換", "answer": "人飼いの獣パプ" }
    ],
    "explanation": ""
  },
  {
    "id": "s3_18",
    "type": "order",
    "difficulty": 3,
    "question": "キメラ＝アント編の出来事を、起きた順に並べてください。",
    "items": [
      "カイトがネフェルピトーに敗れる",
      "ゴンとキルアがナックル・シュートと修行する",
      "宮殿への突入が始まる",
      "ネテロがメルエムと戦う",
      "メルエムが死亡する"
    ],
    "explanation": ""
  },
  {
    "id": "s3_19",
    "type": "choice",
    "difficulty": 3,
    "question": "第 13 代会長選挙の最終投票で、パリストンと争ったのは誰ですか。",
    "choices": [
      "チードル",
      "ミザイストム",
      "ジン",
      "レオリオ"
    ],
    "answer": 3,
    "explanation": ""
  },
  {
    "id": "s3_20",
    "type": "tf",
    "difficulty": 3,
    "question": "ゲンスルーの「一握りの火薬 (リトルフラワー)」は、相手に触れて爆弾を仕掛ける能力である。",
    "answer": false,
    "explanation": "触れて爆弾を仕掛けるのは「命の音 (カウントダウン)」。一握りの火薬は手のひらで小さな爆発を起こす能力。"
  },
];
