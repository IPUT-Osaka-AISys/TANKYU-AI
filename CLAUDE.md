# CLAUDE.md

## 概要

このファイルは研究テーマ探索AIシステムプロジェクトにおけるClaude Code Agent用の設定・指示ファイルです。すべての開発作業において本ファイルの内容を厳格に遵守してください。

## 言語設定 / Language Settings

```json
{
  "language": "ja_JP",
  "always_use_japanese": true
}
```

**すべてのコミュニケーションは必ず日本語で行います。英語での返答や指示は受け付けません。**

All communication must be conducted in Japanese. Responses or instructions in English will not be accepted.

## プロジェクトルールの遵守

### docs/ディレクトリの内容遵守

- **docs/ディレクトリ内の内容を必ずよく読み、その内容に厳格に従うこと**
- 主要なドキュメント：
  - `docs/guideline.md`: 開発ガイドライン
  - `docs/specification.md`: ソフトウェア要求仕様書
- **docs/の内容に反した対応が必要な場合は、事前に指示を仰ぎ、許可された場合のみdocs/の内容を修正すること**

### プロジェクト固有の制約

- **学習・研究目的での利用に限定**
- **CiNii API の利用制限に従う**（1日あたりのリクエスト数制限等）
- **AI API の利用コストを考慮した処理回数の制限**
- **著作権法に従った論文情報の取り扱い**
- **個人情報保護法の遵守**

## 推奨設定 / Recommended Settings

```json
{
  "code_style": {
    "indent": 2,
    "quote_style": "single",
    "semicolons": true,
    "trailing_commas": true
  },
  "git": {
    "commit_message_style": "conventional",
    "always_sign_commits": false
  },
  "documentation": {
    "jsdoc_style": true,
    "readme_updates": true
  },
  "testing": {
    "unit_tests_required": true,
    "coverage_threshold": 80
  },
  "workflow": {
    "auto_format_on_commit": true,
    "auto_test_on_pr": true
  }
}
```

## その他の推奨事項 / Other Recommendations

### 開発時の注意事項

- **既存のコードスタイルに合わせること**
- **適切な日本語コメントを記述すること**
- **学習目的であることを考慮し、理解しやすいコードを心がけること**
- **各分野のディレクトリ構造を尊重すること**
- **学習の進捗や課題の整理を考慮したファイル命名を行うこと**

### 質問・確認事項

不明点や判断に迷う場合は：

1. まず`docs/`ディレクトリの内容を再確認する
2. それでも不明な場合は必ず日本語で質問・確認を行う
3. 推測での実装は避け、明確な指示を得てから実装する

このCLAUDE.mdファイルとdocs/ディレクトリの内容に従うことで、プロジェクトの一貫性と品質を維持します。