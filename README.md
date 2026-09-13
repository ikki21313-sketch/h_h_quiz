# ハンターハンタークイズ

HUNTER×HUNTER の非公式・非営利のファンメイドクイズゲームです。GitHub Pages で公開します。

- 難易度: 一ツ星 / 二ツ星 / 三ツ星 / おまめ専用
- 出題形式: マルバツ / 4択 / 並べ替え / 複数選択 / 穴埋め・組み合わせ (1 プレイ 10 問、形式混在)
- 記録はブラウザの localStorage に難易度別の最高正解数のみ保存

## 開発

```sh
npm install
npm run dev         # http://localhost:5173/h_h_quiz/
npm test
npm run build
```

問題は `docs/question/` に 1 問 1 ファイルの Markdown で書き、Claude に依頼して `src/data/` の
TypeScript データへ実装します。書き方は `docs/question/README.md`、設計は `DESIGN.md` を参照してください。
`npm test` でデータの整合性 (正解が候補に含まれるか等) を検証します。

## 免責

本サイトは非公式のファンプロジェクトであり、集英社・冨樫義博先生・その他権利者とは一切関係ありません。
公式の画像や本文の引用は使用していません。
権利上の問題がある場合は GitHub の Issue からご連絡ください。速やかに対応します。
