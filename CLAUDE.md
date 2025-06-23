# CLAUDE.md

## 言語設定 / Language Settings

```json
{
  "language": "ja_JP",
  "always_use_japanese": true
}
```

すべてのコミュニケーションは必ず日本語で行います。英語での返答や指示は受け付けません。

All communication must be conducted in Japanese. Responses or instructions in English will not be accepted.

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

1. **コード品質** - コードレビューの際は、可読性、保守性、パフォーマンスに注意します。
2. **ドキュメント** - 新機能や重要な変更には必ずドキュメントを更新します。
3. **セキュリティ** - セキュリティに関する問題は最優先で対処します。
4. **テスト** - 新機能や修正には必ず単体テストを追加します。
5. **コミットメッセージ** - コミットメッセージは明確で、変更内容を簡潔に説明します。

このCLAUDE.mdファイルに従うことで、プロジェクトの一貫性と品質を維持します。