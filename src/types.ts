/** 1〜3 は一ツ星〜三ツ星、4 はおまめ専用 */
export type Difficulty = 1 | 2 | 3 | 4;

export const DIFFICULTIES: readonly Difficulty[] = [1, 2, 3, 4];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "一ツ星",
  2: "二ツ星",
  3: "三ツ星",
  4: "おまめ専用",
};

export const QUESTIONS_PER_GAME = 10;

interface QuestionBase {
  id: string;
  difficulty: Difficulty;
  /** 出題画面に出す形式名の補足 (例: 「誤り探し」)。省略時は形式の既定名 */
  kind?: string;
  question: string;
  explanation: string;
}

export interface TfQuestion extends QuestionBase {
  type: "tf";
  answer: boolean;
}

export interface ChoiceQuestion extends QuestionBase {
  type: "choice";
  /** 本文 (省略可)。`[語]` で囲んだ部分は破線の下線で強調表示する */
  text?: string;
  choices: string[];
  /** 0 始まり (シャッフル前の位置) */
  answer: number;
  /** false なら選択肢を並べ替えない (記号で答える問題など)。既定 true */
  shuffle?: boolean;
}

export interface OrderQuestion extends QuestionBase {
  type: "order";
  /** 正しい順に並んだ要素 */
  items: string[];
}

/**
 * 仕分け (複数選択)。各選択肢を「対象」「対象外」の箱にドラッグして仕分ける。
 * pick 未指定: 対象の箱の集合が answers と完全一致で正解 (全選択肢を仕分ける必要あり)。
 * pick 指定: 対象の箱にちょうど pick 個入れ、全てが answers に含まれれば正解 (残りは未分類でよい)。
 */
export interface MultiQuestion extends QuestionBase {
  type: "multi";
  options: string[];
  /** 対象の箱に入るべき選択肢の添字 */
  answers: number[];
  pick?: number;
  /** 箱の名前 [対象, 対象外]。既定は ["該当する", "該当しない"] */
  bins?: [string, string];
}

export interface FillRow {
  /** 空欄名や左項目 (例: 「①」「親指 (癒す鎖)」) */
  label: string;
  /** 正解。pool があれば pool に、なければ options に含まれる文字列 */
  answer: string;
  /** この行専用の候補 (pool がない場合に必須) */
  options?: string[];
}

/**
 * 穴埋め・組み合わせ。
 * pool あり: 共通の候補を解答欄へドラッグ (または解答欄タップ → 候補タップ)。使った候補は再利用不可
 * pool なし: 解答欄をタップしてその行の候補から選ぶ
 */
export interface FillQuestion extends QuestionBase {
  type: "fill";
  /** 本文 (空欄を含む文章や表)。省略可 */
  text?: string;
  pool?: string[];
  rows: FillRow[];
}

/**
 * 仕分け＋並べ替え。各選択肢を「対象 (順序あり)」「対象外」の箱に仕分け、対象の箱では順番も答える。
 * 対象の箱の並びが ordered と完全一致し、それ以外がすべて対象外の箱にあれば正解。
 */
export interface PickOrderQuestion extends QuestionBase {
  type: "pickorder";
  options: string[];
  /** 対象の箱に入るべき選択肢の添字を、正しい順に並べたもの */
  ordered: number[];
  /** 箱の名前 [対象 (順序あり), 対象外] */
  bins: [string, string];
}

export type Question =
  | TfQuestion
  | ChoiceQuestion
  | OrderQuestion
  | MultiQuestion
  | FillQuestion
  | PickOrderQuestion;

export const TYPE_LABELS: Record<Question["type"], string> = {
  tf: "マルバツ",
  choice: "4択",
  order: "並べ替え",
  multi: "仕分け",
  fill: "穴埋め・組み合わせ",
  pickorder: "仕分け＋並べ替え",
};

/** 1 問の回答結果 */
export interface AnswerResult {
  question: Question;
  correct: boolean;
  /** 表示用: プレイヤーの回答 */
  userText: string;
  /** 表示用: 正解 */
  correctText: string;
}

export type Rng = () => number;
