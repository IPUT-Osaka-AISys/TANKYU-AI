# TANKYU-AI

## OpenHandsの使用方法

OpenHandsは、GitHubのIssueやPull Requestのコメントから呼び出すことができます。

### Issueコメントからの呼び出し

Issueのコメントで以下のようにメンションすることで、OpenHandsを起動できます。

```
@openhands-agent
[ここにタスクの内容を記述]
```

例:
```
@openhands-agent
このリポジトリのREADME.mdに、OpenHandsの使用方法を追記してください。
```

### Pull Requestコメントからの呼び出し

Pull Requestのコメントで以下のようにメンションすることで、OpenHandsを起動できます。

```
@openhands-agent
[ここにタスクの内容を記述]
```

例:
```
@openhands-agent
このPRの変更内容を確認し、問題があれば修正を提案してください。
```

OpenHandsは、コメントの内容を解析し、自動的にタスクを実行しようとします。
